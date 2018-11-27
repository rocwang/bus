<template>
  <div>
    <div style="float:right">
      <h4>Stop Time</h4>
      <ul>
        <li v-for="stopTime in stopTimes" :key="stopTime.stop_sequence">
          <button>{{stopTime.arrival_time}} - {{stopTime.departure_time}}</button>
        </li>
      </ul>
      <h4>realtimeTransitFeed</h4>
      <p>{{realtimeTransitFeed}}</p>
    </div>
    <h4>Stops</h4>
    <ul>
      <li v-for="stop in stops" :key="stop.stop_id">
        <button @click="selectedStopId = stop.stop_id">{{stop.stop_name}}</button>
      </li>
    </ul>
    <h4>Routes</h4>
    <ul>
      <li v-for="route in routes" :key="route.route_id">
        <button @click="selectedRouteId = route.route_id">{{route.route_short_name}}- {{route.route_long_name}}</button>
      </li>
    </ul>
    <h4>Trips</h4>
    <ul>
      <li v-for="trip in trips" :key="trip.trip_id">
        <button @click="selectedTripId = trip.trip_id">{{trip.trip_headsign}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
const subscriptionKey = "a67afd3d4e9e4494a2cae4b310556b35";
const myLocation = {
  latitude: -36.7961008,
  longitude: 174.647264
};

export default {
  name: "HelloWorld",
  data() {
    return {
      stops: [],
      selectedStopId: "",
      routes: [],
      selectedRouteId: "",
      trips: [],
      selectedTripId: "",
      stopTimes: [],
      realtimeTransitFeed: []
    };
  },
  async created() {
    this.stops = await this.getStops(myLocation);
  },
  watch: {
    async selectedStopId() {
      this.routes = await this.getRoutesByStop(this.selectedStopId);
    },
    async selectedRouteId() {
      this.trips = await this.getTripsByRoute(this.selectedRouteId);
    },
    async selectedTripId() {
      this.stopTimes = await this.getStopTimesByTrip(this.selectedTripId);
      this.realtimeTransitFeed = await this.getRealtimeTransitFeed(
        this.selectedTripId
      );
    }
  },
  methods: {
    callApi(request) {
      return fetch(request, {
        headers: { "Ocp-Apim-Subscription-Key": subscriptionKey }
      })
        .then(response => response.json())
        .then(json => json.response);
    },
    getStops(location) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/stops/geosearch?lat=${
          location.latitude
        }&lng=${location.longitude}&distance=300`
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
    getStopTimesByTrip(tripId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/gtfs/stopTimes/tripId/${tripId}`
      );
    },
    getRealtimeTransitFeed(tripId) {
      return this.callApi(
        `https://api.at.govt.nz/v2/public/realtime/?tripid=${tripId}`
      );
    }
  }
};
</script>
