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

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // 공통 에러 처리
      if (error.response) {
        console.error('API 응답 에러:', error.response.data);
        console.error('API 응답 상태:', error.response.status);
      } else if (error.request) {
        console.error('API 요청 에러:', error.request);
      } else {
        console.error('API 설정 에러:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default createApiClient;