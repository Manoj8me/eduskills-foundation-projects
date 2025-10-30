import React from "react";

const Calendar = ({
  currentDate,
  setCurrentDate,
  availabilities,
  selectedDates,
  setSelectedDates,
  isEditMode = false,
  editingDates = [],
  isBookEDPMode = false,
}) => {
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

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

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

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isSunday = (date) => {
    return date.getDay() === 0;
  };

  const getDateAvailability = (date) => {
    const dateKey = formatDateKey(date);
    return availabilities.find((item) => item.available_date === dateKey);
  };

  const isDateSelected = (date) => {
    const dateKey = formatDateKey(date);
    return selectedDates.includes(dateKey);
  };

  const isExistingAvailableDate = (date) => {
    const dateKey = formatDateKey(date);
    return editingDates.includes(dateKey);
  };

  const handleDateClick = (date, availability) => {
    // Book EDP Mode: Only allow selecting available dates
    if (isBookEDPMode) {
      if (isPastDate(date)) {
        return;
      }

      if (!availability || availability.status_label !== "Available") {
        alert(
          "You can only select dates with 'Available' status for EDP booking."
        );
        return;
      }

      const dateKey = formatDateKey(date);
      const isSelected = isDateSelected(date);

      // Toggle selection
      if (isSelected) {
        setSelectedDates((prev) => prev.filter((d) => d !== dateKey));
      } else {
        setSelectedDates((prev) => [...prev, dateKey]);
      }
      return;
    }

    // Original Edit/Create Mode logic
    if (!isEditMode) {
      alert(
        "Please click 'Edit Availability' or 'Create Availability' button first."
      );
      return;
    }

    if (isPastDate(date)) {
      return;
    }

    if (isSunday(date)) {
      alert("Sundays cannot be selected as they are OFF days.");
      return;
    }

    const dateKey = formatDateKey(date);
    const isExisting = isExistingAvailableDate(date);
    const isSelected = isDateSelected(date);

    // EDIT MODE: Only allow toggling existing available dates
    if (isEditMode === "edit") {
      if (!isExisting) {
        alert(
          "In Edit Mode, you can only modify existing available dates. Use 'Create Availability' to add new dates."
        );
        return;
      }

      // Toggle selection for existing dates
      if (isSelected) {
        setSelectedDates((prev) => prev.filter((d) => d !== dateKey));
      } else {
        setSelectedDates((prev) => [...prev, dateKey]);
      }
      return;
    }

    // CREATE MODE: Only allow selecting new dates (not existing ones)
    if (isEditMode === "create") {
      // Check if date already has any availability status
      if (availability) {
        alert(
          `This date is already marked as '${availability.status_label}'. You can only select new dates in Create Mode.`
        );
        return;
      }

      // Check if it's an existing available date
      if (isExisting) {
        alert(
          "This date already exists in your availability. You can only select new dates in Create Mode."
        );
        return;
      }

      // Toggle selection for new dates only
      if (isSelected) {
        setSelectedDates((prev) => prev.filter((d) => d !== dateKey));
      } else {
        setSelectedDates((prev) => [...prev, dateKey]);
      }
      return;
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* {!isEditMode && !isBookEDPMode && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Click "Edit Availability" to modify
            existing dates OR "Create Availability" to add new dates OR "Book
            EDP" to book available dates. Sundays are automatically marked as
            OFF and cannot be selected.
          </p>
        </div>
      )} */}

      {isBookEDPMode && (
        <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-800">
            <strong>Book EDP Mode:</strong> Click on available dates (shown in
            green) to select them for EDP booking. Fill the form on the right
            panel to complete the booking.
          </p>
        </div>
      )}

      {isEditMode === "edit" && (
        <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-800">
            <strong>Edit Mode:</strong> All existing available dates are checked
            by default. Uncheck the dates you want to remove from your
            availability. You cannot select new dates in this mode.
          </p>
        </div>
      )}

      {isEditMode === "create" && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>Create Mode:</strong> Select only new dates to add to your
            availability. You cannot select dates that already have any status
            (Available, Booked, or Pending).
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-6 h-6 text-gray-600"
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
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((dayObj, index) => {
          const availability = getDateAvailability(dayObj.date);
          const selected = isDateSelected(dayObj.date);
          const past = isPastDate(dayObj.date);
          const today = isToday(dayObj.date);
          const sunday = isSunday(dayObj.date);
          const isExisting = isExistingAvailableDate(dayObj.date);

          let cellClasses = "relative h-20 rounded-lg p-2 transition-all ";
          let textClasses = "text-sm font-medium ";

          if (!dayObj.isCurrentMonth) {
            cellClasses += "bg-gray-50 text-gray-300 ";
          }

          if (past && dayObj.isCurrentMonth) {
            cellClasses += "bg-gray-100 cursor-not-allowed ";
            textClasses += "text-gray-400 ";
          } else if (sunday && dayObj.isCurrentMonth && !past) {
            cellClasses +=
              "bg-orange-50 cursor-not-allowed border border-orange-200 ";
            textClasses += "text-orange-600 ";
          } else if (availability && dayObj.isCurrentMonth) {
            if (availability.status_label === "Booked") {
              cellClasses += "bg-red-100 border-2 border-red-300 ";
              textClasses += "text-red-700 ";
            } else if (availability.status_label === "Pending") {
              cellClasses += "bg-yellow-100 border-2 border-yellow-300 ";
              textClasses += "text-yellow-700 ";
            } else {
              cellClasses += "bg-green-100 border-2 border-green-300 ";
              textClasses += "text-green-700 ";
            }

            // In edit mode, only existing available dates are clickable
            if (
              isEditMode === "edit" &&
              availability.status_label === "Available"
            ) {
              cellClasses += "cursor-pointer hover:bg-green-200 ";
            }

            // In create mode, existing dates are not clickable
            if (isEditMode === "create") {
              cellClasses += "cursor-not-allowed opacity-60 ";
            }

            // In Book EDP mode, available dates are clickable
            if (isBookEDPMode && availability.status_label === "Available") {
              cellClasses += "cursor-pointer hover:bg-green-200 ";
            }

            if (selected && (isEditMode || isBookEDPMode)) {
              cellClasses += "ring-4 ring-blue-400 ";
            }

            if (isEditMode === "edit" && isExisting && !selected) {
              cellClasses += "ring-4 ring-red-400 opacity-60 ";
            }
          } else if (selected && dayObj.isCurrentMonth) {
            cellClasses +=
              "bg-blue-500 text-white cursor-pointer hover:bg-blue-600 ";
            textClasses += "text-white ";
          } else if (dayObj.isCurrentMonth && !past) {
            if (isEditMode === "create") {
              // In create mode, only new dates (without availability) are clickable
              cellClasses +=
                "bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 ";
            } else if (isEditMode === "edit") {
              // In edit mode, new dates are not clickable
              cellClasses +=
                "bg-white border border-gray-200 cursor-not-allowed opacity-50 ";
            } else if (isBookEDPMode) {
              // In Book EDP mode, only available dates are clickable
              cellClasses +=
                "bg-white border border-gray-200 cursor-not-allowed opacity-50 ";
            } else {
              cellClasses += "bg-white border border-gray-200 ";
            }
            textClasses += "text-gray-700 ";
          }

          if (today && dayObj.isCurrentMonth) {
            textClasses += "font-bold ";
          }

          return (
            <div
              key={index}
              className={cellClasses}
              onClick={() =>
                !past &&
                !sunday &&
                dayObj.isCurrentMonth &&
                handleDateClick(dayObj.date, availability)
              }
            >
              <div className={textClasses}>{dayObj.day}</div>

              {selected &&
                (isEditMode || isBookEDPMode) &&
                dayObj.isCurrentMonth && (
                  <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

              {availability && dayObj.isCurrentMonth && !past && !sunday && (
                <div className="absolute bottom-1 left-1 right-1">
                  {availability.status_label === "Booked" && (
                    <span className="text-xs bg-red-200 text-red-800 px-1 py-0.5 rounded block text-center">
                      Booked
                    </span>
                  )}
                  {availability.status_label === "Pending" && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded block text-center">
                      Pending
                    </span>
                  )}
                  {availability.status_label === "Available" && (
                    <span className="text-xs bg-green-200 text-green-800 px-1 py-0.5 rounded block text-center">
                      Available
                    </span>
                  )}
                </div>
              )}

              {sunday && dayObj.isCurrentMonth && !past && (
                <div className="absolute bottom-1 left-1 right-1">
                  <span className="text-xs bg-orange-200 text-orange-800 px-1 py-0.5 rounded block text-center">
                    OFF
                  </span>
                </div>
              )}

              {today && dayObj.isCurrentMonth && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded mr-2"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded mr-2"></div>
            <span>Sunday (OFF)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
