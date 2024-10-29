import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index.js' //  導入 pinia
import '@/styles/main.scss' // 導入sass 重製樣式
import 'element-plus/dist/index.css' // 導入 Element Plus 的 CSS

const app = createApp(App)
app.use(pinia) // 2. 掛載到 app上
app.use(router)
app.mount('#app')
