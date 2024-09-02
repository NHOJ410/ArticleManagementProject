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

    const getUserInfo = async () => {
      // 定義方法 來發送請求

      const { data } = await userGetInfoService() // 調用請求 , 拿到用戶個人訊息

      userInfo.value = data.data
    }

    return {
      //  最後別忘記要 return 出去!
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo
    }
  },
  {
    persist: true // 使用插件實現持久化效果
  }
)
