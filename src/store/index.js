import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tempUserid: '',
    tempPaperid: '',  // 用于点入文章细看
  },
  mutations: {
    setUserid (state, userid){
      state.tempUserid = userid
    },
    setPaperid (state, paperid){
      state.tempPaperid = paperid
    }
  },
  getters: {
    getUserid: (state) => state.tempUserid,
    getPaperid: (state) => state.tempPaperid,
  },
  actions: {
  },
  modules: {
  }
})
