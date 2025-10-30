import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  Tooltip,
  Pagination,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Badge,
  Modal,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Search,
  Add,
  FilterList,
  Close,
  Warning,
  Info,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import FilterPopover from "./FilterPopover";

const FilterButton = ({ label, count, onClick, hasSelections }) => (
  <Badge
    badgeContent={count > 0 ? count : null}
    sx={{
      "& .MuiBadge-badge": {
        backgroundColor: "#000000",
        color: "white",
        fontSize: "0.7rem",
        minWidth: 18,
        height: 18,
      },
    }}
  >
    <Button
      variant="outlined"
      size="small"
      onClick={onClick}
      endIcon={<FilterList fontSize="small" />}
      sx={{
        borderRadius: 3,
        textTransform: "none",
        borderColor: hasSelections ? "#000000" : "#e2e8f0",
        backgroundColor: hasSelections ? "#f5f5f5" : "white",
        color: hasSelections ? "#000000" : "#64748b",
        fontWeight: hasSelections ? 600 : 400,
        px: 2,
        py: 1,
        "&:hover": {
          borderColor: "#000000",
          backgroundColor: "#f1f5f9",
        },
      }}
    >
      {label}
    </Button>
  </Badge>
);

// Confirmation Modal Component
const AddStudentsModal = ({
  open,
  onClose,
  onConfirm,
  selectedStudents,
  allStudents,
  selectedBooking,
  submitting,
}) => {
  const eligibleStudents = allStudents.filter(
    (student) =>
      student.domains &&
      student.domains.some(
        (domain) =>
          selectedBooking.domain_name
            .toLowerCase()
            .includes(domain.toLowerCase()) ||
          domain
            .toLowerCase()
            .includes(selectedBooking.domain_name.toLowerCase())
      )
  );

  const selectedEligibleStudents = selectedStudents.filter((studentId) =>
    eligibleStudents.some((student) => student.user_id === studentId)
  );

  const selectedIneligibleStudents = selectedStudents.filter(
    (studentId) =>
      !eligibleStudents.some((student) => student.user_id === studentId)
  );

  const getStudentById = (studentId) => {
    return allStudents.find((student) => student.user_id === studentId);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-students-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 0,
          maxHeight: "85vh",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
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
          <Typography variant="h5" fontWeight={600}>
            Confirm Student Addition
          </Typography>
          <IconButton onClick={onClose} disabled={submitting}>
            <Close />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3, maxHeight: "70vh", overflow: "auto" }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You are about to add{" "}
            <strong>{selectedStudents.length} student(s)</strong> to the{" "}
            <strong>{selectedBooking.domain_name}</strong> event.
          </Typography>

          {/* Eligible Students Section */}
          {selectedEligibleStudents.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#f0f9f0",
                  color: "#2e7d32",
                  "& .MuiAlert-icon": {
                    color: "#2e7d32",
                  },
                }}
              >
                <Typography variant="body2">
                  <strong>
                    {selectedEligibleStudents.length} Eligible Student(s)
                  </strong>{" "}
                  - These students have matching domains and will be eligible
                  for certificates upon completion.
                </Typography>
              </Alert>

              <Box
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                {selectedEligibleStudents.map((studentId) => {
                  const student = getStudentById(studentId);
                  return (
                    <Box
                      key={studentId}
                      sx={{
                        mb: 1,
                        p: 1,
                        backgroundColor: "#f0fff0",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {student?.name} ({student?.email})
                      </Typography>
                      <Box display="flex" gap={0.5} mt={0.5}>
                        {student?.domains?.slice(0, 3).map((domain, index) => (
                          <Chip
                            key={index}
                            label={domain}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              height: 20,
                              borderColor: "#4caf50",
                              color: "#2e7d32",
                              backgroundColor: "#f0fff0",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Ineligible Students Section */}
          {selectedIneligibleStudents.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Alert
                severity="warning"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#fff8e1",
                  color: "#f57c00",
                  "& .MuiAlert-icon": {
                    color: "#f57c00",
                  },
                }}
              >
                <Typography variant="body2">
                  <strong>
                    {selectedIneligibleStudents.length} Student(s) with No
                    Domain Match
                  </strong>{" "}
                  - These students don't have matching domains for this event.
                  They can still be added, but they may not be eligible for
                  certificates unless they complete the program in the next
                  cohort with matching domains.
                </Typography>
              </Alert>

              <Box
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                {selectedIneligibleStudents.map((studentId) => {
                  const student = getStudentById(studentId);
                  return (
                    <Box
                      key={studentId}
                      sx={{
                        mb: 1,
                        p: 1,
                        backgroundColor: "#fff5f5",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {student?.name} ({student?.email})
                      </Typography>
                      <Box display="flex" gap={0.5} mt={0.5}>
                        {student?.domains?.slice(0, 3).map((domain, index) => (
                          <Chip
                            key={index}
                            label={domain}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              height: 20,
                              borderColor: "#9e9e9e",
                              color: "#616161",
                              backgroundColor: "#f5f5f5",
                            }}
                          />
                        ))}
                        {(!student?.domains ||
                          student?.domains?.length === 0) && (
                          <Typography variant="caption" color="text.secondary">
                            No domains assigned
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={submitting}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                borderColor: "#9e9e9e",
                color: "#9e9e9e",
                "&:hover": {
                  borderColor: "#757575",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} sx={{ color: "white" }} />
                ) : (
                  <Add />
                )
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                fontWeight: 500,
                backgroundColor: "#2196f3",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
                "&:disabled": {
                  backgroundColor: "#9e9e9e",
                  color: "white",
                },
              }}
            >
              {submitting
                ? "Adding..."
                : `Add ${selectedStudents.length} Student(s)`}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const StudentTable = ({ selectedBooking, onAddStudents, onNotification }) => {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addStudentsModalOpen, setAddStudentsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Multi-select filter states
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);

  // Popover states
  const [domainAnchor, setDomainAnchor] = useState(null);
  const [cohortAnchor, setCohortAnchor] = useState(null);
  const [yearAnchor, setYearAnchor] = useState(null);
  const [branchAnchor, setBranchAnchor] = useState(null);

  // Debounce search
  const [searchDebounce, setSearchDebounce] = useState("");

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    domains: [],
    cohorts: [],
    years: [],
    branches: [],
  });
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (selectedBooking && !filterOptionsLoading) {
      setSelectedStudents([]);
      setCurrentPage(1);
      setSearchTerm("");
      setSearchDebounce("");
      resetFilters();
      fetchStudents(1, "", pageSize);
    }
  }, [selectedBooking, pageSize, filterOptionsLoading]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch students when search, filters, or page changes
  useEffect(() => {
    if (selectedBooking && !filterOptionsLoading) {
      setCurrentPage(1);
      fetchStudents(1, searchDebounce, pageSize);
    }
  }, [
    searchDebounce,
    selectedDomains,
    selectedCohorts,
    selectedYears,
    selectedBranches,
    selectedBooking,
    pageSize,
    filterOptionsLoading,
  ]);

  const fetchFilterOptions = async () => {
    setFilterOptionsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/internship/studentInformationOptionsSpoc`,
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
        setFilterOptions({
          domains: data.domainsResponse || [],
          cohorts: data.cohortsResponse || [],
          years: data.yearsResponse || [],
          branches: data.branchesResponse || [],
        });
      } else {
        console.error("Failed to fetch filter options");
        onNotification("Failed to fetch filter options", "error");
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
      onNotification("Error fetching filter options", "error");
    } finally {
      setFilterOptionsLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedDomains([]);
    setSelectedCohorts([]);
    setSelectedYears([]);
    setSelectedBranches([]);
  };

  const fetchStudents = async (
    page = currentPage,
    search = searchDebounce,
    size = pageSize
  ) => {
    setStudentLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const payload = {
        page: page,
        page_size: size,
        search: search || "",
        // Send domain IDs instead of names
        domains: selectedDomains.length > 0 ? selectedDomains : null,
        // Send cohort IDs instead of cohort objects
        cohorts: selectedCohorts.length > 0 ? selectedCohorts : null,
        // Send year values as is
        years: selectedYears.length > 0 ? selectedYears : null,
        // Send branch names as is (strings)
        branches: selectedBranches.length > 0 ? selectedBranches : null,
      };

      const response = await fetch(`${BASE_URL}/event/students`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setAllStudents(data.students || []);
        setTotalPages(data.total_pages || 1);
        setTotalCount(data.count || 0);
        setCurrentPage(data.page || 1);
      } else {
        console.error("Failed to fetch students");
        onNotification("Failed to fetch students", "error");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      onNotification("Error fetching students", "error");
    } finally {
      setStudentLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchStudents(newPage, searchDebounce, pageSize);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setCurrentPage(1);
    fetchStudents(1, searchDebounce, newSize);
  };

  const handleAddStudentsClick = () => {
    if (selectedStudents.length === 0) {
      onNotification("Please select at least one student", "warning");
      return;
    }
    setAddStudentsModalOpen(true);
  };

  const addStudentsToEvent = async () => {
    setSubmitting(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Send all student IDs in a single API call
      const response = await fetch(`${BASE_URL}/event/add-students`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookslot_id: selectedBooking.bookslot_id,
          user_ids: selectedStudents, // Send as array instead of individual calls
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add students`);
      }

      const result = await response.json();

      onNotification(
        `Successfully added ${selectedStudents.length} student(s)`,
        "success"
      );
      setSelectedStudents([]);
      setAddStudentsModalOpen(false);
      onAddStudents(); // Callback to refresh bookings
    } catch (error) {
      console.error("Error adding students:", error);
      onNotification("Failed to add students", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAllOnPage = () => {
    const currentPageStudentIds = allStudents.map((student) => student.user_id);
    const allSelected = currentPageStudentIds.every((id) =>
      selectedStudents.includes(id)
    );

    if (allSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !currentPageStudentIds.includes(id))
      );
    } else {
      setSelectedStudents((prev) => {
        const newSelected = [...prev];
        currentPageStudentIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text || "N/A";
    return text.substring(0, maxLength) + "...";
  };

  const currentPageStudentIds = allStudents.map((student) => student.user_id);
  const isAllSelectedOnPage =
    currentPageStudentIds.length > 0 &&
    currentPageStudentIds.every((id) => selectedStudents.includes(id));

  // Skeleton Row Component
  const SkeletonRow = () => (
    <TableRow>
      <TableCell padding="checkbox">
        <Skeleton variant="rectangular" width={20} height={20} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="80%" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="90%" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="60%" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="70%" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="50%" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="50%" />
      </TableCell>
      <TableCell>
        <Box display="flex" gap={0.5}>
          <Skeleton
            variant="rectangular"
            width={80}
            height={20}
            sx={{ borderRadius: "10px" }}
          />
          <Skeleton
            variant="rectangular"
            width={60}
            height={20}
            sx={{ borderRadius: "10px" }}
          />
        </Box>
      </TableCell>
    </TableRow>
  );

  if (!selectedBooking) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Select Students for Event
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Domain: {selectedBooking.domain_name}
      </Typography>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2196f3",
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
            <FilterButton
              label="Domain"
              count={selectedDomains.length}
              onClick={(e) => setDomainAnchor(e.currentTarget)}
              hasSelections={selectedDomains.length > 0}
            />

            <FilterButton
              label="Cohort"
              count={selectedCohorts.length}
              onClick={(e) => setCohortAnchor(e.currentTarget)}
              hasSelections={selectedCohorts.length > 0}
            />

            <FilterButton
              label="Year"
              count={selectedYears.length}
              onClick={(e) => setYearAnchor(e.currentTarget)}
              hasSelections={selectedYears.length > 0}
            />

            <FilterButton
              label="Branch"
              count={selectedBranches.length}
              onClick={(e) => setBranchAnchor(e.currentTarget)}
              hasSelections={selectedBranches.length > 0}
            />

            {(selectedDomains.length > 0 ||
              selectedCohorts.length > 0 ||
              selectedYears.length > 0 ||
              selectedBranches.length > 0) && (
              <Button
                variant="text"
                size="small"
                onClick={resetFilters}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  color: "#ef4444",
                  "&:hover": {
                    backgroundColor: "#fef2f2",
                  },
                }}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              displayEmpty
              sx={{
                borderRadius: 3,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2196f3",
                },
              }}
            >
              <MenuItem value={10}>10 rows</MenuItem>
              <MenuItem value={20}>20 rows</MenuItem>
              <MenuItem value={50}>50 rows</MenuItem>
              <MenuItem value={100}>100 rows</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Filter Popovers */}
      <FilterPopover
        anchorEl={domainAnchor}
        open={Boolean(domainAnchor)}
        onClose={() => setDomainAnchor(null)}
        title="Select Domains"
        options={filterOptions.domains}
        selectedValues={selectedDomains}
        onSelectionChange={setSelectedDomains}
        getOptionLabel={(option) => option.domain_name}
        getOptionValue={(option) => option.domain_id} // Send domain_id
      />

      <FilterPopover
        anchorEl={cohortAnchor}
        open={Boolean(cohortAnchor)}
        onClose={() => setCohortAnchor(null)}
        title="Select Cohorts"
        options={filterOptions.cohorts}
        selectedValues={selectedCohorts}
        onSelectionChange={setSelectedCohorts}
        getOptionLabel={(option) => option.cohort_name}
        getOptionValue={(option) => option.cohort_id} // Send cohort_id
      />

      <FilterPopover
        anchorEl={yearAnchor}
        open={Boolean(yearAnchor)}
        onClose={() => setYearAnchor(null)}
        title="Select Years"
        options={filterOptions.years}
        selectedValues={selectedYears}
        onSelectionChange={setSelectedYears}
        getOptionLabel={(option) => option.toString()}
        getOptionValue={(option) => option} // Send year value as is
        searchEnabled={false}
      />

      <FilterPopover
        anchorEl={branchAnchor}
        open={Boolean(branchAnchor)}
        onClose={() => setBranchAnchor(null)}
        title="Select Branches"
        options={filterOptions.branches}
        selectedValues={selectedBranches}
        onSelectionChange={setSelectedBranches}
        getOptionLabel={(option) => option}
        getOptionValue={(option) => option} // Send branch name as is
      />

      {/* Loading state for filter options */}
      {filterOptionsLoading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress size={20} sx={{ color: "#2196f3" }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Loading filter options...
          </Typography>
        </Box>
      )}

      {/* Header with pagination info and Add button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={500}>
          Students
          {!studentLoading && (
            <Typography
              component="span"
              color="text.secondary"
              sx={{ ml: 1, fontSize: "0.9rem", fontWeight: 400 }}
            >
              (Page {currentPage} of {totalPages}, Total: {totalCount})
            </Typography>
          )}
          {selectedStudents.length > 0 && (
            <Typography
              component="span"
              sx={{ ml: 1, fontWeight: 500, color: "#2196f3" }}
            >
              - {selectedStudents.length} selected
            </Typography>
          )}
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <Button
            onClick={handleAddStudentsClick}
            variant="contained"
            disabled={selectedStudents.length === 0 || submitting}
            startIcon={<Add />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#2196f3",
              color: "white",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
              "&:disabled": {
                backgroundColor: "#9e9e9e",
                color: "white",
              },
            }}
          >
            Add {selectedStudents.length} Student(s)
          </Button>
        </Box>
      </Box>

      {/* Students Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 500,
          border: "1px solid #e0e0e0",
          borderRadius: 3,
          overflow: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  width: "50px",
                }}
              >
                <Checkbox
                  checked={isAllSelectedOnPage}
                  indeterminate={
                    currentPageStudentIds.some((id) =>
                      selectedStudents.includes(id)
                    ) && !isAllSelectedOnPage
                  }
                  onChange={handleSelectAllOnPage}
                  disabled={allStudents.length === 0 || studentLoading}
                  sx={{
                    "&.Mui-checked": {
                      color: "#2196f3",
                    },
                    "&.MuiCheckbox-indeterminate": {
                      color: "#2196f3",
                    },
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  minWidth: "200px",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  minWidth: "220px",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  minWidth: "120px",
                }}
              >
                Roll No
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  minWidth: "150px",
                }}
              >
                Branch
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  minWidth: "100px",
                }}
              >
                Pass Out Year
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  minWidth: "100px",
                }}
              >
                Cohort
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                  minWidth: "250px",
                }}
              >
                Current Domains
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : allStudents.length > 0 ? (
              allStudents.map((student) => (
                <TableRow
                  key={student.user_id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student.user_id)}
                      onChange={() => handleStudentSelection(student.user_id)}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2196f3",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={student.name} arrow>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {truncateText(student.name, 25)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={student.email} arrow>
                      <Typography variant="body2">
                        {truncateText(student.email, 30)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {truncateText(student.rollNo, 15)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={student.branch || "N/A"} arrow>
                      <Typography variant="body2">
                        {truncateText(student.branch, 18)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {student.passoutYear}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {Array.isArray(student.cohorts) &&
                      student.cohorts.length > 0
                        ? student.cohorts.join(", ")
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {student.domains && student.domains.length > 0 ? (
                        student.domains.slice(0, 2).map((domain, index) => (
                          <Tooltip key={index} title={domain} arrow>
                            <Chip
                              label={truncateText(domain, 15)}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: "0.65rem",
                                height: "20px",
                                borderRadius: 2,
                                borderColor: "#2196f3",
                                color: "#2196f3",
                                backgroundColor: "white",
                              }}
                            />
                          </Tooltip>
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No domains
                        </Typography>
                      )}
                      {student.domains && student.domains.length > 2 && (
                        <Chip
                          label={`+${student.domains.length - 2}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.6rem",
                            height: "20px",
                            borderRadius: 2,
                            borderColor: "#9e9e9e",
                            color: "#9e9e9e",
                            backgroundColor: "white",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No students found
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No students found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm
                      ? "Try adjusting your search terms or filters"
                      : "No students available"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!studentLoading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "#2196f3",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1976d2",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Add Students Confirmation Modal */}
      <AddStudentsModal
        open={addStudentsModalOpen}
        onClose={() => setAddStudentsModalOpen(false)}
        onConfirm={addStudentsToEvent}
        selectedStudents={selectedStudents}
        allStudents={allStudents}
        selectedBooking={selectedBooking}
        submitting={submitting}
      />
    </Box>
  );
};

export default StudentTable;
