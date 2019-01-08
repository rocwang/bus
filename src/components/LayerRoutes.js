export default {
  name: "LayerRoutes",
  inject: ["mapPromise"],
  props: {
    routes: {
      type: Array,
      required: true
    }
  },
  async created() {
    this.map = await this.mapPromise;
    this.map.addLayer(
      {
        id: "routes",
        type: "line",
        source: "routes",
        layout: {
          visibility: "none",
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#888",
          "line-width": 4
        }
      },
      "road-label-small"
    );
  },
  destroyed() {
    this.map.removeLayer("routes");
  },
  render() {
    return null;
  },
  watch: {
    routes: {
      async handler() {
        const routePatterns = this.routes.map(route =>
          route.route_id.substring(0, 5)
        );
        this.map
          .setFilter("routes", [
            "match",
            ["get", "ROUTEPATTERN"],
            routePatterns,
            true,
            false
          ])
          .setLayoutProperty("routes", "visibility", "visible");
      },
      immediate: false
    }
  }
};
