import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import '@ckeditor/ckeditor5-build-classic/build/ckeditor.js'



Vue.config.productionTip = false

Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
