<template>
  <PanelStop
    :stopCode="stopCode"
    :stopName="stopName"
    :routeShortNames="routeShortNames"
  />
</template>

<script>
import PanelStop from "../components/PanelStop";
import { stopCode$, stopName$, routeShortNamesByStop$ } from "../observables";

export default {
  name: "Stop",
  components: { PanelStop },
  subscriptions() {
    return {
      stopName: stopName$,
      routeShortNames: routeShortNamesByStop$,
      stopCode: stopCode$
    };
  }
};
</script>
