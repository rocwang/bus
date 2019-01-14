import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Stop from "./views/Stop";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/stop/:stopCode",
      name: "Stop",
      component: Stop,
      props: true
    },
    {
      path: "*",
      redirect: { name: "Home" }
    }
  ]
});
