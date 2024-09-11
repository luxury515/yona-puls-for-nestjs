import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface HaveAnyDataProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function HaveAnyData({ title, description, buttonText, onButtonClick }: Readonly<HaveAnyDataProps>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 p-4">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
            <FaPlus className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-4">{description}</p>
        <button 
          onClick={onButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          {buttonText}
        </button>
      </div>
    </div>
  );
}