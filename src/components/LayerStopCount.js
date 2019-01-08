export default {
  name: "LayerStopCount",
  inject: ["mapPromise", "config"],
  async created() {
    this.map = await this.mapPromise;

    this.map.addLayer({
      id: "stop-count",
      type: "symbol",
      source: "stops",
      filter: ["has", "point_count"],
      minzoom: 15,
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12
      },
      paint: {
        "text-color": this.config.colors.oceanBlue
      }
    });
  },
  destroyed() {
    this.map.removeLayer("stop-count");
  },
  render() {
    return null;
  }
};
