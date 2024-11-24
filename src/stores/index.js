import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// 統一導出 Pinia倉庫
export * from './modules/user.js' // 導出 user模塊
