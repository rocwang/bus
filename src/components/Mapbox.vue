<template>
  <div :class="$style.root">
    <SourceStops />
    <SourceRoutes />
    <ImageStop />

    <ControlGeolocate />

    <LayerRoute
      v-for="(r, i) in routes"
      :route="r"
      :index="i"
      :key="r.route_id"
    />
    <!--<LayerStopClusters/>-->
    <!--<LayerStopCount/>-->
    <LayerStops @click="$emit('stopClick', $event)" />

    <MarkerBus v-for="v in vehicles" :vehicle="v" :key="v.vehicle.id" />
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ControlGeolocate from "../components/ControlGeolocate";
import SourceRoutes from "../components/SourceRoutes";
import SourceStops from "../components/SourceStops";
import LayerStops from "../components/LayerStops";
// import LayerStopClusters from "../components/LayerStopClusters";
// import LayerStopCount from "../components/LayerStopCount";
import LayerRoute from "../components/LayerRoute";
import MarkerBus from "../components/MarkerBus";
import ImageStop from "../components/ImageStop";

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
  props: {
    routes: {
      type: Array,
      default() {
        return [];
      }
    },
    vehicles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  async mounted() {
    mapboxgl.accessToken = this.config.mapboxAccessToken;
    const map = new mapboxgl.Map({
      container: this.$el,
      style: "mapbox://styles/mapbox/streets-v10",
      bounds: this.config.defaultMapBounds
    }).on("load", () => this.resovleMap(map));

    this.map = await this.mapPromise;
  },
  destroyed() {
    this.map.remove();
  }
};
</script>

<style module>
.root {
  width: 100%;
  height: calc(100% - 82px);
}
</style>
