import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

interface FormData {
  name: string;
  description: string;
  publicScope: string;
  vcsType: string;
  code: boolean;
  issue: boolean;
  pullRequest: boolean;
  review: boolean;
  milestone: boolean;
  board: boolean;
}

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    publicScope: 'PUBLIC',
    vcsType: 'Git',
    code: true,
    issue: true,
    pullRequest: true,
    review: true,
    milestone: true,
    board: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => {
        const newState = { ...prev, [name]: isChecked };
        
        if (name === 'code' && !isChecked) {
          newState.pullRequest = false;
          newState.review = false;
        } else if (name === 'pullRequest' && isChecked) {
          newState.code = true;
        } else if (name === 'review' && isChecked) {
          newState.code = true;
        }
        
        return newState;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/projects', formData);
      console.log('Project created:', response.data);
      toast.success('프로젝트가 성공적으로 생성되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      toast.error('프로젝트 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">프로젝트 생성</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">프로젝트 명</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          pattern="^[a-zA-Z0-9가-힣_-]+$"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">프로젝트 설명</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows={4}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-2">공개 레벨</label>
        <div>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="publicScope"
              value="PUBLIC"
              checked={formData.publicScope === 'PUBLIC'}
              onChange={handleChange}
              className="mr-2"
            />
            공개
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="publicScope"
              value="PRIVATE"
              checked={formData.publicScope === 'PRIVATE'}
              onChange={handleChange}
              className="mr-2"
            />
            비공개
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="vcsType" className="block mb-2">코드저장소 타입</label>
        <select
          id="vcsType"
          name="vcsType"
          value={formData.vcsType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="Git">Git</option>
          <option value="Subversion">Subversion</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">메뉴 설정</label>
        {(['code', 'issue', 'pullRequest', 'review', 'milestone', 'board'] as const).map((menu) => (
          <label key={menu} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name={menu}
              checked={formData[menu]}
              onChange={handleChange}
              className="mr-2"
              disabled={
                (menu === 'pullRequest' && !formData.code) ||
                (menu === 'review' && !formData.code)
              }
            />
            {menu === 'pullRequest' ? '코드 주고 받기' : menu}
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => navigate('/')} className="px-4 py-2 mr-2 bg-gray-300 rounded">
          취소
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          프로젝트 생성
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;