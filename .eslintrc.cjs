/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'warn', // 顯示警告信息
      {
        singleQuote: true, // 使用單引號
        semi: false, // 不使用分號
        printWidth: 80, // 每行最多 80 個字符
        trailingComma: 'none', // 不在對象或數組的最後添加逗號
        endOfLine: 'auto' // 換行符號自動適應（不限制，適應不同操作系統，如 Windows 或 macOS）
      }
    ],
    'vue/multi-word-component-names': [
      'warn', // 顯示警告信息
      {
        ignores: ['index'] // Vue 組件名稱必須由多個單詞組成（忽略 index.vue）
      }
    ],
    'vue/no-setup-props-destructure': ['off'], // 關閉 props 解構的檢查
    // 💡 添加未定義變量的錯誤提示，create-vue@3.6.3 默認關閉，這裡加上是為了支持下一個章節的演示。
    'no-undef': 'error' // 未定義變量錯誤提示設為報錯
  }
}
