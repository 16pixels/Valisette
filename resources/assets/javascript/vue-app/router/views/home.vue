<template>
  <div class="home">
    <h1>Home.vue</h1>
    <img v-bind:src=logoUrl alt="">
  </div>
</template>
<script>
export default {
  name: "home",
  computed:{
    logoUrl() {
      return "/images/w3c.svg"
    }
  },
  data() {
    return {
      msg: "bonjour"
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  position: relative;
  max-width: 400px;
  width: 400px;
}
</style>

