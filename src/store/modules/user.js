import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
// vuex的持久化 vuex和前端缓存相结合

const state = {
  token: getToken(), // 初始化时从缓存中读取状态 并赋值到初始化的状态上
  userInfo: {} // 定义一个空对象
}
// 修改状态
const mutations = {

  // vuex和缓存数据的同步
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },

  // 删除token
  removeToken() {
    state.token = null
    removeToken()
  },

  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = { ...result } // 用浅拷贝的方式赋值对象,因为这样数据更新之后,才会触发组件的更新
  },

  // 删除用户信息
  removeUserInfo() {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {

  // 获取token
  async login(context, data) {
    const result = await login(data)
    // axios默认给数据加了一层data
    if (result) {
      console.log(result)
      // 登录成功,有token
      // action 修改state 需要通过mutations
      context.commit('setToken', result)

      // 登陆时写入时间戳
      setTimeStamp() // 将当前的最新时间写入缓存
    }
  },

  // 退出登录
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  },

  // 获取用户基本资料
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取用户的基本资料的返回值
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    console.log(baseInfo)
    const baseResult = { ...result, ...baseInfo } // 接口合并
    context.commit('setUserInfo', baseResult) // 将整个个人信息设置到用户的vuex数据中
    return baseResult
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
