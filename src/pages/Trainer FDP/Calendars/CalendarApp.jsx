import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../services/configUrls";
import Calendar from "./Calendar";
import BookingsList from "./BookingsList";
import BookEDP from "./BookEDP";

const TrainerAvailabilityCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [isBookEDPOpen, setIsBookEDPOpen] = useState(false);
  const [isBookEDPMode, setIsBookEDPMode] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false); // false, 'edit', or 'create'
  const [editingDates, setEditingDates] = useState([]);

  const api = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchAvailabilities();
    fetchBookings();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const response = await api.get(`${BASE_URL}/event/trainer-slots`);
      setAvailabilities(response.data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      alert("Failed to fetch trainer availability");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get(`${BASE_URL}/event/trainer-bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings");
    }
  };

  const createAvailability = async () => {
    try {
      if (selectedDates.length === 0) {
        alert("Please select at least one date");
        return;
      }

      setLoading(true);

      const payload = {
        dates: selectedDates,
      };

      console.log("Creating availability with payload:", payload);

      const response = await api.post(
        `${BASE_URL}/event/trainer-slots`,
        payload
      );
      await fetchAvailabilities();

      setSelectedDates([]);
      setIsEditMode(false);
      setEditingDates([]);

      alert(response?.data?.message || "Availability created successfully!");
    } catch (error) {
      console.error("Error creating availability:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to create availability";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async () => {
    try {
      if (selectedDates.length === 0) {
        alert("Please select at least one date to keep");
        return;
      }

      setLoading(true);

      const payload = {
        dates: selectedDates,
      };

      console.log("Updating availability with payload:", payload);

      const response = await api.put(
        `${BASE_URL}/event/trainer-slots`,
        payload
      );
      await fetchAvailabilities();

      setIsEditMode(false);
      setEditingDates([]);
      setSelectedDates([]);

      alert(response?.data?.message || "Availability updated successfully!");
    } catch (error) {
      console.error("Error updating availability:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to update availability";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvailabilityClick = () => {
    const editableDates = availabilities
      .filter((item) => item.status_label === "Available")
      .map((item) => item.available_date);

    if (editableDates.length === 0) {
      alert(
        "No available dates to edit. Only dates with 'Available' status can be edited."
      );
      return;
    }

    setIsEditMode("edit");
    setEditingDates(editableDates);
    // Pre-select all existing available dates
    setSelectedDates([...editableDates]);
  };

  const handleCreateAvailabilityClick = () => {
    setIsEditMode("create");
    setEditingDates([]);
    setSelectedDates([]);
  };

  const handleBookEDPClick = () => {
    const availableSlots = availabilities.filter(
      (item) => item.status_label === "Available"
    );

    if (availableSlots.length === 0) {
      alert("No available dates found. Please create availability first.");
      return;
    }

    setIsBookEDPMode(true);
    setIsBookEDPOpen(true);
    setSelectedDates([]); // Clear any previously selected dates
  };

  const handleCloseBookEDP = () => {
    setIsBookEDPOpen(false);
    setIsBookEDPMode(false);
    setSelectedDates([]); // Clear selections when closing
  };

  const handleBookEDPSuccess = () => {
    fetchAvailabilities();
    fetchBookings();
    setIsBookEDPMode(false);
    setSelectedDates([]);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingDates([]);
    setSelectedDates([]);
  };

  const handleSubmit = () => {
    if (isEditMode === "edit") {
      updateAvailability();
    } else if (isEditMode === "create") {
      createAvailability();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col">
      <div className="mb-6">
        {/* <div className="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "calendar"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            My Availability Calendar
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "bookings"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            My Bookings
          </button>
        </div> */}
      </div>

      {isBookEDPMode && (
        <div className="mb-4 p-4 bg-purple-100 border-2 border-purple-400 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book EDP Mode Active
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Selected <strong>{selectedDates.length}</strong> available
                date(s) - Click on available dates in the calendar to
                select/deselect for EDP booking
              </p>
            </div>
          </div>
        </div>
      )}

      {isEditMode && (
        <div className="mb-4 p-4 bg-purple-100 border-2 border-purple-400 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {isEditMode === "edit"
                  ? "Edit Mode Active"
                  : "Create Mode Active"}
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Selected <strong>{selectedDates.length}</strong> date(s)
                {isEditMode === "edit" && (
                  <span className="ml-2">
                    (Uncheck dates to remove from availability)
                  </span>
                )}
                {isEditMode === "create" && (
                  <span className="ml-2">(Select new dates to add)</span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelEdit}
                className="bg-gradient-to-br from-gray-500 to-gray-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || selectedDates.length === 0}
                className={`${
                  isEditMode === "edit"
                    ? "bg-gradient-to-br from-green-500 to-green-600"
                    : "bg-gradient-to-br from-blue-500 to-blue-600"
                } text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {loading
                  ? isEditMode === "edit"
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode === "edit"
                  ? "Update Availability"
                  : "Create Availability"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "calendar" && !isEditMode && !isBookEDPMode && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex-1 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="text-sm text-amber-800">
              <strong>Note:</strong> Click "Edit Availability" to modify
              existing dates OR "Create Availability" to add new dates
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEditAvailabilityClick}
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Availability
            </button>

            <button
              onClick={handleCreateAvailabilityClick}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Availability
            </button>

            {/* <button
              onClick={handleBookEDPClick}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book EDP
            </button> */}
          </div>
        </div>
      )}

      <div className="flex-1">
        {activeTab === "calendar" ? (
          <>
            {/* Book EDP Form */}
            <BookEDP
              isOpen={isBookEDPOpen}
              onClose={handleCloseBookEDP}
              availabilities={availabilities}
              onSuccess={handleBookEDPSuccess}
              selectedAvailabilities={selectedDates
                .map((dateKey) => {
                  const availability = availabilities.find(
                    (av) => av.available_date === dateKey
                  );
                  return availability?.id;
                })
                .filter(Boolean)}
            />

            {/* Calendar */}
            <Calendar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              availabilities={availabilities}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              isEditMode={isEditMode}
              editingDates={editingDates}
              isBookEDPMode={isBookEDPMode}
            />
          </>
        ) : (
          <BookingsList bookings={bookings} setCurrentDate={setCurrentDate} />
        )}
      </div>

      <div className="mt-6 text-center py-4 text-sm text-slate-600">
        © {new Date().getFullYear()} Eduskills Foundation. All rights reserved.
      </div>
    </div>
  );
};

export default TrainerAvailabilityCalendar;
