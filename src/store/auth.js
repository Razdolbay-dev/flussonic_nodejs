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
        autoLogin: async function () {
            try {
                const res = await fetch('/api/auth/auto-login');
                if (!res.ok) throw new Error('Нет авторизации');

                const data = await res.json();
                this.setAuth(data.token, data.role);

                return true;
            } catch (err) {
                console.warn('🔁 Автоавторизация не удалась:', err.message);
                return false;
            }
        }
    },

})
