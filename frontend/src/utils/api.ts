import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',  // 백엔드 서버 주소
  withCredentials: true,
});

export default api;