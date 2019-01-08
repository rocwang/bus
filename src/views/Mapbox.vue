<template>
  <div :class="$style.root">
    <SourceStops/>
    <SourceRoutes/>
    <ImageStop/>

    <ControlGeolocate/>

    <LayerRoute v-for="(r, i) in routes" :route="r" :index="i" :key="r.route_id"/>
    <!--<LayerStopClusters/>-->
    <!--<LayerStopCount/>-->
    <LayerStops @click="handleStopClick"/>

    <MarkerBus v-for="v in vehicles" :vehicle="v" :key="v.vehicle.id"/>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as at from "../api/at";
import ControlGeolocate from "../components/ControlGeolocate";
import SourceRoutes from "../components/SourceRoutes";
import SourceStops from "../components/SourceStops";
import LayerStops from "../components/LayerStops";
// import LayerStopClusters from "../components/LayerStopClusters";
// import LayerStopCount from "../components/LayerStopCount";
import LayerRoute from "../components/LayerRoute";
import MarkerBus from "../components/MarkerBus";
import ImageStop from "../components/ImageStop";
import { uniqBy } from "lodash";
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

export default {
  name: "Mapbox",
  components: {
    ControlGeolocate,
    LayerRoute,
    LayerStops,
    // LayerStopClusters,
    // LayerStopCount,
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
  inject: ["config"],
  async mounted() {
    mapboxgl.accessToken = this.config.mapboxAccessToken;
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
      switchMap(stopCode => from(at.getStopInfoByStopCode(stopCode))),
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
  }
};
</script>

<style module>
.root {
  width: 100%;
  height: 100%;
}
</style>
