import request from '@/utils/request'

// ----------------- 文章分類頁面 -----------------------
// 獲取文章分類數據
export const artGetChannelService = () => {
  return request({
    url: '/my/cate/list'
  })
}

// 新增文章分類
export const artAddChannelService = (data) => {
  return request({
    url: '/my/cate/add',
    method: 'post',
    data
  })
}

// 編輯文章分類
export const artEditChannelService = (data) => {
  return request({
    url: '/my/cate/info',
    method: 'put',
    data
  })
}

// 刪除文章分類
export const artDelChannelService = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'delete',
    params: {
      id
    }
  })
}

// ----------------- 文章列表頁面 -----------------------

// 獲取文章列表
export const artGetChannelManageService = (params) => {
  return request({
    url: '/my/article/list',
    params
  })
}

// 發布文章 注意接口文檔需求 data 要是一個 FormData格式的對象
export const artPostArticleManageService = (data) => {
  return request({
    url: '/my/article/add',
    method: 'post',
    data
  })
}

// 獲取文章詳情
export const artGetArticleContentService = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

// 更新文章內容
export const artEditArticleContentService = (data) => {
  return request({
    url: '/my/article/info',
    method: 'put',
    data
  })
}
