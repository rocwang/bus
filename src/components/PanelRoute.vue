<template>
  <Panel>
    <template v-slot:icon>
      <RoundIcon name="Route" :bg="colors.yellow" :color="colors.oceanBlue" />
    </template>
    <template v-slot:prefix>
      Route
    </template>
    <template v-slot:title>{{ routeShortName }}</template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button
          v-if="isFavoured"
          @click="del"
          aria-label="Delete from Favourites"
          key="del"
        >
          <Icon name="FullStar" :color="colors.yellow" />
        </button>
        <button v-else @click="add" aria-label="Add to Favourites" key="add">
          <Icon name="EmptyStar" :color="colors.yellow" />
        </button>

        <button @click="$router.back()" aria-label="back">
          <Icon name="Cross" :color="colors.yellow" />
        </button>
      </Buttonizer>
    </template>
    <template v-slot:subtitle> Stop Code: {{ stopCode }} </template>
    <template v-slot:body>
      <ul>
        <li
          v-for="item in tripsWithVehicles"
          :key="item.trip_id + item.departure_time"
        >
          <Trip
            :headSign="item.trip_headsign"
            :departureTime="item.departure_time"
            :isRealTime="!!item.vehicle"
            :occupancyStatus="
              item.vehicle && item.vehicle.occupancy_status
                ? item.vehicle.occupancy_status
                : undefined
            "
          />
        </li>
      </ul>
    </template>
  </Panel>
</template>

<script>
import Panel from "./Panel";
import RoundIcon from "./RoundIcon";
import Trip from "./Trip";
import Icon from "./Icon";
import Buttonizer from "./Buttonizer";
import {
  actionRemoveFromFavourites$,
  actionAddToFavourites$
} from "../store/actions";

export default {
  name: "PanelRoute",
  inject: ["colors"],
  components: {
    Buttonizer,
    Icon,
    Panel,
    RoundIcon,
    Trip
  },
  props: {
    stopCode: {
      type: String,
      default: ""
    },
    routeShortName: {
      type: String,
      default: ""
    },
    tripsWithVehicles: {
      type: Array,
      default: () => []
    },
    favourites: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    add() {
      actionAddToFavourites$.next({
        stopCode: this.stopCode,
        routeShortName: this.routeShortName
      });
    },
    del() {
      actionRemoveFromFavourites$.next({
        stopCode: this.stopCode,
        routeShortName: this.routeShortName
      });
    }
  },
  computed: {
    isFavoured() {
      return this.favourites.some(
        ({ stopCode, routeShortName }) =>
          stopCode === this.stopCode && routeShortName === this.routeShortName
      );
    }
  }
};
</script>
