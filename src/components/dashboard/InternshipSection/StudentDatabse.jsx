// InstitutionDatabase.js - Institution Database Component with independent refresh functionality
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const InstitutionDatabase = ({
  dashboardData,
  timestamp,
  formatTimestamp,
  onRefresh,
  isRefreshing,
  timestampTrigger, // Add this prop to trigger re-renders
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    databaseMetrics: [
      {
        title: "No. of Students",
        count: 0,
        icon: "mdi:account-multiple-plus",
        color: "#673AB7",
        bgColor: "#EDE7F6",
      },
      {
        title: "No. of Active",
        count: 0,
        icon: "mdi:account-check",
        color: "#00897B",
        bgColor: "#E0F2F1",
      },
      {
        title: "Approved",
        count: 0,
        icon: "mdi:check-circle",
        color: "#2E7D32",
        bgColor: "#E8F5E9",
      },
      {
        title: "Used",
        count: 0,
        icon: "mdi:chart-line",
        color: "#1565C0",
        bgColor: "#E3F2FD",
      },
      {
        title: "Available",
        count: 0,
        icon: "mdi:package-variant",
        color: "#F57C00",
        bgColor: "#FFF8E1",
      },
      {
        title: "Archived",
        count: 0,
        icon: "mdi:archive",
        color: "#795548",
        bgColor: "#EFEBE9",
      },
      {
        title: "Deleted",
        count: 0,
        icon: "mdi:delete",
        color: "#D32F2F",
        bgColor: "#FFEBEE",
      },
    ],
    passoutYearData: [],
    educatorMetrics: [
      {
        title: "Leader",
        count: 0,
        icon: "mdi:account-tie",
        color: "#1976D2",
        bgColor: "#E3F2FD",
      },
      {
        title: "SPOC",
        count: 0,
        icon: "mdi:account-supervisor",
        color: "#FF9800",
        bgColor: "#FFF3E0",
      },
      {
        title: "DSPOC",
        count: 0,
        icon: "mdi:account-supervisor-circle",
        color: "#4CAF50",
        bgColor: "#E8F5E9",
      },
      {
        title: "Faculty/Educator",
        count: 0,
        icon: "mdi:school",
        color: "#9C27B0",
        bgColor: "#F3E5F5",
      },
    ],
  });

  const textColor = isDarkMode ? "#E0E0E0" : "#555";

  useEffect(() => {
    if (dashboardData) {
      try {
        // Only show loading for initial load, not for refreshes
        if (initialLoading) {
          setInitialLoading(true);
        }

        const responseData = dashboardData;

        const updatedDatabaseMetrics = [
          {
            title: "No. of Students",
            count: responseData.intakeData || 0,
            icon: "mdi:account-multiple-plus",
            color: "#673AB7",
            bgColor: "#EDE7F6",
          },
          {
            title: "No. of Active",
            count: responseData.activeStudents || 0,
            icon: "mdi:account-check",
            color: "#00897B",
            bgColor: "#E0F2F1",
          },
          {
            title: "Approved",
            count: responseData.approved || 0,
            icon: "mdi:check-circle",
            color: "#2E7D32",
            bgColor: "#E8F5E9",
          },
          {
            title: "Used",
            count: responseData.used || 0,
            icon: "mdi:chart-line",
            color: "#1565C0",
            bgColor: "#E3F2FD",
          },
          {
            title: "Available",
            count: responseData.available || 0,
            icon: "mdi:package-variant",
            color: "#F57C00",
            bgColor: "#FFF8E1",
          },
          {
            title: "Archived",
            count: responseData.archived || 0,
            icon: "mdi:archive",
            color: "#795548",
            bgColor: "#EFEBE9",
          },
          {
            title: "Deleted",
            count: responseData.deleted || 0,
            icon: "mdi:delete",
            color: "#D32F2F",
            bgColor: "#FFEBEE",
          },
        ];

        const updatedYearWiseData = responseData.yearWiseData
          ? responseData.yearWiseData.map((item) => ({
              name: item.passOutYear,
              active: item.activeStudents,
              inactive: Math.max(0, item.intakeStudents - item.activeStudents),
              intake: item.intakeStudents,
            }))
          : [];

        const updatedEducatorMetrics = [
          {
            title: "Leader",
            count: responseData.leader || 0,
            icon: "mdi:account-tie",
            color: "#1976D2",
            bgColor: "#E3F2FD",
          },
          {
            title: "SPOC",
            count: responseData.educators || 0,
            icon: "mdi:account-supervisor",
            color: "#FF9800",
            bgColor: "#FFF3E0",
          },
          {
            title: "DSPOC",
            count: responseData.deducators || 0,
            icon: "mdi:account-supervisor-circle",
            color: "#4CAF50",
            bgColor: "#E8F5E9",
          },
          {
            title: "Faculty/Educator",
            count: responseData.faculty || 0,
            icon: "mdi:school",
            color: "#9C27B0",
            bgColor: "#F3E5F5",
          },
        ];

        setData({
          databaseMetrics: updatedDatabaseMetrics,
          passoutYearData: updatedYearWiseData,
          educatorMetrics: updatedEducatorMetrics,
        });

        setError(null);
      } catch (err) {
        console.error("Error processing data:", err);
        setError("Failed to process data. Please try again later.");
      } finally {
        // Set initial loading to false after first data load
        if (initialLoading) {
          setTimeout(() => {
            setInitialLoading(false);
          }, 500);
        }
      }
    }
  }, [dashboardData, initialLoading]);

  const MetricsSkeleton = () => (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
      <Grid container spacing={1.5}>
        {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
          <Grid item xs={12} key={index}>
            <Skeleton variant="rounded" height={70} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const ChartSkeleton = () => (
    <Box sx={{ p: 2, height: "100%" }}>
      <Skeleton variant="text" width="70%" height={30} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" height={300} />
    </Box>
  );

  // Show skeleton only during initial loading or when this specific section is refreshing
  const shouldShowSkeleton = initialLoading || isRefreshing;

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            color: textColor,
          }}
        >
          Institution Database
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Timestamp Display */}
          {/* {timestamp && !shouldShowSkeleton && (
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? "#b0bec5" : "#757575",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
              key={`timestamp-${timestampTrigger}`} // Force re-render when trigger changes
            >
              Last updated: {formatTimestamp(timestamp)}
            </Typography>
          )} */}

          {/* Refresh Button */}
          {/* <Tooltip title="Refresh Institution Database">
            <IconButton
              onClick={onRefresh}
              disabled={isRefreshing}
              size="small"
              sx={{
                bgcolor: isDarkMode
                  ? "rgba(144, 202, 249, 0.1)"
                  : "rgba(25, 118, 210, 0.1)",
                color: isDarkMode ? "#90caf9" : "#1976D2",
                border: `1px solid ${
                  isDarkMode
                    ? "rgba(144, 202, 249, 0.3)"
                    : "rgba(25, 118, 210, 0.3)"
                }`,
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(144, 202, 249, 0.2)"
                    : "rgba(25, 118, 210, 0.2)",
                },
                "&:disabled": {
                  bgcolor: isDarkMode
                    ? "rgba(144, 202, 249, 0.05)"
                    : "rgba(25, 118, 210, 0.05)",
                  color: isDarkMode
                    ? "rgba(144, 202, 249, 0.5)"
                    : "rgba(25, 118, 210, 0.5)",
                },
              }}
            >
              <Icon
                icon={isRefreshing ? "mdi:loading" : "mdi:refresh"}
                width={20}
                height={20}
                style={{
                  animation: isRefreshing ? "spin 1s linear infinite" : "none",
                }}
              />
            </IconButton>
          </Tooltip> */}
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Card
        elevation={1}
        sx={{
          borderRadius: 2,
          mb: 2,
          bgcolor: "#f0f0f0",
          overflow: "visible",
          position: "relative",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {/* Institution Database Metrics */}
            <Grid item xs={12} md={3}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "white",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
              >
                {shouldShowSkeleton ? (
                  <MetricsSkeleton />
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: "#5C6BC0",
                      }}
                    >
                      Student Database Status
                    </Typography>

                    <Grid container spacing={1.5}>
                      {data.databaseMetrics.slice(0, 2).map((metric, index) => (
                        <Grid item xs={12} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              bgcolor: metric.bgColor,
                              borderRadius: 2,
                              p: 1.5,
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor: metric.color,
                                borderRadius: 1,
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1.5,
                              }}
                            >
                              <Icon
                                icon={metric.icon}
                                color="white"
                                width={22}
                                height={22}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="#555"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {metric.title}
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  color: metric.color,
                                  fontSize:
                                    metric.count > 99999 ? "1.2rem" : "1.5rem",
                                }}
                              >
                                <CountUp
                                  start={0}
                                  end={metric.count}
                                  duration={2}
                                  separator=","
                                />
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}

                      {data.databaseMetrics.slice(2).map((metric, index) => (
                        <Grid item xs={6} key={index + 2}>
                          <Box
                            sx={{
                              display: "flex",
                              bgcolor: metric.bgColor,
                              borderRadius: 1.5,
                              p: 1,
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor: metric.color,
                                borderRadius: 1,
                                width: 28,
                                height: 28,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1,
                              }}
                            >
                              <Icon
                                icon={metric.icon}
                                color="white"
                                width={16}
                                height={16}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="#555"
                                sx={{ fontSize: "0.65rem" }}
                              >
                                {metric.title}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: metric.color,
                                  fontSize: "1rem",
                                }}
                              >
                                <CountUp
                                  start={0}
                                  end={metric.count}
                                  duration={2}
                                  separator=","
                                />
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Middle Column - Graph */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "white",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "visible",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {shouldShowSkeleton ? (
                  <ChartSkeleton />
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      pb: 1,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: "#5C6BC0",
                      }}
                    >
                      Statistics - Passout Year Wise
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "calc(100% - 30px)",
                        minHeight: 300,
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.passoutYearData}
                          margin={{ top: 10, right: 20, bottom: 30, left: 20 }}
                          barSize={20}
                        >
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#555", fontSize: 10 }}
                            interval={0}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#555", fontSize: 10 }}
                          />
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e0e0e0"
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              color: "#555",
                              border: "1px solid #ddd",
                              fontSize: 12,
                            }}
                          />
                          <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                          />
                          <Bar
                            dataKey="intake"
                            name="Intake"
                            fill="#2196F3"
                            radius={[3, 3, 0, 0]}
                          />
                          <Bar
                            dataKey="active"
                            name="Active"
                            fill="#4CAF50"
                            radius={[3, 3, 0, 0]}
                          />
                          <Bar
                            dataKey="inactive"
                            name="Not Participated"
                            fill="#E53935"
                            radius={[3, 3, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Right Column - Educator Details */}
            <Grid item xs={12} md={3}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "white",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
              >
                {shouldShowSkeleton ? (
                  <MetricsSkeleton />
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: "#5C6BC0",
                      }}
                    >
                      Institution Users
                    </Typography>

                    <Grid container spacing={1.5}>
                      {data.educatorMetrics.map((educator, index) => (
                        <Grid item xs={12} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              bgcolor: educator.bgColor,
                              borderRadius: 2,
                              p: 1.5,
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor: educator.color,
                                borderRadius: 1,
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1.5,
                              }}
                            >
                              <Icon
                                icon={educator.icon}
                                color="white"
                                width={22}
                                height={22}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="#555"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {educator.title}
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  color: educator.color,
                                  fontSize:
                                    educator.count > 99999
                                      ? "1.2rem"
                                      : "1.5rem",
                                }}
                              >
                                <CountUp
                                  start={0}
                                  end={educator.count}
                                  duration={2}
                                  separator=","
                                />
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Add CSS for spin animation */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </Grid>
  );
};

export default InstitutionDatabase;
