<template>
  <PanelFavourites
    :isCollapsedInitially="isCollapsedInitially"
    :favouritesWithTrips="favouritesWithTrips"
  />
</template>

<script>
import PanelFavourites from "../components/PanelFavourites";
import { favouritesWithTrips$ } from "../observables";

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
  }
};
</script>
