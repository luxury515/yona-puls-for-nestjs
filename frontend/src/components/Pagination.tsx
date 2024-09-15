import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/20/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxPageButtons = 5;
  const pageGroup = Math.ceil(currentPage / maxPageButtons);
  const startPage = (pageGroup - 1) * maxPageButtons + 1;
  const endPage = Math.min(pageGroup * maxPageButtons, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    const newPage = Math.max(1, startPage - maxPageButtons);
    onPageChange(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(totalPages, endPage + 1);
    onPageChange(newPage);
  };

  return (
    <nav className="flex items-center justify-center border-t border-gray-200 px-4 sm:px-0">
      <div className="flex -mt-px">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
          처음
        </button>
        <button
          onClick={handlePrevious}
          disabled={currentPage <= maxPageButtons}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          이전
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              currentPage === number
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={endPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          다음
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          마지막
          <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;