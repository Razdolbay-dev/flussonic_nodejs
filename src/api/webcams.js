// src/api/webcams.js
import axios from '@/api/axios.js' // заменяем дефолтный axios

const API_BASE = '/webcams'

export const getWebcams = (params) => axios.get(API_BASE, { params })
export const createWebcam = (data) => axios.post(API_BASE, data)
export const updateWebcam = (id, data) => axios.put(`${API_BASE}/${id}`, data)
export const deleteWebcam = (id) => axios.delete(`${API_BASE}/${id}`)
export const getWebcam = (id) => axios.get(`${API_BASE}/cam/${id}`) // ✅ добавлено
export const getPrivateWebcams = (token) => {
    return axios.get('/webcams/private', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const getPrivateAll = (token) => {
    return axios.get(`${API_BASE}/all`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const getPublicWebcams = (params) => {
    return axios.get(`${API_BASE}/public`, { params })
}
