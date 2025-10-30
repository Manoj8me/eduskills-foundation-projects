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
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import SearchForm from "./SearchForm";
import ResultsTable from "./ResultsTable";
import { BASE_URL } from "../../services/configUrls";
import { styled } from "@mui/material/styles";
import api from "../../services/api";

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

const BackButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  textTransform: "none",
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

function StaffDeleted({ onBack }) {
  // Get user role from Redux store
  const userRole = useSelector((state) => state.authorise.userRole);

  const [searchParams, setSearchParams] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [currentInstituteId, setCurrentInstituteId] = useState(null);

  // Check if user is a leader (disable actions for leaders)
  const isLeader = userRole === "leaders";

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const selectedInstituteId = localStorage.getItem("selectedInstituteId");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      if (!selectedInstituteId) {
        setError("Institute ID not found. Please select an institute.");
        return;
      }

      const payload = {
        institute_id: selectedInstituteId,
      };

      const response = await api.post(
        `${BASE_URL}/profile/studentInformationOptions1/staff`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.filterData) {
        setFilterOptions(response.data);
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
      setError("Failed to fetch filter options. Please try again later.");
    }
  };

  // Monitor institute ID changes and refresh data
  useEffect(() => {
    const selectedInstituteId = localStorage.getItem("selectedInstituteId");

    // If institute ID changed, refresh filter options and clear search results
    if (selectedInstituteId !== currentInstituteId) {
      setCurrentInstituteId(selectedInstituteId);
      setHasSearched(false);
      setStudentData([]);
      setTotalCount(0);
      setPage(0);
      setSearchParams(null);

      if (selectedInstituteId) {
        fetchFilterOptions();
      }
    }
  }); // Remove dependency array to check on every render

  // Initial load - fetch filter options
  useEffect(() => {
    const selectedInstituteId = localStorage.getItem("selectedInstituteId");
    setCurrentInstituteId(selectedInstituteId);

    if (selectedInstituteId) {
      fetchFilterOptions();
    }
  }, []);

  // Fetch student data from API
  const fetchStudentData = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        page: pageParam,
        rowsPerPage: pageSizeParam,
        email,
        ...otherParams
      } = params;

      // Convert to 1-based page index for API
      const apiPage = (pageParam || 0) + 1;

      // Get the access token and institute ID from local storage
      const accessToken = localStorage.getItem("accessToken");
      const selectedInstituteId = localStorage.getItem("selectedInstituteId");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      if (!selectedInstituteId) {
        setError("Institute ID not found. Please select an institute.");
        setLoading(false);
        return;
      }

      // Prepare POST payload
      const payload = {
        institute_id: selectedInstituteId,
        page: apiPage,
        page_size: pageSizeParam || 5,
        search: email || "",
        years: (otherParams.year || []).map(String),
        branches: otherParams.branch || [],
      };

      const response = await api.post(
        `${BASE_URL}/profile/inactive-students/staff`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Parse the response
      const { data } = response;

      if (data && data.students) {
        // Map API response to match our component's expected structure
        const formattedData = data.students.map((student, index) => ({
          id: student.intake_id || Math.random().toString(),
          name: student.name || "N/A",
          email: student.mail_id || "N/A",
          passoutYear: student.year || "N/A",
          branch: student.branch || "N/A",
          intake_id: student.intake_id, // Keep for internal use but hidden
        }));

        setStudentData(formattedData);
        setHasSearched(true);

        // Calculate total count based on pagination info
        if (data.total_pages && data.page_size) {
          setTotalCount(data.total_pages * data.page_size);
        } else {
          setTotalCount(formattedData.length);
        }
      } else {
        setStudentData([]);
        setTotalCount(0);
        setHasSearched(true);
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student data. Please try again later.");
      setStudentData([]);
      setTotalCount(0);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(0);

    // Prepare parameters for API call
    const apiParams = {
      ...params,
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
      page: newPage,
      rowsPerPage,
    };

    fetchStudentData(apiParams);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    // Prepare parameters for API call
    const apiParams = {
      ...searchParams,
      page: 0,
      rowsPerPage: newRowsPerPage,
    };

    fetchStudentData(apiParams);
  };

  // Clear error message
  const handleCloseError = () => {
    setError(null);
  };

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
          {/* Back Button */}
          <BackButton
            startIcon={<ArrowBack />}
            onClick={onBack}
            variant="contained"
          >
            Back to Manage
          </BackButton>

          <SearchForm onSearch={handleSearch} filterOptions={filterOptions} />

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
              showActions={false}
              showCheckboxes={!isLeader} // Hide checkboxes for leaders
              filterOptions={filterOptions}
              userRole={userRole} // Pass userRole to ResultsTable
              onDataRefresh={() => {
                // Refresh data after restore
                const apiParams = {
                  ...searchParams,
                  page,
                  rowsPerPage,
                };
                fetchStudentData(apiParams);
              }}
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
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default StaffDeleted;
