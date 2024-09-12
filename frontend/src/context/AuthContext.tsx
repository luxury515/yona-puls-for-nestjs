import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../utils/api';
import axios from 'axios'; // Assuming axios is used for HTTP requests

interface User {
  id: number;
  loginId: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        token = await refreshToken();
      }
      await axios.post('http://localhost:8080/users/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // 로그아웃 성공 처리
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('http://localhost:8080/users/refresh', { refresh_token: refreshToken });
      localStorage.setItem('accessToken', response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      // 로그인 페이지로 리다이렉트
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};