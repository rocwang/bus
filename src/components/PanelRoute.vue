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
          :key="item.trip.trip_id + item.trip.departure_time"
        >
          <Trip
            :headSign="item.trip.trip_headsign"
            :departureTime="item.trip.departure_time"
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
import Buttonizer from "./Buttonizer";

export default {
  name: "PanelRoute",
  components: { Panel, RoundIconRoute, IconCross, Buttonizer, Trip },
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
