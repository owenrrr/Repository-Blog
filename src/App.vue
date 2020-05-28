<template>
  <div>
    <router-view/>
  </div>
</template>
<style>

#app {

  height: 100%;

  width: 100%;

  font-family: Avenir, Helvetica, Arial, sans-serif;

  -webkit-font-smoothing: antialiased;

  -moz-osx-font-smoothing: grayscale;

  text-align: center;

  color: #2c3e50;

}
#nav {

  padding: 30px;

  background-color: darkgray;

}

#nav a {

  font-weight: bold;

  color: #2c3e50;

}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>

export default {
  methods:{
  }
}
</script>