import Vue from "vue";
import Router from "vue-router";
import Mapbox from "./views/Mapbox.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Mapbox
    },
    {
      path: "*",
      redirect: { name: "Home" }
    }
  ]
});
