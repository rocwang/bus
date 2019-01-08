export default {
  name: "LayerStopClusters",
  inject: ["mapPromise", "config"],
  async created() {
    this.map = await this.mapPromise;

    this.map.addLayer({
      id: "stop-clusters",
      type: "circle",
      source: "stops",
      filter: ["has", "point_count"],
      minzoom: 15,
      paint: {
        "circle-color": this.config.colors.yellow,
        "circle-radius": 20
      }
    });

    // Event handling
    this.map.on("click", "stop-clusters", this.handleStopClusterClick);
  },
  destroyed() {
    this.map.removeLayer("stop-clusters");
  },
  render() {
    return null;
  },
  methods: {
    handleStopClusterClick(e) {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ["stop-clusters"]
      });
      const clusterId = features[0].properties.cluster_id;
      this.map
        .getSource("stops")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) {
            throw err;
          }

          this.map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
          });
        });
    }
  }
};
