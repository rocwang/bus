import "./assets/reset.css";
import "./assets/global.module.css";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRx from "vue-rx";
import "pwacompat";
import { workBox } from "./workBox";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(VueRx);

new Vue({
  router,
  store,
  render: (createElement) => createElement(App),
}).$mount("#app");

if ("serviceWorker" in navigator) {
  // Register the service worker after event listeners have been added.
  // By default this method delays registration until after the window has loaded.
  workBox.register();
}
