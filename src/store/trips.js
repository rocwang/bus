import { combineLatest, merge, interval, of } from "rxjs";
import {
  switchMap,
  map,
  startWith,
  pluck,
  shareReplay,
  distinctUntilChanged
} from "rxjs/operators";
import { getVehiclePositions } from "../api/gtfsRealtime";
import {
  getTripsByStopAndTrip,
  getTripsByStop,
  getTripsByStopAndRoute,
  getShapesByTrips
} from "../api/gtfs";
import { getNexTripsByStopRouteItems } from "../api/gtfs";
import { favourites$ } from "./favourites";
import {
  actionViewFavourites$,
  actionViewRoute$,
  actionViewTrip$,
  actionViewStop$
} from "./actions";
import * as R from "ramda";

export const trips$ = merge(
  actionViewFavourites$.pipe(map(() => ({ type: "viewFavourites" }))),
  actionViewTrip$.pipe(map(payload => ({ type: "viewTrip", ...payload }))),
  actionViewRoute$.pipe(map(payload => ({ type: "viewRoute", ...payload }))),
  actionViewStop$.pipe(map(stopCode => ({ type: "viewStop", stopCode })))
).pipe(
  switchMap(action => {
    switch (action.type) {
      case "viewFavourites":
        return favourites$.pipe(switchMap(getNexTripsByStopRouteItems));
      case "viewTrip":
        return getTripsByStopAndTrip(action.stopCode, action.tripId);
      case "viewRoute":
        return getTripsByStopAndRoute(action.stopCode, action.routeShortName);
      case "viewStop":
        return getTripsByStop(action.stopCode);
      default:
        return of([]);
    }
  }),
  startWith([]),
  shareReplay(1)
);

export const shapes$ = trips$.pipe(
  map(R.pluck("trip_id")),
  switchMap(getShapesByTrips),
  startWith([]),
  shareReplay(1)
);

export const vehicles$ = combineLatest([
  trips$,
  interval(10000).pipe(startWith(-1))
]).pipe(
  map(R.pipe(R.head, R.pluck("realtime_trip_id"))),
  switchMap(getVehiclePositions),
  pluck("entity"),
  map(
    R.pipe(
      R.pluck("vehicle"),
      R.uniqBy(R.pipe(R.prop("vehicle"), R.prop("id")))
    )
  ),
  startWith([]),
  shareReplay(1)
);

export const tripsWithVehicles$ = combineLatest([trips$, vehicles$]).pipe(
  map(([trips, vehicles]) =>
    trips.map(trip => ({
      ...trip,
      vehicle: vehicles.find(
        R.pipe(R.prop("trip"), R.prop("trip_id"), R.equals(trip.trip_id))
      )
    }))
  ),
  startWith([]),
  shareReplay(1)
);

export const favouritesWithTrips$ = combineLatest([
  favourites$,
  tripsWithVehicles$
]).pipe(
  map(([favourites, tripsWithVehicles]) =>
    favourites.map(fav => ({
      ...fav,
      trip: tripsWithVehicles.find(
        R.both(
          R.pipe(R.prop("stop_code"), R.identical(fav.stopCode)),
          R.pipe(R.prop("route_short_name"), R.identical(fav.routeShortName))
        )
      )
    }))
  ),
  startWith([]),
  distinctUntilChanged(R.equals),
  shareReplay(1)
);
