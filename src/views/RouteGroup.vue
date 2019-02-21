<template>
  <PanelRouteGroup :group="group" />
</template>

<script>
import PanelRouteGroup from "../components/PanelRouteGroup";
export default {
  name: "RouteGroup",
  components: { PanelRouteGroup },
  props: {
    group: {
      type: String,
      required: true
    }
  }
};
</script>
