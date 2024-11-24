<script setup>
import { ref, onMounted } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
// 導入api
import { artGetChannelService, artDelChannelService } from '@/api/article'
// 導入組件
import ChannelEdit from '@/views/article/components/ChannelEdit.vue' // 導入 channelEdit 局部組件
const channelList = ref([]) //  存儲文章分類列表
const isLoading = ref(false) // 控制 v-loading 效果的變量
const editDom = ref(null) // 獲取channelEdit的組件實例

//  封裝方法 , 來獲取文章分類列表
const getChannelList = async () => {
  isLoading.value = true // 在獲取數據前 開啟loading效果
  const result = await artGetChannelService() // 發送請求獲取數據
  channelList.value = result.data.data //  存儲到上面創建的空數組中
  isLoading.value = false // 獲取到數據後 關閉 loading 效果即可!
}

onMounted(() => {
  getChannelList()
})

// 刪除按鈕部分
const isDelete = async (row) => {
  try {
    await ElMessageBox.confirm('你確認要刪除該分類嗎?', '溫馨提示', {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await artDelChannelService(row.id)
    ElMessage.success('刪除成功!')
    getChannelList()
  } catch (error) {
    console.dir(error)
  }
}

// 編輯按鈕部分
const isEdit = (row) => {
  editDom.value.open(row)
}

// 添加分類按鈕部分
const addChannel = () => {
  editDom.value.open({})
}

// 子組件 添加/更新數據成功
const onSuccess = () => {
  // 重新調用請求 , 渲染最新的數據
  getChannelList()
}
</script>

<template>
  <div class="box">
    <!-- PageContainer組件 卡片部分 -->
    <PageContainer title="文章分類頁面">
      <!-- 使用具名插槽來渲染頂部 -->
      <template #extra>
        <!-- 右側按鈕部分 -->
        <el-button type="primary" :icon="Plus" @click="addChannel"
          >添加分類</el-button
        >
      </template>

      <!-- 中間內容部分 -->
      <el-table
        v-loading="isLoading"
        :data="channelList"
        style="width: 100%; height: 100%"
      >
        <!-- 內容部分 - 序列號 -->
        <el-table-column align="center" type="index" label="序號" width="100" />
        <!-- 內容部分 - 分類名稱 -->
        <el-table-column align="center" prop="cate_name" label="分類名稱" />
        <!-- 內容部分 - 分類別名 -->
        <el-table-column align="center" prop="cate_alias" label="分類別名" />

        <!-- 內容部分 - 按鈕區域 -->
        <el-table-column align="center" label="操作" width="200">
          <template #default="{ row }">
            <!-- 編輯按鈕部分 -->
            <el-button
              type="primary"
              @click="isEdit(row)"
              :icon="Edit"
              circle
            ></el-button>
            <!-- 刪除按鈕部分 -->
            <el-button
              type="danger"
              @click="isDelete(row)"
              :icon="Delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <!-- 如果沒有數據時的提示文字 -->
        <template #empty>
          <el-empty description="暫時沒有文章分類數據" />
        </template>
      </el-table>

      <!-- 封裝的彈層組件 -->
      <ChannelEdit ref="editDom" @success="onSuccess"></ChannelEdit>
    </PageContainer>
  </div>
</template>

<style lang="scss" scoped></style>
