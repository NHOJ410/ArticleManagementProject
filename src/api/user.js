import request from '@/utils/request.js'

// 註冊請求

export const userRegisterService = ({ username, password, repassword }) => {
  //  這裡注意 參數必須傳的是一個對象! 裡面可以進行解構

  //  接下來就調用請求就可以了! , 記得要加上 return 老問題了
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

// 登入請求

export const userLoginService = ({ username, password }) => {
  // 這裡一樣注意 必須是一個對象

  // 接下來調用請求就可以了
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 獲取用戶個人訊息請求

export const userGetInfoService = () => {
  return request({
    url: '/my/userinfo'
  })
}

// 修改個人訊息請求
export const userEditInfoService = (data) => {
  return request({
    url: '/my/userinfo',
    method: 'put',
    data
  })
}

// 更改密碼請求
export const updatePasswordService = (data) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data
  })
}

// 更改用戶頭像請求
export const updateAvatarService = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}
