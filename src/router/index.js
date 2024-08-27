import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/loginPage.vue') }, // 一級路由 - 登入頁面
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'), // 一級路由 - 首頁(路由架子)
      redirect: '/article/manage', // 如果訪問 / 路徑 , 直接重定向到 [文章管理頁面]
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue') // 二級路由 - 文章管理區域
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue') // 二級路由 - 文章列表區域
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

export default router
