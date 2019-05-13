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
          v-stream:click="del$"
          aria-label="Delete from Favourites"
          key="del"
        >
          <IconFullStar />
        </button>
        <button
          v-else
          v-stream:click="add$"
          aria-label="Add to Favourites"
          key="add"
        >
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
import IconEmptyStar from "./IconEmptyStar";
import IconFullStar from "./IconFullStar";
import Buttonizer from "./Buttonizer";
import { set, del, has } from "../favouritesStore";
import { from, Subject, merge } from "rxjs";
import { switchMap, map } from "rxjs/operators";

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
    }
  },
  subscriptions() {
    this.add$ = new Subject();
    this.del$ = new Subject();

    const added$ = this.add$.pipe(
      switchMap(() => {
        console.log("add");
        return from(set(this.stopCode, this.shortName));
      }),
      map(() => true)
    );

    const deleted$ = this.del$.pipe(
      switchMap(() => {
        console.log("del");
        return from(del(this.stopCode, this.shortName));
      }),
      map(() => false)
    );

    return {
      isFavoured: merge(
        from(has(this.stopCode, this.shortName)),
        added$,
        deleted$
      ).pipe(
        map(value => {
          console.log(value);
          return value;
        })
      )
    };
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
