import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Fade,
  alpha,
} from "@mui/material";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  ViewWeek,
} from "@mui/icons-material";

const OverviewMode = ({
  overviewYear,
  navigateYear,
  setViewMode,
  monthNames,
  weekDaysShort,
  isDateInSlot,
  isDateInRange,
  getSlotSpanForDate,
  getCategoryInfo,
  handleMiniCalendarDateClick,
  getMonthDates,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  // Helper function to check if a date is part of a slot range
  const getSlotRangeForDate = (date, monthDates) => {
    const slotSpan = getSlotSpanForDate(date);
    if (!slotSpan) return null;

    const startDate = new Date(slotSpan.startDate);
    const endDate = new Date(slotSpan.endDate);

    // Find the position of this date within the slot range
    const currentIndex = monthDates.findIndex(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );

    const startIndex = monthDates.findIndex(
      (d) =>
        d.getDate() === startDate.getDate() &&
        d.getMonth() === startDate.getMonth() &&
        d.getFullYear() === startDate.getFullYear()
    );

    const endIndex = monthDates.findIndex(
      (d) =>
        d.getDate() === endDate.getDate() &&
        d.getMonth() === endDate.getMonth() &&
        d.getFullYear() === endDate.getFullYear()
    );

    return {
      slot: slotSpan,
      isStart: currentIndex === startIndex,
      isEnd: currentIndex === endIndex,
      isMiddle: currentIndex > startIndex && currentIndex < endIndex,
      isSingle: startIndex === endIndex,
    };
  };

  // Helper function to get selected range info for a date
  const getSelectedRangeForDate = (date, monthDates) => {
    if (!isDateInRange(date)) return null;

    const currentIndex = monthDates.findIndex(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );

    // Find start and end of selected range within this month
    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < monthDates.length; i++) {
      if (isDateInRange(monthDates[i])) {
        if (startIndex === -1) startIndex = i;
        endIndex = i;
      }
    }

    return {
      isStart: currentIndex === startIndex,
      isEnd: currentIndex === endIndex,
      isMiddle: currentIndex > startIndex && currentIndex < endIndex,
      isSingle: startIndex === endIndex,
    };
  };

  const renderMiniCalendar = (year, month) => {
    const monthDates = getMonthDates(year, month);

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
                const dateStr = date.toISOString().split("T")[0];
                const hasSlots = isDateInSlot(date);
                const slotRange = getSlotRangeForDate(date, monthDates);
                const selectedRange = getSelectedRangeForDate(date, monthDates);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isCurrentMonth = date.getMonth() === month;
                const inRange = isDateInRange(date);

                // Determine background color and border radius
                let bgcolor = "transparent";
                let borderRadius = "8px";
                let color = !isCurrentMonth ? "#94a3b8" : "#1e293b";

                if (isToday) {
                  bgcolor = "#3b82f6";
                  color = "white";
                } else if (inRange && selectedRange) {
                  bgcolor = "#16a34a";
                  color = "white";

                  // Adjust border radius for range visualization
                  if (selectedRange.isSingle) {
                    borderRadius = "8px";
                  } else if (selectedRange.isStart) {
                    borderRadius = "8px 4px 4px 8px";
                  } else if (selectedRange.isEnd) {
                    borderRadius = "4px 8px 8px 4px";
                  } else if (selectedRange.isMiddle) {
                    borderRadius = "4px";
                  }
                } else if (hasSlots && slotRange) {
                  const categoryColor =
                    getCategoryInfo(slotRange.slot.category)?.color ||
                    "#3b82f6";
                  bgcolor = alpha(categoryColor, 0.3);
                  color = "white";

                  // Adjust border radius for slot range visualization
                  if (slotRange.isSingle) {
                    borderRadius = "8px";
                  } else if (slotRange.isStart) {
                    borderRadius = "8px 4px 4px 8px";
                  } else if (slotRange.isEnd) {
                    borderRadius = "4px 8px 8px 4px";
                  } else if (slotRange.isMiddle) {
                    borderRadius = "4px";
                  }
                }

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
                      borderRadius,
                      cursor: "pointer",
                      position: "relative",
                      bgcolor,
                      color,
                      fontWeight: isToday || hasSlots || inRange ? 600 : 400,
                      "&:hover": {
                        bgcolor: isToday ? "#2563eb" : alpha("#3b82f6", 0.4),
                        transform: "scale(1.1)",
                        borderRadius: "8px", // Reset to rounded on hover
                      },
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                      {date.getDate()}
                    </Typography>

                    {/* Small indicator dot for booked dates */}
                    {hasSlots && !inRange && !isToday && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 2,
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          bgcolor:
                            getCategoryInfo(slotRange?.slot.category)?.color ||
                            "#3b82f6",
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

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

export default OverviewMode;
