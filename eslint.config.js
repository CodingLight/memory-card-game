import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// ESLint 配置：为项目中的 JS 与 JSX 文件启用基础规则、React Hook 规则和 Vite 场景下的热更新规则。
export default defineConfig([
  // dist 为构建产物目录，不参与源码质量检查。
  globalIgnores(['dist']),
  {
    // 将规则应用到所有 JS/JSX 源文件。
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // 声明浏览器全局变量，并开启 JSX 语法解析支持。
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
