// TotalInternship.js - Simplified Main Dashboard Component
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  useTheme,
  CircularProgress,
  Typography,
  Fade,
  keyframes,
} from "@mui/material";

// Import components
import InternshipSummary from "./InternshipSummary";
import TalentConnectSummary from "./TalentConnectSummary";
import InstitutionDatabase from "./StudentDatabse";
import {
  fetchStudentMetrics,
  selectShouldRefresh,
  selectStudentMetricsData,
  selectStudentMetricsError,
  selectStudentMetricsLoading,
  selectLastFetched,
  resetShouldRefresh,
  triggerRefresh,
} from "../../../store/Slices/studentmetricsdashboard/studentMetricsSlice";

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

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

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

const TotalInternship = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [instituteImage, setInstituteImage] = useState(null);
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();

  // Use Redux selectors
  const dashboardData = useSelector(selectStudentMetricsData);
  const loading = useSelector(selectStudentMetricsLoading);
  const error = useSelector(selectStudentMetricsError);
  const shouldRefresh = useSelector(selectShouldRefresh);
  const lastFetched = useSelector(selectLastFetched);
  const userRole = useSelector((state) => state.authorise.userRole);

  // State to track when timestamps were last updated (for re-rendering)
  const [timestampUpdateTrigger, setTimestampUpdateTrigger] = useState(0);
  const [lastUserRole, setLastUserRole] = useState(null);

  // Process dashboard data to extract individual sections
  const [processedData, setProcessedData] = useState({
    institutionData: null,
    internshipData: null,
    talentConnectData: null,
    subscriptionData: null,
  });

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - updateTime) / 1000);

    if (diffInSeconds < 10) {
      return "just now";
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else {
      const options = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      return updateTime.toLocaleDateString("en-US", options).replace(",", ",");
    }
  };

  // Update timestamps every 10 seconds to show relative time changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampUpdateTrigger((prev) => prev + 1);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Watch for user role changes and trigger refresh
  useEffect(() => {
    console.log("Current user role:", userRole);
    console.log("Last user role:", lastUserRole);

    // Define roles that should use the internship dashboard
    const validRoles = ["spoc", "dspoc", "leaders", "tpo", "leader"];

    if (validRoles.includes(userRole)) {
      // If this is a role change (not initial load)
      if (lastUserRole !== null && lastUserRole !== userRole) {
        console.log(
          `User role changed from ${lastUserRole} to ${userRole}, triggering refresh`
        );
        dispatch(triggerRefresh());
      }

      // If we don't have data for this role, fetch it
      if (!dashboardData) {
        console.log(`No dashboard data for role ${userRole}, fetching...`);
        dispatch(fetchStudentMetrics());
      }
    }

    setLastUserRole(userRole);
  }, [userRole, lastUserRole, dashboardData, dispatch]);

  // Process dashboard data from Redux
  useEffect(() => {
    console.log("Processing dashboard data");

    if (dashboardData && typeof dashboardData === "object") {
      console.log("Raw dashboard data:", dashboardData);

      // Transform the flat API response to the expected nested structure
      const transformedData = transformApiResponse(dashboardData);

      console.log("Transformed data:", transformedData);
      setProcessedData(transformedData);
    }
  }, [dashboardData]);

  // Initial data fetch for valid roles
  useEffect(() => {
    const validRoles = ["spoc", "dspoc", "leaders", "tpo", "leader"];

    if (validRoles.includes(userRole) && !dashboardData) {
      console.log(`Initial data fetch for role: ${userRole}`);
      dispatch(fetchStudentMetrics());
    }
  }, [dispatch, dashboardData, userRole]);

  // Handle shouldRefresh changes
  useEffect(() => {
    if (shouldRefresh) {
      console.log("Should refresh triggered, fetching student metrics");
      dispatch(fetchStudentMetrics());
      dispatch(resetShouldRefresh());
    }
  }, [shouldRefresh, dispatch]);

  // Don't render anything for invalid roles
  const validRoles = ["spoc", "dspoc", "leaders", "tpo", "leader"];
  if (!validRoles.includes(userRole)) {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: isDarkMode ? "#1E1E1E" : "#ffffff",
        }}
      >
        <CircularProgress color="info" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: isDarkMode ? "#1E1E1E" : "#ffffff",
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Data
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error}
        </Typography>
      </Box>
    );
  }

  // Check if dashboardData is null and show processing message
  if (dashboardData === null) {
    return (
      <Box
        sx={{
          p: 4,
          bgcolor: isDarkMode ? "#1E1E1E" : "#ffffff",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 3,
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "8px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isDarkMode ? "#90caf9" : "#757575",
              bgcolor: isDarkMode ? "rgba(144, 202, 249, 0.05)" : "#f9f9f9",
              overflow: "hidden",
            }}
          >
            {instituteImage ? (
              <img
                src={`data:image/jpeg;base64,${instituteImage}`}
                alt="Institute Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
                  fill={isDarkMode ? "#90caf9" : "#757575"}
                />
              </svg>
            )}
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#ffffff" : "#212121",
                fontSize: "18px",
                lineHeight: "1.2",
              }}
            >
              Hello, {userName}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? "#b0bec5" : "#757575",
                fontSize: "14px",
              }}
            >
              {localStorage.getItem("instituteName")} ({userRole})
            </Typography>
          </Box>
        </Box>

        {/* Processing Message */}
        <ProcessingMessage isDarkMode={isDarkMode} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: isDarkMode ? "#1E1E1E" : "#ffffff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "8px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isDarkMode ? "#90caf9" : "#757575",
            bgcolor: isDarkMode ? "rgba(144, 202, 249, 0.05)" : "#f9f9f9",
            overflow: "hidden",
          }}
        >
          {instituteImage ? (
            <img
              src={`data:image/jpeg;base64,${instituteImage}`}
              alt="Institute Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
                fill={isDarkMode ? "#90caf9" : "#757575"}
              />
            </svg>
          )}
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: isDarkMode ? "#ffffff" : "#212121",
              fontSize: "18px",
              lineHeight: "1.2",
            }}
          >
            Hello, {userName}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? "#b0bec5" : "#757575",
              fontSize: "14px",
            }}
          >
            {processedData.subscriptionData?.institute_name || "Institute"} (
            {userRole})
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ position: "relative", zIndex: 1 }}>
        {/* Institution Database Section */}
        <InstitutionDatabase
          dashboardData={processedData.institutionData}
          timestamp={lastFetched}
          formatTimestamp={formatTimestamp}
          timestampTrigger={timestampUpdateTrigger}
        />

        {/* Internships Summary Section */}
        <Grid item xs={12}>
          <InternshipSummary
            dashboardData={processedData.internshipData}
            timestamp={lastFetched}
            formatTimestamp={formatTimestamp}
            timestampTrigger={timestampUpdateTrigger}
          />
        </Grid>

        {/* Talent Connect Summary Section */}
        <TalentConnectSummary
          dashboardData={processedData.talentConnectData}
          timestamp={lastFetched}
          formatTimestamp={formatTimestamp}
          timestampTrigger={timestampUpdateTrigger}
        />
      </Grid>
    </Box>
  );
};

export default TotalInternship;
