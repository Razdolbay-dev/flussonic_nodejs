<template>
  <div class="container w-[75%] min-h-screen bg-gray-100 flex items-center justify-center my-28 sm:my-0 my-0">
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
          <li>Ожидайте телефонного звонка от номера +79210144652.</li>
          <li>Вам будет озвучен код для подтверждения вашего номера телефона.</li>
          <li>В всплывающем окне введите озвученный код.</li>
          <li>После удачного подтверждения номера телефона <br> Вам будет предоставлен пароль для доступа к камерам по выбранным адресам.</li>
        </ol>
        <p class="font-semibold mt-4">Важно!</p>
        <ul class="list-disc list-inside ml-4 text-xs text-gray-600">
          <li>Пароль действителен в течении выбранного количества дней.</li>
          <li>Доступ к архиву камеры только по выбранным адресам.</li>
          <li>Не более 3 адресов в выбранный период времени.</li>
        </ul>

      </div>

      <!-- Форма справа -->
      <form @submit.prevent="handleSubmit" class="space-y-4 border p-4 rounded-xl shadow bg-white">
        <input v-model="form.fio" placeholder="ФИО" class="border p-2 w-full rounded" required/>
        <input v-model="form.phone" placeholder="Телефон" class="border p-2 w-full rounded" required/>
        <input
            v-model="form.password"
            type="password"
            placeholder="Пароль"
            class="border p-2 w-full rounded"
            required
        />

        <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Подтвердите пароль"
            class="border p-2 w-full rounded"
            required
        />
        <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="text-red-600 text-sm">
          Пароли не совпадают
        </p>

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
                :disabled="!selectedAddressId || form.address_ids.length >= 3"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
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
            :disabled="isSubmitting"
            class="w-full px-4 py-2 rounded transition text-white
         disabled:opacity-50 disabled:cursor-not-allowed
         bg-blue-600 hover:bg-blue-700"
        >
          {{ isSubmitting ? 'Отправка...' : 'Получить код' }}
        </button>
      </form>
    </div>
    <transition name="fade">
      <div v-if="verificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-lg">
          <h2 class="text-xl font-bold mb-2">Подтвердите код</h2>
          <p class="text-sm text-gray-600 mb-4">Введите 6-значный код, который вы получили по звонку</p>

          <input
              v-model="verificationCode"
              maxlength="6"
              class="border p-2 rounded w-full text-center text-lg mb-2"
              placeholder="######"
          />
          <p v-if="verificationError" class="text-red-600 text-sm mb-2">{{ verificationError }}</p>

          <button
              @click="verifyCode"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
          v-if="successModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-lg">
          <h2 class="text-xl font-bold mb-2">Регистрация завершена</h2>
          <p class="text-gray-700 mb-4">
            Ваш временный пароль для входа:
          </p>

          <div class="bg-gray-100 p-3 rounded text-lg font-mono tracking-wider select-all mb-4">
            {{ generatedPassword }}
          </div>

          <p class="text-sm text-gray-500 mb-4">
            Обязательно сохраните пароль — восстановить его будет невозможно.
          </p>

          <button
              @click="successModal = false"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Закрыть
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, computed} from 'vue'
import {getAddresses} from '@/api/addresses.js'
import axios from '@/api/axios.js'
import {useRouter} from 'vue-router'

const isSubmitting = ref(false)
const router = useRouter()
const verificationModal = ref(false)
const verificationCode = ref('')
const clientId = ref(null)
const verificationError = ref('')
const clientPhone = ref('') // ← сохраняем номер телефона

const form = reactive({
  fio: '',
  phone: '',
  address_ids: [],
  password: '',
  confirmPassword: ''
})


const selectedAddressId = ref('')
const accessDays = ref(1)
const addresses = ref([])
const successModal = ref(false)
const generatedPassword = ref('')

const loadAddresses = async () => {
  const {data} = await getAddresses()
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
  isSubmitting.value = true

  try {
    if (form.password !== form.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    const res = await axios.post('/auth/tmp-register', {
      fio: form.fio,
      phone: form.phone,
      address_ids: form.address_ids,
      access_days: accessDays.value,
      password: form.password
    });


    clientId.value = res.data.client_id
    clientPhone.value = form.phone
    verificationModal.value = true
  } catch (err) {
    console.error(err)
    alert('Ошибка при регистрации')
  } finally {
    isSubmitting.value = false
  }
}

const verifyCode = async () => {
  try {
    const res = await axios.post('/auth/tmp-verify', {
      phone: clientPhone.value,              // ← передаём phone
      code: verificationCode.value           // ← передаём code
    })

    generatedPassword.value = form.password
    verificationModal.value = false
    successModal.value = true
    verificationError.value = ''

    // Очистка формы
    form.fio = ''
    form.phone = ''
    form.address_ids = []
    accessDays.value = 1
  } catch (err) {
    console.error(err)
    verificationError.value = 'Код введён неверно. Попробуйте ещё раз.'
  }
}

onMounted(loadAddresses)
</script>
