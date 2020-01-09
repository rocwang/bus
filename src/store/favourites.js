import {
  Store,
  set as idbSet,
  get,
  keys as idbKeys,
  del as idbDel,
  clear as idbClear
} from "idb-keyval";
import { defer, merge } from "rxjs";
import { shareReplay, startWith, concatAll, mapTo, map } from "rxjs/operators";
import {
  actionAddToFavourites$,
  actionRemoveFromFavourites$,
  actionClearFavourites$,
  actionViewFavourites$
} from "./actions";

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

function clear() {
  return idbClear(store);
}

export const favourites$ = merge(
  actionAddToFavourites$.pipe(
    map(({ stopCode, routeShortName }) =>
      defer(async () => {
        await set(stopCode, routeShortName);
        return list();
      })
    )
  ),
  actionRemoveFromFavourites$.pipe(
    map(({ stopCode, routeShortName }) =>
      defer(async () => {
        await del(stopCode, routeShortName);
        return list();
      })
    )
  ),
  actionClearFavourites$.pipe(
    mapTo(
      defer(async () => {
        await clear();
        return list();
      })
    )
  ),
  actionViewFavourites$.pipe(mapTo(defer(list)))
).pipe(concatAll(), startWith([]), shareReplay(1));
