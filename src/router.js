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
      component: Favourites
    },
    {
      path: "/stop/:stopCode",
      name: "Stop",
      component: Stop,
      props: true
    },
    {
      path: "/stop/:stopCode/route_group/:shortName",
      name: "Route",
      component: Route,
      props: true
    },
    {
      path: "*",
      redirect: { name: "Intro" }
    }
  ]
});
