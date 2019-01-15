<template>
  <div id="app" :class="$style.root">
    <Mapbox :routes="routes" :vehicles="vehicles" @stopClick="handleStopClick"/>
    <router-view/>
  </div>
</template>

<script>
import config from "./config";
import Mapbox from "./components/Mapbox";
import { uniqBy } from "lodash";
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
  components: { Mapbox },
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
        scan(
          (latestResponse, response) =>
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
@value colorOceanBlue: #001120;
@value colorGreen: #8fc240;
@value colorBlue: #00a3da;
@value colorYellow: #ffdb1b;
@value colorRed: #da2f2d;
@value colorOrange: #ea8c2e;

@value colorGray: #333;
@value colorGrayA: #666;
@value colorGrayB: #999;
@value colorGrayC: #ccc;
@value colorWhite: #FFF;

:root {
  --c-ocean-blue: colorOceanBlue;
  --c-green: colorGreen;
  --c-blue: colorBlue;
  --c-yellow: colorYellow;
  --c-red: colorRed;
  --c-orange: colorOrange;

  --c-white: colorWhite;
  --c-gray: colorGray;
  --c-gray-a: colorGrayA;
  --c-gray-b: colorGrayB;
  --c-gray-c: colorGrayC;

  --z-panel: 10;
  font-variant-numeric: tabular-nums;
  position: relative;
  overflow: hidden;
}

html,
body,
.root {
  width: 100%;
  height: 100%;
}
</style>
