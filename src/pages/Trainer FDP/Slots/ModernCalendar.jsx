import React, { useState, useMemo } from "react";
import { Box, Fab, Slide, alpha } from "@mui/material";
import { Add, Event, Code, Search, Campaign } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Import the component files (you would need to create these files separately)
import Sidebar from "./Sidebar";
import WeekView from "./WeekView";
import OverviewMode from "./OverviewMode";
import SlotDrawer from "./SlotDrawer";

const categories = [
  {
    id: "product-design",
    name: "Product Design",
    color: "#4CAF50",
    icon: Event,
  },
  {
    id: "software-engineering",
    name: "Software Engineering",
    color: "#2196F3",
    icon: Code,
  },
  {
    id: "user-research",
    name: "User Research",
    color: "#9C27B0",
    icon: Search,
  },
  { id: "marketing", name: "Marketing", color: "#F44336", icon: Campaign },
];

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const institutes = [
  "Indian Institute of Technology (IIT)",
  "Indian Institute of Management (IIM)",
  "National Institute of Technology (NIT)",
  "Indian Institute of Science (IISc)",
  "All India Institute of Medical Sciences (AIIMS)",
  "Jawaharlal Nehru University (JNU)",
  "University of Delhi",
  "Banaras Hindu University",
  "Jamia Millia Islamia",
  "Manipal Academy of Higher Education",
  "Vellore Institute of Technology (VIT)",
  "SRM Institute of Science and Technology",
  "Amity University",
  "Lovely Professional University",
];

const domains = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Aerospace Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Business Administration",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations Management",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Law",
  "Architecture",
  "Design",
  "Arts & Humanities",
];

const initialSlots = [
  {
    id: 1,
    title: "Product Design Workshop",
    category: "product-design",
    startDate: "2025-09-14",
    endDate: "2025-09-16",
    state: "Karnataka",
    institute: "Indian Institute of Technology (IIT)",
    domain: "Computer Science & Engineering",
  },
  {
    id: 2,
    title: "User Research Training",
    category: "user-research",
    startDate: "2025-09-18",
    endDate: "2025-09-20",
    state: "Maharashtra",
    institute: "Indian Institute of Management (IIM)",
    domain: "Business Administration",
  },
  {
    id: 3,
    title: "Software Engineering Bootcamp",
    category: "software-engineering",
    startDate: "2025-09-22",
    endDate: "2025-09-25",
    state: "Delhi",
    institute: "Indian Institute of Technology (IIT)",
    domain: "Computer Science & Engineering",
  },
];

export default function ModernCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [overviewYear, setOverviewYear] = useState(new Date().getFullYear());
  const [slots, setSlots] = useState(initialSlots);
  const [selectedCategories, setSelectedCategories] = useState(
    categories.map((c) => c.id)
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [viewMode, setViewMode] = useState("week"); // "week" or "overview"
  const [animatingToDate, setAnimatingToDate] = useState(null);
  const [overlapError, setOverlapError] = useState("");
  const [newSlot, setNewSlot] = useState({
    title: "",
    category: "product-design",
    state: "",
    institute: "",
    domain: "",
    startDate: null,
    endDate: null,
  });

  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const weekDaysShort = ["M", "T", "W", "T", "F", "S", "S"];
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

  // Utility functions
  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate);
    }
    return weekDates;
  };

  const getMonthDates = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    const startDay = startDate.getDay();
    startDate.setDate(
      startDate.getDate() - (startDay === 0 ? 6 : startDay - 1)
    );

    const endDay = endDate.getDay();
    endDate.setDate(endDate.getDate() + (endDay === 0 ? 0 : 7 - endDay));

    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Helper function to format date to YYYY-MM-DD string
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to normalize dates for comparison (set time to 00:00:00)
  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const weekDates = getWeekDates(currentDate);
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => selectedCategories.includes(slot.category));
  }, [slots, selectedCategories]);

  const isDateInSlot = (date) => {
    const normalizedDate = normalizeDate(date);
    return filteredSlots.some((slot) => {
      const startDate = normalizeDate(new Date(slot.startDate));
      const endDate = normalizeDate(new Date(slot.endDate));
      return normalizedDate >= startDate && normalizedDate <= endDate;
    });
  };

  const getSlotSpanForDate = (date) => {
    const normalizedDate = normalizeDate(date);
    return filteredSlots.find((slot) => {
      const startDate = normalizeDate(new Date(slot.startDate));
      const endDate = normalizeDate(new Date(slot.endDate));
      return normalizedDate >= startDate && normalizedDate <= endDate;
    });
  };

  // FIXED: Proper overlap detection that only checks for actual overlaps
  const hasOverlapWithExistingSlots = (newStart, newEnd) => {
    const normalizedNewStart = normalizeDate(newStart);
    const normalizedNewEnd = normalizeDate(newEnd);

    return slots.some((slot) => {
      const slotStart = normalizeDate(new Date(slot.startDate));
      const slotEnd = normalizeDate(new Date(slot.endDate));

      // Two ranges overlap if: newStart <= slotEnd AND newEnd >= slotStart
      return normalizedNewStart <= slotEnd && normalizedNewEnd >= slotStart;
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    setOverviewYear((prev) => prev + direction);
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // FIXED: Simplified drag logic
  const handleDateMouseDown = (date) => {
    if (!isSelecting) return;

    setOverlapError(""); // Clear any previous errors
    setIsDragging(true);
    setDragStart(date);
    setSelectedRange({ start: date, end: date });
  };

  const handleDateMouseEnter = (date) => {
    if (!isDragging || !isSelecting || !dragStart) return;

    const start = dragStart <= date ? dragStart : date;
    const end = dragStart <= date ? date : dragStart;

    setSelectedRange({ start, end });

    // Only show error, don't prevent selection during drag
    if (hasOverlapWithExistingSlots(start, end)) {
      setOverlapError("Selection overlaps with existing slots");
    } else {
      setOverlapError("");
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !isSelecting) return;
    setIsDragging(false);

    if (selectedRange.start && selectedRange.end) {
      // Check for overlap one final time
      if (hasOverlapWithExistingSlots(selectedRange.start, selectedRange.end)) {
        setOverlapError(
          "Cannot create slot - dates overlap with existing slots"
        );
        setSelectedRange({ start: null, end: null });
        return;
      }

      // If no overlap, proceed with slot creation
      setNewSlot((prev) => ({
        ...prev,
        startDate: selectedRange.start,
        endDate: selectedRange.end,
      }));
      setOpenDrawer(true);
      setIsSelecting(false);
      setOverlapError("");
    }
  };

  const isDateInRange = (date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(selectedRange.start);
    const normalizedEnd = normalizeDate(selectedRange.end);
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  };

  // FIXED: Slot creation logic
  const handleCreateSlot = () => {
    if (!newSlot.title.trim()) {
      setOverlapError("Please enter a slot title");
      return;
    }

    if (!newSlot.startDate || !newSlot.endDate) {
      setOverlapError("Please select start and end dates");
      return;
    }

    // Final overlap check
    if (hasOverlapWithExistingSlots(newSlot.startDate, newSlot.endDate)) {
      setOverlapError("Selected dates overlap with existing slots");
      return;
    }

    const slot = {
      id: Date.now(),
      title: newSlot.title.trim(),
      category: newSlot.category,
      state: newSlot.state,
      institute: newSlot.institute,
      domain: newSlot.domain,
      startDate: formatDateToString(newSlot.startDate),
      endDate: formatDateToString(newSlot.endDate),
    };

    console.log("Creating slot:", slot); // Debug log

    setSlots((prev) => {
      const updated = [...prev, slot];
      console.log("Updated slots:", updated); // Debug log
      return updated;
    });

    // Reset everything
    setNewSlot({
      title: "",
      category: "product-design",
      state: "",
      institute: "",
      domain: "",
      startDate: null,
      endDate: null,
    });
    setSelectedRange({ start: null, end: null });
    setOverlapError("");
    setOpenDrawer(false);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((c) => c.id === categoryId);
  };

  const formatDateRange = (start, end) => {
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return formatDateRange(start, end);
  };

  const getWeekNumber = () => {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
      (currentDate - startOfYear) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  const handleMiniCalendarDateClick = (date) => {
    setAnimatingToDate(date);
    setTimeout(() => {
      setCurrentDate(date);
      setViewMode("week");
      setAnimatingToDate(null);
    }, 300);
  };

  const getSlotRangeInfo = (slot, weekDates) => {
    const startDate = new Date(slot.startDate);
    const endDate = new Date(slot.endDate);

    const startIndex = weekDates.findIndex(
      (d) => d.toDateString() === startDate.toDateString()
    );
    const endIndex = weekDates.findIndex(
      (d) => d.toDateString() === endDate.toDateString()
    );

    if (startIndex === -1 && endIndex === -1) {
      const weekStart = weekDates[0];
      const weekEnd = weekDates[6];
      if (weekStart >= startDate && weekEnd <= endDate) {
        return { startIndex: 0, endIndex: 6, span: 7 };
      }
      return null;
    }

    const actualStart = Math.max(0, startIndex === -1 ? 0 : startIndex);
    const actualEnd = Math.min(6, endIndex === -1 ? 6 : endIndex);

    return {
      startIndex: actualStart,
      endIndex: actualEnd,
      span: actualEnd - actualStart + 1,
    };
  };

  if (viewMode === "overview") {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            bgcolor: "#f8fafc",
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            minHeight: "100vh",
          }}
        >
          <OverviewMode
            overviewYear={overviewYear}
            navigateYear={navigateYear}
            setViewMode={setViewMode}
            monthNames={monthNames}
            weekDaysShort={weekDaysShort}
            isDateInSlot={isDateInSlot}
            isDateInRange={isDateInRange}
            getSlotSpanForDate={getSlotSpanForDate}
            getCategoryInfo={getCategoryInfo}
            handleMiniCalendarDateClick={handleMiniCalendarDateClick}
            getMonthDates={getMonthDates}
          />
        </Box>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Slide
        direction="right"
        in={!animatingToDate}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            bgcolor: "#f8fafc",
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Sidebar
            currentDate={currentDate}
            monthNames={monthNames}
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setOverviewYear={setOverviewYear}
            setOpenDrawer={setOpenDrawer}
            isSelecting={isSelecting}
            setIsSelecting={setIsSelecting}
            setSelectedRange={setSelectedRange}
            setIsDragging={setIsDragging}
            setOverlapError={setOverlapError}
            overlapError={overlapError}
          />

          <WeekView
            currentDate={currentDate}
            weekDates={weekDates}
            weekDays={weekDays}
            filteredSlots={filteredSlots}
            selectedRange={selectedRange}
            isSelecting={isSelecting}
            isDateInSlot={isDateInSlot}
            isDateInRange={isDateInRange}
            getSlotSpanForDate={getSlotSpanForDate}
            getCategoryInfo={getCategoryInfo}
            handleDateMouseDown={handleDateMouseDown}
            handleDateMouseEnter={handleDateMouseEnter}
            formatDateRange={formatDateRange}
            setSelectedRange={setSelectedRange}
            setIsSelecting={setIsSelecting}
            setOverlapError={setOverlapError}
            navigateWeek={navigateWeek}
            getWeekRange={getWeekRange}
            getWeekNumber={getWeekNumber}
            getSlotRangeInfo={getSlotRangeInfo}
          />

          <Fab
            color="primary"
            onClick={() => setOpenDrawer(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              bgcolor: "#3b82f6",
              "&:hover": {
                bgcolor: "#2563eb",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Add />
          </Fab>

          <SlotDrawer
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            newSlot={newSlot}
            setNewSlot={setNewSlot}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            setIsSelecting={setIsSelecting}
            overlapError={overlapError}
            setOverlapError={setOverlapError}
            handleCreateSlot={handleCreateSlot}
            formatDateRange={formatDateRange}
            categories={categories}
            states={states}
            institutes={institutes}
            domains={domains}
          />
        </Box>
      </Slide>
    </LocalizationProvider>
  );
}
