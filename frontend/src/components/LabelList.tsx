import React, { useState } from 'react';
import LabelForm from './LabelForm';

const LabelList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Label List</h1>
      <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">라벨 관리</button>
      {showForm && <LabelForm />}
      {/* LabelList 컴포넌트 내용 */}
    </div>
  );
};

export default LabelList;
