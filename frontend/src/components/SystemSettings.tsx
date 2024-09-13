import React from 'react';
import SystemSettingsTab from './SystemSettingsTab';

const SystemSettings: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">System Settings</h1>
      <div className="w-full">
        <SystemSettingsTab />
      </div>
    </div>
  );
};

export default SystemSettings;
