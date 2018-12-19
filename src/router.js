import Vue from "vue";
import Router from "vue-router";
import GoogleMaps from "./views/GoogleMaps.vue";
import Mapbox from "./views/Mapbox.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "GoogleMaps",
      component: GoogleMaps
    },
    {
      path: "/mapbox",
      name: "Mapbox",
      component: Mapbox
    }
  ]
});
