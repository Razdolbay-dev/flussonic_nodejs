<script setup>
import { useAuthStore } from '@/store/auth'
const store = useAuthStore()

function logout() {
  store.logout()
}
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-gray-800 text-white p-4">Admin Sidebar</aside>
    <main class="flex-1 p-6">
      <slot />
    </main>
    <button @click="logout" class="text-red-500">Выйти</button>
  </div>
</template>


<style scoped>

</style>