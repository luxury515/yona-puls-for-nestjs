import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCog, FaChevronLeft, FaChevronRight, FaUsers } from 'react-icons/fa';

const MenuItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isCollapsed: boolean }> = React.memo(
  ({ to, icon, label, isCollapsed }) => (
    <li className="mb-2">
      <Link to={to} className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2">
        <div className="w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
        <span className={`ml-2 transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden whitespace-nowrap`}>
          {label}
        </span>
      </Link>
    </li>
  )
);

const SideMenu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return (
    <div 
      className={`bg-gray-100 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-48'
      } relative`}
    >
      <nav className="p-2">
        <ul className="space-y-1">
          <MenuItem to="/" icon={<FaHome className="w-6 h-6" />} label="홈" isCollapsed={isCollapsed} />
          <MenuItem to="/profile" icon={<FaUser className="w-6 h-6" />} label="프로필" isCollapsed={isCollapsed} />
          <MenuItem to="/settings" icon={<FaCog className="w-6 h-6" />} label="설정" isCollapsed={isCollapsed} />
          <MenuItem to="/users/user-list" icon={<FaUsers className="w-6 h-6" />} label="사용자 관리" isCollapsed={isCollapsed} />
        </ul>
      </nav>
      <button
        onClick={toggleMenu}
        className="absolute right-0 top-5 transform translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200 shadow-md z-10"
      >
        {isCollapsed ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default React.memo(SideMenu);