export default {
  name: "LayerRoute",
  inject: ["mapPromise", "colors"],
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
    lineColors() {
      return [
        this.colors.green,
        this.colors.blue,
        this.colors.yellow,
        this.colors.red,
        this.colors.orange
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
            "line-color": this.lineColors[index % this.lineColors.length],
            "line-width": 4
          }
        },
        "road-label-small"
      );
    }
  }
};
