<template>
  <Panel>
    <RoundIconStop slot="icon"/>
    <template slot="prefix">Stop</template>
    <template slot="title">{{stopCode}}</template>
    <template slot="buttons">
      <Buttonizer modifier="icon" aria-label="home">
        <button @click="$router.push({name: 'Home'})">
          <IconCross/>
        </button>
      </Buttonizer>
    </template>
    <template slot="subtitle">{{stop.stop_name}}</template>
    <ul slot="body">
      <li v-for="group in routeGroups" :key="group">
          {{group}}
      </li>
    </ul>
  </Panel>
</template>

<script>
import Panel from "./Panel";
import RoundIconStop from "./RoundIconStop";
import IconCross from "./IconCross";
import Buttonizer from "./Buttonizer";
import { getStopByStopCode } from "../api/at";

export default {
  name: "PanelStop",
  components: { Panel, RoundIconStop, IconCross, Buttonizer },
  props: {
    stopCode: {
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
  },
  watch: {
    stopCode: {
      immediate: true,
      async handler(stopCode) {
        this.stop = (await getStopByStopCode(stopCode))[0];
      }
    }
  }
};
</script>
