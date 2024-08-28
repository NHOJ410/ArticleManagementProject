import request from '@/utils/request.js'

// 驗證註冊請求模塊

export const userRegisterService = ({ username, password, repassword }) => {
  // 1. 這裡注意 參數必須傳的是一個對象! 裡面可以進行解構

  // 2. 接下來就調用請求就可以了! , 記得要加上 return 老問題了
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username,
      password,
      repassword
    }
  })
}
