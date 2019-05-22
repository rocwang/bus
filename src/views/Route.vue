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
import { stopCode$ } from "../store/stop";
import { routeShortName$ } from "../store/routes";
import { trips$, tripsWithVehicles$, vehicles$ } from "../store/trips";
import { favourites$ } from "../store/favourites";
import { actionViewRoute$ } from "../store/actions";

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
