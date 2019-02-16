import mapboxgl from "mapbox-gl";
import { mapState } from "vuex";

export default {
  name: "ControlGeolocate",
  inject: ["mapPromise"],
  computed: mapState(["triggerGeolocate"]),
  async created() {
    this.map = await this.mapPromise;
    this.control = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: false
      },
      trackUserLocation: true
    });

    this.map.addControl(this.control);

    if (this.triggerGeolocate) {
      this.control.trigger();
      // reset the trigger
      this.$store.commit("setTriggerGeolocate", false);
    }
  },
  destroyed() {
    this.map.removeControl(this.control);
  },
  render() {
    return null;
  }
};
