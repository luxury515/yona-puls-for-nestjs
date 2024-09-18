import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import createApiClient from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const api = createApiClient();

interface ProjectOption {
  value: string;
  label: string;
}

interface Comment {
  id: number;
  contents: string;
  author_name: string;
  created_date: string;
  children: Comment[];
  author_id: number;
  parent_comment_id: number | null;
}

interface ParentIssueOption {
  value: string;
  label: string;
}

export default function IssueForm() {
  const { projectId, issueId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(null);
  const [issues, setIssues] = useState<ParentIssueOption[]>([]);
  const [selectedParentIssue, setSelectedParentIssue] = useState<ParentIssueOption | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [mainComment, setMainComment] = useState('');
  const [replyComments, setReplyComments] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { user } = useAuth();
  const userId = user?.id;
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isContentChanged, setIsContentChanged] = useState(false);

  const fetchIssue = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = `/issues/${issueId}?projectId=${projectId}`;
      const response = await api.get(url);
      const issue = response.data;
      setTitle(issue.title);
      setContent(issue.body || '');
      setSelectedProject({ value: issue.project_id.toString(), label: `(#${issue.project_id}):${issue.project_name || '프로젝트 이름 없음'}` });
      if (issue.parent_id) {
        setSelectedParentIssue({
          value: issue.parent_id.toString(),
          label: `#${issue.parent_number} ${issue.parent_title}`
        });
      } else {
        setSelectedParentIssue({ value: 'none', label: '부모 이슈 없음' });
      }
    } catch (error) {
      console.error('이슈를 불러오는 데 실패했습니다:', error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [issueId, projectId]);

  const fetchSelectboxProjects = useCallback(async () => {
    try {
      const response = await api.get('/projects');
      const projectOptions: ProjectOption[] = response.data.map((project: { id: string; name: string; }) => ({
        value: project.id,
        label: `(#${project.id}):${project.name} `
      }));
      setProjects(projectOptions);
      if (projectId) {
        const selectedOption = projectOptions.find((option) => option.value === projectId);
        setSelectedProject(selectedOption || null);
      }
    } catch (error) {
      console.error('프로젝트 목록을 불러오는 데 실패했습니다:', error as Error);
    }
  }, [projectId]);

  const fetchSelectboxIssues = useCallback(async (projectId: string, page = 1, pageSize = 10, state = 'open') => {
    if (!projectId) return;
    try {
      const response = await api.get(`/projects/${projectId}/issues`, {
        params: { page, pageSize, state }
      });
      const issuesData = Array.isArray(response.data) ? response.data : response.data.issues || [];
      const issueOptions = issuesData.map((issue: { id: any; number: any; title: any; }) => ({
        value: issue.id.toString(),
        label: `#${issue.number} ${issue.title}`
      }));
      setIssues(issueOptions);
      if (issueId) {
        const currentIssue = issuesData.find((issue: { id: any; }) => issue.id.toString() === issueId);
        setSelectedParentIssue(currentIssue ? 
          { value: currentIssue.id.toString(), label: `#${currentIssue.number} ${currentIssue.title}` } 
          : { value: 'none', label: '부모 이슈 없음' }
        );
      }
    } catch (error) {
      console.error('프로젝트 이슈 목록을 불러오는 데 실패했습니다:', error as Error);
      setIssues([]);
    }
  }, [issueId]);

  const fetchComments = useCallback(async () => {
    if (!issueId || !projectId) return;
    try {
      const response = await api.get(`/issues/${issueId}/comments`, {
        params: { projectId }
      });
      setComments(response.data);
    } catch (error) {
      console.error('댓글을 불러오는데 실패했습니다:', error);
      setComments([]);
    }
  }, [issueId, projectId]);

  useEffect(() => {
    if (projectId) {
      fetchSelectboxProjects().then(() => {
        if (issueId) {
          fetchIssue();
          fetchComments();
        }
      });
    }
  }, [projectId, issueId, fetchIssue, fetchSelectboxProjects, fetchComments]);

  useEffect(() => {
    if (selectedProject) {
      fetchSelectboxIssues(selectedProject.value);
    }
  }, [selectedProject, fetchSelectboxIssues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updateData = {
        title: title || undefined,
        body: content || undefined,
      };
      if (issueId) {
        await api.put(`/issues/${projectId}/${issueId}`, updateData);
        toast.success('이슈가 성공적으로 수정되었습니다.'); // 3초 동안 표시
      } else {
        await api.post(`/issues/${projectId}`, updateData);
        toast.success('새 이슈가 성공적으로 생성되었습니다.'); // 3초 동안 표시
      }
      navigate(`/projects/${projectId}/issues`);
    } catch (error) {
      console.error('이슈 저장에 실패했습니다:', error as Error);
      toast.error('이슈 저장에 실패했습니다. 다시 시도해주세요.'); // 5초 동안 표시
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueCancelClick = () => {
    navigate(`/projects/${projectId}/issues`);
  };

  const handleProjectChange = (selectedOption: ProjectOption | null) => {
    setSelectedProject(selectedOption);
    setSelectedParentIssue(null);
    if (selectedOption) {
      fetchSelectboxIssues(selectedOption.value);
    } else {
      setIssues([]);
    }
  };

  const handleAddMainComment = async () => {
    try {
      await api.post(`/issues/${projectId}/${issueId}/comments`, {
        contents: mainComment,
        user_id: userId,
        parent_comment_id: null
      });
      setMainComment('');
      fetchComments();
      toast.success('댓글이 성공적으로 추가되었습니다.'); // 2초 동안 표시
    } catch (error) {
      console.error('댓글 추가에 실패했습니다:', error);
      toast.error('댓글 추가에 실패했습니다. 다시 시도해주세요.'); // 4초 동안 표시
    }
  };

  const handleAddReplyComment = async (parentId: number) => {
    try {
      await api.post(`/issues/${projectId}/${issueId}/comments`, {
        contents: replyComments[parentId],
        user_id: userId,
        parent_comment_id: parentId
      });
      setReplyComments(prev => ({ ...prev, [parentId]: '' }));
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('답글 추가에 실패했습니다:', error);
      toast.error('답글 추가에 실패했습니다. 다시 시도해주세요.'); // 4초 동안 표시
    }
  };

  const handleEditComment = async (commentId: number, updatedContent: string) => {
    try {
      await api.put(`/issues/${projectId}/${issueId}/comments/${commentId}`, {
        contents: updatedContent,
        user_id: userId
      });
      fetchComments();
      setEditingCommentId(null);
      setEditedContent('');
      setIsContentChanged(false);
    } catch (error) {
      console.error('댓글 수정에 실패했습니다:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/issues/${projectId}/${issueId}/comments/${commentId}?user_id=${userId}`);
        fetchComments();
      } catch (error) {
        console.error('댓글 삭제에 실패했습니다:', error);
      }
    }
  };

  const renderComments = (comments: Comment[] = [], depth = 0) => {
    if (!Array.isArray(comments)) {
      console.error('댓글이 배열이 아닙니다:', comments);
      return null;
    }

    return comments.map(comment => (
      <div key={comment.id} style={{ marginLeft: `${depth * 20}px`, marginBottom: '10px' }}>
        <div className="bg-gray-100 p-3 rounded">
          <p className="font-bold">{comment.author_name}</p>
          {editingCommentId === comment.id ? (
            <textarea
              value={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
                setIsContentChanged(e.target.value !== comment.contents);
              }}
              className="w-full p-2 border rounded mt-2"
            />
          ) : (
            <p className="mt-1">{comment.contents}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">{new Date(comment.created_date).toLocaleString()}</p>
          {comment.author_id === userId && (
            <div className="mt-2">
              {editingCommentId === comment.id ? (
                <>
                  <button
                    onClick={() => handleEditComment(comment.id, editedContent)}
                    className={`px-2 py-1 rounded ${
                      isContentChanged ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                    disabled={!isContentChanged}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditedContent('');
                      setIsContentChanged(false);
                    }}
                    className="px-2 py-1 ml-2 bg-gray-300 text-gray-600 rounded"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditedContent(comment.contents);
                    }}
                    className="text-blue-500 mr-2"
                  >
                    수정
                  </button>
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500">
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
          <button onClick={() => setReplyingTo(comment.id)} className="text-blue-500 mt-2">
            답글
          </button>
        </div>
        {replyingTo === comment.id && (
          <div className="mt-2">
            <textarea
              value={replyComments[comment.id] || ''}
              onChange={(e) => setReplyComments(prev => ({ ...prev, [comment.id]: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="답글을 입력하세요"
            />
            <button
              onClick={() => handleAddReplyComment(comment.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              답글 작성
            </button>
          </div>
        )}
        {comment.children && renderComments(comment.children, depth + 1)}
      </div>
    ));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{issueId ? '이슈 수정' : '새 이슈 생성'}</h2>
            <div className="mb-4">
              <input 
                type="text"
                placeholder="제목" 
                className="w-full p-2 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4 mb-4">
              <Select
                className="w-[200px] relative"
                options={projects}
                value={selectedProject}
                onChange={handleProjectChange}
                placeholder="프로젝트 선택"
                menuPortalTarget={document.body}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#ffffff', // 배경색을 흰색으로 설정
                    color: 'var(--text-color)',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#ffffff', // 배경색을 흰색으로 설정
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? 'var(--highlight-color)' : '#ffffff', // 배경색을 흰색으로 설정
                    color: 'var(--text-color)',
                  }),
                }}
              />
              
              <Select
                className="w-[200px] relative"
                options={issues}
                value={selectedParentIssue}
                onChange={(newValue: ParentIssueOption | null) => setSelectedParentIssue(newValue)}
                placeholder="— 부모 이슈 선택 —"
                isClearable
                isDisabled={!selectedProject}
                isSearchable
                menuPortalTarget={document.body}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#ffffff', // 배경색을 흰색으로 설정
                    color: 'var(--text-color)',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#ffffff', // 배경색을 흰색으로 설정
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? 'var(--highlight-color)' : '#ffffff', // 배경색을 흰색으로 설정
                    color: 'var(--text-color)',
                  }),
                }}
              />
            </div>
            <textarea
                className="w-full h-[60vh] p-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용 입력하세요"
            />
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex space-x-4">
                <span>첨부할 파일을 끌어다 놓거나</span>
                <button type="button" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">파일 올리기</button>
              </div>
              <span>바로를 클릭해서 선택하세요</span>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button type="button" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" onClick={() => handleIssueCancelClick()}>취소</button>
              <button type="button" className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">초안으로 저장</button>
              <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                {isLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">댓글</h3>
            {Array.isArray(comments) ? renderComments(comments) : <p>댓글을 불러오는 중...</p>}
            <div className="mt-4">
              <textarea
                value={mainComment}
                onChange={(e) => setMainComment(e.target.value)}
                placeholder="새 댓글 작성"
                className="w-full p-2 border rounded"
              />
              <button onClick={handleAddMainComment} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">댓글 작성</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}