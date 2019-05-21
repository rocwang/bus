import Vue from "vue";
import Router from "vue-router";
import Intro from "./views/Intro";
import Favourites from "./views/Favourites";
import Stop from "./views/Stop";
import Route from "./views/Route";

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
      component: Favourites,
      props: route => ({
        isCollapsedInitially: route.query.isCollapsed === "yes"
      })
    },
    {
      path: "/stop/:stopCode",
      name: "Stop",
      component: Stop
    },
    {
      path: "/stop/:stopCode/route_group/:shortName",
      name: "Route",
      component: Route
    },
    {
      path: "*",
      redirect: { name: "Intro" }
    }
  ]
});
