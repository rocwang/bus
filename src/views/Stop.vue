<template>
  <PanelStop
    :stopCode="stopCode"
    :stopName="stopName"
    :routeShortNames="routeShortNames"
  />
</template>

<script>
import PanelStop from "../components/PanelStop";
import {
  actionViewStop$,
  stopCode$,
  stopName$,
  routeShortNamesByStop$
} from "../observables";

export default {
  name: "Stop",
  components: { PanelStop },
  subscriptions() {
    return {
      stopName: stopName$,
      routeShortNames: routeShortNamesByStop$,
      stopCode: stopCode$
    };
  },
  beforeRouteEnter: (to, from, next) => {
    actionViewStop$.next(to.params.stopCode);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    actionViewStop$.next(to.params.stopCode);
    next();
  },
  beforeRouteLeave(to, from, next) {
    actionViewStop$.next("");
    next();
  }
};
</script>
