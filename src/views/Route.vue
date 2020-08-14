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
import { tripsWithVehicles$ } from "../store/trips";
import { favourites$ } from "../store/favourites";
import { actionViewRoute$ } from "../store/actions";

export default {
  name: "Route",
  components: { PanelRoute },
  subscriptions() {
    return {
      stopCode: stopCode$,
      tripsWithVehicles: tripsWithVehicles$,
      favourites: favourites$,
    };
  },
  computed: {
    routeShortName() {
      return this.$route.params.shortName;
    },
  },
  created() {
    actionViewRoute$.next({
      stopCode: this.$route.params.stopCode,
      routeShortName: this.$route.params.shortName,
    });
  },
  beforeRouteUpdate(to, from, next) {
    actionViewRoute$.next({
      stopCode: to.params.stopCode,
      routeShortName: to.params.shortName,
    });
    next();
  },
  beforeRouteLeave(to, from, next) {
    actionViewRoute$.next({
      stopCode: "",
      routeShortName: "",
    });
    next();
  },
};
</script>
