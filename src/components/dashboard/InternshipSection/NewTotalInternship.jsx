import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  useTheme,
  CircularProgress,
  Typography,
  Button,
  styled,
  Fade,
  keyframes,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SchoolIcon from "@mui/icons-material/School";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Import components
import InternshipSummary from "./InternshipSummary";
import TalentConnectSummary from "./TalentConnectSummary";
import InstitutionDatabase from "./StudentDatabse";
import {
  fetchStudentMetrics,
  fetchStudentMetricsWithFilters,
  selectStudentMetricsData,
  selectStudentMetricsError,
  selectStudentMetricsLoading,
  selectSelectedInstitute,
  selectSelectedState,
} from "../../../store/Slices/studentnewmetric/studentNewMetricsSlice";

// Keyframes for animations
const pulseAnimation = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const GradientBanner = styled(Box)(({ theme, isDarkMode }) => ({
  width: "100%",
  borderRadius: "12px",
  background: "linear-gradient(90deg, #2196f3 0%, #1976d2 50%, #0d47a1 100%)", // Changed to medium blue gradient
  padding: "16px 24px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "30%",
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%)",
    transform: "skewX(-30deg)",
  },
}));

// FIXED: Modified StyledButton to ensure clickability
const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: variant === "contained" ? "30px" : "8px",
  padding: variant === "contained" ? "8px 24px" : "6px 16px",
  textTransform: "none",
  fontWeight: 500,
  boxShadow: variant === "contained" ? "0 4px 10px rgba(0, 0, 0, 0.2)" : "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      variant === "contained" ? "0 6px 15px rgba(0, 0, 0, 0.25)" : "none",
    cursor: "pointer", // Explicitly set cursor
  },
  cursor: "pointer", // Ensure pointer cursor is always shown
  zIndex: 10, // Ensure button is on top of other elements
  position: "relative", // Add position to make zIndex effective
  pointerEvents: "auto", // Force pointer events
}));

const LoadingContainer = styled(Box)(({ theme, isDarkMode }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh",
  backgroundColor: isDarkMode ? "#121212" : "#f7f9fc",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
}));

const DashboardContainer = styled(Box)(({ theme, isDarkMode }) => ({
  padding: theme.spacing(4),
  backgroundColor: isDarkMode ? "#121212" : "#f7f9fc",
  minHeight: "100vh",
  position: "relative",
  borderRadius: "12px",
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

// Processing Message Component
const ProcessingMessage = ({ isDarkMode }) => {
  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
          textAlign: "center",
          animation: `${fadeInUp} 0.8s ease-out`,
        }}
      >
        {/* Animated Icon */}
        <Box
          sx={{
            mb: 4,
            animation: `${pulseAnimation} 2s ease-in-out infinite`,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill={isDarkMode ? "#90caf9" : "#1976d2"}
              opacity="0.8"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke={isDarkMode ? "#90caf9" : "#1976d2"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke={isDarkMode ? "#90caf9" : "#1976d2"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        {/* Main Message */}
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: isDarkMode ? "#ffffff" : "#212121",
            animation: `${fadeInUp} 0.8s ease-out 0.2s both`,
          }}
        >
          Dashboard Data Processing
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: isDarkMode ? "#b0bec5" : "#757575",
            maxWidth: "400px",
            lineHeight: 1.6,
            animation: `${fadeInUp} 0.8s ease-out 0.4s both`,
          }}
        >
          Your dashboard data is currently being processed. This may take a few
          days to complete.
        </Typography>

        {/* Additional Info */}
        <Typography
          variant="caption"
          sx={{
            mt: 4,
            color: isDarkMode ? "#757575" : "#9e9e9e",
            animation: `${fadeInUp} 0.8s ease-out 1s both`,
          }}
        >
          We'll notify you once the processing is complete
        </Typography>
      </Box>
    </Fade>
  );
};

// Function to transform flat API response to nested structure
const transformApiResponse = (flatData) => {
  const transformed = {
    // Institution Data
    institutionData: {
      intakeData: flatData.number_of_students || 0,
      activeStudents: flatData.number_of_active || 0,
      approved: flatData.approved || 0,
      used: flatData.used || 0,
      available: flatData.available || 0,
      archived: flatData.archived || 0,
      deleted: flatData.deleted || 0,
      leader: flatData.leader_count || 0,
      educators: flatData.spoc_count || 0,
      deducators: flatData.dspoc_count || 0,
      faculty: flatData.faculty_count || 0,
      yearWiseData: [
        {
          passOutYear: flatData.year1_year || "2025",
          intakeStudents: flatData.year1_intake || 0,
          activeStudents: flatData.year1_active || 0,
        },
        {
          passOutYear: flatData.year2_year || "2026",
          intakeStudents: flatData.year2_intake || 0,
          activeStudents: flatData.year2_active || 0,
        },
        {
          passOutYear: flatData.year3_year || "2027",
          intakeStudents: flatData.year3_intake || 0,
          activeStudents: flatData.year3_active || 0,
        },
        {
          passOutYear: flatData.year4_year || "2028",
          intakeStudents: flatData.year4_intake || 0,
          activeStudents: flatData.year4_active || 0,
        },
      ],
    },

    // Internship Data
    internshipData: {
      participation: flatData.internship_applied || 0,
      uncomplete: flatData.internship_ongoing || 0,
      completed: flatData.internship_completed || 0,
      domainWiseCompleted: [
        {
          domainName: flatData.domain1_name || "Domain 1",
          domainCount: flatData.domain1_number || 0,
        },
        {
          domainName: flatData.domain2_name || "Domain 2",
          domainCount: flatData.domain2_number || 0,
        },
        {
          domainName: flatData.domain3_name || "Domain 3",
          domainCount: flatData.domain3_number || 0,
        },
        {
          domainName: flatData.domain4_name || "Domain 4",
          domainCount: flatData.domain4_number || 0,
        },
        {
          domainName: flatData.domain5_name || "Domain 5",
          domainCount: flatData.domain5_number || 0,
        },
      ]
        .sort((a, b) => b.domainCount - a.domainCount)
        .slice(0, 5), // Top 5 domains
      cohortWise: [
        {
          cohort_number: parseInt(flatData.year1_year) || 2025,
          participation: Math.floor((flatData.internship_applied || 0) * 0.4),
          uncomplete: Math.floor((flatData.internship_ongoing || 0) * 0.4),
          completed: Math.floor((flatData.internship_completed || 0) * 0.4),
        },
        {
          cohort_number: parseInt(flatData.year2_year) || 2026,
          participation: Math.floor((flatData.internship_applied || 0) * 0.3),
          uncomplete: Math.floor((flatData.internship_ongoing || 0) * 0.3),
          completed: Math.floor((flatData.internship_completed || 0) * 0.3),
        },
        {
          cohort_number: parseInt(flatData.year3_year) || 2027,
          participation: Math.floor((flatData.internship_applied || 0) * 0.2),
          uncomplete: Math.floor((flatData.internship_ongoing || 0) * 0.2),
          completed: Math.floor((flatData.internship_completed || 0) * 0.2),
        },
        {
          cohort_number: parseInt(flatData.year4_year) || 2028,
          participation: Math.floor((flatData.internship_applied || 0) * 0.1),
          uncomplete: Math.floor((flatData.internship_ongoing || 0) * 0.1),
          completed: Math.floor((flatData.internship_completed || 0) * 0.1),
        },
      ],
      // Internship frequency data - ensure these are included
      one_internship: flatData.one_internship || 0,
      two_internship: flatData.two_internship || 0,
      three_internship: flatData.three_internship || 0,
      four_more_internship: flatData.four_more_internship || 0,
      single_time_failed: flatData.single_time_failed || 0,
      two_time_failed: flatData.two_time_failed || 0,
    },

    // Talent Connect Data
    talentConnectData: {
      postedJobs: flatData.postedJobs || 0,
      openedJobs: flatData.openedJobs || 0,
      appliedJobs: flatData.appliedJobs || 0,
      shortlisted: flatData.shortlisted || 0,
    },

    // Subscription Data
    subscriptionData: {
      institute_name: flatData.institute_name || "Institute",
    },
  };

  console.log("✅ Transformed internship data includes:", {
    one_internship: transformed.internshipData.one_internship,
    two_internship: transformed.internshipData.two_internship,
    three_internship: transformed.internshipData.three_internship,
    four_more_internship: transformed.internshipData.four_more_internship,
  });

  return transformed;
};

const NewTotalInternship = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const dispatch = useDispatch();
  const userRole = localStorage.getItem("Authorise");

  // Use Redux selectors
  const dashboardData = useSelector(selectStudentMetricsData);
  const loading = useSelector(selectStudentMetricsLoading);
  const error = useSelector(selectStudentMetricsError);
  const selectedState = useSelector(selectSelectedState);
  const selectedInstitute = useSelector(selectSelectedInstitute);

  // Track the last loaded state and institute to prevent unnecessary reloads
  const [lastLoadedStateId, setLastLoadedStateId] = useState(null);
  const [lastLoadedInstituteId, setLastLoadedInstituteId] = useState(null);

  // Process dashboard data to extract individual sections
  const [processedData, setProcessedData] = useState({
    institutionData: null,
    internshipData: null,
    talentConnectData: null,
    instituteName: null,
  });

  console.log("Dashboard", dashboardData);

  // Process dashboard data from Redux - Updated to handle both array and single object response
  useEffect(() => {
    console.log("Processing dashboard data in NewTotalInternship");

    if (dashboardData && Array.isArray(dashboardData)) {
      // Handle array response (existing logic)
      const processed = {
        institutionData: null,
        internshipData: null,
        talentConnectData: null,
        instituteName: null,
      };

      dashboardData.forEach((item) => {
        // Parse dashboard JSON string if needed
        let parsedDashboard;
        try {
          parsedDashboard =
            typeof item.dashboard === "string"
              ? JSON.parse(item.dashboard)
              : item.dashboard;
        } catch (error) {
          console.error("Error parsing dashboard data:", error);
          return;
        }

        if (item.dashboard_number === 1) {
          processed.institutionData = parsedDashboard;
          // Extract institute name from institution data
          processed.instituteName = parsedDashboard?.institute_name;
        } else if (item.dashboard_number === 2) {
          processed.internshipData = parsedDashboard;
        } else if (item.dashboard_number === 3) {
          processed.talentConnectData = parsedDashboard;
        }
      });

      setProcessedData(processed);
    } else if (dashboardData && typeof dashboardData === "object") {
      // Handle single object response (like TotalInternship)
      console.log("Raw dashboard data:", dashboardData);

      // Transform the flat API response to the expected nested structure
      const transformedData = transformApiResponse(dashboardData);

      console.log("Transformed data:", transformedData);

      setProcessedData({
        institutionData: transformedData.institutionData,
        internshipData: transformedData.internshipData,
        talentConnectData: transformedData.talentConnectData,
        instituteName: transformedData.subscriptionData?.institute_name,
      });
    }
  }, [dashboardData]);

  // Function to load dashboard data
  const loadDashboardData = () => {
    if (selectedState?.id && selectedInstitute?.id) {
      console.log(
        "Loading data for state/institute:",
        selectedState.name,
        selectedInstitute.name
      );

      dispatch(
        fetchStudentMetricsWithFilters({
          state_id: selectedState.id,
          institute_id: selectedInstitute.id,
          state_name: selectedState.name,
          institute_name: selectedInstitute.name,
        })
      );

      // Update last loaded IDs to prevent duplicate loads
      setLastLoadedStateId(selectedState.id);
      setLastLoadedInstituteId(selectedInstitute.id);
    } else {
      console.log("No state/institute selected, loading default data");
      dispatch(fetchStudentMetrics());
    }
  };

  // Load dashboard data whenever selected state or institute changes
  useEffect(() => {
    // Only reload if we have both selections and they're different from last loaded
    if (
      selectedState?.id &&
      selectedInstitute?.id &&
      (selectedState.id !== lastLoadedStateId ||
        selectedInstitute.id !== lastLoadedInstituteId)
    ) {
      console.log(
        "Selection changed, loading new data:",
        selectedState.name,
        selectedInstitute.name
      );

      loadDashboardData();
    }
  }, [
    selectedState,
    selectedInstitute,
    lastLoadedStateId,
    lastLoadedInstituteId,
  ]);

  // Listen for the custom filtersApplied event from the Topbar
  useEffect(() => {
    const handleFiltersApplied = (event) => {
      console.log("Filters applied event received:", event.detail);
      // Force reload with the event data (even if the same as current selection)
      dispatch(fetchStudentMetricsWithFilters(event.detail));
      // Update last loaded IDs to match what was just loaded
      if (event.detail.state_id) setLastLoadedStateId(event.detail.state_id);
      if (event.detail.institute_id)
        setLastLoadedInstituteId(event.detail.institute_id);
    };

    window.addEventListener("filtersApplied", handleFiltersApplied);

    return () => {
      window.removeEventListener("filtersApplied", handleFiltersApplied);
    };
  }, [dispatch]);

  // Initial load effect - loads data when component mounts
  useEffect(() => {
    if (!dashboardData && selectedState?.id && selectedInstitute?.id) {
      loadDashboardData();
    } else if (!dashboardData) {
      dispatch(fetchStudentMetrics());
    }

    // Set up a listener for localStorage changes to handle cross-tab selection
    const handleStorageChange = (e) => {
      if (e.key === "selectedStateId" || e.key === "selectedInstituteId") {
        loadDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handler for refreshing data
  const handleRefreshData = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <LoadingContainer isDarkMode={isDarkMode}>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: isDarkMode ? "#64b5f6" : "#1976d2",
            mb: 3,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: isDarkMode ? "#e0e0e0" : "#424242",
            fontWeight: 500,
          }}
        >
          Loading Dashboard Data...
        </Typography>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer isDarkMode={isDarkMode}>
        <ErrorOutlineIcon
          sx={{
            fontSize: 60,
            color: "error.main",
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          color="error"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Failed to Load Data
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: isDarkMode ? "#bbbbbb" : "#666666",
            mb: 3,
          }}
        >
          {error}
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleRefreshData}
          startIcon={<RefreshIcon />}
          data-testid="refresh-data-button"
        >
          Retry
        </StyledButton>
      </LoadingContainer>
    );
  }

  // Check if dashboardData is null and show processing message
  if (dashboardData === null) {
    return (
      <DashboardContainer isDarkMode={isDarkMode}>
        {/* College Name Banner Display */}
        <GradientBanner isDarkMode={isDarkMode}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ mr: 2, fontSize: 28, color: "#ffffff" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#ffffff",
                fontSize: { xs: "14px", sm: "16px" },
                letterSpacing: "0.5px",
              }}
            >
              Your College Name
            </Typography>
          </Box>
        </GradientBanner>

        {/* Processing Message */}
        <ProcessingMessage isDarkMode={isDarkMode} />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
      {/* College Name Banner Display */}
      <GradientBanner isDarkMode={isDarkMode}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SchoolIcon sx={{ mr: 2, fontSize: 28, color: "#ffffff" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#ffffff",
              fontSize: { xs: "14px", sm: "16px" },
              letterSpacing: "0.5px",
            }}
          >
            {processedData.instituteName || "Your College Name"}
          </Typography>
        </Box>
      </GradientBanner>

      {/* Dashboard Header with Refresh Button */}
      <HeaderBox>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: isDarkMode ? "#e0e0e0" : "#1a237e",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 40,
              height: 3,
              background: "linear-gradient(90deg, #1a237e 0%, #2979ff 100%)",
              borderRadius: 4,
            },
          }}
        >
          Dashboard
        </Typography>

        <StyledButton
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshData}
          data-testid="refresh-data-button"
        >
          Refresh Data
        </StyledButton>
      </HeaderBox>

      <Grid container spacing={3} sx={{ position: "relative", zIndex: 1 }}>
        {/* Institution Database Section */}
        <InstitutionDatabase dashboardData={processedData.institutionData} />

        {/* Internships Summary Section */}
        <Grid item xs={12}>
          <InternshipSummary dashboardData={processedData.internshipData} />
        </Grid>

        {/* Talent Connect Summary Section */}
        <TalentConnectSummary dashboardData={processedData.talentConnectData} />
      </Grid>
    </DashboardContainer>
  );
};

export default NewTotalInternship;
