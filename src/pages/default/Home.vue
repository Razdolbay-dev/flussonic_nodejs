<script setup>
import { ref, onMounted } from 'vue'

const webcams = ref([])
const activeStreams = ref({}) // Состояние показа iframe для каждого потока
const currentPage = ref(1)
const pageSize = ref(12)
const totalItems = ref(0)
const selectedAddressId = ref('')
const cdnUrl = ref('') // Для хранения cdn_url

import { getPublicWebcams } from '@/api/webcams.js'
import { getCdnUrl } from '@/api/settings.js'

// Загрузка cdn_url
const loadCdnUrl = async () => {
  try {
    const { data } = await getCdnUrl()
    cdnUrl.value = data.cdnUrl // Сохраняем cdn_url
  } catch (err) {
    console.error('Ошибка при получении cdn_url:', err)
  }
}

const loadWebcams = async () => {
  const params = {
    page: currentPage.value,
    limit: pageSize.value,
  }
  if (selectedAddressId.value) {
    params.address_id = selectedAddressId.value
  }

  const { data } = await getPublicWebcams(params)
  webcams.value = data.items
  totalItems.value = data.total

  // Инициализация состояний отображения потоков
  webcams.value.forEach((cam) => {
    if (!(cam.uid in activeStreams.value)) {
      activeStreams.value[cam.uid] = false
    }
  })
}

// Переключение на iframe при клике
const toggleStream = (uid) => {
  activeStreams.value[uid] = true
}

// Методы переключения страниц
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadWebcams()
  }
}

const nextPage = () => {
  if (currentPage.value * pageSize.value < totalItems.value) {
    currentPage.value++
    loadWebcams()
  }
}

onMounted(() => {
  loadWebcams()
  loadCdnUrl() // Загружаем cdn_url
})
</script>

<template>
  <div class="mt-28 container mx-auto p-4">
    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
      <div class="relative pl-2" v-for="cam in webcams" :key="cam.uid">
        <h2 class="font-bold text-lg mb-1">
          <router-link :to="`/webcams/${cam.id}`" class="text-blue-600 hover:underline">
            {{ cam.name }}
          </router-link>
        </h2>

        <div class="relative w-[25%-320px] h-[240px] cursor-pointer" @click="toggleStream(cam.uid)">
          <!-- Превью с кнопкой Play -->
          <div v-if="!activeStreams[cam.uid]" class="relative">
            <img
                class="rounded-md w-full h-full object-cover"
                :src="`${cdnUrl}/${cam.uid}/preview.jpg`"
                alt="Stream Preview"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
              <svg class="w-16 h-16 text-white opacity-90 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          <!-- Встраиваемый iframe -->
          <iframe
              v-else
              class="rounded-md w-full h-full"
              :src="`${cdnUrl}/${cam.uid}/embed.html?autoplay=true`"
              allowfullscreen
          ></iframe>
        </div>

        <p class="text-sm text-gray-600 mt-1">
          Адрес: {{ cam.city }}, {{ cam.street }} {{ cam.house_number }}
        </p>
      </div>
    </div>

    <!-- Пагинация -->
    <div class="flex justify-center mt-6 space-x-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
        Назад
      </button>
      <span class="self-center">Страница {{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage * pageSize >= totalItems" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
        Далее
      </button>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 320px;
  height: 240px;
}
iframe {
  width: 320px;
  height: 240px;
}
</style>
