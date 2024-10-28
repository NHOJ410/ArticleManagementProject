<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
// 導入api
import { updateAvatarService } from '@/api/user'
// 導入倉庫
import { useUserStore } from '@/stores'
const userStore = useUserStore()

// 用戶頭像顯示部分
const userAvatar = ref('')

// 獲取用戶頭像
const getUserAvatar = () => {
  userAvatar.value = userStore.userInfo.user_pic
}

onMounted(() => {
  getUserAvatar()
})

// ------------------- 選擇圖片部分 -----------------
const uploadRef = ref() // 獲取el-upload的dom元素

// 選擇圖片的事件處理函數
const choseImg = () => {
  // 調用 nextTick 等待DOM更新完成
  nextTick(() => {
    // 調用 input 裡面的 type="file" 來觸發「檔案總管」
    uploadRef.value.$el.querySelector('input[type="file"]').click()
  })
}

// ------------------ 上傳圖片部分 -----------------
const isUploadNewImg = ref(false) // 控制是否上傳新圖片的變量

// 圖片回顯事件 (得到圖片的base64格式)
const onUpload = async (uploadFile) => {
  // 轉換成base64格式 方便我們做後續的提交動作
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    userAvatar.value = reader.result
  }

  // 將 [ 控制是否上船新圖片的變量 ] 為 true 打開按鈕
  isUploadNewImg.value = true
}

// 上傳圖片事件
const updateAvatar = async () => {
  // 調用請求 更改頭像
  await updateAvatarService(userAvatar.value)

  // 提示用戶更改頭像成功
  ElMessage.success('更改頭像成功!')

  // 調用user倉庫方法 重新獲取用戶個人訊息
  userStore.getUserInfo()

  // 清空存儲圖片的變量
  userAvatar.value = ''
}
</script>

<template>
  <PageContainer title="更換用戶頭像">
    <el-row>
      <el-col :span="8">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUpload"
        >
          <img v-if="userAvatar" :src="userAvatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <div class="buttonBox">
          <el-button
            :size="'large'"
            @click="choseImg"
            type="primary"
            :icon="Plus"
            >選擇圖片</el-button
          >
          <el-button
            :size="'large'"
            @click="updateAvatar"
            type="success"
            :disabled="!isUploadNewImg"
            :icon="Upload"
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
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 50%;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      .avatar {
        object-fit: cover;
        /* 確保圖片不超出容器 */
        max-width: 100%;
        /* 確保圖片不超出容器 */
        max-height: 100%;
      }
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
  width: 50%;
  height: 50%;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
