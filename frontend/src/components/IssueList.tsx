import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HaveAnyData from './HaveAnyData';
import Pagination from './Pagination';
import IssueListTab from './IssueListTab';
import IssueLabel from './IssueLabel';
import createApiClient from '../utils/api';
const api = createApiClient();

interface Label {
  id: number;
  label_name: string;
  label_color: string;
}

interface Issue {
  id: number;
  title: string;
  status: string;
  author_name: string;
  created_date: string;
  number: number;
  labels: Label[];
}

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'open' | 'closed' | 'assigned'>('open');
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/issues`, {
          params: { 
            page: currentPage, 
            pageSize, 
            state: activeTab
          }
        });
        const issuesData = response.data.issues;
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);

        // 각 이슈에 대해 라벨 정보를 가져옵니다.
        const issuesWithLabels = await Promise.all(issuesData.map(async (issue: Issue) => {
          console.log(`이슈 ${issue.number}의 라벨을 가져오는 중...`);
          try {
            // 여기서 라벨 데이터를 가져오는 API 엔드포인트를 확인해주세요
            const labelResponse = await api.get(`/issues/${issue.number}/labels`, {
              params: { projectId: projectId }
            });
            console.log(`이슈 ${issue.number}의 라벨:`, labelResponse.data);
            return { ...issue, labels: labelResponse.data };
          } catch (error) {
            console.error(`이슈 ${issue.number}의 라벨을 가져오는 데 실패했습니다:`, error);
            return { ...issue, labels: [] };
          }
        }));
        console.log('모든 이슈와 라벨:', issuesWithLabels);
        setIssues(issuesWithLabels);
      } catch (error) {
        console.error('이슈 목록을 불러오는 데 실패했습니다:', error);
      }
    };

    if (projectId && activeTab !== 'assigned') {
      fetchIssues();
    }
  }, [projectId, currentPage, pageSize, activeTab]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreateIssue = () => {
    navigate(`/projects/${projectId}/create-issue`);
  };

  const handleIssueClick = (issueNumber: number) => {
    navigate(`/projects/${projectId}/issues/${issueNumber}`);
  };

  if (!projectId) {
    return <div className="text-gray-800 dark:text-white">프로젝트 ID가 유효하지 않습니다.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-1">
        <div className="flex-1 p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">이슈 목록 (프로젝트 ID: {projectId})</h2>
          <IssueListTab activeTab={activeTab} setActiveTab={setActiveTab} projectId={projectId} />
          {activeTab !== 'assigned' && (
            <>
              {totalCount === 0 ? (
                <HaveAnyData 
                  title="이슈가 습니다"
                  description="새로운 이슈를 생성하여 프로젝트를 시작하세요."
                  buttonText="이슈 생성"
                  onButtonClick={handleCreateIssue}
                />
              ) : (
                <>
                  <div className="mb-4 mt-4 flex justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-300">총 {totalCount}개의 이슈</p>
                  </div>
                  <ul className="space-y-3">
                    {issues.map((issue) => (
                      <button 
                        key={issue.id} 
                        className="w-full text-left flex flex-col py-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-800 rounded-lg shadow"
                        onClick={() => handleIssueClick(issue.number)}
                      >
                        <div className="flex justify-between gap-x-6">
                          <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">{issue.title}</p>
                            </div>
                          </div>
                          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900 dark:text-white">{issue.status}</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                            작성자: {issue.author_name} | 생성일: <time dateTime={issue.created_date}>{new Date(issue.created_date).toLocaleDateString()}</time>
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          {issue.labels && issue.labels.length > 0 ? (
                            issue.labels.map((label) => (
                              <IssueLabel key={label.id} name={label.label_name} color={label.label_color} />
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">라벨 없음</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </ul>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
