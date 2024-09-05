<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from '@/views/article/components/channelSelect.vue'
import { artGetChannelManageService } from '@/api/article.js'
import { formatDate } from '@/utils/formatDate'

const articleList = ref([]) // 文章列表數據
const articleTotal = ref(0) // 文章總數量
const loading = ref(false)

// 編輯按紐
const onEdit = (row) => {
  console.log(row)
}
// 刪除按鈕
const onDel = (row) => {
  console.log(row)
}

// 獲取文章列表參數
const params = ref({
  pagenum: 1, // 當前分頁數
  pagesize: 15, // 單頁面需要的數據數量
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
</script>

<template>
  <!-- PageContainer組件 卡片部分 -->
  <PageContainer title="文章管理頁面">
    <template #extra>
      <el-button type="primary">發布文章</el-button>
    </template>

    <!-- 上面文章分類和發布狀態下拉框 -->
    <el-form inline>
      <!-- 文章分類部分 -->
      <el-form-item label="文章分類 : ">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>

      <!-- 發布狀態部分 -->
      <el-form-item label="發布狀態 : ">
        <el-select
          placeholder="請確認發布狀態"
          style="width: 150px"
          v-model="params.state"
        >
          <el-option label="已發布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <!-- 搜索和重製按鈕部分 -->
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重製</el-button>
      </el-form-item>
    </el-form>

    <!-- 中間內容部分 -->
    <el-table
      :data="articleList"
      style="width: 100%"
      max-height="100%"
      v-loading="loading"
    >
      <el-table-column prop="title" label="文章標題">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分類"></el-table-column>
      <el-table-column prop="pub_date" label="發布時間">
        <template #default="{ row }">
          {{ formatDate(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="狀態"></el-table-column>
      <el-table-column prop="" label="操作" width="140px">
        <!-- 利用作用域插槽 row 可以獲取當前行的數據 ==> 相當於 v-for 裡面的 item -->
        <template #default="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            plain
            @click="onEdit(row)"
          />
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
        <el-empty description="沒有找到相關的數據!" />
      </template>
    </el-table>
    <!-- 底部分頁部分 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :background="false"
      layout="jumper , total, sizes, prev, pager, next, "
      :total="articleTotal"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </PageContainer>
</template>

<style lang="scss" scoped></style>
