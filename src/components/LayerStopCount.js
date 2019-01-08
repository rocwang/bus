import config from "../config";

export default {
  name: "LayerStopCount",
  inject: ["mapPromise"],
  async created() {
    this.map = await this.mapPromise;

    this.map.addLayer({
      id: "stop-count",
      type: "symbol",
      source: "stops",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12
      },
      paint: {
        "text-color": config.colors.oceanBlue
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
