import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  ArrowBack,
  CalendarMonth,
  TableChart,
  Visibility,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import CalendarView from "./CalendarView";
import TableView from "./TableView";
import BookingModal from "./BookingModal";
import StudentSelection from "./StudentSelection";
import ViewStudents from "./ViewStudents";

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState("calendar");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [bookings, filter]);

  const fetchBookings = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/event/all-bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...bookings];

    switch (filter) {
      case "booked":
        filtered = bookings.filter((booking) => booking.students_added > 0);
        break;
      case "not_booked":
        filtered = bookings.filter((booking) => booking.students_added === 0);
        break;
      case "fully_booked":
        filtered = bookings.filter(
          (booking) =>
            booking.students_limit > 0 &&
            booking.students_added >= booking.students_limit
        );
        break;
      case "available":
        filtered = bookings.filter(
          (booking) =>
            booking.students_limit === 0 ||
            booking.students_added < booking.students_limit
        );
        break;
      case "upcoming":
        filtered = bookings.filter(
          (booking) => booking.event_status === "Upcoming"
        );
        break;
      case "started":
        filtered = bookings.filter(
          (booking) => booking.event_status === "Started"
        );
        break;
      case "closed":
        filtered = bookings.filter(
          (booking) => booking.event_status === "Closed"
        );
        break;
      default:
        filtered = bookings;
    }

    setFilteredBookings(filtered);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleAddStudentClick = () => {
    setModalOpen(false);
    setCurrentTab(1);
  };

  const handleViewStudentsClick = () => {
    setModalOpen(false);
    setCurrentTab(2);
  };

  const canAddStudents = (booking) => {
    return (
      booking.event_status === "Upcoming" && !isBookingFullyBooked(booking)
    );
  };

  const canViewStudents = (booking) => {
    return booking.students_added > 0;
  };

  const handleBackToCalendar = () => {
    setCurrentTab(0);
    setSelectedBooking(null);
  };

  const handleStudentsAdded = () => {
    fetchBookings();
    setCurrentTab(0);
    setSelectedBooking(null);
  };

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 0) {
      setSelectedBooking(null);
    }
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const isBookingFullyBooked = (booking) => {
    return (
      booking.students_limit > 0 &&
      booking.students_added >= booking.students_limit
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "100%", md: 1100, lg: 1600 },
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
        width: "100%",
      }}
    >
      {/* <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
          mb: 3,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minHeight: { xs: 48, sm: 64 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          >
            <Tab
              label={`Event ${viewMode === "calendar" ? "Calendar" : "History"}`}
              icon={
                viewMode === "calendar" ? <CalendarMonth /> : <TableChart />
              }
              iconPosition="start"
            />
            <Tab
              label="Add Students"
              disabled={!selectedBooking || !canAddStudents(selectedBooking)}
              icon={selectedBooking && currentTab === 1 ? <ArrowBack /> : null}
              iconPosition="start"
            />
            <Tab
              label="View Students"
              disabled={!selectedBooking || !canViewStudents(selectedBooking)}
              icon={selectedBooking && currentTab === 2 ? <Visibility /> : null}
              iconPosition="start"
            />
          </Tabs>

          {currentTab === 0 && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  minWidth: { xs: 80, sm: 100 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  padding: { xs: "4px 8px", sm: "6px 12px" },
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="calendar" aria-label="calendar view">
                <CalendarMonth
                  sx={{
                    mr: { xs: 0.5, sm: 1 },
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                />
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Calendar
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", sm: "none" } }}
                >
                  Cal
                </Box>
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <TableChart
                  sx={{
                    mr: { xs: 0.5, sm: 1 },
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                />
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  History
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", sm: "none" } }}
                >
                  Tbl
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
      </Box> */}
      {currentTab === 0 && (
        <>
          {viewMode === "calendar" ? (
            <TableView
              filteredBookings={filteredBookings}
              filter={filter}
              setFilter={setFilter}
              onBookingClick={handleBookingClick}
              canAddStudents={canAddStudents}
              canViewStudents={canViewStudents}
            />
          ) : (
            <TableView
              filteredBookings={filteredBookings}
              filter={filter}
              setFilter={setFilter}
              onBookingClick={handleBookingClick}
              canAddStudents={canAddStudents}
              canViewStudents={canViewStudents}
            />
          )}

          <BookingModal
            selectedBooking={selectedBooking}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            onAddStudentClick={handleAddStudentClick}
            onViewStudentsClick={handleViewStudentsClick}
            canAddStudents={canAddStudents}
            canViewStudents={canViewStudents}
          />
        </>
      )}
      {currentTab === 1 && (
        <StudentSelection
          selectedBooking={selectedBooking}
          onBackToCalendar={handleBackToCalendar}
          onStudentsAdded={handleStudentsAdded}
          showNotification={showNotification}
        />
      )}
      {currentTab === 2 && (
        <ViewStudents
          selectedBooking={selectedBooking}
          onBackToCalendar={handleBackToCalendar}
          showNotification={showNotification}
        />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingCalendar;
