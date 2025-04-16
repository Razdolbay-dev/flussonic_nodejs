// src/api/axios.js
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const api = axios.create({
    baseURL: 'https://localhost:5000/api', // Замените на ваш backend
})

api.interceptors.request.use((config) => {
    // Передача токена в конфигурацию из store
    const store = useAuthStore()
    const token = store.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            const store = useAuthStore()
            store.logout() // Выход при 401
        }
        return Promise.reject(err)
    }
)

export default api
