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
      <ul :class="$style.routeList">
        <li
          v-for="(group, index) in routeGroups"
          :key="group"
          :class="$style.route"
          :style="getRouteLeftBorderStyle(index)"
        >
          <router-link
            :class="$style.routeLink"
            :to="{ name: 'RouteGroup', params: { group } }"
          >
            <span :class="$style.routeName">{{ group }}</span>
          </router-link>
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
  inject: ["colors"],
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
  },
  methods: {
    getRouteLeftBorderStyle(index) {
      const colors = Object.values(this.colors).filter(
        color => color !== this.colors.oceanBlue
      );
      return { "border-left-color": colors[index % colors.length] };
    }
  }
};
</script>

<style module>
.routeList {
  display: grid;
  grid-template:
    ". . . . " auto
    / 1fr 1fr 1fr 1fr;
  grid-gap: 18px;
}

.route {
  width: 81px;
  height: 44px;
  line-height: 44px;
  background-color: var(--c-white);
  border-left-width: 10px;
  border-left-style: solid;
  color: var(--c-gray-a);
  font-size: 2.4rem;
  text-align: center;
  white-space: nowrap;
}

.routeLink {
  display: block;
}

.routeName {
  display: block;
  transform: translateY(2px);
}
</style>
