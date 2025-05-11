<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div v-if="!loading">
      <div class="bg-white p-6 rounded-lg shadow-md w-96">
        <div class="flex mb-4 border-b">
          <button
              @click="activeTab = 'login'"
              :class="[
            'flex-1 text-center py-2',
            activeTab === 'login' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'
          ]"
          >
            По логину
          </button>
          <button
              @click="activeTab = 'temp'"
              :class="[
            'flex-1 text-center py-2',
            activeTab === 'temp' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'
          ]"
          >
            Временный доступ
          </button>

        </div>

        <h2 class="text-xl font-bold text-center mb-4">
          {{ activeTab === 'login' ? 'Вход' : 'Вход' }}
        </h2>


        <form @submit.prevent="activeTab === 'login' ? loginByName() : loginByPhone()">
          <input
              v-if="activeTab === 'login'"
              v-model="name"
              type="text"
              placeholder="Логин"
              class="w-full p-2 border rounded mb-2"
          />
          <input
              v-if="activeTab === 'temp'"
              v-model="phone"
              type="text"
              placeholder="Телефон"
              class="w-full p-2 border rounded mb-2"
          />
          <input
              v-model="password"
              type="password"
              placeholder="Пароль"
              class="w-full p-2 border rounded mb-2"
          />
          <button
              type="submit"
              class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Войти
          </button>
        </form>

        <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>

        <a
            v-if="activeTab === 'temp'"
            class="block text-center pt-5 text-blue-500 hover:text-blue-800 transition"
            href="/register"
        >
          Как получить временный доступ?
        </a>
      </div>
    </div>
    <div v-else class="text-center text-gray-600 py-10">
      🔐 Проверка авторизации...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import axios from '@/api/axios.js'

const store = useAuthStore()
const router = useRouter()
const loading = ref(true)

const activeTab = ref('login') // 'login' или 'temp'

const name = ref('')
const phone = ref('')
const password = ref('')
const error = ref('')

onMounted(async () => {
  const success = await store.autoLogin()
  loading.value = false

  if (success) {
    router.push(store.role !== 'user' ? '/admin' : '/')
  }
})

const loginByName = async () => {
  try {
    const res = await axios.post('/auth/login', {
      name: name.value,
      password: password.value
    })

    store.setAuth(res.data.token, res.data.role)

    if (res.data.role !== 'user') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка авторизации'
  }
}

const loginByPhone = async () => {
  try {
    const res = await axios.post('/auth/tmp-login', {
      phone: phone.value,
      password: password.value
    })

    store.setAuth(res.data.token, 'user')
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка временного входа'
  }
}
</script>
