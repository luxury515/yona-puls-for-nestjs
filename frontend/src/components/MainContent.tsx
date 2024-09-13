import React from 'react';
import ProjectList from './ProjectList';

const MainContent: React.FC = () => {
  return (
    <div className="flex-1 p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ProjectList />
    </div>
  );
};

export default MainContent;