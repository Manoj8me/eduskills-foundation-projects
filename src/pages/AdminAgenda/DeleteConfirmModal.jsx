// components/agenda/DeleteConfirmModal.js
import React from 'react';

const DeleteConfirmModal = ({ item, type, onConfirm, onCancel, isLoading }) => {
  const getItemName = () => {
    switch (type) {
      case 'agenda':
        return `Agenda (${item?.date})`;
      case 'detail':
        return `Detail: ${item?.title}`;
      case 'speaker':
        return `Speaker: ${item?.speaker_name}`;
      default:
        return 'Item';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-red-600">
            Delete {type}
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <strong>{getItemName()}</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
