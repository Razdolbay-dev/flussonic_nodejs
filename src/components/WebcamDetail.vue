<template>
  <div class="container mx-auto text-center py-28">
    <div class="flex flex-wrap">

      <h1 class="text-2xl font-semibold mb-4">Камера: {{ webcam.name }}</h1>

      <div v-if="webcam.uid" class="relative w-full pt-[100%] sm:pt-[60%]">
        <iframe
            :src="`${cdnUrl}/${webcam.uid}/embed.html?autoplay=true&dvr=true`"            allowfullscreen
            class="absolute top-0 left-0 w-full h-full border-0"
        ></iframe>
      </div>


      <p class="text-gray-600 pt-5">
        Адрес:
        {{ webcam.city }}, {{ webcam.street }} {{ webcam.house_number }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getWebcamById } from '@/api/webcams.js'
import { getCdnUrl } from '@/api/settings.js'

const route = useRoute()
const webcam = ref({})
const cdnUrl = ref('')

onMounted(async () => {
  const [{ data: webcamData }, { data: cdnData }] = await Promise.all([
    getWebcamById(route.params.id),
    getCdnUrl()
  ])

  webcam.value = webcamData
  cdnUrl.value = cdnData.cdnUrl
})
</script>
