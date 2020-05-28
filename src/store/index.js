import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tempUserid: '',
  },
  mutations: {
    setUserid (state, userid){
      state.tempUserid = userid
    }
  },
  getters: {
    getUserid: (state) => state.tempUserid
  },
  actions: {
  },
  modules: {
  }
})
