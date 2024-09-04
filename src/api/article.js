import request from '@/utils/request'

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
