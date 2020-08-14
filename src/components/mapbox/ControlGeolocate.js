import mapboxgl from "mapbox-gl";

export default {
  name: "ControlGeolocate",
  inject: ["mapPromise"],
  async created() {
    this.map = await this.mapPromise;
    this.control = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    this.map.addControl(this.control);
  },
  destroyed() {
    this.map.removeControl(this.control);
  },
  render() {
    return null;
  },
};
