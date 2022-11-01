import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import store from '@/store/index'
import router from '@/router/index'

const timeOut = 3600 // 定义超时时间

// 创建一个axios的实例
const service = axios.create({

  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础地址
  timeout: 5000 // 定义5秒超时

})

// 请求拦截器
// 请求拦截器中注入token
service.interceptors.request.use(
  config => {
    // 统一的去注入token
    if (store.getters.token) { // 是否存在token
      // 只有在有token的情况下 才有必要去检查时间戳是否超时
      if (IsCheckTimeOut()) { // 如果它为true表示 过期了 // token没用了 因为超时了
        store.dispatch('user/logout') // 登出界面
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 返回配置
  }, error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
// 增加reject
service.interceptors.response.use(
  response => {
    // 解构赋值 去除axios请求默认增加的data包裹层
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  }, error => {
    if (error.response && error.response.data$$error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出界面,删除token,用户信息
      router.push('/login')
    }
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
)

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 超时时间
function IsCheckTimeOut() {
  var currenTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currenTime - timeStamp) / 1000 > timeOut
}
export default service // 导出axios实例
