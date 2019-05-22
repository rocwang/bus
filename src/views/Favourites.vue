<template>
  <PanelFavourites
    :isCollapsedInitially="isCollapsedInitially"
    :favouritesWithTrips="favouritesWithTrips"
  />
</template>

<script>
import PanelFavourites from "../components/PanelFavourites";
import { favouritesWithTrips$ } from "../store/trips";
import { actionViewFavourites$ } from "../store/actions";

export default {
  name: "Favourites",
  components: { PanelFavourites },
  props: {
    isCollapsedInitially: {
      type: Boolean,
      default: true
    }
  },
  subscriptions() {
    return {
      favouritesWithTrips: favouritesWithTrips$
    };
  },
  beforeRouteEnter(to, from, next) {
    actionViewFavourites$.next();
    next();
  }
};
</script>
