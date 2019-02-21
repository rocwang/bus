import "./assets/reset.css";
import "./assets/global.module.css";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRx from "vue-rx";
import "pwacompat";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.use(VueRx);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
