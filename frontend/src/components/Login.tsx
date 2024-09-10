import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

interface LoginFormData {
  loginId: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    loginId: '',
    password: '',
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', formData);
      console.log('Login response:', response.data);
      if (response.data && response.data.user) {
        login(response.data.user);
        toast.success('로그인에 성공했습니다!');
        navigate('/');
      } else {
        console.error('로그인 응답에 사용자 정보가 없습니다.');
        toast.error('로그인 응답에 사용자 정보가 없습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <input
        type="text"
        name="loginId"
        value={formData.loginId}
        onChange={handleChange}
        placeholder="로그인 ID"
        className="w-full px-3 py-2 mb-3 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="비밀번호"
        className="w-full px-3 py-2 mb-3 border rounded"
        required
      />
      <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        로그인
      </button>
    </form>
  );
};

export default Login;