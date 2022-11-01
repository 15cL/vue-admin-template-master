import Layout from '@/layout'

export default {
  path: '/departments', // 路径
  name: 'departments', // 给路由规则加一个name
  component: Layout, // 组件
  children: [{
    path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
    component: () => import('@/views/departments'),
    meta: { // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
      title: '组织架构', // meta属性的里面的属性 随意定义
      // 左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      icon: 'tree'
    }
  }]
}

// 当你的访问地址 是 /departments的时候 layout组件会显示 此时 你的二级路由的默认组件也会显示
