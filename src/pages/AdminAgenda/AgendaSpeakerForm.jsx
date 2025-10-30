// components/agenda/AgendaSpeakerForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MAX_FILE_SIZE = 200 * 1024; // 200KB

const AgendaSpeakerForm = ({ agendaDetailId, speakers, onSubmit, onCancel, isLoading }) => {
    const [speakersData, setSpeakersData] = useState([{
        speaker_name: '',
        position_role: '',
        profile_image_base64: ''
    }]);
    const [fileErrors, setFileErrors] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [deletedSpeakerIds, setDeletedSpeakerIds] = useState([]);
    const [deletingIds, setDeletingIds] = useState(new Set());

    useEffect(() => {
        if (speakers?.length) {
            setSpeakersData(speakers);
            setImagePreviews(speakers.map(speaker => speaker.profile_image_base64 || ''));
        }
    }, [speakers]);

    // API function to delete speaker
    const deleteSpeakerAPI = async (speakerId) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/hr-community/delete_speaker/${speakerId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting speaker:', error);
            throw new Error(error.response?.data?.detail || 'Failed to delete speaker');
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSpeakerChange = (index, field, value) => {
        setSpeakersData(prev => prev.map((speaker, i) =>
            i === index ? { ...speaker, [field]: value } : speaker
        ));
    };

    const handleFileChange = async (index, e) => {
        const file = e.target.files[0];
        const newErrors = [...fileErrors];
        newErrors[index] = '';

        if (!file) {
            const newPreviews = [...imagePreviews];
            newPreviews[index] = '';
            setImagePreviews(newPreviews);
            handleSpeakerChange(index, 'profile_image_base64', '');
            setFileErrors(newErrors);
            return;
        }

        // Validate file type
        if (!file.type.includes('png')) {
            newErrors[index] = 'Only PNG files are allowed';
            setFileErrors(newErrors);
            e.target.value = '';
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            newErrors[index] = `File size must be less than ${MAX_FILE_SIZE / 1024}KB`;
            setFileErrors(newErrors);
            e.target.value = '';
            return;
        }

        try {
            const base64String = await convertToBase64(file);
            const newPreviews = [...imagePreviews];
            newPreviews[index] = base64String;
            setImagePreviews(newPreviews);
            handleSpeakerChange(index, 'profile_image_base64', base64String);
            setFileErrors(newErrors);
        } catch (error) {
            newErrors[index] = 'Error processing image file';
            setFileErrors(newErrors);
            console.error('Error converting file to base64:', error);
        }
    };

    const removeImage = (index) => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = '';
        setImagePreviews(newPreviews);
        handleSpeakerChange(index, 'profile_image_base64', '');

        const fileInput = document.getElementById(`speaker-image-${index}`);
        if (fileInput) fileInput.value = '';
    };

    const addSpeaker = () => {
        setSpeakersData(prev => [...prev, {
            speaker_name: '',
            position_role: '',
            profile_image_base64: ''
        }]);
        setImagePreviews(prev => [...prev, '']);
        setFileErrors(prev => [...prev, '']);
    };

    const removeSpeaker = async (index) => {
        if (speakersData.length > 1 || speakersData[index].id) {
            const speakerToRemove = speakersData[index];
            
            // If the speaker has an ID (existing speaker), delete it from the backend
            if (speakerToRemove.id) {
                try {
                    // Add to deleting state
                    setDeletingIds(prev => new Set([...prev, speakerToRemove.id]));
                    
                    await deleteSpeakerAPI(speakerToRemove.id);
                    
                    // Add to deleted speakers list for tracking
                    setDeletedSpeakerIds(prev => [...prev, speakerToRemove.id]);
                    
                    // Show success message (optional)
                    console.log('Speaker deleted successfully');
                    
                } catch (error) {
                    // Handle error
                    console.error('Failed to delete speaker:', error);
                    alert(`Failed to delete speaker: ${error.message}`);
                    return; // Don't remove from UI if API call failed
                } finally {
                    // Remove from deleting state
                    setDeletingIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(speakerToRemove.id);
                        return newSet;
                    });
                }
            }

            // Remove from local state
            setSpeakersData(prev => prev.filter((_, i) => i !== index));
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
            setFileErrors(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            agenda_details_id: agendaDetailId,
            speakers: speakersData,
            deleted_speaker_ids: deletedSpeakerIds // Include deleted IDs for reference
        };
        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900">Manage Speakers</h2>
                </div>
                
                {/* Content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Speakers</h3>
                            <button 
                                type="button" 
                                onClick={addSpeaker} 
                                className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                            >
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Speaker
                            </button>
                        </div>

                        {speakersData.map((speaker, index) => {
                            const isDeleting = speaker.id && deletingIds.has(speaker.id);
                            
                            return (
                                <div key={speaker.id || index} className={`border-dashed border-2 border-gray-300 rounded-lg bg-white ${isDeleting ? 'opacity-50' : ''}`}>
                                    <div className="pt-4 px-4 pb-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium text-gray-900">
                                                Speaker {index + 1}
                                                {speaker.id && (
                                                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        ID: {speaker.id}
                                                    </span>
                                                )}
                                            </h4>
                                            {(speakersData.length > 1 || speaker.id) && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpeaker(index)}
                                                    disabled={isDeleting}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                                >
                                                    {isDeleting ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                                    ) : (
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <polyline points="3,6 5,6 21,6"></polyline>
                                                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Speaker Name *</label>
                                                <input
                                                    type="text"
                                                    value={speaker.speaker_name}
                                                    onChange={(e) => handleSpeakerChange(index, 'speaker_name', e.target.value)}
                                                    placeholder="Enter speaker name"
                                                    required
                                                    disabled={isDeleting}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Position/Role *</label>
                                                <input
                                                    type="text"
                                                    value={speaker.position_role}
                                                    onChange={(e) => handleSpeakerChange(index, 'position_role', e.target.value)}
                                                    placeholder="Enter position or role"
                                                    required
                                                    disabled={isDeleting}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium text-gray-700">Profile Image (PNG only, max 200KB)</label>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        id={`speaker-image-${index}`}
                                                        type="file"
                                                        accept=".png"
                                                        onChange={(e) => handleFileChange(index, e)}
                                                        disabled={isDeleting}
                                                        className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById(`speaker-image-${index}`).click()}
                                                        disabled={isDeleting}
                                                        className="inline-flex items-center justify-center w-10 h-10 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                            <polyline points="17,8 12,3 7,8"></polyline>
                                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                                        </svg>
                                                    </button>
                                                </div>

                                                {fileErrors[index] && (
                                                    <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">
                                                        {fileErrors[index]}
                                                    </div>
                                                )}

                                                {imagePreviews[index] && (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={imagePreviews[index]}
                                                            alt="Profile preview"
                                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            disabled={isDeleting}
                                                            className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-white bg-red-600 border border-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                                        >
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex space-x-3 pt-4">
                            <button 
                                type="submit" 
                                disabled={isLoading || deletingIds.size > 0} 
                                className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                            >
                                {isLoading ? 'Saving...' : 'Save Speakers'}
                            </button>
                            <button 
                                type="button" 
                                onClick={onCancel} 
                                disabled={deletingIds.size > 0}
                                className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgendaSpeakerForm;
