import { BehaviorSubject } from "rxjs";

export const stopRouteTrip$ = new BehaviorSubject({
  stopCode: "",
  routeShortName: "",
  tripId: ""
});
export const trips$ = new BehaviorSubject([]);
export const routes$ = new BehaviorSubject([]);
export const vehicles$ = new BehaviorSubject([]);
export const routePatterns$ = new BehaviorSubject([]);
export const routeShortNames$ = new BehaviorSubject([]);
export const stopName$ = new BehaviorSubject("stop name");
