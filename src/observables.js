import { of, from, interval, combineLatest, BehaviorSubject } from "rxjs";
import { switchMap, map, startWith, pluck, share } from "rxjs/operators";
import { uniqBy } from "lodash-es";
import { getVehiclePositions } from "./api/gtfsRealtime";
import { queryGtfs } from "./api/gtfs";

export const stopCode$ = new BehaviorSubject("").pipe(share());
export const theRouteShortName$ = new BehaviorSubject("").pipe(share());

export const trips$ = combineLatest(stopCode$, theRouteShortName$).pipe(
  switchMap(([stopCode, routeShortName]) => {
    const now = new Date();
    const nowFormatted = `${now.getHours()}:00:00`;

    if (!stopCode) {
      return of([]);
    } else if (routeShortName) {
      // route is chosen
      return from(
        queryGtfs(
          `
            select distinct trips.trip_id, trip_headsign, departure_time
            from trips
                   inner join stop_times on stop_times.trip_id = trips.trip_id
                   inner join stops on stops.stop_id = stop_times.stop_id
                   inner join routes on trips.route_id = routes.route_id
            where stops.stop_code = :stopCode
              and route_short_name = :routeShortName
              and departure_time >= :nowFormatted
            order by departure_time asc;
          `,
          { stopCode, routeShortName, nowFormatted }
        )
      );
    } else {
      // route is not chosen yet
      return from(
        queryGtfs(
          `
            select distinct trips.trip_id, trip_headsign, departure_time
            from trips
                   inner join stop_times on stop_times.trip_id = trips.trip_id
                   inner join stops on stops.stop_id = stop_times.stop_id
            where stops.stop_code = :stopCode
              and departure_time >= :nowFormatted
              and departure_time <= :threeHoursLaterFormatted;
          `,
          {
            stopCode,
            nowFormatted,
            threeHoursLaterFormatted: `${now.getHours() + 3}:00:00`
          }
        )
      );
    }
  }),
  share(),
  startWith([])
);

export const routes$ = combineLatest(stopCode$, theRouteShortName$).pipe(
  switchMap(([stopCode, routeShortName]) => {
    if (!stopCode) {
      return of([]);
    } else if (routeShortName) {
      // route is chosen
      return from(
        queryGtfs(
          `
            select distinct stop_name, route_short_name, routes.route_id
            from stops
                   inner join stop_times on stops.stop_id = stop_times.stop_id
                   inner join trips on stop_times.trip_id = trips.trip_id
                   inner join routes on trips.route_id = routes.route_id
            where stops.stop_code = :stopCode and route_short_name = :routeShortName
            order by route_long_name asc;
          `,
          { stopCode, routeShortName }
        )
      );
    } else {
      // route is not chosen yet
      return from(
        queryGtfs(
          `
              select distinct stop_name, route_short_name, routes.route_id
              from stops
                     inner join stop_times on stops.stop_id = stop_times.stop_id
                     inner join trips on stop_times.trip_id = trips.trip_id
                     inner join routes on trips.route_id = routes.route_id
              where stops.stop_code = ?
              order by route_long_name asc;
            `,
          stopCode
        )
      );
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
