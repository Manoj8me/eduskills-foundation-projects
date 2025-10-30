// TalentConnectSummary.js - Talent Connect Summary Component with independent refresh functionality
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

const TalentConnectSummary = ({
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

  // Background and text colors based on theme
  const textColor = isDarkMode ? "#E0E0E0" : "#555";

  // Combined loading condition - show skeleton only during initial load or when this section is refreshing
  const shouldShowSkeleton = initialLoading || isRefreshing;

  // Job metrics
  const [jobMetrics, setJobMetrics] = useState([
    {
      title: "JD Published",
      count: 0,
      icon: "heroicons:document-text",
      color: "#1976D2",
      bgColor: "#E3F2FD",
    },
    {
      title: "JD Active",
      count: 0,
      icon: "heroicons:briefcase",
      color: "#1976D2",
      bgColor: "#E3F2FD",
    },
  ]);

  // Student metrics
  const [studentMetrics, setStudentMetrics] = useState([
    {
      title: "Applied",
      count: 0,
      icon: "mdi:application-edit-outline",
      color: "#FF9800",
      bgColor: "#FFF3E0",
    },
    {
      title: "Selected",
      count: 0,
      icon: "mdi:account-check-outline",
      color: "#4CAF50",
      bgColor: "#E8F5E9",
    },
  ]);

  // Process data when dashboardData changes
  useEffect(() => {
    if (dashboardData) {
      try {
        // Only show loading for initial load, not for refreshes when we have data
        if (initialLoading) {
          setInitialLoading(true);
        }

        // Update job metrics with data from API
        setJobMetrics([
          {
            title: "JD Published",
            count: dashboardData.postedJobs || 0,
            icon: "heroicons:document-text",
            color: "#1976D2",
            bgColor: "#E3F2FD",
          },
          {
            title: "JD Active",
            count: dashboardData.openedJobs || 0,
            icon: "heroicons:briefcase",
            color: "#1976D2",
            bgColor: "#E3F2FD",
          },
        ]);

        // Update student metrics with data from API
        setStudentMetrics([
          {
            title: "Applied",
            count: dashboardData.appliedJobs || 0,
            icon: "mdi:application-edit-outline",
            color: "#FF9800",
            bgColor: "#FFF3E0",
          },
          {
            title: "Selected",
            count: dashboardData.shortlisted || 0,
            icon: "mdi:account-check-outline",
            color: "#4CAF50",
            bgColor: "#E8F5E9",
          },
        ]);
      } catch (error) {
        console.error("Error processing talent connect data:", error);
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

  // Loading skeleton
  const MetricsSkeleton = () => (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
      <Grid container spacing={1.5}>
        {[1, 2, 3, 4].map((_, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Skeleton variant="rounded" height={80} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
          Talent Connect Summary
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
          {/* <Tooltip title="Refresh Talent Connect Summary">
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
            {shouldShowSkeleton ? (
              <Grid item xs={12}>
                <MetricsSkeleton />
              </Grid>
            ) : (
              <>
                {/* Jobs Section */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      bgcolor: "white",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: textColor,
                          mb: 2,
                        }}
                      >
                        Jobs
                      </Typography>

                      <Grid container spacing={1.5}>
                        {/* Job metrics boxes */}
                        {jobMetrics.map((metric, index) => (
                          <Grid item xs={6} key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                bgcolor: metric.bgColor,
                                borderRadius: 2,
                                p: 1.5,
                                height: "100%",
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
                                  }}
                                >
                                  <CountUp
                                    start={0}
                                    end={metric.count}
                                    duration={2}
                                  />
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Card>
                </Grid>

                {/* Students Section */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      bgcolor: "white",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: textColor,
                          mb: 2,
                        }}
                      >
                        Students
                      </Typography>

                      <Grid container spacing={1.5}>
                        {/* Student metrics boxes */}
                        {studentMetrics.map((metric, index) => (
                          <Grid item xs={6} key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                bgcolor: metric.bgColor,
                                borderRadius: 2,
                                p: 1.5,
                                height: "100%",
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
                                  }}
                                >
                                  <CountUp
                                    start={0}
                                    end={metric.count}
                                    duration={2}
                                  />
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </>
            )}
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

export default TalentConnectSummary;
