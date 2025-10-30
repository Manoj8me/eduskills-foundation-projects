import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Skeleton,
  Checkbox,
  IconButton,
  Button,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

// Skeleton Components
const TableSkeleton = () => (
  <TableContainer
    component={Paper}
    sx={{
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
      overflow: "hidden",
    }}
  >
    <Table size="small">
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #D1D5DB",
          }}
        >
          <TableCell
            align="center"
            sx={{
              borderRight: "1px solid #E5E7EB",
            }}
          >
            First Half
          </TableCell>
          <TableCell
            align="center"
            sx={{
              borderRight: "1px solid #E5E7EB",
            }}
          >
            Second Half
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Student Details
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>Email</TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Roll No
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Branch
          </TableCell>
          <TableCell>Domain</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(8)].map((_, index) => (
          <TableRow key={index}>
            <TableCell
              align="center"
              sx={{
                borderRight: "1px solid #E5E7EB",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={18}
                height={18}
                sx={{ mx: "auto" }}
              />
            </TableCell>
            <TableCell
              align="center"
              sx={{
                borderRight: "1px solid #E5E7EB",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={18}
                height={18}
                sx={{ mx: "auto" }}
              />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="text" width={120} />
              </Box>
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={150} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={60} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="rounded" width={50} height={18} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={100} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const AttendanceTable = ({
  students,
  searchTerm,
  setSearchTerm,
  selectedDate,
  attendance,
  handleAttendanceChange,
  handleBulkChange,
  getAttendanceStatus,
  getBranchColor,
  formatDate,
  getDayNumber,
  loading,
  navigateToPreviousDate,
  navigateToNextDate,
  canNavigatePrevious,
  canNavigateNext,
  hasPendingChanges,
  pendingChangesCount,
  onSubmit,
  submitting,
}) => {
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.track.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm)
  );

  // Check if all students are present for first half
  const areAllPresentFirstHalf =
    filteredStudents.length > 0 &&
    filteredStudents.every(
      (student) => getAttendanceStatus(student.id, "firstHalf") === "present"
    );

  // Check if all students are present for second half
  const areAllPresentSecondHalf =
    filteredStudents.length > 0 &&
    filteredStudents.every(
      (student) => getAttendanceStatus(student.id, "secondHalf") === "present"
    );

  // Check if some students are present for first half (indeterminate state)
  const areSomePresentFirstHalf =
    filteredStudents.some(
      (student) => getAttendanceStatus(student.id, "firstHalf") === "present"
    ) && !areAllPresentFirstHalf;

  // Check if some students are present for second half (indeterminate state)
  const areSomePresentSecondHalf =
    filteredStudents.some(
      (student) => getAttendanceStatus(student.id, "secondHalf") === "present"
    ) && !areAllPresentSecondHalf;

  if (loading) {
    return (
      <>
        {/* Controls Skeleton */}
        <Paper sx={{ p: 2, mb: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Skeleton variant="rounded" width={300} height={40} />
            <Skeleton variant="rounded" width={250} height={40} />
          </Box>
        </Paper>

        {/* Date Display Skeleton */}
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" width={250} height={24} />
        </Box>

        {/* Table Skeleton */}
        <TableSkeleton />
      </>
    );
  }

  return (
    <>
      {/* Controls */}
      <Paper sx={{ p: 2, mb: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9CA3AF", fontSize: "1rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 300,
                "& .MuiOutlinedInput-root": { backgroundColor: "#FFFFFF" },
              }}
              size="small"
            />

            {/* Custom Date Navigator */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#FFFFFF",
                border: "1px solid #E0E7FF",
                borderRadius: "8px",
                padding: "8px 12px",
                minWidth: 250,
              }}
            >
              <CalendarTodayIcon sx={{ color: "#6366F1", fontSize: "1rem" }} />
              <IconButton
                onClick={navigateToPreviousDate}
                disabled={!canNavigatePrevious()}
                size="small"
                sx={{
                  color: canNavigatePrevious() ? "#6366F1" : "#9CA3AF",
                  "&:disabled": { color: "#D1D5DB" },
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#374151",
                  minWidth: "120px",
                  textAlign: "center",
                }}
              >
                {formatDate(selectedDate)}
              </Typography>
              <IconButton
                onClick={navigateToNextDate}
                disabled={!canNavigateNext()}
                size="small"
                sx={{
                  color: canNavigateNext() ? "#6366F1" : "#9CA3AF",
                  "&:disabled": { color: "#D1D5DB" },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={
              submitting ? null : hasPendingChanges ? (
                <SaveIcon />
              ) : (
                <CheckCircleIcon />
              )
            }
            onClick={onSubmit}
            disabled={!hasPendingChanges || submitting}
            sx={{
              backgroundColor: hasPendingChanges ? "#3f51b5" : "#4caf50",
              "&:hover": {
                backgroundColor: hasPendingChanges ? "#303f9f" : "#388e3c",
              },
              "&:disabled": {
                backgroundColor: "#E0E0E0",
                color: "#9E9E9E",
              },
              boxShadow: hasPendingChanges
                ? "0 4px 12px rgba(63, 81, 181, 0.3)"
                : "none",
              fontWeight: 600,
            }}
          >
            {submitting ? (
              "Submitting..."
            ) : hasPendingChanges ? (
              <Badge
                badgeContent={pendingChangesCount}
                color="error"
                sx={{ "& .MuiBadge-badge": { right: -12, top: 0 } }}
              >
                Submit Attendance
              </Badge>
            ) : (
              "All Saved"
            )}
          </Button>
        </Box>
      </Paper>

      {/* Date Display with Status */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500 }}>
            Attendance: {formatDate(selectedDate)} (Day{" "}
            {getDayNumber(selectedDate)})
          </Typography>
          {hasPendingChanges && (
            <Chip
              label={`${pendingChangesCount} Unsaved`}
              size="small"
              sx={{
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                fontWeight: 500,
                fontSize: "0.65rem",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.7 },
                },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #D1D5DB",
              }}
            >
              <TableCell
                align="center"
                sx={{
                  width: 100,
                  borderRight: "1px solid #E5E7EB",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#4CAF50",
                    }}
                  >
                    First Half
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      padding: "4px",
                      borderRadius: "6px",
                      backgroundColor: "#F0F9F0",
                      border: "1px solid #C8E6C9",
                    }}
                  >
                    <Checkbox
                      checked={areAllPresentFirstHalf}
                      indeterminate={areSomePresentFirstHalf}
                      onChange={(e) =>
                        handleBulkChange("firstHalf", e.target.checked)
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
                sx={{
                  width: 100,
                  borderRight: "1px solid #E5E7EB",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#2196F3",
                    }}
                  >
                    Second Half
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      padding: "4px",
                      borderRadius: "6px",
                      backgroundColor: "#F0F8FF",
                      border: "1px solid #BBDEFB",
                    }}
                  >
                    <Checkbox
                      checked={areAllPresentSecondHalf}
                      indeterminate={areSomePresentSecondHalf}
                      onChange={(e) =>
                        handleBulkChange("secondHalf", e.target.checked)
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
              <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Student Details
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
                  Roll No
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
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Domain
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow
                key={student.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "#F9FAFB",
                  },
                  "& td": {
                    borderBottom:
                      index === filteredStudents.length - 1
                        ? "none"
                        : "1px solid #E5E7EB",
                  },
                }}
              >
                {/* First Half */}
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      padding: "2px",
                      borderRadius: "4px",
                      backgroundColor:
                        getAttendanceStatus(student.id, "firstHalf") ===
                        "present"
                          ? "#F0F9F0"
                          : "transparent",
                      border:
                        getAttendanceStatus(student.id, "firstHalf") ===
                        "present"
                          ? "1px solid #C8E6C9"
                          : "1px solid transparent",
                    }}
                  >
                    <Checkbox
                      checked={
                        getAttendanceStatus(student.id, "firstHalf") ===
                        "present"
                      }
                      onChange={(e) =>
                        handleAttendanceChange(
                          student.id,
                          "firstHalf",
                          e.target.checked
                        )
                      }
                      size="small"
                      sx={{
                        color: "#4CAF50",
                        "&.Mui-checked": {
                          color: "#4CAF50",
                        },
                      }}
                    />
                  </Box>
                </TableCell>

                {/* Second Half */}
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      padding: "2px",
                      borderRadius: "4px",
                      backgroundColor:
                        getAttendanceStatus(student.id, "secondHalf") ===
                        "present"
                          ? "#F0F8FF"
                          : "transparent",
                      border:
                        getAttendanceStatus(student.id, "secondHalf") ===
                        "present"
                          ? "1px solid #BBDEFB"
                          : "1px solid transparent",
                    }}
                  >
                    <Checkbox
                      checked={
                        getAttendanceStatus(student.id, "secondHalf") ===
                        "present"
                      }
                      onChange={(e) =>
                        handleAttendanceChange(
                          student.id,
                          "secondHalf",
                          e.target.checked
                        )
                      }
                      size="small"
                      sx={{
                        color: "#2196F3",
                        "&.Mui-checked": {
                          color: "#2196F3",
                        },
                      }}
                    />
                  </Box>
                </TableCell>

                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        backgroundColor: student.avatar,
                        fontWeight: 600,
                        fontSize: "0.6rem",
                      }}
                    >
                      {student.initials}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#1F2937",
                          lineHeight: 1.2,
                        }}
                      >
                        {student.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    {student.email}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontWeight: 500 }}
                  >
                    {student.rollNo}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Chip
                    label={student.branch}
                    sx={{
                      backgroundColor: `${getBranchColor(student.branch)}15`,
                      color: getBranchColor(student.branch),
                      fontWeight: 500,
                      borderRadius: "4px",
                      fontSize: "0.6rem",
                      height: "18px",
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4B5563",
                      fontSize: "0.65rem",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={student.track}
                  >
                    {student.track}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    No students found matching your search criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AttendanceTable;
