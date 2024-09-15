import axios, { AxiosInstance } from 'axios';

const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: 'http://localhost:8080',  // 백엔드 서버 주소가 올바른지 확인
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = { ...config.headers, 'Authorization': `Bearer ${token}` };
    }
    return config;
  });

  return api;
};

export default createApiClient;