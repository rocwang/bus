<template>
  <div id="app" :class="$style.root">
    <router-view/>
  </div>
</template>

<style module>
html,
body,
.root {
  width: 100%;
  height: 100%;
}
</style>
