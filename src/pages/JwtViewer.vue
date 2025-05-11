<template>
  <div class="pt-28 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">JWT Viewer</h1>

    <div v-if="!authStore.token">
      <p class="text-red-600">Пользователь не авторизован (токен не найден).</p>
    </div>

    <div v-else>
      <p class="text-green-600 mb-2">Токен найден</p>
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto">{{ decoded }}</pre>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/store/auth'

const decoded = ref('')
const authStore = useAuthStore()

watch(
    () => authStore.token,
    (newToken) => {
      if (newToken) {
        try {
          const decodedObj = jwtDecode(newToken)
          decoded.value = JSON.stringify(decodedObj, null, 2)
        } catch (err) {
          decoded.value = 'Ошибка декодирования токена'
        }
      } else {
        decoded.value = ''
      }
    },
    { immediate: true }
)
</script>


