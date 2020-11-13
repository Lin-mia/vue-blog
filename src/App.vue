<template>
  <div id="app">
        <Navbar></Navbar>
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'app',
  data () {
    return {}
  },
  methods: {},
  components: {
    Navbar
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
