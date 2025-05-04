<script setup>
import { ref, onMounted } from 'vue'
import { getPrivateWebcams } from '@/api/webcams.js' // Импорт нового метода

const webcams = ref([])
const activeStreams = ref({})
const error = ref(null)

const loadPrivateWebcams = async () => {
  try {
    const { data } = await getPrivateWebcams()
    webcams.value = data.items || []

    if (webcams.value.length === 0) {
      error.value = 'Нет доступных камер.'
    }

    webcams.value.forEach((cam) => {
      if (!(cam.uid in activeStreams.value)) {
        activeStreams.value[cam.uid] = false
      }
    })
  } catch (err) {
    console.error(err)
    error.value = 'Ошибка доступа. Возможно, вы не авторизованы.'
  }
}

const toggleStream = (uid) => {
  activeStreams.value[uid] = true
}

onMounted(loadPrivateWebcams)
</script>

<template>
  <div class="mt-28 container mx-auto p-4">
    <div v-if="error" class="text-red-600 text-center text-lg font-semibold mb-4">
      {{ error }}
    </div>

    <div v-else class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
      <div class="relative pl-2" v-for="cam in webcams" :key="cam.uid">
        <h2 class="font-bold text-lg mb-1">
          <router-link :to="`/webcams/${cam.id}`" class="text-blue-600 hover:underline">
            {{ cam.name }}
          </router-link>
        </h2>

        <div class="relative w-[320px] h-[240px] cursor-pointer" @click="toggleStream(cam.uid)">
          <div v-if="!activeStreams[cam.uid]" class="relative">
            <img
                class="rounded-md w-full h-full object-cover"
                :src="`http://192.168.1.76:8888/${cam.uid}/preview.jpg`"
                alt="Stream Preview"
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
              :src="`http://192.168.1.76:8888/${cam.uid}/embed.html?autoplay=true`"
              allowfullscreen
          ></iframe>
        </div>

        <p class="text-sm text-gray-600 mt-1">
          Адрес: {{ cam.city }}, {{ cam.street }} {{ cam.house_number }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
img, iframe {
  width: 320px;
  height: 240px;
}
</style>
