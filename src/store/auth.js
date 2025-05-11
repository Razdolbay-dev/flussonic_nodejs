import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
    }),
    actions: {
        setAuth(token, role) {
            if (token) {
                this.token = token
                localStorage.setItem('token', token)
            }
            if (role) {
                this.role = role
                localStorage.setItem('role', role)
            }
        },
        logout() {
            this.token = null
            this.role = null
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            if (router) {
                router.push('/')
            }
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
    }
})
