import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    // 성공 메시지는 여기서 처리하지 않고, 필요한 경우 각 컴포넌트에서 처리
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`${error.response.data.error || '오류 발생'}. 다시 시도해주세요.`);
      }
    } else {
      toast.error('예상치 못한 오류가 발생했습니다. 다시 시도해주세요.');
    }
    return Promise.reject(error);
  }
);

export default api;