import axios from 'axios'
import { useUserStore } from '@/stores' //  導入 user倉庫
import { ElMessage } from 'element-plus' // 導入 elementPlus 裡面的 消息提示
const router = 'vue-router' // 導入 VueRouter

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  //  基地址 , 超時時間
  baseURL,
  timeout: 20000
})

// 添加請求攔截器

instance.interceptors.request.use(
  function (config) {
    // 在發送請求之前做些什麼

    const userStore = useUserStore() // 2. 註冊 userStore變量

    if (userStore.token) {
      config.headers.Authorization = userStore.token // 3. 如果 user倉庫裡面存有token 的話 , 就把 token 加入到 headers請求參數中
    }

    return config
  },
  function (error) {
    // 對請求錯誤做些什麼
    return Promise.reject(error)
  }
)
// 添加響應攔截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 範圍內的狀態碼都會觸發該函數。對響應數據做點什麼
    // 獲取成功部分
    if (response.data.code === 0) {
      return response
    }
    // 獲取失敗部分 給錯誤提示

    ElMessage.error({
      message: response.data.message || '服務器異常!',
      type: 'error'
    })

    return Promise.reject(response.data) // 並且拋出錯誤 中斷響應
  },
  function (error) {
    // 超出 2xx 範圍的狀態碼都會觸發該函數。對響應錯誤做點什麼

    // 響應狀態碼 401部分 , 權限不足 ex : token過期 => 需要攔截到登入頁面

    if (error.response?.status === 401) {
      router.push('/login')
    }

    // 默認錯誤部分 , 提取消息讓 elementPlus提示框做提示
    ElMessage.error({
      message: error.data.message || '服務器異常!',
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default instance

export { baseURL }
