import React from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  Close,
  Add,
  Visibility,
  Business,
  CalendarToday,
  Person,
  Email,
  Phone,
  Groups,
} from "@mui/icons-material";

const BookingModal = ({
  selectedBooking,
  modalOpen,
  setModalOpen,
  onAddStudentClick,
  onViewStudentsClick,
  canAddStudents,
  canViewStudents,
}) => {
  const isBookingFullyBooked = (booking) => {
    return (
      booking.students_limit > 0 &&
      booking.students_added >= booking.students_limit
    );
  };

  const isBookingPartiallyBooked = (booking) => {
    return booking.students_added > 0 && !isBookingFullyBooked(booking);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusAlert = (booking) => {
    if (booking.event_status === "Closed") {
      return {
        severity: "info",
        message:
          "This event has been closed. You can view the student list but cannot add new students.",
      };
    }

    if (booking.event_status === "Started") {
      return {
        severity: "warning",
        message:
          "This event has already started. You can view the student list but cannot add new students.",
      };
    } 
    if (booking.event_status === "Canceled") {
      return {
        severity: "warning",
        message:
          "This event has already cancelled. You can not add or view students.",
      };
    }

    if (isBookingFullyBooked(booking)) {
      return {
        severity: "warning",
        message: `Event is fully booked (${booking.students_added}/${booking.students_limit} students)`,
      };
    }

    if (booking.students_added > 0) {
      return {
        severity: "info",
        message: `${booking.students_added}${
          booking.students_limit > 0 ? `/${booking.students_limit}` : ""
        } students added`,
      };
    }

    return {
      severity: "success",
      message: "Event is available for booking",
    };
  };

  const getEventStatusChip = (status) => {
    const statusConfig = {
      Upcoming: { color: "#4CAF50", label: "Upcoming" },
      Started: { color: "#FF9800", label: "Started" },
      Closed: { color: "#9E9E9E", label: "Closed" },
    };

    const config = statusConfig[status] || { color: "#9E9E9E", label: status };

    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.color,
          color: "white",
          fontWeight: 500,
        }}
      />
    );
  };

  if (!selectedBooking) return null;

  const statusAlert = getStatusAlert(selectedBooking);

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="booking-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          maxHeight: "85vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            pb: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" fontWeight={600}>
              Event Booking Details
            </Typography>
            {getEventStatusChip(selectedBooking.event_status)}
          </Box>
          <IconButton onClick={() => setModalOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, maxHeight: "70vh", overflow: "auto" }}>
          <Box sx={{ mb: 3 }}>
            <Alert severity={statusAlert.severity} sx={{ borderRadius: 2 }}>
              {statusAlert.message}
            </Alert>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              mb: 3,
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f8f9fa",
                      borderRight: "1px solid #e0e0e0",
                      width: "200px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Business fontSize="small" color="primary" />
                    Institute
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {selectedBooking.institute_name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f8f9fa",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarToday fontSize="small" color="primary" />
                    Start Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {formatDate(selectedBooking.start_date)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f8f9fa",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarToday fontSize="small" color="primary" />
                    End Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {formatDate(selectedBooking.end_date)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f8f9fa",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Person fontSize="small" color="primary" />
                    Trainer
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {selectedBooking.trainer_name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f8f9fa",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Email fontSize="small" color="primary" />
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {selectedBooking.trainer_email}
                  </TableCell>
                </TableRow>

                {/* {selectedBooking.phone && (
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#f8f9fa",
                        borderRight: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Phone fontSize="small" color="primary" />
                      Phone
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {selectedBooking.phone}
                    </TableCell>
                  </TableRow>
                )} */}

                {selectedBooking.students_limit > 0 && (
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#f8f9fa",
                        borderRight: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Groups fontSize="small" color="primary" />
                      Capacity
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">
                          {selectedBooking.students_added} /{" "}
                          {selectedBooking.students_limit} students
                        </Typography>
                        {isBookingFullyBooked(selectedBooking) && (
                          <Typography
                            variant="caption"
                            sx={{
                              backgroundColor: "#2196F3",
                              color: "white",
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              fontWeight: 600,
                            }}
                          >
                            FULL
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" gap={2}>
            {canViewStudents(selectedBooking) && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<Visibility />}
                onClick={onViewStudentsClick}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                }}
              >
                View Students ({selectedBooking.students_added})
              </Button>
            )}

            {canAddStudents(selectedBooking) && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={onAddStudentClick}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                }}
              >
                Add Students
                {selectedBooking.students_limit > 0 &&
                  ` (${
                    selectedBooking.students_limit -
                    selectedBooking.students_added
                  } slots available)`}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default BookingModal;
