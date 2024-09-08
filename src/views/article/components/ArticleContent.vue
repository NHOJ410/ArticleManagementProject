<script setup>
import { ref } from 'vue'

const showVisible = ref(false)

const showArticle = () => {
  showVisible.value = true
}

defineExpose({
  showArticle
})
</script>

<template>
  <div class="content">
    <!-- 抽屜組件 -->
    <el-drawer
      v-model="showVisible"
      direction="ttb"
      size="100%"
      class="content-drawer"
    >
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.content {
  :deep(.content-drawer) {
    background: url('../../../assets/content.jpg') no-repeat;
    background-size: cover;
  }
}
</style>
