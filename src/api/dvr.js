// api/dvr.js
import axios from '@/api/axios.js' // заменяем дефолтный axios

const API_BASE = '/dvr'

export const getDvrs = () => axios.get(API_BASE)
export const addDvr = (data) => axios.post(API_BASE, data)
export const getDvrStats = (path) => axios.get(`${API_BASE}/stats`, { params: { path } })
export const updateDvr = (id, data) => axios.put(`${API_BASE}/${id}`, data)
export const deleteDvr = (id) => axios.delete(`${API_BASE}/${id}`)
