<template>
  <div class="p-6 container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Временные пользователи</h1>
      <button
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Добавить пользователя
      </button>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="client in clients"
          :key="client.id"
          class="border p-4 rounded-lg shadow bg-white flex flex-col justify-between"
      >
        <div>
          <h2 class="font-bold text-lg">{{ client.fio }}</h2>
          <p class="text-sm text-gray-600">Телефон: {{ client.phone }}</p>
          <p class="text-sm text-gray-600">Пароль: {{ client.password }}</p>
          <p class="text-sm text-gray-600">Токен: <span class="break-all">{{ client.token }}</span></p>
          <p class="text-sm text-gray-600">
            Доступен до: {{ new Date(client.access_until).toLocaleString() }}
          </p>
          <div class="mt-2">
            <p class="text-xs font-semibold mb-1">Адреса доступа:</p>
            <ul class="text-sm text-gray-700 list-disc ml-5">
              <li
                  v-for="a in client.addresses"
                  :key="a.address_id"
              >
                ID: {{ a.address_id }}
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-4 flex justify-between gap-2">
          <button
              @click="openModal(client)"
              class="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Редактировать
          </button>
          <button
              @click="deleteClient(client.id)"
              class="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <transition name="fade">
      <div
          v-if="isModalOpen"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-semibold mb-4">
            {{ editingClient ? 'Редактировать' : 'Добавить' }} пользователя
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-3">
            <input v-model="form.fio" placeholder="ФИО" class="border p-2 w-full rounded" required />
            <input v-model="form.phone" placeholder="Телефон" class="border p-2 w-full rounded" />

            <!-- Выбор адресов -->
            <div class="border rounded p-3">
              <p class="font-semibold mb-2">Доступ к адресам</p>

              <div class="flex gap-2 mb-2">
                <select v-model="selectedAddressId" class="border p-2 rounded flex-1">
                  <option disabled value="">Выберите адрес</option>
                  <option
                      v-for="addr in filteredAddresses"
                      :key="addr.id"
                      :value="addr.id"
                  >
                    {{ addr.city }}, {{ addr.street }} {{ addr.house_number }}
                  </option>
                </select>
                <button
                    @click="addAddress"
                    :disabled="!selectedAddressId"
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Добавить
                </button>
              </div>

              <ul class="text-sm text-gray-700 list-disc ml-5 mt-2">
                <li v-for="id in form.address_ids" :key="id">
                  {{ getAddressLabel(id) }}
                  <button
                      @click="removeAddress(id)"
                      class="ml-2 text-red-600 hover:underline text-xs"
                  >
                    удалить
                  </button>
                </li>
              </ul>
            </div>

            <!-- Доступ до -->
            <div class="mt-4">
              <label class="text-sm font-semibold">Доступ на (дней):</label>
              <input
                  type="number"
                  v-model.number="accessDays"
                  min="1"
                  max="7"
                  class="border px-2 py-1 rounded text-sm ml-2 w-20"
                  @change="form.access_until = calculateAccessUntil()"
              />
              <p class="text-xs text-gray-500 mt-1">
                Будет доступен до: {{ new Date(form.access_until).toLocaleString() }}
              </p>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 rounded border">
                Отмена
              </button>
              <button
                  type="submit"
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {{ editingClient ? 'Сохранить' : 'Добавить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import {
  getClientsTmp,
  addClientTmp,
  updateClientTmp,
  deleteClientTmp
} from '@/api/clientsTmp.js'
import { getAddresses } from '@/api/addresses.js'
import { nanoid } from 'nanoid'

const clients = ref([])
const addresses = ref([])

const isModalOpen = ref(false)
const editingClient = ref(null)

const form = reactive({
  fio: '',
  phone: '',
  address_ids: [],
  access_until: ''
})

const selectedAddressId = ref('')
const accessDays = ref(1)

const loadClients = async () => {
  const { data } = await getClientsTmp()
  clients.value = data
}

const loadAddresses = async () => {
  const { data } = await getAddresses()
  addresses.value = data
}

const openModal = (client = null) => {
  isModalOpen.value = true
  editingClient.value = client

  form.fio = client?.fio || ''
  form.phone = client?.phone || ''
  form.address_ids = client?.addresses?.map(a => a.address_id) || []
  form.access_until = client?.access_until || calculateAccessUntil()

  selectedAddressId.value = ''
  accessDays.value = 1
}

const generatePassword = () => {
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += Math.floor(Math.random() * 10)
  }
  return password
}

const handleSubmit = async () => {
  const payload = {
    ...form,
    addresses: form.address_ids.map(id => ({ address_id: id }))
  }

  if (editingClient.value) {
    await updateClientTmp(editingClient.value.id, payload)
  } else {
    await addClientTmp({
      ...payload,
      password: generatePassword(),
      token: nanoid(20)
    })
  }

  isModalOpen.value = false
  editingClient.value = null
  await loadClients()
}

const deleteClient = async (id) => {
  if (confirm('Удалить пользователя?')) {
    await deleteClientTmp(id)
    await loadClients()
  }
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

onMounted(async () => {
  await Promise.all([loadClients(), loadAddresses()])
})

</script>
