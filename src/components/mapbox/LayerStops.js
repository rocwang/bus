export default {
  name: "LayerStops",
  inject: ["mapPromise"],
  props: {
    stopCode: {
      type: String,
      default: ""
    }
  },
  watch: {
    stopCode: {
      handler() {
        this.toggleCurrentStop();
      },
      immediate: true
    }
  },
  async created() {
    this.map = await this.mapPromise;

    this.map.addLayer({
      id: "stops",
      type: "symbol",
      source: "stops",
      // filter: ["!", ["has", "point_count"]],
      minzoom: 15,
      layout: {
        "icon-image": "stop",
        "icon-allow-overlap": true,
        "icon-size": 0.5
      }
    });

    this.toggleCurrentStop();

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
    async toggleCurrentStop() {
      this.map = await this.mapPromise;

      if (!this.map.getLayer("stops")) {
        return;
      }

      if (this.stopCode) {
        this.map.setFilter("stops", [
          "==",
          ["get", "STOPCODE"],
          Number(this.stopCode)
        ]);
        this.map.setLayerZoomRange("stops", 0, 24);
      } else {
        this.map.setFilter("stops");
        this.map.setLayerZoomRange("stops", 15, 24);
      }
    },
    handleStopClick(e) {
      // Center the map on the coordinates of the clicked stop
      this.map.easeTo({ center: e.features[0].geometry.coordinates });
      this.$emit("click", e.features[0].properties.STOPCODE.toString());
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
