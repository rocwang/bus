<template>
  <Panel>
    <template v-slot:icon>
      <RoundIconRoute />
    </template>
    <template v-slot:prefix>
      Route
    </template>
    <template v-slot:title>{{ shortName }}</template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button
          v-if="isFavoured"
          @click="del"
          aria-label="Delete from Favourites"
          key="del"
        >
          <IconFullStar />
        </button>
        <button v-else @click="add" aria-label="Add to Favourites" key="add">
          <IconEmptyStar />
        </button>

        <button @click="$router.back()" aria-label="back">
          <IconCross />
        </button>
      </Buttonizer>
    </template>
    <template v-slot:subtitle>
      Stop Code: {{ stopCode }}
    </template>
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
import RoundIconRoute from "./RoundIconRoute";
import Trip from "./Trip";
import IconCross from "./IconCross";
import IconEmptyStar from "./IconEmptyStar";
import IconFullStar from "./IconFullStar";
import Buttonizer from "./Buttonizer";
import {
  actionRemoveFromFavourites$,
  actionAddToFavourites$
} from "../store/actions";

export default {
  name: "PanelRoute",
  components: {
    Buttonizer,
    IconCross,
    IconEmptyStar,
    IconFullStar,
    Panel,
    RoundIconRoute,
    Trip
  },
  props: {
    stopCode: {
      type: String,
      required: true
    },
    shortName: {
      type: String,
      required: true
    },
    trips: {
      type: Array,
      required: true
    },
    vehicles: {
      type: Array,
      required: true
    },
    tripsWithVehicles: {
      type: Array,
      required: true
    },
    favourites: {
      type: Array,
      required: true
    }
  },
  methods: {
    add() {
      actionAddToFavourites$.next({
        stopCode: this.stopCode,
        routeShortName: this.shortName
      });
    },
    del() {
      actionRemoveFromFavourites$.next({
        stopCode: this.stopCode,
        routeShortName: this.shortName
      });
    }
  },
  computed: {
    isFavoured() {
      return !!this.favourites.find(
        ({ stopCode, routeShortName }) =>
          stopCode === this.stopCode && routeShortName === this.shortName
      );
    }
  }
};
</script>
