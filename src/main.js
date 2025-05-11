import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './index.css'
import axios from '@/api/axios'
import { useAuthStore } from '@/store/auth'

const app = createApp(App)

app.use(pinia)

const runApp = () => {
    app.use(router)
    app.mount('#app')
}

const autoLoginTried = sessionStorage.getItem('autoLoginTried')

if (!autoLoginTried) {
    // Здесь уже pinia подключён, можно вызывать useAuthStore
    const authStore = useAuthStore()

    axios.get('/auth/auto-login')
        .then(res => {
            if (res.data.token && res.data.role) {
                authStore.setAuth(res.data.token, res.data.role)
            }
        })
        .catch(() => { /* IP не найден — просто игнорируем */ })

        .finally(() => {
            sessionStorage.setItem('autoLoginTried', '1')
            runApp()
        })
} else {
    runApp()
}
