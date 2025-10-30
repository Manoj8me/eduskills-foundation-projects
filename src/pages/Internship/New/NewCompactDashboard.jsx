// NewCompactInternshipDashboard.js
import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Skeleton,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  FileCheck,
  ClipboardCheck,
  Award,
  Info,
} from "lucide-react";
import ApplicationStatusSection from "./AppliedStatus";

import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";
import UpfrontFilters from "./FilterMenu";
import StudentParticipationCompletion from "../../../components/dashboard/InternshipSection/StudentParicipationCompletion";
import StaffModernUpfrontFilters from "./StaffFilterMenu";
import StaffStudentCompletion from "../../../components/dashboard/InternshipSection/StaffStudentCompletion";
import InternshipRankings from "./InternshipRankings"; // Import the new component
import api from "../../../services/api";

// Loading Skeleton for Status Card
const StatusCardSkeleton = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Skeleton
        variant="rectangular"
        width={32}
        height={32}
        sx={{ borderRadius: 1, mr: 1.5 }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        <Skeleton variant="text" width={40} height={30} />
        <Skeleton variant="text" width={80} height={20} />
      </Box>
    </Paper>
  );
};

// Compact Status Card Component
const StatusCard = ({ icon, title, count, color, bgColor }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        backgroundColor: bgColor,
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: color,
          borderRadius: 1,
          p: 0.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          mr: 1.5,
        }}
      >
        {React.cloneElement(icon, { size: 16, color: "white" })}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{
            lineHeight: 1,
            color: "#333",
            fontSize: "1.25rem",
          }}
        >
          {count}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            fontWeight: 500,
            mt: 0.25,
            fontSize: "0.75rem",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

// Compact Section card component with title that can include tooltip
const SectionCard = ({ title, children, tooltip, height }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: height || "100%",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: "#1a1a1a", fontSize: "1rem" }}
        >
          {title}
        </Typography>
        {tooltip && (
          <Tooltip
            title={
              <Typography
                sx={{
                  p: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#fff",
                }}
              >
                {tooltip}
              </Typography>
            }
            arrow
            placement="right"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#000000",
                  "& .MuiTooltip-arrow": {
                    color: "#000000",
                  },
                  borderRadius: 1.5,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                },
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                ml: 0.5,
                p: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                },
              }}
            >
              <Info size={16} color="#6366f1" />
            </IconButton>
          </Tooltip>
        )}
        {/* Rankings indicators - only show for Rankings section */}
        {title === "Internship Ranking" && (
          <Box
            sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#f97316", // Orange
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: "0.7rem", color: "#666", fontWeight: 500 }}
              >
                Provisional
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#10b981", // Green
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: "0.7rem", color: "#666", fontWeight: 500 }}
              >
                Final
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
    </Paper>
  );
};

const NewCompactInternshipDashboard = () => {
  const [filters, setFilters] = useState({
    cohorts: [],
    domains: [],
    branches: [],
    passoutYears: [],
  });

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Track localStorage values
  const [selectedStateId, setSelectedStateId] = useState(
    localStorage.getItem("selectedStateId")
  );
  const [selectedInstituteId, setSelectedInstituteId] = useState(
    localStorage.getItem("selectedInstituteId")
  );

  // For triggering ranking refresh when localStorage changes
  const [rankingRefreshTrigger, setRankingRefreshTrigger] = useState(0);

  // Current cohort info
  const [currentCohortInfo, setCurrentCohortInfo] = useState("");

  // Function to update current cohort info based on selected filters
  const updateCurrentCohortInfo = (cohortIds, options) => {
    if (!options?.cohortsResponse || cohortIds.length === 0) {
      setCurrentCohortInfo("No cohort selected");
      return;
    }

    const selectedCohorts = options.cohortsResponse.filter((cohort) =>
      cohortIds.includes(cohort.cohort_id)
    );

    if (selectedCohorts.length > 0) {
      const cohort = selectedCohorts[0];
      const startDate = new Date(cohort.start_date);
      const endDate = new Date(cohort.end_date);

      const startFormatted = startDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const endFormatted = endDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      setCurrentCohortInfo(
        `${cohort.cohort_name} (${startFormatted} - ${endFormatted})`
      );
    } else {
      setCurrentCohortInfo("Unknown cohort");
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const instituteId = localStorage.getItem("selectedInstituteId") || "";

      const response = await api.post(
        `${BASE_URL}/internship/studentInformationOptionsStaff`,
        { institute_id: instituteId }, // Send institute_id in the request payload
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFilterOptions(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      setError("Failed to fetch filter options");
      return null;
    }
  };

  // Fetch dashboard data with filters
  const fetchDashboardData = async (currentFilters, options) => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Prepare filter payload
      const filterPayload = {};

      if (currentFilters.cohorts.length > 0) {
        filterPayload.cohorts = currentFilters.cohorts;
        // Update cohort info
        updateCurrentCohortInfo(currentFilters.cohorts, options);
      }

      if (currentFilters.domains.length > 0) {
        filterPayload.domains = currentFilters.domains;
      }

      if (currentFilters.branches.length > 0) {
        // Fixed branch handling logic for string array response
        const branchNames = [];

        console.log("Selected branch IDs:", currentFilters.branches);
        console.log("Available branches:", options?.branchesResponse);

        if (
          options?.branchesResponse &&
          Array.isArray(options.branchesResponse)
        ) {
          // Since branchesResponse is an array of strings, map selected indices to branch names
          currentFilters.branches.forEach((branchId) => {
            const index = parseInt(branchId);
            if (index >= 0 && index < options.branchesResponse.length) {
              const branchName = options.branchesResponse[index];
              branchNames.push(branchName);
              console.log(`Mapped index ${index} to branch: ${branchName}`);
            }
          });
        }

        // Ensure we're sending only strings, not objects
        if (branchNames.length > 0) {
          filterPayload.branches = branchNames;
          console.log("Final branches to send:", branchNames);
        }
      }

      if (currentFilters.passoutYears.length > 0) {
        filterPayload.years = currentFilters.passoutYears;
      }

      // Get institute_id directly from localStorage
      const storedInstituteId = localStorage.getItem("selectedInstituteId");
      if (storedInstituteId) {
        filterPayload.institute_id = storedInstituteId;
      }

      // Get state_id directly from localStorage
      const storedStateId = localStorage.getItem("selectedStateId");
      if (storedStateId) {
        filterPayload.state_id = storedStateId;
      }

      console.log("Filter payload being sent:", filterPayload); // Debug log

      const response = await api.post(
        `${BASE_URL}/internship/internship-dashboard-staff`,
        filterPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDashboardData(response.data);
      setInitialLoadComplete(true);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data and set up default filters
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);

      try {
        // Fetch filter options first
        const options = await fetchFilterOptions();

        if (!options) {
          throw new Error("Failed to fetch filter options");
        }

        // Find the latest cohort for default selection
        if (options.cohortsResponse && options.cohortsResponse.length > 0) {
          const latestCohort = options.cohortsResponse.reduce(
            (latest, current) => {
              const currentDate = new Date(current.start_date);
              const latestDate = new Date(latest.start_date);
              return currentDate > latestDate ? current : latest;
            },
            options.cohortsResponse[0]
          );

          // Set the latest cohort as the default selected one
          const initialFilters = {
            ...filters,
            cohorts: [latestCohort.cohort_id],
          };

          setFilters(initialFilters);

          // Fetch dashboard data with the initial filters
          await fetchDashboardData(initialFilters, options);
        } else {
          setInitialLoadComplete(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        setError("Failed to initialize dashboard");
        setLoading(false);
      }
    };

    initializeData();
    // Empty dependency array means this effect runs once on mount
  }, []);

  // Listen for changes to localStorage values
  useEffect(() => {
    // Setup an interval to check localStorage values
    const checkLocalStorage = () => {
      const currentStateId = localStorage.getItem("selectedStateId");
      const currentInstituteId = localStorage.getItem("selectedInstituteId");

      // If either value has changed, update state and trigger a refresh
      if (
        currentStateId !== selectedStateId ||
        currentInstituteId !== selectedInstituteId
      ) {
        setSelectedStateId(currentStateId);
        setSelectedInstituteId(currentInstituteId);

        // Refresh dashboard and ranking data with current filters
        if (filterOptions) {
          fetchDashboardData(filters, filterOptions);
          // Trigger ranking refresh by incrementing the trigger
          setRankingRefreshTrigger((prev) => prev + 1);
        }
      }
    };

    // Check every 1000ms
    const interval = setInterval(checkLocalStorage, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [filters, filterOptions, selectedStateId, selectedInstituteId]);

  // Map API data to internship status cards
  const internshipStatusData = [
    {
      title: "Applied",
      count: dashboardData?.internship_applied,
      icon: <ClipboardCheck />,
      color: "#6366f1", // Indigo 500
      bgColor: "#eef2ff", // Indigo 50
    },
    {
      title: "Approved",
      count: dashboardData?.internship_approved,
      icon: <CheckCircle />,
      color: "#10b981", // Emerald 500
      bgColor: "#ecfdf5", // Emerald 50
    },
    {
      title: "Certificate Verified",
      count: dashboardData?.certificate_verified,
      icon: <FileCheck />,
      color: "#3b82f6", // Blue 500
      bgColor: "#eff6ff", // Blue 50
    },
    {
      title: "Assessment Completed",
      count: dashboardData?.completed_first_attempt,
      icon: <ClipboardCheck />,
      color: "#f43f5e", // Rose 500
      bgColor: "#fff1f2", // Rose 50
    },
    {
      title: "Final Certificate Issued",
      count: dashboardData?.certificate_issued,
      icon: <Award />,
      color: "#f97316", // Orange 500
      bgColor: "#fff7ed", // Orange 50
    },
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchDashboardData(newFilters, filterOptions);
  };

  if (error) {
    return (
      <Box sx={{ mt: 2, mb: 3, width: "100%", textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 1, width: "100%" }}>
      {/* Upfront Filters Section */}
      <StaffModernUpfrontFilters
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Show dashboard content only after initial load is complete */}
      {initialLoadComplete || loading ? (
        <Grid container spacing={2} sx={{ minHeight: "calc(100vh - 200px)" }}>
          {/* Left column - Internship Status and Rankings */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={1.5} sx={{ maxHeight: "100%" }}>
              {/* Internship Status */}
              <Grid item xs={12}>
                <SectionCard
                  title="Internship Status"
                  tooltip={`Current: ${currentCohortInfo}`}
                  height="400px"
                >
                  <Grid container spacing={1.5}>
                    {loading
                      ? // Show skeletons while loading
                        Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <StatusCardSkeleton />
                            </Grid>
                          ))
                      : // Show actual cards with data
                        internshipStatusData.map((status, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <StatusCard
                              title={status.title}
                              count={status.count}
                              icon={status.icon}
                              color={status.color}
                              bgColor={status.bgColor}
                            />
                          </Grid>
                        ))}
                  </Grid>
                </SectionCard>
              </Grid>

              {/* Rankings Section */}
              <Grid item xs={12}>
                <SectionCard title="Internship Ranking">
                  <InternshipRankings
                    filterOptions={filterOptions}
                    isStaffDashboard={true}
                    refreshTrigger={rankingRefreshTrigger}
                  />
                </SectionCard>
              </Grid>
            </Grid>
          </Grid>

          {/* Right column - Student Participation & Completion */}
          {/* <Grid item xs={12} lg={6}>
            <Box sx={{ height: "400px" }}>
              <StaffStudentCompletion />
            </Box>
          </Grid> */}
        </Grid>
      ) : null}
    </Box>
  );
};

export default NewCompactInternshipDashboard;
