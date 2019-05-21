import {
  Store,
  set as idbSet,
  get,
  keys as idbKeys,
  del as idbDel
} from "idb-keyval";
import { merge, ReplaySubject, Subject, from, of } from "rxjs";
import { tap, switchMap, shareReplay, startWith } from "rxjs/operators";

const store = new Store("favourites", "favourites");

function set(stopCode, routeShortName, name = "") {
  name = name || `${routeShortName} at ${stopCode}`;
  return idbSet(
    `${stopCode}-${routeShortName}`,
    { stopCode, routeShortName, name },
    store
  );
}

function del(stopCode, routeShortName) {
  return idbDel(`${stopCode}-${routeShortName}`, store);
}

async function list() {
  const keys = await idbKeys(store);
  const values = keys.map(key => get(key, store));
  return Promise.all(values);
}

export const actionAddToFavourite$ = new Subject();
export const actionRemoveFromFavourite$ = new Subject();
export const actionViewFavourites$ = new ReplaySubject(1);

export const favourites$ = merge(
  actionAddToFavourite$.pipe(
    tap(({ stopCode, routeShortName }) => set(stopCode, routeShortName))
  ),
  actionRemoveFromFavourite$.pipe(
    tap(({ stopCode, routeShortName }) => del(stopCode, routeShortName))
  ),
  actionViewFavourites$,
  of(null)
).pipe(
  switchMap(() => from(list())),
  startWith([]),
  shareReplay(1)
);
