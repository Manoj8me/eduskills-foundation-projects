// InternshipSummary.js - Internship Summary Component with independent refresh functionality
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  useTheme,
  IconButton,
  Dialog,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "@iconify/react";
import CountUp from "react-countup";
import StudentParticipationCompletion from "./StudentParicipationCompletion";
import ApplicationStatusSection from "../../../pages/Internship/New/AppliedStatus";

const InternshipSummary = ({
  dashboardData,
  timestamp,
  formatTimestamp,
  onRefresh,
  isRefreshing,
  timestampTrigger, // Add this prop to trigger re-renders
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // States
  const [openModal, setOpenModal] = useState(false);
  const [filterSource, setFilterSource] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [initialLoading, setInitialLoading] = useState(true);
  const [internshipData, setInternshipData] = useState(null);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [years, setYears] = useState([]);

  const textColor = isDarkMode ? "#E0E0E0" : "#555";

  // Combined loading condition - show skeleton only during initial load or when this section is refreshing
  const shouldShowSkeleton = initialLoading || isRefreshing;

  // Custom Tooltip Component
  const CustomTooltip = ({ title, children, placement = "right" }) => (
    <Tooltip
      title={
        <Box sx={{ p: 1.5, maxWidth: 320 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              fontWeight: 600,
              color: "#fff",
              fontSize: "0.95rem",
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              pb: 1,
            }}
          >
            📊 Cohort Wise Internship Status
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#E3F2FD",
                fontSize: "0.85rem",
                lineHeight: 1.5,
              }}
            >
              Track your students' internship journey with these key indicators:
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#90CAF9",
                  mt: 0.7,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    mb: 0.3,
                  }}
                >
                  Internship Applied
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#B3E5FC",
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  Total No. of Internships Applied By Students
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#64B5F6",
                  mt: 0.7,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    mb: 0.3,
                  }}
                >
                  Ongoing Internships
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#B3E5FC",
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  No. of Internships Currently in Progress By Students
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#42A5F5",
                  mt: 0.7,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    mb: 0.3,
                  }}
                >
                  Completed Internships
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#B3E5FC",
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  No. of Internships Successfully Completed By Students
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      }
      placement={placement}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(25, 118, 210, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            boxShadow: "0px 8px 32px rgba(25, 118, 210, 0.3)",
            maxWidth: "none",
            "& .MuiTooltip-arrow": {
              color: "rgba(25, 118, 210, 0.95)",
            },
          },
        },
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        },
      }}
      enterDelay={300}
      leaveDelay={200}
    >
      {children}
    </Tooltip>
  );

  // Process data from parent
  useEffect(() => {
    if (dashboardData) {
      try {
        // Only show loading for initial load, not for refreshes when we have data
        if (initialLoading) {
          setInitialLoading(true);
        }

        setInternshipData(dashboardData);

        // Extract years from cohortWise data if available
        const availableYears = dashboardData.cohortWise
          ? dashboardData.cohortWise.map((item) =>
              item.cohort_number.toString()
            )
          : ["2025"];
        setYears(availableYears);

        // Set default selected year if available
        if (availableYears.includes("2025")) {
          setSelectedYear("2025");
        } else if (availableYears.length > 0) {
          setSelectedYear(availableYears[0]);
        }

        // Set domains data
        setFilteredDomains(dashboardData.domainWiseCompleted || []);
      } catch (error) {
        console.error("Error processing internship data:", error);
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

  // Filter data based on selected year
  useEffect(() => {
    if (internshipData && internshipData.domainWiseCompleted) {
      setFilteredDomains(internshipData.domainWiseCompleted);
    }
  }, [selectedYear, internshipData]);

  const handleFilterClick = (filterId) => {
    setFilterSource(filterId);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setOpenModal(false);
    console.log("Selected year:", year);
  };

  // Loading skeletons for different sections
  const StudentStatsLoading = () => (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
      <Grid container spacing={1.5}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} key={item}>
            <Skeleton variant="rounded" width="100%" height={76} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const DomainsChartLoading = () => (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" width="100%" height={250} />
    </Box>
  );

  return (
    <>
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
          Internships Summary
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
          {/* <Tooltip title="Refresh Internships Summary">
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

      {/* Combined Internship Stats Section */}
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
          <Grid container spacing={2} alignItems="stretch">
            {/* Student stats */}
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
                  <StudentStatsLoading />
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#1976D2",
                        }}
                      >
                        Cohort Status
                      </Typography>

                      {/* Custom Tooltip with Help Icon */}
                      <CustomTooltip placement="right">
                        <IconButton
                          size="small"
                          sx={{
                            width: 24,
                            height: 24,
                            color: "#1976D2",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.1)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <Icon
                            icon="mdi:help-circle-outline"
                            width={20}
                            height={20}
                          />
                        </IconButton>
                      </CustomTooltip>
                    </Box>

                    <Grid container spacing={1.5}>
                      {/* Total Students Box */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            bgcolor: "#e6f7ff",
                            borderRadius: 2,
                            p: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: "#1976D2",
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
                              icon="mdi:account-student"
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
                              Internship Applied
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: "#1976D2",
                              }}
                            >
                              <CountUp
                                start={0}
                                end={internshipData?.participation || 0}
                                duration={2}
                                separator=","
                              />
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Participated Students */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            bgcolor: "#EBF5FF",
                            borderRadius: 2,
                            p: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: "#2196F3",
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
                              icon="fluent-mdl2:completed-solid"
                              color="white"
                              width={20}
                              height={20}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              color="#555"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              Internship Ongoing
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: "#2196F3",
                              }}
                            >
                              <CountUp
                                start={0}
                                end={internshipData?.uncomplete || 0}
                                duration={2}
                                separator=","
                              />
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Completed Students */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            bgcolor: "#E8F5E9",
                            borderRadius: 2,
                            p: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: "#4CAF50",
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
                              icon="carbon:task-complete"
                              color="white"
                              width={20}
                              height={20}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              color="#555"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              Internship Completed
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: "#4CAF50",
                              }}
                            >
                              <CountUp
                                start={0}
                                end={internshipData?.completed || 0}
                                duration={2}
                                separator=","
                              />
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Top Domains */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  bgcolor: "white",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e0e0e0",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {shouldShowSkeleton ? (
                  <DomainsChartLoading />
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "#3366FF",
                      }}
                    >
                      Top 5 Domains Statistics
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={filteredDomains.map((domain) => ({
                            title: domain.domainName,
                            count: domain.domainCount,
                          }))}
                          layout="vertical"
                          margin={{ top: 5, right: 40, bottom: 5, left: 40 }}
                          barSize={15}
                        >
                          <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#555" }}
                          />
                          <YAxis
                            type="category"
                            dataKey="title"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#555", fontSize: 11 }}
                            width={120}
                          />

                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              color: "#555",
                              border: "1px solid #ddd",
                            }}
                            formatter={(value) => [`${value}`, "Count"]}
                          />
                          <Bar
                            dataKey="count"
                            fill="rgb(250, 177, 140)"
                            radius={[0, 4, 4, 0]}
                            label={{
                              position: "right",
                              fill: "#555",
                              fontSize: 11,
                              fontWeight: 500,
                              formatter: (value) => value,
                              offset: 10,
                            }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Student Participation Completion */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "white",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {shouldShowSkeleton ? (
                  <DomainsChartLoading />
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ height: 250, flex: 1 }}>
                      <ApplicationStatusSection
                        dashboardData={internshipData}
                      />
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Year Filter Modal */}
      <Dialog
        open={openModal}
        onClose={handleModalClose}
        PaperProps={{
          sx: {
            width: "250px",
            maxWidth: "90vw",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: isDarkMode ? "#333" : "#fff",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: isDarkMode ? "#E0E0E0" : "#333" }}
          >
            Select Year
          </Typography>
          <IconButton onClick={handleModalClose} size="small">
            <Icon icon="mdi:close" width={18} height={18} />
          </IconButton>
        </Box>

        <Box
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            p: 1,
          }}
        >
          {years.map((year) => (
            <Box
              key={year}
              onClick={() => handleYearSelect(year)}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor:
                  year === selectedYear
                    ? isDarkMode
                      ? "rgba(25, 118, 210, 0.25)"
                      : "rgba(25, 118, 210, 0.1)"
                    : "transparent",
                color: isDarkMode ? "#E0E0E0" : "#555",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                },
                transition: "background-color 0.15s ease",
                mb: 0.5,
              }}
            >
              <Typography variant="body1">{year}</Typography>
              {year === selectedYear && (
                <Icon
                  icon="mdi:check"
                  width={18}
                  height={18}
                  color={isDarkMode ? "#90CAF9" : "#1976D2"}
                />
              )}
            </Box>
          ))}
        </Box>
      </Dialog>

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
    </>
  );
};

export default InternshipSummary;
