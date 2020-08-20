import { featureCollection, lineString } from "@turf/turf";
import bus from "../../assets/bus.svg";
import mapboxgl from "mapbox-gl";

export default {
  name: "LayerShapes",
  inject: ["mapPromise", "colors"],
  props: {
    shapes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    shapes: {
      async handler() {
        const map = await this.mapPromise;
        const geoJson = featureCollection(
          this.shapes.map((shapeCoords) =>
            lineString(shapeCoords.map(([lat, lon]) => [lon, lat]))
          )
        );
        const source = map.getSource("shapes");

        if (source) {
          source.setData(geoJson);
        } else {
          map.addSource("shapes", {
            type: "geojson",
            data: geoJson,
          });
        }

        if (map.getLayer("shapes")) {
          map.removeLayer("shapes");
        }

        map.addLayer(
          {
            id: "shapes",
            type: "line",
            source: "shapes",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": this.colors.blue,
              "line-width": 4,
            },
          },
          "highway-name-path"
        );
      },
      immediate: true,
    },
  },
  async created() {
    this.map = await this.mapPromise;
  },
  destroyed() {
    if (this.map.getLayer("shapes")) {
      this.map.removeLayer("shapes");
    }

    if (this.map.getSource("shapes")) {
      this.map.removeSource("shapes");
    }
  },
  render() {
    return null;
  },
};
