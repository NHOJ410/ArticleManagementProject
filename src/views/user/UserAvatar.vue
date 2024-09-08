<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
const userAvatar = ref('')

// 上傳圖片事件
const onUpload = (uploadFile) => {
  // 使用 URL.createObjectURL() 方法來解析 uploadFile所提供的 raw 形成一個內網圖片地址 , 並且存到上面準備好的圖片變量中!
  userAvatar.value = URL.createObjectURL(uploadFile.raw) // 這樣網頁中就可以顯示了
}
</script>

<template>
  <PageContainer title="更換用戶頭像">
    <el-row>
      <el-col :span="8">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUpload"
        >
          <img v-if="userAvatar" :src="userAvatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="buttonBox">
          <el-button size="large" type="primary" :icon="Plus"
            >選擇圖片</el-button
          >
          <el-button size="large" type="success" :icon="Upload"
            >上傳圖片</el-button
          >
        </div>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style lang="scss" scoped>
// 用戶頭像樣式
.avatar-uploader {
  :deep() {
    .el-upload {
      width: 100%;
      height: 500px;
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

// 按鈕部分
.buttonBox {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
