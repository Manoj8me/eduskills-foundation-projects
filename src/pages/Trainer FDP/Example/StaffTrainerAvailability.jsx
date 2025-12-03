import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";
import TrainerCalendarView from "./CalendarView";
import TrainerDashboard from "./TrainerDashboard";
import TrainerPendingApprovals from "./TrainerPendingApprovals"; // ✅ import new component

const StaffTrainerAvailability = () => {
  const [trainers, setTrainers] = useState([]);
  const [trainerSlots, setTrainerSlots] = useState([]);
  const [bookedDetails, setBookedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  const api = axios.create({
    baseURL: BASE_URL,
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
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    // Determine user role
    const authorise = localStorage.getItem("Authorise");
    setIsAdmin(authorise === "admin");
    setIsStaff(authorise === "staff");

    fetchAllTrainers();
  }, []);

  const fetchAllTrainers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BASE_URL}/event/all-trainers-availability`);
      const trainerData = response.data || [];
      setTrainers(trainerData);

      // ✅ Merge all trainer slots
      const mergedSlots = trainerData.flatMap((trainer) =>
        trainer.slots
          ? trainer.slots.map((slot) => ({
              ...slot,
              trainer_id: trainer.trainer_id,
              trainer_name: trainer.fullname,
            }))
          : []
      );
      setTrainerSlots(mergedSlots);

      // ✅ Fetch booked details
      const bookedRes = await api.get(`${BASE_URL}/event/trainer-booked-details`);
      const trainerwise = bookedRes.data.trainerwise_booked_details || [];

      const mergedBooked = trainerwise.flatMap((trainer) =>
        (trainer.events || []).map((event) => ({
          ...event,
          trainer_id: trainer.trainer_id,
          trainer_name: trainer.trainer_name,
        }))
      );

      setBookedDetails(mergedBooked);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      alert("Failed to fetch trainers availability");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchAllTrainers();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* === Header Section === */}
        <div className="bg-white rounded-xl shadow-lg px-6 pb-4 pt-2 mb-6">
          <div className="flex flex-wrap gap-4 border-b border-gray-200 mt-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === "dashboard"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("availability")}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === "availability"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Calendar
            </button>

            {/* Trainer Leave Calendar visible only for admin */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab("pendingApprovals")}
                className={`px-4 py-2 font-medium transition-all ${
                  activeTab === "pendingApprovals"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Trainer Leave Calendar
              </button>
            )}
          </div>
        </div>

        {/* === Tab Content === */}
        {!loading ? (
          <>
            {activeTab === "dashboard" && (
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <TrainerDashboard />
              </div>
            )}

            {activeTab === "availability" && (
              <TrainerCalendarView
                trainerSlots={trainerSlots}
                bookedDetails={bookedDetails}
                fetchAllTrainers={fetchAllTrainers}
                trainers={trainers}
              />
            )}

            {/* Trainer Leave Calendar content only for admin */}
            {isAdmin && activeTab === "pendingApprovals" && (
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                 <TrainerPendingApprovals refreshAvailability={fetchAllTrainers} /> 
              {/* 👆 this line added */}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-20 h-20 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">Loading trainers’ availability...</p>
          </div>
        )}

        {/* === Footer === */}
        <div className="mt-6 text-center py-4 text-sm text-slate-600">
          © {new Date().getFullYear()} Eduskills Foundation. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default StaffTrainerAvailability;
