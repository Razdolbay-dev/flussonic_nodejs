<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="flex bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-hidden">
      <!-- Инструкция -->
      <div class="w-1/2 p-6 bg-gray-50">
        <h2 class="text-xl font-bold mb-4">Следуйте простой инструкции, чтобы посмотреть записи с дворовых камер</h2>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>
            Заполните пустые поля:
            <ul class="ml-4 list-disc text-sm">
              <li>адрес (укажите до 3-х интересующих вас домов);</li>
              <li>номер телефона;</li>
              <li>комментарий.</li>
            </ul>
          </li>
          <li>Нажмите «Получить код». Код придет по SMS.</li>
          <li>Введите код и нажмите «Готово».</li>
        </ol>
        <div class="mt-6 text-sm text-gray-800">
          <p class="font-bold mb-1">Важно!</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Код действителен 3 дня с момента запроса.</li>
            <li>Архив с камерами по коду доступен на 3 дня.</li>
            <li>За сутки можно получить записи с камер по 3-м адресам.</li>
          </ul>
        </div>
      </div>

      <!-- Форма -->
      <div class="w-1/2 p-6">
        <h2 class="text-2xl font-bold text-center mb-4">Получить временный доступ</h2>
        <form @submit.prevent="register">
          <div class="grid grid-cols-3 gap-2 mb-2">
            <select class="col-span-1 border rounded p-2" v-model="city">
              <option disabled value="">Город</option>
              <option>Петрозаводск</option>
            </select>
            <select class="col-span-1 border rounded p-2" v-model="street">
              <option disabled value="">Улица</option>
              <option>Ленина</option>
              <option>Гоголя</option>
            </select>
            <select class="col-span-1 border rounded p-2" v-model="house">
              <option disabled value="">Дом</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>

          <button type="button" class="text-blue-600 text-sm mb-4">Добавить адрес</button>

          <input
              v-model="phone"
              type="text"
              placeholder="Номер телефона"
              class="w-full p-2 border rounded mb-2"
              :class="{ 'border-red-500': error && !phone }"
          />
          <input
              v-model="comment"
              type="text"
              placeholder="Комментарий (причина запроса)"
              class="w-full p-2 border rounded mb-2"
              :class="{ 'border-red-500': error && !comment }"
          />

          <button
              type="submit"
              class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Получить код
          </button>

          <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const city = ref('')
const street = ref('')
const house = ref('')
const phone = ref('+7')
const comment = ref('')
const error = ref('')

const register = async () => {
  if (!phone.value || !comment.value) {
    error.value = 'Пожалуйста, заполните все обязательные поля.'
    return
  }

  try {
    const res = await axios.post('http://localhost:3000/api/auth/tmp-register', {
      phone: phone.value,
      comment: comment.value,
      address: `${city.value}, ${street.value}, ${house.value}`
    })

    alert('Код отправлен!')
    error.value = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка при получении кода'
  }
}
</script>
