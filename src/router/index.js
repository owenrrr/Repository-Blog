import Vue from 'vue'
import VueRouter from 'vue-router'
import Regist from '../views/LoginModule/Regist.vue'
import Login from '../views/LoginModule/Login.vue'
import store from '../store'
import { getToken } from '../util/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style

Vue.use(VueRouter)

  const routes = [
    {
      path: '/login',
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
      path: '/',
      redirect: '/MyBlog'
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
        },
        {
          path: '/Article',
          name: 'Article',
          component: () => import('@/views/Article')
        },
        {
          path: 'basicEditor',  // children route cannot add '/'
          name: 'BasicEditor',
          component: () => import('@/views/EditorModule/BasicEditor')
        },

        {
          path: 'submitpage',
          name: 'SubmitPage',
          component: () => import('@/views/EditorModule/SubmitPage')
        },
        {
          path: '/userLayout/:userId/:firstPage',
          name: 'userLayout',
          component: () => import('@/views/LayoutModule/UserLayout'),
          children: [
            {
              path: 'favourite/:id',
              name: 'favourite',
              component: () => import('@/views/Favourite')
            },
            {
              path: 'settings/:id',
              name :'settings',
              component: () => import('@/views/UserModule/Settings')
            },
            {
              path: 'followers/:id',
              name :'followers',
              component: () => import('@/views/UserModule/Followers')
            },
            {
              path: 'myArticles/:id',
              name: 'myArticles',
              component: () => import('@/views/UserModule/myArticles')
            }
          ]
        },
        {
          path: '/anotherLayout/:userId/:firstPage',
          name: 'anotherLayout',
          component: () => import('@/views/LayoutModule/AnotherLayout'),
          children: [
            {
              path: 'anotherFavourite/:id',
              name: 'anotherFavourite',
              component: () => import('@/views/AnotherModule/anotherFavourite')
            },
            {
              path: 'anotherSettings/:id',
              name :'anotherSettings',
              component: () => import('@/views/AnotherModule/anotherSettings')
            },
            {
              path: 'anotherMyArticles/:id',
              name: 'anotherMyArticles',
              component: () => import('@/views/AnotherModule/anotherMyArticles')
            }
          ]
        }



      ]
    },
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/regist', '/reply']

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // determine whether the user has logged in
  const hasToken = getToken()
  console.log(hasToken)
  console.log(from)
  console.log(to)
  if (hasToken) {
    store.commit('set_userId', hasToken)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }

    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes
})

export function resetRouter() {
  console.log('resetRouter')
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
