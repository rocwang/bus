export default {
  name: "SourceStops",
  inject: ["mapPromise"],
  async created() {
    this.map = await this.mapPromise;
    this.map.addSource("stops", {
      type: "geojson",
      data:
        "https://opendata.arcgis.com/datasets/d5a4db7acb5a45a9a4f1bd08a3f0f0a6_0.geojson",
      attribution: "Auckland Transport",
      cluster: true,
      // clusterMaxZoom: 15, // Max zoom to cluster points on
      clusterRadius: 30 // Radius of each cluster when clustering points (defaults to 50)
    });
  },
  destroyed() {
    this.map.removeSource("stops");
  },
  render() {
    return null;
  }
};
