import React from 'react';

const SystemSettingsTab: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-b-lg shadow-sm flex flex-col items-start">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">SystemSettingsTab</h1>
      <p className="text-gray-600 dark:text-gray-300">탭 내용이 여기에 올 수 있습니다.</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Button</button>
    </div>
  );
};

export default SystemSettingsTab;
