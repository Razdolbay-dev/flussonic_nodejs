import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import Home from '@/pages/default/Home.vue'
import About from '@/pages/default/About.vue'
import Yard from '@/pages/default/Yard.vue'
import LoginView from '@/pages/Login.vue'

import Dashboard from '@/pages/admin/Dashboard.vue'
import Users from '@/pages/admin/Users.vue'

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
