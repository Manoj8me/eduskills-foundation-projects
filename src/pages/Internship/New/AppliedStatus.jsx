// ApplicationStatusSection.js - Fixed field mapping for API response
import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Stack,
  Skeleton,
} from "@mui/material";
import {
  X,
  FileSignature,
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  CalendarDays,
  GraduationCap,
  Layers,
} from "lucide-react";
import FilterMenu from "./FilterMenu";
import { More } from "@mui/icons-material";

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

const ApplicationStatusSection = ({
  loading = false,
  dashboardData = null,
}) => {
  // Helper function to determine current cohort
  const getCurrentCohort = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    let quarter;
    if (month >= 1 && month <= 3) quarter = 1;
    else if (month >= 4 && month <= 6) quarter = 2;
    else if (month >= 7 && month <= 9) quarter = 3;
    else quarter = 4;
    const cohortNumber = (year - 2023) * 4 + quarter;
    return {
      id: `Cohort ${cohortNumber} from ${
        quarter === 1
          ? "Jan-Mar"
          : quarter === 2
          ? "Apr-Jun"
          : quarter === 3
          ? "Jul-Sep"
          : "Oct-Dec"
      } ${year}`,
      label: `Cohort ${cohortNumber}`,
      dateRange: `${
        quarter === 1
          ? "Jan-Mar"
          : quarter === 2
          ? "Apr-Jun"
          : quarter === 3
          ? "Jul-Sep"
          : "Oct-Dec"
      } ${year}`,
    };
  };

  // Initialize filters for both sections
  const [completedFilters, setCompletedFilters] = useState({
    cohorts: [getCurrentCohort().id],
    years: [],
  });
  const [failedFilters, setFailedFilters] = useState({
    cohorts: [getCurrentCohort().id],
    years: [],
  });

  console.log("ApplicationStatusSection received data:", dashboardData);

  // Application status data mapped from API response - FIXED FIELD NAMES
  const applicationStatusData = [
    {
      title: "One Internship",
      count: dashboardData?.one_internship || 0, // Changed from one_internship_completed
      icon: <FileSignature />,
      color: "#66bb6a", // Green 400
      bgColor: "#e8f5e9", // Green 50
    },
    {
      title: "Two Internships",
      count: dashboardData?.two_internship || 0, // Changed from two_internships_completed
      icon: <ClipboardCheck />,
      color: "#ffa726", // Orange 400
      bgColor: "#fff3e0", // Orange 50
    },
    {
      title: "Three Internships",
      count: dashboardData?.three_internship || 0, // Changed from three_internships_completed
      icon: <CheckCircle />,
      color: "#42a5f5", // Blue 400
      bgColor: "#e3f2fd", // Blue 50
    },
    {
      title: "Four+ Internships",
      count: dashboardData?.four_more_internship || 0, // Changed from more_than_three_internships
      icon: <Layers className="text-[#1565c0]" />,
      color: "#1565c0", // Blue 800
      bgColor: "#e3f2fd", // Light Blue 50
    },
  ];

  // Failed status data mapped from API response - FIXED FIELD NAMES
  const failedStatusData = [
    {
      title: "Single Time Failed",
      count: dashboardData?.single_time_failed || 0, // Changed from failed_once
      icon: <AlertTriangle />,
      color: "#f06292", // Pink 300
      bgColor: "#fce4ec", // Pink 50
    },
    {
      title: "Two Time Failed",
      count: dashboardData?.two_time_failed || 0, // Changed from failed_twice
      icon: <AlertOctagon />,
      color: "#9c27b0", // Purple 500
      bgColor: "#f3e5f5", // Purple 50
    },
  ];

  // Debug log to verify the field values
  console.log("Mapped application status data:", {
    one_internship: dashboardData?.one_internship,
    two_internship: dashboardData?.two_internship,
    three_internship: dashboardData?.three_internship,
    four_more_internship: dashboardData?.four_more_internship,
    single_time_failed: dashboardData?.single_time_failed,
    two_time_failed: dashboardData?.two_time_failed,
  });

  // Filter summary function
  const getFilterSummary = (filters) => {
    const cohortCount = filters.cohorts.length;
    const yearCount = filters.years.length;
    if (
      cohortCount === 1 &&
      filters.cohorts[0] === getCurrentCohort().id &&
      yearCount === 0
    ) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CalendarDays size={12} color="#0061f2" />
          <Typography
            variant="body2"
            sx={{ color: "#0061f2", fontWeight: 500, fontSize: "0.75rem" }}
          >
            Current Cohort: {getCurrentCohort().label}
          </Typography>
        </Box>
      );
    }
    const summaryParts = [];
    if (cohortCount > 0) {
      summaryParts.push(
        <Box
          key="cohorts"
          sx={{ display: "flex", alignItems: "center", gap: 0.3 }}
        >
          <CalendarDays size={11} color="#666" />
          <Typography
            variant="body2"
            sx={{ fontSize: "0.7rem", color: "#666" }}
          >
            {cohortCount} Cohort{cohortCount > 1 ? "s" : ""}
          </Typography>
        </Box>
      );
    }
    if (yearCount > 0) {
      summaryParts.push(
        <Box
          key="years"
          sx={{ display: "flex", alignItems: "center", gap: 0.3 }}
        >
          <GraduationCap size={11} color="#666" />
          <Typography
            variant="body2"
            sx={{ fontSize: "0.7rem", color: "#666" }}
          >
            {yearCount} Year{yearCount > 1 ? "s" : ""}
          </Typography>
        </Box>
      );
    }
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
        {summaryParts}
      </Stack>
    );
  };

  const handleCompletedFilterChange = (newFilters) => {
    setCompletedFilters(newFilters);
    console.log("Completed filters applied:", newFilters);
  };

  const handleFailedFilterChange = (newFilters) => {
    setFailedFilters(newFilters);
    console.log("Failed filters applied:", newFilters);
  };

  return (
    <>
      {/* Completed Status Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: "#1976D2",
              fontSize: "1rem",
            }}
          >
            Completed Status
          </Typography>
          {/* {getFilterSummary(completedFilters)} */}
        </Box>
        {/* <FilterMenu
          selectedCohorts={completedFilters.cohorts}
          selectedYears={completedFilters.years}
          onFilterChange={handleCompletedFilterChange}
        /> */}
      </Box>
      <Grid container spacing={1.5}>
        {loading
          ? // Show skeletons while loading
            Array(4)
              .fill(0)
              .map((_, index) => (
                <Grid item xs={6} sm={6} key={index}>
                  <StatusCardSkeleton />
                </Grid>
              ))
          : // Show actual cards with data
            applicationStatusData.map((status, index) => (
              <Grid item xs={6} sm={6} key={index}>
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

      {/* Divider between sections */}
      <Divider sx={{ my: 2.5 }} />

      {/* Failed Status Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: "#1976D2",
              fontSize: "1rem",
            }}
          >
            Failed Status
          </Typography>
          {/* {getFilterSummary(failedFilters)} */}
        </Box>
      </Box>
      <Grid container spacing={1.5}>
        {loading
          ? // Show skeletons while loading
            Array(2)
              .fill(0)
              .map((_, index) => (
                <Grid item xs={6} sm={6} key={index}>
                  <StatusCardSkeleton />
                </Grid>
              ))
          : // Show actual cards with data
            failedStatusData.map((status, index) => (
              <Grid item xs={6} sm={6} key={index}>
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
    </>
  );
};

export default ApplicationStatusSection;
