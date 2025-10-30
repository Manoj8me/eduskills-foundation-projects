import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Popover,
  Divider,
} from "@mui/material";
import { Close, CalendarMonth } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../../../services/configUrls";

const ViewFacultyModal = ({ open, onClose, bookslotId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    if (open && bookslotId) {
      fetchFacultyList();
    }
  }, [open, bookslotId]);

  const fetchFacultyList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}/event/students-list/${bookslotId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setEventData(response.data);
    } catch (err) {
      setError("Failed to fetch faculty list");
      console.error("Error fetching faculty list:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceClick = (event, faculty) => {
    setAnchorEl(event.currentTarget);
    setSelectedFaculty(faculty);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedFaculty(null);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Selected: "#4CAF50",
      Pending: "#FF9800",
      Rejected: "#F44336",
      Unknown: "#9E9E9E",
    };
    return statusColors[status] || "#9E9E9E";
  };

  const getAttendanceStatus = (value) => {
    if (value === null) return "Not Marked";
    return value ? "Present" : "Absent";
  };

  const getAttendanceColor = (value) => {
    if (value === null) return "#9E9E9E";
    return value ? "#4CAF50" : "#F44336";
  };

  const openPopover = Boolean(anchorEl);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "500px",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            Faculty List
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : eventData ? (
          <>
            {/* Event Information */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e0e7ff",
              }}
            >
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                gap={2}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Event Type
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {eventData.event.event_type.toUpperCase()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date Range
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(eventData.event.start_date)} -{" "}
                    {formatDate(eventData.event.end_date)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Event Status
                  </Typography>
                  <Chip
                    label={eventData.event.event_status}
                    size="small"
                    sx={{
                      
                      backgroundColor: getStatusColor(
                        eventData.event.event_status
                      ),
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trainer Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {eventData.event.trainer_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trainer Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {eventData.event.trainer_email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Faculty Count
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {eventData.event.faculty_added} /{" "}
                    {eventData.event.faculty_limit}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Faculty Table */}
            <Typography variant="h6" fontWeight={600} mb={2}>
              Registered Faculty ({eventData.faculty_count})
            </Typography>

            {eventData.faculty && eventData.faculty.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #e0e7ff",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Designation
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Institute</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Attendance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventData.faculty.map((faculty, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": { backgroundColor: "#f8fafc" },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {faculty.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {faculty.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {faculty.designation}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {faculty.branch || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {faculty.institute_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={faculty.faculty_status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(
                                faculty.faculty_status
                              ),
                              color: "white",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => handleAttendanceClick(e, faculty)}
                            sx={{
                              color: "#1976d2",
                              "&:hover": {
                                backgroundColor: "#e3f2fd",
                              },
                            }}
                          >
                            <CalendarMonth fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <Typography color="text.secondary">
                  No faculty registered for this event
                </Typography>
              </Box>
            )}
          </>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>

      {/* Attendance Popover */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            minWidth: 350,
          },
        }}
      >
        {selectedFaculty && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Attendance Details
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {selectedFaculty.name}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      Date
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                      align="center"
                    >
                      First Half
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                      align="center"
                    >
                      Second Half
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedFaculty.attendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(record.date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getAttendanceStatus(record.first_half)}
                          size="small"
                          sx={{
                            backgroundColor: getAttendanceColor(
                              record.first_half
                            ),
                            color: "white",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getAttendanceStatus(record.second_half)}
                          size="small"
                          sx={{
                            backgroundColor: getAttendanceColor(
                              record.second_half
                            ),
                            color: "white",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Popover>
    </Dialog>
  );
};

export default ViewFacultyModal;
