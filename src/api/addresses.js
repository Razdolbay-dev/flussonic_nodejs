import axios from '@/api/axios.js' // заменяем дефолтный axios

const API_BASE = '/addresses'

export const getAddresses = () => axios.get(API_BASE)
export const addAddress = (data) => axios.post(API_BASE, data)
export const deleteAddress = (id) => axios.delete(`${API_BASE}/${id}`)
export const updateAddress = (id, data) => axios.put(`${API_BASE}/${id}`, data)
