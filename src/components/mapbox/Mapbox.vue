<template>
  <div :class="$style.root">
    <ImageStop />

    <ControlGeolocate />

    <LayerShapes :shapes="shapes" />

    <!--<LayerStopClusters/>-->
    <!--<LayerStopCount/>-->
    <LayerStops @click="$emit('stopClick', $event)" :stopCode="stopCode" />

    <MarkerBus v-for="v in vehicles" :vehicle="v" :key="v.vehicle.id" />
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import ControlGeolocate from "./ControlGeolocate";
import LayerShapes from "./LayerShapes";
import LayerStops from "./LayerStops";
// import LayerStopClusters from "../components/LayerStopClusters";
// import LayerStopCount from "../components/LayerStopCount";
import MarkerBus from "./MarkerBus";
import ImageStop from "./ImageStop";

export default {
  name: "Mapbox",
  components: {
    ControlGeolocate,
    LayerShapes,
    LayerStops,
    // LayerStopClusters,
    // LayerStopCount,
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
    stopCode: {
      type: String,
      default: ""
    },
    shapes: {
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
  mounted() {
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
    this.map = new mapboxgl.Map({
      container: this.$el,
      style: "mapbox://styles/mapbox/streets-v10",
      bounds: this.config.defaultMapBounds
    });

    this.map.on("load", () => {
      this.resovleMap(this.map);
    });
  },
  destroyed() {
    this.map.remove();
  }
};
</script>

<style src="mapbox-gl/dist/mapbox-gl.css" />
<style module>
.root {
  width: 100%;
  height: calc(100% - 82px);
}
</style>
