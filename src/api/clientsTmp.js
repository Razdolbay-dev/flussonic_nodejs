import axios from '@/api/axios.js' // заменяем дефолтный axios

const API_BASE = '/clients_tmp';

export const getClientsTmp = () => axios.get(API_BASE)
export const addClientTmp = (data) => axios.post(API_BASE, data)
export const updateClientTmp = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteClientTmp = (id) => axios.delete(`${API_BASE}/${id}`);
