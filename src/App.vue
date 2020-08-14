<template>
  <div id="app" :class="$style.root">
    <UpdateNotification />
    <Mapbox
      v-if="$route.name !== 'Intro'"
      :stopCode="stopCode"
      :vehicles="vehicles"
      :shapes="shapes"
      @stopClick="handleStopClick"
    />
    <router-view />
  </div>
</template>

<script>
import config from "./config";
import { vehicles$, shapes$ } from "./store/trips";
import { stopCode$ } from "./store/stop";
import UpdateNotification from "./components/UpdateNotification";

export default {
  name: "App",
  components: {
    UpdateNotification,
    Mapbox: () =>
      import(/* webpackChunkName: "mapbox" */ "./components/mapbox/Mapbox"),
  },
  provide() {
    const colors = Object.keys(this.$style)
      .filter((key) => key.substring(0, 5) === "color")
      .reduce((colors, key) => {
        const newKey = key[5].toLowerCase() + key.substring(6);
        colors[newKey] = this.$style[key];
        return colors;
      }, {});

    return {
      config,
      colors: Object.freeze(colors),
    };
  },
  subscriptions() {
    return {
      stopCode: stopCode$,
      shapes: shapes$,
      vehicles: vehicles$,
    };
  },
  methods: {
    handleStopClick(stopCode) {
      this.$router.push({
        name: "Stop",
        params: { stopCode },
      });
    },
  },
};
</script>

<style module>
@value colorOceanBlue, colorGreen, colorBlue from "./assets/global.module.css";
@value colorYellow, colorRed, colorOrange from "./assets/global.module.css";
@value colorGrayA, colorGrayB, colorGrayC from "./assets/global.module.css";
@value colorGrayD, colorWhite, colorBlack from "./assets/global.module.css";

.root {
  position: relative;
  overflow: hidden;
  height: 100%;
}
</style>
