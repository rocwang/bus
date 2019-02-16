<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
    <path
      :fill="color"
      d="M28.25 5.625v15c0 3.036-3.61 5.625-7.618 5.625l3.69 2.913a.47.47 0 0 1-.29.837H6.218a.47.47 0 0 1-.29-.837l3.69-2.913C5.621 26.25 2 23.67 2 20.625v-15C2 2.518 5.75 0 9.5 0h11.25c3.809 0 7.5 2.518 7.5 5.625zm-2.813 7.969V7.03c0-.776-.63-1.406-1.406-1.406H6.22c-.777 0-1.407.63-1.407 1.406v6.563c0 .776.63 1.406 1.407 1.406H24.03c.777 0 1.407-.63 1.407-1.406zm-10.312 3.75a3.281 3.281 0 1 0 0 6.562 3.281 3.281 0 0 0 0-6.562z"
    />
  </svg>
</template>

<script>
export default {
  name: "IconTrain",
  inject: ["colors"],
  props: {
    color: {
      type: String,
      default() {
        return this.colors ? this.colors.oceanBlue : "#001120";
      }
    }
  }
};
</script>
