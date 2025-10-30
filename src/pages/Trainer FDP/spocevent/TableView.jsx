import React, { useState } from "react";
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Visibility,
  Add,
  CalendarToday,
  Person,
  MoreVert,
} from "@mui/icons-material";

const TableView = ({
  filteredBookings,
  filter,
  setFilter,
  onBookingClick,
  canAddStudents,
  canViewStudents,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const colors = {
    fullyBooked: "#2196F3",
    partiallyBooked: "#9E9E9E",
    upcoming: "#4CAF50",
    started: "#FF9800",
    closed: "#9E9E9E",
  };

  const defaultCanAddStudents = (booking) => {
    return (
      (booking.event_status === "Upcoming" || !booking.event_status) &&
      !(
        booking.students_limit > 0 &&
        booking.students_added >= booking.students_limit
      )
    );
  };

  const defaultCanViewStudents = (booking) => {
    return booking.students_added > 0;
  };

  const checkCanAddStudents = canAddStudents || defaultCanAddStudents;
  const checkCanViewStudents = canViewStudents || defaultCanViewStudents;

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
      booking.students_limit > 0 &&
      booking.students_added >= booking.students_limit
    );
  };

  const isBookingPartiallyBooked = (booking) => {
    const hasParticipants = booking.students_added > 0;
    return hasParticipants && !isBookingFullyBooked(booking);
  };

  const getStatusChip = (booking) => {
    const getEventStatusChip = () => {
      if (!booking.event_status) return null;

      const statusConfig = {
        Upcoming: { color: colors.upcoming, label: "Upcoming" },
        Started: { color: colors.started, label: "Started" },
        Closed: { color: colors.closed, label: "Closed" },
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
      if (booking.event_status === "Closed") {
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
            label="Booked"
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
    if (selectedBooking) {
      onBookingClick(selectedBooking, action);
    }
    handleMenuClose();
  };

  const getActionButtons = (booking) => {
    return (
      <Tooltip title="More Actions">
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, booking)}
          sx={{
            color: "#616161",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter to show only tech_camp events
  const techCampBookings = filteredBookings.filter(
    (booking) => booking.event_type === "tech_camp"
  );

  const paginatedBookings = techCampBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 5 }}>
        Tech Camp Booking
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        mt={3}
      >
        <Typography variant="h6" color="text.secondary">
          {techCampBookings.length} Events
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          border: "1px solid #e0e7ff",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
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
                Students
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
            {paginatedBookings.map((booking) => (
              <TableRow
                key={booking.bookslot_id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  cursor: "pointer",
                }}
                onClick={() => onBookingClick(booking)}
              >
                <TableCell>
                  <Typography variant="body2">{booking.domain_name}</Typography>
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
                    {`${booking.students_added}${
                      booking.students_limit > 0
                        ? ` / ${booking.students_limit}`
                        : ""
                    }`}
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
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No events found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={techCampBookings.length}
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
        <MenuItem onClick={() => handleMenuItemClick("details")}>
          <ListItemIcon>
            <Visibility fontSize="small" sx={{ color: "#1976d2" }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        {/* {selectedBooking && checkCanViewStudents(selectedBooking) && (
          <MenuItem onClick={() => handleMenuItemClick("view")}>
            <ListItemIcon>
              <Visibility fontSize="small" sx={{ color: "#9c27b0" }} />
            </ListItemIcon>
            <ListItemText>View Students</ListItemText>
          </MenuItem>
        )} */}

        {selectedBooking && checkCanAddStudents(selectedBooking) && (
          <MenuItem onClick={() => handleMenuItemClick("add")}>
            <ListItemIcon>
              <Add fontSize="small" sx={{ color: "#4caf50" }} />
            </ListItemIcon>
            <ListItemText>Add Students</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default TableView;
