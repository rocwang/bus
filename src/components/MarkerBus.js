import mapboxgl from "mapbox-gl";

export default {
  name: "MarkerBus",
  inject: ["mapPromise"],
  props: {
    vehicle: {
      type: Object,
      required: true
    }
  },
  computed: {
    position() {
      return {
        lat: this.vehicle.vehicle.position.latitude,
        lng: this.vehicle.vehicle.position.longitude
      };
    }
  },
  async created() {
    this.map = await this.mapPromise;
    this.marker = new mapboxgl.Marker()
      .setLngLat(this.position)
      .addTo(this.map);
  },
  destroyed() {
    this.marker.remove();
  },
  render() {
    return null;
  },
  watch: {
    position: {
      immediate: false,
      handler(position) {
        this.marker.setLngLat(position);
      }
    }
  }
};
