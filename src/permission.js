import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' //  引入进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // no redirect whitelist
// next()  放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
// 前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) { // 是否有token
    if (!store.getters.userId) {
      const { roles } = await store.dispatch('user/getUserInfo')
      console.log('roles', roles)
      const routes = await store.dispatch('permission/filterRoutes', roles.menus)
      router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表  铺路
      next(to.path)
    }
    if (to.path === '/login') { // 是否要去登录页面
      next('/') // 去主页
    } else {
      next() // 放行
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) { // 去的页面是否在白名单中
      next() // 放行
    } else {
      next('/login') // 去登录页
    }
  }
  NProgress.done() // 手动强制关闭进度条 为了解决 手动切换地址时,进度条的不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})

