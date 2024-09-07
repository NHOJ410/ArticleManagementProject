<script setup>
import { ref, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
// VueQuill 富文本編輯器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// 導入api
import {
  artPostArticleManageService,
  artGetArticleContentService,
  artEditArticleContentService
} from '@/api/article'
// 導入組件
import ChannelSelect from './ChannelSelect.vue' // 下拉框組件
// 導入基地址
import { baseURL } from '@/utils/request'
// 導入axios 做 圖片數據類型轉換
import axios from 'axios'

const visibleDrawer = ref(false) // 控制抽屜組件顯示隱藏的變量
const imgURL = ref('') // 用來存儲上傳圖片的地址
const vueQuill = ref(null) // 獲取富文本編輯器的DOM 使用裡面的 setHTML() 來重製輸入框

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
  formData.value.cover_img = uploadFile.raw
}

//  創建控制抽屜組件顯示的變量 , 並且傳入參數 row 等等要用這個來判斷 是添加還是編輯
const openDrawer = async (row) => {
  visibleDrawer.value = true
  await nextTick() // 在開始抽屜組件時 , 調用 nextTick() 等待DOM加載完成!
  // 解決 row 拿回來的數據不完全的問題 根據 row.id 做判斷
  //  如果有 row.id 說明是 [ 編輯按紐狀態 ] 就要發請求獲取詳情數據

  if (row.id) {
    formData.value = defaultFormData
    //  點擊編輯按鈕時 發送請求 獲取相對應的文章數據
    const result = await artGetArticleContentService(row.id)

    formData.value = result.data.data // 複製給表單 做回顯功能
    imgURL.value = baseURL + formData.value.cover_img // 渲染圖片 ( 記得接口文檔的需求 , 要在前面拼接基地址 ! )

    // 提交給後端，需要的是 file 格式的，將網路圖片轉成 file 格式
    // 網路圖片轉成 file 對象，需要轉換一下
    formData.value.cover_img = await imageUrlToFile(
      imgURL.value,
      formData.value.cover_img
    )
  } else {
    //  如果 else 就是發布文章按鈕狀態 , 就要把表單清空 讓表單是乾淨的
    formData.value = { ...defaultFormData }

    imgURL.value = '' // 重製文章封面
    vueQuill.value.setHTML('') // 重製富文本輸入框值 , 傳入空字符串就可以了!
  }
}

// 將網路圖片地址轉換為File對象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios獲取網路圖片資料
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：將圖片資料轉換為Blob對象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：創建一個新的File對象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('將圖片轉換為File對象時發生錯誤:', error)
    throw error
  }
}

// 表單校驗部分
const rules = {
  title: [{ required: true, message: '文章標題不能為空!', trigger: 'blur' }],
  cate_id: [{ required: true, message: '請選擇一個選項!', trigger: 'blur' }]
}

//  定義 emit 子傳父
const emit = defineEmits(['success'])

// 發布文章 , 草稿按鈕
const onPublish = async (state) => {
  // 將我們需要的參數傳入進去 [ state 需要是中文 已發布/草稿 來辨別 ]
  formData.value.state = state

  //  按照接口文檔需求 要將 [普通對象] --> 轉換成 [FormData對象]
  const fd = new FormData() //  new一個 FormData對象
  //  利用for in 遍歷我們的表單數據
  for (let key in formData.value) {
    fd.append(key, formData.value[key]) //  利用 FormData提供的 append方法 , 將我們表單數據的值 , 加入到我們創建的 FormData對象裡面
  }
  //  發請求前 判斷是編輯操作還是添加操作
  //  有 id 說明是編輯操作 ,
  if (formData.value.id) {
    await artEditArticleContentService(fd)
    // 修改成功後給個提示框並且關閉抽屜組件即可!
    ElMessage.success('修改文章成功!')
    visibleDrawer.value = false
    //  使用 emit 通知父組件 添加成功!
    emit('success', 'edit') //  並且要區分添加按鈕還是編輯按紐 , 需要額外傳遞參數
  } else {
    //  如果沒有 id 說明是添加操作 , 那直接用原本的邏輯就可以了!
    await artPostArticleManageService(fd) //  這裡注意參數是要傳入我們剛剛轉換完成的 [formData對象!]

    // 發布成功後給個提示框並且關閉抽屜組件即可!
    ElMessage.success('發布文章成功!')
    visibleDrawer.value = false
    //  使用 emit 通知父組件 添加成功!
    emit('success', 'add') //  並且要區分添加按鈕還是編輯按紐 , 需要額外傳遞參數
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
    title="發布文章"
    direction="rtl"
    size="100%"
    class="drawer-body"
    open-delay="1200"
  >
    <!-- 發表文章表單 -->
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
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
            ref="vueQuill"
          />
        </div>
      </el-form-item>
      <!-- 底部按鈕部分 -->
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')"
          >發布文章</el-button
        >
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
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
    min-height: 400px;
    font-size: 40px;
  }
}
</style>
