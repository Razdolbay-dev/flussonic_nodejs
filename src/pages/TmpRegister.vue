<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="grid md:grid-cols-2 gap-6 items-start">
      <!-- Инструкция слева -->
      <div class="text-gray-800 space-y-4 text-sm leading-relaxed">
        <h2 class="text-xl font-semibold text-black">Следуйте простой инструкции, чтобы зарегистрироваться:</h2>
        <ol class="list-decimal list-inside space-y-2">
          <li>Заполните все поля:
            <ul class="list-disc list-inside ml-4">
              <li>ФИО</li>
              <li>номер телефона</li>
              <li>адреса (до 3-х)</li>
              <li>дни доступа</li>
            </ul>
          </li>
          <li>Нажмите "Получить код".</li>
          <li>Ожидайте SMS с кодом доступа.</li>
        </ol>
        <p class="font-semibold mt-4">Важно!</p>
        <ul class="list-disc list-inside ml-4 text-xs text-gray-600">
          <li>Код действителен в течении выбранного количества дней.</li>
          <li>Доступ к архиву камеры только по выбранным адресам.</li>
          <li>Не более 3 адресов в сутки.</li>
        </ul>
      </div>

      <!-- Форма справа -->
      <form @submit.prevent="handleSubmit" class="space-y-4 border p-4 rounded-xl shadow bg-white">
        <input v-model="form.fio" placeholder="ФИО" class="border p-2 w-full rounded" required />
        <input v-model="form.phone" placeholder="Телефон" class="border p-2 w-full rounded" required />

        <div class="border rounded p-3">
          <p class="font-semibold mb-2">Доступ к адресам</p>

          <div class="flex gap-2 mb-2">
            <select v-model="selectedAddressId" class="border p-2 rounded flex-1">
              <option disabled value="">Выберите адрес</option>
              <option v-for="addr in filteredAddresses" :key="addr.id" :value="addr.id">
                {{ addr.city }}, {{ addr.street }} {{ addr.house_number }}
              </option>
            </select>
            <button
                type="button"
                @click="addAddress"
                :disabled="!selectedAddressId"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Добавить
            </button>
          </div>

          <div class="mb-2">
            <label class="text-sm font-semibold">Доступ на (дней):</label>
            <input
                type="number"
                v-model.number="accessDays"
                min="1"
                max="7"
                class="border px-2 py-1 rounded text-sm ml-2 w-20"
            />
          </div>

          <ul class="text-sm text-gray-700 list-disc ml-5 mt-2">
            <li v-for="id in form.address_ids" :key="id">
              {{ getAddressLabel(id) }} — до {{ new Date(calculateAccessUntil()).toLocaleString() }}
              <button
                  type="button"
                  @click="removeAddress(id)"
                  class="ml-2 text-red-600 hover:underline text-xs"
              >
                удалить
              </button>
            </li>
          </ul>
        </div>

        <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Получить код
        </button>
      </form>
    </div>
    <transition name="fade">
      <div
          v-if="successModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-lg">
          <h2 class="text-xl font-bold mb-4">Регистрация успешна</h2>
          <p class="text-lg mb-2">Ваш код доступа:</p>
          <div class="text-2xl font-mono bg-gray-100 p-3 rounded mb-4 select-all">
            {{ generatedPassword }}
          </div>

          <div class="flex justify-center gap-4 mt-4">
            <button
                @click="copyToClipboard"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
              </svg>
              Скопировать
            </button>

            <button
                @click="router.push('/login')"
                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
              </svg>
              Закрыть
            </button>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getAddresses } from '@/api/addresses.js'
import axios from '@/api/axios.js'
import { useRouter } from 'vue-router'

const router = useRouter()


const form = reactive({
  fio: '',
  phone: '',
  address_ids: []
})

const selectedAddressId = ref('')
const accessDays = ref(1)
const addresses = ref([])
const successModal = ref(false)
const generatedPassword = ref('')

const loadAddresses = async () => {
  const { data } = await getAddresses()
  addresses.value = data
}

const addAddress = () => {
  if (selectedAddressId.value && !form.address_ids.includes(selectedAddressId.value)) {
    form.address_ids.push(selectedAddressId.value)
  }
  selectedAddressId.value = ''
}

const removeAddress = (id) => {
  form.address_ids = form.address_ids.filter(addrId => addrId !== id)
}

const getAddressLabel = (id) => {
  const found = addresses.value.find(a => a.id === id)
  return found ? `${found.city}, ${found.street} ${found.house_number}` : `ID: ${id}`
}

const filteredAddresses = computed(() => {
  return addresses.value.filter(a => !form.address_ids.includes(a.id))
})

const calculateAccessUntil = () => {
  const msInDay = 86400000
  const days = Math.min(accessDays.value || 1, 7)
  return new Date(Date.now() + (days * msInDay)).toISOString()
}

const handleSubmit = async () => {
  try {
    const res = await axios.post('/auth/tmp-register', {
      fio: form.fio,
      phone: form.phone,
      address_ids: form.address_ids,
      access_days: accessDays.value
    })

    generatedPassword.value = res.data.password
    successModal.value = true

    // Очистить форму (опционально)
    form.fio = ''
    form.phone = ''
    form.address_ids = []
    accessDays.value = 1

  } catch (err) {
    console.error(err)
    alert('Ошибка при регистрации')
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(generatedPassword.value)
}

onMounted(loadAddresses)
</script>
