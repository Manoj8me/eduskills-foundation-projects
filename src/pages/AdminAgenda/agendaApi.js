import { BASE_URL } from "../../services/configUrls";

// api/agendaApi.js
// const API_BASE_URL = `${BASE_URL}/hr-community`;

export const agendaApi = {
  // Create agenda with details
  createAgenda: async (agendaData) => {
    const response = await fetch(`${BASE_URL}/hr-community/create_agenda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agendaData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create agenda");
    }
    return response.json();
  },

  // Create speakers for agenda detail
  createSpeakers: async (speakersData) => {
    const response = await fetch(`${BASE_URL}/hr-community/create_speakers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(speakersData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create speakers");
    }
    return response.json();
  },

  // Edit agenda with details
  editAgenda: async (agendaId, agendaData) => {
    const response = await fetch(
      `${BASE_URL}/hr-community/edit_agenda_with_details/${agendaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendaData),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to edit agenda");
    }
    return response.json();
  },

  // Edit speaker
  editSpeaker: async (speakerId, speakerData) => {
    const response = await fetch(
      `${BASE_URL}/hr-community/edit_speaker/${speakerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(speakerData),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to edit speaker");
    }
    return response.json();
  },

  // Delete agenda
  deleteAgenda: async (agendaId) => {
    const response = await fetch(
      `${BASE_URL}/hr-community/delete_agenda/${agendaId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete agenda");
    }
    return response.json();
  },

  // Delete agenda detail
  deleteAgendaDetail: async (detailId) => {
    const response = await fetch(
      `${BASE_URL}/hr-community/delete_agenda_detail/${detailId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete agenda detail");
    }
    return response.json();
  },

  // Delete speaker
  deleteSpeaker: async (speakerId) => {
    const response = await fetch(
      `${BASE_URL}/hr-community/delete_speaker/${speakerId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete speaker");
    }
    return response.json();
  },

  // Get all agendas (you'll need to implement this endpoint)
  getAllAgendas: async () => {
    const response = await fetch(
      `${BASE_URL}/hr-community/agendas?agenda_type=connect`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch agendas");
    }
    return response.json();
  },

  // For editing - gets specific agenda
  getAgendaById: async (agendaId) => {
    const response = await fetch(
      `${BASE_URL}/hr-community/agendas/${agendaId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch agenda");
    }
    return response.json();
  },

  // For speaker management - gets speakers for a detail
  getSpeakersByAgendaDetailId: async (detailId) => {
    const response = await fetch(
      `${BASE_URL}/hr-community/agenda-details/${detailId}/speakers`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch speakers");
    }
    return response.json();
  },
};
