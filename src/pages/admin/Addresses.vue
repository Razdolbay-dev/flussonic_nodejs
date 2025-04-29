<template>
  <div class="container mx-auto text-center p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Адреса</h1>
      <!-- Кнопка для открытия модального окна -->
      <button @click="openModal" class="flex left-0 bg-blue-600 text-white px-4 py-2 rounded-xl mb-4">
        Добавить адрес
      </button>
    </div>

    <!-- Модальное окно с transition -->
    <transition name="modal-fade">
      <div
          v-if="isModalOpen"
          class="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
      >
        <div class="bg-white p-6 rounded-xl w-96">
          <h2 class="text-xl font-semibold mb-4">Добавить адрес</h2>
          <form @submit.prevent="handleAdd" class="mb-6 space-y-2">
            <input v-model="form.city" placeholder="Город" class="border p-2 w-full rounded-xl" />
            <input v-model="form.street" placeholder="Улица" class="border p-2 w-full rounded-xl" />
            <input v-model="form.house_number" placeholder="Дом" class="border p-2 w-full rounded-xl" />
          </form>
          <div class="flex justify-end gap-2">
            <button @click="handleAdd" class="bg-blue-600 text-white px-4 py-2 rounded-xl">Добавить</button>
            <button @click="closeModal" class="bg-gray-400 text-white px-4 py-2 rounded-xl">Отмена</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Поиск и сортировка -->
    <div class="flex gap-4 mb-6 items-center ">
      <input
          v-model="search"
          placeholder="🔍 Поиск по городу или улице"
          class="border p-2 flex-1 rounded-2xl"
      />
      <select v-model="sortBy" class="border p-2 rounded-2xl">
        <option value="" >Сортировка</option>
        <option value="city">По городу</option>
        <option value="street">По улице</option>
      </select>
    </div>

    <!-- Пагинация -->
    <div class="flex justify-between items-center mb-4 ">
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <div class="space-x-2">
        <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded-2xl"
        >
          ← Назад
        </button>
        <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded-2xl"
        >
          Вперёд →
        </button>
      </div>
    </div>

    <!-- Список -->
    <ul class="space-y-4">
      <li
          v-for="address in paginatedAddresses"
          :key="address.id"
          class="bg-white p-4 shadow rounded"
      >
        <template v-if="editingId === address.id">
          <!-- Форма редактирования -->
          <div class="space-y-2">
            <input v-model="editForm.city" class="border p-1 w-full rounded"/>
            <input v-model="editForm.street" class="border p-1 w-full rounded"/>
            <input v-model="editForm.house_number" class="border p-1 w-full rounded"/>
            <div class="flex gap-2">
              <button @click="handleUpdate(address.id)" class="bg-green-600 text-white px-3 py-1 rounded">
                Сохранить
              </button>
              <button @click="cancelEdit" class=" bg-red-600 text-white px-3 py-1 rounded hover:underline">Отмена</button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex justify-between items-center">
            <span>{{ address.city }}, {{ address.street }}, {{ address.house_number }}</span>
            <div class="flex gap-2">
              <button @click="startEdit(address)" class="text-blue-600 hover:underline">✏️</button>
              <button @click="handleDelete(address.id)" class="text-red-500 hover:underline">🗑️</button>
            </div>
          </div>
        </template>
      </li>
    </ul>

    <!-- Всплывающее уведомление -->
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
import {ref, computed, onMounted, watchEffect} from 'vue'
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress
} from '@/api/addresses'

const addresses = ref([])
const form = ref({city: '', street: '', house_number: ''})
const editForm = ref({city: '', street: '', house_number: ''})
const editingId = ref(null)
const search = ref('')
const sortBy = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isModalOpen = ref(false) // Состояние модального окна
const toast = ref({ visible: false, message: '', type: '' }) // type = 'success' | 'error'

// Показать уведомление
const setToast = (message, type = 'success') => {
  toast.value = { visible: true, message, type }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

// Открыть модальное окно
const openModal = () => {
  isModalOpen.value = true
}

// Закрыть модальное окно
const closeModal = () => {
  isModalOpen.value = false
  form.value = { city: '', street: '', house_number: '' }
}

onMounted(() => {
  loadAddresses()
})

const loadAddresses = async () => {
  try {
    const res = await getAddresses()
    addresses.value = res.data
  } catch (e) {
    console.error('Ошибка при загрузке адресов', e)
  }
}

const handleAdd = async () => {
  try {
    await addAddress(form.value)
    form.value = { city: '', street: '', house_number: '' }
    closeModal()
    await loadAddresses()
    setToast('🏠 Адрес успешно добавлен!', 'success')
  } catch (e) {
    console.error('Ошибка при добавлении адреса', e)
    setToast('⚠️ Ошибка при добавлении адреса', 'error')
  }
}


const handleDelete = async (id) => {
  if (!confirm('Удалить адрес?')) return
  try {
    await deleteAddress(id)
    await loadAddresses()
  } catch (e) {
    console.error('Ошибка при удалении адреса', e)
  }
}

const startEdit = (address) => {
  editingId.value = address.id
  editForm.value = {...address}
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {city: '', street: '', house_number: ''}
}

const handleUpdate = async (id) => {
  try {
    await updateAddress(id, editForm.value)
    editingId.value = null
    await loadAddresses()
  } catch (e) {
    console.error('Ошибка при обновлении адреса', e)
  }
}

// Фильтрация, сортировка и пагинация
const filteredAddresses = computed(() => {
  let result = addresses.value

  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(
        (a) =>
            a.city.toLowerCase().includes(s) ||
            a.street.toLowerCase().includes(s)
    )
  }

  if (sortBy.value) {
    result = [...result].sort((a, b) =>
        a[sortBy.value].localeCompare(b[sortBy.value])
    )
  }

  return result
})

const totalPages = computed(() =>
    Math.ceil(filteredAddresses.value.length / itemsPerPage)
)

const paginatedAddresses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredAddresses.value.slice(start, start + itemsPerPage)
})

// Следим за изменением страниц — чтобы не выходить за границы
watchEffect(() => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value || 1
})
</script>

<style scoped>
/* Добавим стили для модального окна */
.fixed {
  position: fixed;
}
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

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