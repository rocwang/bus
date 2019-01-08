export default {
  name: "SourceRoutes",
  inject: ["mapPromise"],
  async created() {
    this.map = await this.mapPromise;
    this.map.addSource("routes", {
      type: "geojson",
      attribution: "Auckland Transport",
      data:
        "https://opendata.arcgis.com/datasets/d5a4db7acb5a45a9a4f1bd08a3f0f0a6_2.geojson"
    });
  },
  destroyed() {
    // this.map.removeSource("routes");
  },
  render() {
    return null;
  }
};
