// components/Agenda.js
import React, { useState, useEffect } from 'react';
import { agendaApi } from './agendaApi';

import AgendaForm from './AgendaForm';
import AgendaSpeakerForm from './AgendaSpeakerForm';
import DeleteConfirmModal from './DeleteConfirmModal';

const Agenda = () => {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState(null);
  const [selectedAgendaDetail, setSelectedAgendaDetail] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null, type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    try {
      setLoading(true);
      const data = await agendaApi.getAllAgendas();
      setAgendas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgenda = () => {
    setEditingAgenda(null);
    setShowAgendaForm(true);
  };

  const handleEditAgenda = (agenda) => {
    setEditingAgenda(agenda);
    setShowAgendaForm(true);
  };

  const handleAgendaSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      if (editingAgenda) {
        // For editing, we need to add IDs to the details
        const editData = {
          ...formData,
          details: formData.details.map((detail, index) => ({
            ...detail,
            id: editingAgenda.details[index]?.id || 0 // Use existing ID or 0 for new details
          }))
        };
        await agendaApi.editAgenda(editingAgenda.id, editData);
      } else {
        await agendaApi.createAgenda(formData);
      }
      
      await fetchAgendas();
      setShowAgendaForm(false);
      setEditingAgenda(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageSpeakers = (agendaDetail) => {
    setSelectedAgendaDetail(agendaDetail);
    setShowSpeakerForm(true);
  };

  const handleSpeakerSubmit = async (speakersData) => {
    try {
      setIsSubmitting(true);
      await agendaApi.createSpeakers(speakersData);
      await fetchAgendas();
      setShowSpeakerForm(false);
      setSelectedAgendaDetail(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item, type) => {
    setDeleteModal({ show: true, item, type });
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      const { item, type } = deleteModal;
      
      switch (type) {
        case 'agenda':
          await agendaApi.deleteAgenda(item.id);
          break;
        case 'detail':
          await agendaApi.deleteAgendaDetail(item.id);
          break;
        case 'speaker':
          await agendaApi.deleteSpeaker(item.id);
          break;
      }
      
      await fetchAgendas();
      setDeleteModal({ show: false, item: null, type: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowAgendaForm(false);
    setShowSpeakerForm(false);
    setEditingAgenda(null);
    setSelectedAgendaDetail(null);
    setDeleteModal({ show: false, item: null, type: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Event Agendas</h1>
        <button 
          onClick={handleCreateAgenda}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Agenda
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">
          <div className="flex justify-between items-start">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-800 hover:text-red-900 ml-4 text-lg font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {agendas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No agendas found</p>
          <button 
            onClick={handleCreateAgenda}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Your First Agenda
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agendas.map((agenda) => (
                  <tr key={agenda.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(agenda.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {agenda.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {agenda.details.map((detail, index) => (
                          <div key={detail.id} className="border-l-4 border-blue-500 pl-3 py-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {detail.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatTime(detail.start_time)} - {formatTime(detail.end_time)}
                                </div>
                                {detail.sub_title && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {detail.sub_title}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                  {detail.speakers?.length || 0} speakers
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleManageSpeakers(detail)}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                                >
                                  Speakers
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(detail, 'detail')}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAgenda(agenda)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(agenda, 'agenda')}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAgendaForm && (
        <AgendaForm
          agenda={editingAgenda}
          onSubmit={handleAgendaSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      )}

      {showSpeakerForm && (
        <AgendaSpeakerForm
          agendaDetailId={selectedAgendaDetail?.id}
          speakers={selectedAgendaDetail?.speakers}
          onSubmit={handleSpeakerSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      )}

      {deleteModal.show && (
        <DeleteConfirmModal
          item={deleteModal.item}
          type={deleteModal.type}
          onConfirm={handleDeleteConfirm}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default Agenda;
