import { Subject, ReplaySubject } from "rxjs";

export const actionAddToFavourites$ = new Subject();
export const actionRemoveFromFavourites$ = new Subject();
export const actionClearFavourites$ = new Subject();
export const actionViewFavourites$ = new ReplaySubject(1);

export const actionViewRoute$ = new ReplaySubject(1); // { stopCode, routeShortName }
export const actionViewStop$ = new ReplaySubject(1); // "stopCode"
export const actionViewTrip$ = new ReplaySubject(1); // { stopCode, tripId }
