import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

const BookingModal = ({
  isOpen,
  onClose,
  selectedSlot,
  availableTrainers,
  bookingStartDate,
  bookingEndDate,
  onBookingSubmit,
  loading,
  editingBooking,
}) => {
  const [selectedTrainerForBooking, setSelectedTrainerForBooking] =
    useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [studentLimit, setStudentLimit] = useState("");
  const [domainsInstitutes, setDomainsInstitutes] = useState({
    domains: [],
    institutes: [],
  });
  const [localStartDate, setLocalStartDate] = useState(bookingStartDate);
  const [localEndDate, setLocalEndDate] = useState(bookingEndDate);

  const eventTypes = [
    { value: "tech_camp", label: "Tech Camp" },
    { value: "fdp", label: "FDP" },
    { value: "edp", label: "EDP" },
  ];

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    setLocalStartDate(bookingStartDate);
    setLocalEndDate(bookingEndDate);

    if (editingBooking) {
      setSelectedTrainerForBooking(selectedSlot?.trainer_id || "");
      setSelectedDomain(editingBooking.domain_id?.toString() || "");
      setSelectedInstitute(editingBooking.institute_id?.toString() || "");
      setSelectedEventType(editingBooking.event_type || "");
      setStudentLimit(
        (
          editingBooking.student_limit || editingBooking.students_limit
        )?.toString() || ""
      );
    } else if (availableTrainers.length === 1) {
      setSelectedTrainerForBooking(availableTrainers[0].trainer_id);
    } else {
      setSelectedTrainerForBooking("");
    }
  }, [
    bookingStartDate,
    bookingEndDate,
    availableTrainers,
    editingBooking,
    selectedSlot,
  ]);

  const fetchDomainsInstitutes = async (trainerId) => {
    try {
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

      const response = await api.get(
        `${BASE_URL}/event/domains-institutes/${trainerId}`
      );
      setDomainsInstitutes({
        domains: response.data.domains || [],
        institutes: response.data.institutes || [],
      });
    } catch (error) {
      console.error("Error fetching domains and institutes:", error);
      setDomainsInstitutes({
        domains: [],
        institutes: [],
      });
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Invalid Date";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = date.getMonth();
    if (monthIndex < 0 || monthIndex >= monthNames.length)
      return "Invalid Date";
    return `${date.getDate()} ${monthNames[monthIndex].slice(
      0,
      3
    )} ${date.getFullYear()}`;
  };

  const handleTrainerSelection = (trainerId) => {
    setSelectedTrainerForBooking(trainerId);
    fetchDomainsInstitutes(trainerId);
  };

  const validateBookingRange = () => {
    if (!localStartDate || !localEndDate) {
      alert("Please select both start and end dates");
      return false;
    }

    // Check if dates are in the past
    const today = getTodayDate();
    if (localStartDate < today) {
      alert("Start date cannot be in the past");
      return false;
    }

    if (
      !editingBooking &&
      availableTrainers.length > 1 &&
      !selectedTrainerForBooking
    ) {
      alert("Please select a trainer from the available options");
      return false;
    }

    const startDate = new Date(localStartDate);
    const endDate = new Date(localEndDate);

    if (endDate < startDate) {
      alert("End date must be after or equal to start date");
      return false;
    }

    if (!selectedDomain || !selectedInstitute || !selectedEventType) {
      alert("Please select domain, institute, and event type");
      return false;
    }

    if (!studentLimit || parseInt(studentLimit) <= 0) {
      alert("Please enter a valid student limit (must be greater than 0)");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateBookingRange()) {
      const bookingData = {
        slot_id: selectedSlot?.slot_id,
        trainer_id: selectedTrainerForBooking || selectedSlot?.trainer_id,
        domain_id: parseInt(selectedDomain),
        institute_id: parseInt(selectedInstitute),
        start_date: localStartDate,
        end_date: localEndDate,
        event_type: selectedEventType,
        students_limit: parseInt(studentLimit),
      };

      if (editingBooking) {
        const editData = {};

        if (bookingData.slot_id !== editingBooking.slot_id) {
          editData.slot_id = bookingData.slot_id;
        }
        if (bookingData.trainer_id !== editingBooking.trainer_id) {
          editData.trainer_id = bookingData.trainer_id;
        }
        if (bookingData.domain_id !== editingBooking.domain_id) {
          editData.domain_id = bookingData.domain_id;
        }
        if (bookingData.institute_id !== editingBooking.institute_id) {
          editData.institute_id = bookingData.institute_id;
        }
        if (bookingData.start_date !== editingBooking.start_date) {
          editData.start_date = bookingData.start_date;
        }
        if (bookingData.end_date !== editingBooking.end_date) {
          editData.end_date = bookingData.end_date;
        }
        if (bookingData.event_type !== editingBooking.event_type) {
          editData.event_type = bookingData.event_type;
        }
        const existingStudentLimit = editingBooking.students_limit;
        if (
          parseInt(bookingData.students_limit) !==
          parseInt(existingStudentLimit)
        ) {
          editData.students_limit = bookingData.students_limit;
        }

        onBookingSubmit({
          ...bookingData,
          ...editData,
        });
      } else {
        onBookingSubmit(bookingData);
      }
    }
  };

  const handleClose = () => {
    setSelectedTrainerForBooking("");
    setSelectedDomain("");
    setSelectedInstitute("");
    setSelectedEventType("");
    setStudentLimit("");
    setDomainsInstitutes({ domains: [], institutes: [] });
    setLocalStartDate("");
    setLocalEndDate("");
    onClose();
  };

  useEffect(() => {
    if (selectedTrainerForBooking || editingBooking) {
      fetchDomainsInstitutes(
        selectedTrainerForBooking || selectedSlot?.trainer_id
      );
    }
  }, [selectedTrainerForBooking, editingBooking, selectedSlot]);

  if (!isOpen || !selectedSlot) return null;

  const isEditMode = !!editingBooking;
  const todayDate = getTodayDate();
  const minStartDate =
    selectedSlot.from_date > todayDate ? selectedSlot.from_date : todayDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-[700px] max-w-[95vw] max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Edit Booking" : "Book Slot"}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-scroll p-6">
          <div className="space-y-4">
            {isEditMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">
                      Editing Existing Booking
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      You are currently editing an existing booking. Make your
                      changes below and click "Update Booking" to save.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isEditMode && availableTrainers.length > 1 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Multiple Trainers Available
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {availableTrainers.length} trainers are available for your
                      selected date range. Please choose one trainer to proceed
                      with the booking.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isEditMode && availableTrainers.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Trainer *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {availableTrainers.map((trainer) => (
                    <div
                      key={trainer.trainer_id}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTrainerForBooking === trainer.trainer_id
                          ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      onClick={() => handleTrainerSelection(trainer.trainer_id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedTrainerForBooking === trainer.trainer_id
                                ? "border-blue-500 bg-blue-500"
                                : "border-slate-300 hover:border-slate-400"
                            }`}
                          >
                            {selectedTrainerForBooking ===
                              trainer.trainer_id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900 truncate">
                              {trainer.fullname}
                            </h4>
                            {selectedTrainerForBooking ===
                              trainer.trainer_id && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Selected
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                />
                              </svg>
                              <span className="truncate">{trainer.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span>{trainer.mobile_number}</span>
                            </div>
                          </div>
                        </div>

                        {selectedTrainerForBooking === trainer.trainer_id && (
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {((!isEditMode && availableTrainers.length === 1) ||
              isEditMode) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  {isEditMode ? "Trainer" : "Selected Trainer"}
                </h4>
                <div className="text-sm text-green-700">
                  <div>
                    <strong>Name:</strong> {selectedSlot.fullname}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedSlot.email}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {selectedSlot.mobile_number}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={localStartDate}
                  min={minStartDate}
                  max={selectedSlot.to_date}
                  onChange={(e) => setLocalStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Cannot select past dates
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={localEndDate}
                  min={localStartDate || minStartDate}
                  max={selectedSlot.to_date}
                  onChange={(e) => setLocalEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Event Type *
              </label>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Event Type</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType.value} value={eventType.value}>
                    {eventType.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Student Limit *
              </label>
              <input
                type="number"
                value={studentLimit}
                onChange={(e) => setStudentLimit(e.target.value)}
                placeholder="Enter maximum number of students"
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Maximum number of students that can participate in this event
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Domain *
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={
                  !isEditMode &&
                  !selectedTrainerForBooking &&
                  availableTrainers.length > 1
                }
              >
                <option value="">Select Domain</option>
                {domainsInstitutes.domains?.map((domain) => (
                  <option key={domain.domain_id} value={domain.domain_id}>
                    {domain.domain_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Institute *
              </label>
              <select
                value={selectedInstitute}
                onChange={(e) => setSelectedInstitute(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={
                  !isEditMode &&
                  !selectedTrainerForBooking &&
                  availableTrainers.length > 1
                }
              >
                <option value="">Select Institute</option>
                {domainsInstitutes.institutes?.map((institute) => (
                  <option
                    key={institute.institute_id}
                    value={institute.institute_id}
                  >
                    {institute.institute_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                {isEditMode ? "Updated Booking Summary" : "Booking Summary"}
              </h4>
              <div className="text-sm text-slate-600 space-y-1">
                <div>
                  <strong>Booking Period:</strong>{" "}
                  {formatDateDisplay(localStartDate)} to{" "}
                  {formatDateDisplay(localEndDate)}
                </div>
                <div>
                  <strong>Trainer:</strong> {selectedSlot.fullname}
                </div>
                {selectedEventType && (
                  <div>
                    <strong>Event Type:</strong>{" "}
                    {
                      eventTypes.find((et) => et.value === selectedEventType)
                        ?.label
                    }
                  </div>
                )}
                {studentLimit && (
                  <div>
                    <strong>Student Limit:</strong> {studentLimit} students
                  </div>
                )}
              </div>
            </div>

            {!isEditMode &&
              selectedSlot.booked_details &&
              selectedSlot.booked_details.length > 0 && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">
                    Existing Bookings (avoid these dates):
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedSlot.booked_details.map((booking, index) => (
                      <div key={index} className="text-xs text-orange-700">
                        {formatDateDisplay(booking.start_date)} to{" "}
                        {formatDateDisplay(booking.end_date)} -{" "}
                        {booking.institute_name} (
                        {booking.event_type
                          ? booking.event_type.replace("_", " ").toUpperCase()
                          : "N/A"}
                        )
                        {(booking.student_limit || booking.students_limit) && (
                          <span>
                            {" "}
                            - {booking.student_limit ||
                              booking.students_limit}{" "}
                            students
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !selectedDomain ||
                !selectedInstitute ||
                !selectedEventType ||
                !studentLimit ||
                !localStartDate ||
                !localEndDate ||
                (!isEditMode &&
                  availableTrainers.length > 1 &&
                  !selectedTrainerForBooking)
              }
              className="flex-1 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Booking..."
                : isEditMode
                ? "Update Booking"
                : "Book Slot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
