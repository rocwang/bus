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
import { trips$, stopCode$, routeShortName$, vehicles$ } from "../observables";

export default {
  name: "Route",
  components: { PanelRoute },
  subscriptions() {
    return {
      trips: trips$,
      vehicles: vehicles$,
      stopCode: stopCode$,
      shortName: routeShortName$
    };
  }
};
</script>
