import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/users';

export const getUsers = () => axios.get(API_BASE);
export const addUser = (data) => axios.post(API_BASE, data);
export const updateUser = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_BASE}/${id}`);
