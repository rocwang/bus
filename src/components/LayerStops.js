export default {
  name: "LayerStops",
  inject: ["mapPromise"],
  async created() {
    this.map = await this.mapPromise;

    this.map.addLayer({
      id: "stops",
      type: "symbol",
      source: "stops",
      filter: ["!", ["has", "point_count"]],
      minzoom: 15,
      layout: {
        "icon-image": "stop",
        "icon-size": 0.5
      }
    });

    // Event handling
    this.map
      .on("click", "stops", this.handleStopClick)
      .on("mouseenter", "stops", this.handleStopMouseEnter)
      .on("mouseleave", "stops", this.handleStopMouseLeave);
  },
  destroyed() {
    this.map.removeLayer("stops");
  },
  render() {
    return null;
  },
  methods: {
    handleStopClick(e) {
      // Center the map on the coordinates of the clicked stop
      this.map.easeTo({ center: e.features[0].geometry.coordinates });
      this.$emit("click", e.features[0].properties.STOPCODE);
    },
    handleStopMouseEnter() {
      // Change the cursor to a pointer when the it enters a stop
      this.map.getCanvas().style.cursor = "pointer";
    },
    handleStopMouseLeave() {
      // Change it back to a pointer when it leaves.
      this.map.getCanvas().style.cursor = "";
    }
  }
};
