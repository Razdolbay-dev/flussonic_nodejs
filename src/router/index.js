import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'

import Dashboard from '@/pages/admin/Dashboard.vue'
import Users from '@/pages/admin/Users.vue'

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', name: 'Home', component: Home },
            { path: 'about', name: 'About', component: About },
        ],
    },
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            { path: '', name: 'Dashboard', component: Dashboard },
            { path: 'users', name: 'Users', component: Users },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
