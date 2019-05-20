<template>
  <PanelRoute
    :shortName="shortName"
    :stopCode="stopCode"
    :trips="trips"
    :vehicles="vehicles"
    :tripsWithVehicles="tripsWithVehicles"
    :favourites="favourites"
  />
</template>

<script>
import PanelRoute from "../components/PanelRoute";
import { trips$, stopCode$, routeShortName$, vehicles$ } from "../observables";
import { tripsWithVehicles$ } from "../observables";
import { favourites$ } from "../favouritesStore";

export default {
  name: "Route",
  components: { PanelRoute },
  subscriptions() {
    return {
      trips: trips$,
      vehicles: vehicles$,
      stopCode: stopCode$,
      shortName: routeShortName$,
      tripsWithVehicles: tripsWithVehicles$,
      favourites: favourites$
    };
  }
};
</script>
