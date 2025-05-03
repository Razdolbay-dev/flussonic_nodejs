import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { createPinia } from 'pinia'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import Home from '@/pages/default/Home.vue'
import About from '@/pages/default/About.vue'
import Yard from '@/pages/default/Yard.vue'
import LoginView from '@/pages/Login.vue'

import Dashboard from '@/pages/admin/Dashboard.vue'
import Webcams from '@/pages/admin/Webcams.vue'
import Addresses from '@/pages/admin/Addresses.vue'
import Dvrs from '@/pages/admin/Dvrs.vue'
import TempClients from '@/pages/admin/CTmp.vue'
import Users from '@/pages/admin/Users.vue'
import Settings from '@/pages/admin/Settings.vue'
import NotFound from '@/pages/admin/NotFound.vue'
import WebcamDetail from '@/components/WebcamDetail.vue'

const pinia = createPinia() // 👈 нужно для использования store в guard

const routes = [
    { path: '/login', component: LoginView },
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', name: 'Home', component: Home },
            { path: 'about', name: 'About', component: About },
            { path: 'yard', name: 'Yard', component: Yard },
        ],
    },
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAdmin: true }, // 👈 Добавим мета-флаг
        children: [
            { path: 'dashboard', name: 'Dashboard', component: Dashboard },
            { path: 'webcams', name: 'Webcams', component: Webcams },
            { path: 'webcams/:id', name: 'WebcamDetail', component: WebcamDetail },
            { path: 'addresses', name: 'Addresses', component: Addresses },
            { path: 'dvrs', name: 'Dvrs', component: Dvrs },
            { path: 'temp-clients', name: 'TempClients', component: TempClients },
            { path: 'users', name: 'Users', component: Users },
            { path: 'settings', name: 'Settings', component: Settings },
            { path: '', redirect: '/admin/dashboard' },
            { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    const isAdminRoute = to.path.startsWith('/admin')
    const store = useAuthStore(pinia)


    // 🚫 Запрет для уже авторизованных на /login
    if (to.path === '/login' && auth.token) {
        return next('/admin')
    }

    // 🔒 Защита /admin
    if (isAdminRoute && !auth.token) {
        return next('/login')
    }

    next()
})

export default router
