<template>
  <PanelFavourites />
</template>

<script>
import PanelFavourites from "../components/PanelFavourites";
import { mapMutations } from "vuex";

export default {
  name: "Home",
  components: { PanelFavourites },
  methods: mapMutations(["setRoutes"]),
  created() {
    this.setRoutes([]);
  }
};
</script>
