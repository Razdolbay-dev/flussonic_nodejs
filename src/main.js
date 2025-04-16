import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia' // Добавь это
import router from './router'
import './index.css' // TailwindCSS


const app = createApp(App)

app.use(createPinia())  // Инициализация Pinia
app.use(router)

app.mount('#app')
