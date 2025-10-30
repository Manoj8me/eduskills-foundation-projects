import React, { useState } from "react";
import TrainerDetailsModal from "./TrainerDetailsModal";

const AvailabilityCalendar = ({
  currentDate,
  setCurrentDate,
  allTrainerSlots,
  onDateRangeSelect,
}) => {
  const [showTrainerDetails, setShowTrainerDetails] = useState(false);
  const [selectedDateTrainers, setSelectedDateTrainers] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);

  // Check if user is staff
  const userRole = localStorage.getItem("Authorise");
  const isStaff = userRole === "staff";

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

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Get trainers available on a specific date
  const getTrainersForDate = (date) => {
    const dateKey = formatDateKey(date);
    const checkDate = new Date(dateKey);
    checkDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trainersInfo = [];

    for (const slot of allTrainerSlots) {
      const slotStart = new Date(slot.from_date);
      slotStart.setHours(0, 0, 0, 0);

      const slotEnd = new Date(slot.to_date);
      slotEnd.setHours(23, 59, 59, 999); // Set to end of day to include the end date

      // Check if date is within slot range (inclusive of both start and end dates)
      if (checkDate >= slotStart && checkDate <= slotEnd) {
        // Check if there's an active booking on this date
        let hasActiveBooking = false;

        if (slot.booked_details && Array.isArray(slot.booked_details)) {
          for (const booking of slot.booked_details) {
            const bookingStart = new Date(booking.start_date);
            bookingStart.setHours(0, 0, 0, 0);

            const bookingEnd = new Date(booking.end_date);
            bookingEnd.setHours(23, 59, 59, 999); // Set to end of day

            // If date is within booking range AND booking hasn't ended yet
            if (
              checkDate >= bookingStart &&
              checkDate <= bookingEnd &&
              bookingEnd >= today
            ) {
              hasActiveBooking = true;
              break;
            }
          }
        }

        // Add all trainers whose slot includes this date (both ended and available)
        // This allows users to see all trainers, with ended ones marked
        if (!hasActiveBooking) {
          trainersInfo.push(slot);
        }
      }
    }

    return trainersInfo;
  };

  // Check if a specific date falls within any active (not ended) booking's date range
  const isDateActivelyBooked = (date) => {
    const dateKey = formatDateKey(date);
    const checkDate = new Date(dateKey);
    checkDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const slot of allTrainerSlots) {
      if (slot.booked_details && Array.isArray(slot.booked_details)) {
        for (const booking of slot.booked_details) {
          const bookingStart = new Date(booking.start_date);
          bookingStart.setHours(0, 0, 0, 0);

          const bookingEnd = new Date(booking.end_date);
          bookingEnd.setHours(23, 59, 59, 999);

          if (
            checkDate >= bookingStart &&
            checkDate <= bookingEnd &&
            bookingEnd >= today
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Check if a specific date falls within any booking's date range (including ended ones)
  const isDateBooked = (date) => {
    const dateKey = formatDateKey(date);
    const checkDate = new Date(dateKey);
    checkDate.setHours(0, 0, 0, 0);

    for (const slot of allTrainerSlots) {
      if (slot.booked_details && Array.isArray(slot.booked_details)) {
        for (const booking of slot.booked_details) {
          const bookingStart = new Date(booking.start_date);
          bookingStart.setHours(0, 0, 0, 0);

          const bookingEnd = new Date(booking.end_date);
          bookingEnd.setHours(23, 59, 59, 999);

          if (checkDate >= bookingStart && checkDate <= bookingEnd) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Check if a specific date falls within any slot's availability range
  const isDateInSlotRange = (date) => {
    const dateKey = formatDateKey(date);
    const checkDate = new Date(dateKey);
    checkDate.setHours(0, 0, 0, 0);

    for (const slot of allTrainerSlots) {
      const slotStart = new Date(slot.from_date);
      slotStart.setHours(0, 0, 0, 0);

      const slotEnd = new Date(slot.to_date);
      slotEnd.setHours(23, 59, 59, 999);

      if (checkDate >= slotStart && checkDate <= slotEnd) {
        return true;
      }
    }
    return false;
  };

  // Handle date click
  const handleDateClick = (date, statusIndicator) => {
    if (!date.isCurrentMonth) return;

    // Show details for available and ended dates
    if (statusIndicator === "Available" || statusIndicator === "Ended") {
      const trainers = getTrainersForDate(date.date);
      setSelectedDateTrainers(trainers);
      setClickedDate(date.date);
      setShowTrainerDetails(true);
    }
  };

  // Get statistics
  const availableSlots = allTrainerSlots.filter(
    (slot) => slot.status_code === 0
  ).length;
  const bookedSlots = allTrainerSlots.filter(
    (slot) => slot.status_code === 1
  ).length;

  // Get unique trainers
  const uniqueTrainers = [
    ...new Map(
      allTrainerSlots.map((slot) => [
        slot.trainer_id,
        { id: slot.trainer_id, name: slot.fullname },
      ])
    ).values(),
  ];

  const days = getDaysInMonth(currentDate);

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 shadow-md shadow-indigo-500/30 hover:-translate-y-0.5"
            onClick={() => navigateMonth(-1)}
          >
            ‹ Previous
          </button>

          <h2 className="text-3xl font-bold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <div className="flex items-center gap-3">
            <button
              className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 shadow-md shadow-indigo-500/30 hover:-translate-y-0.5"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </button>
            <button
              className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 shadow-md shadow-indigo-500/30 hover:-translate-y-0.5"
              onClick={() => navigateMonth(1)}
            >
              Next ›
            </button>
          </div>
        </div>

        {/* Instruction note */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong>{" "}
            {isStaff
              ? "Click on green (Available) or orange (Ended) dates to view trainer details. Staff members can book slots when no active bookings exist or when all bookings have ended."
              : "Click on green (Available) or orange (Ended) dates to view trainer details and availability. Green dates are available, orange dates have ended bookings, red dates have active bookings."}
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 mb-4">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="py-3 px-2 text-center font-semibold text-slate-500 text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden flex-1">
          {days.map((day, index) => {
            let backgroundClass = "bg-white";
            let statusIndicator = null;
            let isClickable = false;

            const isSunday = day.date.getDay() === 0;

            if (isSunday && day.isCurrentMonth) {
              backgroundClass = "bg-gray-200";
              statusIndicator = "Sunday Off";
            } else if (day.isCurrentMonth) {
              const isActivelyBooked = isDateActivelyBooked(day.date);
              const isBookedButEnded =
                !isActivelyBooked && isDateBooked(day.date);
              const isInSlotRange = isDateInSlotRange(day.date);

              if (isActivelyBooked) {
                backgroundClass = "bg-red-100";
                statusIndicator = "Booked";
              } else if (isBookedButEnded && isStaff) {
                backgroundClass = "bg-orange-100 hover:bg-orange-200";
                statusIndicator = "Ended";
                isClickable = true;
              } else if (isInSlotRange) {
                if (isStaff && isBookedButEnded) {
                  backgroundClass = "bg-green-100 hover:bg-green-200";
                  statusIndicator = "Available";
                  isClickable = true;
                } else if (!isStaff || !isBookedButEnded) {
                  backgroundClass = "bg-green-100 hover:bg-green-200";
                  statusIndicator = "Available";
                  isClickable = true;
                }
              }
            } else if (!day.isCurrentMonth) {
              backgroundClass = "bg-slate-50 opacity-60";
            }

            return (
              <div
                key={index}
                className={`${backgroundClass} p-3 min-h-[80px] transition-all duration-200 relative flex flex-col items-center justify-center ${
                  isClickable ? "cursor-pointer hover:shadow-md" : ""
                }`}
                onClick={() =>
                  isClickable && handleDateClick(day, statusIndicator)
                }
              >
                <div
                  className={`text-sm font-medium relative z-20 ${
                    isToday(day.date)
                      ? "text-blue-600 font-bold bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center"
                      : statusIndicator
                      ? "text-slate-800 font-semibold"
                      : day.isCurrentMonth
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {day.day}
                </div>

                {statusIndicator && day.isCurrentMonth && (
                  <div
                    className={`text-xs font-bold mt-1 relative z-20 px-1 py-0.5 rounded-full ${
                      statusIndicator === "Available"
                        ? "bg-green-600 text-white"
                        : statusIndicator === "Sunday Off"
                        ? "bg-gray-600 text-white"
                        : statusIndicator === "Ended"
                        ? "bg-orange-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {statusIndicator}
                  </div>
                )}

                {isClickable && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-5 z-10">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {availableSlots}
            </div>
            <div className="text-sm text-green-600 font-medium">
              Available Slots
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{bookedSlots}</div>
            <div className="text-sm text-red-600 font-medium">Booked Slots</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {uniqueTrainers.length}
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Active Trainers
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Details Modal */}
      <TrainerDetailsModal
        isOpen={showTrainerDetails}
        onClose={() => setShowTrainerDetails(false)}
        trainersForDate={selectedDateTrainers}
        selectedDate={clickedDate}
      />
    </>
  );
};

export default AvailabilityCalendar;
