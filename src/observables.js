import { Subject, from, interval } from "rxjs";
import { switchMap, map, startWith, pluck, share } from "rxjs/operators";
import { uniqBy } from "lodash-es";
import { getVehiclePositions } from "./api/gtfsRealtime";
import { queryGtfs } from "./api/gtfs";

export const stopCode$ = new Subject().pipe(share());

export const vehicles$ = stopCode$.pipe(
  switchMap(stopCode => {
    const now = new Date();
    const nowFormatted = `${now.getHours()}:00:00`;
    const threeHoursLaterFormatted = `${now.getHours() + 3}:00:00`;
    return stopCode
      ? from(
          queryGtfs(
            `
            select distinct trips.trip_id, departure_time
            from stops
                   inner join stop_times on stops.stop_id = stop_times.stop_id
                   inner join trips on stop_times.trip_id = trips.trip_id
            where stops.stop_id = (select stop_id from stops where stop_code = :stopCode order by stop_id asc limit 1)
              and departure_time >= :nowFormatted and departure_time <= :threeHoursLaterFormatted;
          `,
            {
              stopCode,
              nowFormatted,
              threeHoursLaterFormatted
            }
          )
        )
      : from(Promise.resolve([]));
  }),
  map(trips => trips.map(t => t.trip_id).join(",")),
  switchMap(tripIds =>
    tripIds
      ? interval(10000).pipe(
          startWith(-1),
          map(() => tripIds)
        )
      : from(Promise.resolve(""))
  ),
  switchMap(tripIds =>
    tripIds
      ? from(getVehiclePositions(tripIds))
      : from(Promise.resolve({ entity: [] }))
  ),
  pluck("entity"),
  map(entities => uniqBy(entities.map(e => e.vehicle), v => v.vehicle.id))
);

export const routes$ = stopCode$.pipe(
  switchMap(stopCode =>
    stopCode
      ? from(
          queryGtfs(
            `
          select distinct stop_name, route_short_name, routes.route_id
          from stops
                 inner join stop_times on stops.stop_id = stop_times.stop_id
                 inner join trips on stop_times.trip_id = trips.trip_id
                 inner join routes on trips.route_id = routes.route_id
          where stops.stop_id = (select stop_id from stops where stop_code = ? order by stop_id asc limit 1)
          order by route_long_name asc;
        `,
            stopCode
          )
        )
      : from(Promise.resolve([]))
  ),
  share(),
  startWith([])
);

export const routeGroups$ = routes$.pipe(
  map(routes =>
    Array.from(
      routes.reduce(
        (groups, route) => groups.add(route.route_short_name),
        new Set()
      )
    ).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    )
  )
);

export const stopName$ = routes$.pipe(
  map(routes => (routes[0] ? routes[0].stop_name : ""))
);
