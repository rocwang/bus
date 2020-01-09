import { merge, of } from "rxjs";
import { switchMap, map, startWith, shareReplay } from "rxjs/operators";
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

export const routes$ = merge(
  actionViewFavourites$.pipe(map(() => ({ type: "viewFavourites" }))),
  actionViewTrip$.pipe(map(payload => ({ type: "viewTrip", ...payload }))),
  actionViewRoute$.pipe(map(payload => ({ type: "viewRoute", ...payload }))),
  actionViewStop$.pipe(map(stopCode => ({ type: "viewStop", stopCode })))
).pipe(
  switchMap(action => {
    switch (action.type) {
      case "viewFavourites":
        return favourites$.pipe(
          switchMap(favourites => getRoutesByStopRouteItems(favourites))
        );
      case "viewTrip":
        return getRoutesByStopAndTrip(action.stopCode, action.tripId);
      case "viewRoute":
        return getRoutesByStopAndShortName(
          action.stopCode,
          action.routeShortName
        );
      case "viewStop":
        return getRoutesByStop(action.stopCode);
      default:
        return of([]);
    }
  }),
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
    Array.from(
      new Set(routes.map(route => route.route_short_name))
    ).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    )
  ),
  startWith([]),
  shareReplay(1)
);
