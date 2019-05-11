<template>
  <div :class="$style.root">
    <RoundIconRoute :class="$style.icon" />
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
      Occupancy Status: {{ occupancyStatus }}/6
    </meter>
  </div>
</template>

<script>
import RoundIconRoute from "./RoundIconRoute";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { interval } from "rxjs";
import { map, startWith } from "rxjs/operators";

export default {
  name: "Trip",
  components: { RoundIconRoute },
  props: {
    headSign: {
      type: String,
      required: true
    },
    departureTime: {
      type: String,
      required: true
    },
    occupancyStatus: {
      type: Number,
      required: false
    },
    isRealTime: {
      type: Boolean,
      required: true
    }
  },
  subscriptions() {
    return {
      formattedDepartureTime: interval(30000).pipe(
        startWith(0),
        map(() => {
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
        })
      )
    };
  }
};
</script>

<style module>
.root {
  display: grid;
  grid-template:
    "icon headSign departimeTime occupancyStatus" auto
    / 36px 1fr auto 57px;
  place-items: center start;
  grid-column-gap: 18px;
  padding-top: 4px;
  padding-bottom: 4px;
}

.icon {
  width: 36px;
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
</style>
