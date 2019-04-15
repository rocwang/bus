<template>
  <PanelRoute
    :shortName="shortName"
    :stopCode="stopCode"
    :trips="trips"
    :vehicles="vehicles"
  />
</template>

<script>
import PanelRoute from "../components/PanelRoute";
import { trips$, stopRouteTrip$, vehicles$ } from "../observables";

export default {
  name: "Route",
  components: { PanelRoute },
  props: {
    stopCode: {
      type: String,
      required: true
    },
    shortName: {
      type: String,
      required: true
    }
  },
  computed: {
    stopRoute() {
      return {
        stopCode: this.stopCode,
        routeShortName: this.shortName
      };
    }
  },
  subscriptions() {
    return {
      trips: trips$,
      vehicles: vehicles$
    };
  },
  watch: {
    stopRoute: {
      immediate: true,
      handler(stopRoute) {
        this.$nextTick(() => stopRouteTrip$.next(stopRoute));
      }
    }
  },
  destroyed() {
    stopRouteTrip$.next({ stopeCode: "", routeShortName: "" });
  }
};
</script>
