<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold text-center mb-4">Вход в админ-панель</h2>
      <form @submit.prevent="handleLogin">
        <input
            v-model="username"
            type="text"
            placeholder="Логин"
            class="w-full p-2 border rounded mb-2"
        />
        <input
            v-model="password"
            type="password"
            placeholder="Пароль"
            class="w-full p-2 border rounded mb-2"
        />
        <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Войти
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>

</script>
