<template>
  <PanelStop
    :stopCode="stopCode"
    :stopName="stopName"
    :routeShortNames="routeShortNames"
  />
</template>

<script>
import PanelStop from "../components/PanelStop";
import { stopCode$, stopName$ } from "../store/stop";
import { actionViewStop$ } from "../store/actions";
import { routeShortNamesByStop$ } from "../store/routes";

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
