<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { artGetChannelService, artDelChannelService } from '@/api/article'
import { ref } from 'vue'
import channelEdit from './components/channelEdit.vue' // 導入 channelEdit 局部組件

const channelList = ref([]) //  存儲文章分類列表
const isLoading = ref(false) // 控制 v-loading 效果的變量
const editDom = ref(null) // 獲取channelEdit的組件實例

//  發送文章分類列表請求
const getChannelList = async () => {
  isLoading.value = true // 在獲取數據前 開啟loading效果
  const result = await artGetChannelService()
  channelList.value = result.data.data //  存儲到上面創建的空數組中
  isLoading.value = false // 獲取到數據後 關閉 loading 效果即可!
}

// 一進頁面就要渲染 , 所以直接調用 發請求
getChannelList()

// 刪除按鈕部分
const isDelete = async (row) => {
  try {
    // 1. 在刪除前彈出提示框 , 因為加入了 await 如果點擊刪除時 才會往下走
    await ElMessageBox.confirm('你確認要刪除該分類嗎?', '溫馨提示', {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 2. 走到這裡是點擊確認按鈕了! 那就發送請求刪除吧!
    await artDelChannelService(row.id)
    // 3. 刪除完成後彈出提示框
    ElMessage.success('刪除成功!')
    // 4. 最後重新渲染一次 更新數據 這樣就ok了!
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
  getChannelList()
}
</script>

<template>
  <!-- PageContainer組件 卡片部分 -->
  <PageContainer title="文章分類頁面">
    <template #extra>
      <el-button type="primary" @click="addChannel">添加分類</el-button>
    </template>

    <el-table v-loading="isLoading" :data="channelList" style="width: 100%">
      <el-table-column type="index" prop="" label="序號" width="100" />
      <el-table-column prop="cate_name" label="分類名稱" />
      <el-table-column prop="cate_alias" label="分類別名" />
      <el-table-column prop="" label="操作" width="200">
        <template #default="{ row, $index }">
          <!-- 編輯按鈕部分 -->
          <el-button
            type="primary"
            @click="isEdit(row, $index)"
            :icon="Edit"
            circle
          ></el-button>
          <!-- 刪除按鈕部分 -->
          <el-button
            type="danger"
            @click="isDelete(row, $index)"
            :icon="Delete"
            circle
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="暫時沒有數據" />
      </template>
    </el-table>
    <!-- 封裝的彈層組件 -->
    <channelEdit ref="editDom" @success="onSuccess"></channelEdit>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
