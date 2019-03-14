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



