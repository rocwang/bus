<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
    <path
      fill="none"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 15L29 1 15 15 1 1l14 14zm0 0L1 29l14-14 14 14-14-14z"
    />
  </svg>
</template>

<script>
export default {
  name: "IconCross",
  inject: ["colors"],
  props: {
    color: {
      type: String,
      default() {
        return this.colors.yellow;
      }
    }
  }
};
</script>
