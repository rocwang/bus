export default {
  name: "LayerRoute",
  inject: ["mapPromise", "config"],
  props: {
    route: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    colors() {
      return [
        this.config.colors.green,
        this.config.colors.blue,
        this.config.colors.yellow,
        this.config.colors.red,
        this.config.colors.orange
      ];
    }
  },
  render() {
    return null;
  },
  async created() {
    this.map = await this.mapPromise;
    this.addLayer(
      this.route.route_id,
      this.route.route_id.substring(0, 5),
      this.index
    );
  },
  destroyed() {
    this.map.removeLayer(this.route.route_id);
  },
  methods: {
    async addLayer(id, routePattern, index) {
      const map = await this.mapPromise;
      map.addLayer(
        {
          id,
          type: "line",
          source: "routes",
          filter: ["==", ["get", "ROUTEPATTERN"], routePattern],
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            // "line-translate": [index * 4, index * 4],
            // "line-dasharray": [2, 2],
            "line-color": this.colors[index % this.colors.length],
            "line-width": 4
          }
        },
        "road-label-small"
      );
    }
  }
};
