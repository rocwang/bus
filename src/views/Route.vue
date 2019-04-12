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
import {
  trips$,
  theRouteShortName$,
  stopCode$,
  vehicles$
} from "../observables";

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
  subscriptions() {
    return {
      trips: trips$,
      vehicles: vehicles$
    };
  },
  watch: {
    stopCode: {
      immediate: true,
      handler(stopCode) {
        this.$nextTick(() => stopCode$.next(stopCode));
      }
    },
    shortName: {
      immediate: true,
      handler(shortName) {
        this.$nextTick(() => theRouteShortName$.next(shortName));
      }
    }
  },
  destroyed() {
    stopCode$.next("");
    theRouteShortName$.next("");
  }
};
</script>
