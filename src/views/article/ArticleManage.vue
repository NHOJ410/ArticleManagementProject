<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from '@/views/article/components/channelSelect.vue'

const articleList = ref([
  {
    Id: 5961,
    title: '文章1',
    pub_date: '2022-07-10 14:53:52.604',
    state: '已發布',
    cate_name: '體育'
  },
  {
    Id: 5962,
    title: '文章2',
    pub_date: '2022-07-10 14:54:30.904',
    state: null,
    cate_name: '生物'
  }
])

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
  pagesize: '15', // 單頁面需要的數據數量
  cate_id: '', // 文章分類 id
  state: '' // 文章發布狀態 (參數是中文)
})
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
      <!-- 確認和取消部分 -->
      <el-form-item>
        <el-button type="primary">確認</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 中間內容部分 -->
    <el-table :data="articleList" style="width: 100%">
      <el-table-column prop="title" label="文章標題">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分類"></el-table-column>
      <el-table-column prop="pub_date" label="發表時間"></el-table-column>
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
    </el-table>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
