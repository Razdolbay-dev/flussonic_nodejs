// src/api/flussonic.js
import axios from '@/api/axios.js' // ваш кастомный инстанс axios

const API_BASE = '/flussonic'

/**
 * Проверка авторизации клиента для Flussonic (GET-запрос).
 * @param {Object} params - Объект с token и path
 * @returns {Promise}
 */
export const authorizeFlussonicClient = (params) => {
    return axios.get(`${API_BASE}/auth`, { params })
}
