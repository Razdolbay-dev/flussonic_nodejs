<template>
  <div class="container mx-auto text-center py-28">
    <div class="flex flex-wrap">
      <h1 class="text-2xl font-semibold mb-4">Камера: {{ webcam.name }}</h1>

      <div v-if="iframeSrc" class="relative w-full pt-[100%] sm:pt-[60%]">
        <iframe
            :src="iframeSrc"
            allowfullscreen
            class="absolute top-0 left-0 w-full h-full border-0"
        ></iframe>
      </div>

      <p class="text-gray-600 pt-5">
        Адрес: {{ webcam.city }}, {{ webcam.street }} {{ webcam.house_number }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getWebcam } from '@/api/webcams.js'
import { getCdnUrl } from '@/api/settings.js'
import { useAuthStore } from '@/store/auth.js'

const route = useRoute()
const webcam = ref({})
const iframeSrc = ref('')
const authStore = useAuthStore()

onMounted(async () => {
  const [{ data: webcamData }, { data: cdnData }] = await Promise.all([
    getWebcam(route.params.id),
    getCdnUrl()
  ])

  webcam.value = webcamData

// ✅ Используем приоритет: авторизованный токен -> временный токен -> null
  const token = authStore.token || localStorage.getItem('temp_token')
  const baseEmbedUrl = `${cdnData.cdnUrl}/${webcamData.uid}/embed.html`

  iframeSrc.value = token
      ? `${baseEmbedUrl}?autoplay=false&dvr=true&token=${token}`
      : `${baseEmbedUrl}?autoplay=false`
})
</script>
