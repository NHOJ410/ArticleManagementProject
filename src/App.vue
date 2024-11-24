<script setup>
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
</script>

<template>
  <div>
    <el-config-provider :locale="zhTw">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped></style>
