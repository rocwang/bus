<template>
  <div id="app" :class="$style.root">
    <router-view/>
  </div>
</template>

<script>
import config from "./config";

export default {
  name: "App",
  provide: {
    config
  }
};
</script>

<style module>
html,
body,
.root {
  width: 100%;
  height: 100%;
}
</style>
