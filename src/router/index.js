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
        },{
          path: 'basicEditor',  // children route cannot add '/'
          name: 'BasicEditor',
          component: () => import('@/views/EditorModule/BasicEditor')
        }, {
          path: 'favourite',
          name: 'Favourite',
          component: () => import('@/views/Favourite')
        }, {
          path: 'submitpage',
          name: 'SubmitPage',
          component: () => import('@/views/EditorModule/SubmitPage')
        },{
          path: 'userinterface',  // children route cannot add '/'
          name: 'Userinterface',
          component: () => import('@/views/LayoutModule/UserLayout'),
          children: [
            {
              path: '/settings',
              name :'Settings',
              component: () => import('@/views/UserModule/Settings')
            },{
              path: '/followers',
              name :'Followers',
              component: () => import('@/views/UserModule/Followers')
            },{
              path: '/myarticles',
              name: 'myArticles',
              components: () => import('@/views/UserModule/myArticles'),
              children : [
                {
                  path: '/article',
                  name: 'article',
                  components: () => import('@/views/UserModule/article')
                }
              ]
            }
          ]
        }
      ]
    },{
      path: './Article',
      name: 'Article',
      component: () => import('@/views/Article')
    }
]

const router = new VueRouter({
  routes
})

export default router
