<template>
  <div :class="$style.root"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import config from "../config";
import stopIcon from "../assets/stop.png";
import * as at from "../api/at";

mapboxgl.accessToken = config.mapboxAccessToken;

export default {
  name: "Mapbox",
  data() {
    return {
      routes: [],
      trips: [],
      selectedStopCode: 0,
      timeoutHandle: 0
    };
  },
  created() {
    this.busMarkers = [];
  },
  async mounted() {
    this.map = await new Promise(resolve => {
      const map = new mapboxgl.Map({
        container: this.$el,
        style: "mapbox://styles/mapbox/streets-v10",
        bounds: [[174.223, -37.348], [175.314, -36.41]] // The bounds of Auckland
      }).on("load", () => resolve(map));
    });

    this.initMap();
  },
  beforeDestroy() {
    this.map.remove();
  },
  watch: {
    routes() {
      const routePatterns = this.routes.map(route =>
        route.route_id.substring(0, 5)
      );
      this.map
        .setFilter("routes", ["in", "ROUTEPATTERN", ...routePatterns])
        .setLayoutProperty("routes", "visibility", "visible");
    },
    selectedStopCode() {
      at.getRoutesByStop(this.selectedStopCode).then(
        routes =>
          (this.routes = routes.sort((a, b) =>
            a.route_short_name.localeCompare(b.route_short_name)
          ))
      );
      at.getStopInfoByStopCode(this.selectedStopCode).then(
        trips => (this.trips = trips)
      );
    },
    async trips() {
      this.updateVehiclePositions();
    }
  },
  methods: {
    async initMap() {
      // Stop source
      this.map.addSource("stops", {
        type: "geojson",
        data:
          "https://opendata.arcgis.com/datasets/d5a4db7acb5a45a9a4f1bd08a3f0f0a6_0.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      // Route source
      this.map.addSource("routes", {
        type: "geojson",
        data:
          "https://opendata.arcgis.com/datasets/d5a4db7acb5a45a9a4f1bd08a3f0f0a6_2.geojson"
      });

      //  Geolocate control
      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: false
          },
          trackUserLocation: true
        })
      );

      // Route layer
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

      // Stop cluster layer
      this.map.addLayer({
        id: "stop-clusters",
        type: "circle",
        source: "stops",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      // Stop count layer
      this.map.addLayer({
        id: "stop-count",
        type: "symbol",
        source: "stops",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12
        }
      });

      // Stop icon
      const image = await new Promise((resolve, reject) =>
        this.map.loadImage(
          stopIcon,
          (error, image) => (error ? reject(error) : resolve(image))
        )
      );
      this.map.addImage("stop", image);

      // Stop Layer
      this.map.addLayer({
        id: "stops",
        type: "symbol",
        source: "stops",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": "stop",
          "icon-size": 0.5
        }
      });

      // Event handling
      this.map
        .on("click", "stops", this.handleStopClick)
        .on("mouseenter", "stops", this.handleStopMouseEnter)
        .on("mouseleave", "stops", this.handleStopMouseLeave)
        .on("click", "stop-clusters", this.handleStopClusterClick);
    },
    handleStopClick(e) {
      // Center the map on the coordinates of the clicked stop
      this.map.flyTo({ center: e.features[0].geometry.coordinates });
      this.selectedStopCode = e.features[0].properties.STOPCODE;
    },
    handleStopMouseEnter() {
      // Change the cursor to a pointer when the it enters a stop
      this.map.getCanvas().style.cursor = "pointer";
    },
    handleStopMouseLeave() {
      // Change it back to a pointer when it leaves.
      this.map.getCanvas().style.cursor = "";
    },
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
    },
    async updateVehiclePositions() {
      window.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = 0;

      const vehiclePositions = await at.getVehiclePositions(
        this.trips.map(t => t.trip_id).join(",")
      );

      if (vehiclePositions.entity) {
        vehiclePositions.entity
          .map(e => ({
            lat: e.vehicle.position.latitude,
            lng: e.vehicle.position.longitude
          }))
          .forEach((position, index) => {
            console.log(position);
            if (this.busMarkers[index]) {
              this.busMarkers[index].setLngLat(position);
            } else {
              this.busMarkers.push(
                new mapboxgl.Marker().setLngLat(position).addTo(this.map)
              );
            }
          });

        if (vehiclePositions.entity.length < this.busMarkers.length) {
          for (
            let i = vehiclePositions.entity.length;
            i < this.busMarkers.length;
            i++
          ) {
            this.busMarkers[i].remove();
          }
          this.busMarkers = this.busMarkers.splice(
            0,
            vehiclePositions.entity.length
          );
        }

        this.timeoutHandle = window.setTimeout(
          this.updateVehiclePositions,
          10000
        );
      } else {
        this.busMarkers.forEach(marker => marker.remove());
        this.busMarkers = [];
      }
    }
  }
};
</script>

<style module>
.root {
  width: 100%;
  height: 100%;
}
</style>
