import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const getProducts = async (params = {}) => {
  const response = await axios.get(`${API_URL}products/`, { params });
  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}categories/`);
  return response.data;
};

export const register = async (username, password, email) => {
  const response = await axios.post(`${API_URL}register/`, { username, password, email });
  return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}token/`, { username, password });
  return response.data;
};

export const createOrder = async (items, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}orders/`, { items }, config);
  return response.data;
};

export const getOrders = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}orders/`, config);
  return response.data;
};

export const createProduct = async (product, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.post(`${API_URL}products/`, product, config);
  return response.data;
};

export const updateProduct = async (id, product, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.patch(`${API_URL}products/${id}/`, product, config);
  return response.data;
};

export const deleteProduct = async (id, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.delete(`${API_URL}products/${id}/`, config);
  return response.data;
};

export const updateOrder = async (id, data, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.patch(`${API_URL}orders/${id}/`, data, config);
  return response.data;
};