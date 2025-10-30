import React from "react";

const ActionButtons = ({ onCancel, onSave, isLoading }) => {
  return (
    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-4">
      {/* <button 
        onClick={onCancel}
        disabled={isLoading}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
      >
        Cancel
      </button> */}
      <button 
        onClick={onSave}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default ActionButtons;