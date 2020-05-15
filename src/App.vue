<template>
  <div>
    <router-view/>
    <!-- <button @click="hello()">click</button> -->
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
import axios from 'axios'

export default {

  methods:{

    hello(){
      axios.get('http://localhost:8080/returnObj').then(res => {console.log(res)})
    }
  }
}
</script>
