import { BehaviorSubject } from "rxjs";

export const stopCode$ = new BehaviorSubject("1234");
export const vehicles$ = new BehaviorSubject([]);
export const routes$ = new BehaviorSubject([]);
export const routeGroups$ = new BehaviorSubject([]);
export const stopName$ = new BehaviorSubject("stop name");
