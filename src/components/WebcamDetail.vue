<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Камера: {{ webcam.name }}</h1>

    <div v-if="webcam.uid" class="relative w-full" style="padding-top: 56.25%;">
      <iframe
          :src="`http://192.168.1.76:8888/${webcam.uid}/embed.html?autoplay=false&dvr=true`"
          allowfullscreen
          class="absolute top-0 left-0 w-full h-full border-0"
      ></iframe>
    </div>


    <p class="text-gray-600 pt-5">
      Адрес:
      {{ webcam.city }}, {{ webcam.street }} {{ webcam.house_number }}
    </p>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getWebcamById } from '@/api/webcams.js'

const route = useRoute()
const webcam = ref({})

onMounted(async () => {
  const { data } = await getWebcamById(route.params.id)
  webcam.value = data
})
</script>
