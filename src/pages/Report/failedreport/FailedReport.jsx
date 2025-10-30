import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import ResultsTable from "./ResultsTable";

import { BASE_URL } from "../../../services/configUrls";
import SearchForm from "./SearchForm";
import api from "../../../services/api";

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
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
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

function FailedReport() {
  const [searchParams, setSearchParams] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    cohorts: [],
    domains: [],
    branches: [],
  });

  // Helper function to format status ID based on status name
  const getStatusId = (status) => {
    if (!status) return 6; // Default status ID

    // Map status names to IDs - adjust these mappings as needed
    const statusMap = {
      Applied: 1,
      Approved: 2,
      Rejected: 3,
      Pending: 4,
    };

    return statusMap[status] || 6;
  };

  // Fetch filter options from API
  const fetchFilterOptions = async () => {
    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await api.get(
        `${BASE_URL}/internship/studentInformationOptions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Parse the response
      const { data } = response;

      if (data) {
        setFilterOptions({
          domains: data.domainsResponse || [],
          cohorts: data.cohortsResponse || [],
          branches: data.branchesResponse || [],
        });
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
      setError("Failed to fetch filter options. Please try again later.");
    }
  };

  // Load filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Format student data from API response
  const formatStudentData = (certificates) => {
    if (!certificates || !Array.isArray(certificates)) return [];

    return certificates.map((certificate, index) => ({
      id: index.toString(), // Using index as fallback ID if no ID is provided
      name: certificate.fullName || "",
      email: certificate.email || "",
      passoutYear: certificate.passoutyear || "",
      cohort: certificate.cohort || "",
      branch: certificate.branch || "",
    }));
  };

  // Fetch student data from API
  const fetchStudentData = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        page: pageParam,
        rowsPerPage: pageSizeParam,
        email,
        status,
        domains,
        cohorts,
        years,
        branches,
        ...otherParams
      } = params;

      // Convert to 1-based page index for API
      const apiPage = (pageParam || 0) + 1;

      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Prepare request payload according to new API requirements
      const requestPayload = {
        page: apiPage,
        limit: pageSizeParam || 5,
      };

      // Only add search if it has a value
      if (email || searchTerm) {
        requestPayload.search = email || searchTerm || "";
      }

      // Add multiple domains filter if selected
      if (domains && domains.length > 0) {
        requestPayload.domains = domains;
      }

      // Add multiple cohorts filter if selected
      if (cohorts && cohorts.length > 0) {
        requestPayload.cohorts = cohorts;
      }

      // Add multiple years filter if selected
      if (years && years.length > 0) {
        requestPayload.years = years.map((year) => parseInt(year));
      }

      // Add multiple branches filter if selected
      if (branches && branches.length > 0) {
        requestPayload.branches = branches;
      }

      // Add status filter only if selected
      if (status) {
        // Map status to status_id
        const statusId = getStatusId(status);
        if (statusId !== 6) {
          // 6 is the default "All" value
          requestPayload.status = statusId;
        }
      }

      const response = await api.post(
        `${BASE_URL}/internship/failedStudents`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Parse the response based on new structure
      const { data } = response;

      if (data && data.certificates) {
        const formattedData = formatStudentData(data.certificates);
        setStudentData(formattedData);
        setTotalCount(data.totalPages * data.pageSize || formattedData.length);
      } else {
        setStudentData([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching certificate data:", err);
      setError("Failed to fetch certificate data. Please try again later.");
      setStudentData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(0); // Reset to first page when searching

    // Prepare parameters for API call
    const apiParams = {
      ...params,
      page: 0,
      rowsPerPage,
      searchTerm: params.email || "",
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
      searchTerm: searchTerm || searchParams?.email || "",
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
      page: 0,
      rowsPerPage: newRowsPerPage,
      searchTerm: searchTerm || searchParams?.email || "",
    };

    fetchStudentData(apiParams);
  };

  // Handle search term change
  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(0); // Reset to first page when changing search term

    // Prepare parameters for API call
    const apiParams = {
      ...searchParams,
      page: 0,
      rowsPerPage,
      searchTerm: newSearchTerm,
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
          <SearchForm onSearch={handleSearch} filterOptions={filterOptions} />

          {/* Only show results table after search is initiated */}
          {searchParams !== null && (
            <ResultsTable
              searchParams={searchParams}
              data={studentData}
              loading={loading}
              totalCount={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSearchTermChange={handleSearchTermChange}
              searchTerm={searchTerm}
            />
          )}

          {/* Error notification */}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default FailedReport;
