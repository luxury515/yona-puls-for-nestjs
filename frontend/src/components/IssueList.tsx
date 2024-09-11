import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import SideMenu from './SideMenu';
import HaveAnyData from './HaveAnyData';
import Pagination from './Pagination';
import IssueListTab from './IssueListTab';

interface Issue {
  id: number;
  title: string;
  status: string;
  author_name: string;
  created_date: string;
}

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(`/projects/${projectId}/issues`, {
          params: { 
            page: currentPage, 
            pageSize, 
            state: activeTab // 'open' 또는 'closed'
          }
        });
        setIssues(response.data.issues);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error('이슈 목록을 불러오는 데 실패했습니다:', error);
      }
    };

    if (projectId) {
      fetchIssues();
    }
  }, [projectId, currentPage, pageSize, activeTab]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleCreateIssue = () => {
    navigate(`/projects/${projectId}/create-issue`);
  };

  if (!projectId) {
    return <div>프로젝트 ID가 유효하지 않습니다.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SideMenu />
        <div className="flex-1 p-8">
          <h2 className="text-xl font-semibold mb-4">이슈 목록 (프로젝트 ID: {projectId})</h2>
          <IssueListTab activeTab={activeTab} setActiveTab={setActiveTab} />
          {totalCount === 0 ? (
            <HaveAnyData 
              title="이슈가 없습니다"
              description="새로운 이슈를 생성하여 프로젝트를 시작하세요."
              buttonText="이슈 생성"
              onButtonClick={handleCreateIssue}
            />
          ) : (
            <>
              <div className="mb-4 mt-4 flex justify-between items-center">
                <select value={pageSize} onChange={handlePageSizeChange} className="border p-2">
                  <option value="10">10개씩 보기</option>
                  <option value="20">20개씩 보기</option>
                  <option value="30">30개씩 보기</option>
                  <option value="100">100개씩 보기</option>
                </select>
                <p>총 {totalCount}개의 이슈</p>
              </div>
              <ul className="space-y-3">
                {issues.map((issue) => (
                  <li key={issue.id} className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{issue.title}</p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">작성자: {issue.author_name}</p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">{issue.status}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        생성일: <time dateTime={issue.created_date}>{new Date(issue.created_date).toLocaleDateString()}</time>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
