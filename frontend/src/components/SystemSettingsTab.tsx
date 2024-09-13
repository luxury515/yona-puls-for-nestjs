import React from 'react';

const SystemSettingsTab: React.FC = () => {
  return (
    <div className="flex w-full justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button className="flex-1 text-center py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200" data-tab="tab1">Label관리</button>
      <button className="flex-1 text-center py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200" data-tab="tab2">탭1</button>
      <button className="flex-1 text-center py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200" data-tab="tab3">탭2</button>
      <button className="flex-1 text-center py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200" data-tab="tab4">탭3</button>
    </div>
  );
};

export default SystemSettingsTab;
