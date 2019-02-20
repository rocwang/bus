<template>
  <PanelStop
    :stopCode="stopCode"
    :stopName="stopName"
    :routeGroups="routeGroups"
  />
</template>

<script>
import PanelStop from "../components/PanelStop";
import { stopCode$, stopName$, routeGroups$ } from "../streams";

export default {
  name: "Stop",
  components: { PanelStop },
  props: {
    stopCode: {
      type: String,
      required: true
    }
  },
  subscriptions() {
    return {
      stopName: stopName$,
      routeGroups: routeGroups$
    };
  },
  watch: {
    stopCode: {
      immediate: true,
      handler(stopCode) {
        this.$nextTick(() => {
          stopCode$.next(stopCode);
        });
      }
    }
  }
};
</script>
