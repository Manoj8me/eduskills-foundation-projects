import React, { useState } from "react";
import {
  Button,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

const ExportButton = styled(Button)(({ theme }) => ({
  height: "40px",
  background: "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
  boxShadow: "0 3px 8px rgba(76, 175, 80, 0.3)",
  transition: "all 0.3s ease",
  color: "#fff",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 12px rgba(76, 175, 80, 0.4)",
  },
}));

const ExportCSV = ({ data, searchParams, filename = "student-data" }) => {
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Tooltip title="No data available to export">
        <span>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            disabled
            sx={{
              height: "40px",
              bgcolor: "rgba(76, 175, 80, 0.5)",
            }}
          >
            Export CSV
          </Button>
        </span>
      </Tooltip>
    );
  }

  // Helper function to convert array of objects to CSV with proper comma handling
  const convertArrayToCSV = (data) => {
    if (!data || data.length === 0) return "";

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV rows with headers
    const csvRows = [
      // Properly escape headers in case they contain commas
      headers
        .map((header) => {
          if (
            header.includes(",") ||
            header.includes('"') ||
            header.includes("\n")
          ) {
            return `"${header.replace(/"/g, '""')}"`;
          }
          return header;
        })
        .join(","), // Header row

      // Map each data row to a CSV line with proper escaping
      ...data.map((row) =>
        headers
          .map((header) => {
            // Handle all data types by converting to string
            const cell =
              row[header] !== undefined && row[header] !== null
                ? String(row[header]).trim()
                : "";

            // Always wrap in quotes if contains commas, quotes, newlines or any special character
            if (
              cell.includes(",") ||
              cell.includes('"') ||
              cell.includes("\n") ||
              cell.includes("\r") ||
              cell.includes(";") ||
              /[\s\t\v]/.test(cell)
            ) {
              return `"${cell.replace(/"/g, '""')}"`;
            }

            // For empty values or simple values, no quotes needed
            return cell;
          })
          .join(",")
      ),
    ].join("\n");

    return csvRows;
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      // Get current date for filename
      const date = new Date().toISOString().slice(0, 10);
      let exportFilename = `${filename}-${date}.csv`;

      // Determine if we're exporting filtered or all data
      const isFilteredData = isFiltered(searchParams);

      // Update filename based on filter state
      if (isFilteredData) {
        exportFilename = `${filename}-filtered-${date}.csv`;
      } else {
        exportFilename = `${filename}-all-${date}.csv`;
      }

      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Prepare request payload for API
      const requestPayload = {
        export_all: !isFilteredData,
      };

      // If filtered, add filter parameters
      if (isFilteredData) {
        if (searchParams.domain_id) {
          requestPayload.domains = searchParams.domain_id;
        }
        if (searchParams.cohort_id) {
          requestPayload.cohorts = searchParams.cohort_id;
        }
        if (searchParams.year) {
          requestPayload.years = searchParams.year;
        }
        if (searchParams.branch) {
          requestPayload.branches = searchParams.branch;
        }
        if (searchParams.email) {
          requestPayload.search = searchParams.email;
        }

        // Add status if available
        if (searchParams.status) {
          const getStatusId = (status) => {
            const statusMap = {
              Applied: 1,
              Approved: 2,
              Rejected: 3,
              Pending: 4,
            };
            return statusMap[status] || 1;
          };

          requestPayload.is_status = getStatusId(searchParams.status);
        }
      }

      // Make API call to get CSV data
      const response = await axios({
        method: "post",
        url: `${BASE_URL}/internship/spoc/approvalexport`,
        data: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Important for handling file downloads
      });

      // Process the blob response
      const reader = new FileReader();
      reader.onload = function () {
        try {
          // Parse the JSON data from the response
          const responseData = JSON.parse(reader.result);

          if (responseData && responseData.internships) {
            // Filter out unwanted fields from each internship object
            const filteredInternships = responseData.internships.map(
              (internship) => {
                const { user_id, internship_id, ...filteredData } = internship;

                // Handle any potential formatting issues with the remaining data
                // For example, ensure fields don't have trailing spaces that might cause issues
                Object.keys(filteredData).forEach((key) => {
                  if (typeof filteredData[key] === "string") {
                    // Trim strings but preserve internal spaces
                    filteredData[key] = filteredData[key].replace(
                      /^\s+|\s+$/g,
                      ""
                    );
                  }
                });

                return filteredData;
              }
            );

            // Create CSV content from filtered data
            const csvContent = convertArrayToCSV(filteredInternships);

            // Add BOM for Excel to properly recognize UTF-8
            const BOM = "\uFEFF";
            const csvWithBOM = BOM + csvContent;

            // Create and trigger download
            const blob = new Blob([csvWithBOM], {
              type: "text/csv;charset=utf-8;",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", exportFilename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success alert
            setAlertInfo({
              open: true,
              message: `${
                isFilteredData ? "Filtered" : "All"
              } data exported successfully!`,
              severity: "success",
            });
          } else {
            throw new Error("Invalid data format");
          }
        } catch (err) {
          console.error("Error processing response:", err);

          // If we can't parse as JSON, it might be already a CSV
          // Try to directly download the original blob
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", exportFilename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setAlertInfo({
            open: true,
            message: `${
              isFilteredData ? "Filtered" : "All"
            } data exported successfully!`,
            severity: "success",
          });
        }
      };

      reader.onerror = function () {
        throw new Error("Failed to read export data");
      };

      reader.readAsText(response.data);
    } catch (error) {
      console.error("Error exporting CSV:", error);

      // Show error alert with appropriate message
      let errorMessage = "Failed to export data. Please try again later.";
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // No response received from server
        errorMessage =
          "Server did not respond. Please check your connection and try again.";
      } else if (error.message) {
        // Error setting up the request
        errorMessage = error.message;
      }

      setAlertInfo({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle closing the alert
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertInfo((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <ExportButton
        variant="contained"
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <FileDownloadIcon />
          )
        }
        onClick={handleExport}
        disabled={loading}
      >
        {loading
          ? "Exporting..."
          : isFiltered(searchParams)
          ? "Export Filtered"
          : "Export All"}
      </ExportButton>

      {/* Alert notification for export status */}
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertInfo.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Helper function to determine if filters are applied
const isFiltered = (searchParams) => {
  return !!(
    searchParams &&
    (searchParams.email ||
      searchParams.domain_id ||
      searchParams.cohort_id ||
      searchParams.year ||
      searchParams.branch)
  );
};

export default ExportCSV;
