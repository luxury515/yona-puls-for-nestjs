import React, { useState } from 'react';
import SystemSettingsTab from './SystemSettingsTab';
import LabelList from './LabelList';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">System Settings</h1>
      <div className="w-full">
        <div className="flex w-full justify-start bg-gray-200 dark:bg-gray-600 rounded-t-lg p-2">
          <button
            className={`px-8 py-4 rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === 'label' ? 'bg-white dark:bg-gray-500' : 'hover:bg-gray-300 dark:hover:bg-gray-500'}`}
            onClick={() => handleTabClick('label')}
          >
            Label
          </button>
          <button
            className={`px-8 py-4 rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === 'tab1' ? 'bg-white dark:bg-gray-500' : 'hover:bg-gray-300 dark:hover:bg-gray-500'}`}
            onClick={() => handleTabClick('tab1')}
          >
            One
          </button>
          <button
            className={`px-8 py-4 rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === 'tab2' ? 'bg-white dark:bg-gray-500' : 'hover:bg-gray-300 dark:hover:bg-gray-500'}`}
            onClick={() => handleTabClick('tab2')}
          >
            Two
          </button>
          <button
            className={`px-8 py-4 rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === 'tab3' ? 'bg-white dark:bg-gray-500' : 'hover:bg-gray-300 dark:hover:bg-gray-500'}`}
            onClick={() => handleTabClick('tab3')}
          >
            Three
          </button>
          <button
            className={`px-8 py-4 rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === 'tab4' ? 'bg-white dark:bg-gray-500' : 'hover:bg-gray-300 dark:hover:bg-gray-500'}`}
            onClick={() => handleTabClick('tab4')}
          >
            Four
          </button>
          
        </div>
        <div className={`transition-all duration-500 ease-in-out transform ${activeTab === 'tab1' ? 'block' : 'hidden'}`}>
          <SystemSettingsTab />
        </div>
        <div className={`transition-all duration-500 ease-in-out transform ${activeTab === 'tab2' ? 'block' : 'hidden'}`}>
          <SystemSettingsTab />
        </div>
        <div className={`transition-all duration-500 ease-in-out transform ${activeTab === 'tab3' ? 'block' : 'hidden'}`}>
          <SystemSettingsTab />
        </div>
        <div className={`transition-all duration-500 ease-in-out transform ${activeTab === 'tab4' ? 'block' : 'hidden'}`}>
          <SystemSettingsTab />
        </div>
        <div className={`transition-all duration-500 ease-in-out transform ${activeTab === 'label' ? 'block' : 'hidden'}`}>
          <LabelList />
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
