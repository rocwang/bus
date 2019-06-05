<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
    <path
      :fill="color"
      d="M13.39 1.044L9.73 8.8l-8.193 1.248c-1.469.223-2.057 2.115-.992 3.2l5.927 6.034-1.402 8.524c-.252 1.54 1.301 2.695 2.602 1.974L15 25.755l7.329 4.025c1.3.715 2.854-.433 2.602-1.974l-1.402-8.524 5.927-6.035c1.065-1.084.477-2.976-.992-3.199L20.27 8.8l-3.662-7.756a1.763 1.763 0 0 0-3.218 0z"
    />
  </svg>
</template>

<script>
export default {
  name: "IconFullStar",
  inject: ["colors"],
  props: {
    color: {
      type: String,
      default() {
        return this.colors ? this.colors.yellow : "#ffdb1b";
      }
    }
  }
};
</script>
