
<template>
  <div id="router-wrapper">
    <router-link to="/">Aller a la home</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  data () {
    return {
      msg: 'Hello world!'
    }
  },
  components: {
  }
}
</script>






