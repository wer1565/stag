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

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}register/`, { username, password });
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