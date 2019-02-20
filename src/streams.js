import { Subject, from, interval } from "rxjs";
import { switchMap, map, startWith, filter, pluck, scan } from "rxjs/operators";
import uniqBy from "lodash/uniqBy";
import { getVehiclePositions } from "./api/at";
import { queryGtfs } from "./api/gtfs";

export const stopCode$ = new Subject();

export const vehicles$ = stopCode$.pipe(
  switchMap(stopCode => {
    const now = new Date();
    const nowFormatted = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    now.setTime(now.getTime() + 2 * 60 * 60 * 1000);
    const twoHoursLaterFormatted = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    return from(
      queryGtfs(
        `
            select distinct trips.trip_id, departure_time
            from stops
                   inner join stop_times on stops.stop_id = stop_times.stop_id
                   inner join trips on stop_times.trip_id = trips.trip_id
            where stops.stop_id = (select stop_id from stops where stop_code = :stopCode order by stop_id desc limit 1)
              and departure_time >= :nowFormatted and departure_time <= :twoHoursLaterFormatted;
          `,
        { stopCode, nowFormatted, twoHoursLaterFormatted }
      )
    );
  }),
  filter(trips => trips.length),
  map(trips => trips.map(t => t.trip_id).join(",")),
  switchMap(tripIds =>
    interval(10000).pipe(
      startWith(-1),
      map(() => tripIds)
    )
  ),
  switchMap(tripIds => from(getVehiclePositions(tripIds))),
  scan((latestResponse, response) =>
    response.header.timestamp >= latestResponse.header.timestamp
      ? response
      : latestResponse
  ),
  pluck("entity"),
  map(entities => uniqBy(entities.map(e => e.vehicle), v => v.vehicle.id))
);

export const routes$ = stopCode$.pipe(
  switchMap(stopCode =>
    from(
      queryGtfs(
        `
          select distinct stop_name, route_short_name, routes.route_id
          from stops
                 inner join stop_times on stops.stop_id = stop_times.stop_id
                 inner join trips on stop_times.trip_id = trips.trip_id
                 inner join routes on trips.route_id = routes.route_id
          where stops.stop_id = (select stop_id from stops where stop_code = ? order by stop_id desc limit 1)
          order by route_long_name asc;
        `,
        stopCode
      )
    )
  ),
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
