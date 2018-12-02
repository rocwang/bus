<template>
  <div :class="$style.root">

    <div>
      <h4>Stops</h4>
      <ul>
        <li v-for="stop in stops" :key="stop.stop_id">
          <button @click="selectedStop = stop" :style="{'background-color': selectedStop === stop ? 'red' : 'transparent'}">{{stop.stop_name}}
          </button>
        </li>
      </ul>
    </div>

    <div>
      <h4>Routes</h4>
      <ul>
        <li v-for="route in routes" :key="route.route_id">
          <button @click="selectedRoute = route" :style="{'background-color': selectedRoute === route ? 'red' : 'transparent'}">
            {{route.route_short_name}} - {{route.route_long_name}}
          </button>
        </li>
      </ul>
    </div>

    <div>
      <h4>Stop Time In The Future By Stop</h4>
      <ul>
        <li v-for="stopTime in activeStopTimes" :key="stopTime.stop_id + stopTime.trip_id">
          <button @click="selectedStopTime = stopTime" :style="{'background-color': selectedStopTime === stopTime ? 'red' : 'transparent'}">
            {{stopTime.arrival_time}} - {{stopTime.departure_time}}
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
const googleMapsKey = "AIzaSyDj8dcF-SG59C1bzC0HwflFliQRQOlZ7TU";
const aucklandTransportApiKey = "a67afd3d4e9e4494a2cae4b310556b35";
const myLocation = {
  lat: -36.8492847,
  lng: 174.7583554
};
const googleMapsPromise = new Promise(resolve => {
  if (window.google && window.google.maps) {
    resolve(window.google.maps);
    return;
  }

  window.googleMapsCallback = () => {
    resolve(window.google.maps);
  };

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&callback=googleMapsCallback`;
  script.async = true;

  document.body.appendChild(script);
});

export default {
  name: "HelloWorld",
  data() {
    return {
      stops: [],
      routes: [],
      trips: [],
      stopTimes: [],
      vehiclePosition: null,
      timeoutHandle: 0,
      selectedStop: null,
      selectedRoute: null,
      selectedStopTime: null,
      map: null,
      marker: null
    };
  },
  computed: {
    activeStopTimes() {
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
    }
  },
  async created() {
    this.stops = await this.getStops(myLocation);
  },
  async mounted() {
    const googleMaps = await googleMapsPromise;
    this.map = new googleMaps.Map(this.$refs.map, {
      center: myLocation,
      zoom: 12
    });
    this.marker = new googleMaps.Marker({
      map: this.map
    });
  },
  watch: {
    selectedStop() {
      this.getStopTimesByStop(this.selectedStop.stop_id).then(
        stopTimes => (this.stopTimes = stopTimes)
      );
      this.getRoutesByStop(this.selectedStop.stop_id).then(
        routes => (this.routes = routes)
      );
    },
    async selectedRoute() {
      this.trips = await this.getTripsByRoute(this.selectedRoute.route_id);
    },
    async selectedStopTime() {
      this.updateVehiclePosition();
    },
    vehiclePosition() {
      if (this.vehiclePosition) {
        this.marker.setPosition(this.vehiclePosition);
        if (!this.marker.getMap()) {
          this.marker.setMap(this.map);
        }
      } else {
        this.marker.setMap(null);
      }
    }
  },
  methods: {
    async updateVehiclePosition() {
      const vehiclePositions = await this.getVehiclePositions(
        this.selectedStopTime.trip_id
      );

      if (vehiclePositions.entity && vehiclePositions.entity[0]) {
        const position = vehiclePositions.entity[0].vehicle.position;
        console.log(position);
        this.vehiclePosition = {
          lat: position.latitude,
          lng: position.longitude
        };
        this.timeoutHandle = window.setTimeout(
          this.updateVehiclePosition,
          5000
        );
      } else {
        window.clearTimeout(this.timeoutHandle);
        this.timeoutHandle = 0;
        this.vehiclePosition = null;
      }
    },
    callApi(request) {
      return fetch(request, {
        headers: { "Ocp-Apim-Subscription-Key": aucklandTransportApiKey }
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
    }
  }
};
</script>

<style module>
.root {
  display: grid;
  height: 100%;
  grid-template:
    ". . . . " auto
    / 1fr 1fr 1fr 3fr;
}

.map {
  height: 500px;
}
</style>
