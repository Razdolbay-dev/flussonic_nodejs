import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,               // позволяет принимать подключения извне
    port: 5173,               // frontend порт
    strictPort: true,         // не переключаться на другой порт, если занят
    cors: true,               // разрешает кросс-доменные запросы
    allowedHosts: ['app.local'], // 👈 разрешаем доступ по этому хосту
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // проксировать API-запросы на backend
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- Вот это важно
    },
  },
})
