<template>
  <Panel :isCollapsed="isCollapsed">
    <template v-slot:icon>
      <RoundIconStarFull />
    </template>
    <template v-slot:title>
      Favourites
    </template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button aria-label="edit">
          <IconEdit />
        </button>
        <button @click="handleArrowClick" aria-label="toggle the panel">
          <IconArrow :direction="isCollapsed ? 'up' : 'down'" />
        </button>
      </Buttonizer>
    </template>

    <template v-slot:body>
      <ul>
        <li
          v-for="item in items"
          :key="`${item.stopCode}-${item.routeShortName}`"
        >
          <router-link
            :class="$style.itemLink"
            :to="{
              name: 'Route',
              params: {
                stopCode: item.stopCode,
                shortName: item.routeShortName
              }
            }"
          >
            <Trip
              :headSign="item.name"
              :departureTime="item.trip ? item.trip.departure_time : undefined"
              :isRealTime="false"
              :occupancyStatus="6"
            />
          </router-link>
        </li>
      </ul>
    </template>
  </Panel>
</template>

<script>
import Panel from "../components/Panel";
import RoundIconStarFull from "../components/RoundIconStarFull";
import IconArrow from "../components/IconArrow";
import IconEdit from "../components/IconEdit";
import Buttonizer from "../components/Buttonizer";
import Trip from "./Trip";
import { list } from "../favouritesStore";
import { getNexTripsByStopRouteItems } from "../api/gtfs";

export default {
  name: "PanelFavourites",
  components: {
    Panel,
    RoundIconStarFull,
    IconArrow,
    IconEdit,
    Buttonizer,
    Trip
  },
  props: {
    isCollapsedInitially: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isCollapsed: this.isCollapsedInitially,
      items: []
    };
  },
  async created() {
    this.items = await list();
    const trips = await getNexTripsByStopRouteItems(this.items);
    this.items = this.items.map(item => ({
      ...item,
      trip: trips.find(trip => {
        console.log(
          trip.stop_code,
          item.stopCode,
          trip.route_short_name,
          item.routeShortname
        );
        return (
          trip.stop_code === item.stopCode &&
          trip.route_short_name === item.routeShortName
        );
      })
    }));
  },
  methods: {
    handleArrowClick() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>

<style module>
.itemLink {
  display: block;
}
</style>
