import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tempUsername: '',
  },
  mutations: {
    setUsername (state, username){
      state.tempUsername = username
    }
  },
  getters: {
    getUsername: (state) => state.tempUsername
  },
  actions: {
  },
  modules: {
  }
})
