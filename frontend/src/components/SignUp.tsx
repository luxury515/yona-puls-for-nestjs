import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import createApiClient from '../utils/api';
const api = createApiClient();

interface SignUpFormData {
  name: string;
  loginId: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    loginId: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/users/signup', formData);
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="이름"
        className="w-full px-3 py-2 mb-3 border rounded"
        required
      />
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
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="이메일"
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
      <button type="submit" className="w-full px-3 py-2 text-white bg-green-500 rounded hover:bg-green-600">
        회원가입
      </button>
    </form>
  );
};

export default SignUp;