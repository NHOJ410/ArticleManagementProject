<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

// 利用 defineProps 接收父組件傳遞過來的 title名字
defineProps({
  title: {
    type: String,
    default: '正在加載...'
  }
})
</script>

<template>
  <div class="box">
    <el-card class="page-container">
      <template #header>
        <!-- 頂部標題 -->
        <div class="card-header">
          <!-- 麵包屑導航部分 -->
          <el-breadcrumb separator="/" class="title">
            <el-breadcrumb-item
              v-if="route.matched[1]?.name === '文章內容'"
              :to="{ path: '/article/manage' }"
              >文章管理</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="extra">
            <!-- 使用具名插槽來佔位 , 按鈕部分 -->
            <slot name="extra"></slot>
          </div>
        </div>
      </template>
      <!-- 使用默認插槽來佔位 , 內容部分 -->
      <slot></slot>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box {
  .page-container {
    min-height: 100%;
    border-radius: 10px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      font-size: 20px;
    }
  }
}
</style>
