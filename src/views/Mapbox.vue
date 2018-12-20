<template>
  <div :class="$style.root">

    <div>
      <h4>Routes</h4>
      <ul>
        <li v-for="route in routes" :key="route.route_id">
          <button @click="activeRouteId = route.route_id" :style="{'background-color': activeRouteId === route.route_id ? 'red' : 'transparent'}">
            {{route.route_short_name}} - {{route.route_long_name}}
          </button>
        </li>
      </ul>
    </div>

    <div>
      <h4>Stop Time In The Future By Stop</h4>
      <ul>
        <li v-for="stopTime in futureStopTimes" :key="stopTime.stop_id + stopTime.trip_id">
          <button @click="activeStopTime = stopTime" :style="{'background-color': activeStopTime === stopTime ? 'red' : 'transparent'}">
            {{stopTime.arrival_time}}
          </button>
        </li>
      </ul>
    </div>

    <div>
      <h4>Vehicle Position</h4>
      <p>{{vehiclePosition}}</p>
      <div ref="map" :class="$style.map"></div>
    </div>

  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import config from "../config";

export default {
  name: "Mapbox",
  data() {
    return {
      routes: [],
      trips: [],
      stopTimes: [],
      vehiclePosition: null,
      timeoutHandle: 0,
      activeStopCode: 0,
      activeRouteId: "",
      activeStopTime: null,
      map: null,
      busMarker: new mapboxgl.Marker()
    };
  },
  computed: {
    futureStopTimes() {
      const now = new Date();
      const midnight = new Date(now).setHours(0, 0, 0, 0);
      const secondsSinceMidnight = (now - midnight) / 1000;
      return this.stopTimes
        .filter(
          stopTime =>
            stopTime.arrival_time_seconds > secondsSinceMidnight &&
            this.trips.some(trip => trip.trip_id === stopTime.trip_id)
        )
        .sort((a, b) => a.arrival_time_seconds - b.arrival_time_seconds);
    },
    activeTripId() {
      return this.activeStopTime ? this.activeStopTime.trip_id : "";
    }
  },
  async mounted() {
    mapboxgl.accessToken = config.mapboxAccessToken;

    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: "mapbox://styles/mapbox/streets-v10",
      zoom: 15,
      center: { lat: -36.848448, lng: 174.7600023 } // The location of Auckland
    }).on("load", this.initMap);

    this.getStops({ lat: -36.848448, lng: 174.7600023 });
  },
  beforeDestroy() {
    this.map.remove();
  },
  watch: {
    activeStopCode() {
      this.getStopTimesByStop(this.activeStopCode).then(
        stopTimes => (this.stopTimes = stopTimes)
      );
      this.getRoutesByStop(this.activeStopCode).then(
        routes => (this.routes = routes)
      );
    },
    async activeRouteId() {
      this.trips = await this.getTripsByRoute(this.activeRouteId);
    },
    async activeTripId() {
      this.updateVehiclePosition();
      // Update the bus route shape layer
      const shape = await this.getSharpeByTrip(this.activeTripId);
      const coordinates = shape.map(shapePoint => [
        shapePoint.shape_pt_lon,
        shapePoint.shape_pt_lat
      ]);

      if (this.map.getLayer("route")) {
        this.map.removeLayer("route");
      }
      if (this.map.getSource("route")) {
        this.map.removeSource("route");
      }

      this.map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates
          }
        }
      });

      this.map.addLayer(
        {
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#888",
            "line-width": 4
          }
        },
        "stops"
      );
    },
    vehiclePosition() {
      if (this.vehiclePosition) {
        this.busMarker.setLngLat(this.vehiclePosition);
        this.busMarker.addTo(this.map);
        this.map.flyTo({ center: this.busMarker.getLngLat() });
      } else {
        this.busMarker.remove();
      }
    }
  },
  methods: {
    initMap() {
      const geoLocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: false
        },
        trackUserLocation: true
      });

      this.map
        .addControl(geoLocateControl)
        .addLayer({
          id: "stops",
          type: "symbol",
          source: {
            type: "geojson",
            data:
              "https://opendata.arcgis.com/datasets/d5a4db7acb5a45a9a4f1bd08a3f0f0a6_0.geojson"
          },
          layout: {
            "icon-image": "bus-15"
          }
        })
        .on("click", "stops", e => {
          // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
          this.map.flyTo({ center: e.features[0].geometry.coordinates });
          this.activeStopCode = e.features[0].properties.STOPCODE;
        })
        .on("mouseenter", "stops", () => {
          // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
          this.map.getCanvas().style.cursor = "pointer";
        })
        .on("mouseleave", "stops", () => {
          // Change it back to a pointer when it leaves.
          this.map.getCanvas().style.cursor = "";
        });
    },
    async updateVehiclePosition() {
      const vehiclePositions = await this.getVehiclePositions(
        this.activeTripId
      );

      if (vehiclePositions.entity && vehiclePositions.entity[0]) {
        const position = vehiclePositions.entity[0].vehicle.position;
        this.vehiclePosition = {
          lat: position.latitude,
          lng: position.longitude
        };
        this.timeoutHandle = window.setTimeout(
          this.updateVehiclePosition,
          10000
        );
      } else {
        window.clearTimeout(this.timeoutHandle);
        this.timeoutHandle = 0;
        this.vehiclePosition = null;
      }
    },
    callApi(request) {
      return fetch(request, {
        headers: { "Ocp-Apim-Subscription-Key": config.aucklandTransportApiKey }
      })
        .then(response => response.json())
        .then(json => json.response);
    },
    getStops(location) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/stops/geosearch?lat=${
          location.lat
        }&lng=${location.lng}&distance=1000`
      );
    },
    getRoutesByStop(stopId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/routes/stopid/${stopId}`
      );
    },
    getTripsByRoute(routeId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/trips/routeid/${routeId}`
      );
    },
    getStopTimesByStop(stopId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/stopTimes/stopId/${stopId}`
      );
    },
    getStopTimesByTrip(tripId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/stopTimes/tripId/${tripId}`
      );
    },
    getVehiclePositions(tripId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/public/realtime/vehiclelocations?tripid=${tripId}`
      );
    },
    getSharpeByTrip(tripId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/shapes/tripId/${tripId}`
      );
    }
  }
};
</script>

<style module>
.root {
  display: grid;
  height: 100%;
  grid-template:
    ". . ." auto
    / 1fr 1fr 3fr;
}

.map {
  height: 800px;
}
</style>
