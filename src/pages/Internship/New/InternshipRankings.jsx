// InternshipRankings.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ExternalLink, Info, ChevronDown, ChevronUp } from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// Rankings Accordion Component
const RankingsAccordion = ({ rankingData, filterOptions, loading }) => {
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const handleAccordionToggle = (yearIndex) => {
    setExpandedAccordion((prev) => {
      // If clicking the same accordion that's already open, close it
      if (prev === yearIndex) {
        return null;
      }
      // Otherwise, open the clicked accordion (this will close any other open accordion)
      return yearIndex;
    });
  };

  const getRankingBadgeColor = (ranking, type, isProvisional = true) => {
    // Simple color scheme: Orange for provisional, Green for final
    if (isProvisional) {
      return { bg: "#fff7ed", text: "#f97316" }; // Orange for provisional
    } else {
      return { bg: "#ecfdf5", text: "#10b981" }; // Green for final
    }
  };

  // Annual ranking links data
  const annualRankings = [
    {
      year: "2025",
      url: "https://www.yumpu.com/en/document/read/70775255/eduskills-ranking-2025",
      title: "Eduskills Ranking 2025",
    },
    {
      year: "2024",
      url: "https://www.yumpu.com/xx/document/read/68836281/eduskills-ranking-2024",
      title: "Eduskills Ranking 2024",
    },
    {
      year: "2023",
      url: "https://www.yumpu.com/en/document/read/68873553/eduskills-ranking-2023",
      title: "Eduskills Ranking 2023",
    },
  ];

  // Function to get cohort name by ID
  const getCohortName = (cohortId) => {
    if (!filterOptions?.cohortsResponse) return `Cohort ${cohortId}`;

    const cohort = filterOptions.cohortsResponse.find(
      (c) => c.cohort_id === cohortId
    );
    return cohort ? cohort.cohort_name : `Cohort ${cohortId}`;
  };

  // Function to get cohort year from cohort data
  const getCohortYear = (cohortId) => {
    if (!filterOptions?.cohortsResponse) return new Date().getFullYear();

    const cohort = filterOptions.cohortsResponse.find(
      (c) => c.cohort_id === cohortId
    );

    if (cohort && cohort.start_date) {
      return new Date(cohort.start_date).getFullYear();
    }

    return new Date().getFullYear();
  };

  // Function to find the current (highest numbered) cohort
  const getCurrentCohortId = () => {
    if (!filterOptions?.cohortsResponse) return null;

    // Find the cohort with the highest cohort_id (assuming higher ID means more recent)
    const currentCohort = filterOptions.cohortsResponse.reduce(
      (max, cohort) => {
        return cohort.cohort_id > max.cohort_id ? cohort : max;
      },
      filterOptions.cohortsResponse[0]
    );

    return currentCohort ? currentCohort.cohort_id : null;
  };

  // Function to determine if ranking is provisional or final
  const isProvisionalRanking = (cohortId) => {
    const currentCohortId = getCurrentCohortId();
    // Current cohort rankings are provisional, older cohorts are final
    return cohortId === currentCohortId;
  };

  // Group ranking data by year
  const groupRankingsByYear = () => {
    if (!rankingData || typeof rankingData !== "object") return [];

    const groupedData = {};
    const currentCohortId = getCurrentCohortId();

    // Process the new API response structure where data is grouped by year
    Object.keys(rankingData).forEach((year) => {
      const yearData = rankingData[year];

      if (Array.isArray(yearData)) {
        groupedData[year] = {
          year: year.toString(),
          cohorts: [],
        };

        yearData.forEach((item) => {
          groupedData[year].cohorts.push({
            cohort: getCohortName(item.cohort_id),
            cohortId: item.cohort_id,
            allIndiaRanking: item.all_india_rank,
            stateRanking: item.state_rank,
            internshipsCompleted: item.internships_completed,
            instituteType: item.institute_type,
            isCurrentCohort: item.cohort_id === currentCohortId,
            isProvisional: isProvisionalRanking(item.cohort_id),
            // Add eligibility reason fields
            whyNotEligibleForAllIndia: item.why_not_eligible_for_all_india,
            whyNotEligibleForState: item.why_not_eligible_for_state,
          });
        });
      }
    });

    // Convert to array and sort by year (newest first)
    const sortedYears = Object.keys(groupedData)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((year) => groupedData[year]);

    // Updated colors
    const colors = [
      { color: "#6366f1", bgColor: "#eef2ff" }, // Indigo
      { color: "#8b5cf6", bgColor: "#f3e8ff" }, // Violet
      { color: "#06b6d4", bgColor: "#ecfeff" }, // Cyan
      { color: "#ec4899", bgColor: "#fdf2f8" }, // Pink
      { color: "#3b82f6", bgColor: "#eff6ff" }, // Blue
    ];

    return sortedYears.map((yearData, index) => ({
      ...yearData,
      ...colors[index % colors.length],
    }));
  };

  const rankingDataByYear = groupRankingsByYear();

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={60}
              sx={{ borderRadius: 2 }}
            />
          ))}
      </Box>
    );
  }

  if (!rankingData || Object.keys(rankingData).length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 200,
          color: "#666",
        }}
      >
        <Typography variant="body2">No ranking data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        flex: 1,
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      {rankingDataByYear.map((yearData, yearIndex) => {
        const isExpanded = expandedAccordion === yearIndex;

        return (
          <Accordion
            key={yearIndex}
            expanded={isExpanded}
            onChange={() => handleAccordionToggle(yearIndex)}
            elevation={0}
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: 2,
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={null}
              sx={{
                backgroundColor: yearData.bgColor,
                borderRadius: "8px 8px 0 0",
                minHeight: 44,
                "&.Mui-expanded": {
                  minHeight: 44,
                  borderRadius: "8px 8px 0 0",
                },
                "& .MuiAccordionSummary-content": {
                  margin: "6px 0",
                  "&.Mui-expanded": {
                    margin: "6px 0",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: yearData.color,
                  }}
                />
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{ color: "#333", fontSize: "0.9rem" }}
                >
                  Year {yearData.year}
                </Typography>
                <Box
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: yearData.color,
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  {yearData.cohorts.length} Cohorts
                </Box>

                {/* Annual Ranking Badge */}
                {annualRankings.find(
                  (ranking) => ranking.year === yearData.year
                ) && (
                  <Box
                    sx={{ ml: "auto", display: "flex", alignItems: "center" }}
                  >
                    <Link
                      href={
                        annualRankings.find(
                          (ranking) => ranking.year === yearData.year
                        ).url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        mr: 1,
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1.5,
                        backgroundColor: "#f59e0b",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#d97706",
                          transform: "translateY(-1px)",
                          boxShadow: "0 2px 8px rgba(249, 115, 22, 0.3)",
                        },
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Annual Ranking
                      <ExternalLink size={12} />
                    </Link>
                  </Box>
                )}

                {/* Cohort wise button */}
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    borderColor: yearData.color,
                    color: yearData.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    ml: annualRankings.find(
                      (ranking) => ranking.year === yearData.year
                    )
                      ? 0
                      : "auto",
                    "&:hover": {
                      backgroundColor: `${yearData.color}20`,
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccordionToggle(yearIndex);
                  }}
                >
                  Cohort wise
                  <ChevronDown
                    size={14}
                    style={{
                      transition: "transform 0.2s ease",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#f8f9fa",
                          fontSize: "0.8rem",
                          py: 1,
                          color: "#374151",
                        }}
                      >
                        Cohort
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#f8f9fa",
                          fontSize: "0.8rem",
                          py: 1,
                          color: "#374151",
                        }}
                      >
                        National Ranking
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#f8f9fa",
                          fontSize: "0.8rem",
                          py: 1,
                          color: "#374151",
                        }}
                      >
                        State Ranking
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {yearData.cohorts.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: row.isCurrentCohort
                            ? "#fff7ed" // Light orange for current cohort
                            : "#f0f9ff", // Light blue for other cohorts
                          "&:hover": {
                            backgroundColor: row.isCurrentCohort
                              ? "#fed7aa" // Darker orange on hover
                              : "#dbeafe", // Darker blue on hover
                            transition: "background-color 0.2s ease",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontSize: "0.8rem",
                            py: 1.5,
                            fontWeight: row.isCurrentCohort ? 600 : 500,
                            color: "#374151",
                          }}
                        >
                          {row.cohort}
                          {row.isCurrentCohort && (
                            <Typography
                              component="span"
                              sx={{
                                ml: 1,
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                backgroundColor: "#f97316",
                                color: "white",
                                fontSize: "0.6rem",
                                fontWeight: 600,
                              }}
                            >
                              CURRENT
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          {row.allIndiaRanking !== null &&
                          row.allIndiaRanking !== "Not Eligible" &&
                          typeof row.allIndiaRanking === "number" ? (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                minWidth: 40,
                                backgroundColor: getRankingBadgeColor(
                                  row.allIndiaRanking,
                                  "india",
                                  row.isProvisional
                                ).bg,
                                color: getRankingBadgeColor(
                                  row.allIndiaRanking,
                                  "india",
                                  row.isProvisional
                                ).text,
                              }}
                            >
                              #{row.allIndiaRanking}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1.5,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  minWidth: 80,
                                  backgroundColor: "#ffebee",
                                  color: "#c62828",
                                  textAlign: "center",
                                }}
                              >
                                Not Eligible
                              </Box>
                              {row.whyNotEligibleForAllIndia && (
                                <Tooltip
                                  title={
                                    <Box sx={{ p: 1 }}>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontSize: "0.7rem",
                                          color: "#fff",
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {row.whyNotEligibleForAllIndia}
                                      </Typography>
                                    </Box>
                                  }
                                  arrow
                                  placement="top"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: "#1976d2",
                                        borderRadius: 2,
                                        boxShadow:
                                          "0 8px 32px rgba(0, 0, 0, 0.3)",
                                        maxWidth: 280,
                                        border:
                                          "1px solid rgba(255, 255, 255, 0.2)",
                                      },
                                    },
                                    arrow: {
                                      sx: {
                                        color: "#1976d2",
                                      },
                                    },
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    sx={{
                                      p: 0.25,
                                      borderRadius: "50%",
                                      backgroundColor:
                                        "rgba(25, 118, 210, 0.1)",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(25, 118, 210, 0.2)",
                                        transform: "scale(1.1)",
                                      },
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <Info size={14} color="#1976d2" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          {row.stateRanking !== null &&
                          row.stateRanking !== "Not Eligible" &&
                          typeof row.stateRanking === "number" ? (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                minWidth: 40,
                                backgroundColor: getRankingBadgeColor(
                                  row.stateRanking,
                                  "state",
                                  row.isProvisional
                                ).bg,
                                color: getRankingBadgeColor(
                                  row.stateRanking,
                                  "state",
                                  row.isProvisional
                                ).text,
                              }}
                            >
                              #{row.stateRanking}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1.5,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  minWidth: 80,
                                  backgroundColor: "#ffebee",
                                  color: "#c62828",
                                  textAlign: "center",
                                }}
                              >
                                Not Eligible
                              </Box>
                              {row.whyNotEligibleForState && (
                                <Tooltip
                                  title={
                                    <Box sx={{ p: 1 }}>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontSize: "0.7rem",
                                          color: "#fff",
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {row.whyNotEligibleForState}
                                      </Typography>
                                    </Box>
                                  }
                                  arrow
                                  placement="top"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: "#1976d2",
                                        borderRadius: 2,
                                        boxShadow:
                                          "0 8px 32px rgba(0, 0, 0, 0.3)",
                                        maxWidth: 280,
                                        border:
                                          "1px solid rgba(255, 255, 255, 0.2)",
                                      },
                                    },
                                    arrow: {
                                      sx: {
                                        color: "#1976d2",
                                      },
                                    },
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    sx={{
                                      p: 0.25,
                                      borderRadius: "50%",
                                      backgroundColor:
                                        "rgba(25, 118, 210, 0.1)",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(25, 118, 210, 0.2)",
                                        transform: "scale(1.1)",
                                      },
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <Info size={14} color="#1976d2" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

// Main InternshipRankings Component
const InternshipRankings = ({
  filterOptions,
  isStaffDashboard = false,
  refreshTrigger = null, // Optional prop to trigger refresh
}) => {
  const [rankingData, setRankingData] = useState(null);
  const [rankingLoading, setRankingLoading] = useState(true);

  // Fetch ranking data
  const fetchRankingData = async () => {
    try {
      setRankingLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      let response;

      if (isStaffDashboard) {
        // Staff dashboard version - requires institute_id
        const instituteId = localStorage.getItem("selectedInstituteId");
        const payload = {};
        if (instituteId) {
          payload.institute_id = instituteId;
        }

        response = await api.post(
          `${BASE_URL}/internship/institute-ranking-staff`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Regular dashboard version
        response = await api.get(`${BASE_URL}/internship/institute-ranking`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      setRankingData(response.data);
    } catch (error) {
      console.error("Error fetching ranking data:", error);
      setRankingData([]);
    } finally {
      setRankingLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRankingData();
  }, [isStaffDashboard]);

  // Refresh when refreshTrigger changes (for staff dashboard localStorage changes)
  useEffect(() => {
    if (refreshTrigger !== null) {
      fetchRankingData();
    }
  }, [refreshTrigger]);

  return (
    <RankingsAccordion
      rankingData={rankingData}
      filterOptions={filterOptions}
      loading={rankingLoading}
    />
  );
};

export default InternshipRankings;
