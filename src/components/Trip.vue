<template>
  <Buttonizer>
    <div :class="$style.root" @click="toggle">
      <span :class="$style.headSign">
        {{ headSign }}
        <template v-if="isRealTime">
          (R)
        </template>
        <template v-else>
          (S)
        </template>
      </span>
      <span :class="$style.departureTime">
        {{ formattedDepartureTime }}
      </span>
      <meter
        v-if="occupancyStatus"
        :class="$style.occupancyStatus"
        :value="occupancyStatus"
        min="0"
        max="6"
        low="2"
        high="4"
        optimum="2"
      >
        Occupancy: {{ formattedOccupancy }}
      </meter>

      <table :class="$style.detail" v-if="isExpanded">
        <tbody>
          <tr>
            <td>Departure</td>
            <td :class="$style.value">{{ departureTime }}</td>
          </tr>
          <tr>
            <td>Occupancy</td>
            <td :class="$style.value">{{ formattedOccupancy }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Buttonizer>
</template>

<script>
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { interval } from "rxjs";
import { map, startWith } from "rxjs/operators";
import Buttonizer from "./Buttonizer";

export default {
  name: "Trip",
  components: { Buttonizer },
  props: {
    headSign: {
      type: String,
      required: true
    },
    departureTime: {
      type: String,
      required: false
    },
    occupancyStatus: {
      type: Number,
      required: false
    },
    isRealTime: {
      type: Boolean,
      required: true
    },
    isDetailEnabled: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    formattedOccupancy() {
      const status = [
        "Empty",
        "Many seats available",
        "Few seats available",
        "Standing room only",
        "Crushed standing room only",
        "Full",
        "Not accepting passengers"
      ];
      return status[this.occupancyStatus] || "N/A";
    }
  },
  data() {
    return {
      isExpanded: false
    };
  },
  subscriptions() {
    return {
      formattedDepartureTime: interval(30000).pipe(
        startWith(0),
        map(() => {
          if (this.departureTime) {
            const timeComponents = this.departureTime.split(":");
            const now = new Date();
            const then = new Date(now);
            then.setHours(timeComponents[0]);
            then.setMinutes(timeComponents[1]);
            then.setSeconds(timeComponents[2]);

            // Show a relative time if the departure time is less than 44 mins 30 secs
            return then.getTime() - now.getTime() < (44 * 60 + 30) * 1000
              ? distanceInWordsToNow(then, { addSuffix: true })
              : this.departureTime;
          } else {
            return "N/A";
          }
        })
      )
    };
  },
  methods: {
    toggle() {
      if (this.isDetailEnabled) {
        this.isExpanded = !this.isExpanded;
      }
    }
  }
};
</script>

<style module>
.root {
  display: grid;
  grid-template:
    "headSign departimeTime occupancyStatus" auto
    "detail detail detail" auto
    / 1fr auto 57px;
  place-items: center start;
  grid-column-gap: 18px;
  padding-top: 14px;
  padding-bottom: 14px;
}

.headSign,
.departureTime {
  font-size: 1.6rem;
}

/**
 * 1. Adding a border directly to the meter element provides a border
 * for Firefox and Safari, but not for Chrome. Using ::-webkit-meter-bar
 * will add a border for Chrome, but will double up a border for Safari.
 * Using a box-shadow will allow all to have a similar "border"
 * 2. A transparent border is still added for high contrast mode.
 */
.occupancyStatus {
  width: 57px;
  height: 12px;
  border: 1px solid var(--c-white);
  /* Has to be "background" instead of "background-color" to overwrite the default */
  background: transparent;
}

.occupancyStatus::-webkit-meter-bar {
  border: 1px solid var(--c-white);
  background: transparent;
}

.occupancyStatus::-webkit-meter-optimum-value,
.occupancyStatus::-webkit-meter-suboptimum-value,
.occupancyStatus::-webkit-meter-even-less-good-value {
  background: var(--c-white);
  margin: 1px;
  height: calc(100% - 2px);
}

.occupancyStatus:-moz-meter-optimum::-moz-meter-bar,
.occupancyStatus:-moz-meter-sub-optimum::-moz-meter-bar,
.occupancyStatus:-moz-meter-sub-sub-optimum::-moz-meter-bar {
  background: var(--c-white);
  margin: 1px;
  height: calc(100% - 2px);
}

.detail {
  font-size: 1.2rem;
  line-height: 1.7rem;
  grid-area: detail;
}

.value {
  padding-left: 10px;
}
</style>
