<template>
  <Panel>
    <template v-slot:icon>
      <RoundIconStop />
    </template>
    <template v-slot:prefix>
      Routes
    </template>
    <template v-slot:title>{{ group }}</template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button @click="$router.back()" aria-label="back">
          <IconCross />
        </button>
      </Buttonizer>
    </template>
    <template v-slot:subtitle
      >ROUTE LONG NAME</template
    >
    <template v-slot:body> </template>
  </Panel>
</template>

<script>
import Panel from "./Panel";
import RoundIconStop from "./RoundIconStop";
import IconCross from "./IconCross";
import Buttonizer from "./Buttonizer";

export default {
  name: "PanelRouteGroup",
  components: { Panel, RoundIconStop, IconCross, Buttonizer },
  props: {
    group: {
      type: String,
      required: true
    }
  }
};
</script>
