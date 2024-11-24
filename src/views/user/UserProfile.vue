<script setup>
import { ref } from 'vue'
import defaultAvatar from '@/assets/default.png'
// 導入倉庫
import { useUserStore } from '@/stores'
// 導入api
import { userEditInfoService } from '@/api/user'

// 將 Pinia 倉庫裡面有關用戶的數據解構出來
const {
  userInfo: { nickname, email, username, id, user_pic },
  getUserInfo
} = useUserStore()

// 用戶表單數據
const userForm = ref({
  username,
  nickname,
  email,
  id,
  user_pic
})

// 表單校驗
const rules = ref({
  nickname: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
    {
      pattern: /^\S{5,10}$/,
      message: '用戶名必須是5~10位數字符',
      trigger: 'change'
    }
  ],
  email: [
    { required: true, message: '請輸入信箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '請輸入正確的信箱格式',
      trigger: 'change'
    }
  ]
})

// 獲取表單DOM
const formRef = ref(null)

// 提交表單
const submit = async () => {
  // 提交表單時再次驗證正則是否通過
  await formRef.value.validate()
  // 使用確認框 , 再次確認用戶是否要修改個人資料
  await ElMessageBox.confirm('確定修改嗎?', '溫馨提示', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })
  // 發送請求修改數據
  await userEditInfoService(userForm.value)
  // 修改完後台後 , 還要修改 Pinia裡面存儲的數據 所以需要調用方法
  getUserInfo()
  ElMessage.success('修改成功!')
}

// 重製表單
const onReset = async () => {
  // 先詢問用戶是否要清空
  await ElMessageBox.confirm('確定要重製嗎?', '溫馨提示', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 走到這裡代表點擊確認 那就清空
  userForm.value.nickname = ''
  userForm.value.email = ''
}
</script>

<template>
  <PageContainer title="用戶基本資料" class="user-profile">
    <!-- 表單區域 -->
    <el-form
      :model="userForm"
      :rules="rules"
      ref="formRef"
      :hide-required-asterisk="true"
      label-width="50px"
    >
      <!-- 頭像部分 -->
      <el-form-item>
        <div class="avatar">
          <el-avatar
            :shape="'square'"
            :src="userForm.user_pic || defaultAvatar"
          ></el-avatar>
          <p class="prompt" v-show="!userForm.user_pic">用戶目前沒有設定頭像</p>
        </div>
      </el-form-item>
      <!-- 輸入框部分 -->
      <div class="input">
        <!-- 帳號輸入框 -->
        <el-form-item label="帳號 : ">
          <el-input
            v-model="userForm.username"
            disabled
            style="width: 15vw"
          ></el-input>
        </el-form-item>
        <!-- 密碼輸入框 -->
        <el-form-item label="暱稱 : " prop="nickname">
          <el-input v-model="userForm.nickname" style="width: 15vw"></el-input>
        </el-form-item>
        <!-- 信箱輸入框 -->
        <el-form-item label="信箱 : " prop="email">
          <el-input v-model="userForm.email" style="width: 15vw"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <!-- 按鈕部分 -->
        <div class="buttonItem">
          <el-button type="primary" @click="submit">提交修改</el-button>
          <el-button type="warning" @click="onReset">重製表單</el-button>
        </div>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>

<style lang="scss" scoped>
.user-profile {
  // 頭像部分
  .avatar {
    position: relative;

    .prompt {
      position: absolute;
      font-size: 12px;
      bottom: 10px;
      left: 15px;
      color: white;
      user-select: none;
    }

    .el-avatar {
      width: 150px;
      height: 150px;
    }
  }
}
</style>
