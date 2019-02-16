<template>
  <button :class="$style.root" v-on="$listeners">
    <div :class="$style.icon">
      <slot name="icon" />
    </div>
    <span :class="$style.text">
      <slot name="text" />
    </span>
  </button>
</template>

<script>
export default {
  name: "ButtonWithIcon"
};
</script>

<style module>
.root {
  font-size: 1.6rem;
  text-align: center;
  padding: 7px 18px;
  background-color: var(--c-ocean-blue);
  color: var(--c-white);
  box-shadow: 2px 2px 4px 0 var(--c-black);
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.icon {
  width: 36px;
  margin-right: 18px;
}
</style>
