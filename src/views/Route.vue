<template>
  <PanelRoute
    :routeShortName="routeShortName"
    :stopCode="stopCode"
    :tripsWithVehicles="tripsWithVehicles"
    :favourites="favourites"
  />
</template>

<script>
import PanelRoute from "../components/PanelRoute";
import { stopCode$ } from "../store/stop";
import { routeShortName$ } from "../store/routes";
import { tripsWithVehicles$ } from "../store/trips";
import { favourites$ } from "../store/favourites";
import { actionViewRoute$ } from "../store/actions";

export default {
  name: "Route",
  components: { PanelRoute },
  subscriptions() {
    return {
      stopCode: stopCode$,
      routeShortName: routeShortName$,
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
