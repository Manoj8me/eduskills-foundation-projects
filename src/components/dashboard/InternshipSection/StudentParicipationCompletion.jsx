import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Info } from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";

const StudentParticipationCompletion = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchStudentMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await axios.get(
          `${BASE_URL}/internship/spocInternshipDashboard`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMetricsData(response.data);
      } catch (err) {
        console.error("Error fetching student metrics:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentMetrics();
  }, []);

  // Updated colors to match dashboard theme
  const COLORS = {
    applied: "#6366f1", // Indigo - matches your dashboard
    completed: "#10b981", // Emerald - matches success color
    ongoing: "#f97316", // Orange - matches warning color
  };

  // Process data for the chart - Updated to handle new response format
  const chartData = React.useMemo(() => {
    if (!metricsData || !Array.isArray(metricsData)) return [];

    return metricsData.map((cohort) => ({
      name: `Cohort ${cohort.cohort_number}`,
      applied: cohort.participation || 0,
      completed: cohort.completed || 0,
      ongoing: cohort.uncomplete || 0,
    }));
  }, [metricsData]);

  // Custom skeleton component matching dashboard style
  const ChartSkeleton = () => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        maxHeight: "400px",
      }}
    >
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: "#1a1a1a", fontSize: "1rem" }}
        >
          Student Participation & Completion
        </Typography>
        <Skeleton variant="circular" width={24} height={24} sx={{ ml: 0.5 }} />
      </Box>
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Skeleton
          variant="rectangular"
          height={24}
          width="60%"
          sx={{ borderRadius: 1 }}
        />
      </Box>
      <Box sx={{ flex: 1, minHeight: 280 }}>
        <Skeleton
          variant="rectangular"
          height="100%"
          width="100%"
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </Paper>
  );

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 2,
            p: 1.5,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minWidth: 140,
          }}
        >
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{ color: "#1a1a1a", mb: 1, fontSize: "0.8rem" }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  mr: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: "#374151", fontSize: "0.75rem", fontWeight: 500 }}
              >
                {entry.name}: {entry.value.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Error state matching dashboard style
  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          height: "100%",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "400px",
          minHeight: "300px",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ color: "#1a1a1a", fontSize: "1rem", mb: 1 }}
          >
            Student Participation & Completion
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#ef4444", fontWeight: 500 }}
          >
            {error}
          </Typography>
        </Box>
      </Paper>
    );
  }

  // No data state
  if (!loading && chartData.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          height: "100%",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "400px",
          minHeight: "300px",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ color: "#1a1a1a", fontSize: "1rem", mb: 1 }}
          >
            Student Participation & Completion
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
            No cohort data available
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Loading state
  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        maxHeight: "400px", // Maximum height constraint
        minHeight: "300px", // Minimum height for good appearance
      }}
    >
      {/* Header matching dashboard style */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: "#1a1a1a", fontSize: "1rem" }}
        >
          Student Participation & Completion
        </Typography>
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
              Shows student participation metrics across cohorts
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
      </Box>

      {/* Chart Container - Takes remaining space with constraints */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 250, // Minimum chart height
          maxHeight: 320, // Maximum chart height
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 40, left: 30 }}
            barSize={14}
            barGap={2}
            barCategoryGap={6}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="rgba(0, 0, 0, 0.06)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 10,
                fontWeight: 500,
              }}
              height={40}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 9,
                fontWeight: 500,
              }}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}K`;
                }
                return value;
              }}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={30}
              iconType="circle"
              wrapperStyle={{
                fontSize: "10px",
                fontWeight: "500",
                color: "#374151",
                paddingBottom: "8px",
              }}
            />
            <Bar
              dataKey="applied"
              name="Applied"
              fill={COLORS.applied}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="ongoing"
              name="Ongoing"
              fill={COLORS.ongoing}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="completed"
              name="Completed"
              fill={COLORS.completed}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StudentParticipationCompletion;
