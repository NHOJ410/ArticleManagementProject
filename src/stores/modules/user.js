import { defineStore } from 'pinia' // 導入 Pinia
import { ref } from 'vue'
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

    return {
      //  最後別忘記要 return 出去!
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo,
      setUserInfo,
      userPassword,
      setPassword
    }
  },
  {
    persist: {
      // 設置 token和 userInfo需要被持久化處理
      pick: ['token', 'userInfo']
    }
  }
)
