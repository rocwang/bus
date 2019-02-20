<template>
  <div id="app" :class="$style.root">
    <Mapbox
      v-if="$route.name !== 'Intro'"
      :routes="routes"
      :vehicles="vehicles"
      @stopClick="handleStopClick"
    />
    <router-view />
  </div>
</template>

<script>
import config from "./config";
import { vehicles$, stopCode$, routes$ } from "./streams";

export default {
  name: "App",
  components: {
    Mapbox: () => import(/* webpackChunkName: "mapbox" */ "./components/Mapbox")
  },
  provide() {
    const colors = Object.keys(this.$style)
      .filter(key => key.substring(0, 5) === "color")
      .reduce((colors, key) => {
        const newKey = key[5].toLowerCase() + key.substring(6);
        colors[newKey] = this.$style[key];
        return colors;
      }, {});

    return {
      config,
      colors
    };
  },
  subscriptions() {
    return {
      routes: routes$,
      stopCode: stopCode$,
      vehicles: vehicles$
    };
  },
  methods: {
    handleStopClick(stopCode) {
      this.$router.push({
        name: "Stop",
        params: { stopCode }
      });
    }
  }
};
</script>

<style module>
@value colorOceanBlue, colorGreen, colorBlue from "./assets/global.module.css";
@value colorYellow, colorRed, colorOrange from "./assets/global.module.css";
@value colorGray, colorGrayA, colorGrayB from "./assets/global.module.css";
@value colorGrayC, colorWhite, colorBlack from "./assets/global.module.css";

.root {
  position: relative;
  overflow: hidden;
  height: 100%;
}
</style>
