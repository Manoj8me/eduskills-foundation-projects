// components/community/agenda/AgendaForm.js
import React, { useState, useEffect } from 'react';

const AGENDA_TYPES = [
  'connect',
  'summit',
  'award',
];

const AgendaForm = ({ agenda, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    details: []
  });

  const [currentDetail, setCurrentDetail] = useState({
    start_time: '',
    end_time: '',
    title: '',
    sub_title: ''
  });

  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    if (agenda) {
      // Format the date for the input field
      const formattedDate = agenda.date ?
        new Date(agenda.date).toISOString().split('T')[0] : '';

      // Format the details with proper time formatting WITHOUT timezone conversion
      const formattedDetails = agenda.details?.map(detail => {
        const formatTimeFromDateTime = (dateTimeString) => {
          if (!dateTimeString) return '';
          
          const timePart = dateTimeString.split(' ')[1] || dateTimeString.split('T')[1];
          if (timePart) {
            return timePart.slice(0, 5);
          }
          
          const date = new Date(dateTimeString);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`;
        };

        return {
          id: detail.id,
          start_time: formatTimeFromDateTime(detail.start_time),
          end_time: formatTimeFromDateTime(detail.end_time),
          title: detail.title || '',
          sub_title: detail.sub_title || ''
        };
      }) || [];

      setFormData({
        date: formattedDate,
        type: agenda.type || '',
        details: formattedDetails
      });
    }
  }, [agenda]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (field, value) => {
    setCurrentDetail(prev => ({ ...prev, [field]: value }));
  };

  const addDetail = () => {
    if (currentDetail.start_time && currentDetail.end_time && currentDetail.title) {
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, { ...currentDetail }]
      }));
      
      // Clear the form
      setCurrentDetail({
        start_time: '',
        end_time: '',
        title: '',
        sub_title: ''
      });
    }
  };

  const editDetail = (index) => {
    setCurrentDetail(formData.details[index]);
    setEditingIndex(index);
  };

  const updateDetail = () => {
    if (currentDetail.start_time && currentDetail.end_time && currentDetail.title) {
      setFormData(prev => ({
        ...prev,
        details: prev.details.map((detail, index) => 
          index === editingIndex ? { ...currentDetail } : detail
        )
      }));
      
      // Clear the form and exit edit mode
      setCurrentDetail({
        start_time: '',
        end_time: '',
        title: '',
        sub_title: ''
      });
      setEditingIndex(-1);
    }
  };

  const cancelEdit = () => {
    setCurrentDetail({
      start_time: '',
      end_time: '',
      title: '',
      sub_title: ''
    });
    setEditingIndex(-1);
  };

  const deleteDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
    
    // If we're editing the deleted item, cancel edit
    if (editingIndex === index) {
      cancelEdit();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      details: formData.details.map(detail => {
        const startDateTime = new Date(`${formData.date}T${detail.start_time}`);
        const endDateTime = new Date(`${formData.date}T${detail.end_time}`);

        const formatLocalDateTime = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');

          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        return {
          ...detail,
          start_time: formatLocalDateTime(startDateTime),
          end_time: formatLocalDateTime(endDateTime),
        };
      })
    };

    onSubmit(submitData);
  };

  const isFormValid = currentDetail.start_time && currentDetail.end_time && currentDetail.title;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-white border border-gray-200 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {agenda ? 'Edit Agenda' : 'Create New Agenda'}
          </h2>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agenda Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select agenda type</option>
                  {AGENDA_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Added Details */}
            {formData.details.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Added Details ({formData.details.length})</h3>
                <div className="space-y-3">
                  {formData.details.map((detail, index) => (
                    <div key={index} className="border border-gray-200 bg-gray-50 rounded-lg">
                      <div className="pt-4 px-4 pb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-sm font-medium text-blue-600">
                                {detail.start_time} - {detail.end_time}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Detail {index + 1}
                              </span>
                            </div>
                            <h4 className="font-medium mb-1 text-gray-900">{detail.title}</h4>
                            {detail.sub_title && (
                              <p className="text-sm text-gray-600">{detail.sub_title}</p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => editDetail(index)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-blue-700 transition-colors duration-150"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="m18 2 4 4-14 14H4v-4L18 2z"></path>
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteDetail(index)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-red-700 transition-colors duration-150"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add/Edit Detail Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingIndex >= 0 ? 'Edit Detail' : 'Add New Detail'}
              </h3>
              
              <div className="border-dashed border-2 border-blue-300 rounded-lg bg-white">
                <div className="pt-6 px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Start Time *</label>
                      <input
                        type="time"
                        value={currentDetail.start_time}
                        onChange={(e) => handleDetailChange('start_time', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">End Time *</label>
                      <input
                        type="time"
                        value={currentDetail.end_time}
                        onChange={(e) => handleDetailChange('end_time', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Title *</label>
                      <input
                        type="text"
                        value={currentDetail.title}
                        onChange={(e) => handleDetailChange('title', e.target.value)}
                        placeholder="Enter title"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Subtitle</label>
                      <textarea
                        value={currentDetail.sub_title}
                        onChange={(e) => handleDetailChange('sub_title', e.target.value)}
                        placeholder="Enter subtitle (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex gap-2">
                      {editingIndex >= 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={updateDetail}
                            disabled={!isFormValid}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                            Update Detail
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={addDetail}
                          disabled={!isFormValid}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          Add Detail
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Form Actions */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
          <div className="flex space-x-3">
            <button 
              type="submit" 
              disabled={isLoading || formData.details.length === 0} 
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              onClick={handleSubmit}
            >
              {isLoading ? 'Saving...' : (agenda ? 'Update Agenda' : 'Create Agenda')}
            </button>
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
          {formData.details.length === 0 && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Please add at least one detail before saving
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendaForm;
