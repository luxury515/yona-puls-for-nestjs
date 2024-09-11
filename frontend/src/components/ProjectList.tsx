import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Avatar, { AvatarGroup } from './Avatar';

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
        const response = await axios.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('프로젝트 목록을 불러오는 데 실패했습니다:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}/issues`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">프로젝트 목록</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white shadow rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="p-4 flex items-center space-x-4">
              <Avatar name={project.name} />
              <div className="flex-grow">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.participant_count} 멤버</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <FaEllipsisV className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 py-2 bg-gray-50 min-h-[40px] flex items-center">
              <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                {project.overview || '\u00A0'}
              </p>
            </div>
            <div className="px-4 py-2">
              <AvatarGroup users={project.participants.map(p => ({ name: p.name }))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}