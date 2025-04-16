<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">DVR</h1>
      <button
          @click="isModalOpen = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Добавить DVR
      </button>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="dvr in dvrList"
          :key="dvr.id"
          class="border p-4 rounded-lg shadow bg-white flex flex-col justify-between"
      >
        <div>
          <h2 class="font-bold text-lg">{{ dvr.name }}</h2>
          <p class="text-sm text-gray-600 break-all">{{ dvr.path }}</p>
        </div>

        <div v-if="dvr.stats" class="mt-4">
          <div class="h-3 bg-gray-200 rounded">
            <div
                class="h-full bg-green-500 rounded"
                :style="{ width: dvr.stats.usagePercent + '%' }"
            ></div>
          </div>
          <p class="text-xs mt-1 text-gray-500">
            Использовано: {{ formatSize(dvr.stats.used) }} из {{ formatSize(dvr.stats.total) }}
            ({{ dvr.stats.usagePercent }}%)
          </p>
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
          <h2 class="text-xl font-semibold mb-4">Добавить DVR</h2>
          <form @submit.prevent="handleAdd" class="space-y-3">
            <input
                v-model="form.name"
                placeholder="Имя"
                class="border p-2 w-full rounded"
                required
            />
            <input
                v-model="form.path"
                placeholder="Путь"
                class="border p-2 w-full rounded"
                required
            />
            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 rounded border">
                Отмена
              </button>
              <button
                  type="submit"
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Popup -->
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
import axios from 'axios'
import { getDvrs, addDvr, getDvrStats } from '@/api/dvr.js'

const dvrList = ref([])
const isModalOpen = ref(false)
const toast = ref(null)

const form = ref({
  name: '',
  path: '',
})

const loadDvr = async () => {
  try {
    const { data } = await getDvrs()
    dvrList.value = data

    for (const dvr of dvrList.value) {
      try {
        const res = await getDvrStats(dvr.path)
        dvr.stats = res.data
      } catch (e) {
        dvr.stats = null
      }
    }
  } catch (e) {
    showToast('Ошибка загрузки DVR')
  }
}

const handleAdd = async () => {
  try {
    const { data } = await addDvr(form.value)
    dvrList.value.unshift({ ...data, stats: null })
    isModalOpen.value = false
    showToast('DVR успешно добавлен')
    form.value = { name: '', path: '' }
    await loadDvr()
  } catch (e) {
    showToast('Ошибка при добавлении DVR')
  }
}


const showToast = (msg) => {
  toast.value = msg
  setTimeout(() => (toast.value = null), 3000)
}

const formatSize = (bytes) => {
  const gb = bytes / (1024 ** 3)
  return gb.toFixed(2) + ' GB'
}

onMounted(loadDvr)
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
