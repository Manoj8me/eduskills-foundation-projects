import React, { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  TablePagination,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Email,
  School,
  CalendarToday,
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  EmojiEvents,
  Delete,
  Info,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";

import FilterPopoverForView from "./FilterPopoverForView";

const ViewStudents = ({
  selectedBooking,
  onBackToCalendar,
  showNotification,
}) => {
  const [studentsData, setStudentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    branches: [],
    cohorts: [],
    domains: [],
    passoutYears: [],
    eligibilityStatus: [],
  });

  useEffect(() => {
    if (selectedBooking) {
      fetchStudentsList();
    }
  }, [selectedBooking]);

  const fetchStudentsList = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/event/students-list/${selectedBooking.bookslot_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudentsData(data);
        setSelectedStudents([]);
      } else {
        setError("Failed to fetch students list");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Error fetching students list");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudents = async () => {
    try {
      setDeleting(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/event/remove-students`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookslot_id: selectedBooking.bookslot_id,
          student_ids: selectedStudents,
        }),
      });

      if (response.ok) {
        showNotification(
          `Successfully removed ${selectedStudents.length} student(s)`,
          "success"
        );
        setDeleteDialogOpen(false);
        setSelectedStudents([]);
        fetchStudentsList();
      } else {
        const errorData = await response.json();
        showNotification(
          errorData.message || "Failed to remove students",
          "error"
        );
      }
    } catch (error) {
      console.error("Error removing students:", error);
      showNotification("Error removing students", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allStudentIds = filteredStudents.map((s) => s.student_id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 15) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const hasEligibilityData = useMemo(() => {
    if (!studentsData?.students) return false;
    return studentsData.students.some(
      (student) =>
        student.is_eligible !== null && student.is_eligible !== undefined
    );
  }, [studentsData]);

  const getEligibilityStatus = (isEligible) => {
    if (isEligible === null || isEligible === undefined) return null;

    switch (isEligible) {
      case 0:
        return {
          label: "Dropout",
          color: "#F44336",
          icon: <Cancel sx={{ fontSize: 16 }} />,
        };
      case 1:
        return {
          label: "Passed",
          color: "#4CAF50",
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
        };
      case 2:
        return {
          label: "Certificate Issued",
          color: "#FF9800",
          icon: <EmojiEvents sx={{ fontSize: 16 }} />,
        };
      default:
        return null;
    }
  };

  const getUniqueOptions = (key) => {
    if (!studentsData?.students) return [];

    const values = new Set();

    studentsData.students.forEach((student) => {
      if (key === "branches" && student.branch) {
        values.add(student.branch);
      } else if (key === "cohorts" && student.cohorts) {
        student.cohorts.split(",").forEach((cohort) => {
          values.add(cohort.trim());
        });
      } else if (key === "domains" && student.domains) {
        student.domains.split(",").forEach((domain) => {
          values.add(domain.trim());
        });
      } else if (key === "passoutYears" && student.passoutYear) {
        values.add(student.passoutYear.toString());
      } else if (
        key === "eligibilityStatus" &&
        student.is_eligible !== null &&
        student.is_eligible !== undefined
      ) {
        const status = getEligibilityStatus(student.is_eligible);
        if (status) {
          values.add(student.is_eligible.toString());
        }
      }
    });

    if (key === "eligibilityStatus") {
      return Array.from(values)
        .sort()
        .map((value) => {
          const status = getEligibilityStatus(parseInt(value));
          return {
            label: status?.label || value,
            value: value,
          };
        });
    }

    return Array.from(values)
      .sort()
      .map((value) => ({
        label: value,
        value: value,
      }));
  };

  const applyFilters = (students) => {
    return students.filter((student) => {
      if (
        filters.branches.length > 0 &&
        !filters.branches.includes(student.branch)
      ) {
        return false;
      }

      if (filters.cohorts.length > 0) {
        const studentCohorts = student.cohorts.split(",").map((c) => c.trim());
        if (
          !studentCohorts.some((cohort) => filters.cohorts.includes(cohort))
        ) {
          return false;
        }
      }

      if (filters.domains.length > 0) {
        const studentDomains = student.domains.split(",").map((d) => d.trim());
        if (
          !studentDomains.some((domain) => filters.domains.includes(domain))
        ) {
          return false;
        }
      }

      if (
        filters.passoutYears.length > 0 &&
        !filters.passoutYears.includes(student.passoutYear.toString())
      ) {
        return false;
      }

      if (filters.eligibilityStatus.length > 0) {
        if (student.is_eligible === null || student.is_eligible === undefined) {
          return false;
        }
        if (
          !filters.eligibilityStatus.includes(student.is_eligible.toString())
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredStudents = useMemo(() => {
    if (!studentsData?.students) return [];

    let filtered = studentsData.students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNo &&
          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return applyFilters(filtered);
  }, [studentsData, searchTerm, filters]);

  const handleFilterClick = (filterType, event) => {
    setCurrentFilter(filterType);
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setCurrentFilter(null);
  };

  const handleFilterChange = (filterType, selectedValues) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: selectedValues,
    }));
    setPage(0);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce(
      (count, filterArray) => count + filterArray.length,
      0
    );
  };

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isUpcomingEvent = selectedBooking?.event_status === "Upcoming";

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
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3} mt={2}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBackToCalendar}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Back to Calendar
          </Button>
          <Typography variant="h4">View Students</Typography>
        </Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!studentsData || studentsData.students.length === 0) {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBackToCalendar}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Back to Calendar
          </Button>
          <Typography variant="h4">View Students</Typography>
        </Box>
        <Alert severity="info">No students found for this event.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3} mt={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBackToCalendar}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Back to Calendar
        </Button>
        <Typography variant="h4">View Students</Typography>
      </Box>

      {!isUpcomingEvent && (
        <Alert severity="info" icon={<Info />} sx={{ mb: 2 }}>
          Students cannot be removed from events that have already started or
          closed.
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Summary
              </Typography>
              <Box display="flex" gap={3}>
                <Box>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {studentsData.students_count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
                {studentsData.event.students_limit > 0 && (
                  <Box>
                    <Typography
                      variant="h4"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      {studentsData.event.students_limit -
                        studentsData.students_count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Available Slots
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography
                    variant="h4"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {studentsData.event.students_limit || "∞"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Capacity
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              <Box>
                <Typography variant="subtitle2" fontWeight="600">
                  {studentsData.event.event_type
                    .replace(/_/g, " ")
                    .toUpperCase()}
                </Typography>
                <Box display="flex" flexDirection="column" gap={0.5} mt={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday sx={{ fontSize: 14 }} color="primary" />
                    <Typography variant="caption">
                      {formatDate(studentsData.event.start_date)} -{" "}
                      {formatDate(studentsData.event.end_date)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person sx={{ fontSize: 14 }} color="primary" />
                    <Typography variant="caption">
                      {studentsData.event.trainer_name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Email sx={{ fontSize: 14 }} color="primary" />
                    <Typography variant="caption">
                      {studentsData.event.trainer_email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        display="flex"
        gap={2}
        alignItems="center"
        sx={{ mb: 2 }}
        flexWrap="wrap"
      >
        <TextField
          size="small"
          placeholder="Search students by name, email, or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 350 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterList />}
          onClick={(e) => handleFilterClick("branches", e)}
          sx={{
            textTransform: "none",
            backgroundColor:
              filters.branches.length > 0 ? "#e3f2fd" : "transparent",
            borderColor: filters.branches.length > 0 ? "#1976d2" : "#ccc",
          }}
        >
          Branch {filters.branches.length > 0 && `(${filters.branches.length})`}
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterList />}
          onClick={(e) => handleFilterClick("cohorts", e)}
          sx={{
            textTransform: "none",
            backgroundColor:
              filters.cohorts.length > 0 ? "#e3f2fd" : "transparent",
            borderColor: filters.cohorts.length > 0 ? "#1976d2" : "#ccc",
          }}
        >
          Cohort {filters.cohorts.length > 0 && `(${filters.cohorts.length})`}
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterList />}
          onClick={(e) => handleFilterClick("domains", e)}
          sx={{
            textTransform: "none",
            backgroundColor:
              filters.domains.length > 0 ? "#e3f2fd" : "transparent",
            borderColor: filters.domains.length > 0 ? "#1976d2" : "#ccc",
          }}
        >
          Domain {filters.domains.length > 0 && `(${filters.domains.length})`}
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterList />}
          onClick={(e) => handleFilterClick("passoutYears", e)}
          sx={{
            textTransform: "none",
            backgroundColor:
              filters.passoutYears.length > 0 ? "#e3f2fd" : "transparent",
            borderColor: filters.passoutYears.length > 0 ? "#1976d2" : "#ccc",
          }}
        >
          Year{" "}
          {filters.passoutYears.length > 0 &&
            `(${filters.passoutYears.length})`}
        </Button>

        {hasEligibilityData && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterList />}
            onClick={(e) => handleFilterClick("eligibilityStatus", e)}
            sx={{
              textTransform: "none",
              backgroundColor:
                filters.eligibilityStatus.length > 0
                  ? "#e3f2fd"
                  : "transparent",
              borderColor:
                filters.eligibilityStatus.length > 0 ? "#1976d2" : "#ccc",
            }}
          >
            Status{" "}
            {filters.eligibilityStatus.length > 0 &&
              `(${filters.eligibilityStatus.length})`}
          </Button>
        )}

        {getActiveFilterCount() > 0 && (
          <Button
            variant="text"
            size="small"
            onClick={() =>
              setFilters({
                branches: [],
                cohorts: [],
                domains: [],
                passoutYears: [],
                eligibilityStatus: [],
              })
            }
            sx={{ textTransform: "none", color: "#d32f2f" }}
          >
            Clear All Filters
          </Button>
        )}
      </Box>

      {getActiveFilterCount() > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Showing {filteredStudents.length} of{" "}
            {studentsData?.students?.length || 0} students
            {getActiveFilterCount() > 0 &&
              ` (${getActiveFilterCount()} filter${
                getActiveFilterCount() > 1 ? "s" : ""
              } applied)`}
          </Typography>
        </Box>
      )}

      {/* Remove Students Section - Above Table */}
      <Box sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {isUpcomingEvent &&
              "Select students to remove them from this event"}
          </Typography>

          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
            disabled={!isUpcomingEvent || selectedStudents.length === 0}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Remove Selected
            {selectedStudents.length > 0 && ` (${selectedStudents.length})`}
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #e0e7ff",
        }}
      >
        <Table size="small" sx={{ tableLayout: "auto" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              {isUpcomingEvent && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedStudents.length > 0 &&
                      selectedStudents.length < filteredStudents.length
                    }
                    checked={
                      filteredStudents.length > 0 &&
                      selectedStudents.length === filteredStudents.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell
                sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
              >
                Roll No
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
              >
                Branch
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
              >
                Year
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
              >
                Cohorts
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
              >
                Domains
              </TableCell>
              {hasEligibilityData && (
                <TableCell
                  sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.75, px: 1 }}
                >
                  Status
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map((student) => {
              const eligibilityStatus = getEligibilityStatus(
                student.is_eligible
              );
              const isSelected = selectedStudents.includes(student.student_id);

              return (
                <TableRow
                  key={student.student_id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    backgroundColor: isSelected ? "#e3f2fd" : "inherit",
                  }}
                >
                  {isUpcomingEvent && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectStudent(student.student_id)}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ py: 0.75, px: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ fontSize: "0.7rem" }}
                    >
                      {truncateText(student.name, 20)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.75, px: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                      {truncateText(student.email, 25)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.75, px: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                      {student.rollNo}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.75, px: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                      {truncateText(student.branch || "N/A", 12)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.75, px: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                      {student.passoutYear}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.75, px: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                      {truncateText(student.cohorts, 12)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.75, px: 1, maxWidth: 180 }}>
                    <Box display="flex" flexWrap="wrap" gap={0.25}>
                      {student.domains
                        .split(",")
                        .slice(0, 2)
                        .map((domain, idx) => (
                          <Chip
                            key={idx}
                            label={truncateText(domain.trim(), 12)}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.6rem",
                              height: "18px",
                              "& .MuiChip-label": {
                                px: 0.5,
                              },
                            }}
                          />
                        ))}
                      {student.domains.split(",").length > 2 && (
                        <Chip
                          label={`+${student.domains.split(",").length - 2}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.6rem",
                            height: "18px",
                            backgroundColor: "#f5f5f5",
                            "& .MuiChip-label": {
                              px: 0.5,
                            },
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  {hasEligibilityData && (
                    <TableCell sx={{ py: 0.75, px: 1 }}>
                      {eligibilityStatus ? (
                        <Chip
                          icon={eligibilityStatus.icon}
                          label={eligibilityStatus.label}
                          size="small"
                          sx={{
                            backgroundColor: eligibilityStatus.color,
                            color: "white",
                            fontWeight: 500,
                            fontSize: "0.65rem",
                            height: "20px",
                            "& .MuiChip-icon": {
                              color: "white",
                              fontSize: "0.85rem",
                            },
                            "& .MuiChip-label": {
                              px: 0.75,
                            },
                          }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.65rem" }}
                        >
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {paginatedStudents.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    hasEligibilityData
                      ? isUpcomingEvent
                        ? 9
                        : 8
                      : isUpcomingEvent
                      ? 8
                      : 7
                  }
                  align="center"
                  sx={{ py: 2 }}
                >
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {searchTerm
                      ? "No students found matching your search"
                      : "No students found"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredStudents.length}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {selectedStudents.length} student(s)
            from this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveStudents}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleting ? "Removing..." : "Remove Students"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Popovers */}
      <FilterPopoverForView
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl) && currentFilter === "branches"}
        onClose={handleFilterClose}
        title="Filter by Branch"
        options={getUniqueOptions("branches")}
        selectedValues={filters.branches}
        onSelectionChange={(selected) =>
          handleFilterChange("branches", selected)
        }
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
      />

      <FilterPopoverForView
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl) && currentFilter === "cohorts"}
        onClose={handleFilterClose}
        title="Filter by Cohort"
        options={getUniqueOptions("cohorts")}
        selectedValues={filters.cohorts}
        onSelectionChange={(selected) =>
          handleFilterChange("cohorts", selected)
        }
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
      />

      <FilterPopoverForView
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl) && currentFilter === "domains"}
        onClose={handleFilterClose}
        title="Filter by Domain"
        options={getUniqueOptions("domains")}
        selectedValues={filters.domains}
        onSelectionChange={(selected) =>
          handleFilterChange("domains", selected)
        }
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
      />

      <FilterPopoverForView
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl) && currentFilter === "passoutYears"}
        onClose={handleFilterClose}
        title="Filter by Passout Year"
        options={getUniqueOptions("passoutYears")}
        selectedValues={filters.passoutYears}
        onSelectionChange={(selected) =>
          handleFilterChange("passoutYears", selected)
        }
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        searchEnabled={false}
      />

      {hasEligibilityData && (
        <FilterPopoverForView
          anchorEl={filterAnchorEl}
          open={
            Boolean(filterAnchorEl) && currentFilter === "eligibilityStatus"
          }
          onClose={handleFilterClose}
          title="Filter by Status"
          options={getUniqueOptions("eligibilityStatus")}
          selectedValues={filters.eligibilityStatus}
          onSelectionChange={(selected) =>
            handleFilterChange("eligibilityStatus", selected)
          }
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          searchEnabled={false}
        />
      )}
    </Box>
  );
};

export default ViewStudents;
