<template>
  <div class="p-6 container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Камеры</h1>
      <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
        Добавить камеру
      </button>
    </div>

    <!-- В Webcams.vue -->
    <select v-model="selectedAddressId" @change="loadWebcams" class="border p-2 rounded mb-4">
      <option value="">Все адреса</option>
      <option v-for="address in addresses" :key="address.id" :value="address.id">
        {{ address.city }}, {{ address.street }} {{ address.house_number }}
      </option>
    </select>


    <!-- Сетка камер -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
          v-for="cam in webcams"
          :key="cam.id"
          class="border p-4 rounded-lg shadow bg-white flex flex-col justify-between"
      >
        <div>
          <h2 class="font-bold text-lg mb-1">
            <router-link :to="`/webcams/${cam.id}`" class="text-blue-600 hover:underline">
              {{ cam.name }}
            </router-link>
          </h2>
          <p class="text-sm text-gray-600">Статус: {{ cam.role }}</p>
          <p class="text-sm text-gray-600">Хранение: {{ formatDayCount(cam.day_count) }}</p>
          <p class="text-sm text-gray-600">
            Адрес:
            {{ cam.city }}, {{ cam.street }} {{ cam.house_number }}
          </p>

        </div>
        <div class="mt-4 flex justify-between gap-2">
          <button @click="openModal(cam)"
                  class="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
            Редактировать
          </button>
          <button @click="deleteCam(cam.id)" class="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Удалить
          </button>
        </div>


      </div>
    </div>
    <!-- Пагинация -->
    <div class="flex justify-center items-center mt-8 gap-4">
      <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Назад
      </button>

      <span class="text-gray-700">
    Страница {{ currentPage }} из {{ totalPages }}
  </span>

      <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Вперёд
      </button>
    </div>
    <!-- Модальное окно -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-semibold mb-4">
            {{ editingCam ? 'Редактировать' : 'Добавить' }} камеру
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-3">
            <input
                v-model="form.uid"
                placeholder="UID"
                class="border p-2 w-full rounded bg-gray-100"
                disabled
                hidden
            />


            <input v-model="form.name" placeholder="Название" class="border p-2 w-full rounded" required/>
            <input v-model="form.url" placeholder="Ссылка на камеру" class="border p-2 w-full rounded" required/>


            <select v-model="form.address_id" class="border p-2 w-full rounded" required>
              <option disabled value="">Выберите адрес</option>
              <option v-for="address in addresses" :value="address.id" :key="address.id">
                {{ address.city }}, {{ address.street }} {{ address.house_number }}
              </option>
            </select>

            <select v-model="form.role" class="border p-2 w-full rounded" required>
              <option value="private">Приватная</option>
              <option value="public">Публичная</option>
            </select>

            <select v-model="form.dvr_id" class="border p-2 w-full rounded">
              <option disabled value="">Выберите DVR</option>
              <option v-for="dvr in dvrs" :value="dvr.id" :key="dvr.id">
                {{ dvr.name }}
              </option>
            </select>

            <select v-model="form.day_count" class="border p-2 w-full rounded">
              <option v-for="option in dayOptions" :value="option.value" :key="option.value">
                {{ option.label }}
              </option>
            </select>

            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 rounded border">
                Отмена
              </button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                {{ editingCam ? 'Сохранить' : 'Добавить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import {
  getWebcams,
  createWebcam,
  updateWebcam,
  deleteWebcam
} from '@/api/webcams.js'
import {getAddresses} from '@/api/addresses.js'
import {getDvrs} from '@/api/dvr.js'

const webcams = ref([])
const addresses = ref([])
const dvrs = ref([])

const isModalOpen = ref(false)
const editingCam = ref(null)

const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const selectedAddressId = ref('');

const form = reactive({
  uid: '',
  name: '',
  url: '',
  dvr_id: '',
  address_id: '',
  role: 'public',
  day_count: 0
})

const dayOptions = [
  {label: '1 день', value: 86400},
  {label: '2 дня', value: 86400 * 2},
  {label: '3 дня', value: 86400 * 3},
  {label: '5 дней', value: 86400 * 5},
  {label: '1 неделя', value: 86400 * 7},
  {label: '2 недели', value: 86400 * 14},
  {label: '3 недели', value: 86400 * 21},
  {label: '1 месяц', value: 86400 * 30}
]

const formatDayCount = (seconds) => {
  const match = dayOptions.find(opt => opt.value === seconds)
  return match ? match.label : `${seconds} сек`
}

const loadWebcams = async () => {
  if (currentPage.value < 1) currentPage.value = 1

  const params = {
    page: currentPage.value,
    limit: pageSize.value,
  };
  if (selectedAddressId.value) {
    params.address_id = selectedAddressId.value;
  }

  const { data } = await getWebcams(params);
  webcams.value = data.items;
  totalItems.value = data.total;
};

watch(selectedAddressId, () => {
  currentPage.value = 1;
  loadWebcams();
});


const generateUid = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const openModal = (cam = null) => {
  isModalOpen.value = true
  editingCam.value = cam

  // Генерация UID для новых камер, и использование старого UID для редактирования
  form.uid = cam?.uid || generateUid()
  form.name = cam?.name || ''
  form.url = cam?.url || ''
  form.dvr_id = cam?.dvr_id || ''
  form.address_id = cam?.address_id || ''
  form.role = cam?.role || 'public'
  form.day_count = cam?.day_count || 0
}

const handleSubmit = async () => {
  if (editingCam.value) {
    await updateWebcam(editingCam.value.id, {...form})
  } else {
    await createWebcam({...form})
  }
  await loadWebcams()
  isModalOpen.value = false
}

const deleteCam = async (id) => {
  if (confirm('Удалить камеру?')) {
    await deleteWebcam(id)
    await loadWebcams()
  }
}

// методы для переключения страниц

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadWebcams();
  }
};

const nextPage = () => {
  if (currentPage.value * pageSize.value < totalItems.value) {
    currentPage.value++;
    loadWebcams();
  }
};


onMounted(async () => {
  await Promise.all([
    loadWebcams(),
    getAddresses().then(res => addresses.value = res.data),
    getDvrs().then(res => dvrs.value = res.data)
  ])
})
</script>

<style scoped>
/* можно добавить анимации или стили по вкусу */
</style>
