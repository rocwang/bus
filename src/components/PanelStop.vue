<template>
  <Panel>
    <template v-slot:icon>
      <RoundIconStop />
    </template>
    <template v-slot:prefix>
      Stop
    </template>
    <template v-slot:title>{{ stopCode }}</template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button @click="$router.push({ name: 'Favourites' })" aria-label="home">
          <IconCross />
        </button>
      </Buttonizer>
    </template>
    <template v-slot:subtitle>{{ stopName }}</template>
    <template v-slot:body>
      <ul>
        <li v-for="group in routeGroups" :key="group">
          {{ group }}
        </li>
      </ul>
    </template>
  </Panel>
</template>

<script>
import Panel from "./Panel";
import RoundIconStop from "./RoundIconStop";
import IconCross from "./IconCross";
import Buttonizer from "./Buttonizer";

export default {
  name: "PanelStop",
  components: { Panel, RoundIconStop, IconCross, Buttonizer },
  props: {
    stopCode: {
      type: String,
      required: true
    },
    stopName: {
      type: String,
      required: true
    },
    routeGroups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      stop: {}
    };
  }
};
</script>
