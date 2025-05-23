import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './index.css'

// ✅ Очистка временного токена, если он устарел
function clearExpiredTempToken() {
    const savedAt = localStorage.getItem('temp_token_timestamp')
    const oneHour = 60 * 60 * 1000

    if (savedAt && Date.now() - parseInt(savedAt, 10) > oneHour) {
        localStorage.removeItem('temp_token')
        localStorage.removeItem('temp_token_timestamp')
        localStorage.removeItem('auth')
        console.log('⏳ Временный токен очищен из localStorage (по истечению срока)')
    }
}

// Выполнить до запуска приложения
clearExpiredTempToken()

const app = createApp(App)

app.use(pinia)

const runApp = () => {
    app.use(router)
    app.mount('#app')
}

runApp()

