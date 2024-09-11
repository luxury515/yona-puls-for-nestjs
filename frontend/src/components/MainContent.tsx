import React from 'react';
import ProjectList from './ProjectList';

const MainContent: React.FC = () => {
  return (
    <div className="flex-1 p-8">
      <ProjectList />
    </div>
  );
};

export default MainContent;