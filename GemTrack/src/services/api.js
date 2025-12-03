import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from './config';

const api = axios.create({baseURL: API_URL, timeout: 10000});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) AsyncStorage.removeItem('token');
    return Promise.reject(err);
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', {email, password}),
  register: (email, password, name) => api.post('/auth/register', {email, password, name}),
};

export const items = {
  getAll: (page = 1, search = '', filters = {}) => {
    const params = {page, limit: 50, search, ...filters};
    return api.get('/items', {params});
  },
  getBySku: sku => api.get(`/items/scan/${sku}`),
  getUnprinted: () => api.get('/items/unprinted'),
  markAsPrinted: itemIds => api.post('/items/mark-printed', {itemIds}),
  create: data => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: id => api.delete(`/items/${id}`),
};

export const sales = {
  getAll: (page = 1) => api.get('/sales', {params: {page, limit: 50}}),
  getById: id => api.get(`/sales/${id}`),
  checkout: data => api.post('/sales/checkout', data),
};

export const customers = {
  getAll: (page = 1, search = '') => api.get('/customers', {params: {page, limit: 50, search}}),
  create: data => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
};

export const dashboard = {
  getStats: () => api.get('/dashboard/stats'),
  getSalesOverTime: () => api.get('/dashboard/sales-over-time'),
  getTotalSalesStats: () => api.get('/dashboard/total-sales-stats'),
};

export const market = {
  getRates: async () => {
    try {
      const res = await api.get('/market/rates');
      return res;
    } catch (error) {
      const {fetchGoldRates} = require('./goldapi');
      const data = await fetchGoldRates();
      return {data};
    }
  },
};
