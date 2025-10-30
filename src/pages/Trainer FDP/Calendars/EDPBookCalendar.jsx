import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../services/configUrls";
import Calendar from "./Calendar";
import BookEDP from "./BookEDP";
import EDPEvent from "./EDPEvent";
import Cookies from "js-cookie";

const EDPBookCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isBookEDPMode, setIsBookEDPMode] = useState(false);
  const [trainerId, setTrainerId] = useState(null);

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
    fetchBookings();
    fetchAvailabilities();
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

      // Set trainer_id from first booking and store in cookie
      if (response.data && response.data.length > 0) {
        const trainerIdFromBooking = response.data[0]?.trainer_id;
        setTrainerId(trainerIdFromBooking);
        Cookies.set("trainer_id", trainerIdFromBooking || "", { path: "/" });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings");
    }
  };

  const handleBookEDPClick = () => {
    const availableSlots = availabilities.filter(
      (item) => item.status_label === "Available"
    );

    if (availableSlots.length === 0) {
      alert(
        "No available dates found. Please contact admin to create availability first."
      );
      return;
    }

    // Check if trainer_id exists
    const currentTrainerId = trainerId || Cookies.get("trainer_id");
    if (!currentTrainerId) {
      alert("Trainer ID not found. Please try refreshing the page.");
      return;
    }

    setShowCalendar(true);
    setIsBookEDPMode(true);
    setSelectedDates([]);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
    setIsBookEDPMode(false);
    setSelectedDates([]);
  };

  const handleBookEDPSuccess = () => {
    fetchAvailabilities();
    fetchBookings();
    setShowCalendar(false);
    setIsBookEDPMode(false);
    setSelectedDates([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col">
      {/* <div className="mb-6">
        <div className="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
          <h1 className="px-6 py-3 text-2xl font-bold text-slate-800">
            EDP Booking Management
          </h1>
        </div>
      </div> */}

      {!showCalendar ? (
        // Show the bookings list - FULL WIDTH
        <div className="flex-1">
          <EDPEvent
            bookings={bookings}
            setCurrentDate={setCurrentDate}
            onBookEDPClick={handleBookEDPClick}
          />
        </div>
      ) : (
        // Show the calendar and booking form
        <div className="flex-1">
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
                    select/deselect
                    {selectedDates.length > 0 &&
                      ", then fill the form on the right"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseCalendar}
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
                    Cancel & Back to List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Layout - Calendar shrinks when form appears */}
          <div className="flex gap-6">
            {/* Calendar - Full width initially, then 70% when form appears */}
            <div
              className={`transition-all duration-700 ease-in-out ${
                selectedDates.length > 0 ? "w-full lg:w-[70%]" : "w-full"
              }`}
            >
              <Calendar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                availabilities={availabilities}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                isEditMode={false}
                editingDates={[]}
                isBookEDPMode={isBookEDPMode}
              />
            </div>

            {/* Book EDP Form - Slides in from right at 30% width */}
            <div
              className={`transition-all duration-700 ease-in-out ${
                selectedDates.length > 0
                  ? "w-[30%] opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-full overflow-hidden"
              }`}
            >
              {selectedDates.length > 0 && (
                <div className="sticky top-4">
                  <BookEDP
                    isOpen={true}
                    onClose={handleCloseCalendar}
                    availabilities={availabilities}
                    onSuccess={handleBookEDPSuccess}
                    trainerId={trainerId}
                    selectedDatesCount={selectedDates.length} // Pass the actual count
                    selectedAvailabilities={selectedDates
                      .map((dateKey) => {
                        const availability = availabilities.find(
                          (av) => av.available_date === dateKey
                        );
                        return availability?.id;
                      })
                      .filter(Boolean)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center py-4 text-sm text-slate-600">
        © {new Date().getFullYear()} Eduskills Foundation. All rights reserved.
      </div>
    </div>
  );
};

export default EDPBookCalendar;
