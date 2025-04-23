import axios from 'axios'

const API_BASE = 'http://localhost:3000/api/clients_tmp';

export const getClientsTmp = () => axios.get(API_BASE)
export const addClientTmp = (data) => axios.post(API_BASE, data)
export const updateClientTmp = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteClientTmp = (id) => axios.delete(`${API_BASE}/${id}`);
