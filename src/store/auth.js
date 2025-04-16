// src/store/auth.js
import { defineStore } from 'pinia'
import api from '@/api/axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || '',
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
    },
    actions: {
        async login(credentials) {
            const { data } = await api.post('/login', credentials)
            this.token = data.token
            localStorage.setItem('token', data.token)

            await this.fetchUser()
        },
        async fetchUser() {
            const { data } = await api.get('/')
            this.user = data
        },
        logout() {
            this.user = null
            this.token = ''
            localStorage.removeItem('token')
            const router = useRouter()
            router.push('/')
        },
    },
})
