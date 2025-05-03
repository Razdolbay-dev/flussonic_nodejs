// src/api/webcams.js
import axios from '@/api/axios.js' // заменяем дефолтный axios

const API_BASE = '/webcams'

export const getWebcams = (params) => axios.get(API_BASE, { params })
export const createWebcam = (data) => axios.post(API_BASE, data)
export const updateWebcam = (id, data) => axios.put(`${API_BASE}/${id}`, data)
export const deleteWebcam = (id) => axios.delete(`${API_BASE}/${id}`)
export const getWebcamById = (id) => axios.get(`${API_BASE}/${id}`) // ✅ добавлено
