import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import pinia from '@/store' // импорт pinia

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
        meta: { requiresAdmin: true },
        children: [
            { path: '', redirect: '/admin/dashboard' },
            { path: 'dashboard', name: 'Dashboard', component: Dashboard },
            { path: 'webcams', name: 'Webcams', component: Webcams },
            { path: 'webcams/:id', name: 'WebcamDetail', component: WebcamDetail },
            { path: 'addresses', name: 'Addresses', component: Addresses },
            { path: 'dvrs', name: 'Dvrs', component: Dvrs },
            { path: 'temp-clients', name: 'TempClients', component: TempClients },
            { path: 'users', name: 'Users', component: Users },
            { path: 'settings', name: 'Settings', component: Settings },
            { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// ✅ Navigation Guard
router.beforeEach((to, from, next) => {
    const store = useAuthStore(pinia)
    const role = store.role
    const token = store.token

    // Защищённые админ-маршруты
    if (to.meta.requiresAdmin) {
        if (!token || role === 'user') {
            return next('/')
        }
    }

    // Не пускаем на /login авторизованных
    if (to.path === '/login' && token) {
        return next('/')
    }

    next()
})

export default router
