<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
// VueQuill 富文本編輯器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// 導入組件
import ChannelSelect from './ChannelSelect.vue' // 下拉框組件

const visibleDrawer = ref(false) // 控制抽屜組件顯示隱藏的變量
const imgURL = ref('') // 用來存儲上傳圖片的地址

// 基礎表單數據
const defaultFormData = {
  title: '', // 標題
  cate_id: '', // 分類id
  content: '', // 文章內容
  cover_img: '', // 文章封面圖片
  state: '' // 發布狀態 (中文)
}

// 文章表單數據
const formData = ref({ ...defaultFormData })

// 上傳圖片事件
const onUpload = (uploadFile) => {
  // 使用 URL.createObjectURL() 方法來解析 uploadFile所提供的 raw 形成一個內網圖片地址 , 並且存到上面準備好的圖片變量中!
  imgURL.value = URL.createObjectURL(uploadFile.raw) // 這樣網頁中就可以顯示了
  // 最後別忘記要存入到 formData中
  formData.value.cover_img = imgURL.value
}

//  創建控制抽屜組件顯示的變量 , 並且傳入參數 row 等等要用這個來判斷 是添加還是編輯
const openDrawer = (row) => {
  visibleDrawer.value = true
  // 解決 row 拿回來的數據不完全的問題 根據 row.id 做判斷
  //  如果有 row.id 說明是 [ 編輯按紐狀態 ] 就要發請求獲取詳情數據
  if (row.id) {
    console.log('編輯狀態')
  } else {
    //  如果 else 就是發布文章按鈕狀態 , 就要把表單清空 讓表單是乾淨的
    formData.value = { ...defaultFormData }
    console.log('發布文章狀態')
  }
}

//  利用 defineExpose 對外暴露 , 這樣父組件才可以使用!
defineExpose({
  openDrawer
})
</script>

<template>
  <!-- 抽屜組件 -->
  <el-drawer
    v-model="visibleDrawer"
    title="文章"
    direction="rtl"
    size="50%"
    class="drawer-body"
  >
    <!-- 發表文章表單 -->
    <el-form :model="formData" ref="formRef" label-width="100px">
      <!-- 文章標題區域 -->
      <el-form-item label="文章標題 : " prop="title">
        <el-input v-model="formData.title" placeholder="請輸入標題"></el-input>
      </el-form-item>
      <!-- 文章分類下拉框 -->
      <el-form-item label="文章分類 : " prop="cate_id">
        <ChannelSelect
          v-model="formData.cate_id"
          style="width: 100%"
        ></ChannelSelect>
      </el-form-item>
      <!-- 文章封面部分(尚未製作) -->
      <el-form-item label="文章封面 : " prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUpload"
        >
          <img v-if="imgURL" :src="imgURL" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <!-- 文章內容部分(尚未製作) -->
      <el-form-item label="文章內容 : " prop="content">
        <div class="editor">
          <QuillEditor
            theme="snow"
            v-model:content="formData.content"
            contentType="html"
          />
        </div>
      </el-form-item>
      <!-- 底部按鈕部分 -->
      <el-form-item>
        <el-button type="primary">發布</el-button>
        <el-button type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
/* 上傳圖片部分 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

// VueQuill 富文本編輯器
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
