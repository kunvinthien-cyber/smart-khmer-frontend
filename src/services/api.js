// import axios from 'axios'
// import { finishRequest, startRequest } from './loading'

// const api = axios.create({
//   baseURL: 'https://dummyjson.com',
//   // Fall back to the bundled catalog quickly when the external API is offline.
//   timeout: 3000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// api.interceptors.request.use((config) => {
//   startRequest()
//   return config
// })

// api.interceptors.response.use(
//   (response) => {
//     finishRequest()
//     return response
//   },
//   (error) => {
//     finishRequest()
//     return Promise.reject(error)
//   }
// )

// export default api

// backend
// src/services/api.js
// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     }
// });

// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;
import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/+$/, '').replace(/\/api$/, '')}/api`
  : null;

if (!API_BASE_URL && import.meta.env.PROD) {
  throw new Error('VITE_API_URL is not configured for production.');
}

const api = axios.create({
  baseURL: API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auto attach Sanctum Bearer Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
