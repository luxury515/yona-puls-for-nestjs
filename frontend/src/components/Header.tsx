import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃 되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러 메시지는 api 인터셉터에서 처리되므로 여기서는 추가로 표시하지 않습니다.
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </Link>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {user ? (
                <>
                  <span className="text-gray-300 mr-4">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/signup" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
}