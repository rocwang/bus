import Vue from "vue";
import Router from "vue-router";
import Intro from "./views/Intro";
import Favourites from "./views/Favourites";
import Stop from "./views/Stop";
import Route from "./views/Route";
import { actionViewStop$, actionViewRoute$ } from "./observables";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Intro",
      component: Intro
    },
    {
      path: "/favourites",
      name: "Favourites",
      component: Favourites
    },
    {
      path: "/stop/:stopCode",
      name: "Stop",
      component: Stop,
      beforeEnter: (to, from, next) => {
        actionViewStop$.next(to.params.stopCode);
        next();
      }
    },
    {
      path: "/stop/:stopCode/route_group/:shortName",
      name: "Route",
      component: Route,
      beforeEnter: (to, from, next) => {
        actionViewRoute$.next({
          stopCode: to.params.stopCode,
          routeShortName: to.params.shortName
        });
        next();
      }
    },
    {
      path: "*",
      redirect: { name: "Intro" }
    }
  ]
});
