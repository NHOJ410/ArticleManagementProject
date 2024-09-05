import { dayjs } from 'element-plus' // 1. 導入 dayjs庫 ( elementPlus 已經幫我們封裝好了! )

// 2. 按需導出方法 , 並且設定我們想要的格式
export const formatDate = (time) => {
  return dayjs(time).format('YYYY年MM月DD日') // 3. 這裡 format的格式一定要這樣寫!
}
