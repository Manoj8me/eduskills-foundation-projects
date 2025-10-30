import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../services/configUrls";

// Import the three components
import TrainerSlotsList from "./TrainerSlotsList";
import BookingModal from "./BookingModal";
import AvailabilityCalendar from "./CalendarView";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const AdminTrainerAvailabilityCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 9)); // September 9, 2025
  const [allTrainerSlots, setAllTrainerSlots] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Create axios instance with default config
  const api = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include auth token
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

  // Fetch all trainer slots on component mount
  useEffect(() => {
    fetchAllTrainerSlots();
  }, []);

  const fetchAllTrainerSlots = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/event/all-trainers-availability`
      );
      setAllTrainerSlots(response.data);
    } catch (error) {
      console.error("Error fetching trainer slots:", error);
      alert("Failed to fetch trainer availability");
    }
  };

  const bookSlot = async (bookingData) => {
    try {
      setLoading(true);

      if (editingBooking) {
        // Update existing booking
        await api.put(`${BASE_URL}/event/book-slot/edit`, {
          bookslot_id: editingBooking.bookslot_id,
          slot_id: bookingData.slot_id || null,
          trainer_id: bookingData.trainer_id || null,
          domain_id: bookingData.domain_id || null,
          institute_id: bookingData.institute_id || null,
          start_date: bookingData.start_date || null,
          end_date: bookingData.end_date || null,
          event_type: bookingData.event_type || null,
          students_limit: bookingData.students_limit || null,
        });
        alert("Booking updated successfully!");
      } else {
        // Create new booking
        await api.post(`${BASE_URL}/event/book-slot`, bookingData);
        alert("Slot booked successfully!");
      }

      await fetchAllTrainerSlots();
      setShowBookingModal(false);
      resetBookingForm();
    } catch (error) {
      console.error("Error booking slot:", error);
      const errorMessage =
        error.response?.data?.detail ||
        `Failed to ${editingBooking ? "update" : "book"} slot`;
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookslotId) => {
    try {
      setLoading(true);
      await api.delete(`${BASE_URL}/event/book-slot/${bookslotId}`);
      await fetchAllTrainerSlots();
      setShowDeleteModal(false);
      setBookingToDelete(null);
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to delete booking";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setSelectedSlot(null);
    setAvailableTrainers([]);
    setBookingStartDate("");
    setBookingEndDate("");
    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
    setEditingBooking(null);
  };

  const navigateToSlotMonth = (slotDate) => {
    const date = new Date(slotDate);
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  // Handle date range selection from calendar
  const handleDateRangeSelect = ({ startDate, endDate, availableTrainers }) => {
    setAvailableTrainers(availableTrainers);
    setBookingStartDate(startDate);
    setBookingEndDate(endDate);

    // If only one trainer available, auto-select
    if (availableTrainers.length === 1) {
      setSelectedSlot(availableTrainers[0].slot);
    } else {
      // Multiple trainers available, set first as default
      setSelectedSlot(availableTrainers[0].slot);
    }

    setShowBookingModal(true);
  };

  // Handle book slot from slots list
  const handleBookSlot = (slot) => {
    setEditingBooking(null);
    setSelectedSlot(slot);
    setAvailableTrainers([
      {
        trainer_id: slot.trainer_id,
        fullname: slot.fullname,
        email: slot.email,
        mobile_number: slot.mobile_number,
        slot: slot,
      },
    ]);
    setBookingStartDate(slot.from_date);
    setBookingEndDate(slot.to_date);
    setShowBookingModal(true);
  };

  // Handle edit booking
  const handleEditBooking = (booking, slot) => {
    setEditingBooking(booking);
    setSelectedSlot(slot);
    setAvailableTrainers([
      {
        trainer_id: slot.trainer_id,
        fullname: slot.fullname,
        email: slot.email,
        mobile_number: slot.mobile_number,
        slot: slot,
      },
    ]);
    setBookingStartDate(booking.start_date);
    setBookingEndDate(booking.end_date);
    setShowBookingModal(true);
  };

  // Handle delete booking
  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const handleBookingSubmit = (bookingData) => {
    bookSlot(bookingData);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    resetBookingForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBookingToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete) {
      deleteBooking(bookingToDelete.bookslot_id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white px-6 py-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="bg-gradient-to-br from-gray-500 to-gray-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-500/30 flex items-center gap-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800">
            Trainer Availability Management
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] flex-1">
        {/* Calendar Component */}
        <AvailabilityCalendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          allTrainerSlots={allTrainerSlots}
          onDateRangeSelect={handleDateRangeSelect}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dragStart={dragStart}
          setDragStart={setDragStart}
          dragEnd={dragEnd}
          setDragEnd={setDragEnd}
        />

        {/* Slots List Component */}
        <TrainerSlotsList
          allTrainerSlots={allTrainerSlots}
          onBookSlot={handleBookSlot}
          onNavigateToSlotMonth={navigateToSlotMonth}
          onEditBooking={handleEditBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      </div>

      {/* Booking Modal Component */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={handleCloseModal}
        selectedSlot={selectedSlot}
        availableTrainers={availableTrainers}
        bookingStartDate={bookingStartDate}
        bookingEndDate={bookingEndDate}
        onBookingSubmit={handleBookingSubmit}
        loading={loading}
        editingBooking={editingBooking}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        booking={bookingToDelete}
        loading={loading}
      />

      {/* Copyright Footer */}
      <div className="mt-6 text-center py-4 text-sm text-slate-600">
        © {new Date().getFullYear()} EduSkills Foundation. All rights
        reserved.
      </div>
    </div>
  );
};

export default AdminTrainerAvailabilityCalendar;
