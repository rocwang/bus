<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 30"
    :class="$style[direction]"
    :style="{ color }"
  >
    <component :is="pathComponent" />
  </svg>
</template>

<script>
import IconArrow from "./IconArrow";
import IconBus from "./IconBus";
import IconCross from "./IconCross";
import IconEdit from "./IconEdit";
import IconEmptyStar from "./IconEmptyStar";
import IconFullStar from "./IconFullStar";
import IconShip from "./IconShip";
import IconTrain from "./IconTrain";

export default {
  name: "Icon",
  components: {
    IconArrow,
    IconBus,
    IconCross,
    IconEdit,
    IconEmptyStar,
    IconFullStar,
    IconShip,
    IconTrain
  },
  props: {
    name: {
      type: String,
      required: true,
      validator: function(name) {
        return [
          "Arrow",
          "Bus",
          "Cross",
          "Edit",
          "EmptyStar",
          "FullStar",
          "Ship",
          "Train"
        ].includes(name);
      }
    },
    direction: {
      type: String,
      default: "up",
      validator(value) {
        return ["up", "down", "left", "right"].includes(value);
      }
    },
    color: {
      type: String,
      default: "#000"
    }
  },
  computed: {
    pathComponent() {
      return `Icon${this.name}`;
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
