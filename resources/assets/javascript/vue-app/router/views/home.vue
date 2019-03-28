<template>
  <div class="home">
    <h1>title</h1>
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

