<script setup>
import { ref } from 'vue'
import { Refresh, Select } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// 導入api
import { updatePasswordService } from '@/api/user'
// 導入倉庫
import { useUserStore } from '@/stores' // 導入用戶倉庫
const userStore = useUserStore() // 定義用戶倉庫

const router = useRouter()

// 更改密碼表單部分
const userParams = ref({
  old_pwd: '', // 舊密碼
  new_pwd: '', // 新密碼
  re_pwd: '' // 新密碼二次確認
})

// -------------- 更改密碼表單校驗 -----------------------

const passOldPwd = ref(false) // 控制舊密碼是否正確的變量

// 舊密碼的自定義驗證規則
const oldPwdValidate = (rule, value, callback) => {
  // 如果舊密碼輸入不正確 就拋出錯誤
  if (value !== userStore.userPassword) {
    return callback(
      new Error('請確認舊密碼是否正確 , 只有舊密碼輸入正確才可以設定新密碼')
    )
  }

  // 走到這裡代表舊密碼輸入正確
  callback()

  // 關閉舊密碼驗證
  passOldPwd.value = true
}

// 二次輸入密碼的自定義驗證規則
const confirmPwdValidate = (rule, value, callback) => {
  // 如果二次驗證輸入的密碼不正確 就拋出錯誤
  if (value !== userParams.value.new_pwd) {
    return callback(new Error('請確認二次密碼是否一致'))
  }

  // 走到這裡代表輸入正確
  callback()
}

// 更改密碼表單校驗規則
const rules = ref({
  // 舊密碼
  old_pwd: [
    { required: true, message: '請輸入舊密碼', trigger: 'blur' },
    { validator: oldPwdValidate, trigger: 'change' }
  ],
  // 新密碼
  new_pwd: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    { min: 6, max: 15, message: '密碼必須是6~15位數字符', trigger: 'blur' }
  ],
  // 二次驗證新密碼
  re_pwd: [
    { required: true, message: '請再次輸入密碼', trigger: 'blur' },
    { min: 6, max: 15, message: '密碼必須是6~15位數字符', trigger: 'blur' },
    { validator: confirmPwdValidate, trigger: 'blur' }
  ]
})

// ------------------ 按鈕部分 ---------------------

const formRef = ref(null) // 獲取表單元素

// 重製按鈕部分
const resetForm = () => {
  // 調用elementPlus提供的方法 重製表單
  formRef.value.resetFields()
}

// 確認更改按鈕部分
const updatePwd = async () => {
  // 發送請求 提交新的密碼之前 先二次驗證 防止無效請求
  formRef.value.validate()

  // 走到這裡 代表通過表單驗證 , 那麼再次提示用戶是否要更改
  await ElMessageBox.confirm('是否確認更改密碼?', '提示', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 發送請求 更改密碼
  await updatePasswordService(userParams.value)

  // 提示用戶更改成功
  ElMessage.success('密碼更改成功! , 三秒後將重新登入...')

  // 重新登入邏輯
  setTimeout(() => {
    // 將token設為空
    userStore.setToken('')
    // 將用戶訊息設為空
    userStore.setUserInfo('')

    // 跳轉到登入頁面
    router.replace('/login')
  }, 3000)
}
</script>

<template>
  <div class="box">
    <PageContainer title="更改密碼">
      <!-- 更改密碼部分 -->
      <div class="updatePwd">
        <el-form
          label-width="90px"
          ref="formRef"
          :model="userParams"
          :rules="rules"
          :hide-required-asterisk="true"
        >
          <!-- 舊密碼輸入框 -->
          <el-form-item label="舊密碼" prop="old_pwd">
            <el-input
              placeholder="請輸入舊密碼"
              v-model.trim="userParams.old_pwd"
            ></el-input>
          </el-form-item>
          <!-- 新密碼輸入框 -->
          <el-form-item label="新密碼" prop="new_pwd">
            <el-input
              placeholder="請輸入新密碼"
              :disabled="!passOldPwd"
              v-model.trim="userParams.new_pwd"
              :show-password="true"
            ></el-input>
          </el-form-item>
          <!-- 新密碼二次確認 -->
          <el-form-item label="確認新密碼" prop="re_pwd">
            <el-input
              placeholder="請再次輸入新密碼"
              :disabled="!passOldPwd"
              v-model.trim="userParams.re_pwd"
              :show-password="true"
            ></el-input>
          </el-form-item>

          <!-- 按鈕部分 -->
          <el-form-item>
            <el-button type="primary" :icon="Select" @click="updatePwd"
              >確認更改</el-button
            >
            <el-button type="warning" :icon="Refresh" @click="resetForm"
              >reset數據</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </PageContainer>
  </div>
</template>

<style scoped lang="scss">
.box {
  // 更改密碼部分
  .updatePwd {
    // 更改密碼表單
    .el-form {
      // 密碼輸入框長度
      .el-input {
        width: 20vw;
      }
    }
  }
}
</style>
