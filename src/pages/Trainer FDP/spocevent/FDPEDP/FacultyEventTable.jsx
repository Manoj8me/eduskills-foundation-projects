import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TablePagination,
  Tooltip,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import {
  Visibility,
  Add,
  CalendarToday,
  Person,
  MoreVert,
  PersonAdd,
} from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../../../services/configUrls";
import AddFacultyModal from "./AddFacultyModal";
import AddNewFacultyModal from "./AddNewFacultyModal";
import ViewFacultyModal from "./ViewFacultyModal";

const FacultyEventTable = ({ onBookingClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventTypeTab, setEventTypeTab] = useState("fdp");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Faculty Modal State
  const [addFacultyModalOpen, setAddFacultyModalOpen] = useState(false);
  const [selectedBookslotId, setSelectedBookslotId] = useState(null);

  // Add New Faculty Modal State (for Nominations Open/Started events)
  const [addNewFacultyModalOpen, setAddNewFacultyModalOpen] = useState(false);
  const [selectedBookslotIdForNew, setSelectedBookslotIdForNew] =
    useState(null);

  // View Faculty Modal State
  const [viewFacultyModalOpen, setViewFacultyModalOpen] = useState(false);
  const [selectedBookslotIdForView, setSelectedBookslotIdForView] =
    useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const colors = {
    fullyBooked: "#2196F3",
    partiallyBooked: "#9E9E9E",
    upcoming: "#4CAF50",
    started: "#FF9800",
    closed: "#9E9E9E",
    nominationsNotOpen: "#FF5722",
  };

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/event/all-bookings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Filter only FDP and EDP events
      const filteredData = response.data.filter(
        (booking) =>
          booking.event_type === "fdp" || booking.event_type === "edp"
      );

      setBookings(filteredData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return start === end ? start : `${start} - ${end}`;
  };

  const isBookingFullyBooked = (booking) => {
    return (
      booking.faculty_limit > 0 &&
      booking.faculty_added >= booking.faculty_limit
    );
  };

  const isBookingPartiallyBooked = (booking) => {
    const hasParticipants = booking.faculty_added > 0;
    return hasParticipants && !isBookingFullyBooked(booking);
  };

  const getStatusChip = (booking) => {
    const getEventStatusChip = () => {
      if (!booking.event_status) return null;

      const statusConfig = {
        Upcoming: { color: colors.upcoming, label: "Upcoming" },
        Started: { color: colors.started, label: "Started" },
        Closed: { color: colors.closed, label: "Closed" },
        "Nominations Not Open": {
          color: colors.nominationsNotOpen,
          label: "Nominations Not Open",
        },
      };

      const config = statusConfig[booking.event_status] || {
        color: colors.closed,
        label: booking.event_status,
      };

      return (
        <Chip
          label={config.label}
          size="small"
          sx={{
            backgroundColor: config.color,
            color: "white",
            fontWeight: 500,
            fontSize: "0.7rem",
          }}
        />
      );
    };

    const getBookingStatusChip = () => {
      if (
        booking.event_status === "Closed" ||
        booking.event_status === "Nominations Not Open"
      ) {
        return null;
      }
      if (
        booking.event_status === "Canceled" ||
        booking.event_status === "Cancelled"
      ) {
        return null;
      }

      if (isBookingFullyBooked(booking)) {
        return (
          <Chip
            label="Fully Booked"
            size="small"
            sx={{
              backgroundColor: colors.fullyBooked,
              color: "white",
              fontWeight: 500,
              fontSize: "0.7rem",
            }}
          />
        );
      } else if (isBookingPartiallyBooked(booking)) {
        return (
          <Chip
            label="Booking Open"
            size="small"
            sx={{
              backgroundColor: colors.partiallyBooked,
              color: "white",
              fontWeight: 500,
              fontSize: "0.7rem",
            }}
          />
        );
      } else {
        return (
          <Chip
            label="Available"
            size="small"
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              fontWeight: 500,
              fontSize: "0.7rem",
            }}
          />
        );
      }
    };

    return (
      <Box display="flex" gap={0.5} flexWrap="wrap">
        {getEventStatusChip()}
        {getBookingStatusChip()}
      </Box>
    );
  };

  const handleMenuOpen = (event, booking) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleMenuItemClick = (action) => {
    if (action === "add") {
      // Open existing Add Faculty Modal
      setSelectedBookslotId(selectedBooking.bookslot_id);
      setAddFacultyModalOpen(true);
      handleMenuClose();
    } else if (action === "addNew") {
      // Open new Add Faculty Modal for Nominations Open/Started
      setSelectedBookslotIdForNew(selectedBooking.bookslot_id);
      setAddNewFacultyModalOpen(true);
      handleMenuClose();
    } else if (action === "view") {
      // Open View Faculty Modal
      setSelectedBookslotIdForView(selectedBooking.bookslot_id);
      setViewFacultyModalOpen(true);
      handleMenuClose();
    } else if (selectedBooking && onBookingClick) {
      onBookingClick(selectedBooking, action);
      handleMenuClose();
    }
  };

  const handleAddFacultySuccess = () => {
    // Refresh bookings after successfully adding faculty
    fetchBookings();
  };

  // Helper function to check if faculty can be added
  const canAddFaculty = (booking) => {
    // Allow adding faculty only when event status is "Nominations Open" or "Started"
    const isNominationsOpen = booking.event_status === "Nominations Open";
    const isStarted = booking.event_status === "Started";
    const isNotFullyBooked = !isBookingFullyBooked(booking);

    return (isNominationsOpen || isStarted) && isNotFullyBooked;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEventTypeChange = (event, newValue) => {
    setEventTypeTab(newValue);
    setPage(0);
  };

  // Filter bookings by event type
  const filteredByEventType = bookings.filter(
    (booking) => booking.event_type === eventTypeTab
  );

  // Paginate bookings
  const paginatedBookings = filteredByEventType.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getActionButtons = (booking) => {
    return (
      <Box display="flex" gap={1} alignItems="center">
        <Tooltip title="More Actions">
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, booking)}
            sx={{
              color: "#1976d2",
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const MobileCardView = ({ booking }) => {
    return (
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e0e7ff",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                {booking.institute_name}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, booking)}
              >
                <MoreVert />
              </IconButton>
            </Box>

            <Divider />

            <Box>
              <Typography variant="caption" color="text.secondary">
                Domain
              </Typography>
              <Typography variant="body2">{booking.domain_name}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Date Range
              </Typography>
              <Typography variant="body2">
                {getDateRange(booking.start_date, booking.end_date)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Trainer
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {booking.trainer_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {booking.trainer_email}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Faculty
              </Typography>
              <Typography variant="body2">
                {booking.faculty_added}
                {booking.faculty_limit > 0 ? ` / ${booking.faculty_limit}` : ""}
              </Typography>
            </Box>

            <Box>{getStatusChip(booking)}</Box>
          </Stack>
        </CardContent>
      </Card>
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

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        align="center"
        sx={{ mt: { xs: 3, sm: 5 } }}
      >
        Faculty Development Programs
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={eventTypeTab}
          onChange={handleEventTypeChange}
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab label="FDP" value="fdp" />
          <Tab label="EDP" value="edp" />
        </Tabs>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
          {filteredByEventType.length} Programs
        </Typography>
      </Box>

      {isMobile || isTablet ? (
        // Mobile/Tablet Card View
        <Box>
          {paginatedBookings.map((booking, index) => (
            <MobileCardView
              key={`${booking.bookslot_id}-${index}`}
              booking={booking}
            />
          ))}
          {paginatedBookings.length === 0 && (
            <Card sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No programs found matching your filters
              </Typography>
            </Card>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredByEventType.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </Box>
      ) : (
        // Desktop Table View
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid #e0e7ff",
            overflowX: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Institute
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Domain
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday fontSize="small" />
                    Date Range
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" />
                    Trainer
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Faculty
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.map((booking, index) => (
                <TableRow
                  key={`${booking.bookslot_id}-${index}`}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => onBookingClick && onBookingClick(booking)}
                >
                  <TableCell>
                    <Typography variant="body2">
                      {booking.institute_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 250 }}>
                      {booking.domain_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getDateRange(booking.start_date, booking.end_date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {booking.trainer_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.trainer_email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.faculty_added}
                      {booking.faculty_limit > 0
                        ? ` / ${booking.faculty_limit}`
                        : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(booking)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {getActionButtons(booking)}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No programs found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredByEventType.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid #e0e0e0",
              ".MuiTablePagination-toolbar": {
                paddingRight: 2,
              },
            }}
          />
        </TableContainer>
      )}

      {/* Menu for actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Show existing Add Faculty option */}
        {selectedBooking && canAddFaculty(selectedBooking) && (
          <MenuItem onClick={() => handleMenuItemClick("add")}>
            <ListItemIcon>
              <Add fontSize="small" sx={{ color: "#4caf50" }} />
            </ListItemIcon>
            <ListItemText>Nominate Faculty</ListItemText>
          </MenuItem>
        )}

        {/* Show Add New Faculty only when nomination is open/started and not fully booked */}
        {selectedBooking && canAddFaculty(selectedBooking) && (
          <MenuItem onClick={() => handleMenuItemClick("addNew")}>
            <ListItemIcon>
              <PersonAdd fontSize="small" sx={{ color: "#FF9800" }} />
            </ListItemIcon>
            <ListItemText>Add New Faculty</ListItemText>
          </MenuItem>
        )}

        {/* Always show View Faculty */}
        <MenuItem onClick={() => handleMenuItemClick("view")}>
          <ListItemIcon>
            <Visibility fontSize="small" sx={{ color: "#1976d2" }} />
          </ListItemIcon>
          <ListItemText>View Faculty</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add Faculty Modal */}
      <AddFacultyModal
        open={addFacultyModalOpen}
        onClose={() => setAddFacultyModalOpen(false)}
        bookslotId={selectedBookslotId}
        onSuccess={handleAddFacultySuccess}
      />

      {/* Add New Faculty Modal (for Nominations Open/Started) */}
      <AddNewFacultyModal
        open={addNewFacultyModalOpen}
        onClose={() => setAddNewFacultyModalOpen(false)}
        bookslotId={selectedBookslotIdForNew}
        onSuccess={handleAddFacultySuccess}
      />

      {/* View Faculty Modal */}
      <ViewFacultyModal
        open={viewFacultyModalOpen}
        onClose={() => setViewFacultyModalOpen(false)}
        bookslotId={selectedBookslotIdForView}
      />
    </Box>
  );
};

export default FacultyEventTable;
