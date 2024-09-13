import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaCog, FaChevronLeft, FaChevronRight, FaUsers, FaProjectDiagram } from 'react-icons/fa';

const MenuItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isCollapsed: boolean; isActive: boolean }> = React.memo(
  ({ to, icon, label, isCollapsed, isActive }) => (
    <li>
      <Link
        to={to}
        className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200
          ${isActive
            ? 'bg-blue-500 text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
      >
        <div className="text-xl">{icon}</div>
        <span className={`ml-4 transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden whitespace-nowrap`}>
          {label}
        </span>
      </Link>
    </li>
  )
);

const SideMenu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const menuItems = [
    { to: "/", icon: <FaHome />, label: "홈" },
    { to: "/projects", icon: <FaProjectDiagram />, label: "프로젝트" },
    { to: "/profile", icon: <FaUser />, label: "프로필" },
    { to: "/settings", icon: <FaCog />, label: "설정" },
    { to: "/users/user-list", icon: <FaUsers />, label: "사용자 관리" },
  ];

  return (
    <div 
      className={`bg-white dark:bg-gray-800 h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } relative shadow-lg`}
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.to}
            />
          ))}
        </ul>
      </nav>
      <button
        onClick={toggleMenu}
        className="absolute -right-3 top-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 shadow-md"
      >
        {isCollapsed ? <FaChevronRight className="w-3 h-3" /> : <FaChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  );
};

export default React.memo(SideMenu);