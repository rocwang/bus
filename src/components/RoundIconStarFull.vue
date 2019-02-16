<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path
      :fill="bg"
      d="M25 0a25 25 0 1 0 25 24.984C49.991 11.184 38.801 0 25 0"
    />
    <path
      :fill="color"
      d="M23.39 11.044L19.73 18.8l-8.193 1.248c-1.469.223-2.057 2.115-.992 3.2l5.927 6.034-1.402 8.524c-.252 1.54 1.301 2.695 2.602 1.974L25 35.755l7.329 4.025c1.3.715 2.854-.433 2.602-1.974l-1.402-8.524 5.927-6.035c1.065-1.084.477-2.976-.992-3.199L30.27 18.8l-3.662-7.756a1.763 1.763 0 0 0-3.218 0z"
    />
  </svg>
</template>

<script>
export default {
  name: "RoundIconStarFull",
  inject: ["colors"],
  props: {
    color: {
      type: String,
      default() {
        return this.colors.oceanBlue;
      }
    },
    bg: {
      type: String,
      default() {
        return this.colors.yellow;
      }
    }
  }
};
</script>
