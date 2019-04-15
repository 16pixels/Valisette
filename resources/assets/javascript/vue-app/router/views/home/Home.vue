<template>
  <div class="home" id="test">
    <h1>{{ welcome }}</h1>
    <img v-bind:src=logoUrl alt="">
  </div>
</template>
<script>
export default {
  name: "home",
  computed:{
    logoUrl() {
      return "/images/w3c.svg"
    },
    welcome() {
      return this.$t('message.hello');
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
  img {
    max-width: 200px;
  }
}
</style>

