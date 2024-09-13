import React, { useEffect, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Avatar, { AvatarGroup } from './Avatar';
import api from '../utils/api';
interface Project {
  id: number;
  name: string;
  overview: string;
  participant_count: number;
  participants: { name: string }[];
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data || []); 
      } catch (error) {
        console.error('프로젝트 목록을 불러오는 데 실패했습니다:', error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}/issues`);
  };

  return (
    <div className="w-full max-w-full mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl"
                >
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                  <FaEllipsisV className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.overview || '프로젝트 설명이 없습니다.'}</p>
              <div className="flex justify-between items-center">
                <AvatarGroup users={project.participants.map(p => ({ name: p.name }))} />
                <span className="text-sm text-gray-500 dark:text-gray-400">{project.participant_count} 멤버</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}