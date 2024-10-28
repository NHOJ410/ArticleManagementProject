<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userEditInfoService } from '@/api/user'

// 將 Pinia 倉庫裡面有關用戶的數據解構出來
const {
  userInfo: { nickname, email, username, id },
  getUserInfo
} = useUserStore()

// 用戶表單數據
const userForm = ref({
  username,
  nickname,
  email,
  id
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
</script>

<template>
  <PageContainer title="用戶基本資料" class="user-profile">
    <!-- 表單區域 -->
    <el-form
      label-width="60px"
      :model="userForm"
      :rules="rules"
      ref="formRef"
      :hide-required-asterisk="true"
    >
      <el-form-item label="帳號 : " label-width="60px">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="暱稱 : " label-width="60px" prop="nickname">
        <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="信箱 : " label-width="60px" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
