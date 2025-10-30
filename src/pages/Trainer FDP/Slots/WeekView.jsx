import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
  alpha,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const WeekView = ({
  currentDate,
  weekDates,
  weekDays,
  filteredSlots,
  selectedRange,
  isSelecting,
  isDateInSlot,
  isDateInRange,
  getSlotSpanForDate,
  getCategoryInfo,
  handleDateMouseDown,
  handleDateMouseEnter,
  formatDateRange,
  setSelectedRange,
  setIsSelecting,
  setOverlapError,
  navigateWeek,
  getWeekRange,
  getWeekNumber,
  getSlotRangeInfo,
}) => {
  // Helper function to format date as YYYY-MM-DD
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to check if a date matches a string date
  const isSameDateString = (date, dateString) => {
    return formatDateString(date) === dateString;
  };

  return (
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
            const startDate = new Date(slot.startDate);
            const endDate = new Date(slot.endDate);

            // Find the exact start and end indices in the current week
            let startIndex = -1;
            let endIndex = -1;

            weekDates.forEach((date, index) => {
              if (isSameDateString(date, slot.startDate)) {
                startIndex = index;
              }
              if (isSameDateString(date, slot.endDate)) {
                endIndex = index;
              }
            });

            // Handle slots that span beyond the current week
            if (startIndex === -1 && endIndex === -1) {
              // Check if the entire week is within the slot range
              const weekStart = weekDates[0];
              const weekEnd = weekDates[6];
              if (weekStart >= startDate && weekEnd <= endDate) {
                startIndex = 0;
                endIndex = 6;
              } else {
                return null; // Slot doesn't appear in this week
              }
            }

            // Handle partial week overlaps
            if (startIndex === -1) {
              // Slot starts before this week
              startIndex = 0;
            }
            if (endIndex === -1) {
              // Slot ends after this week
              endIndex = 6;
            }

            const span = endIndex - startIndex + 1;
            const category = getCategoryInfo(slot.category);
            const duration =
              Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            console.log(
              `Slot "${slot.title}": startIndex=${startIndex}, endIndex=${endIndex}, span=${span}`
            );

            return (
              <Box
                key={`range-${slot.id}`}
                sx={{
                  position: "absolute",
                  top: "90px",
                  left: `${(startIndex / 7) * 100}%`,
                  width: `${(span / 7) * 100}%`,
                  zIndex: 2,
                  px: 1,
                }}
              >
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {slot.title}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block" }}>
                        Duration: {duration} day{duration > 1 ? "s" : ""}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block" }}>
                        Dates: {slot.startDate} to {slot.endDate}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block" }}>
                        {slot.institute}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block" }}>
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
                        boxShadow: `0 8px 25px ${alpha(category.color, 0.3)}`,
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
                        label={`${duration} day${duration > 1 ? "s" : ""}`}
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
            const isToday = date.toDateString() === new Date().toDateString();
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
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94a3b8",
                      display: "block",
                      fontSize: "0.6rem",
                    }}
                  >
                    {formatDateString(date)}
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
  );
};

export default WeekView;
