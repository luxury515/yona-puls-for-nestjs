import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import createApiClient from '../utils/api';
const api = createApiClient();

interface User {
  id: number;
  name: string;
  login_id: string;
  email: string;
  state: string;
}

interface UserListResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ACTIVE');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const fetchUsers = async (state: string, page: number) => {
    try {
      const response = await api.get<UserListResponse>(`/users/user-list?state=${state}&page=${page}&pageSize=10`);
      if (response.data.users.length === 0) {
        console.warn('사용자 목록이 비어 있습니다.');
      }
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error('사용자 목록을 불러오는데 실패했습니다:', error);
      // 에러 처리 로직...
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
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
          <p className="mb-2 text-gray-600 dark:text-gray-400">총 {totalCount}명의 사용자</p>
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
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
