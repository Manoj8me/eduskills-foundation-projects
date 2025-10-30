import React, { useState } from "react";
import {
  Button,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontSize: "0.75rem",
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
  background: "linear-gradient(45deg, #43a047 30%, #66bb6a 90%)",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
    background: "linear-gradient(45deg, #388e3c 30%, #56a85a 90%)",
  },
  height: "36px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const ExportCSV = ({ searchParams = {} }) => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Determine if any filters are applied
  const hasFilters = () => {
    return (
      (searchParams.domain_id && searchParams.domain_id.length > 0) ||
      (searchParams.email && searchParams.email.trim() !== "") ||
      (searchParams.status && searchParams.status !== "") ||
      (searchParams.cohort_id && searchParams.cohort_id.length > 0) ||
      (searchParams.year && searchParams.year.length > 0) ||
      (searchParams.branch && searchParams.branch.length > 0)
    );
  };

  // Get button text based on filters
  const getButtonText = () => {
    if (exporting) return "Exporting...";

    if (hasFilters()) {
      return "Export Filtered Data";
    }
    return "Export All Data";
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setExporting(false);
        return;
      }

      // Prepare request payload based on searchParams
      const requestPayload = {
        // Default to null for each parameter if not provided
        domains: searchParams.domain_id || null,
        is_status: searchParams.status
          ? getStatusId(searchParams.status)
          : null,
        search: searchParams.email || "",
        cohorts: searchParams.cohort_id || null,
        years: searchParams.year || null,
        branches: searchParams.branch || null,
      };

      // Make request to export endpoint
      const response = await api.post(
        `${BASE_URL}/internship/spoc/appliedexport`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "blob", // Important for file download
        }
      );

      // Process the response to filter out the unwanted fields
      // Since we're getting a blob, we need to parse it first
      const reader = new FileReader();
      reader.onload = function () {
        try {
          // Parse the JSON data from the response
          const responseData = JSON.parse(reader.result);

          if (responseData && responseData.internships) {
            // Filter out unwanted fields from each internship object
            const filteredInternships = responseData.internships.map(
              (internship) => {
                const { user_id, internship_id, ...filteredData } =
                  internship;

                // Handle any potential formatting issues with the remaining data
                // For example, ensure full_name fields don't have trailing spaces that might cause issues
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
            link.setAttribute(
              "download",
              `internship_data_${new Date().toISOString().slice(0, 10)}.csv`
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSuccess(true);
          } else {
            throw new Error("Invalid data format");
          }
        } catch (err) {
          console.error("Error processing response:", err);
          setError("Failed to process export data. Please try again later.");
        }
      };

      reader.onerror = function () {
        setError("Failed to read export data. Please try again later.");
      };

      reader.readAsText(response.data);
    } catch (err) {
      console.error("Error exporting CSV data:", err);
      setError("Failed to export data. Please try again later.");
    } finally {
      setExporting(false);
    }
  };

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

  // Helper function to format status ID based on status name
  const getStatusId = (status) => {
    if (!status) return null;

    // Map status names to IDs - adjust these mappings as needed
    const statusMap = {
      Applied: 1,
      Approved: 2,
      Rejected: 3,
      Pending: 4,
    };

    return statusMap[status] || null;
  };

  // Handle closing the success message
  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  // Handle closing the error message
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Tooltip title="Export data to CSV file" placement="top">
        <ExportButton
          variant="contained"
          color="primary"
          startIcon={
            exporting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FileDownloadIcon />
            )
          }
          onClick={handleExport}
          disabled={exporting}
          size="small"
          sx={{
            color: "white",
          }}
        >
          {getButtonText()}
        </ExportButton>
      </Tooltip>

      {/* Success notification */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          CSV exported successfully!
        </Alert>
      </Snackbar>

      {/* Error notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportCSV;
