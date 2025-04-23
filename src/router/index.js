import { createRouter, createWebHistory } from 'vue-router'

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
            { path: 'dashboard', name: 'Dashboard', component: Dashboard },
            { path: 'webcams', name: 'Webcams', component: Webcams },
            { path: 'addresses', name: 'Addresses', component: Addresses },
            { path: 'dvrs', name: 'Dvrs', component: Dvrs },
            { path: 'temp-clients', name: 'TempClients', component: TempClients },
            { path: 'users', name: 'Users', component: Users },
            { path: 'settings', name: 'Settings', component: Settings },
            { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
