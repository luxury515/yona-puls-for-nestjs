import React, { useEffect, useRef } from 'react'

interface IssueListTabProps {
  readonly activeTab: 'open' | 'closed';
  readonly setActiveTab: (tab: 'open' | 'closed') => void;
}

// cn 함수를 대체하는 유틸리티 함수
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export default function IssueListTab({ activeTab, setActiveTab }: IssueListTabProps) {
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

  const getTabClass = (tabName: 'open' | 'closed') => {
    return classNames(
      "px-3 py-2 font-medium text-sm relative",
      activeTab === tabName
        ? "text-blue-600"
        : "text-gray-500 hover:text-gray-700"
    );
  };

  return (
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
          className={getTabClass('closed')}
        >
          Closed
        </button>
      </nav>
      <div 
        ref={underlineRef}
        className="absolute bottom-0 h-0.5 bg-[#3b82f6] transition-all duration-300 ease-in-out"
      />
    </div>
  );
}