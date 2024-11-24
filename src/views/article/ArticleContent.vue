<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
// 導入api
import { artGetArticleContentService } from '@/api/article'
// 導入基地址
import { baseURL } from '@/utils/request'

const isLoading = ref(false) // 控制 loading效果的變量

const articleContent = ref([]) // 存儲獲取到的文章數據

const imgUrl = ref('') // 存儲文章封面的地址

// 獲取文章詳情數據
const getArticleContent = async () => {
  isLoading.value = true

  const res = await artGetArticleContentService(route.params.id)

  articleContent.value = res.data.data

  // 拼接文章封面的地址 , 做渲染用 防止 undefined 出現的問題
  imgUrl.value = `${baseURL}${articleContent.value.cover_img}`

  isLoading.value = false
}

onMounted(() => {
  getArticleContent()
})

// 跳轉到作者頁面
const jumpToAuthor = async () => {
  // 先詢問用戶是否要跳轉
  await ElMessageBox.confirm('是否要跳轉到作者個人頁面？', '提示', {
    confirmButtonText: '跳轉',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 走到這裡代表點擊確認要跳轉 那就跳轉到作者頁面
  router.push('/user/profile')
}
</script>

<template>
  <div class="box" v-loading="isLoading">
    <PageContainer
      :title="`${articleContent.cate_name || '正在加載...'} `"
      style="border-radius: 10px"
    >
      <article class="common-layout">
        <el-container>
          <!-- 左側文章圖片 -->
          <el-aside width="200px">
            <div class="articleImg">
              <img :src="imgUrl" />
            </div>
          </el-aside>
          <el-container>
            <!-- 文章標題部分 -->
            <el-header>
              <div class="articleTitle">
                <h2>{{ articleContent.title }}</h2>
                <div class="authorItem">
                  <span>作者</span>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="到作者的個人頁面"
                    placement="top-end"
                  >
                    <p @click="jumpToAuthor" class="author">
                      @{{ articleContent.nickname || articleContent.username }}
                    </p>
                  </el-tooltip>
                </div>
              </div>
            </el-header>

            <!-- 文章內容部分 -->
            <el-main class="main-content">
              <div class="articleCotent">
                <p v-html="articleContent.content"></p>
              </div>
              <!-- 回到上一頁按鈕 -->
              <el-button
                type="primary"
                size="large"
                class="goBackBtn"
                @click="router.back()"
                >點我回到文章管理頁面</el-button
              >
            </el-main>
          </el-container>
        </el-container>
      </article>
    </PageContainer>
  </div>
</template>

<style lang="scss" scoped>
.box {
  .common-layout {
    height: calc(80vh - $top-height - $footer-height);
    position: relative;

    // 文章圖片部分
    .articleImg {
      margin-right: 10px;
      width: 180px;
      height: 180px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .el-header {
      border-bottom: 1px solid #d1daee;

      // 文章標題 和 作者部分
      .articleTitle {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 30px;

        // 文章標題
        h2 {
          font-size: 30px;
          font-weight: 700;
          margin: auto;
          background: linear-gradient(to right, #c2e59c, #64b3f4);
          color: transparent;
          background-clip: text;
        }

        // 作者部分
        .authorItem {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 24px;
          font-weight: 600;

          .author {
            font-size: 20px;
            color: #409eff;
            cursor: pointer;
          }
        }
      }
    }

    // 文章內容部分
    .main-content {
      .articleCotent {
        font-size: 20px;
        font-weight: 600;
      }

      // 回到上一頁按鈕
      .goBackBtn {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
