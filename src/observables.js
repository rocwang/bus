import { merge, of, from, interval, BehaviorSubject } from "rxjs";
import {
  distinctUntilChanged,
  switchMap,
  map,
  startWith,
  pluck,
  filter,
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

export const actionViewStop$ = new BehaviorSubject(undefined).pipe(
  filter(value => value)
); // { stopCode }
export const actionViewRoute$ = new BehaviorSubject(undefined).pipe(
  filter(value => value)
); // { stopCode, routeShortName }
export const actionViewTrip$ = new BehaviorSubject(undefined).pipe(
  filter(value => value)
); // { stopCode, tripId }

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
  map(entities => uniqBy(entities.map(e => e.vehicle), v => v.vehicle.id))
);

export const routePatterns$ = routes$.pipe(
  map(routes =>
    Array.from(new Set(routes.map(route => route.route_id.substring(0, 5))))
  )
);

export const routeShortNamesByStop$ = routes$.pipe(
  map(routes =>
    Array.from(new Set(routes.map(route => route.route_short_name))).sort(
      (a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    )
  )
);
