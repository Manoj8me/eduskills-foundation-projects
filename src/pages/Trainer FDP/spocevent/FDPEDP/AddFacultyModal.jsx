import React, { useState, useEffect, useRef } from "react";
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
  Checkbox,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  TablePagination,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../../../services/configUrls";

const AddFacultyModal = ({ open, onClose, bookslotId, onSuccess }) => {
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFacultyList, setFilteredFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Ref to prevent duplicate submissions
  const isSubmittingRef = useRef(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get unique designations and branches for filters
  const uniqueDesignations = [
    ...new Set(facultyList.map((f) => f.designation).filter(Boolean)),
  ];
  const uniqueBranches = [
    ...new Set(facultyList.map((f) => f.branch).filter(Boolean)),
  ];

  // Fetch faculty list when modal opens
  useEffect(() => {
    if (open) {
      fetchFacultyList();
      // Reset states when modal opens
      setSelectedFaculty([]);
      setSearchQuery("");
      setDesignationFilter("");
      setBranchFilter("");
      setPage(0);
      isSubmittingRef.current = false;
    }
  }, [open]);

  // Apply filters whenever filter values change
  useEffect(() => {
    let filtered = [...facultyList];

    // Search filter (name, email, phone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(query) ||
          faculty.email.toLowerCase().includes(query) ||
          faculty.phone_no.includes(query)
      );
    }

    // Designation filter
    if (designationFilter) {
      filtered = filtered.filter(
        (faculty) => faculty.designation === designationFilter
      );
    }

    // Branch filter
    if (branchFilter) {
      filtered = filtered.filter((faculty) => faculty.branch === branchFilter);
    }

    setFilteredFacultyList(filtered);
    setPage(0); // Reset to first page when filters change
  }, [facultyList, searchQuery, designationFilter, branchFilter]);

  const fetchFacultyList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/event/faculty-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.data && response.data.data) {
        setFacultyList(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch faculty list. Please try again.");
      console.error("Error fetching faculty list:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFaculty = (faculty) => {
    const isSelected = selectedFaculty.some(
      (f) => f.faculty_id === faculty.faculty_id && f.email === faculty.email
    );

    if (isSelected) {
      setSelectedFaculty(
        selectedFaculty.filter(
          (f) =>
            !(f.faculty_id === faculty.faculty_id && f.email === faculty.email)
        )
      );
    } else {
      setSelectedFaculty([...selectedFaculty, faculty]);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentPageFaculty = paginatedFaculty();
      const newSelections = [...selectedFaculty];

      currentPageFaculty.forEach((faculty) => {
        const isAlreadySelected = newSelections.some(
          (f) =>
            f.faculty_id === faculty.faculty_id && f.email === faculty.email
        );
        if (!isAlreadySelected) {
          newSelections.push(faculty);
        }
      });

      setSelectedFaculty(newSelections);
    } else {
      const currentPageFaculty = paginatedFaculty();
      setSelectedFaculty(
        selectedFaculty.filter(
          (selected) =>
            !currentPageFaculty.some(
              (current) =>
                current.faculty_id === selected.faculty_id &&
                current.email === selected.email
            )
        )
      );
    }
  };

  const isFacultySelected = (faculty) => {
    return selectedFaculty.some(
      (f) => f.faculty_id === faculty.faculty_id && f.email === faculty.email
    );
  };

  const isAllSelected = () => {
    const currentPageFaculty = paginatedFaculty();
    return (
      currentPageFaculty.length > 0 &&
      currentPageFaculty.every((faculty) => isFacultySelected(faculty))
    );
  };

  const paginatedFaculty = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredFacultyList.slice(startIndex, endIndex);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = async () => {
    if (selectedFaculty.length === 0) {
      setError("Please select at least one faculty member.");
      return;
    }

    // Prevent duplicate submissions
    if (isSubmittingRef.current || submitting) {
      console.log("Submission already in progress, ignoring duplicate call");
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      // Extract faculty IDs from selected faculty
      const facultyIds = selectedFaculty.map((faculty) => faculty.faculty_id);

      // Single API call with all faculty IDs
      await axios.post(
        `${BASE_URL}/event/add-faculty-to-bookslot`,
        {
          bookslot_id: bookslotId,
          faculty_ids: facultyIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setSuccessMessage(
        `Successfully added ${selectedFaculty.length} faculty member(s)!`
      );

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError("Failed to add faculty. Please try again.");
      console.error("Error adding faculty:", err);
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
      // Reset states
      setSelectedFaculty([]);
      setSearchQuery("");
      setDesignationFilter("");
      setBranchFilter("");
      setError(null);
      setSuccessMessage("");
      setPage(0);
      isSubmittingRef.current = false;
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDesignationFilter("");
    setBranchFilter("");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: "60vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            pb: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Add Faculty Members
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={submitting}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {/* Filters Section */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                mb: 2,
              }}
            >
              {/* Search Bar */}
              <TextField
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flexGrow: 1, minWidth: "250px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Designation Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Designation</InputLabel>
                <Select
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                  label="Designation"
                >
                  <MenuItem value="">All</MenuItem>
                  {uniqueDesignations.map((designation) => (
                    <MenuItem key={designation} value={designation}>
                      {designation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Branch Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  label="Branch"
                >
                  <MenuItem value="">All</MenuItem>
                  {uniqueBranches.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Clear Filters Button */}
              {(searchQuery || designationFilter || branchFilter) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearFilters}
                  sx={{ minWidth: "auto" }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>

            {/* Selected Count */}
            {selectedFaculty.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="primary">
                  {selectedFaculty.length} faculty member(s) selected
                </Typography>
              </Box>
            )}
          </Box>

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Faculty Table */}
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  maxHeight: "400px",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedFaculty.length > 0 && !isAllSelected()
                          }
                          checked={isAllSelected()}
                          onChange={handleSelectAll}
                          disabled={paginatedFaculty().length === 0}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Designation
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedFaculty().length > 0 ? (
                      paginatedFaculty().map((faculty, index) => (
                        <TableRow
                          key={`${faculty.faculty_id}-${faculty.email}-${index}`}
                          hover
                          onClick={() => handleSelectFaculty(faculty)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isFacultySelected(faculty)} />
                          </TableCell>
                          <TableCell>{faculty.name}</TableCell>
                          <TableCell>{faculty.email}</TableCell>
                          <TableCell>{faculty.phone_no}</TableCell>
                          <TableCell>{faculty.designation || "-"}</TableCell>
                          <TableCell>{faculty.branch || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            {filteredFacultyList.length === 0
                              ? searchQuery || designationFilter || branchFilter
                                ? "No faculty found matching your filters"
                                : "No faculty available"
                              : "No results"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredFacultyList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: "1px solid #e0e0e0" }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button
            onClick={handleClose}
            disabled={submitting}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || selectedFaculty.length === 0}
            variant="contained"
            color="primary"
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Adding...
              </>
            ) : (
              `Add ${
                selectedFaculty.length > 0 ? `(${selectedFaculty.length})` : ""
              }`
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddFacultyModal;
