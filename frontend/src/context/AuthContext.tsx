import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import createApiClient from '../utils/api';
const api = createApiClient();
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
      let token = sessionStorage.getItem('accessToken');
      console.log("token1", token);
      const user = localStorage.getItem('user');
      if (!token) {
        token = await refreshToken();
        console.log("token2", token);
      }
      console.log("user", user);
      if (user) {
        await api.post('/users/logout', { user: JSON.parse(user) }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      // 로그아웃 성공 처리
      setUser(null); // 상태 초기화
      setTimeout(() => {
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        console.log("accessToken after remove:", sessionStorage.getItem('accessToken'));
        console.log("refreshToken after remove:", localStorage.getItem('refreshToken'));
        console.log("user after remove:", localStorage.getItem('user'));
        window.location.href = '/login'; // 로그인 화면으로 이동
      }, 100); // 100ms 지연
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await api.post('/users/refresh', { refresh_token: refreshToken });
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