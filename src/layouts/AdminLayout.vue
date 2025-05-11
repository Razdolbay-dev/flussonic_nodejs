<script setup>
import { useAuthStore } from '@/store/auth'
const store = useAuthStore()
import { ref } from 'vue';

function logout() {
  store.logout()
}

// Функция для закрытия меню
const closeMenu = () => {
  isOpen.value = false
}

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center pt-20">
    <nav class="fixed top-0 b-10 container mx-auto p-4 z-50">
      <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md w-full">
        <!-- Логотип -->
        <a href="/" class="flex items-center space-x-2 text-gray-800 hover:text-purple-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
               class="bi bi-camera-video text-purple-700" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                  d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>
          </svg>
          <span class="font-semibold text-lg">АДМИНКА</span>
        </a>

        <!-- Бургер-меню (мобильная версия) -->
        <button @click="toggleMenu" class="sm:hidden text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list"
               viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                  d="M2.5 4.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0 4a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11z"/>
          </svg>
        </button>

        <!-- Меню (PC: всегда видно, Mobile: скрыто) -->
        <div class="hidden sm:flex space-x-6 ">
          <router-link class="py-2 hover:text-blue-600 hover:underline" to="/admin/dashboard">Главная</router-link>
          <router-link class="py-2 hover:text-blue-500 hover:underline" to="/admin/webcams">Камеры</router-link>
          <router-link class="py-2  hover:text-blue-500 hover:underline" to="/admin/addresses">Адреса</router-link>
          <router-link class="py-2  hover:text-blue-500 hover:underline" to="/admin/dvrs">Хранилища</router-link>
          <router-link class="py-2  hover:text-blue-500 hover:underline" to="/admin/temp-clients">Временные клиенты</router-link>
          <router-link class="py-2  hover:text-blue-500 hover:underline" to="/admin/users">Пользователи</router-link>
          <router-link class="py-2  hover:text-blue-500 hover:underline" to="/admin/settings">Настройки</router-link>
          <button @click="logout" class="text-red-500 hover:bg-gray-200 rounded-md p-2">Выйти</button>

        </div>
      </div>

      <!-- Выпадающее меню на мобильной версии -->
      <div v-if="isOpen" class="sm:hidden mt-4 space-y-2 text-center bg-white rounded-md">
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="/admin/dashboard">Главная</router-link>
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="/admin/webcams">Камеры</router-link>
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="/admin/addresses">Адреса</router-link>
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="/admin/dvrs">Хранилища</router-link>
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="/admin/temp-clients">Временные клиенты</router-link>
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="/admin/users">Пользователи</router-link>
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="/admin/settings">Настройки</router-link>
        <router-link @click="closeMenu" class="block py-1 text-gray-700 hover:bg-gray-200 rounded-md" to="#">
          <button @click="logout" class="py-1 text-red-500 hover:underline">Выйти</button>
        </router-link>

      </div>
    </nav>

      <router-view />
  </div>
</template>

<style scoped>
/* Стили для закрытия кнопки */
button {
  background: none;
  border: none;
  cursor: pointer;
}

/* Убираем наложение изображений */
.z-50 {
  z-index: 9999;
}
</style>