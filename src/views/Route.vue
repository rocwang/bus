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
import { actionViewRoute$ } from "../observables";

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
  },
  beforeRouteEnter(to, from, next) {
    actionViewRoute$.next({
      stopCode: to.params.stopCode,
      routeShortName: to.params.shortName
    });
    next();
  },
  beforeRouteUpdate(to, from, next) {
    actionViewRoute$.next({
      stopCode: to.params.stopCode,
      routeShortName: to.params.shortName
    });
    next();
  },
  beforeRouteLeave(to, from, next) {
    actionViewRoute$.next({
      stopCode: "",
      routeShortName: ""
    });
    next();
  }
};
</script>
