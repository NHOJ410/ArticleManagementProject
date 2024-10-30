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
import { useRouter } from 'vue-router'
const router = useRouter()
import { useUserStore } from '@/stores' // 導入 user倉庫
const useStore = useUserStore() // 定義 user倉庫方法
useStore.getUserInfo() // 調用 Pinia 倉庫中  請求用戶基本訊息的函數

// 登出按鈕事件處理函數
const handleCommand = async (key) => {
  if (key === 'logout') {
    try {
      // 顯示確認對話框
      await ElMessageBox.confirm('你確定要登出嗎?', '溫馨提示', {
        type: 'warning',
        confirmButtonText: '是的 ! 登出',
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
    // 處理其他按鈕的點擊事件 ( 跳轉到對應的路由 )
    router.push(`/user/${key}`)
  }
}

// 點擊頭像 跳轉到個人中心
const goUserInfo = () => {
  router.push('/user/profile')
}
</script>

<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <!-- 左邊菜單部分 -->
      <el-aside>
        <div class="el-aside__logo"></div>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#0e0d0d"
          :default-active="$route.path"
          text-color="#fff"
          router
        >
          <!-- 文章分類部分 -->
          <el-menu-item index="/article/channel">
            <el-icon>
              <Management />
            </el-icon>
            <span>文章分類</span>
          </el-menu-item>
          <!-- 文章管理部分 -->
          <el-menu-item index="/article/manage">
            <el-icon>
              <Promotion />
            </el-icon>
            <span>文章管理</span>
          </el-menu-item>

          <!-- 個人中心部分 -->
          <el-sub-menu index="/user">
            <template #title>
              <el-icon>
                <UserFilled />
              </el-icon>
              <span>個人中心</span>
            </template>
            <!-- 個人中心 - 基本資料 -->
            <el-menu-item index="/user/profile">
              <el-icon>
                <User />
              </el-icon>
              <span>基本資料</span>
            </el-menu-item>
            <!-- 個人中心 - 更換頭像 -->
            <el-menu-item index="/user/avatar">
              <el-icon>
                <Crop />
              </el-icon>
              <span>更換頭像</span>
            </el-menu-item>
            <!-- 個人中心 - 更改密碼 -->
            <el-menu-item index="/user/password">
              <el-icon>
                <EditPen />
              </el-icon>
              <span>更改密碼</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 登出按鈕 -->
          <el-menu-item @click="handleCommand('logout')">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>登出</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 頂部用戶頭像和下拉菜單部份 -->
        <el-header>
          <!-- 左側用戶名 -->
          <div class="username">
            歡迎回來
            <strong>{{
              useStore.userInfo.nickname || useStore.userInfo.username
            }}</strong>
          </div>

          <!-- 右側頭像和下拉菜單部分 -->
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
              <!-- 頭像 -->
              <el-avatar
                @click="goUserInfo"
                :fit="'contain'"
                :size="'large'"
                :src="useStore.userInfo.user_pic || avatar"
              />
              <!-- 下拉箭頭 -->
              <el-icon>
                <CaretBottom />
              </el-icon>
            </span>
            <!-- 下拉菜單部份 -->
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
                  >登出</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <!-- 內容區(二級路由出口) -->
        <el-main>
          <router-view></router-view>
        </el-main>

        <!-- 底部介紹區域 -->
        <el-footer>文章管理項目 ©2024 Created by John</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  .layout-container {
    height: 100vh;

    // 左邊菜單部分
    .el-aside {
      background-color: $menu-color;
      width: 12vw;

      &__logo {
        height: 120px;
        background: url('@/assets/1.jpg') no-repeat center / 100% auto;
      }

      :deep(.el-menu) {
        border-right: none;
        background-color: $menu-color;
      }
    }

    // 頂部用戶頭像和下拉菜單部份
    .el-header {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: $top-height;

      // 左側用戶名
      .username {
        font-size: 18px;
        user-select: none;
      }

      // 下拉菜單
      .el-dropdown__box {
        display: flex;
        align-items: center;
        cursor: pointer;

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

    // 底部介紹部分
    .el-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #666;
      letter-spacing: 8px;
      user-select: none;
    }
  }
}
</style>
