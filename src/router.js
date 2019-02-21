import Vue from "vue";
import Router from "vue-router";
import Intro from "./views/Intro";
import Favourites from "./views/Favourites";
import Stop from "./views/Stop";
import RouteGroup from "./views/RouteGroup";

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
      path: "/route_group/:group",
      name: "RouteGroup",
      component: RouteGroup,
      props: true
    },
    {
      path: "*",
      redirect: { name: "Intro" }
    }
  ]
});
