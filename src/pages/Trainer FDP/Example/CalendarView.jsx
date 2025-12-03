import React, { useState, useEffect, useRef } from "react";
import { X, Check, Edit2, Users, ChevronUp, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";
import { AnimatePresence, motion } from "framer-motion";
const TrainerCalendarView = ({
  trainerSlots,
  bookedDetails,
  trainerId,
  onBookingSuccess,
  fetchAllTrainers,
  fetchTrainerBookings,
  trainers
}) => {
  const [expandedTrainer, setExpandedTrainer] = useState(null);
  const [editableBookingDates, setEditableBookingDates] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [approvalMode, setApprovalMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
  const [isStaff, setIsStaff] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookedDateRanges, setBookedDateRanges] = useState([]);
  console.log("📦 Props.bookedDetails:", bookedDetails);
  console.log("📦 State.bookedDateRanges:", bookedDateRanges);

  // trainer selected id for booking slot from book slot form
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  // Inside CalendarView.jsx
  const [localTrainerSlots, setLocalTrainerSlots] = useState(trainerSlots || []);

  const [hoveredDate, setHoveredDate] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // storing selected dtes in edit

  const tooltipRef = useRef(null);

  // Detect outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setHoveredDate(null);
      }
    }

    if (hoveredDate) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hoveredDate]);


  console.log("🧩 Editing Booking:", editingBooking);

  useEffect(() => {
    if (editMode) setExpandedTrainer(null);
  }, [editMode]);


  // Keep localTrainerSlots in sync if parent prop changes
  useEffect(() => {
    setLocalTrainerSlots(trainerSlots || []);
  }, [trainerSlots]);

  // === Group bookings by trainer_id (ensure numeric) ===
  const groupedBookings = React.useMemo(() => {
    if (!bookedDetails || bookedDetails.length === 0) return {};

    const map = {};

    bookedDetails.forEach((b) => {
      const trainerId = String(b.trainer_id || "unknown");
      if (!map[trainerId]) {
        map[trainerId] = {
          trainer_name: b.trainer_name || "Unassigned Trainer",
          bookings: [],
        };
      }

      // push booking if unique (avoid duplicates)
      if (!map[trainerId].bookings.some((x) => x.bookslot_id === b.bookslot_id)) {
        map[trainerId].bookings.push(b);
      }
    });

    return map;
  }, [bookedDetails]);

  // Log to verify grouping
  const trainerGroups = Object.entries(groupedBookings).map(([id, data]) => [
    id,
    data.trainer_name,
    data.bookings.length,
  ]);

  console.log("✅ Trainer Groups (unique):", trainerGroups);


  console.log(
    "Trainer Groups:",
    Object.entries(groupedBookings).map(([id, data]) => [
      id,
      data.trainer_name,
      data.bookings.length,
    ])
  );
  console.log("Raw bookedDetails sample:", bookedDetails.slice(0, 5));


  // === Extract unique trainer IDs ===
  const trainerIds = Object.keys(groupedBookings);

  // === State for active trainer tab (default: first trainer) ===
  const [activeTrainerId, setActiveTrainerId] = useState(trainerIds[0] || null);

  // === Ensure the active tab resets correctly when trainer list changes ===
  useEffect(() => {
    if (trainerIds.length > 0 && !trainerIds.includes(String(activeTrainerId))) {
      setActiveTrainerId(trainerIds[0]);
    }
  }, [trainerIds]);
  // If parent passes a trainerId prop and you want calendar to reflect it:
  useEffect(() => {
    if (trainerId) {
      const filtered = trainerSlots.filter(s => s.trainer_id === parseInt(trainerId));
      setLocalTrainerSlots(filtered);
      setSelectedTrainerId(trainerId);
    }
  }, [trainerId, trainerSlots]);

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
  // const daysOfWeek = ["SU", "M", "T", "W", "Th", "F", "SA"];

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
    if (editMode && editingBooking) {
      // 🧩 If backend provides availability_details, use it directly
      if (editingBooking.availability_details?.length > 0) {
        const preselected = editingBooking.availability_details.map((d) => ({
          date: d.date,
          availability_id: d.availability_id,
        }));
        setSelectedDates(preselected);
        console.log("📅 Selected Dates after edit load (availability_details):", preselected);
      }

      // 🧩 Else if backend gives separate arrays for dates and availability_ids
      else if (
        Array.isArray(editingBooking.dates) &&
        Array.isArray(editingBooking.availability_ids)
      ) {
        const preselected = editingBooking.dates.map((date, idx) => ({
          date,
          availability_id: editingBooking.availability_ids[idx],
        }));
        setSelectedDates(preselected);
        console.log("📅 Selected Dates after edit load (dates + ids):", preselected);
      }

      // 🧩 Fallback: if no availability info, reset
      else {
        setSelectedDates([]);
        console.warn("⚠️ No availability details found for editing booking");
      }
    }
  }, [editMode, editingBooking]);



  useEffect(() => {
    const authorise = localStorage.getItem("Authorise");
    setIsAdmin(authorise === "admin");
    setIsStaff(authorise === "staff");
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
        total_faculty_limit: booking.total_faculty_limit,
        hosted_faculty_limit: booking.hosted_faculty_limit,
        coordinator_name: booking.coordinator_name,
        coordinator_mobile: booking.coordinator_mobile,
        coordinator_email: booking.coordinator_email,

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

  useEffect(() => {
    // 🧹 When the booking form closes, reset to combined view
    if (!showBookingForm) {
      setSelectedTrainerId(null);
      setLocalTrainerSlots([]); // back to combined slots
    }
  }, [showBookingForm]);


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


  // final working dateslot
  const getDateSlot = (date) => {
    const dateKey = formatDateKey(date);
    // 🟠 FIX: Never return slots for Sundays
    const checkDate = new Date(date);
    if (checkDate.getDay() === 0) return null;

    if (editMode && editingBooking) {
      console.log("🟣 editingBooking.dates sample:", editingBooking.dates?.[0]);
    }

    // ✅ Base slot lookup (trainer-specific or combined)
    let slot;
    if (!selectedTrainerId) {
      slot = computeCombinedSlots.find((s) => s.available_date === dateKey);
    } else {
      slot = localTrainerSlots.find((s) => s.available_date === dateKey);
    }

    // ✅ In edit mode, treat previously booked dates as available
    if (editMode && editingBooking && Array.isArray(editingBooking.dates)) {
      const wasOriginallyBooked = editingBooking.dates.some((d) => {
        // Support multiple formats — object, string, or Date
        let dKey;
        if (typeof d === "string") {
          dKey = formatDateKey(new Date(d));
        } else if (d?.date) {
          dKey = formatDateKey(new Date(d.date));
        } else if (d instanceof Date) {
          dKey = formatDateKey(d);
        }
        return dKey === dateKey;
      });

      if (wasOriginallyBooked) {
        console.log("✅ Treating as available:", dateKey);

        // 🟢 Return slot or fallback marked Available
        return {
          ...(slot || { available_date: dateKey }),
          status_label: "Available",
          fromEditBooking: true,
        };
      }
    }

    return slot;
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

  // final checkconsecutive availability
  const checkConsecutiveAvailability = (startDate, count) => {
    const consecutiveDates = [];
    let currentDate = new Date(startDate);
    let added = 0;

    // ✅ Build date list skipping Sundays — your original logic
    while (added < count) {
      if (!isSunday(currentDate)) {
        consecutiveDates.push(new Date(currentDate));
        added++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // ✅ Now validate availability
    for (const date of consecutiveDates) {
      const slot = getDateSlot(date);
      const dateKey = formatDateKey(date);

      // ✅ Treat currently booked dates from THIS booking as "Available"
      const isCurrentBookingSlot =
        editMode &&
        editingBooking &&
        editingBooking.dates?.some((d) => {
          const dObj = typeof d === "string" ? new Date(d) : d;
          return formatDateKey(dObj) === formatDateKey(date);
        });


      // ⛔️ INVALID if:
      // - No slot exists
      // - OR slot is NOT Available AND ALSO not part of this booking
      if (!slot || (slot.status_label !== "Available" && !isCurrentBookingSlot)) {
        return { available: false, dates: consecutiveDates };
      }
    }

    // ✅ All good
    return { available: true, dates: consecutiveDates };
  };


  const handleDateClick = (dayObj, slot) => {
    const dateKey = formatDateKey(dayObj.date);

    // === EDIT MODE ===
    if (editMode && editingBooking) {
      const eventType = formData.eventType;
      const isTechCamp = eventType === "tech_camp";
      const isFdp = eventType === "fdp";
      const isEdp = eventType === "edp";

      const isEditable =
        editableBookingDates.includes(dateKey) || slot?.status_label === "Available";
      if (!isEditable) return;


      // === EDP: dynamic (non-consecutive) selection ===
      if (isEdp) {
        const isSelected = selectedDates.some((d) => d.date === dateKey);
        let updatedDates;

        if (isSelected) {
          updatedDates = selectedDates.filter((d) => d.date !== dateKey);
        } else {
          updatedDates = [
            ...selectedDates,
            { date: dateKey, availability_id: slot?.availability_id },
          ];
        }

        if (updatedDates.length > 6) {
          alert("EDP can have a maximum of 6 days.");
          return;
        }

        setSelectedDates(updatedDates);
        return;
      }

      // === FDP / TECH CAMP ===
      const blockSize = isTechCamp ? 3 : isFdp ? 6 : 1;

      // ✅ FIX: include originally booked days as "available" for edit
      const wasOriginallyBooked = editingBooking?.dates?.includes(dateKey);

      const { available, dates } = checkConsecutiveAvailability(dayObj.date, blockSize, {
        includeDates: editingBooking?.dates || [],
      });

      // Manually override if this is part of the same original booking
      if (!available && wasOriginallyBooked) {
        console.log("🔄 Treating previously booked dates as editable");
      } else if (!available) {
        alert(
          `${eventType.toUpperCase()} requires ${blockSize} consecutive available days (excluding Sundays).`
        );
        return;
      }

      // ✅ Select / deselect logic
      const isSelected = selectedDates.some((d) => d.date === dateKey);
      if (isSelected) {
        const blockDates = dates.map((d) => formatDateKey(d));
        setSelectedDates(
          selectedDates.filter((d) => !blockDates.includes(d.date))
        );
      } else {
        const newSelectedDates = dates.map((d) => ({
          date: formatDateKey(d),
          availability_id: getDateSlot(d)?.availability_id,
        }));
        setSelectedDates(newSelectedDates);
      }

      return;
    }


    // === BOOKING MODE ===
    if (!bookingMode) return;
    if (!dayObj.isCurrentMonth || isPastDate(dayObj.date) || isSunday(dayObj.date)) return;
    if (!slot || slot.status_label !== "Available") return;
    if (!formData.eventType) {
      alert("Please select an event type from the booking form first");
      return;
    }

    const eventTypeConfig = eventTypes.find((et) => et.value === formData.eventType);

    if (eventTypeConfig?.consecutiveDays) {
      const { available, dates } = checkConsecutiveAvailability(dayObj.date, eventTypeConfig.consecutiveDays);
      if (!available) {
        alert(
          `Cannot select this date. ${eventTypeConfig.label} requires ${eventTypeConfig.consecutiveDays} consecutive available days (excluding Sundays).`
        );
        return;
      }

      const newSelectedDates = dates.map((date) => ({
        date: formatDateKey(date),
        availability_id: getDateSlot(date)?.availability_id,
      }));
      setSelectedDates(newSelectedDates);
    } else {
      const isSelected = selectedDates.some((d) => d.date === dateKey);
      if (isSelected) {
        setSelectedDates(selectedDates.filter((d) => d.date !== dateKey));
      } else {
        setSelectedDates([...selectedDates, { date: dateKey, availability_id: slot.availability_id }]);
      }
    }
  };


  // Helper to get the full block of consecutive selected dates for TechCamp/FDP
  const getSelectedBlock = (clickedDateKey, blockSize) => {
    const sorted = [...selectedDates].sort((a, b) => new Date(a.date) - new Date(b.date));
    const index = sorted.findIndex((d) => d.date === clickedDateKey);
    if (index === -1) return [];

    // Dynamically get block around clicked date
    let start = index - (blockSize - 1);
    if (start < 0) start = 0;
    const end = Math.min(start + blockSize, sorted.length);
    return sorted.slice(start, end).map((d) => d.date);
  };

  const isDateSelected = (date) => {
    const dateKey = formatDateKey(date);
    return selectedDates.some((d) => d.date === dateKey);
  };


  const isDateDisabled = (dayObj, slot) => {
    const inTrainerMode = !!selectedTrainerId;

    // Always disable past dates, Sundays, or non-current month
    if (isPastDate(dayObj.date) || isSunday(dayObj.date) || !dayObj.isCurrentMonth) {
      return true;
    }

    // --- Trainer mode ---
    if (inTrainerMode) {
      // Never disable dates editable for this trainer
      if (editMode && editingBooking) {
        const bookedRange = isDateInBookedRange(dayObj.date);
        if (bookedRange?.bookslot_id === editingBooking.bookslot_id) {
          return false; // editable → not disabled
        }
      }
      // Otherwise, only disable if no slot exists
      return !slot;
    }

    // --- Non-trainer mode ---
    if (!bookingMode || !formData.eventType) return false;

    const eventTypeConfig = eventTypes.find(et => et.value === formData.eventType);
    if (!eventTypeConfig?.consecutiveDays) return false;

    if (selectedDates.length > 0) {
      const dateKey = formatDateKey(dayObj.date);
      return !selectedDates.some(d => d.date === dateKey);
    }

    return false;
  };

  // final handle edit booking click
  const handleEditBookingClick = async (booking) => {
    console.log("🟡 Editing booking:", booking);

    setEditMode(true);
    setBookingMode(false);
    setApprovalMode(false);
    setShowBookingForm(true);

    // ✅ Add a normalized .dates array before setting editingBooking
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const dateList = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!isSunday(d)) {
        dateList.push(formatDateKey(d));
      }
    }

    setEditingBooking({
      ...booking,
      dates: dateList,
    });

    // Preload trainer data if needed
    const trainerId = booking.trainer_id || booking.trainerId || "";
    if (trainerId) await handleTrainerChange(trainerId);

    // Pre-fill formData (your existing logic)
    const institute = institutes.find(
      (inst) => inst.institute_id === booking.institute_id
    );
    setFormData({
      trainerId: trainerId,
      eventType: booking.event_type || "",
      domain: booking.domain_id?.toString() || "",
      state:
        booking.state_id?.toString() ||
        institute?.state_id?.toString() ||
        "",
      institute: booking.institute_id?.toString() || "",
      totalFacultyLimit:
        (booking.event_type === "fdp" || booking.event_type === "edp")
          ? booking.total_faculty_limit?.toString() || ""
          : "",
      hostedInstituteLimit:
        booking.hosted_institute_faculty_limit?.toString() ||
        booking.hosted_faculty_limit?.toString() ||
        "",
      coordinatorName: booking.coordinator_name || "",
      coordinatorMobile: booking.coordinator_mobile || "",
      coordinatorEmail: booking.coordinator_email || "",
      studentLimit:
        booking.event_type === "tech_camp"
          ? booking.students_limit?.toString() || ""
          : "",
      imageFile: null,
    });

    // Prepare editable dates for this booking only
    const editableDates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!isSunday(d)) {
        const slot = getDateSlot(d);
        editableDates.push({
          date: formatDateKey(d),
          availability_id: slot?.availability_id,
        });
      }
    }

    setSelectedDates(editableDates);
    setEditableBookingDates(editableDates.map((d) => d.date));

    console.log("✅ Editable Dates for this booking:", editableDates);
  };

  const handleBookSlotClick = () => {
    setBookingMode(true);
    setApprovalMode(false);
    setEditMode(false);
    setSelectedDates([]);
    setShowBookingForm(true);
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

  const handleFormChange = (field, value) => {
    if (field === "eventType" && value !== formData.eventType && !editMode) {
      setSelectedDates([]);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmitBooking = async () => {
    console.log("Event Type Received:", formData.eventType);

    if (!formData.eventType) {
      alert("Please select an event type");
      return;
    }

    const isFdp = formData.eventType === "fdp";
    const isEdp = formData.eventType === "edp";
    const isTechCamp = formData.eventType === "tech_camp";

    // === UNIVERSAL VALIDATION ===
    const missingFields = [];

    if (!formData.domain) missingFields.push("Domain");

    // === FDP VALIDATION ===
    if (isFdp) {
      if (!formData.institute) missingFields.push("Institute");
      if (!formData.totalFacultyLimit) missingFields.push("Total Faculty Limit");
      if (!formData.hostedInstituteLimit)
        missingFields.push("Hosted Institute Faculty Limit");

      if (
        !editMode &&
        (!formData.coordinatorName ||
          !formData.coordinatorGender ||   // 👈 added
          !formData.coordinatorMobile ||
          !formData.coordinatorEmail)
      )
        missingFields.push("Coordinator Details");

      // Hosted Institute Logo validation
      // if (!formData.imageFile && !(editMode && editingBooking?.hosted_institute_logo))
      if (!formData.imageFile && !(editMode && editingBooking?.institute_logo))
        missingFields.push("Hosted Institute Logo");

      // Logo file size check (<= 500 KB)
      if (formData.imageFile) {
        const maxSize = 500 * 1024; // 500 KB
        if (formData.imageFile.size > maxSize) {
          alert("Hosted Institute Logo must be smaller than 500 KB");
          return;
        }
      }
    }

    // === EDP VALIDATION ===
    else if (isEdp) {
      const educatorLimit = formData.totalFacultyLimit?.toString().trim();
      if (!educatorLimit || parseInt(educatorLimit) <= 0) {
        missingFields.push("Educator Limit");
      }
    }


    // === TECH CAMP / OTHER EVENT TYPES ===
    else {
      if (!formData.state) missingFields.push("State");
      if (!formData.institute) missingFields.push("Institute");
      if (!formData.studentLimit) missingFields.push("Student Limit");
    }

    // === SHOW MISSING FIELDS IN ONE ALERT ===
    if (missingFields.length > 0) {
      alert(`Please fill the following required fields:\n- ${missingFields.join("\n- ")}`);
      return;
    }

    // === VALUE VALIDATIONS ===
    if (isFdp) {
      if (parseInt(formData.totalFacultyLimit) <= 0) {
        alert("Total Faculty Limit must be greater than 0");
        return;
      }
      if (parseInt(formData.hostedInstituteLimit) <= 0) {
        alert("Hosted Institute Faculty Limit must be greater than 0");
        return;
      }
    } else if (isEdp) {
      if (!formData.totalFacultyLimit || parseInt(formData.totalFacultyLimit) <= 0) {
        alert("Educator Limit must be greater than 0");
        return;
      }
    }
    else {
      if (parseInt(formData.studentLimit) <= 0) {
        alert("Student Limit must be greater than 0");
        return;
      }
    }

    // === DATE VALIDATION ===
    if (selectedDates.length === 0) {
      alert("Please select at least one date from the calendar");
      return;
    }

    const eventTypeConfig = eventTypes.find(
      (et) => et.value === formData.eventType
    );

    if (
      eventTypeConfig?.consecutiveDays &&
      selectedDates.length !== eventTypeConfig.consecutiveDays &&
      !editMode
    ) {
      alert(
        `${eventTypeConfig.label} requires exactly ${eventTypeConfig.consecutiveDays} consecutive days`
      );
      return;
    }

    // === EDP DATE VALIDATION ===
    if (isEdp) {
      const selected = [...selectedDates].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      const minDays = 3;
      const maxDays = 6;

      if (selected.length < minDays) {
        alert("For EDP, you must select at least 3 consecutive days.");
        return;
      }
      if (selected.length > maxDays) {
        alert("For EDP, you can select a maximum of 6 days.");
        return;
      }

      const areConsecutive = selected.every((d, i, arr) => {
        if (i === 0) return true;
        const prevDate = new Date(arr[i - 1].date);
        const currDate = new Date(d.date);
        let nextValid = new Date(prevDate);
        do {
          nextValid.setDate(nextValid.getDate() + 1);
        } while (nextValid.getDay() === 0);
        return nextValid.toDateString() === currDate.toDateString();
      });

      if (!areConsecutive) {
        alert("For EDP, selected dates must be consecutive (excluding Sundays).");
        return;
      }
    }

    // === FDP COORDINATOR VALIDATION (NEW BOOKINGS ONLY) ===
    if (isFdp && !editMode) {
      const coordinatorMobile = (formData.coordinatorMobile || "").trim();
      const coordinatorEmail = (formData.coordinatorEmail || "").trim();

      if (!/^[6-9]\d{9}$/.test(coordinatorMobile)) {
        alert("Please enter a valid 10-digit Indian mobile number for the coordinator.");
        return;
      }

      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(coordinatorEmail)) {
        alert("Please enter a valid email address for the coordinator.");
        return;
      }
    }


    // === Proceed with your original logic ===
    setLoading(true);
    try {
      console.log("🟢 Selected Dates:", selectedDates);
      console.log("🟢 Availability IDs:", selectedDates.map(d => d.availability_id));
      const fd = new FormData();
      fd.append("domain_id", parseInt(formData.domain));
      let availabilityIds = [];

      // ✅ Prefer selectedDates if present
      if (selectedDates && selectedDates.length > 0) {
        availabilityIds = selectedDates
          .map((d) => d.availability_id)
          .filter((id) => id);
      }

      // ✅ If in edit mode and selectedDates empty, use existing booking data
      if (
        availabilityIds.length === 0 &&
        editMode &&
        editingBooking?.availability_ids
      ) {
        const existing = Array.isArray(editingBooking.availability_ids)
          ? editingBooking.availability_ids
          : editingBooking.availability_ids
            .toString()
            .split(",")
            .map((id) => id.trim()) // only when they are strings
            .filter((id) => id !== "");

        // 🩵 Ensure all IDs are numbers
        availabilityIds = existing.map((id) => Number(id)).filter((id) => !isNaN(id));
      }


      if (availabilityIds.length === 0) {
        alert("Please select at least one valid date before submitting.");
        setLoading(false);
        return;
      }

      fd.append("availability_ids", availabilityIds.join(","));


      fd.append("event_type", formData.eventType);

      if (editMode && editingBooking) {
        fd.append("bookslot_id", editingBooking.bookslot_id);
      } else {
        // fd.append("trainer_id", trainerId);
        fd.append("trainer_id", parseInt(formData.trainerId || selectedTrainerId));

      }

      if (isFdp) {
        fd.append("institute_id", parseInt(formData.institute));
        fd.append("total_faculty_limit", parseInt(formData.totalFacultyLimit));
        fd.append(
          "hosted_institute_faculty_limit",
          parseInt(formData.hostedInstituteLimit || 0)
        );
        fd.append("coordinator_name", formData.coordinatorName || "");
        fd.append("coordinator_gender", formData.coordinatorGender || "");  // 👈 NEW code for gender
        fd.append("coordinator_mobile", formData.coordinatorMobile || "");
        fd.append("coordinator_email", formData.coordinatorEmail || "");

        if (formData.imageFile) {
          const pngBlob = await convertToPng(formData.imageFile);
          fd.append("image", pngBlob, "hosted_institute_logo.png");
        }
      } else if (formData.eventType === "edp") {
        const educatorLimit = parseInt(formData.totalFacultyLimit);
        if (isNaN(educatorLimit) || educatorLimit <= 0) {
          alert("Please enter a valid Educator Limit (must be a positive number)");
          return;
        }
        fd.append("total_faculty_limit", educatorLimit);
      }
      else if (formData.eventType === "tech_camp") {
        if (formData.institute)
          fd.append("institute_id", parseInt(formData.institute));
        fd.append("students_limit", parseInt(formData.studentLimit));
      } else {
        fd.append("students_limit", parseInt(formData.studentLimit));
        if (formData.institute)
          fd.append("institute_id", parseInt(formData.institute));
      }

      const token = localStorage.getItem("accessToken");
      const url =
        editMode && editingBooking
          ? `${BASE_URL}/event/book-slot/edit`
          : `${BASE_URL}/event/book-slot`;
      const method = editMode && editingBooking ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await response.json();

      // ✅ Handle backend errors properly (like in Code 1)
      if (!response.ok) {
        const backendMessage =
          data.detail ||
          data.message ||
          "Failed to process booking. Please try again.";
        throw new Error(backendMessage);
      }
      console.log("📤 Selected Dates on submit:", selectedDates);
      console.log("📤 Availability IDs derived:", selectedDates.map(d => d.availability_id));

      // ✅ Success message if backend is OK
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
        totalFacultyLimit: "",
        hostedInstituteLimit: "",
        coordinatorName: "",
        coordinatorGender: "",/*new code for gender*/
        coordinatorMobile: "",
        coordinatorEmail: "",
        eventType: "",
        imageFile: null,
      });

      if (onBookingSuccess) onBookingSuccess();
    } catch (error) {
      console.error("Error with booking operation:", error);
      alert(error.message || "Failed to process booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === Helper function to convert any image to PNG ===
  async function convertToPng(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/png",
            1.0
          );
        };
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // === Utility: Convert uploaded image to PNG before sending ===
  async function convertToPng(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/png",
            1.0
          );
        };
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const days = getDaysInMonth(currentDate);

  const handleTrainerChange = async (trainerId) => {
    handleFormChange("trainerId", trainerId);
    setSelectedTrainerId(trainerId); // ✅ track selected trainer
    setSelectedDates([]);   // ✅ add this only


    if (trainerId) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${BASE_URL}/event/domains-institutes/${trainerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch domains/institutes");

        const data = await response.json();
        setDomains(data.domains || []);
        setStates(data.states || []);
        setInstitutes(data.institutes || []);

        // ✅ Filter trainerSlots already available in props
        const selectedTrainerSlots = trainerSlots.filter(
          (slot) => slot.trainer_id === parseInt(trainerId)
        );

        setLocalTrainerSlots(selectedTrainerSlots);
      } catch (err) {
        console.error("Failed to load trainer data:", err);
      }
    } else {
      // ✅ Reset when no trainer selected
      setDomains([]);
      setStates([]);
      setInstitutes([]);
      setLocalTrainerSlots([]);
    }
  };

  // Combine all trainers’ slots for overview mode
  // Combine all trainers’ slots for overview mode (no pending or approvalMode)
  const computeCombinedSlots = React.useMemo(() => {
    const map = {}; // { dateKey: { Available: [], Booked: [] } }

    trainerSlots.forEach((slot) => {
      const dateKey = slot.available_date;
      if (!map[dateKey]) map[dateKey] = { Available: [], Booked: [] };

      if (slot.status_label === "Available") {
        map[dateKey].Available.push(slot.trainer_name || slot.trainer_fullname);
      } else if (slot.status_label === "Booked") {
        map[dateKey].Booked.push(slot.trainer_name || slot.trainer_fullname);
      }
    });

    return Object.entries(map).map(([date, statuses]) => ({
      available_date: date,
      counts: {
        Available: statuses.Available.length,
        Booked: statuses.Booked.length,
      },
      trainers: statuses, // full details for hover popup
    }));
  }, [trainerSlots]);


  console.log({
    bookedDateRanges,
    bookedDetails,
    localTrainerSlots,
  });
  console.log("Calendar Props:", {
    trainerSlots: trainerSlots?.length,
    bookedDetails: bookedDetails?.length,
    bookedDateRanges: bookedDateRanges?.length,
  });


  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-4">
      <div
        className={`flex-1 transition-all duration-500 ${showBookingForm ? "lg:w-2/3" : "lg:w-full"
          }`}
      >

        {console.log("Render Conditions:", ({
          bookingMode,
          approvalMode,
          editMode,
          isAdmin,
          bookedDateRanges: bookedDateRanges.length,
        }))}

        {/* === Unified Rich Metrics Section === */}
        <div className="mb-6 bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden relative">
          <div className="p-5">
            {/* === Admin View === */}
            {isAdmin && (
              <>
                {/* === Header === */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" /> Trainer Bookings Overview
                  </h3>

                  {/* === Buttons (Book Slot) === */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleBookSlotClick}
                      className="px-5 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 shadow-sm transition-all"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>

                {/* === Trainer List Table === */}
                <div className="divide-y divide-gray-200">
                  {trainerIds.length === 0 && (
                    <div className="py-8 text-center text-gray-500">No bookings found</div>
                  )}

                  {trainerIds.map((id) => {
                    const { trainer_name, bookings } = groupedBookings[id];
                    const expanded = expandedTrainer === id;

                    return (
                      <div key={id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                        {/* Trainer Row */}
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedTrainer(expanded ? null : id)}
                        >
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-800">{trainer_name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{bookings.length} booking(s)</span>
                            {expanded ? (
                              <ChevronUp className="w-5 h-5 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>

                        {/* Expandable Table */}
                        <AnimatePresence>
                          {expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-4 border-t border-gray-100 pt-4"
                            >
                              <table className="w-full text-sm text-left text-gray-700 mb-2 border-collapse">
                                <thead className="bg-gray-100 text-gray-800 text-xs uppercase tracking-wider">
                                  <tr>
                                    <th className="px-4 py-3 w-1/5 text-left">Domain</th>
                                    <th className="px-4 py-3 w-1/5 text-left">Event Type</th>
                                    <th className="px-4 py-3 w-1/5 text-left">Start Date</th>
                                    <th className="px-4 py-3 w-1/5 text-left">End Date</th>
                                    <th className="px-4 py-3 w-1/5 text-center">Action</th>
                                  </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                  {bookings.map((booking, index) => (
                                    <tr
                                      key={index}
                                      className={`transition-colors ${editingBooking?.id === booking.id
                                        ? "bg-blue-50 border-l-4 border-blue-500"
                                        : "hover:bg-blue-50"
                                        }`}
                                    >
                                      <td className="px-4 py-3 align-middle">{booking.domain_name}</td>
                                      <td className="px-4 py-3 capitalize align-middle">
                                        {eventTypes.find((et) => et.value === booking.event_type)?.label ||
                                          booking.event_type}
                                      </td>
                                      <td className="px-4 py-3 align-middle">
                                        {formatDateKey(new Date(booking.start_date))}
                                      </td>
                                      <td className="px-4 py-3 align-middle">
                                        {formatDateKey(new Date(booking.end_date))}
                                      </td>

                                      {/* Center-aligned action column */}
                                      <td className="px-4 py-3 text-center align-middle">
                                        <div className="flex justify-center">
                                          <button
                                            onClick={() => handleEditBookingClick(booking)}
                                            disabled={
                                              booking.can_edit === false || booking.can_edit === "false"
                                            }
                                            className={`px-3 py-2 flex items-center gap-2 rounded-lg transition-all ${booking.can_edit === true || booking.can_edit === "true"
                                              ? "text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm hover:shadow-md"
                                              : "text-gray-400 cursor-not-allowed bg-gray-100"
                                              }`}
                                          >
                                            <Edit2 className="w-4 h-4" /> Edit
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* === Staff View === */}
            {isStaff && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleBookSlotClick}
                  className="relative px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  Book Your Slot
                  <span className="absolute top-0 left-0 w-full h-full rounded-3xl border-2 border-white opacity-10 animate-pulse"></span>
                </button>
              </div>
            )}
          </div>


          {bookingMode || editMode ? (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {editMode
                  ? `Editing: ${editingBooking?.domain_name} - Toggle dates to modify`
                  : !formData.eventType
                    ? "Please select event type from the form →"
                    : selectedDates.length > 0
                      ? `${selectedDates.length} date(s) selected - ${eventTypes.find((et) => et.value === formData.eventType)
                        ?.label
                      }`
                      : `Click on available dates to select (${eventTypes.find((et) => et.value === formData.eventType)
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
          ) : null}


          {/* === Calendar + Form Section (Appears Below Overview) === */}
          <AnimatePresence>
            {(bookingMode || editMode) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-100 p-6 bg-white"
              >
                {/* === Calendar + Form Layout Below Table === */}
                <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start w-full">

                  {/* renderiing of he form and calender witht the triner tabe preview */}
                  {/* calendar code(left side) */}
                  {/* calendar grid */}
                  {/* === 3-Month Calendar View (uses your currentDate / navigateMonth / generateDays) === */}
                  {(bookingMode || approvalMode || editMode) && (
                    <div className="lg:w-2/3 w-full">
                      <div className="flex flex-wrap justify-center gap-6 w-full">
                        {[0, 1, 2].map((offset) => {
                          // derive month start using the same currentDate you already use
                          const date = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() + offset,
                            1
                          );
                          const monthName = monthNames[date.getMonth()];
                          const year = date.getFullYear();

                          // === Helper to generate all day cells for a given month ===
                          const generateDays = (date) => {
                            const year = date.getFullYear();
                            const month = date.getMonth();

                            // first day of this month
                            const firstDay = new Date(year, month, 1);
                            const startDay = firstDay.getDay(); // 0 (Sun) - 6 (Sat)

                            // how many days are in this month
                            const daysInMonth = new Date(year, month + 1, 0).getDate();

                            // previous month’s trailing days (to fill grid)
                            const prevMonthDays = [];
                            for (let i = 0; i < startDay; i++) {
                              const d = new Date(year, month, i - startDay + 1);
                              prevMonthDays.push({
                                date: d,
                                day: d.getDate(),
                                isCurrentMonth: false,
                              });
                            }

                            // this month’s days
                            const currentMonthDays = [];
                            for (let i = 1; i <= daysInMonth; i++) {
                              currentMonthDays.push({
                                date: new Date(year, month, i),
                                day: i,
                                isCurrentMonth: true,
                              });
                            }

                            // next month’s leading days (to fill 6x7 grid = 42 cells)
                            const totalDisplayed = prevMonthDays.length + currentMonthDays.length;
                            const nextMonthDays = [];
                            for (let i = 1; totalDisplayed + nextMonthDays.length < 42; i++) {
                              const d = new Date(year, month + 1, i);
                              nextMonthDays.push({
                                date: d,
                                day: i,
                                isCurrentMonth: false,
                              });
                            }

                            return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
                          };


                          // <-- IMPORTANT: using your existing generator function name
                          // If your function has a different name, replace generateDays(...) with it.
                          const monthDays = generateDays(date);

                          return (
                            <div
                              key={offset}
                              className="flex-1 bg-white/75 backdrop-blur-sm shadow-lg border border-gray-200 rounded-2xl p-4 transition-all hover:shadow-xl"
                            >
                              {/* Month Header */}
                              <div className="flex items-center justify-between mb-3">
                                {/* LEFT ARROW: show only for first month */}
                                {offset === 0 ? (
                                  <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-all"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                ) : (
                                  <div className="w-5" /> // keeps spacing even for middle/right months
                                )}

                                <h2 className="text-lg font-semibold text-gray-800">
                                  {monthName} <span className="text-gray-500 text-sm">{year}</span>
                                </h2>

                                {/* RIGHT ARROW: show only for last month */}
                                {offset === 2 ? (
                                  <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-all"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                ) : (
                                  <div className="w-5" /> // keeps spacing even for first/middle months
                                )}
                              </div>


                              {/* Weekday labels (your daysOfWeek) */}
                              <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                                {daysOfWeek.map((d) => (
                                  <div key={d}>{d}</div>
                                ))}
                              </div>

                              {/* Calendar grid for this month */}
                              {/* <div className="grid grid-cols-7 gap-2"> */}
                              <div
                                className={`grid grid-cols-7 gap-2 ${selectedTrainerId ? "text-[10px]" : "text-xs"
                                  }`}
                              >

                                {monthDays.map((dayObj, idx) => {
                                  const slot = getDateSlot(dayObj.date);
                                  const past = isPastDate(dayObj.date);
                                  const today = isToday(dayObj.date);
                                  const sunday = isSunday(dayObj.date);
                                  const selected = isDateSelected(dayObj.date);
                                  const disabled = isDateDisabled(dayObj, slot);
                                  const bookedRange = isDateInBookedRange(dayObj.date);

                                  // ✅ Updated: use editableBookingDates for multi-trainer support
                                  const isEditableBooked = editMode && editableBookingDates.includes(formatDateKey(dayObj.date));

                                  const isAvailable =
                                    slot &&
                                    slot.status_label === "Available" &&
                                    dayObj.isCurrentMonth &&
                                    !past &&
                                    !sunday &&
                                    !disabled;

                                  const inTrainerMode = !!selectedTrainerId;

                                  let cellClasses =
                                    "relative rounded-lg flex flex-col items-center justify-between font-medium transition-all duration-200 border " +
                                    (
                                      selectedTrainerId
                                        ? "h-14 p-1 min-w-[50px]"
                                        : showBookingForm
                                          ? "h-22 p-1.5 min-w-[60px]"
                                          : "h-20 p-1.5 min-w-[60px]"
                                    );

                                  let textClasses = "text-xs font-semibold ";


                                  // === TRAINER MODE COLORS ===
                                  if (inTrainerMode) {
                                    if (past) {
                                      // Past dates – always gray
                                      cellClasses += "bg-gray-100 text-gray-400 border border-gray-200 opacity-80 cursor-default ";
                                    } else if (sunday) {
                                      // Sundays – orange background
                                      cellClasses += "bg-orange-50 border border-orange-200 text-orange-700 ";
                                    } else if (slot?.status_label === "Booked") {
                                      // Trainer’s booked slots – red
                                      cellClasses += "bg-red-50 border border-red-300 text-red-700 ";
                                    } else if (slot?.status_label === "Available" || slot?.status_label === "Rejected") {
                                      // Available or Rejected leave – green
                                      cellClasses += "bg-green-50 border border-green-300 text-green-700 ";
                                    } else {
                                      // Pending / Approved / Unavailable / Future unavailability
                                      cellClasses += "bg-white border border-gray-200 text-gray-700 ";
                                    }
                                  }

                                  // === COMBINED / NORMAL MODE COLORS ===
                                  else {
                                    if (past) {
                                      // Past days – gray
                                      cellClasses += "bg-gray-100 text-gray-400 ";
                                    } else if (sunday) {
                                      // Sunday off
                                      cellClasses += "bg-orange-50 border border-orange-200 text-orange-700 ";
                                    } else if (slot?.status_label === "Booked") {
                                      // Booked slot
                                      cellClasses += "bg-red-50 border border-red-300 text-red-700 ";
                                    } else if (slot?.status_label === "Available" || slot?.status_label === "Rejected") {
                                      // Available or rejected (same as available)
                                      cellClasses += "bg-green-50 border border-green-300 text-green-700 ";
                                    } else {
                                      // Default – no slot / pending / unavailable
                                      cellClasses += "bg-white border border-gray-200 text-gray-700 ";
                                    }
                                  }

                                  // === UNIVERSAL STYLING (APPLIES TO BOTH MODES) ===
                                  if (!dayObj.isCurrentMonth) {
                                    cellClasses += "bg-gray-50 text-gray-300 opacity-50 cursor-default ";
                                  } else if (disabled) {
                                    cellClasses += "bg-gray-100 text-gray-400 cursor-not-allowed ";
                                  }

                                  // === SELECTED DATES (Highlight for Add/Edit mode) ===
                                  if (selected) {
                                    cellClasses +=
                                      "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg scale-[1.03] ";
                                    textClasses += "text-white ";
                                  }

                                  // === EDITABLE BOOKED (Special highlight for editing existing booked slots) ===
                                  else if (isEditableBooked) {
                                    cellClasses +=
                                      "bg-orange-50 border border-orange-400 hover:bg-orange-100 cursor-pointer shadow-sm ";
                                    textClasses += "text-orange-700 ";
                                  }

                                  // === EMPTY FUTURE DAYS (clickable) ===
                                  else if (dayObj.isCurrentMonth && !past && !sunday && !slot) {
                                    cellClasses +=
                                      "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer ";
                                    textClasses += "text-gray-700 ";
                                  }

                                  // === HIGHLIGHT “TODAY” DATE (always on top) ===
                                  if (today && dayObj.isCurrentMonth) {
                                    cellClasses += " ring-2 ring-blue-400 ";
                                    textClasses += "font-bold ";
                                  }

                                  return (
                                    <div
                                      key={idx}
                                      className={cellClasses + " flex flex-col items-center justify-between relative"}
                                      onClick={() => !disabled && handleDateClick(dayObj, slot)}
                                      style={{
                                        cursor:
                                          (bookingMode && isAvailable) ||
                                            (editMode && (isAvailable || isEditableBooked))
                                            ? "pointer"
                                            : "default",
                                      }}
                                    >
                                      {/* === Date number (always top) === */}
                                      <div className={`${textClasses} mt-0.5`}>{dayObj.day}</div>

                                      {/* === Status badges (bottom for non-trainer mode) === */}
                                      {slot && dayObj.isCurrentMonth && (
                                        <>
                                          {/* Trainer Mode → Single badge centered */}
                                          {inTrainerMode && (
                                            <div className="mt-auto mb-0.5 flex justify-center">
                                              {/* Prioritize "Edit" badge first */}
                                              {isEditableBooked ? (
                                                <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                                                  Edit
                                                </span>
                                              ) : slot.status_label === "Booked" && !past ? (
                                                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                                                  {selectedTrainerId ? "B" : "Booked"}
                                                </span>
                                              ) : slot.status_label === "Available" && !disabled ? (
                                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                                  {selectedTrainerId ? "A" : "Available"}
                                                </span>
                                              ) : null}

                                            </div>
                                          )}

                                          {/* Non-Trainer Mode → Stack badges neatly below date */}
                                          {!inTrainerMode && !past && slot?.counts && (
                                            <div
                                              className="flex justify-center flex-wrap gap-0.5 mt-auto mb-0.5 px-1 overflow-hidden"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setHoveredDate(slot);
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setPopupPosition({ x: rect.x + rect.width / 2, y: rect.y });
                                              }}
                                            >
                                              {slot.counts.Booked > 0 && (
                                                <span className="bg-red-100 text-red-700 px-0.5 py-0.5 rounded-full text-[10px]">
                                                  B:{slot.counts.Booked}
                                                </span>
                                              )}
                                              {slot.counts.Available > 0 && (
                                                <span className="bg-green-100 text-green-700 px-0.5 py-0.5 rounded-full text-[10px]">
                                                  A:{slot.counts.Available}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      )}

                                      {/* Sunday OFF badge */}
                                      {sunday && dayObj.isCurrentMonth && !past && (
                                        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                                          <span className="text-[10px] bg-orange-100 text-orange-700 px-0.5 py-0.5 rounded-full">
                                            OFF
                                          </span>
                                        </div>
                                      )}

                                      {/* Today marker */}
                                      {today && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                      )}
                                    </div>
                                  );
                                })}

                              </div>
                              {/* legend  for the calendar */}
                              {/* Legend for calendar shortcuts */}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div className="flex items-center min-w-[120px]">
                                    <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2 flex-shrink-0"></div>
                                    <span>A - Available</span>
                                  </div>
                                  <div className="flex items-center min-w-[120px]">
                                    <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2 flex-shrink-0"></div>
                                    <span>B - Booked</span>
                                  </div>
                                  <div className="flex items-center min-w-[120px]">
                                    <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded mr-2 flex-shrink-0"></div>
                                    <span>OFF - Sunday</span>
                                  </div>
                                  <div className="flex items-center min-w-[120px]">
                                    <div className="w-4 h-4 bg-blue-200 border-2 border-blue-500 rounded mr-2 flex-shrink-0"></div>
                                    <span>S - Selected</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                  )}

                  {/* show form */}
                  {showBookingForm && (
                    // <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 animate-slide-in">
                    <div className="lg:w-1/3 bg-white rounded-2xl shadow-xl p-6 animate-slide-in overflow-y-auto h-[90vh]">
                      {/* your form JSX here */}
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

                      {/* === Trainer Select === */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trainer <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.trainerId || ""}
                          onChange={(e) => handleTrainerChange(e.target.value)}
                          disabled={editMode} // 👈 disable trainer selection in edit mode
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editMode ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                        >
                          <option value="">Select Trainer</option>
                          {trainers.map((trainer) => (
                            <option key={trainer.trainer_id} value={trainer.trainer_id}>
                              {trainer.fullname}
                            </option>
                          ))}
                        </select>

                        {/* 👇 Add hint below dropdown for clarity */}
                        {editMode && (
                          <p className="text-xs text-blue-600 mt-1">
                            Trainer cannot be changed in edit mode
                          </p>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* === Event Type === */}
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
                            {eventTypes
                              // ✅ hide EDP when role is staff
                              .filter((type) => !(isStaff && type.value === "edp"))
                              .map((type) => (
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
                                ? `Select a start date - ${eventTypes.find(
                                  (et) => et.value === formData.eventType
                                )?.consecutiveDays
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

                        {/* === State === */}
                        {formData.eventType !== "edp" && (
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
                        )}

                        {/* === Institute === */}
                        {formData.eventType !== "edp" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Institute <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.institute}
                              onChange={(e) => handleFormChange("institute", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required={formData.eventType !== "tech_camp"}
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
                        )}

                        {/* === Domain === */}
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

                        {/* === FDP Extra Fields === */}
                        {formData.eventType === "fdp" && (
                          <>
                            {/* Faculty Limits */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Faculty Limit <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={formData.totalFacultyLimit || ""}
                                onChange={(e) =>
                                  handleFormChange("totalFacultyLimit", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter total faculty limit"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hosted Institute Faculty Limit{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={formData.hostedInstituteLimit || ""}
                                onChange={(e) =>
                                  handleFormChange("hostedInstituteLimit", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter hosted institute faculty limit"
                                required
                              />
                            </div>

                            {/* Coordinator Details (hide in edit mode for admin) */}
                            {!editMode && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coordinator Name <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.coordinatorName || ""}
                                    onChange={(e) =>
                                      handleFormChange("coordinatorName", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter coordinator name"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coordinator Mobile Number <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    pattern="[0-9]{10}"
                                    value={formData.coordinatorMobile || ""}
                                    onChange={(e) =>
                                      handleFormChange("coordinatorMobile", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter 10-digit mobile number"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coordinator Email <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    value={formData.coordinatorEmail || ""}
                                    onChange={(e) =>
                                      handleFormChange("coordinatorEmail", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter coordinator email"
                                    required
                                  />
                                </div>
                              </>
                            )}

                            {/* new code for gender */}

                            {/* Coordinator Gender */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Coordinator Gender <span className="text-red-500">*</span>
                              </label>

                              <div className="flex items-center space-x-6">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name="coordinatorGender"
                                    value="male"
                                    checked={formData.coordinatorGender === "male"}
                                    onChange={() => handleFormChange("coordinatorGender", "male")}
                                  />
                                  <span className="text-sm text-gray-700">Male</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name="coordinatorGender"
                                    value="female"
                                    checked={formData.coordinatorGender === "female"}
                                    onChange={() => handleFormChange("coordinatorGender", "female")}
                                  />
                                  <span className="text-sm text-gray-700">Female</span>
                                </label>
                              </div>
                            </div>


                            {/* Hosted Institute Logo */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hosted Institute Logo (Image)
                              </label>

                              {/* ✅ Show existing logo preview in edit mode */}
                              {editMode && editingBooking?.institute_logo && (
                                <div className="mb-2 flex items-center space-x-3">
                                  <img
                                    src={editingBooking.institute_logo}
                                    alt="Hosted Institute Logo"
                                    className="w-16 h-16 object-contain rounded border border-gray-200 shadow-sm"
                                  />
                                  <span className="text-xs text-gray-500">Current Logo</span>
                                </div>
                              )}

                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFormChange("imageFile", e.target.files[0])}
                                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />

                              {/* ✅ Show chosen file name (if any) */}
                              {formData.imageFile && (
                                <p className="mt-1 text-sm text-gray-700">
                                  Selected file:{" "}
                                  <span className="font-medium text-blue-700">{formData.imageFile.name}</span>
                                </p>
                              )}

                              {/* Optional hint */}
                              <p className="text-xs text-gray-400 mt-1">
                                Upload new logo to replace (Max 500 KB)
                              </p>
                            </div>

                          </>
                        )}

                        {/* === Student Limit / Default Limit === */}
                        {/* === Limit Fields === */}
                        {formData.eventType === "tech_camp" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Student Limit <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={formData.studentLimit || ""}
                              onChange={(e) => handleFormChange("studentLimit", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter student limit"
                              required
                            />
                          </div>
                        )}

                        {formData.eventType === "edp" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Educator Limit <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={formData.totalFacultyLimit || ""}
                              onChange={(e) => handleFormChange("totalFacultyLimit", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter educator limit"
                              required
                            />
                          </div>
                        )}


                        {editMode && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-xs text-orange-800">
                              <strong>Edit Mode:</strong> Click orange highlighted dates in calendar to toggle them.
                            </p>
                          </div>
                        )}

                        {/* === Submit Button === */}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hoveredDate && !trainerId && (
          <div
            ref={tooltipRef}
            className="fixed z-[9999] bg-white shadow-xl rounded-xl p-3 border border-gray-200 text-sm w-60"
            style={{
              top:
                popupPosition.y + 220 > window.innerHeight
                  ? popupPosition.y - 200
                  : popupPosition.y + 10,
              left:
                popupPosition.x + 300 > window.innerWidth
                  ? window.innerWidth - 320
                  : popupPosition.x - 120,
            }}
          >
            <div className="font-semibold text-gray-700 mb-2">
              Trainers on {hoveredDate.available_date}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {["Booked", "Pending", "Available"].map(
                (status) =>
                  hoveredDate.trainers[status]?.length > 0 && (
                    <div key={status}>
                      <div
                        className={`font-medium text-xs mb-1 ${status === "Booked"
                          ? "text-red-600"
                          : status === "Pending"
                            ? "text-yellow-600"
                            : "text-green-600"
                          }`}
                      >
                        {status} ({hoveredDate.trainers[status].length})
                      </div>
                      <ul className="text-gray-700 text-xs ml-2 list-disc">
                        {hoveredDate.trainers[status].map((name, i) => (
                          <li key={i}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )
              )}
            </div>

            <button
              onClick={() => setHoveredDate(null)}
              className="mt-3 text-blue-500 text-xs font-semibold hover:underline"
            >
              Close
            </button>
          </div>
        )}

      </div>
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