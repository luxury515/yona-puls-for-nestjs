import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showFlyout, setShowFlyout] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃 되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const toggleFlyout = () => {
    setShowFlyout(!showFlyout);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        setShowFlyout(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Your Logo</Link>
        <nav className="flex items-center">
          {user && (
            <div className="relative mr-4" ref={flyoutRef}>
              <button
                onClick={toggleFlyout}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded flex items-center"
              >
                <FaPlus className="mr-2" />
                생성
              </button>
              {showFlyout && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/projectform"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowFlyout(false)}
                  >
                    프로젝트 생성
                  </Link>
                  <Link
                    to="/issueform"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowFlyout(false)}
                  >
                    이슈 생성
                  </Link>
                </div>
              )}
            </div>
          )}
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}