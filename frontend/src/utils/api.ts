import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',  // 백엔드 서버 주소
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = { ...config.headers, 'Authorization': `Bearer ${token}` };
  }
  return config;
});

export default api;