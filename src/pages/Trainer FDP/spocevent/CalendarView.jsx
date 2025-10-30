import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { ChevronLeft, ChevronRight, FilterList } from "@mui/icons-material";

const CalendarView = ({
  currentDate,
  setCurrentDate,
  filteredBookings,
  filter,
  setFilter,
  onBookingClick,
}) => {
  // Updated color scheme - removed eligibility colors
  const colors = {
    upcoming: "#4CAF50", // Green for upcoming
    started: "#FF9800", // Orange for started
    closed: "#9E9E9E", // Gray for closed
    upcomingTransparent: "#4CAF5020",
    startedTransparent: "#FF980020",
    closedTransparent: "#9E9E9E20",
    fullyBooked: "#2196F3", // Blue for fully booked
    fullyBookedTransparent: "#2196F320",
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString
      .split("-")
      .map((num) => parseInt(num, 10));
    return new Date(year, month - 1, day);
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];

    return filteredBookings.filter((booking) => {
      const startDate = parseLocalDate(booking.start_date);
      const endDate = parseLocalDate(booking.end_date);

      const dateTime = date.getTime();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      return dateTime >= startTime && dateTime <= endTime;
    });
  };

  const isBookingFullyBooked = (booking) => {
    return (
      booking.students_limit > 0 &&
      booking.students_added >= booking.students_limit
    );
  };

  const isBookingPartiallyBooked = (booking) => {
    return booking.students_added > 0 && !isBookingFullyBooked(booking);
  };

  const getDateBackgroundColor = (date) => {
    if (!date) return "transparent";

    const dayBookings = getBookingsForDate(date);
    if (dayBookings.length === 0) return "transparent";

    const primaryBooking = dayBookings[0];

    if (isBookingFullyBooked(primaryBooking)) {
      return colors.fullyBookedTransparent;
    }

    // Color based on event status
    switch (primaryBooking.event_status) {
      case "Upcoming":
        return colors.upcomingTransparent;
      case "Started":
        return colors.startedTransparent;
      case "Closed":
        return colors.closedTransparent;
      default:
        return "transparent";
    }
  };

  const getDateRangeBorder = (date) => {
    if (!date) return {};

    const dayBookings = getBookingsForDate(date);
    if (dayBookings.length === 0) return {};

    const primaryBooking = dayBookings[0];
    const rangePosition = getDateRangePosition(date, primaryBooking);

    let borderColor;
    if (isBookingFullyBooked(primaryBooking)) {
      borderColor = colors.fullyBooked;
    } else {
      switch (primaryBooking.event_status) {
        case "Upcoming":
          borderColor = colors.upcoming;
          break;
        case "Started":
          borderColor = colors.started;
          break;
        case "Closed":
          borderColor = colors.closed;
          break;
        default:
          borderColor = colors.closed;
      }
    }

    const borderWidth = "2px";
    const borderStyle = "solid";

    if (rangePosition?.isSingle) {
      return {
        border: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderRadius: "6px",
      };
    } else if (rangePosition?.isStart) {
      return {
        borderTop: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderLeft: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderBottom: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderTopLeftRadius: "6px",
        borderBottomLeftRadius: "6px",
      };
    } else if (rangePosition?.isEnd) {
      return {
        borderTop: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderRight: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderBottom: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderTopRightRadius: "6px",
        borderBottomRightRadius: "6px",
      };
    } else if (rangePosition?.isMiddle) {
      return {
        borderTop: `${borderWidth} ${borderStyle} ${borderColor}`,
        borderBottom: `${borderWidth} ${borderStyle} ${borderColor}`,
      };
    }

    return {};
  };

  const getDateRangePosition = (date, booking) => {
    if (!date) return null;

    const startDate = parseLocalDate(booking.start_date);
    const endDate = parseLocalDate(booking.end_date);

    const isStart = isSameDate(date, startDate);
    const isEnd = isSameDate(date, endDate);
    const isMiddle = date > startDate && date < endDate;

    return { isStart, isEnd, isMiddle, isSingle: isStart && isEnd };
  };

  const getBookingColor = (booking) => {
    if (isBookingFullyBooked(booking)) {
      return colors.fullyBooked;
    }

    switch (booking.event_status) {
      case "Upcoming":
        return colors.upcoming;
      case "Started":
        return colors.started;
      case "Closed":
        return colors.closed;
      default:
        return colors.closed;
    }
  };

  const truncateText = (text, maxLength = 12) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Booking Calendar
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeft />
        </IconButton>

        <Typography variant="h5">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          {/* <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              displayEmpty
              sx={{
                fontSize: "0.875rem",
                "& .MuiSelect-select": {
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="all">
                <Box display="flex" alignItems="center" gap={1}>
                  <FilterList fontSize="small" />
                  All
                </Box>
              </MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="started">Started</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="booked">Booked</MenuItem>
              <MenuItem value="not_booked">Not Booked</MenuItem>
              <MenuItem value="fully_booked">Fully Booked</MenuItem>
              <MenuItem value="available">Available Slots</MenuItem>
            </Select>
          </FormControl> */}

          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={0}>
            {dayNames.map((day) => (
              <Grid item xs={12 / 7} key={day}>
                <Box textAlign="center" py={1} fontWeight="bold">
                  <Typography variant="subtitle2" color="primary">
                    {day}
                  </Typography>
                </Box>
              </Grid>
            ))}

            {getDaysInMonth(currentDate).map((date, index) => {
              const dayBookings = getBookingsForDate(date);
              const backgroundColor = getDateBackgroundColor(date);
              const rangeBorderStyle = getDateRangeBorder(date);

              return (
                <Grid item xs={12 / 7} key={index}>
                  <Box
                    sx={{
                      minHeight: 140,
                      border: "1px solid #e0e0e0",
                      p: 1,
                      backgroundColor: date ? backgroundColor : "#f5f5f5",
                      position: "relative",
                      transition: "all 0.3s ease",
                      ...rangeBorderStyle,
                      zIndex: dayBookings.length > 0 ? 2 : 1,
                    }}
                  >
                    {date && (
                      <>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            fontWeight: "bold",
                          }}
                        >
                          {date.getDate()}
                        </Typography>
                        <Box sx={{ position: "relative" }}>
                          {dayBookings.map((booking, bookingIndex) => {
                            const rangePosition = getDateRangePosition(
                              date,
                              booking
                            );
                            const bookingColor = getBookingColor(booking);
                            const isFullyBooked = isBookingFullyBooked(booking);

                            return (
                              <Tooltip
                                key={`${booking.bookslot_id}-${bookingIndex}`}
                                title={`${booking.domain_name} - ${
                                  booking.institute_name
                                } ${
                                  isFullyBooked
                                    ? `(Full: ${booking.students_added}/${booking.students_limit})`
                                    : isBookingPartiallyBooked(booking)
                                    ? "(Booked)"
                                    : ""
                                }`}
                                arrow
                              >
                                <Box
                                  onClick={() => onBookingClick(booking)}
                                  sx={{
                                    mb: 0.5,
                                    p: 0.5,
                                    cursor: "pointer",
                                    backgroundColor: bookingColor,
                                    color: "white",
                                    fontSize: "0.65rem",
                                    borderRadius: rangePosition?.isSingle
                                      ? "4px"
                                      : rangePosition?.isStart
                                      ? "4px 0 0 4px"
                                      : rangePosition?.isEnd
                                      ? "0 4px 4px 0"
                                      : "0",
                                    minHeight: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    position: "relative",
                                    overflow: "hidden",
                                    "&:hover": {
                                      opacity: 0.8,
                                      transform: "scale(1.02)",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: "500",
                                      lineHeight: 1,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {truncateText(booking.domain_name, 12)}
                                    {isFullyBooked && " (Full)"}
                                    {isBookingPartiallyBooked(booking) &&
                                      !isFullyBooked &&
                                      " (Booked)"}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            );
                          })}
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      <Box
        display="flex"
        gap={3}
        justifyContent="center"
        mb={3}
        flexWrap="wrap"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: colors.upcoming,
              borderRadius: 1,
            }}
          />
          <Typography variant="body2">Upcoming</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: colors.started,
              borderRadius: 1,
            }}
          />
          <Typography variant="body2">Started</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: colors.closed,
              borderRadius: 1,
            }}
          />
          <Typography variant="body2">Closed</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: colors.fullyBooked,
              borderRadius: 1,
            }}
          />
          <Typography variant="body2">Fully Booked</Typography>
        </Box>
      </Box>
    </>
  );
};

export default CalendarView;
