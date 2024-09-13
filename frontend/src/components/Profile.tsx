import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaEdit, FaKey } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // 사용자 객체에 profileImage 속성을 추가합니다.
  interface User {
    profileImage?: string;
    name?: string;
    email?: string;
    status?: 'active' | 'inactive'; // 상태 속성의 타입을 명시적으로 지정
  }

  const userWithProfileImage: User = user || {};

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">프로필</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isEditing ? '저장' : '편집'}
              </button>
            </div>
            <div className="mb-6 relative">
              <img
                src={userWithProfileImage.profileImage ?? 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-1/2 transform translate-x-16 translate-y-3 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md">
                  <FaEdit className="text-blue-600 dark:text-blue-400" />
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-gray-500 dark:text-gray-400 mr-3" />
                <input
                  type="text"
                  value={user?.name ?? ''}
                  readOnly={!isEditing}
                  className={`flex-1 ${
                    isEditing
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-transparent'
                  } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1`}
                />
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 dark:text-gray-400 mr-3" />
                <input
                  type="email"
                  value={userWithProfileImage.email || ''}
                  readOnly={!isEditing}
                  className={`flex-1 ${
                    isEditing
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-transparent'
                  } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1`}
                />
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 mr-3">상태:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userWithProfileImage.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {userWithProfileImage.status === 'active' ? '활성' : '비활성'}
                </span>
              </div>
            </div>
            <div className="mt-8">
              <button className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                <FaKey className="mr-2" />
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
