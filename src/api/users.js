import axios from '@/api/axios.js' // заменяем дефолтный axios

const API_BASE = '/users';

export const getUsers = () => axios.get(API_BASE);
export const addUser = (data) => axios.post(API_BASE, data);
export const updateUser = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_BASE}/${id}`);
