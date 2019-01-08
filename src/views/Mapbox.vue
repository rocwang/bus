<template>
  <div :class="$style.root">
    <SourceStops/>
    <SourceRoutes/>
    <ImageStop/>

    <ControlGeolocate/>

    <LayerRoutes :routes="routes"/>
    <LayerStopClusters/>
    <LayerStopCount/>
    <LayerStops @click="handleStopClick"/>

    <MarkerBus v-for="vehicle in vehicles" :vehicle="vehicle" :key="vehicle.vehicle.vehicle.id"/>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import config from "../config";
import * as at from "../api/at";
import ControlGeolocate from "../components/ControlGeolocate";
import SourceRoutes from "../components/SourceRoutes";
import SourceStops from "../components/SourceStops";
import LayerStops from "../components/LayerStops";
import LayerStopClusters from "../components/LayerStopClusters";
import LayerStopCount from "../components/LayerStopCount";
import LayerRoutes from "../components/LayerRoutes";
import MarkerBus from "../components/MarkerBus";
import ImageStop from "../components/ImageStop";
import { from, interval } from "rxjs";
import {
  switchMap,
  map,
  startWith,
  filter,
  pluck,
  share
} from "rxjs/operators";

mapboxgl.accessToken = config.mapboxAccessToken;

export default {
  name: "Mapbox",
  components: {
    ControlGeolocate,
    LayerRoutes,
    LayerStops,
    LayerStopClusters,
    LayerStopCount,
    SourceRoutes,
    SourceStops,
    MarkerBus,
    ImageStop
  },
  provide() {
    this.mapPromise = new Promise(resolve => {
      this.resovleMap = resolve;
    });
    return {
      mapPromise: this.mapPromise
    };
  },
  async mounted() {
    const map = new mapboxgl.Map({
      container: this.$el,
      style: "mapbox://styles/mapbox/streets-v10",
      bounds: [[174.223, -37.348], [175.314, -36.41]] // The bounds of Auckland
    }).on("load", () => this.resovleMap(map));

    this.map = await this.mapPromise;
  },
  destroyed() {
    this.map.remove();
  },
  observableMethods: {
    handleStopClick: "stopCode$"
  },
  subscriptions() {
    const trips$ = this.stopCode$.pipe(
      switchMap(stopCode => {
        console.log(stopCode);
        return from(at.getStopInfoByStopCode(stopCode));
      }),
      startWith([]),
      share()
    );
    return {
      stopCode: this.stopCode$,
      routes: this.stopCode$.pipe(
        switchMap(stopCode => from(at.getRoutesByStop(stopCode))),
        map(routes =>
          routes.sort((a, b) =>
            a.route_short_name.localeCompare(b.route_short_name)
          )
        ),
        startWith([])
      ),
      trips: trips$,
      vehicles: trips$.pipe(
        filter(trips => trips.length),
        switchMap(() => interval(10000).pipe(startWith(-1))),
        map(() => this.trips.map(t => t.trip_id).join(",")),
        switchMap(tripIds => from(at.getVehiclePositions(tripIds))),
        pluck("entity"),
        // todo: scan for timestamp
        startWith([])
      )
    };
  }
};
</script>

<style module>
.root {
  width: 100%;
  height: 100%;
}
</style>
