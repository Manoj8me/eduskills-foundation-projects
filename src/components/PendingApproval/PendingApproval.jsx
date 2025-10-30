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
 // Import the new component
import { BASE_URL } from "../../services/configUrls";
import FilterForm from "./ReportAll";
import { Pending } from "@mui/icons-material";
import SearchForm from "./SearchForm";
import TotalRecordsDisplay from "./TotalRecordDisplay";
import api from "../../services/api";

// Create a theme instance (unchanged)
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

function PendingApproval() {
  const [searchParams, setSearchParams] = useState({});
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
    years: [],
  });
  const [refreshData, setRefreshData] = useState(0); // Add refresh counter to trigger data reload
  const [currentStatus, setCurrentStatus] = useState("Applied"); // Track current status for display

  // Helper function to format status ID based on status name
  const getStatusId = (status) => {
    if (!status) return 0; // Default status ID

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
        `${BASE_URL}/internship/studentInformationOptionsSpoc`,
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
          years: data.yearsResponse || [],
        });
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
      setError("Failed to fetch filter options. Please try again later.");
    }
  };

  // Fetch student data from API
  const fetchStudentData = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        page: pageParam,
        rowsPerPage: pageSizeParam,
        domain,
        status,
        searchTerm: search,
        ...otherParams
      } = params;

      // Set the current status for display
      if (status) {
        setCurrentStatus(status);
      }

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
        domains: params.domain_id || null,
        is_status: getStatusId(status),
        search: search || "",
        page: apiPage,
        page_size: pageSizeParam || 5,
      };

      // Add any other filtering parameters if needed
      if (params.cohort_id) {
        requestPayload.cohorts = params.cohort_id;
      }

      if (params.year) {
        requestPayload.years = params.year;
      }

      if (params.branch) {
        requestPayload.branches = params.branch;
      }

      const response = await api.post(
        `${BASE_URL}/internship/spoc/applied`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Parse the response
      const { data } = response;

      if (data && data.internships) {
        // Map API response to match our component's expected structure
        const formattedData = data.internships.map((internship) => ({
          id: internship.id || Math.random().toString(),
          name: internship.full_name || "",
          email: internship.email || "",
          rollNo: internship.roll_no || internship.id || "",
          passoutYear: internship.passout_year || "",
          cohort: internship.cohort || "",
          branch: internship.branch || "",
          status: internship.status || "Applied",
          domain: internship.domain || "", // Add domain field
          domain_id: internship.domain_id || 0, // Add domain_id field
          user_id: internship.user_id || 0, // Add user_id field
          internship_id: internship.internship_id || 0, // Add internship_id field
          // Add any other fields that might be needed
        }));

        setStudentData(formattedData);

        // Update total count from the API response
        // Use total_records if available, otherwise calculate from total_pages and page_size
        if (data.total_records !== undefined) {
          setTotalCount(data.total_records);
        } else {
          setTotalCount(
            data.total_pages * data.page_size || formattedData.length
          );
        }
      } else {
        setStudentData([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching internship data:", err);
      setError("Failed to fetch internship data. Please try again later.");
      setStudentData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Load filter options and initial data on component mount
  useEffect(() => {
    fetchFilterOptions();
    // Fetch default data when component mounts
    fetchStudentData({
      page: 0,
      rowsPerPage: 5,
      searchTerm: "",
    });
  }, []);

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

  // Trigger data refresh after domain change
  const handleDataRefresh = () => {
    setRefreshData((prev) => prev + 1); // Increment to trigger useEffect

    // Refresh the current page data
    const apiParams = {
      ...searchParams,
      page,
      rowsPerPage,
      searchTerm: searchTerm || searchParams?.email || "",
    };

    fetchStudentData(apiParams);
  };

  // Refresh data when refreshData changes
  useEffect(() => {
    if (refreshData > 0) {
      const apiParams = {
        ...searchParams,
        page,
        rowsPerPage,
        searchTerm: searchTerm || searchParams?.email || "",
      };

      fetchStudentData(apiParams);
    }
  }, [refreshData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hidden FilterForm - it's in the component but won't be displayed */}
        <div style={{ display: "none" }}>
          <FilterForm onSearch={handleSearch} filterOptions={filterOptions} />
        </div>
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

          {/* Add the TotalRecordsDisplay component */}
          {/* <TotalRecordsDisplay totalCount={totalCount} status={currentStatus} /> */}

          {/* Now show results table by default */}
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
            filterOptions={filterOptions}
            onDataRefresh={handleDataRefresh}
          />

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

export default PendingApproval;
