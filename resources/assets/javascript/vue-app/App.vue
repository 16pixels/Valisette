<template>
  <div id="router-wrapper">
    <router-view></router-view>
  </div>
</template>
<script>
import RouterView from "./router";
export default {
  name: "App",
  components: {
    "router-view": RouterView
  }
}
</script>

<style lang="scss" scoped>
#router-wrapper {
  position: relative;
  overflow: hidden;
  max-width: 100vw; 
  width: 100vw; 
}
</style>
