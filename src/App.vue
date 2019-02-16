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
import uniqBy from "lodash/uniqBy";
import at from "./api/at";
import { from, interval } from "rxjs";
import {
  switchMap,
  map,
  startWith,
  filter,
  pluck,
  scan,
  share
} from "rxjs/operators";
import { mapState } from "vuex";

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
  computed: mapState(["routes"]),
  observableMethods: {
    pushStopClick: "stopCode$"
  },
  subscriptions() {
    const trips$ = this.stopCode$.pipe(
      switchMap(stopCode => from(at.getStopInfoByStopCode(stopCode))),
      startWith([]),
      share()
    );
    return {
      stopCode: this.stopCode$,
      // routes: this.stopCode$.pipe(
      //   switchMap(stopCode => from(at.getRoutesByStop(stopCode))),
      //   map(routes =>
      //     routes.sort((a, b) =>
      //       a.route_short_name.localeCompare(b.route_short_name)
      //     )
      //   ),
      //   startWith([])
      // ),
      trips: trips$,
      vehicles: trips$.pipe(
        filter(trips => trips.length),
        map(trips => trips.map(t => t.trip_id).join(",")),
        switchMap(tripIds =>
          interval(10000).pipe(
            startWith(-1),
            map(() => tripIds)
          )
        ),
        switchMap(tripIds => from(at.getVehiclePositions(tripIds))),
        scan((latestResponse, response) =>
          response.header.timestamp >= latestResponse.header.timestamp
            ? response
            : latestResponse
        ),
        pluck("entity"),
        map(entities =>
          uniqBy(entities.map(e => e.vehicle), v => v.vehicle.id)
        ),
        startWith([])
      )
    };
  },
  methods: {
    handleStopClick(stopCode) {
      this.pushStopClick(stopCode);
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
