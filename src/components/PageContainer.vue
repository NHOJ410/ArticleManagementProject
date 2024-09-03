<script setup>
// 利用 defineProps 接收父組件傳遞過來的 title名字
defineProps({
  title: {
    require: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 使用具名插槽來佔位 , 按鈕部分 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 使用默認插槽來佔位 , 內容部分 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
