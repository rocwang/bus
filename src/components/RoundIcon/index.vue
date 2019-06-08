<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    :class="$style[direction]"
  >
    <path
      :fill="bg"
      d="M25 0a25 25 0 1 0 25 24.984C49.991 11.184 38.801 0 25 0"
    />
    <component :is="pathComponent" :style="{ color }" />
  </svg>
</template>

<script>
import RoundIconFullStar from "./RoundIconFullStar";
import RoundIconMap from "./RoundIconMap";
import RoundIconRoute from "./RoundIconRoute";
import RoundIconStop from "./RoundIconStop";
import RoundIconStreetView from "./RoundIconStreetView";

export default {
  name: "RoundIcon",
  components: {
    RoundIconFullStar,
    RoundIconMap,
    RoundIconRoute,
    RoundIconStop,
    RoundIconStreetView
  },
  props: {
    name: {
      type: String,
      required: true,
      validator: function(name) {
        return ["FullStar", "Map", "Route", "Stop", "StreetView"].includes(
          name
        );
      }
    },
    direction: {
      type: String,
      default: "up",
      validator(value) {
        return ["up", "down", "left", "right"].includes(value);
      }
    },
    bg: {
      type: String,
      default: "#000"
    },
    color: {
      type: String,
      default: "#fff"
    }
  },
  computed: {
    pathComponent() {
      return `RoundIcon${this.name}`;
    }
  }
};
</script>

<style module>
.right {
  transform: rotate(90deg);
}

.down {
  transform: rotate(180deg);
}

.left {
  transform: rotate(-90deg);
}
</style>
