// api/settings.js
import axios from '@/api/axios.js'

const API_BASE = '/settings'

// Получить текущие настройки
export const getSettings = () => axios.get(API_BASE)
// Обновить настройки (единственная строка)
export const updateSettings = (data) => axios.put(API_BASE, data)
