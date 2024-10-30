import { ref } from 'vue'
import { defineStore } from 'pinia' // 導入 Pinia
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // ------------ 用戶token 部分 --------------
    //  存放用戶 token
    const token = ref('')

    //  設定用戶token (做登入按鈕用)
    const setToken = (newToken) => {
      token.value = newToken
    }

    //  移除用戶token (做退出登入按鈕用)
    const removeToken = () => {
      token.value = ''
    }

    // --------------  獲取用戶個人訊息部分 ---------------

    const userInfo = ref({}) // 存儲用戶個人訊息

    // 獲取用戶個人訊息數據
    const getUserInfo = async () => {
      const { data } = await userGetInfoService() // 調用請求 , 拿到用戶個人訊息
      userInfo.value = data.data
    }

    // 設定用戶個人訊息 ( 這裡是做退出登入的效果的 )
    const setUserInfo = (obj) => {
      userInfo.value = obj
    }

    // ------------- 用戶密碼部分 --------------
    const userPassword = ref(null) // 存儲用戶密碼 ( 這裡是做修改密碼的效果的 )

    // 用來設定用戶密碼的 action
    const setPassword = (value) => {
      userPassword.value = value
    }

    // ------------ 記住用戶名和密碼部分 (沒有接口 算是即興創作 ) -------------
    const isRemember = ref(false) // 控制是否記住用戶名和密碼

    // 存儲記住的用戶名和密碼 (因為原本蒐集的表單在登出時就清除了 所以這裡另存一份)
    const rememberInfo = ref({
      username: '',
      password: ''
    })

    // 用來記住用戶名和密碼的 action
    const rememberAction = (val) => {
      // 同時保存會有數據先後的問題 這裡延遲兩秒後再保存 就沒問題了!
      setTimeout(() => {
        // 如果 val 為 true 就表示要記住
        if (val) {
          rememberInfo.value = {
            username: userInfo.value.username,
            password: userPassword.value
          }
        } else {
          // 走到這裡代表不用記住 那就清空
          rememberInfo.value = {
            username: '',
            password: ''
          }
        }
      }, 2000)
    }

    return {
      //  最後別忘記要 return 出去!
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo,
      setUserInfo,
      userPassword,
      setPassword,
      rememberInfo,
      isRemember,
      rememberAction
    }
  },
  {
    persist: {
      // 設置 token和 userInfo需要被持久化處理
      pick: ['token', 'userInfo', 'isRemember']
    }
  }
)
