<template>
  <div :class="[$style.root, {[$style.collapsed]: isCollapsed}]">

    <div :class="$style.head">
      <div :class="$style.icon">
        <slot name="icon"/>
      </div>

      <h1 :class="$style.title">
        <small :class="$style.prefix">
          <slot name="prefix"/>
        </small>
        <slot name="title"/>
      </h1>

      <div :class="$style.buttons">
        <slot name="buttons"/>
      </div>

      <p :class="$style.subtitle">
        <slot name="subtitle"/>
      </p>
    </div>

    <div :class="$style.body">
      <slot name="body"/>
    </div>

  </div>
</template>

<script>
export default {
  name: "Panel",
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style module>
.root {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300px;
  color: var(--c-white);
  border-top: 10px solid var(--c-yellow);
  background-color: var(--c-ocean-blue);
  z-index: var(--z-panel);
  transition: transform 0.3s ease-out;
}

.root.collapsed {
  transform: translateY(218px);
}

.head {
  padding: 18px;
  display: grid;
  grid-template:
    "icon title    buttons" auto
    ".    subtitle .      " auto
    / auto 1fr auto;
  align-items: center;
}

.icon {
  width: 36px;
  grid-area: icon;
}

.title {
  grid-area: title;
  font-size: 2.4rem;
  padding-left: 18px;
}

.prefix {
  vertical-align: top;
  font-size: 1.2rem;
}

.prefix:not(:empty) {
  margin-right: 10px;
}

.buttons {
  grid-area: buttons;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  transform: translateX(8px);
}

.subtitle {
  grid-area: subtitle;
  padding-left: 18px;
  font-size: 1.6rem;
}

.subtitle:not(:empty) {
  padding-top: 5px;
}

.body {
  padding: 10px 18px 18px;
}
</style>
