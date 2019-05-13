import {
  Store,
  set as idbSet,
  get,
  keys as idbKeys,
  del as idbDel
} from "idb-keyval";

const store = new Store("favourites", "favourites");

export function set(stopCode, routeShortName, name = "") {
  name = name || `${routeShortName} at ${stopCode}`;
  return idbSet(
    `${stopCode}-${routeShortName}`,
    { stopCode, routeShortName, name },
    store
  );
}

export function del(stopCode, routeShortName) {
  return idbDel(`${stopCode}-${routeShortName}`, store);
}

export async function has(stopCode, routeShortName) {
  const value = await get(`${stopCode}-${routeShortName}`, store);
  return value !== undefined;
}

export async function list() {
  const keys = await idbKeys(store);
  const values = keys.map(key => get(key, store));
  return Promise.all(values);
}
