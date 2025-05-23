<template>
  <div class="mt-28 container mx-auto p-4">

    <!-- Карточка при ошибке -->
    <div v-if="message" class="pt-0 sm:pt-28 flex items-center justify-center">
      <div class="bg-white border container border-gray-200 rounded-lg shadow text-center">
        <div class="bg-gray-100 px-6 py-4 border-b border-gray-200 text-lg font-semibold">
          Информация
        </div>
        <div class="p-6">
          <h5 class="text-xl font-bold mb-2">Камеры недоступны</h5>
          <p class="text-gray-700 mb-4">{{ message }}</p>
          <router-link to="/" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            На главную
          </router-link>
        </div>
        <div class="bg-gray-100 px-6 py-3 text-sm text-gray-500 border-t border-gray-200">
          Попробуйте позже
        </div>
      </div>
    </div>

    <!-- Сетка камер -->
    <div v-else class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
      <div class="relative pl-2 py-5" v-for="cam in webcams" :key="cam.uid">
        <h2 class="font-bold text-lg mb-1">
          <router-link :to="`/webcams/${cam.id}`" class="text-blue-600 hover:underline">
            {{ cam.name }}
          </router-link>
        </h2>
        <div class="relative w-[320px] h-[240px] cursor-pointer" @click="toggleStream(cam.uid)">
          <div v-if="!activeStreams[cam.uid]" class="relative">
            <img
                class="rounded-md w-full h-full object-cover"
                :src="getPreviewUrl(cam.uid)"
                alt="Preview"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
              <svg class="w-16 h-16 text-white opacity-90 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <iframe
              v-else
              class="rounded-md w-full h-full"
              :src="getStreamUrl(cam.uid)"
              allowfullscreen
          ></iframe>

          <p class="text-sm text-gray-600 mt-1">
            Адрес: {{ cam.city }}, {{ cam.street }} {{ cam.house_number }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getCdnUrl } from '@/api/settings.js'

const webcams = ref([])
const activeStreams = ref({})
const message = ref('')
const token = ref('')
const cdnUrl = ref('') // можно вынести в API

// Загрузка cdn_url
const loadCdnUrl = async () => {
  try {
    const { data } = await getCdnUrl()
    cdnUrl.value = data.cdnUrl // Сохраняем cdn_url
  } catch (err) {
    console.error('Ошибка при получении cdn_url:', err)
  }
}

const getPreviewUrl = (uid) => {
  const base = `${cdnUrl.value}/${uid}/preview.jpg`
  return token.value ? `${base}?token=${token.value}` : base
}

const getStreamUrl = (uid) => {
  const base = `${cdnUrl.value}/${uid}/embed.html?autoplay=true`
  return token.value ? `${base}&token=${token.value}` : base
}

const toggleStream = (uid) => {
  activeStreams.value[uid] = true
}

const loadWebcams = async () => {
  try {
    // ✅ Сначала проверим, есть ли валидный токен в localStorage
    const savedToken = localStorage.getItem('temp_token')
    const savedAt = localStorage.getItem('temp_token_timestamp')
    const oneHour = 60 * 60 * 1000

    if (savedToken && savedAt && (Date.now() - parseInt(savedAt, 10)) < oneHour) {
      token.value = savedToken
    } else {
      // Если токен отсутствует или просрочен — запрашиваем новый
      const { data: auth } = await axios.get('/api/auth/ipverify')
      token.value = auth.token
      localStorage.setItem('temp_token', auth.token)
      localStorage.setItem('temp_token_timestamp', Date.now().toString())
    }

    // Загружаем список камер
    const { data } = await axios.get('/api/webcams/available', {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    webcams.value = data.cameras
    webcams.value.forEach((cam) => {
      activeStreams.value[cam.uid] = false
    })

  } catch (err) {
    if (err.response?.status === 404) {
      message.value = 'Извините, на вашем доме нет камер'
    } else {
      message.value = 'Ошибка при загрузке камер'
    }
  }
}


onMounted(() => {
  loadWebcams()
  loadCdnUrl()
})
</script>

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
