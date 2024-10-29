import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores' // 導入 user倉庫

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 一級路由 - 登入頁面
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'), // 一級路由 - 首頁(路由架子)
      redirect: '/article/channel', // 如果訪問 / 路徑 , 直接重定向到 [文章管理頁面]
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue') // 二級路由 - 文章管理區域
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue') // 二級路由 - 文章分類區域
        },
        {
          path: '/article/content/:id',
          component: () => import('@/views/article/ArticleContent.vue') // 二級路由 - 文章內容區域
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue') // 二級路由 - 個人詳情區域
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue') // 二級路由 - 更換頭像區域
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue') // 二級路由 - 重製密碼區域
        }
      ]
    }
  ]
})

// 配置全局前置導航守衛
router.beforeEach((to) => {
  //  如果Pinia裡面沒有token的話 , 就要攔截 並且強制跳轉到 /login 登入頁面
  const userStore = useUserStore() //  建立user倉庫變量
  if (!userStore.token && to.path !== '/login') {
    //  判斷如果沒有登入的情況

    //  可以調用 ElMessage 給個提示框
    ElMessage({
      message: '你好像還沒有登入! , 請先登入帳號',
      type: 'error',
      duration: 3000,
      offset: 64
    })

    //  跳轉到登入頁面 , 按照影片解釋 直接用 return 跳轉即可!

    return './login'
  }

  return
})

export default router
