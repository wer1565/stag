import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Получить список товаров с возможностью передачи параметров (фильтрация, пагинация и т.д.)
export const getProducts = async (params = {}) => {
  const response = await axios.get(`${API_URL}products/`, { params });
  return response.data;
};

// Получить список всех категорий товаров
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}categories/`);
  return response.data;
};

// Зарегистрировать нового пользователя
// username - логин, password - пароль, email - почта, recaptcha - токен Google reCAPTCHA
export const register = async (username, password, email, recaptcha) => {
  const response = await axios.post(`${API_URL}register/`, { username, password, email, recaptcha });
  return response.data;
};

// Войти в систему (получить JWT-токен)
export const login = async (username, password, recaptcha) => {
  const response = await axios.post(`${API_URL}token/`, { username, password, recaptcha });
  return response.data;
};

// Создать новый заказ (требуется JWT-токен)
// items - список товаров, token - JWT пользователя
export const createOrder = async (items, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}orders/`, { items }, config);
  return response.data;
};

// Получить список заказов текущего пользователя (требуется JWT-токен)
export const getOrders = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}orders/`, config);
  return response.data;
};

// Создать новый товар (только для администратора)
// product - объект с данными товара, token - JWT администратора
export const createProduct = async (product, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.post(`${API_URL}products/`, product, config);
  return response.data;
};

// Обновить товар по ID (только для администратора)
export const updateProduct = async (id, product, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.patch(`${API_URL}products/${id}/`, product, config);
  return response.data;
};

// Удалить товар по ID (только для администратора)
export const deleteProduct = async (id, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.delete(`${API_URL}products/${id}/`, config);
  return response.data;
};

// Обновить заказ по ID (например, изменить статус, только для администратора)
export const updateOrder = async (id, data, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.patch(`${API_URL}orders/${id}/`, data, config);
  return response.data;
};

// Получить список всех пользователей (только для администратора)
export const getUsers = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.get(`${API_URL}users/`, config);
  return response.data;
};

// Удалить пользователя по ID (только для администратора)
export const deleteUser = async (id, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.delete(`${API_URL}users/${id}/`, config);
  return response.data;
};

// Обновить пользователя по ID (только для администратора)
export const updateUser = async (id, data, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.patch(`${API_URL}users/${id}/`, data, config);
  return response.data;
};

// Получить профиль текущего пользователя (требуется JWT-токен)
export const getProfile = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.get(`${API_URL}profile/`, config);
  return response.data;
};