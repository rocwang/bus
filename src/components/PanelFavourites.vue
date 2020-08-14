<template>
  <Panel :isCollapsed="isCollapsed">
    <template v-slot:icon>
      <RoundIcon
        name="FullStar"
        :bg="colors.yellow"
        :color="colors.oceanBlue"
      />
    </template>
    <template v-slot:title>
      Favourites
    </template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button aria-label="edit">
          <Icon name="Edit" :color="colors.yellow" />
        </button>
        <button @click="handleArrowClick" aria-label="toggle the panel">
          <Icon
            name="Arrow"
            :direction="isCollapsed ? 'up' : 'down'"
            :color="colors.yellow"
          />
        </button>
      </Buttonizer>
    </template>

    <template v-slot:body>
      <ul>
        <li
          v-for="item in favouritesWithTrips"
          :key="`${item.stopCode}-${item.routeShortName}-${
            item.trip ? item.trip.trip_id : ''
          }`"
        >
          <router-link
            :class="$style.itemLink"
            :to="{
              name: 'Route',
              params: {
                stopCode: item.stopCode,
                shortName: item.routeShortName,
              },
            }"
          >
            <Trip
              :headSign="item.name"
              :departureTime="item.trip ? item.trip.departure_time : undefined"
              :isRealTime="!!(item.trip && item.trip.vehicle)"
              :occupancyStatus="
                item.trip &&
                item.trip.vehicle &&
                item.trip.vehicle.occupancy_status
                  ? item.trip.vehicle.occupancy_status
                  : undefined
              "
              :isDetailEnabled="false"
            />
          </router-link>
        </li>
      </ul>
    </template>
  </Panel>
</template>

<script>
import Panel from "../components/Panel";
import RoundIcon from "./RoundIcon";
import Icon from "./Icon";
import Buttonizer from "../components/Buttonizer";
import Trip from "./Trip";

export default {
  name: "PanelFavourites",
  inject: ["colors"],
  components: {
    Panel,
    RoundIcon,
    Icon,
    Buttonizer,
    Trip,
  },
  props: {
    isCollapsedInitially: {
      type: Boolean,
      default: true,
    },
    favouritesWithTrips: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isCollapsed: this.isCollapsedInitially,
    };
  },
  methods: {
    handleArrowClick() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style module>
.itemLink {
  display: block;
}
</style>
