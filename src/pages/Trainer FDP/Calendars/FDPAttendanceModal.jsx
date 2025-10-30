import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Checkbox,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarToday as CalendarTodayIcon,
  Save as SaveIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";

// Create custom theme matching AttendanceSystem
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

const FDPAttendanceModal = ({ open, onClose, bookslotId }) => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pendingChanges, setPendingChanges] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  useEffect(() => {
    if (open && bookslotId) {
      fetchAttendanceData();
      setPendingChanges({});
      setCurrentDateIndex(0);
    }
  }, [open, bookslotId]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/event/trainer/${bookslotId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setSnackbar({
        open: true,
        message: "Failed to load attendance data. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (facultyId, date, half, currentValue) => {
    const newValue = currentValue === 1 ? 0 : 1;
    const changeKey = `${date}_${half}`;

    setPendingChanges((prev) => {
      const updated = { ...prev };

      if (!updated[changeKey]) {
        updated[changeKey] = {
          date,
          half,
          changes: {},
        };
      }

      updated[changeKey].changes[facultyId] = newValue;

      return updated;
    });

    setAttendanceData((prev) => {
      const updated = { ...prev };
      const facultyIndex = updated.faculty.findIndex(
        (f) => f.faculty_id === facultyId
      );

      if (facultyIndex !== -1) {
        const attendanceIndex = updated.faculty[
          facultyIndex
        ].attendance.findIndex((a) => a.date === date);

        if (attendanceIndex !== -1) {
          const halfKey = half === "first" ? "first_half" : "second_half";
          updated.faculty[facultyIndex].attendance[attendanceIndex][halfKey] =
            newValue;
        }
      }

      return updated;
    });
  };

  const handleSubmitAttendance = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      setSnackbar({
        open: true,
        message: "No changes to submit",
        severity: "info",
      });
      return;
    }

    try {
      setSubmitting(true);

      for (const changeKey in pendingChanges) {
        const { date, half, changes } = pendingChanges[changeKey];
        const presentFacultyIds = [];
        const absentFacultyIds = [];

        for (const facultyId in changes) {
          const value = changes[facultyId];
          if (value === 1) {
            presentFacultyIds.push(parseInt(facultyId));
          } else {
            absentFacultyIds.push(parseInt(facultyId));
          }
        }

        if (presentFacultyIds.length > 0) {
          const presentPayload = {
            bookslot_id: bookslotId,
            date: date,
            half: half,
            present: true,
            faculty_ids: presentFacultyIds,
          };

          const presentResponse = await fetch(
            `${BASE_URL}/event/mark-attendance/faculty`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(presentPayload),
            }
          );

          if (!presentResponse.ok) {
            throw new Error("Failed to mark present attendance");
          }
        }

        if (absentFacultyIds.length > 0) {
          const absentPayload = {
            bookslot_id: bookslotId,
            date: date,
            half: half,
            present: false,
            faculty_ids: absentFacultyIds,
          };

          const absentResponse = await fetch(
            `${BASE_URL}/event/mark-attendance/faculty`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(absentPayload),
            }
          );

          if (!absentResponse.ok) {
            throw new Error("Failed to mark absent attendance");
          }
        }
      }

      setSnackbar({
        open: true,
        message: "Attendance submitted successfully!",
        severity: "success",
      });

      setPendingChanges({});
      await fetchAttendanceData();
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateShort = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getCurrentAttendanceValue = (facultyId, date, half) => {
    const changeKey = `${date}_${half}`;
    if (
      pendingChanges[changeKey] &&
      pendingChanges[changeKey].changes[facultyId] !== undefined
    ) {
      return pendingChanges[changeKey].changes[facultyId];
    }

    const faculty = attendanceData?.faculty.find(
      (f) => f.faculty_id === facultyId
    );
    if (!faculty) return null;

    const attendance = faculty.attendance.find((a) => a.date === date);
    if (!attendance) return null;

    const halfKey = half === "first" ? "first_half" : "second_half";
    return attendance[halfKey];
  };

  const getAttendanceCheckbox = (facultyId, date, half) => {
    const value = getCurrentAttendanceValue(facultyId, date, half);
    const isChecked = value === 1;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          padding: "2px",
          borderRadius: "4px",
          backgroundColor: isChecked
            ? half === "first"
              ? "#F0F9F0"
              : "#F0F8FF"
            : "transparent",
          border: isChecked
            ? half === "first"
              ? "1px solid #C8E6C9"
              : "1px solid #BBDEFB"
            : "1px solid transparent",
        }}
      >
        <Checkbox
          checked={isChecked}
          onChange={() => handleAttendanceChange(facultyId, date, half, value)}
          size="small"
          sx={{
            color: half === "first" ? "#4CAF50" : "#2196F3",
            "&.Mui-checked": {
              color: half === "first" ? "#4CAF50" : "#2196F3",
            },
          }}
        />
      </Box>
    );
  };

  const getStatusChip = (status) => {
    const statusColors = {
      Selected: { bg: "#DBEAFE", color: "#1E40AF" },
      Pending: { bg: "#FEF3C7", color: "#D97706" },
      Unknown: { bg: "#F3F4F6", color: "#6B7280" },
    };

    const colorScheme = statusColors[status] || statusColors.Unknown;

    return (
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor: colorScheme.bg,
          color: colorScheme.color,
          fontSize: "0.6rem",
          height: "18px",
        }}
      />
    );
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const totalPendingChanges = Object.values(pendingChanges).reduce(
    (sum, item) => sum + Object.keys(item.changes).length,
    0
  );

  // Get all unique dates from attendance data
  const allDates =
    attendanceData?.faculty[0]?.attendance.map((att) => att.date) || [];
  const currentDate = allDates[currentDateIndex];

  const canNavigatePrevious = currentDateIndex > 0;
  const canNavigateNext = currentDateIndex < allDates.length - 1;

  const handlePreviousDate = () => {
    if (canNavigatePrevious) {
      setCurrentDateIndex((prev) => prev - 1);
    }
  };

  const handleNextDate = () => {
    if (canNavigateNext) {
      setCurrentDateIndex((prev) => prev + 1);
    }
  };

  // Check if all faculty are present for first half on current date
  const areAllPresentFirstHalf =
    attendanceData?.faculty.every(
      (faculty) =>
        getCurrentAttendanceValue(faculty.faculty_id, currentDate, "first") ===
        1
    ) || false;

  // Check if all faculty are present for second half on current date
  const areAllPresentSecondHalf =
    attendanceData?.faculty.every(
      (faculty) =>
        getCurrentAttendanceValue(faculty.faculty_id, currentDate, "second") ===
        1
    ) || false;

  // Check if some (but not all) faculty are present for first half
  const areSomePresentFirstHalf =
    attendanceData?.faculty.some(
      (faculty) =>
        getCurrentAttendanceValue(faculty.faculty_id, currentDate, "first") ===
        1
    ) && !areAllPresentFirstHalf;

  // Check if some (but not all) faculty are present for second half
  const areSomePresentSecondHalf =
    attendanceData?.faculty.some(
      (faculty) =>
        getCurrentAttendanceValue(faculty.faculty_id, currentDate, "second") ===
        1
    ) && !areAllPresentSecondHalf;

  // Handle check all for first half
  const handleCheckAllFirstHalf = (checked) => {
    if (!attendanceData) return;

    attendanceData.faculty.forEach((faculty) => {
      const currentValue = getCurrentAttendanceValue(
        faculty.faculty_id,
        currentDate,
        "first"
      );
      const newValue = checked ? 1 : 0;

      // Only update if value is different
      if (currentValue !== newValue) {
        handleAttendanceChange(
          faculty.faculty_id,
          currentDate,
          "first",
          currentValue
        );
      }
    });
  };

  // Handle check all for second half
  const handleCheckAllSecondHalf = (checked) => {
    if (!attendanceData) return;

    attendanceData.faculty.forEach((faculty) => {
      const currentValue = getCurrentAttendanceValue(
        faculty.faculty_id,
        currentDate,
        "second"
      );
      const newValue = checked ? 1 : 0;

      // Only update if value is different
      if (currentValue !== newValue) {
        handleAttendanceChange(
          faculty.faculty_id,
          currentDate,
          "second",
          currentValue
        );
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E5E7EB",
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 24, color: "#3F51B5" }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1F2937" }}>
              Faculty Attendance
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#6B7280",
              "&:hover": { backgroundColor: "#F3F4F6" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Box>
              <Paper
                sx={{ p: 2, mb: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <Skeleton
                  variant="text"
                  width={120}
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Skeleton variant="text" width={200} height={16} />
                  <Skeleton variant="text" width={150} height={16} />
                  <Skeleton variant="text" width={100} height={16} />
                </Box>
              </Paper>

              <TableContainer
                component={Paper}
                sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Institute</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Skeleton
                              variant="circular"
                              width={28}
                              height={28}
                            />
                            <Skeleton variant="text" width={120} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={150} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={120} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={60} height={18} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : attendanceData ? (
            <Box>
              {/* Event Details */}
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  backgroundColor: "#F9FAFB",
                  mt: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 1.5, color: "#1F2937", fontWeight: 600 }}
                >
                  Event Details
                </Typography>
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Typography variant="body2" sx={{ color: "#4B5563" }}>
                    <strong>Event Type:</strong>{" "}
                    <Chip
                      label={attendanceData.event.event_type.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: "#E0E7FF",
                        color: "#4338CA",
                        ml: 1,
                      }}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4B5563" }}>
                    <strong>Duration:</strong>{" "}
                    {formatDateRange(
                      attendanceData.event.start_date,
                      attendanceData.event.end_date
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4B5563" }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={attendanceData.event.event_status}
                      size="small"
                      sx={{
                        backgroundColor: "#DBEAFE",
                        color: "#1E40AF",
                        ml: 1,
                      }}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4B5563" }}>
                    <strong>Faculty Count:</strong>{" "}
                    {attendanceData.faculty_count} /{" "}
                    {attendanceData.event.faculty_limit}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4B5563" }}>
                    <strong>Trainer:</strong>{" "}
                    {attendanceData.event.trainer_name}
                  </Typography>
                </Box>
              </Paper>

              {/* Date Navigation */}
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  onClick={handlePreviousDate}
                  disabled={!canNavigatePrevious}
                  sx={{
                    backgroundColor: canNavigatePrevious
                      ? "#F3F4F6"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: canNavigatePrevious
                        ? "#E5E7EB"
                        : "transparent",
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1F2937", mb: 0.5 }}
                  >
                    {formatDate(currentDate)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Day {currentDateIndex + 1} of {allDates.length}
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleNextDate}
                  disabled={!canNavigateNext}
                  sx={{
                    backgroundColor: canNavigateNext
                      ? "#F3F4F6"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: canNavigateNext
                        ? "#E5E7EB"
                        : "transparent",
                    },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Paper>

              {/* Pending Changes Alert */}
              {hasPendingChanges && (
                <Alert
                  severity="warning"
                  sx={{
                    mb: 2,
                    fontSize: "0.75rem",
                    "& .MuiAlert-message": { fontSize: "0.75rem" },
                  }}
                  //   action={
                  //     <Button
                  //       color="inherit"
                  //       size="small"
                  //       onClick={handleSubmitAttendance}
                  //       disabled={submitting}
                  //       startIcon={submitting ? null : <SaveIcon />}
                  //     >
                  //       {submitting ? "Submitting..." : "Submit Now"}
                  //     </Button>
                  //   }
                >
                  You have {totalPendingChanges} unsaved changes. Click Submit
                  to save attendance.
                </Alert>
              )}

              {/* Attendance Table */}
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #E5E7EB",
                  mb: 2,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#F8FAFC",
                        borderBottom: "2px solid #D1D5DB",
                      }}
                    >
                      {/* Attendance Columns First with Check All */}
                      <TableCell
                        align="center"
                        sx={{ borderRight: "1px solid #E5E7EB" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#374151" }}
                          >
                            1st Half
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "2px",
                              borderRadius: "4px",
                              backgroundColor: areAllPresentFirstHalf
                                ? "#F0F9F0"
                                : "transparent",
                              border: areAllPresentFirstHalf
                                ? "1px solid #C8E6C9"
                                : "1px solid transparent",
                            }}
                          >
                            <Checkbox
                              checked={areAllPresentFirstHalf}
                              indeterminate={areSomePresentFirstHalf}
                              onChange={(e) =>
                                handleCheckAllFirstHalf(e.target.checked)
                              }
                              size="small"
                              sx={{
                                color: "#4CAF50",
                                "&.Mui-checked": {
                                  color: "#4CAF50",
                                },
                                "&.MuiCheckbox-indeterminate": {
                                  color: "#4CAF50",
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderRight: "1px solid #E5E7EB" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#374151" }}
                          >
                            2nd Half
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "2px",
                              borderRadius: "4px",
                              backgroundColor: areAllPresentSecondHalf
                                ? "#F0F8FF"
                                : "transparent",
                              border: areAllPresentSecondHalf
                                ? "1px solid #BBDEFB"
                                : "1px solid transparent",
                            }}
                          >
                            <Checkbox
                              checked={areAllPresentSecondHalf}
                              indeterminate={areSomePresentSecondHalf}
                              onChange={(e) =>
                                handleCheckAllSecondHalf(e.target.checked)
                              }
                              size="small"
                              sx={{
                                color: "#2196F3",
                                "&.Mui-checked": {
                                  color: "#2196F3",
                                },
                                "&.MuiCheckbox-indeterminate": {
                                  color: "#2196F3",
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Faculty Details */}
                      <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#374151" }}
                        >
                          Faculty
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#374151" }}
                        >
                          Email
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#374151" }}
                        >
                          Designation
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#374151" }}
                        >
                          Branch
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#374151" }}
                        >
                          Institute
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#374151" }}
                        >
                          Status
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData.faculty.map((faculty, index) => (
                      <TableRow
                        key={faculty.faculty_id}
                        hover
                        sx={{
                          "&:hover": { backgroundColor: "#F9FAFB" },
                          "& td": {
                            borderBottom:
                              index === attendanceData.faculty.length - 1
                                ? "none"
                                : "1px solid #E5E7EB",
                          },
                        }}
                      >
                        {/* Attendance Checkboxes First */}
                        <TableCell
                          align="center"
                          sx={{ borderRight: "1px solid #E5E7EB", px: 0.5 }}
                        >
                          {getAttendanceCheckbox(
                            faculty.faculty_id,
                            currentDate,
                            "first"
                          )}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderRight: "1px solid #E5E7EB", px: 0.5 }}
                        >
                          {getAttendanceCheckbox(
                            faculty.faculty_id,
                            currentDate,
                            "second"
                          )}
                        </TableCell>

                        {/* Faculty Details */}
                        <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                backgroundColor: getRandomColor(index),
                                fontWeight: 600,
                                fontSize: "0.6rem",
                              }}
                            >
                              {getInitials(faculty.name)}
                            </Avatar>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "#1F2937",
                                lineHeight: 1.2,
                              }}
                            >
                              {faculty.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                          <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            {faculty.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                          <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            {faculty.designation}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                          <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            {faculty.branch || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6B7280",
                              fontSize: "0.65rem",
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={faculty.institute_name}
                          >
                            {faculty.institute_name}
                          </Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(faculty.status)}</TableCell>
                      </TableRow>
                    ))}
                    {attendanceData.faculty.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            No faculty data available.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Submit Button */}
              {hasPendingChanges && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setPendingChanges({});
                      fetchAttendanceData();
                    }}
                    disabled={submitting}
                    sx={{
                      borderColor: "#D1D5DB",
                      color: "#6B7280",
                      "&:hover": {
                        borderColor: "#9CA3AF",
                        backgroundColor: "#F3F4F6",
                      },
                    }}
                  >
                    Cancel Changes
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmitAttendance}
                    disabled={submitting}
                    startIcon={<SaveIcon />}
                    sx={{
                      backgroundColor: "#3F51B5",
                      "&:hover": {
                        backgroundColor: "#303F9F",
                      },
                    }}
                  >
                    {submitting
                      ? "Submitting..."
                      : `Submit Attendance (${totalPendingChanges})`}
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                No data available
              </Typography>
            </Box>
          )}
        </DialogContent>

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
      </Dialog>
    </ThemeProvider>
  );
};

export default FDPAttendanceModal;
