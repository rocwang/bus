<template>
  <Panel>
    <template v-slot:icon>
      <RoundIconStop />
    </template>
    <template v-slot:prefix>
      Route
    </template>
    <template v-slot:title>{{ shortName }}</template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button @click="$router.back()" aria-label="back">
          <IconCross />
        </button>
      </Buttonizer>
    </template>
    <template v-slot:subtitle>
      Stop Code: {{ stopCode }}
    </template>
    <template v-slot:body>
      <ul :class="$style.tripList">
        <li
          v-for="item in tripsWithVehicles"
          :key="item.trip.trip_id + item.trip.departure_time"
        >
          {{ item.trip.trip_headsign }} - {{ item.trip.departure_time }}
          <span v-if="item.vehicle && item.vehicle.occupancy_status">
            - occupancy_status: {{ item.vehicle.occupancy_status }}
          </span>
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
  name: "PanelRoute",
  components: { Panel, RoundIconStop, IconCross, Buttonizer },
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
    }
  },
  computed: {
    tripsWithVehicles() {
      return this.trips.map(trip => ({
        trip,
        vehicle: this.vehicles.find(
          vehicle => vehicle.trip.trip_id === trip.trip_id
        )
      }));
    }
  }
};
</script>

<style module>
.tripList {
  height: 180px;
  overflow: auto;
}
</style>
