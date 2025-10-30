import React, { useState, useEffect } from "react";
import { X, Check, Edit2 } from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";



const TrainerCalendarView = ({
  trainerSlots,
  bookedDetails,
  trainerId,
  onBookingSuccess,
  fetchAllTrainers,
  fetchTrainerBookings,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [approvalMode, setApprovalMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [pendingDates, setPendingDates] = useState([]);
  const [states, setStates] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [domains, setDomains] = useState([]);
  const [formData, setFormData] = useState({
    state: "",
    institute: "",
    domain: "",
    studentLimit: "",
    eventType: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookedDateRanges, setBookedDateRanges] = useState([]);

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

  const eventTypes = [
    {
      value: "tech_camp",
      label: "Tech Camp",
      consecutiveDays: 3,
      limitLabel: "Student Limit",
    },
    {
      value: "fdp",
      label: "FDP",
      consecutiveDays: 6,
      limitLabel: "Faculty Limit",
    },
    {
      value: "edp",
      label: "EDP",
      consecutiveDays: null,
      limitLabel: "Educator Limit",
    },
  ];

  useEffect(() => {
    const authorise = localStorage.getItem("Authorise");
    setIsAdmin(authorise === "admin");
  }, []);

  useEffect(() => {
    if (bookedDetails && bookedDetails.length > 0) {
      const ranges = bookedDetails.map((booking) => ({
        bookslot_id: booking.bookslot_id,
        start_date: booking.start_date,
        end_date: booking.end_date,
        domain_id: booking.domain_id,
        institute_id: booking.institute_id,
        event_type: booking.event_type,
        students_limit: booking.students_limit,
        domain_name: booking.domain_name,
        institute_name: booking.institute_name,
      }));
      setBookedDateRanges(ranges);
    }
  }, [bookedDetails]);

  const getLimitLabel = () => {
    if (!formData.eventType) return "Limit";
    const eventType = eventTypes.find((et) => et.value === formData.eventType);
    return eventType?.limitLabel || "Limit";
  };

  const getLimitPlaceholder = () => {
    if (!formData.eventType) return "Enter limit";
    const eventType = eventTypes.find((et) => et.value === formData.eventType);
    const label = eventType?.limitLabel?.toLowerCase() || "limit";
    return `Enter ${label}`;
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${BASE_URL}/event/domains-institutes/${trainerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch domains and institutes");
        }

        const data = await response.json();
        setDomains(data.domains || []);
        setInstitutes(data.institutes || []);
        setStates(data.states || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        alert("Failed to load domains and institutes");
      }
    };

    if ((bookingMode || editMode) && trainerId) {
      fetchDropdownData();
    }
  }, [bookingMode, editMode, trainerId]);

  useEffect(() => {
    if (formData.state) {
      const filtered = institutes.filter(
        (institute) => institute.state_id === parseInt(formData.state)
      );
      setFilteredInstitutes(filtered);
      if (formData.institute) {
        const selectedInstitute = filtered.find(
          (inst) => inst.institute_id === parseInt(formData.institute)
        );
        if (!selectedInstitute) {
          setFormData((prev) => ({ ...prev, institute: "" }));
        }
      }
    } else {
      setFilteredInstitutes([]);
      setFormData((prev) => ({ ...prev, institute: "" }));
    }
  }, [formData.state, institutes]);

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

  const getDateSlot = (date) => {
    const dateKey = formatDateKey(date);
    return trainerSlots.find((slot) => slot.available_date === dateKey);
  };

  const isDateInBookedRange = (date) => {
    const dateKey = formatDateKey(date);
    return bookedDateRanges.find((range) => {
      const startDate = new Date(range.start_date);
      const endDate = new Date(range.end_date);
      const checkDate = new Date(dateKey);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const getConsecutiveDates = (startDate, count) => {
    const dates = [];
    let currentDate = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < count) {
      if (!isSunday(currentDate)) {
        dates.push(new Date(currentDate));
        daysAdded++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const checkConsecutiveAvailability = (startDate, count) => {
    const consecutiveDates = getConsecutiveDates(startDate, count);

    for (const date of consecutiveDates) {
      const slot = getDateSlot(date);

      if (isSunday(date)) continue;

      if (!slot || slot.status_label !== "Available") {
        return { available: false, dates: consecutiveDates };
      }
    }

    return { available: true, dates: consecutiveDates };
  };

  const handleDateClick = (dayObj, slot) => {
    // Edit mode - toggle booked dates
    if (editMode && editingBooking) {
      const dateKey = formatDateKey(dayObj.date);
      const bookedRange = isDateInBookedRange(dayObj.date);

      if (
        !bookedRange ||
        bookedRange.bookslot_id !== editingBooking.bookslot_id
      ) {
        return;
      }

      const isSelected = selectedDates.some((d) => d.date === dateKey);

      if (isSelected) {
        setSelectedDates(selectedDates.filter((d) => d.date !== dateKey));
      } else {
        setSelectedDates([
          ...selectedDates,
          {
            date: dateKey,
            availability_id: slot?.availability_id,
          },
        ]);
      }
      return;
    }

    // Approval mode
    if (approvalMode) {
      if (
        !dayObj.isCurrentMonth ||
        isPastDate(dayObj.date) ||
        isSunday(dayObj.date)
      ) {
        return;
      }

      if (!slot || slot.status_label !== "Pending") {
        return;
      }

      const dateKey = formatDateKey(dayObj.date);
      const isPending = pendingDates.some((d) => d.date === dateKey);

      if (isPending) {
        setPendingDates(pendingDates.filter((d) => d.date !== dateKey));
      } else {
        setPendingDates([
          ...pendingDates,
          {
            date: dateKey,
            availability_id: slot.availability_id,
          },
        ]);
      }
      return;
    }

    // Booking mode
    if (!bookingMode) return;

    if (
      !dayObj.isCurrentMonth ||
      isPastDate(dayObj.date) ||
      isSunday(dayObj.date)
    ) {
      return;
    }

    if (!slot || slot.status_label !== "Available") {
      return;
    }

    if (!formData.eventType) {
      alert("Please select an event type from the booking form first");
      return;
    }

    const eventTypeConfig = eventTypes.find(
      (et) => et.value === formData.eventType
    );

    if (eventTypeConfig.consecutiveDays) {
      const { available, dates } = checkConsecutiveAvailability(
        dayObj.date,
        eventTypeConfig.consecutiveDays
      );

      if (!available) {
        alert(
          `Cannot select this date. ${eventTypeConfig.label} requires ${eventTypeConfig.consecutiveDays} consecutive available days (excluding Sundays).`
        );
        return;
      }

      const newSelectedDates = dates.map((date) => ({
        date: formatDateKey(date),
        availability_id: getDateSlot(date).availability_id,
      }));

      setSelectedDates(newSelectedDates);
    } else {
      const dateKey = formatDateKey(dayObj.date);
      const isSelected = selectedDates.some((d) => d.date === dateKey);

      if (isSelected) {
        setSelectedDates(selectedDates.filter((d) => d.date !== dateKey));
      } else {
        setSelectedDates([
          ...selectedDates,
          {
            date: dateKey,
            availability_id: slot.availability_id,
          },
        ]);
      }
    }
  };
console.log(selectedDates)
  const isDateSelected = (date) => {
    const dateKey = formatDateKey(date);
    return selectedDates.some((d) => d.date === dateKey);
  };

  const isDatePendingSelected = (date) => {
    const dateKey = formatDateKey(date);
    return pendingDates.some((d) => d.date === dateKey);
  };

  const isDateDisabled = (dayObj, slot) => {
    if (!bookingMode || !formData.eventType) return false;

    const eventTypeConfig = eventTypes.find(
      (et) => et.value === formData.eventType
    );

    if (!eventTypeConfig.consecutiveDays) return false;

    if (selectedDates.length > 0) {
      const dateKey = formatDateKey(dayObj.date);
      return !selectedDates.some((d) => d.date === dateKey);
    }

    return false;
  };

  const handleEditBookingClick = (booking) => {
    setEditMode(true);
    setBookingMode(false);
    setApprovalMode(false);
    setEditingBooking(booking);

    // Find the institute's state
    const institute = institutes.find(
      (inst) => inst.institute_id === booking.institute_id
    );

    setFormData({
      state: institute?.state_id?.toString() || "",
      institute: booking.institute_id?.toString() || "",
      domain: booking.domain_id?.toString() || "",
      studentLimit: booking.students_limit?.toString() || "",
      eventType: booking.event_type || "",
    });

    // Pre-select all dates in the booking range
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const dates = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (!isSunday(d)) {
        const slot = getDateSlot(d);
        dates.push({
          date: formatDateKey(d),
          availability_id: slot?.availability_id,
        });
      }
    }

    setSelectedDates(dates);
    setShowBookingForm(true);
  };

  const handleBookSlotClick = () => {
    setBookingMode(true);
    setApprovalMode(false);
    setEditMode(false);
    setSelectedDates([]);
    setPendingDates([]);
    setShowBookingForm(true);
    setEditingBooking(null);
  };

  const handleApprovalClick = () => {
    setApprovalMode(true);
    setBookingMode(false);
    setEditMode(false);
    setSelectedDates([]);
    setPendingDates([]);
    setShowBookingForm(false);
    setEditingBooking(null);
  };

  const handleCancelBooking = () => {
    setBookingMode(false);
    setEditMode(false);
    setSelectedDates([]);
    setShowBookingForm(false);
    setEditingBooking(null);
    setFormData({
      state: "",
      institute: "",
      domain: "",
      studentLimit: "",
      eventType: "",
    });
  };

  const handleCancelApproval = () => {
    setApprovalMode(false);
    setPendingDates([]);
  };

  const handleApproveReject = async (status) => {
    if (pendingDates.length === 0) {
      alert("Please select at least one pending date from the calendar");
      return;
    }

    const statusText = status === 1 ? "approve" : "reject";
    const confirmation = window.confirm(
      `Are you sure you want to ${statusText} ${pendingDates.length} date(s)?`
    );

    if (!confirmation) return;

    setLoading(true);
    try {
      const payload = {
        availability_ids: pendingDates.map((d) => d.availability_id),
        status: status,
      };

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/event/trainer-availability/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${statusText} dates`);
      }

      alert(data?.message || `Dates ${statusText}ed successfully!`);

      await fetchAllTrainers();
      await fetchTrainerBookings(trainerId);

      setApprovalMode(false);
      setPendingDates([]);
    } catch (error) {
      console.error(`Error ${statusText}ing dates:`, error);
      alert(
        error.message || `Failed to ${statusText} dates. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    if (field === "eventType" && value !== formData.eventType && !editMode) {
      setSelectedDates([]);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitBooking = async () => {
    if (!formData.eventType) {
      alert("Please select an event type");
      return;
    }

    if (
      !formData.state ||
      !formData.institute ||
      !formData.domain ||
      !formData.studentLimit
    ) {
      alert("All fields are required");
      return;
    }

    if (parseInt(formData.studentLimit) <= 0) {
      alert(`${getLimitLabel()} must be greater than 0`);
      return;
    }

    if (selectedDates.length === 0) {
      alert("Please select at least one date from the calendar");
      return;
    }

    const eventTypeConfig = eventTypes.find(
      (et) => et.value === formData.eventType
    );
    if (
      eventTypeConfig.consecutiveDays &&
      selectedDates.length !== eventTypeConfig.consecutiveDays &&
      !editMode
    ) {
      alert(
        `${eventTypeConfig.label} requires exactly ${eventTypeConfig.consecutiveDays} consecutive days`
      );
      return;
    }

    setLoading(true);
    try {
      
      const payload = {
        domain_id: parseInt(formData.domain),
        institute_id: parseInt(formData.institute),
        availability_ids: selectedDates.map((d) => d.availability_id),
        event_type: formData.eventType,
        students_limit: parseInt(formData.studentLimit),
      };

      if (editMode && editingBooking) {
        payload.bookslot_id = editingBooking.bookslot_id;
      } else {
        payload.trainer_id = trainerId;
      }

      const token = localStorage.getItem("accessToken");
      const url =
        editMode && editingBooking
          ? `${BASE_URL}/event/book-slot/edit`
          : `${BASE_URL}/event/book-slot`;

      const method = editMode && editingBooking ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      alert(
        data?.message ||
          `Booking ${editMode ? "updated" : "created"} successfully!`
      );

      await fetchAllTrainers();
      await fetchTrainerBookings(trainerId);

      setBookingMode(false);
      setEditMode(false);
      setSelectedDates([]);
      setShowBookingForm(false);
      setEditingBooking(null);
      setFormData({
        state: "",
        institute: "",
        domain: "",
        studentLimit: "",
        eventType: "",
      });

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      console.error("Error with booking operation:", error);
      alert(error.message || "Failed to process booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex gap-4">
      <div
        className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
          showBookingForm ? "w-2/3" : "w-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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

        {/* Booked Events List with Edit Button */}
        {!bookingMode &&
          !approvalMode &&
          !editMode &&
          isAdmin &&
          bookedDateRanges.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">
                Booked Events
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {bookedDateRanges.map((booking, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {booking.domain_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDateKey(new Date(booking.start_date))} to{" "}
                        {formatDateKey(new Date(booking.end_date))}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditBookingClick(booking)}
                      className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Booking"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        {!bookingMode && !approvalMode && !editMode ? (
          <div className="mb-4 flex gap-3">
            <button
              onClick={handleBookSlotClick}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              Book Slot
            </button>
            {isAdmin && (
              <button
                onClick={handleApprovalClick}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
              >
                Approval
              </button>
            )}
          </div>
        ) : bookingMode || editMode ? (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {editMode
                ? `Editing: ${editingBooking?.domain_name} - Toggle dates to modify`
                : !formData.eventType
                ? "Please select event type from the form →"
                : selectedDates.length > 0
                ? `${selectedDates.length} date(s) selected - ${
                    eventTypes.find((et) => et.value === formData.eventType)
                      ?.label
                  }`
                : `Click on available dates to select (${
                    eventTypes.find((et) => et.value === formData.eventType)
                      ?.label
                  })`}
            </span>
            <button
              onClick={handleCancelBooking}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mb-4 space-y-3">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
              <span className="text-sm text-purple-800">
                {pendingDates.length > 0
                  ? `${pendingDates.length} pending date(s) selected`
                  : "Click on pending dates to select for approval/rejection"}
              </span>
              <button
                onClick={handleCancelApproval}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
            {pendingDates.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApproveReject(1)}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {loading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleApproveReject(0)}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  {loading ? "Processing..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        )}

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
            const slot = getDateSlot(dayObj.date);
            const past = isPastDate(dayObj.date);
            const today = isToday(dayObj.date);
            const sunday = isSunday(dayObj.date);
            const selected = isDateSelected(dayObj.date);
            const pendingSelected = isDatePendingSelected(dayObj.date);
            const disabled = isDateDisabled(dayObj, slot);
            const bookedRange = isDateInBookedRange(dayObj.date);
            const isEditableBooked =
              editMode &&
              bookedRange &&
              bookedRange.bookslot_id === editingBooking?.bookslot_id;

            const isAvailable =
              slot &&
              slot.status_label === "Available" &&
              dayObj.isCurrentMonth &&
              !past &&
              !sunday &&
              !disabled;
            const isPending =
              slot &&
              slot.status_label === "Pending" &&
              dayObj.isCurrentMonth &&
              !past &&
              !sunday;

            let cellClasses = "relative h-20 rounded-lg p-2 transition-all ";
            let textClasses = "text-sm font-medium ";

            if (!dayObj.isCurrentMonth) {
              cellClasses += "bg-gray-50 text-gray-300 ";
            }

            if (disabled) {
              cellClasses += "opacity-40 cursor-not-allowed ";
            } else if (selected) {
              cellClasses +=
                "bg-blue-200 border-2 border-blue-500 ring-2 ring-blue-300 ";
              textClasses += "text-blue-900 ";
            } else if (pendingSelected) {
              cellClasses +=
                "bg-purple-200 border-2 border-purple-500 ring-2 ring-purple-300 ";
              textClasses += "text-purple-900 ";
              // This is the continuation of the calendar view component
              // Replace from the textClasses line onwards
            } else if (isEditableBooked) {
              cellClasses +=
                "bg-orange-100 border-2 border-orange-400 cursor-pointer hover:bg-orange-200 ";
              textClasses += "text-orange-800 ";
            } else if (past && dayObj.isCurrentMonth) {
              cellClasses += "bg-gray-100 ";
              textClasses += "text-gray-400 ";
            } else if (sunday && dayObj.isCurrentMonth && !past) {
              cellClasses += "bg-orange-50 border border-orange-200 ";
              textClasses += "text-orange-600 ";
            } else if (slot && dayObj.isCurrentMonth) {
              if (slot.status_label === "Booked") {
                cellClasses += "bg-red-100 border-2 border-red-300 ";
                textClasses += "text-red-700 ";
              } else if (slot.status_label === "Pending") {
                if (approvalMode) {
                  cellClasses +=
                    "bg-yellow-100 border-2 border-yellow-300 hover:bg-yellow-200 cursor-pointer ";
                } else {
                  cellClasses += "bg-yellow-100 border-2 border-yellow-300 ";
                }
                textClasses += "text-yellow-700 ";
              } else {
                if (bookingMode) {
                  cellClasses +=
                    "bg-green-100 border-2 border-green-300 hover:bg-green-200 cursor-pointer ";
                } else {
                  cellClasses += "bg-green-100 border-2 border-green-300 ";
                }
                textClasses += "text-green-700 ";
              }
            } else if (dayObj.isCurrentMonth && !past) {
              cellClasses += "bg-white border border-gray-200 ";
              textClasses += "text-gray-700 ";
            }

            if (today && dayObj.isCurrentMonth) {
              textClasses += "font-bold ";
            }

            return (
              <div
                key={index}
                className={cellClasses}
                onClick={() => !disabled && handleDateClick(dayObj, slot)}
                style={{
                  cursor:
                    (bookingMode && isAvailable) ||
                    (approvalMode && isPending) ||
                    (editMode && isEditableBooked)
                      ? "pointer"
                      : "default",
                }}
              >
                <div className={textClasses}>{dayObj.day}</div>

                {(selected || pendingSelected) && (
                  <div className="absolute top-1 right-1">
                    <svg
                      className={`w-5 h-5 ${
                        selected ? "text-blue-600" : "text-purple-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {slot &&
                  dayObj.isCurrentMonth &&
                  !past &&
                  !sunday &&
                  !selected &&
                  !pendingSelected && (
                    <div className="absolute bottom-1 left-1 right-1">
                      {slot.status_label === "Booked" && !isEditableBooked && (
                        <span className="text-xs bg-red-200 text-red-800 px-1 py-0.5 rounded block text-center">
                          Booked
                        </span>
                      )}
                      {isEditableBooked && (
                        <span className="text-xs bg-orange-200 text-orange-800 px-1 py-0.5 rounded block text-center">
                          Edit
                        </span>
                      )}
                      {slot.status_label === "Pending" && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded block text-center">
                          Pending
                        </span>
                      )}
                      {slot.status_label === "Available" && !disabled && (
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
              <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded mr-2"></div>
              <span>Sunday (OFF)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-200 border-2 border-blue-500 rounded mr-2"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editMode ? "Edit Booking" : "Book Trainer"}
            </h3>
          </div>

          {selectedDates.length > 0 && (
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600 mb-2">
                Selected Dates:{" "}
                <span className="font-medium text-blue-600">
                  {selectedDates.length}
                </span>
              </p>
              <div className="max-h-20 overflow-y-auto text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded">
                {selectedDates.map((d, i) => (
                  <div key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {d.date}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => handleFormChange("eventType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={editMode}
              >
                <option value="">Select Event Type</option>
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                    {type.consecutiveDays && ` (${type.consecutiveDays} days)`}
                  </option>
                ))}
              </select>
              {formData.eventType && !editMode && (
                <p className="text-xs text-gray-500 mt-1">
                  {eventTypes.find((et) => et.value === formData.eventType)
                    ?.consecutiveDays
                    ? `Select a start date from calendar - ${
                        eventTypes.find((et) => et.value === formData.eventType)
                          ?.consecutiveDays
                      } consecutive days will be auto-selected (excluding Sundays)`
                    : "Select any available dates from the calendar"}
                </p>
              )}
              {editMode && (
                <p className="text-xs text-blue-600 mt-1">
                  Event type cannot be changed in edit mode
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleFormChange("state", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.state_id} value={state.state_id}>
                    {state.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institute <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.institute}
                onChange={(e) => handleFormChange("institute", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!formData.state}
              >
                <option value="">
                  {formData.state ? "Select Institute" : "Select State First"}
                </option>
                {filteredInstitutes.map((institute) => (
                  <option
                    key={institute.institute_id}
                    value={institute.institute_id}
                  >
                    {institute.institute_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.domain}
                onChange={(e) => handleFormChange("domain", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain.domain_id} value={domain.domain_id}>
                    {domain.domain_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getLimitLabel()} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.studentLimit}
                onChange={(e) =>
                  handleFormChange("studentLimit", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={getLimitPlaceholder()}
                required
              />
            </div>

            {editMode && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-800">
                  <strong>Edit Mode:</strong> Click on the orange highlighted
                  dates in the calendar to toggle them. You can uncheck dates to
                  remove them from the booking.
                </p>
              </div>
            )}

            <button
              onClick={handleSubmitBooking}
              disabled={
                loading || selectedDates.length === 0 || !formData.eventType
              }
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading
                ? "Submitting..."
                : editMode
                ? "Update Booking"
                : "Submit Booking"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TrainerCalendarView;
