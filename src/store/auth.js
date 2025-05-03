import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
    }),
    actions: {
        setAuth(token, role) {
            this.token = token
            this.role = role
            localStorage.setItem('token', token)
            localStorage.setItem('role', role)
        },
        logout() {
            this.token = null
            this.role = null
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            if (router) {
                router.push('/')
            }
        },
    },
})
