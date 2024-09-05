<script setup>
import { ref } from 'vue'
import { artGetChannelService } from '@/api/article.js' //  導入之前封裝 獲取文章分類的請求接口

const articleList = ref([]) //  準備一個空數組來接收 獲取到的文章分類資料

//  封裝方法 來調用請求
const getArticleList = async () => {
  const result = await artGetChannelService()
  articleList.value = result.data.data //  將獲取到的請求存入上面準備好的空數組中
}

getArticleList() //  一進頁面就要渲染下拉框 所以直接調用即可!

//  利用 defineProps 來接收父組件 v-model 傳遞過來的數據
defineProps({
  //  因為 v-model拆分是 :modelValue 所以這裡就要用 modelValue
  modelValue: {
    type: [String, Number]
  }
})

//  因為要把更新後的數據回傳過去給父祖件來做綁定 , 所以要用 defineEmits()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <!--  最後 將 v-model 拆分成 :modelValue 和 @update:modelValue 並且將對應的數據傳遞回去即可!($event) -->
  <el-select
    placeholder="請確認文章分類"
    style="width: 150px"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="item in articleList"
      :label="item.cate_name"
      :key="item.id"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<style scoped></style>
