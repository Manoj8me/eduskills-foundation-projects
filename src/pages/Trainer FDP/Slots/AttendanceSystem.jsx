import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  IconButton,
  Box,
  Typography,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
  Skeleton,
  Chip,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarTodayIcon,
  Computer as ComputerIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import AttendanceTable from "./AttendanceTable";

// Create custom theme with curved inputs and compact sizing
const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
    fontSize: 12,
    body1: { fontSize: "0.75rem" },
    body2: { fontSize: "0.7rem" },
    h6: { fontSize: "0.9rem" },
    h4: { fontSize: "1.5rem" },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "6px 8px",
          fontSize: "0.7rem",
        },
        head: {
          fontSize: "0.75rem",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: "0.75rem",
            "&:hover fieldset": {
              borderColor: "#3f51b5",
            },
          },
          "& .MuiInputBase-input": {
            padding: "8px 12px",
            fontSize: "0.75rem",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.75rem",
          padding: "6px 16px",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "4px",
          fontSize: "0.8rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "0.65rem",
          height: "20px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#3f51b5",
      light: "#7986cb",
      dark: "#303f9f",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    error: {
      main: "#f44336",
      light: "#ef5350",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    background: {
      default: "#f8f9fa",
    },
  },
});

const StudentTechCampAttendanceSystem = () => {
  const { bookingId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [students, setStudents] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [attendance, setAttendance] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/event/trainer/${bookingId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }
        const data = await response.json();
        setEventData(data);

        const transformedStudents = data.students.map((student, index) => ({
          id: student.student_id.toString(),
          name: student.name,
          email: student.email,
          track: student.domains,
          mobile: student.rollNo,
          branch: student.branch || "N/A",
          passoutYear: student.passoutYear,
          rollNo: student.rollNo,
          cohorts: student.cohorts,
          avatar: getRandomColor(index),
          initials: getInitials(student.name),
          day1_firsthalf: student.day1_firsthalf,
          day1_secondhalf: student.day1_secondhalf,
          day2_firsthalf: student.day2_firsthalf,
          day2_secondhalf: student.day2_secondhalf,
          day3_firsthalf: student.day3_firsthalf,
          day3_secondhalf: student.day3_secondhalf,
          day4_firsthalf: student.day4_firsthalf,
          day4_secondhalf: student.day4_secondhalf,
          day5_firsthalf: student.day5_firsthalf,
          day5_secondhalf: student.day5_secondhalf,
        }));

        setStudents(transformedStudents);

        if (data.event.start_date) {
          setSelectedDate(new Date(data.event.start_date));
        }

        initializeAttendanceData(transformedStudents, data.event);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load event data. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchEventData();
    }
  }, [bookingId]);

  const initializeAttendanceData = (studentsData, eventInfo) => {
    const startDate = new Date(eventInfo.start_date);
    const endDate = new Date(eventInfo.end_date);
    const attendanceData = {};

    const diffTime = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (day - 1));
      const dateKey = currentDate.toISOString().split("T")[0];

      attendanceData[dateKey] = {};

      studentsData.forEach((student) => {
        const firstHalfKey = `day${day}_firsthalf`;
        const secondHalfKey = `day${day}_secondhalf`;

        attendanceData[dateKey][student.id] = {
          firstHalf:
            student[firstHalfKey] === 1
              ? "present"
              : student[firstHalfKey] === 0
              ? "absent"
              : null,
          secondHalf:
            student[secondHalfKey] === 1
              ? "present"
              : student[secondHalfKey] === 0
              ? "absent"
              : null,
        };
      });
    }

    setAttendance(attendanceData);
  };

  const getRandomColor = (index) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#DDA0DD",
      "#87CEEB",
      "#F0E68C",
      "#FFB6C1",
      "#20B2AA",
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getDateKey = (date) => {
    if (typeof date === "string") return date;
    return date.toISOString().split("T")[0];
  };

  const getDayNumber = (selectedDate) => {
    if (!eventData?.event?.start_date) return 1;

    const startDate = new Date(eventData.event.start_date);
    const currentDate = new Date(selectedDate);

    startDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1;
  };

  const formatDateRange = (startDate, endDate) => {
    const formatSingleDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    return `${formatSingleDate(startDate)} - ${formatSingleDate(endDate)}`;
  };

  const getEventDates = () => {
    if (!eventData?.event) return [];

    const startDate = new Date(eventData.event.start_date);
    const endDate = new Date(eventData.event.end_date);
    const dates = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const navigateToPreviousDate = () => {
    const eventDates = getEventDates();
    const currentIndex = eventDates.findIndex(
      (date) =>
        date.toISOString().split("T")[0] ===
        selectedDate.toISOString().split("T")[0]
    );

    if (currentIndex > 0) {
      setSelectedDate(eventDates[currentIndex - 1]);
      setPendingChanges({});
    }
  };

  const navigateToNextDate = () => {
    const eventDates = getEventDates();
    const currentIndex = eventDates.findIndex(
      (date) =>
        date.toISOString().split("T")[0] ===
        selectedDate.toISOString().split("T")[0]
    );

    if (currentIndex >= 0 && currentIndex < eventDates.length - 1) {
      setSelectedDate(eventDates[currentIndex + 1]);
      setPendingChanges({});
    }
  };

  // Handle local checkbox changes (not submitted yet)
  const handleAttendanceChange = (studentId, session, isPresent) => {
    const dateKey = getDateKey(selectedDate);
    const changeKey = `${studentId}-${session}`;

    setPendingChanges((prev) => ({
      ...prev,
      [changeKey]: {
        studentId,
        session,
        isPresent,
        dateKey,
      },
    }));

    // Update local UI state
    setAttendance((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [studentId]: {
          ...prev[dateKey]?.[studentId],
          [session]: isPresent ? "present" : "absent",
        },
      },
    }));
  };

  // Handle bulk changes (not submitted yet)
  const handleBulkChange = (session, isPresent) => {
    const dateKey = getDateKey(selectedDate);
    const newPendingChanges = { ...pendingChanges };

    students.forEach((student) => {
      const changeKey = `${student.id}-${session}`;
      newPendingChanges[changeKey] = {
        studentId: student.id,
        session,
        isPresent,
        dateKey,
      };
    });

    setPendingChanges(newPendingChanges);

    // Update local UI state
    setAttendance((prev) => {
      const newAttendance = { ...prev };
      students.forEach((student) => {
        newAttendance[dateKey] = {
          ...newAttendance[dateKey],
          [student.id]: {
            ...newAttendance[dateKey]?.[student.id],
            [session]: isPresent ? "present" : "absent",
          },
        };
      });
      return newAttendance;
    });
  };

  // Submit all pending changes
  const handleSubmitAttendance = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      setSnackbar({
        open: true,
        message: "No changes to submit",
        severity: "info",
      });
      return;
    }

    setSubmitting(true);

    try {
      const promises = Object.values(pendingChanges).map((change) => {
        const payload = {
          bookslot_id: parseInt(bookingId),
          student_id: parseInt(change.studentId),
          day: getDayNumber(selectedDate),
          half: change.session === "firstHalf" ? "first" : "second",
          present: change.isPresent,
        };

        return fetch(`${BASE_URL}/event/mark-attendance`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      });

      const results = await Promise.all(promises);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        setSnackbar({
          open: true,
          message: `Successfully submitted attendance for ${
            Object.keys(pendingChanges).length
          } entries`,
          severity: "success",
        });
        setPendingChanges({});
      } else {
        throw new Error("Some attendance submissions failed");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit attendance. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getAttendanceStatus = (studentId, session) => {
    const dateKey = getDateKey(selectedDate);
    return attendance[dateKey]?.[studentId]?.[session];
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBackToDashboard = () => {
    window.history.back();
  };

  const getBranchColor = (branch) => {
    const colors = {
      CSE: "#3B82F6",
      "AI & DS": "#10B981",
      ETC: "#F59E0B",
      "Civil engineering": "#8B5CF6",
      Mechanical: "#EF4444",
    };
    return colors[branch] || "#6B7280";
  };

  const canNavigatePrevious = () => {
    const eventDates = getEventDates();
    const currentIndex = eventDates.findIndex(
      (date) =>
        date.toISOString().split("T")[0] ===
        selectedDate.toISOString().split("T")[0]
    );
    return currentIndex > 0;
  };

  const canNavigateNext = () => {
    const eventDates = getEventDates();
    const currentIndex = eventDates.findIndex(
      (date) =>
        date.toISOString().split("T")[0] ===
        selectedDate.toISOString().split("T")[0]
    );
    return currentIndex >= 0 && currentIndex < eventDates.length - 1;
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            p: 2,
            maxWidth: 1600,
            mx: "auto",
            backgroundColor: "#FAFBFC",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={200} height={32} />
          </Box>
          <Paper sx={{ p: 2, mb: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Skeleton variant="text" width={200} height={16} />
              <Skeleton variant="text" width={150} height={16} />
              <Skeleton variant="text" width={100} height={16} />
            </Box>
          </Paper>
          <Box sx={{ mb: 1 }}>
            <Skeleton variant="text" width={250} height={24} />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 2,
          maxWidth: 1800,
          mx: "auto",
          backgroundColor: "#FAFBFC",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            gap: 1,
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={handleBackToDashboard}
            sx={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#F5F5F5",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
            size="small"
          >
            <ArrowBackIcon sx={{ color: "#3F51B5", fontSize: "1rem" }} />
          </IconButton>
          <ComputerIcon sx={{ fontSize: 24, color: "#3F51B5", mr: 1 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#2C3E50" }}
          >
            Student Attendance
          </Typography>
        </Box>

        {/* Event Info */}
        {eventData && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "#1F2937", fontWeight: 600 }}
            >
              Event Details
            </Typography>
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Typography variant="body2" sx={{ color: "#4B5563" }}>
                <strong>Institute:</strong>{" "}
                {eventData.event.institute_name || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#4B5563" }}>
                <strong>Duration:</strong>{" "}
                {formatDateRange(
                  eventData.event.start_date,
                  eventData.event.end_date
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: "#4B5563" }}>
                <strong>Total Students:</strong> {eventData.students_count}
              </Typography>
              <Typography variant="body2" sx={{ color: "#4B5563" }}>
                <strong>Day:</strong> {getDayNumber(selectedDate)}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Pending Changes Alert */}
        {hasPendingChanges && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              fontSize: "0.75rem",
              "& .MuiAlert-message": { fontSize: "0.75rem" },
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleSubmitAttendance}
                disabled={submitting}
                startIcon={submitting ? null : <SaveIcon />}
              >
                {submitting ? "Submitting..." : "Submit Now"}
              </Button>
            }
          >
            You have {Object.keys(pendingChanges).length} unsaved changes. Click
            Submit to save attendance.
          </Alert>
        )}

        {/* Attendance Table */}
        <Box sx={{ flexGrow: 1 }}>
          <AttendanceTable
            students={students}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            attendance={attendance}
            handleAttendanceChange={handleAttendanceChange}
            handleBulkChange={handleBulkChange}
            getAttendanceStatus={getAttendanceStatus}
            getBranchColor={getBranchColor}
            formatDate={formatDate}
            getDayNumber={getDayNumber}
            loading={loading}
            navigateToPreviousDate={navigateToPreviousDate}
            navigateToNextDate={navigateToNextDate}
            canNavigatePrevious={canNavigatePrevious}
            canNavigateNext={canNavigateNext}
            hasPendingChanges={hasPendingChanges}
            pendingChangesCount={Object.keys(pendingChanges).length}
            onSubmit={handleSubmitAttendance}
            submitting={submitting}
          />
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ borderRadius: "6px", fontSize: "0.75rem" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            py: 2,
            textAlign: "center",
            borderTop: "1px solid #E5E7EB",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              fontSize: "0.7rem",
            }}
          >
            © {new Date().getFullYear()} Eduskills Foundation. All rights
            reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudentTechCampAttendanceSystem;
