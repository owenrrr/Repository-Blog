import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tempUserid: '',
    tempPaperid: '',  // 用于点入文章细看
    tempList: [],
  },
  mutations: {
    setUserid (state, userid){
      state.tempUserid = userid
    },
    setPaperid (state, paperid){
      state.tempPaperid = paperid
    },
    setList(state, list){
      state.tempList = list
    }
  },
  getters: {
    getUserid: (state) => state.tempUserid,
    getPaperid: (state) => state.tempPaperid,
    getList: (state) => state.tempList,
  },
  actions: {
  },
  modules: {
  }
})
