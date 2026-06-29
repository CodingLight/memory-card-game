import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 构建配置：当前项目只启用 React 官方插件，用于支持 JSX 转换与开发体验增强。
export default defineConfig({
  // 注册 React 插件，让 Vite 在开发和构建阶段正确处理 React 项目。
  plugins: [react()],
})
