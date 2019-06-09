import "./assets/reset.css";
import "./assets/global.module.css";

import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";
import Intro from "./views/Intro";
import Favourites from "./views/Favourites";
import Stop from "./views/Stop";
import Route from "./views/Route";
import VueRx from "vue-rx";
import "pwacompat";
import "./workBox";

Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(VueRx);

new Vue({
  router: new Router({
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
  }),
  render: createElement => createElement(App)
}).$mount("#app");
