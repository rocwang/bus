<template>
  <PanelStop
    :stopCode="stopCode"
    :stopName="stopName"
    :routeShortNames="routeShortNames"
  />
</template>

<script>
import PanelStop from "../components/PanelStop";
import { stopCode$, stopName$, routeShortNames$ } from "../observables";

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
      routeShortNames: routeShortNames$
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
  },
  destroyed() {
    stopCode$.next("");
  }
};
</script>
