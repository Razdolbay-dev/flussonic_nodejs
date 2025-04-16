<script setup>
import { useAuthStore } from '@/store/auth'
const store = useAuthStore()

function logout() {
  store.logout()
}
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-gray-800 text-white p-4">
      <h2 class="text-xl font-bold mb-4">Навигация</h2>
      <nav>
        <ul class="space-y-2">
          <li><router-link to="/admin/dashboard" class="block hover:underline">🏠 Главная</router-link></li>
          <li><router-link to="/admin/webcams" class="block hover:underline">🎥 Камеры</router-link></li>
          <li><router-link to="/admin/addresses" class="block hover:underline">📍 Адреса</router-link></li>
          <li><router-link to="/admin/dvrs" class="block hover:underline">💾 Хранилища (DVR)</router-link></li>
          <li><router-link to="/admin/temp-clients" class="block hover:underline">⏳ Временные клиенты</router-link></li>
          <li><router-link to="/admin/users" class="block hover:underline">👤 Пользователи</router-link></li>
          <li><router-link to="/admin/settings" class="block hover:underline">⚙️ Настройки</router-link></li>
        </ul>
      </nav>
    </aside>

    <main class="flex-1 p-6 bg-gray-100">
      <router-view />
    </main>

    <div class="absolute top-4 right-4">
      <button @click="logout" class="text-red-500 hover:underline">🚪 Выйти</button>
    </div>
  </div>
</template>


<style scoped>

</style>