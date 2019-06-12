import { combineLatest, merge, interval } from "rxjs";
import {
  switchMap,
  map,
  startWith,
  pluck,
  shareReplay,
  distinctUntilChanged
} from "rxjs/operators";
import { uniqBy, isEqual } from "lodash-es";
import { getVehiclePositions } from "../api/gtfsRealtime";
import {
  getTripsByStopAndTrip,
  getTripsByStop,
  getTripsByStopAndRoute
} from "../api/gtfs";
import { getNexTripsByStopRouteItems } from "../api/gtfs";
import { favourites$ } from "./favourites";
import {
  actionViewFavourites$,
  actionViewRoute$,
  actionViewTrip$,
  actionViewStop$
} from "./actions";

export const trips$ = merge(
  actionViewFavourites$.pipe(
    switchMap(() => favourites$),
    switchMap(favourites => getNexTripsByStopRouteItems(favourites))
  ),
  actionViewRoute$.pipe(
    switchMap(({ stopCode, routeShortName }) =>
      getTripsByStopAndRoute(stopCode, routeShortName)
    )
  ),
  actionViewTrip$.pipe(
    switchMap(({ stopCode, tripId }) => getTripsByStopAndTrip(stopCode, tripId))
  ),
  actionViewStop$.pipe(switchMap(stopCode => getTripsByStop(stopCode)))
).pipe(
  startWith([]),
  shareReplay(1)
);

export const vehicles$ = trips$.pipe(
  map(trips => trips.map(t => t.trip_id)),
  switchMap(tripIds =>
    interval(10000).pipe(
      startWith(-1),
      map(() => tripIds)
    )
  ),
  switchMap(tripIds => getVehiclePositions(tripIds)),
  pluck("entity"),
  map(entities => uniqBy(entities.map(e => e.vehicle), v => v.vehicle.id)),
  startWith([]),
  shareReplay(1)
);

export const tripsWithVehicles$ = combineLatest([trips$, vehicles$]).pipe(
  map(([trips, vehicles]) =>
    trips.map(trip => ({
      ...trip,
      vehicle: vehicles.find(vehicle => vehicle.trip.trip_id === trip.trip_id)
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
        trip =>
          trip.stop_code === fav.stopCode &&
          trip.route_short_name === fav.routeShortName
      )
    }))
  ),
  startWith([]),
  distinctUntilChanged((x, y) => isEqual(x, y)),
  shareReplay(1)
);
