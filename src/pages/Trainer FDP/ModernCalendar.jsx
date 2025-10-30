import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Autocomplete,
  Divider,
  Stack,
  alpha,
  useTheme,
  Drawer,
  Chip,
  Fab,
  Card,
  CardContent,
  Tooltip,
  Zoom,
  Slide,
  Fade,
  Alert,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Circle,
  Event,
  Code,
  Search,
  Campaign,
  Close,
  CalendarToday,
  ViewModule,
  ViewWeek,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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

export default function Calendar() {
  const theme = useTheme();
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
  const [dragEnd, setDragEnd] = useState(null);
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

    // Get first Monday of the calendar view
    const startDay = startDate.getDay();
    startDate.setDate(
      startDate.getDate() - (startDay === 0 ? 6 : startDay - 1)
    );

    // Get last Sunday of the calendar view
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

  const weekDates = getWeekDates(currentDate);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => selectedCategories.includes(slot.category));
  }, [slots, selectedCategories]);

  const isDateInSlot = (date) => {
    return filteredSlots.some((slot) => {
      const startDate = new Date(slot.startDate);
      const endDate = new Date(slot.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getSlotSpanForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return filteredSlots.find((slot) => {
      const startDate = new Date(slot.startDate);
      const endDate = new Date(slot.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  // Check if a date range overlaps with existing slots
  const checkDateOverlap = (startDate, endDate) => {
    return slots.some((slot) => {
      const slotStart = new Date(slot.startDate);
      const slotEnd = new Date(slot.endDate);

      // Check for any overlap
      return startDate <= slotEnd && endDate >= slotStart;
    });
  };

  const getDisplaySlotsForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return filteredSlots.filter((slot) => slot.startDate === dateStr);
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

  const handleDateMouseDown = (date) => {
    if (!isSelecting) return;

    // Check if the date is already booked
    if (isDateInSlot(date)) {
      setOverlapError("Cannot select dates that are already booked");
      return;
    }

    setOverlapError("");
    setIsDragging(true);
    setDragStart(date);
    setDragEnd(date);
    setSelectedRange({ start: date, end: date });
  };

  const handleDateMouseEnter = (date) => {
    if (!isDragging || !isSelecting) return;
    setDragEnd(date);

    const start = dragStart <= date ? dragStart : date;
    const end = dragStart <= date ? date : dragStart;

    // Check if any date in the range is already booked
    const currentDate = new Date(start);
    let hasOverlap = false;
    while (currentDate <= end) {
      if (isDateInSlot(currentDate)) {
        hasOverlap = true;
        break;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (hasOverlap) {
      setOverlapError("Cannot select dates that are already booked");
      return;
    }

    setOverlapError("");
    setSelectedRange({ start, end });
  };

  const handleMouseUp = () => {
    if (!isDragging || !isSelecting) return;
    setIsDragging(false);

    if (selectedRange.start && selectedRange.end && !overlapError) {
      setNewSlot((prev) => ({
        ...prev,
        startDate: selectedRange.start,
        endDate: selectedRange.end,
      }));
      setOpenDrawer(true);
      setIsSelecting(false);
    }
  };

  const isDateInRange = (date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const handleCreateSlot = () => {
    if (!newSlot.title || !newSlot.startDate || !newSlot.endDate) return;

    // Check for overlap before creating
    if (checkDateOverlap(newSlot.startDate, newSlot.endDate)) {
      setOverlapError("Selected dates overlap with existing slots");
      return;
    }

    const slot = {
      id: Date.now(),
      ...newSlot,
      startDate: newSlot.startDate.toISOString().split("T")[0],
      endDate: newSlot.endDate.toISOString().split("T")[0],
    };

    setSlots((prev) => [...prev, slot]);
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

  // Get slot range information for week view spanning
  const getSlotRangeInfo = (slot, weekDates) => {
    const startDate = new Date(slot.startDate);
    const endDate = new Date(slot.endDate);

    // Find start and end indices in the current week
    const startIndex = weekDates.findIndex(
      (d) => d.toDateString() === startDate.toDateString()
    );
    const endIndex = weekDates.findIndex(
      (d) => d.toDateString() === endDate.toDateString()
    );

    // If slot doesn't intersect with current week, return null
    if (startIndex === -1 && endIndex === -1) {
      const weekStart = weekDates[0];
      const weekEnd = weekDates[6];
      if (weekStart >= startDate && weekEnd <= endDate) {
        // Entire week is within the slot
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

  const renderMiniCalendar = (year, month) => {
    const monthDates = getMonthDates(year, month);
    const weeks = [];
    for (let i = 0; i < monthDates.length; i += 7) {
      weeks.push(monthDates.slice(i, i + 7));
    }

    return (
      <Fade in={true} timeout={500}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-8px) scale(1.02)",
              boxShadow: 6,
            },
            cursor: "pointer",
            mb: 2,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {monthNames[month]} {year}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
                mb: 1,
              }}
            >
              {weekDaysShort.map((day) => (
                <Typography
                  key={day}
                  variant="caption"
                  sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#64748b",
                    py: 0.5,
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
              }}
            >
              {monthDates.map((date, index) => {
                const hasSlots = isDateInSlot(date);
                const slotSpan = getSlotSpanForDate(date);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isCurrentMonth = date.getMonth() === month;
                const inRange = isDateInRange(date);

                return (
                  <Box
                    key={index}
                    onClick={() => handleMiniCalendarDateClick(date)}
                    sx={{
                      width: "100%",
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      cursor: "pointer",
                      position: "relative",
                      bgcolor: isToday
                        ? "#3b82f6"
                        : inRange
                        ? "#16a34a"
                        : hasSlots
                        ? alpha(
                            slotSpan
                              ? getCategoryInfo(slotSpan.category)?.color ||
                                  "#3b82f6"
                              : "#3b82f6",
                            0.3
                          )
                        : "transparent",
                      color: isToday
                        ? "white"
                        : !isCurrentMonth
                        ? "#94a3b8"
                        : hasSlots || inRange
                        ? "white"
                        : "#1e293b",
                      fontWeight: isToday || hasSlots || inRange ? 600 : 400,
                      "&:hover": {
                        bgcolor: isToday ? "#2563eb" : alpha("#3b82f6", 0.4),
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                      {date.getDate()}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  const renderOverviewMode = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <Box sx={{ p: 3, height: "100vh", overflow: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigateYear(-1)}
              sx={{
                bgcolor: alpha("#3b82f6", 0.1),
                "&:hover": { bgcolor: alpha("#3b82f6", 0.2) },
              }}
            >
              <KeyboardDoubleArrowLeft />
            </IconButton>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, minWidth: 100, textAlign: "center" }}
            >
              {overviewYear}
            </Typography>
            <IconButton
              onClick={() => navigateYear(1)}
              sx={{
                bgcolor: alpha("#3b82f6", 0.1),
                "&:hover": { bgcolor: alpha("#3b82f6", 0.2) },
              }}
            >
              <KeyboardDoubleArrowRight />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            startIcon={<ViewWeek />}
            onClick={() => setViewMode("week")}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              bgcolor: "#3b82f6",
              "&:hover": { bgcolor: "#2563eb" },
            }}
          >
            Week View
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 3,
            width: "100%",
          }}
        >
          {months.map((month) => renderMiniCalendar(overviewYear, month))}
        </Box>
      </Box>
    );
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
          {renderOverviewMode()}
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
          {/* Sidebar */}
          <Paper
            sx={{
              width: 280,
              p: 3,
              bgcolor: "white",
              borderRadius: 0,
              borderRight: "1px solid #e2e8f0",
              boxShadow: "none",
            }}
          >
            {/* Current Date Display */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Today:{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* View Toggle */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant={viewMode === "overview" ? "contained" : "outlined"}
                fullWidth
                startIcon={<ViewModule />}
                onClick={() => {
                  setOverviewYear(currentDate.getFullYear());
                  setViewMode("overview");
                }}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  mb: 1,
                  bgcolor: viewMode === "overview" ? "#3b82f6" : "transparent",
                  color: viewMode === "overview" ? "white" : "#3b82f6",
                  border: "1px solid #3b82f6",
                  "&:hover": {
                    bgcolor:
                      viewMode === "overview"
                        ? "#2563eb"
                        : alpha("#3b82f6", 0.1),
                  },
                }}
              >
                Calendar Overview
              </Button>
            </Box>

            {/* Create Slot Button */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={() => setOpenDrawer(true)}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  bgcolor: "#16a34a",
                  "&:hover": {
                    bgcolor: "#15803d",
                  },
                }}
              >
                Create Slot
              </Button>
            </Box>

            {/* Selection Mode */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant={isSelecting ? "contained" : "outlined"}
                fullWidth
                onClick={() => {
                  setIsSelecting(!isSelecting);
                  setSelectedRange({ start: null, end: null });
                  setIsDragging(false);
                  setOverlapError("");
                }}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  bgcolor: isSelecting ? "#f59e0b" : "transparent",
                  color: isSelecting ? "white" : "#f59e0b",
                  border: "1px solid #f59e0b",
                  "&:hover": {
                    bgcolor: isSelecting ? "#d97706" : alpha("#f59e0b", 0.1),
                  },
                }}
              >
                {isSelecting ? "Cancel Selection" : "Drag to Select Dates"}
              </Button>
              {isSelecting && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    mt: 1,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Click and drag to select date range
                </Typography>
              )}
              {overlapError && (
                <Alert severity="error" sx={{ mt: 1, fontSize: "0.75rem" }}>
                  {overlapError}
                </Alert>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Categories */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Categories
              </Typography>
              <List dense sx={{ p: 0 }}>
                {categories.map((category) => (
                  <ListItem
                    key={category.id}
                    button
                    onClick={() => toggleCategory(category.id)}
                    sx={{
                      borderRadius: "12px",
                      mb: 0.5,
                      px: 1,
                      "&:hover": { bgcolor: alpha(category.color, 0.1) },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Circle
                        sx={{
                          color: category.color,
                          fontSize: 12,
                          opacity: selectedCategories.includes(category.id)
                            ? 1
                            : 0.3,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={category.name}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: selectedCategories.includes(category.id)
                          ? 500
                          : 400,
                        opacity: selectedCategories.includes(category.id)
                          ? 1
                          : 0.6,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>

          {/* Main Calendar */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 0,
                borderBottom: "1px solid #e2e8f0",
                boxShadow: "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <IconButton onClick={() => navigateWeek(-1)}>
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {getWeekRange()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", ml: 1 }}>
                    Week {getWeekNumber()}
                  </Typography>
                  <IconButton onClick={() => navigateWeek(1)}>
                    <ChevronRight />
                  </IconButton>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  {selectedRange.start && selectedRange.end && (
                    <Chip
                      label={`Selected: ${formatDateRange(
                        selectedRange.start,
                        selectedRange.end
                      )}`}
                      color="warning"
                      variant="outlined"
                      onDelete={() => {
                        setSelectedRange({ start: null, end: null });
                        setIsSelecting(false);
                        setOverlapError("");
                      }}
                      sx={{ borderRadius: "12px" }}
                    />
                  )}
                </Stack>
              </Box>
            </Paper>

            {/* Week View */}
            <Box sx={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Slot Range Cards - Positioned above the calendar */}
                {filteredSlots.map((slot) => {
                  const rangeInfo = getSlotRangeInfo(slot, weekDates);
                  if (!rangeInfo) return null;

                  const category = getCategoryInfo(slot.category);
                  const startDate = new Date(slot.startDate);
                  const endDate = new Date(slot.endDate);
                  const duration =
                    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) +
                    1;

                  return (
                    <Box
                      key={`range-${slot.id}`}
                      sx={{
                        position: "absolute",
                        top: "90px",
                        left: `${(rangeInfo.startIndex / 7) * 100}%`,
                        width: `${(rangeInfo.span / 7) * 100}%`,
                        zIndex: 2,
                        px: 1,
                      }}
                    >
                      <Tooltip
                        title={
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {slot.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: "block" }}
                            >
                              Duration: {duration} day{duration > 1 ? "s" : ""}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: "block" }}
                            >
                              {slot.institute}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: "block" }}
                            >
                              {slot.state} • {slot.domain}
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <Paper
                          sx={{
                            p: 1.5,
                            bgcolor: alpha(category.color, 0.1),
                            border: `2px solid ${category.color}`,
                            borderRadius: "12px",
                            cursor: "pointer",
                            overflow: "hidden",
                            "&:hover": {
                              bgcolor: alpha(category.color, 0.15),
                              transform: "translateY(-2px) scale(1.02)",
                              boxShadow: `0 8px 25px ${alpha(
                                category.color,
                                0.3
                              )}`,
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: category.color,
                              mb: 0.5,
                            }}
                          >
                            {slot.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Chip
                              label={`${duration} day${
                                duration > 1 ? "s" : ""
                              }`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                bgcolor: alpha(category.color, 0.2),
                                color: category.color,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748b", display: "block" }}
                          >
                            {slot.institute}
                          </Typography>
                        </Paper>
                      </Tooltip>
                    </Box>
                  );
                })}

                {/* Day Columns */}
                {weekDates.map((date, index) => {
                  const inRange = isDateInRange(date);
                  const hasSlots = isDateInSlot(date);
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const slotSpan = getSlotSpanForDate(date);

                  return (
                    <Box
                      key={index}
                      sx={{
                        borderRight: index < 6 ? "1px solid #e2e8f0" : "none",
                        position: "relative",
                        minHeight: "400px",
                        cursor: isSelecting ? "crosshair" : "default",
                        bgcolor: inRange
                          ? alpha("#16a34a", 0.15)
                          : hasSlots
                          ? alpha(
                              slotSpan
                                ? getCategoryInfo(slotSpan.category)?.color ||
                                    "#3b82f6"
                                : "#3b82f6",
                              0.05
                            )
                          : "transparent",
                        "&:hover": isSelecting
                          ? {
                              bgcolor: hasSlots
                                ? alpha("#ef4444", 0.2)
                                : alpha("#16a34a", 0.2),
                            }
                          : {},
                        userSelect: "none",
                        transition: "background-color 0.1s ease",
                      }}
                      onMouseDown={() => handleDateMouseDown(date)}
                      onMouseEnter={() => handleDateMouseEnter(date)}
                    >
                      {/* Day Header */}
                      <Box
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderBottom: "1px solid #f1f5f9",
                          bgcolor: inRange
                            ? alpha("#16a34a", 0.2)
                            : isToday
                            ? "#eff6ff"
                            : hasSlots
                            ? alpha(
                                slotSpan
                                  ? getCategoryInfo(slotSpan.category)?.color ||
                                      "#3b82f6"
                                  : "#3b82f6",
                                0.1
                              )
                            : "transparent",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          {weekDays[index]}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: inRange
                              ? "#16a34a"
                              : isToday
                              ? "#3b82f6"
                              : hasSlots
                              ? slotSpan
                                ? getCategoryInfo(slotSpan.category)?.color
                                : "#3b82f6"
                              : "#1e293b",
                          }}
                        >
                          {date.getDate()}
                        </Typography>
                        {hasSlots && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: slotSpan
                                ? getCategoryInfo(slotSpan.category)?.color
                                : "#3b82f6",
                              mx: "auto",
                              mt: 0.5,
                            }}
                          />
                        )}
                      </Box>

                      {/* Content Area - Leave space for spanning slot cards */}
                      <Box
                        sx={{
                          p: 1,
                          height: "calc(100% - 80px)",
                          overflow: "auto",
                          pt: 8, // Add padding top to make space for spanning cards
                        }}
                      >
                        {/* Empty space for visual consistency */}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Floating Action Button */}
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

          {/* Create Slot Drawer */}
          <Drawer
            anchor="right"
            open={openDrawer}
            onClose={() => {
              setOpenDrawer(false);
              setSelectedRange({ start: null, end: null });
              setIsSelecting(false);
              setOverlapError("");
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 400,
                p: 0,
              },
            }}
          >
            <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Create New Slot
                </Typography>
                <IconButton
                  onClick={() => {
                    setOpenDrawer(false);
                    setSelectedRange({ start: null, end: null });
                    setIsSelecting(false);
                    setOverlapError("");
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ p: 3, height: "calc(100vh - 80px)", overflow: "auto" }}>
              <Stack spacing={3}>
                {overlapError && <Alert severity="error">{overlapError}</Alert>}

                <TextField
                  label="Slot Title"
                  value={newSlot.title}
                  onChange={(e) =>
                    setNewSlot((prev) => ({ ...prev, title: e.target.value }))
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />

                <Autocomplete
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={
                    categories.find((c) => c.id === newSlot.category) || null
                  }
                  onChange={(_, value) =>
                    setNewSlot((prev) => ({
                      ...prev,
                      category: value?.id || "product-design",
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Circle
                        sx={{ color: option.color, fontSize: 12, mr: 1 }}
                      />
                      {option.name}
                    </Box>
                  )}
                />

                <Autocomplete
                  options={states}
                  value={newSlot.state}
                  onChange={(_, value) =>
                    setNewSlot((prev) => ({ ...prev, state: value || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  )}
                />

                <Autocomplete
                  options={institutes}
                  value={newSlot.institute}
                  onChange={(_, value) =>
                    setNewSlot((prev) => ({ ...prev, institute: value || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Institute"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  )}
                />

                <Autocomplete
                  options={domains}
                  value={newSlot.domain}
                  onChange={(_, value) =>
                    setNewSlot((prev) => ({ ...prev, domain: value || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Domain"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  )}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <DatePicker
                    label="Start Date"
                    value={newSlot.startDate}
                    onChange={(date) =>
                      setNewSlot((prev) => ({ ...prev, startDate: date }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    )}
                  />
                  <DatePicker
                    label="End Date"
                    value={newSlot.endDate}
                    onChange={(date) =>
                      setNewSlot((prev) => ({ ...prev, endDate: date }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Preview Selected Range */}
                {selectedRange.start && selectedRange.end && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: alpha("#16a34a", 0.1),
                      border: `1px solid ${alpha("#16a34a", 0.3)}`,
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "#16a34a" }}
                    >
                      Selected Range
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {formatDateRange(selectedRange.start, selectedRange.end)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            <Box sx={{ p: 3, borderTop: "1px solid #e2e8f0" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateSlot}
                disabled={
                  !newSlot.title ||
                  !newSlot.startDate ||
                  !newSlot.endDate ||
                  !!overlapError
                }
                sx={{
                  bgcolor: "#3b82f6",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#2563eb",
                  },
                  "&:disabled": {
                    bgcolor: "#94a3b8",
                  },
                }}
              >
                Create Slot
              </Button>
            </Box>
          </Drawer>
        </Box>
      </Slide>
    </LocalizationProvider>
  );
}
