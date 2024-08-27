import { defineStore } from 'pinia' // 導入 Pinia
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 1. 存放用戶 token
    const token = ref('')

    // 2. 設定用戶token (做登入按鈕用)
    const setToken = (newToken) => {
      token.value = newToken
    }

    // 3. 移除用戶token (做退出登入按鈕用)
    const removeToken = () => {
      token.value = ''
    }

    return {
      // 4. 最後別忘記要 return 出去!
      token,
      setToken,
      removeToken
    }
  },
  {
    persist: true // 使用插件實現持久化效果
  }
)
