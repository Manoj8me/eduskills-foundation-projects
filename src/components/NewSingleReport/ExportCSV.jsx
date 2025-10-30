import React, { useState } from "react";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

// This component handles CSV export functionality
const ExportCSV = ({ searchParams, data }) => {
  const [loading, setLoading] = useState(false);

  // Helper function to format status ID based on status name
  const getStatusId = (status) => {
    if (!status) return 0; // Default status ID

    // Map status names to IDs - adjust these mappings as needed
    const statusMap = {
      Applied: 1,
      Approved: 2,
      Rejected: 3,
      Pending: 4,
    };

    return statusMap[status] || 6;
  };

  // Filter out ID keys from the data
  const filterIdKeys = (keys) => {
    return keys.filter((key) => {
      // Remove any key that contains 'id' or '_id' (case insensitive)
      return !/id$/i.test(key) && key !== "id" && !key.includes("_id");
    });
  };

  // Handle click on export button
  const handleExport = async () => {
    setLoading(true);
    try {
      // Check if we already have the data in memory
      if (data && data.length > 0) {
        // Use the local export function that uses keys as column headers
        handleLocalExport();
        return;
      }

      // If no data in memory, make a server request
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Prepare request payload according to API requirements
      const requestPayload = {
        domains: searchParams.domain_id || null,
        is_status: getStatusId(searchParams.status),
        search: searchParams.email || "",
        // Request all records by setting a large page size
        page: 1,
        page_size: 1000,
        export: true, // Signal that this is an export request
      };

      // Add any other filtering parameters if needed
      if (searchParams.cohort_id) {
        requestPayload.cohorts = searchParams.cohort_id;
      }

      if (searchParams.year) {
        requestPayload.years = searchParams.year;
      }

      if (searchParams.branch) {
        requestPayload.branches = searchParams.branch;
      }

      const response = await api.post(
        `${BASE_URL}/internship/internshipsReportEmail`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json", // Changed to JSON to get raw data
          },
        }
      );

      // Check if we got data in the response
      if (response.data && Array.isArray(response.data.internships)) {
        // Format the data
        const exportData = response.data.internships.map((item) => {
          // Keep all the original keys and values
          return item;
        });

        // Get all possible keys from all data rows (excluding ID keys)
        const allKeys = exportData.reduce((keys, row) => {
          Object.keys(row).forEach((key) => {
            if (!keys.includes(key)) {
              keys.push(key);
            }
          });
          return keys;
        }, []);

        // Filter out ID keys
        const filteredKeys = filterIdKeys(allKeys);

        // Generate CSV content with filtered keys as headers
        const headers = filteredKeys;
        let csvContent = headers.join(",") + "\n";

        exportData.forEach((row) => {
          const values = headers.map((key) => {
            const value =
              row[key] === undefined || row[key] === null ? "" : row[key];
            return `"${String(value).replace(/"/g, '""')}"`;
          });
          csvContent += values.join(",") + "\n";
        });

        // Create a blob from the CSV content
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);

        // Create a link element to trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `internship-report-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("No data available for export or invalid response format.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Alternative export method if API doesn't support direct CSV download
  const handleLocalExport = () => {
    setLoading(true);
    try {
      // Use the keys from the first data row as headers
      if (!data || data.length === 0) {
        alert("No data available to export.");
        setLoading(false);
        return;
      }

      // Get all possible keys from all data rows (excluding ID keys)
      const allKeys = data.reduce((keys, row) => {
        Object.keys(row).forEach((key) => {
          if (!keys.includes(key)) {
            keys.push(key);
          }
        });
        return keys;
      }, []);

      // Filter out ID keys
      const filteredKeys = filterIdKeys(allKeys);

      // Use the filtered keys as headers for the CSV
      const headers = filteredKeys;

      let csvContent = headers.join(",") + "\n";

      data.forEach((row) => {
        const values = headers.map((key) => {
          // Handle empty values, ensure proper CSV escaping
          const value =
            row[key] === undefined || row[key] === null ? "" : row[key];
          // Escape quotes and wrap in quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += values.join(",") + "\n";
      });

      // Create a blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      // Create a link element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `internship-report-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error creating CSV:", error);
      alert("Failed to export data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Download CSV report">
      <span>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={
            loading ? <CircularProgress size={16} /> : <FileDownloadIcon />
          }
          onClick={handleExport}
          disabled={loading}
          sx={{
            fontSize: "0.75rem",
            whiteSpace: "nowrap",
            ml: 1,
            borderRadius: "4px",
            textTransform: "none",
          }}
        >
          Export to CSV
        </Button>
      </span>
    </Tooltip>
  );
};

export default ExportCSV;
