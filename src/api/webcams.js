import axios from 'axios'

const API_BASE = 'http://localhost:3000/api/webcams';

export const getWebcams = (addressId = '') => axios.get(API_BASE, { params: addressId ? { address_id: addressId } : {} });
export const getWebcam = (id) => axios.get(`${API_BASE}/${id}`);
export const createWebcam = (data) => axios.post(API_BASE, data);
export const updateWebcam = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteWebcam = (id) => axios.delete(`${API_BASE}/${id}`);
