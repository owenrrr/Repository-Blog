import Vue from 'vue'
import VueRouter from 'vue-router'
import Regist from '../views/LoginModule/Regist.vue'
import Login from '../views/LoginModule/Login.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Login',
      component: Login

    },
    {
      path: '/regist',
      name: 'Regist',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Regist,
    },
    {
      path: '/MyBlog',
      name: 'Layout',
      redirect: '/home/blogList',
      component: () => import('@/views/LayoutModule/Layout'),
      children: [
        {
          path: '/home/blogList',
          name: 'BlogList',
          component: () => import('@/views/Home')
        }
      ]
    }


]

const router = new VueRouter({
  routes
})

export default router
