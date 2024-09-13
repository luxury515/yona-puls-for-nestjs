import React, { useState } from 'react';

const LabelForm: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [labels, setLabels] = useState<{ category: string; name: string; color: string }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newLabel, setNewLabel] = useState({ category: '', name: '', color: '' });

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleAddLabel = () => {
    if (newLabel.category && newLabel.name && newLabel.color) {
      setLabels([...labels, newLabel]);
      setNewLabel({ category: '', name: '', color: '' });
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Label Management</h1>
      
      {/* Category Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add Category</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="New Category"
          />
          <button onClick={handleAddCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">Add</button>
        </div>
      </div>

      {/* Label Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add Label</h2>
        <div className="flex flex-col space-y-4">
          <select
            value={newLabel.category}
            onChange={(e) => setNewLabel({ ...newLabel, category: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            value={newLabel.name}
            onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Label Name"
          />
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={newLabel.color}
              onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <input
              type="text"
              value={newLabel.color}
              onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="#ff5722"
            />
          </div>
          <button onClick={handleAddLabel} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">Add Label</button>
        </div>
      </div>

      {/* Display Labels */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Labels</h2>
        <div className="space-y-4">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="p-3 rounded-lg text-white" style={{ backgroundColor: label.color }}>{label.name}</span>
              <span className="text-gray-600 dark:text-gray-300">({label.category})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabelForm;