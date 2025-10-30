import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Add this import
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Alert,
  Snackbar,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import SearchForm from "./SearchForm";
import ResultsTable from "./ResultsTable";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

import { BASE_URL } from "../../services/configUrls";
import { styled } from "@mui/material/styles";
import api from "../../services/api";
import Deleted from "../Deleted/Deleted";
import StaffDeleted from "../Deleted/StaffDeleted";
import StaffArchived from "../Archive/StaffArchived";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#0088cc",
    },
    secondary: {
      main: "#19857b",
    },
    background: {
      default: "#f8f9fa",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
  },
  typography: {
    fontFamily: '"Poppins","Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  background: "#ffffff",
  overflow: "hidden",
  border: "1px solid rgba(0, 136, 204, 0.08)",
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
  textTransform: "none",
  fontWeight: 600,
  marginLeft: theme.spacing(1),
}));

const ViewDeletedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.success.dark,
  },
  textTransform: "none",
  fontWeight: 600,
  marginRight: theme.spacing(1),
}));

const ViewArchivedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.warning.dark,
  },
  textTransform: "none",
  fontWeight: 600,
  marginRight: theme.spacing(1),
}));

function StaffNotApplied() {
  // Get user role from Redux store
  const userRole = useSelector((state) => state.authorise.userRole);

  const [searchParams, setSearchParams] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // New state to track if search has been performed
  const [showDeleted, setShowDeleted] = useState(false); // State to show Deleted tab
  const [showArchived, setShowArchived] = useState(false); // State to show Archived tab
  const [selectedInstituteId, setSelectedInstituteId] = useState(null); // State to track selectedInstituteId

  // Check if user is a leader (disable actions for leaders)
  const isLeader = userRole === "leaders";

  // Function to get selectedInstituteId from localStorage
  const getSelectedInstituteId = () => {
    return localStorage.getItem("selectedInstituteId");
  };

  // Update selectedInstituteId when localStorage changes
  useEffect(() => {
    const updateInstituteId = () => {
      setSelectedInstituteId(getSelectedInstituteId());
    };

    // Set initial value
    updateInstituteId();

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "selectedInstituteId") {
        updateInstituteId();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for direct localStorage changes in the same tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === "selectedInstituteId") {
        updateInstituteId();
      }
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Only fetch filter options on initial load, don't load data automatically
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const instituteId = getSelectedInstituteId();

        if (!accessToken) {
          setError("Authentication token not found. Please login again.");
          return;
        }

        if (!instituteId) {
          setError("Institute ID not found. Please select an institute.");
          return;
        }

        const response = await api.post(
          `${BASE_URL}/profile/studentInformationOptions1/staff`,
          {
            institute_id: instituteId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data && response.data.filterData) {
          setFilterOptions(response.data);
          // No longer loading data by default
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to fetch filter options. Please try again later.");
      }
    };

    if (selectedInstituteId) {
      fetchFilterOptions();
    }
  }, [selectedInstituteId]); // Re-fetch when selectedInstituteId changes

  // Reset selected students when page changes or new search is performed
  useEffect(() => {
    setSelectedStudents([]);
  }, [page, searchParams]);

  // Fetch student data from API
  const fetchStudentData = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        page: pageParam,
        rowsPerPage: pageSizeParam,
        email, // Extract email directly instead of searchTerm
        ...otherParams
      } = params;

      // Convert to 1-based page index for API
      const apiPage = (pageParam || 0) + 1;

      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");
      const instituteId = getSelectedInstituteId();

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      if (!instituteId) {
        setError("Institute ID not found. Please select an institute.");
        setLoading(false);
        return;
      }

      // Prepare POST payload - Include email as the search parameter and InstituteId
      const payload = {
        page: apiPage,
        page_size: pageSizeParam || 5, // Default to 5 rows per page
        search: email || "", // Use email directly as the search parameter
        years: otherParams.year || [],
        branches: otherParams.branch || [],
        profileStatus: otherParams.profileStatus || [], // Remove default "active"
        internshipStatus: otherParams.internshipStatus || [], // Remove default "not applied"
        institute_id: instituteId, // Add institute_id to payload
      };

      const response = await api.post(
        `${BASE_URL}/profile/studentIntake2/staff`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Parse the response
      const { data } = response;

      if (data) {
        // Map API response to match our component's expected structure
        const formattedData = data.total_students_details.map((student) => ({
          id: student.id || Math.random().toString(),
          name: student.name || "N/A",
          email: student.email || "N/A",
          rollNo: student.rollNo || null,
          passoutYear: student.passoutYear || "N/A",
          branch: student.branch || "N/A",
          cohorts: student.cohorts || [], // Add cohorts array from API response
          status: student.internshipapplied === 1 ? "Applied" : "Not Applied",
          profileStatus: student.profilestatus === 1 ? "active" : "inactive",
          internshipStatus:
            student.internshipapplied === 1 ? "applied" : "not applied",
        }));

        setStudentData(formattedData);
        setHasSearched(true); // Set hasSearched to true when data is fetched

        // Use the pagination information from the API response
        if (data.count_total_students !== undefined) {
          setTotalCount(data.count_total_students);
        } else if (data.total_pages && data.page_size) {
          setTotalCount(data.total_pages * data.page_size);
        } else {
          // Fallback to the length of the returned data
          setTotalCount(formattedData.length);
        }
      } else {
        setStudentData([]);
        setTotalCount(0);
        setHasSearched(true); // Still mark as searched even if no results
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student data. Please try again later.");
      setStudentData([]);
      setTotalCount(0);
      setHasSearched(true); // Mark as searched even on error
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (params) => {
    // Use only the user-selected filters without any defaults
    const updatedParams = {
      ...params,
      internshipStatus: params.internshipStatus || [], // No default value
      profileStatus: params.profileStatus || [], // No default value
    };

    setSearchParams(updatedParams);
    setPage(0); // Reset to first page when searching

    // Prepare parameters for API call
    const apiParams = {
      ...updatedParams,
      page: 0,
      rowsPerPage,
    };

    fetchStudentData(apiParams);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);

    // Prepare parameters for API call
    const apiParams = {
      ...searchParams,
      page: newPage, // This gets converted to 1-based in fetchStudentData
      rowsPerPage,
    };

    fetchStudentData(apiParams);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page

    // Prepare parameters for API call
    const apiParams = {
      ...searchParams,
      page: 0, // This gets converted to 1-based in fetchStudentData
      rowsPerPage: newRowsPerPage,
    };

    fetchStudentData(apiParams);
  };

  // Handle selection of students for deletion
  const handleSelectionChange = (selectedIds) => {
    if (!isLeader) {
      // Only allow selection if not a leader
      setSelectedStudents(selectedIds);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = () => {
    if (!isLeader) {
      // Only allow delete dialog if not a leader
      setDeleteDialogOpen(true);
    }
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Handle opening Deleted tab
  const handleViewDeletedStudents = () => {
    setShowDeleted(true);
  };

  // Handle opening Archived tab
  const handleViewArchivedStudents = () => {
    setShowArchived(true);
  };

  // Handle going back to NotApplied from Deleted
  const handleBackToNotApplied = () => {
    setShowDeleted(false);
    setShowArchived(false);
  };

  // Perform bulk deletion of inactive profiles
  const handleBulkDelete = async () => {
    if (isLeader) return; // Prevent deletion if user is a leader

    try {
      setLoading(true);
      setDeleteDialogOpen(false);

      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Call the API to delete inactive profiles
      const response = await api.delete(
        `${BASE_URL}/profile/deleteInactiveBulk`,

        {
          data: { intake_ids: selectedStudents },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Check if deletion was successful
      if (response.data && response.status === 200) {
        // Show success message for deletion
        setSuccessMessage(
          "Selected inactive profiles have been successfully deleted."
        );
        setDeleteSuccess(true);

        // Reset selection
        setSelectedStudents([]);

        // Refresh the data after deletion
        fetchStudentData({
          ...searchParams,
          page,
          rowsPerPage,
        });
      }
    } catch (err) {
      console.error("Error deleting inactive profiles:", err);
      setError("Failed to delete inactive profiles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle successful student update
  const handleStudentUpdated = (updatedData) => {
    // Refresh data after student update
    fetchStudentData({
      ...searchParams,
      page,
      rowsPerPage,
    });

    // Show appropriate success message based on the field that was updated
    if (updatedData && updatedData.action === "update") {
      let fieldName;
      switch (updatedData.field) {
        case "rollNo":
          fieldName = "Roll Number";
          break;
        case "branch":
          fieldName = "Branch";
          break;
        case "passoutYear":
          fieldName = "Passout Year";
          break;
        default:
          fieldName = "information";
      }
      setSuccessMessage(`Student ${fieldName} has been successfully updated.`);
      setDeleteSuccess(true);
    }
  };

  // Clear error message
  const handleCloseError = () => {
    setError(null);
  };

  // Clear success message
  const handleCloseSuccess = () => {
    setDeleteSuccess(false);
    setSuccessMessage("");
  };

  // Show Deleted tab if showDeleted is true
  if (showDeleted) {
    return <StaffDeleted onBack={handleBackToNotApplied} />;
  }

  // Show Archived tab if showArchived is true
  if (showArchived) {
    return <StaffArchived onBack={handleBackToNotApplied} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            minHeight: "100vh",
            animation: "fadeIn 0.5s ease-in-out",
            "@keyframes fadeIn": {
              "0%": {
                opacity: 0,
              },
              "100%": {
                opacity: 1,
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              mb: 1,
              mt: 1,
              padding: 1,
            }}
          >
            <ViewDeletedButton
              size="small"
              variant="contained"
              onClick={handleViewDeletedStudents}
            >
              View Deleted Students
            </ViewDeletedButton>
            <ViewArchivedButton
              size="small"
              variant="contained"
              onClick={handleViewArchivedStudents}
            >
              View Archived Students
            </ViewArchivedButton>
          </Box>
          <SearchForm onSearch={handleSearch} filterOptions={filterOptions} />

          {/* Bulk actions toolbar when students are selected - Hidden for leaders */}
          {!isLeader && selectedStudents.length > 0 && (
            <StyledPaper sx={{ mt: 2, mb: 2, p: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedStudents.length} inactive{" "}
                  {selectedStudents.length === 1 ? "profile" : "profiles"}{" "}
                  selected
                </Typography>
                <DeleteButton
                  size="small"
                  variant="contained"
                  onClick={handleOpenDeleteDialog}
                  disabled={loading}
                >
                  Delete
                </DeleteButton>
              </Box>
            </StyledPaper>
          )}

          {/* Only show results table after search has been performed */}
          {hasSearched && (
            <ResultsTable
              searchParams={searchParams}
              data={studentData}
              loading={loading}
              totalCount={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              showActions={!isLeader} // Hide actions for leaders
              showCheckboxes={!isLeader} // Hide checkboxes for leaders
              onSelectionChange={handleSelectionChange}
              selectedIds={selectedStudents}
              filterOptions={filterOptions}
              onStudentUpdated={handleStudentUpdated}
              userRole={userRole} // Pass userRole to ResultsTable
            />
          )}

          {/* Delete confirmation dialog - Hidden for leaders */}
          {!isLeader && (
            <DeleteConfirmationModal
              open={deleteDialogOpen}
              onClose={handleCloseDeleteDialog}
              onConfirm={handleBulkDelete}
              selectedCount={selectedStudents.length}
              isLoading={loading}
            />
          )}

          {/* Error notification */}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>

          {/* Success notification */}
          <Snackbar
            open={deleteSuccess}
            autoHideDuration={6000}
            onClose={handleCloseSuccess}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSuccess}
              severity="success"
              sx={{ width: "100%" }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default StaffNotApplied;
