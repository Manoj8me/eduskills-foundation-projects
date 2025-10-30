import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, Typography, Skeleton } from "@mui/material";
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
import {
  fetchStudentMetrics,
  selectStudentMetricsData,
  selectStudentMetricsError,
  selectStudentMetricsLoading,
} from "../../../store/Slices/studentnewmetric/studentNewMetricsSlice";

const StaffStudentCompletion = () => {
  const dispatch = useDispatch();

  // Use Redux selectors
  const metricsData = useSelector(selectStudentMetricsData);
  const loading = useSelector(selectStudentMetricsLoading);
  const error = useSelector(selectStudentMetricsError);

  // Store the current values of localStorage items to detect changes
  const [currentStateId, setCurrentStateId] = useState(
    localStorage.getItem("selectedStateId")
  );
  const [currentInstituteId, setCurrentInstituteId] = useState(
    localStorage.getItem("selectedInstituteId")
  );

  // Check for localStorage changes and update state
  useEffect(() => {
    const checkForChanges = () => {
      const newStateId = localStorage.getItem("selectedStateId");
      const newInstituteId = localStorage.getItem("selectedInstituteId");

      if (
        newStateId !== currentStateId ||
        newInstituteId !== currentInstituteId
      ) {
        setCurrentStateId(newStateId);
        setCurrentInstituteId(newInstituteId);
      }
    };

    // Initial check
    checkForChanges();

    // Set up an interval to check for localStorage changes
    const intervalId = setInterval(checkForChanges, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentStateId, currentInstituteId]);

  // Fetch data whenever selectedStateId or selectedInstituteId changes
  useEffect(() => {
    // Fetch data on initial load or when localStorage values change
    dispatch(fetchStudentMetrics());
  }, [dispatch, currentStateId, currentInstituteId]);

  // Colors for different bars
  const COLORS = {
    applied: "#3366FF",
    completed: "#4CAF50",
    ongoing: "#FFA726", // Orange color for ongoing
  };

  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!metricsData || !metricsData.cohortWise) return [];

    return metricsData.cohortWise.map((cohort) => ({
      name: `Cohort ${cohort.cohort_number}`,
      applied: cohort.participation || 0,
      completed: cohort.completed || 0,
      ongoing: cohort.uncomplete || 0,
    }));
  }, [metricsData]);

  // Render skeleton loader when loading
  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Cohort Statistics
          </Typography>
          <Skeleton
            variant="rectangular"
            height={40}
            width="100%"
            sx={{ mb: 2 }}
          />
          <Skeleton variant="rectangular" height={300} width="100%" />
        </CardContent>
      </Card>
    );
  }

  if (error)
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Cohort Statistics
          </Typography>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );

  if (chartData.length === 0)
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Cohort Statistics
          </Typography>
          <Typography>No cohort data available</Typography>
        </CardContent>
      </Card>
    );

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Cohort Statistics
        </Typography>
        <Box
          sx={{
            height: 350,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Main Chart - Three bars per cohort */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, bottom: 20, left: 40 }}
                barSize={15}
                barGap={1}
                barCategoryGap={5}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e0e0e0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#555", fontSize: 12 }}
                  height={40}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#555", fontSize: 10 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(1)}K`;
                    }
                    return value;
                  }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#555",
                    border: "1px solid #ddd",
                    fontSize: 11,
                  }}
                  formatter={(value, name) => {
                    let label = "Students";
                    if (name === "applied") label = "Applied Students";
                    if (name === "completed") label = "Completed Students";
                    if (name === "ongoing") label = "Ongoing Students";
                    return [value.toLocaleString(), label];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="square"
                  wrapperStyle={{
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                />
                <Bar
                  dataKey="applied"
                  name="Applied"
                  fill={COLORS.applied}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="ongoing"
                  name="Ongoing"
                  fill={COLORS.ongoing}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill={COLORS.completed}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StaffStudentCompletion;
