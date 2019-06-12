import { Subject } from "rxjs";

export const actionAddToFavourites$ = new Subject();
export const actionRemoveFromFavourites$ = new Subject();
export const actionClearFavourites$ = new Subject();
export const actionViewFavourites$ = new Subject();

export const actionViewRoute$ = new Subject(); // { stopCode, routeShortName }
export const actionViewStop$ = new Subject(); // "stopCode"
export const actionViewTrip$ = new Subject(); // { stopCode, tripId }
