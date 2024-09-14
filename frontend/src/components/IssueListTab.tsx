import React, { useEffect, useRef } from 'react'
import ProjectMembers from './ProjectMembers';

// cn 함수를 대체하는 유틸리티 함수
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

// 수정된 IssueListTabProps 인터페이스
interface IssueListTabProps {
  readonly activeTab: 'open' | 'closed' | 'assigned';
  readonly setActiveTab: (tab: 'open' | 'closed' | 'assigned') => void;
  readonly projectId: string;
}

export default function IssueListTab({ activeTab, setActiveTab, projectId }: IssueListTabProps) {
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (underlineRef.current) {
      const activeButton = document.querySelector(`button[data-tab="${activeTab}"]`);
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton as HTMLElement;
        underlineRef.current.style.left = `${offsetLeft}px`;
        underlineRef.current.style.width = `${offsetWidth}px`;
      }
    }
  }, [activeTab]);

  const getTabClass = (tabName: 'open' | 'closed' | 'assigned') => {
    return classNames(
      "px-3 py-2 font-medium text-sm relative",
      activeTab === tabName
        ? "text-blue-600"
        : "text-gray-500 hover:text-gray-700"
    );
  };

  return (
    <div>
      <div className="border-b border-gray-200 relative">
        <nav className="flex" aria-label="Tabs">
          <button
            data-tab="open"
            onClick={() => setActiveTab('open')}
            className={`${getTabClass('open')} mr-2`}
          >
            Open
          </button>
          <button
            data-tab="closed"
            onClick={() => setActiveTab('closed')}
            className={`${getTabClass('closed')} mr-2`}
          >
            Closed
          </button>
          <button
            data-tab="assigned"
            onClick={() => setActiveTab('assigned')}
            className={getTabClass('assigned')}
          >
            Assigned
          </button>
        </nav>
        <div 
          ref={underlineRef}
          className="absolute bottom-0 h-0.5 bg-[#3b82f6] transition-all duration-300 ease-in-out"
        />
      </div>
      {activeTab === 'assigned' && (
        <ProjectMembers projectId={projectId} />
      )}
    </div>
  );
}