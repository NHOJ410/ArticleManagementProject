<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user' //  導入驗證請求
import { useUserStore } from '@/stores' // 導入 倉庫
import { useRouter } from 'vue-router' // 導入 useRouter方法
import wowJS from '@/utils/wow.js' // 導入wow.js

// 執行wow.js
onMounted(() => {
  wowJS()
})

const userStore = useUserStore() // 定義 user倉庫

const router = useRouter() // 定義 router

const isRegister = ref(false) // 切換登入與註冊頁面的變量

// 註冊按鈕預先校驗

//  獲取 form 表單元素

const form = ref()

// 註冊按鈕 事件處理函數

const register = async () => {
  await form.value.validate()
  //  調用 驗證註冊帳號密碼請求
  await userRegisterService(formModel.value)
  //  調用 Message組件
  ElMessage({
    message: '註冊成功!',
    type: 'success',
    duration: 3000,
    offset: 64
  })

  //  切換到登入頁面
  isRegister.value = false
}

// 登入按鈕 事件處理函數

const login = async () => {
  await form.value.validate()
  const {
    data: { token }
  } = await userLoginService(formModel.value)

  // 登入成功後 , 調用 user倉庫裡面的 setUserToken 方法 , 將 token 存入進 state 裡面
  userStore.setToken(token)
  //  調用 Message組件
  ElMessage({
    message: '登入成功!',
    type: 'success',
    duration: 3000,
    offset: 64
  })

  // 將密碼存到Pinia倉庫中 , 更改密碼需要用到
  userStore.setPassword(formModel.value.password)

  userStore.rememberAction(userStore.isRemember)

  // 跳轉到首頁
  router.push('/')
}

//  切換頁面後自動清空表單 ( watch 監聽器 )
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

// 整個用於提交的 form 對象
const formModel = ref({
  username: '', // 帳號輸入框值
  password: '', // 密碼輸入框值
  repassword: '' // 再次輸入密碼框值
})

//  配置校驗規則
const rules = {
  //  帳號區域
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' }, // 表示非空判斷 , 判斷觸發條件為 : 失去焦點
    { min: 5, max: 10, message: '用戶名必須是5~10位數字符', trigger: 'blur' }
  ],
  //  密碼區域
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' }, // 表示非空判斷 , 判斷觸發條件為 : 失去焦點
    { min: 5, max: 10, message: '用戶名必須是5~10位數字符', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密碼必須是6~15位數的非空字符',
      trigger: 'blur'
    }
  ],
  // 再次輸入密碼區域
  repassword: [
    { required: true, message: '請輸入密碼', trigger: 'blur' }, // 表示非空判斷 , 判斷觸發條件為 : 失去焦點
    { min: 5, max: 10, message: '用戶名必須是5~10位數字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('請確認二次密碼是否一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// -------------- 選擇記住帳號密碼的回顯部分 ( 沒有api 算是即興創作 ) --------------------------

onMounted(() => {
  if (isRegister.value === false && userStore.isRemember) {
    formModel.value = {
      username: userStore.rememberInfo.username,
      password: userStore.rememberInfo.password
    }
  }
})

// 切換回登入頁面時 , 因為上面用 watch監聽 切換時清空數據 , 所以這裡在處理一次
const goLogin = () => {
  // 切換到登入頁面
  isRegister.value = false
  // 重新賦值數據
  setTimeout(() => {
    if (userStore.isRemember) {
      userStore.rememberAction(userStore.isRemember)
      formModel.value = {
        username: userStore.rememberInfo.username,
        password: userStore.rememberInfo.password
      }
    }
  }, 500)
}
</script>

<template>
  <div class="box">
    <el-row class="login-page">
      <!-- 左側圖片 -->
      <el-col :span="12" class="bg wow fadeIn"></el-col>
      <!-- 右側內容 (通過變量配合v-if來切換)-->
      <el-col :span="6" :offset="3" class="form">
        <!-- 註冊頁面 -->
        <el-form
          ref="form"
          class="wow lightSpeedInLeft"
          size="large"
          autocomplete="off"
          v-if="isRegister"
          :model="formModel"
          :rules="rules"
          status-icon
          @keyup.enter="register"
        >
          <el-form-item>
            <h1>文章管理系統 歡迎註冊</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              placeholder="請輸入用戶名"
              v-model="formModel.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              placeholder="請輸入密碼"
              v-model="formModel.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              :prefix-icon="Lock"
              type="password"
              placeholder="請再次輸入密碼"
              v-model="formModel.repassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="register"
            >
              註冊
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="primary" :underline="false" @click="goLogin">
              ← 已經有帳號了 ? 點我回登入頁面
            </el-link>
          </el-form-item>
        </el-form>

        <!-- 登入頁面 -->
        <el-form
          ref="form"
          size="large"
          class="wow lightSpeedInRight"
          autocomplete="off"
          v-else
          :model="formModel"
          :rules="rules"
          @keyup.enter="login"
        >
          <el-form-item>
            <h1>文章管理系統 歡迎登入</h1>
          </el-form-item>
          <!-- 用戶名輸入區 -->
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              placeholder="請輸入用戶名"
              v-model="formModel.username"
            ></el-input>
          </el-form-item>
          <!-- 密碼輸入區 -->
          <el-form-item prop="password">
            <el-input
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="請輸入密碼"
              v-model="formModel.password"
              show-password
            ></el-input>
          </el-form-item>
          <!-- 記住我和忘記密碼部分 -->
          <el-form-item class="flex">
            <div class="flex">
              <el-checkbox v-model="userStore.isRemember">記住我</el-checkbox>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="沒有api😢"
                placement="top-start"
              >
                <el-link type="primary" :underline="false">忘記密碼？</el-link>
              </el-tooltip>
            </div>
          </el-form-item>
          <!-- 底部登入按鈕 -->
          <el-form-item>
            <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="login"
              >登入</el-button
            >
          </el-form-item>
          <!-- 底部註冊按鈕 -->
          <el-form-item class="flex">
            <el-link
              type="primary"
              :underline="false"
              @click="isRegister = true"
            >
              沒有帳號嗎 ? 點我去註冊 →
            </el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.box {
  .login-page {
    height: 100vh;
    background: linear-gradient(to right, #a7a4a4, #f3f2f2);

    // 左側背景圖
    .bg {
      background: url('@/assets/LoginBgi.webp') no-repeat center / cover;
      border-radius: 0 20px 20px 0;
    }

    // 右側表單部分
    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      user-select: none;

      .title {
        margin: 0 auto;
      }

      .button {
        width: 100%;
      }

      .flex {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
