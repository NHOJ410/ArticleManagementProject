<script setup>
import { ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
// 導入api
import { artEditChannelService, artAddChannelService } from '@/api/article'

const dialogVisible = ref(false) // 控制彈層框的變量

// 編輯按鈕輸入框的變量 , 等等準備和 el-form 做數據綁定
const formData = ref({
  cate_name: '', // 分類名稱
  cate_alias: '' // 分類別名
})

// 編輯按紐輸入框的正則校驗
const rules = {
  // 分類名稱的校驗
  cate_name: [
    { required: true, message: '請輸入分類名稱', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '必須是1~10位的非空字符',
      trigger: 'blur'
    }
  ],
  // 分類別名的校驗
  cate_alias: [
    { required: true, message: '請輸入分類別名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,10}$/,
      message: '必須是1~10位的字母或數字',
      trigger: 'blur'
    }
  ]
}

// 組件對外爆露一個方法 open , 基於 open 傳遞過來的參數 , 區分是 [添加按鈕] 還是 [編輯按鈕]
// open({}) => 表單無須渲染回顯 , 說明是添加按鈕
// open({ id , cate_name , ... }) => 表單需要渲染回顯 , 說明是編輯按鈕
// open調用後 , 可以打開彈窗 (控制彈層框變量為 true)

//  創建 ( 添加/編輯 ) 按鈕邏輯
const open = (obj) => {
  // 先清除表單驗證殘留的錯誤
  formRef.value?.clearValidate()

  // 編輯按紐的回顯功能
  formData.value = { ...obj } // 如果是添加的話 -> ...obj 展開的會是 空數組 重置內容 , 如果是編輯的話 ...obj 展開的會是 需要存儲的數據

  dialogVisible.value = true //  打開彈層框
}

// 獲取表單元素
const formRef = ref(null)
const emit = defineEmits(['success']) // 2.  定義一個 子傳父的方法 success

// 確認框的事件處理函數
const onSubmit = async () => {
  // 調用 el-form 所提供的 validate( ) 方法 , 進行二次較驗
  await formRef.value.validate()

  //  先定義 id  來判斷點擊的是 編輯按紐還是添加按鈕
  const id = formData.value.id
  //  用 if 判斷 , 如果有 id 說明是編輯按紐
  if (id) {
    await artEditChannelService(formData.value)
    ElMessage.success('編輯成功!')
  } else {
    //  如果走到else 說明是沒有 id 的 那點擊的就是 添加按鈕
    await artAddChannelService(formData.value)
    ElMessage.success('添加成功!')
  }

  dialogVisible.value = false // 1. 關閉彈層框
  emit('success') // 3. 調用子傳父方法 success 通知父組件需要更新數據了!
}

//  上面完成後要對外爆露方法 ( defineExpose 宏 )
defineExpose({
  open
})
</script>

<template>
  <div class="box">
    <!-- 彈層框部分 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id ? '編輯分類' : '添加分類'"
      width="500"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        :hide-required-asterisk="true"
      >
        <!-- 分類名稱輸入框 -->
        <el-form-item label="分類名稱" prop="cate_name">
          <el-input
            placeholder="請輸入分類名稱"
            v-model="formData.cate_name"
          ></el-input>
        </el-form-item>
        <!-- 分類別名輸入框 -->
        <el-form-item label="分類別名" prop="cate_alias">
          <el-input
            placeholder="請輸入分類別名"
            v-model="formData.cate_alias"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按鈕部分 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :icon="Check" @click="onSubmit"
            >確認</el-button
          >
          <el-button type="warning" :icon="Close" @click="dialogVisible = false"
            >取消</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
