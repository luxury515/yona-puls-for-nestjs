import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import SideMenu from './SideMenu';

axios.defaults.baseURL = 'http://localhost:8080';

export default function IssueForm() {
  const { projectId, issueId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (issueId) {
      fetchIssue()
    }
  }, [issueId, projectId])

  const fetchIssue = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/issues/${issueId}?projectId=${projectId}`);
      const issue = await response.json();
      setTitle(issue.title)
      setContent(issue.content)
    } catch (error) {
      console.error('이슈를 불러오는 데 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (issueId) {
        await axios.put(`/issues/${issueId}/${projectId}`, { title, content })
      } else {
        await axios.post(`/issues/${projectId}`, { title, content })
      }
      navigate(`/projects/${projectId}`); // 성공 시 프로젝트 페이지로 이동
    } catch (error) {
      console.error('이슈 저장에 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SideMenu />
        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">{issueId ? '이슈 수정' : '새 이슈 생성'}</h2>
            <div className="mb-4">
              <input 
                type="text"
                placeholder="제목" 
                className="w-full p-2 text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4 mb-4">
              <select className="w-[200px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="dfp">DFP_production</option>
              </select>
              
              <select className="w-[200px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="parent">— 부모 이슈 선택 —</option>
              </select>
            </div>
            
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex" aria-label="Tabs">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">편집</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">미리보기</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">체크리스트 추가</button>
              </nav>
            </div>
            
            <div className="bg-gray-100 p-2 rounded-md flex space-x-2 overflow-x-auto mb-4">
              {['Header', 'Text Style', 'Link', 'List', 'Checklist', 'Image', 'Blockquote', 'Code', 'Table', 'Short Link'].map((item) => (
                <button key={item} className="px-2 py-1 bg-white rounded text-sm hover:bg-gray-200 transition-colors">{item}</button>
              ))}
            </div>
            
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="w-full p-2 min-h-[300px] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex space-x-4">
                <span>첨부할 파일을 끌어다 놓거나</span>
                <button className="text-blue-500 hover:text-blue-600">파일 올리기</button>
              </div>
              <span>바로를 클릭해서 선택하세요</span>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button type="button" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">취소</button>
              <button type="button" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">초안으로 저장</button>
              <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                {isLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}