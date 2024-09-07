<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores' // 導入 user倉庫
import router from '@/router'
const useStore = useUserStore() // 定義 user倉庫方法
useStore.getUserInfo() // 調用 Pinia 倉庫中  請求用戶基本訊息的函數

const handleCommand = async (key) => {
  if (key === 'logout') {
    try {
      // 顯示確認對話框
      await ElMessageBox.confirm('你確定要退出登入嗎?', '溫馨提示', {
        type: 'warning',
        confirmButtonText: '是的 ! 退出登入',
        cancelButtonText: '取消'
      })

      // 如果用戶點擊「退出登入」，繼續執行以下操作
      useStore.removeToken() // 清空用戶token
      useStore.setUserInfo({}) // 清空用戶訊息
      router.push('/login') // 跳轉到登入頁面
    } catch (error) {
      // 如果用戶點擊了「取消」，或者其他原因導致錯誤，這裡可以處理錯誤
      // 這裡你可以選擇不做任何處理，因為用戶取消了操作
    }
  } else {
    // 處理其他按鈕的點擊事件
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#0e0d0d"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分類</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>個人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本資料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更換頭像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密碼</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          用戶：<strong>{{
            useStore.userInfo.nickname || useStore.userInfo.username
          }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="useStore.userInfo.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本資料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更換頭像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密碼</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登錄</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>文章管理項目 ©2024 Created by John</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #171717;
    &__logo {
      height: 120px;
      background: url('@/assets/1.jpg') no-repeat center / 100% auto;
    }
    :deep(.el-menu) {
      border-right: none;
      background-color: #171717;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #666;
    letter-spacing: 8px;
  }
}
</style>
