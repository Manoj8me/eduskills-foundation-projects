import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Button,
  Typography,
  styled,
  Chip,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

const SectionTitle = styled(Typography)({
  fontSize: "0.9rem",
  fontWeight: 600,
  marginBottom: 12,
  color: "text.primary",
});

const ReportHistorySection = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  padding: "12px 16px",
  borderColor: theme.palette.divider,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.775rem",
  padding: "12px 16px",
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.text.secondary,
  fontWeight: 600,
  textTransform: "uppercase",
  borderColor: theme.palette.divider,
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: "0.75rem",
  borderRadius: "4px",
  margin: "2px",
}));

// Format date string
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("en-US", options);
};

// Format the filtration keys to be more readable
const formatFilterKey = (key) => {
  if (!key) return "";

  // Handle special cases
  if (key === "search") return "Search";

  // Convert camelCase to words with spaces and capitalize first letter
  return key
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

// Format filter values for display
const formatFilterValue = (key, value) => {
  if (!value) return "None";

  if (Array.isArray(value)) {
    if (value.length === 0) return "None";
    if (value.length <= 2) return value.join(", ");
    return `${value[0]}, ${value[1]} +${value.length - 2} more`;
  }

  return value || "None";
};

const StaffReportHistory = ({ refreshTrigger }) => {
  const [reportHistory, setReportHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedInstituteId, setSelectedInstituteId] = useState(
    localStorage.getItem("selectedInstituteId") || ""
  );

  const fetchReportHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const currentId = localStorage.getItem("selectedInstituteId") || "";
      setSelectedInstituteId(currentId);
      const response = await api.post(
        `${BASE_URL}/internship/getInternshipsReportServiceStaff`,
        {
          institute_id: currentId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.internshipReport) {
        // If single report is returned, wrap in array
        const reports = Array.isArray(response.data.internshipReport)
          ? response.data.internshipReport
          : [response.data.internshipReport];

        // Process each report to extract database_filtrations as JSON
        const processedReports = reports.map((report) => {
          try {
            const filtrations = JSON.parse(report.database_filtrations);
            return {
              ...report,
              parsedFiltrations: filtrations,
            };
          } catch (e) {
            console.error("Error parsing database_filtrations:", e);
            return {
              ...report,
              parsedFiltrations: {},
            };
          }
        });

        setReportHistory(processedReports);
      } else {
        setReportHistory([]);
      }
    } catch (err) {
      console.error("Error fetching report history:", err);
      // Don't set an error for report history - just show empty state
      setReportHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch report history on component mount or when refreshTrigger changes
  useEffect(() => {
    fetchReportHistory();

    const handleStorageChange = (e) => {
      if (
        e.key === "selectedInstituteId" &&
        e.newValue !== selectedInstituteId
      ) {
        // Refresh data when selectedInstituteId changes
        fetchReportHistory();
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Also check for changes every second (as a fallback)
    const intervalId = setInterval(() => {
      const currentInstituteId =
        localStorage.getItem("selectedInstituteId") || "";
      if (currentInstituteId !== selectedInstituteId) {
        fetchReportHistory();
      }
    }, 1000);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [refreshTrigger, selectedInstituteId]);

  //   const intervalId = setInterval(() => {
  //     const currentInstituteId =
  //       localStorage.getItem("selectedInstituteId") || "";
  //     if (currentInstituteId !== selectedInstituteId) {
  //       fetchReportHistory();
  //     }
  //   }, 1000);

  // Generate a tooltip content for filters
  const generateFilterTooltip = (filtrations) => {
    if (!filtrations || Object.keys(filtrations).length === 0) {
      return "No filters applied";
    }

    return (
      <Box
        sx={{
          p: 1,
          maxWidth: 300,
          bgcolor: "rgba(0, 0, 0, 0.85)",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, fontWeight: 600, color: "white" }}
        >
          Report Filters
        </Typography>

        {Object.entries(filtrations).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              py: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ mr: 2, color: "white" }}
            >
              {formatFilterKey(key)}:
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              {formatFilterValue(key, value)}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <ReportHistorySection>
      <SectionTitle>Report History</SectionTitle>
      <Divider sx={{ mb: 3 }} />

      {isLoadingHistory ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Report ID</StyledTableHeadCell>
                <StyledTableHeadCell>Filters</StyledTableHeadCell>
                <StyledTableHeadCell>Generated On</StyledTableHeadCell>
                <StyledTableHeadCell>Sent Time</StyledTableHeadCell>
                <StyledTableHeadCell>Status</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportHistory.map((report) => (
                <TableRow key={report.spoc_internship_report_id} hover>
                  <StyledTableCell>
                    <Typography variant="body2" fontWeight={500}>
                      Report #{report.spoc_internship_report_id}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip
                      title={generateFilterTooltip(report.parsedFiltrations)}
                      arrow
                      placement="right"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "rgba(0, 0, 0, 0.85)",
                            "& .MuiTooltip-arrow": {
                              color: "rgba(0, 0, 0, 0.85)",
                            },
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {Object.keys(report.parsedFiltrations || {}).length >
                        0 ? (
                          <FilterChip
                            label={`${
                              Object.keys(report.parsedFiltrations).length
                            } filter(s)`}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No filters
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>
                    {formatDate(report.created_at)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {report.sent_timestamp
                      ? formatDate(report.sent_timestamp)
                      : "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={report.sent_timestamp ? "Complete" : "In Progress"}
                      size="small"
                      sx={(theme) => ({
                        backgroundColor: alpha(
                          report.sent_timestamp
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                          0.1
                        ),
                        color: report.sent_timestamp
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        borderRadius: 1,
                      })}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isLoadingHistory && reportHistory.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <TuneIcon
            sx={{
              fontSize: 40,
              opacity: 0.4,
              mb: 2,
              color: "text.secondary",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            No reports generated yet.
          </Typography>
        </Box>
      )}
    </ReportHistorySection>
  );
};

export default StaffReportHistory;
