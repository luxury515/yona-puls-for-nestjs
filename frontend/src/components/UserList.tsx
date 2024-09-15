import React, { useState, useEffect } from 'react';
import axios from 'axios';  // AxiosError를 import 합니다.

interface User {
  id: number;
  name: string;
  login_id: string;
  email: string;
  state: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ACTIVE');

  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab]);

  const fetchUsers = async (state: string) => {
    try {
      const response = await axios.get(`/users/user-list?state=${state}`);
      setUsers(response.data);
    } catch (error) {
      console.error('사용자 목록을 불러오는데 실패했습니다:', error);
      if (axios.isAxiosError(error)) {  
        if (error.response) {
          // 서버 응답이 있는 경우
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          // 요청이 이루어졌으나 응답이 없는 경우
          console.error('Error request:', error.request);
        } else {
          // 요청 설정 중 오류가 발생한 경우
          console.error('Error message:', error.message);
        }
      } else {
        // Axios 에러가 아닌 경우
        console.error('Non-Axios error:', error);
      }
    }
  };

  const tabs = ['ACTIVE', 'LOCKED', 'DELETED', 'GUEST', 'SITE_ADMIN'];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-1">
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">사용자 목록</h1>
          <div className="mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mr-2 px-3 py-1 rounded ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-left">로그인 ID</th>
                <th className="py-3 px-6 text-left">이메일</th>
                <th className="py-3 px-6 text-left">상태</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.login_id}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
