import { of, from, interval, BehaviorSubject } from "rxjs";
import { switchMap, map, startWith, pluck, share } from "rxjs/operators";
import { uniqBy } from "lodash-es";
import { getVehiclePositions } from "./api/gtfsRealtime";
import {
  getTripsByStopAndTrip,
  getTripsByStop,
  getTripsByStopAndRoute,
  getRoutesByStopAndTrip,
  getRoutesByStopAndShortName,
  getRoutesByStop
} from "./api/gtfs";

export const stopRouteTrip$ = new BehaviorSubject({
  stopCode: "",
  routeShortName: "",
  tripId: ""
}).pipe(share());

export const trips$ = stopRouteTrip$.pipe(
  switchMap(({ stopCode, routeShortName, tripId }) => {
    if (stopCode && tripId) {
      return from(getTripsByStopAndTrip(stopCode, tripId));
    } else if (stopCode && routeShortName) {
      return from(getTripsByStopAndRoute(stopCode, routeShortName));
    } else if (stopCode) {
      return from(getTripsByStop(stopCode));
    } else {
      return of([]);
    }
  }),
  share(),
  startWith([])
);

export const routes$ = stopRouteTrip$.pipe(
  switchMap(({ stopCode, routeShortName, tripId }) => {
    if (stopCode && tripId) {
      return from(getRoutesByStopAndTrip(stopCode, tripId));
    } else if (stopCode && routeShortName) {
      return from(getRoutesByStopAndShortName(stopCode, routeShortName));
    } else if (stopCode) {
      return from(getRoutesByStop(stopCode));
    } else {
      return of([]);
    }
  }),
  share(),
  startWith([])
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

export const routeShortNames$ = routes$.pipe(
  map(routes =>
    Array.from(new Set(routes.map(route => route.route_short_name))).sort(
      (a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    )
  )
);

export const stopName$ = routes$.pipe(
  map(routes => (routes[0] ? routes[0].stop_name : ""))
);
