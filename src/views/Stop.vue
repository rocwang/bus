<template>
  <PanelStop :stopCode="stopCode" :routeGroups="routeGroups" />
</template>

<script>
import PanelStop from "../components/PanelStop";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Stop",
  components: { PanelStop },
  props: {
    stopCode: {
      type: String,
      required: true
    }
  },
  computed: { ...mapState(["routes"]), ...mapGetters(["routeGroups"]) },
  methods: mapActions(["getRoutesByStop"]),
  watch: {
    stopCode: {
      immediate: true,
      handler(stopCode) {
        this.getRoutesByStop(stopCode);
      }
    }
  }
};
</script>
