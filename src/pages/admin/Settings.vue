<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Настройки системы</h1>

    <form @submit.prevent="handleSave" class="space-y-4 bg-white p-6 shadow-md rounded-xl">
      <label>
        Логин:
        <input v-model="form.username" placeholder="Имя пользователя" class="border p-2 w-full rounded-xl" />
      </label>
      <label>
        Пароль:
        <input v-model="form.password" type="password" placeholder="Пароль" class="border p-2 w-full rounded-xl" />
      </label>
      <label>
        Flussonic API URL:
        <input v-model="form.cdn_url" placeholder="CDN URL" class="border p-2 w-full rounded-xl" />
      </label>
      <label>
        Шаблон для публичных камер:
        <input v-model="form.pubt" placeholder="Публичный ключ" class="border p-2 w-full rounded-xl" />
      </label>
      <label>
        Шаблон для приватных камер:
        <input v-model="form.privt" placeholder="Приватный ключ" class="border p-2 w-full rounded-xl" />
      </label>

      <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full mt-4"
          :disabled="loading"
      >
        {{ loading ? 'Сохраняем...' : '💾 Сохранить настройки' }}
      </button>
    </form>

    <!-- Toast -->
    <transition name="toast-fade">
      <div
          v-if="toast.visible"
          :class="[
          'fixed bottom-4 right-4 px-4 py-2 rounded-xl shadow-lg text-white z-50',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getSettings,
  updateSettings
} from '@/api/settings' // 👈 создадим этот файл

const form = ref({
  username: '',
  password: '',
  cdn_url: '',
  pubt: '',
  privt: ''
})
const loading = ref(false)

const toast = ref({ visible: false, message: '', type: '' })

const showToast = (message, type = 'success') => {
  toast.value = { visible: true, message, type }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

const handleSave = async () => {
  loading.value = true
  try {
    await updateSettings(form.value)
    showToast('✅ Настройки сохранены', 'success')
  } catch (e) {
    console.error(e)
    showToast('❌ Ошибка при сохранении', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await getSettings()
    form.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки настроек', e)
  }
})
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
