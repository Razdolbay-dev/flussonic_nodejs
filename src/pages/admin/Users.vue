<template>
  <div class="p-6 container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Пользователи</h1>
      <button
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Добавить пользователя
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="user in users"
          :key="user.id"
          class="border p-4 rounded shadow bg-white flex flex-col justify-between"
      >
        <div>
          <p class="text-xs text-gray-400">ID: {{ user.id }}</p>

          <h2 class="font-bold text-lg">{{ user.name }}</h2>
          <p class="text-sm text-gray-600">Роль: {{ user.role }}</p>

          <p class="text-sm text-gray-600">IP: {{ user.ip }}</p>
          <p class="text-sm text-gray-600">Адрес: {{ user.address_name || '—' }}</p>
        </div>

        <div class="flex justify-end mt-4 gap-2">
          <button
              @click="openModal(user)"
              class="text-blue-600 hover:underline text-sm"
          >
            Изменить
          </button>
          <button
              @click="removeUser(user.id)"
              class="text-red-600 hover:underline text-sm"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <transition name="fade">
      <div
          v-if="isModalOpen"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-xl w-full max-w-md animate-fade-in">
          <h2 class="text-xl font-semibold mb-4">
            {{ form.id ? 'Редактировать' : 'Добавить' }} пользователя
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-3">
            <input v-model="form.name" placeholder="Имя" class="border p-2 w-full rounded" required />
            <input v-model="form.password" placeholder="Пароль" type="password" class="border p-2 w-full rounded" required />
            <input v-model="form.ip" placeholder="IP" class="border p-2 w-full rounded" required />

            <select v-model="form.role" class="border p-2 w-full rounded" required>
              <option disabled value="">Выберите роль</option>
              <option value="user">Обычный пользователь</option>
              <option value="customUser">Особенный пользователь</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Администратор</option>

            </select>

            <select v-model="form.address_id" class="border p-2 w-full rounded" required>
              <option disabled value="">Выберите адрес</option>
              <option v-for="addr in addresses" :key="addr.id" :value="addr.id">
                {{ addr.city }}, {{ addr.street }} {{ addr.house_number }}
              </option>
            </select>
            <div class="flex items-center gap-2">
              <input
                  v-model="form.token"
                  placeholder="Token"
                  class="border p-2 w-full rounded"
                  readonly
              />
              <button type="button" @click="generateToken" class="text-sm text-blue-600 underline">
                Сгенерировать
              </button>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="closeModal" class="px-4 py-2 rounded border">Отмена</button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                {{ form.id ? 'Обновить' : 'Добавить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="slide-fade">
      <div
          v-if="toast"
          class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        {{ toast }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, addUser, updateUser, deleteUser } from '@/api/users'
import { getAddresses } from '@/api/addresses'

const users = ref([])
const addresses = ref([])
const isModalOpen = ref(false)
const toast = ref(null)

const form = ref({
  id: null,
  name: '',
  password: '',
  ip: '',
  address_id: '',
  token: '',
  role: '', // добавлено
})

const loadUsers = async () => {
  const { data } = await getUsers()
  users.value = data
}

const generateToken = () => {
  form.value.token = Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const loadAddresses = async () => {
  const { data } = await getAddresses()
  addresses.value = data
}

const openModal = (user = null) => {
  isModalOpen.value = true
  if (user) {
    form.value = { ...user }
  } else {
    form.value = {
      id: null,
      name: '',
      password: '',
      ip: '',
      address_id: '',
      token: '',
      role: 'user', // добавлено
    }
  }
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = {
    id: null,
    name: '',
    password: '',
    ip: '',
    address_id: '',
    token: '',
  }
}

const handleSubmit = async () => {
  try {
    if (form.value.id) {
      await updateUser(form.value.id, form.value)
    } else {
      await addUser(form.value)
    }
    await loadUsers()
    closeModal()
  } catch (err) {
    if (err.response && err.response.status === 409) {
      alert('Пользователь с таким именем или токеном уже существует!')
    } else {
      alert('Ошибка при сохранении пользователя')
    }
  }

}

const removeUser = async (id) => {
  if (confirm('Удалить пользователя?')) {
    await deleteUser(id)
    await loadUsers()
    showToast('Пользователь удалён')
  }
}

const showToast = (msg) => {
  toast.value = msg
  setTimeout(() => (toast.value = null), 3000)
}

onMounted(() => {
  loadUsers()
  loadAddresses()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
