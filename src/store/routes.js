import { merge } from "rxjs";
import { switchMap, map, startWith, pluck, shareReplay } from "rxjs/operators";
import {
  getRoutesByStopAndTrip,
  getRoutesByStopAndShortName,
  getRoutesByStop
} from "../api/gtfs";
import { getRoutesByStopRouteItems } from "../api/gtfs";
import { favourites$ } from "./favourites";
import {
  actionViewTrip$,
  actionViewStop$,
  actionViewRoute$,
  actionViewFavourites$
} from "./actions";

export const routeShortName$ = actionViewRoute$.pipe(
  pluck("routeShortName"),
  startWith("")
);

export const routes$ = merge(
  actionViewFavourites$.pipe(
    switchMap(() => favourites$),
    switchMap(favourites => getRoutesByStopRouteItems(favourites))
  ),
  actionViewTrip$.pipe(
    switchMap(({ stopCode, tripId }) =>
      getRoutesByStopAndTrip(stopCode, tripId)
    )
  ),
  actionViewRoute$.pipe(
    switchMap(({ stopCode, routeShortName }) =>
      getRoutesByStopAndShortName(stopCode, routeShortName)
    )
  ),
  actionViewStop$.pipe(switchMap(stopCode => getRoutesByStop(stopCode)))
).pipe(
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
