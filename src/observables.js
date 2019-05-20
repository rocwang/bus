import { combineLatest, merge, of, from, interval, ReplaySubject } from "rxjs";
import {
  distinctUntilChanged,
  switchMap,
  map,
  startWith,
  pluck,
  shareReplay
} from "rxjs/operators";
import { uniqBy } from "lodash-es";
import { getVehiclePositions } from "./api/gtfsRealtime";
import {
  getStopNameById,
  getTripsByStopAndTrip,
  getTripsByStop,
  getTripsByStopAndRoute,
  getRoutesByStopAndTrip,
  getRoutesByStopAndShortName,
  getRoutesByStop
} from "./api/gtfs";
import {
  getNexTripsByStopRouteItems,
  getRoutesByStopRouteItems
} from "./api/gtfs";
import { favourites$ } from "./favouritesStore";

export const actionViewStop$ = new ReplaySubject(1); // { stopCode }
export const actionViewRoute$ = new ReplaySubject(1); // { stopCode, routeShortName }
export const actionViewTrip$ = new ReplaySubject(1); // { stopCode, tripId }

export const stopCode$ = merge(
  actionViewStop$,
  actionViewRoute$.pipe(pluck("stopCode")),
  actionViewTrip$.pipe(pluck("stopCode"))
).pipe(
  startWith(""),
  distinctUntilChanged(),
  shareReplay(1)
);

export const stopName$ = stopCode$.pipe(
  switchMap(stopCode =>
    stopCode ? from(getStopNameById(stopCode)) : of([{ stop_name: "" }])
  ),
  map(stopCodes => stopCodes[0]),
  pluck("stop_name"),
  startWith(""),
  shareReplay(1)
);

export const routeShortName$ = actionViewRoute$.pipe(
  pluck("routeShortName"),
  startWith("")
);

export const trips$ = merge(
  favourites$.pipe(
    switchMap(favourites => from(getNexTripsByStopRouteItems(favourites)))
  ),
  actionViewRoute$.pipe(
    switchMap(({ stopCode, routeShortName }) =>
      from(getTripsByStopAndRoute(stopCode, routeShortName))
    )
  ),
  actionViewTrip$.pipe(
    switchMap(({ stopCode, tripId }) =>
      from(getTripsByStopAndTrip(stopCode, tripId))
    )
  ),
  actionViewStop$.pipe(switchMap(stopCode => from(getTripsByStop(stopCode))))
).pipe(
  startWith([]),
  shareReplay(1)
);

export const routes$ = merge(
  favourites$.pipe(
    switchMap(favourites => from(getRoutesByStopRouteItems(favourites)))
  ),
  actionViewTrip$.pipe(
    switchMap(({ stopCode, tripId }) =>
      from(getRoutesByStopAndTrip(stopCode, tripId))
    )
  ),
  actionViewRoute$.pipe(
    switchMap(({ stopCode, routeShortName }) =>
      from(getRoutesByStopAndShortName(stopCode, routeShortName))
    )
  ),
  actionViewStop$.pipe(switchMap(stopCode => from(getRoutesByStop(stopCode))))
).pipe(
  startWith([]),
  shareReplay(1)
);

export const vehicles$ = trips$.pipe(
  map(trips => trips.map(t => t.trip_id).join(",")),
  switchMap(tripIds =>
    tripIds
      ? interval(10000).pipe(
          startWith(-1),
          map(() => tripIds)
        )
      : of("")
  ),
  switchMap(tripIds =>
    tripIds ? from(getVehiclePositions(tripIds)) : of({ entity: [] })
  ),
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

export const routePatterns$ = routes$.pipe(
  map(routes =>
    Array.from(new Set(routes.map(route => route.route_id.substring(0, 5))))
  ),
  startWith([]),
  shareReplay(1)
);

export const routeShortNamesByStop$ = routes$.pipe(
  map(routes =>
    Array.from(new Set(routes.map(route => route.route_short_name))).sort(
      (a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    )
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
  shareReplay(1)
);
