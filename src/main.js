import "./assets/reset.css";
import "./assets/global.module.css";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRx from "vue-rx";
import "pwacompat";
import { workBox } from "./workBox";

Vue.config.productionTip = false;
Vue.use(VueRx);

new Vue({
  router,
  render: createElement => createElement(App)
}).$mount("#app");

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  // Register the service worker after event listeners have been added.
  // By default this method delays registration until after the window has loaded.
  workBox.register();
}
