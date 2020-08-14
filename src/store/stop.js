import { merge } from "rxjs";
import {
  distinctUntilChanged,
  switchMap,
  map,
  startWith,
  pluck,
  shareReplay,
} from "rxjs/operators";
import { getStopNameById } from "../api/gtfs";
import { actionViewTrip$, actionViewRoute$, actionViewStop$ } from "./actions";

export const stopCode$ = merge(
  actionViewStop$,
  actionViewRoute$.pipe(pluck("stopCode")),
  actionViewTrip$.pipe(pluck("stopCode"))
).pipe(startWith(""), distinctUntilChanged(), shareReplay(1));

export const stopName$ = stopCode$.pipe(
  switchMap((stopCode) => getStopNameById(stopCode)),
  map((stopCodes) => stopCodes[0]),
  pluck("stop_name"),
  startWith(""),
  shareReplay(1)
);
