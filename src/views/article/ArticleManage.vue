<script setup>
import { ref } from 'vue'
import { Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
// 導入router
import { useRouter } from 'vue-router'
const router = useRouter()
// 引入組件
import ChannelSelect from './components/ChannelSelect.vue'
import ArticlelDrawer from './components/ArticleDrawer.vue'
// 引入api
import {
  artGetChannelManageService,
  artDelArticleContentService
} from '@/api/article.js'
// 引入插件
import { formatDate } from '@/utils/formatDate' // 導入日期插件

const articleList = ref([]) // 文章列表數據
const articleTotal = ref(0) // 文章總數量
const loading = ref(false) // v-loading 效果的變量
const drawerDom = ref(null) // 獲取 ArticleDrawer組件的 DOM元素

// 獲取文章列表參數
const params = ref({
  pagenum: 1, // 當前分頁數
  pagesize: 5, // 單頁面需要的數據數量
  cate_id: '', // 文章分類 id
  state: '' // 文章發布狀態 (參數是中文)
})

// 封裝獲取文章列表數據
const getArticleList = async () => {
  loading.value = true
  const result = await artGetChannelManageService(params.value)
  // 將獲取到的數據存入到上面準備好的空數組中
  articleList.value = result.data.data // 文章列表數據
  articleTotal.value = result.data.total // 文章總數量
  loading.value = false
}
// 一進頁面就要渲染 , 直接調用即可!
getArticleList()

// 切換分頁
const onCurrentChange = (num) => {
  // 那切換分頁也是一樣 直接和我們上面對應綁定的數據 來去和形參做賦值即可!
  params.value.pagenum = num
  // 別忘記要重新調用請求數據 重新渲染!
  getArticleList()
}

// 搜索按鈕
const onSearch = () => {
  // 點擊搜索按鈕時要重製回第一頁
  params.value.pagenum = 1
  // 直接發請求即可!
  getArticleList()
}

// 重製按鈕
const onReset = () => {
  // 點擊重製按鈕時要重製回第一頁
  params.value.pagenum = 1
  // 並且要把相關的 參數清空
  params.value.cate_id = ''
  params.value.state = ''

  // 最後再重新發一次請求渲染即可!
  getArticleList()
}

// 發布文章按鈕
const addArticle = () => {
  // 點擊後 讓控制抽屜組件顯示隱藏的變量為 true 就可以了!
  drawerDom.value.openDrawer({})
}
// 編輯按紐
const onEdit = (row) => {
  // 點擊後 讓控制抽屜組件顯示隱藏的變量為 true 就可以了! , 並且把 row(文章詳情資訊) 傳入進去 方便做數據的回顯
  drawerDom.value.openDrawer(row)
}
// 刪除按鈕
const onDel = async (row) => {
  await ElMessageBox.confirm('將永久刪除該文章，是否確認刪除?', '溫馨提示', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })

  await artDelArticleContentService(row.id)
  getArticleList()
  ElMessage.success('刪除文章成功!')
}

// 處理分頁邏輯
// 切換單頁面顯示的數據數量
const onSizeChange = (size) => {
  // 只要每條數據數量變化了 , 那麼就切換回第一頁 , 因為原本的數據大概率就不在原來的那一頁了!
  // 所以點擊 切換單頁面顯示數據數量時 自動切換回第一頁
  params.value.pagenum = 1
  // 那接下來就是根據我們上面綁定的數據 , 來去和形參做賦值即可!
  params.value.pagesize = size

  // 別忘記要重新調用請求數據 重新渲染!
  getArticleList()
}

// 監聽 抽屜組件回傳過來的事件 (添加/編輯按紐)
const onAdd = (state) => {
  // 因為前面已經對添加按鈕傳遞參數 add 了 , 如果 state 為 add 說明是添加按鈕!
  if (state === 'add') {
    // 因為是渲染按鈕 , 所以要跳轉到最後一頁 (案例需求) 「這裡+1是為了確保是在添加文章後的結果」
    const lastPage = Math.ceil((articleTotal.value + 1) / params.value.pagesize)
    // 將拿到的最後一頁去更新 請求的 當前分頁數
    params.value.pagenum = lastPage
    // 最後重新發一次請求即可!
    getArticleList()
  }

  // 走到這裡 , 說明點擊的是編輯按紐 那就直接渲染當前頁面即可
  getArticleList()
}

// 點擊文章後跳轉到文章內容的事件處理函數
const showArticle = (row) => {
  // 跳轉到文章內容頁面
  router.push(`/article/content/${row.id}`)
}
</script>

<template>
  <div class="box">
    <!-- PageContainer組件 卡片部分 -->
    <PageContainer title="文章管理頁面">
      <template #extra>
        <el-button type="primary" @click="addArticle">發布文章</el-button>
      </template>

      <!-- 上面文章分類和發布狀態下拉框 -->
      <el-form inline label-width="85px">
        <!-- 文章分類部分 -->
        <el-form-item label="文章分類 : ">
          <ChannelSelect v-model="params.cate_id"></ChannelSelect>
        </el-form-item>

        <!-- 發布狀態部分 -->
        <el-form-item label="發布狀態 : ">
          <el-select
            placeholder="請確認發布狀態"
            style="width: 180px"
            v-model="params.state"
          >
            <el-option label="已發布" value="已发布"></el-option>
            <el-option label="草稿" value="草稿"></el-option>
          </el-select>
        </el-form-item>
        <!-- 搜索和重製按鈕部分 -->
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onSearch"
            >搜索</el-button
          >
          <el-button type="warning" :icon="Refresh" @click="onReset"
            >重製</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 中間內容部分 -->
      <el-table
        :data="articleList"
        style="width: 100%"
        max-height="100%"
        v-loading="loading"
      >
        <el-table-column prop="title" label="文章標題" align="center">
          <!-- 文章超連結 -->
          <template #default="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="showArticle(row)"
              >{{ row.title }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="分類名稱"
          align="center"
        ></el-table-column>
        <el-table-column prop="pub_date" label="發布時間" align="center">
          <template #default="{ row }">
            {{ formatDate(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="狀態"
          align="center"
        ></el-table-column>
        <el-table-column prop="" label="操作" width="140px" align="center">
          <!-- 利用作用域插槽 row 可以獲取當前行的數據 ==> 相當於 v-for 裡面的 item -->
          <template #default="{ row }">
            <!--編輯按紐--->
            <el-button
              type="primary"
              :icon="Edit"
              circle
              plain
              @click="onEdit(row)"
            />
            <!--刪除按紐--->
            <el-button
              type="danger"
              :icon="Delete"
              circle
              plain
              @click="onDel(row)"
            />
          </template>
        </el-table-column>

        <!-- 空數據的處理 el-empty組件 -->
        <template #empty>
          <el-empty description="目前沒有文章!" />
        </template>
      </el-table>
      <!-- 底部分頁部分 -->
      <el-pagination
        v-show="articleList.length !== 0"
        v-model:current-page="params.pagenum"
        v-model:page-size="params.pagesize"
        :page-sizes="[5, 10, 15, 20]"
        :background="false"
        layout="jumper , prev, pager, next,  sizes , total "
        :total="articleTotal"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />

      <!-- 抽屜組件 -->
      <ArticlelDrawer ref="drawerDom" @success="onAdd"></ArticlelDrawer>
    </PageContainer>
  </div>
</template>

<style lang="scss" scoped></style>
