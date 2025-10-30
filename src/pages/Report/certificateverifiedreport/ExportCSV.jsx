import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// Styled Export Button with gradient
const ExportButton = styled(Button)(({ theme }) => ({
  height: "40px",
  minWidth: "auto",
  background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
  boxShadow: "0 4px 10px rgba(76, 175, 80, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 14px rgba(76, 175, 80, 0.4)",
  },
  "&.Mui-disabled": {
    background: "linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)",
  },
}));

/**
 * Utility function to convert JSON data to CSV format
 * @param {Array} data - Array of objects containing certificate data
 * @returns {Blob} - CSV data as a Blob object
 */
const convertJsonToCsv = (data) => {
  if (!data || data.length === 0) {
    return new Blob(["No data available"], { type: "text/csv;charset=utf-8;" });
  }

  // Extract headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV header row
  let csvContent = headers.join(",") + "\n";

  // Add data rows
  data.forEach((item) => {
    const row = headers.map((header) => {
      // Handle cases where values might contain commas or quotes
      const value =
        item[header] === null || item[header] === undefined
          ? ""
          : item[header].toString();
      // Escape quotes and wrap in quotes if value contains commas or quotes
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });

    csvContent += row.join(",") + "\n";
  });

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
};

const ExportCSV = ({ searchParams, data, loading }) => {
  const [exporting, setExporting] = useState(false);

  // Function to check if filters are applied
  const hasFilters = () => {
    if (!searchParams) return false;

    // Check if any filter is applied
    return (
      (searchParams.email && searchParams.email.trim() !== "") ||
      (searchParams.domains && searchParams.domains.length > 0) ||
      (searchParams.cohorts && searchParams.cohorts.length > 0) ||
      (searchParams.years && searchParams.years.length > 0) ||
      (searchParams.branches && searchParams.branches.length > 0)
    );
  };

  // Determine button text based on filters
  const getButtonText = () => {
    if (exporting) return "Exporting...";
    return hasFilters() ? "Export Filtered" : "Export All";
  };

  // Handle export click
  const handleExport = async () => {
    setExporting(true);
    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("Authentication token not found. Please login again.");
        setExporting(false);
        return;
      }

      // Prepare request payload with filters if any
      const requestPayload = {};

      if (searchParams) {
        // Add email search if it has a value
        if (searchParams.email && searchParams.email.trim() !== "") {
          requestPayload.search = searchParams.email;
        }

        // Add multiple domains filter if selected
        if (searchParams.domains && searchParams.domains.length > 0) {
          requestPayload.domains = searchParams.domains;
        }

        // Add multiple cohorts filter if selected
        if (searchParams.cohorts && searchParams.cohorts.length > 0) {
          requestPayload.cohorts = searchParams.cohorts;
        }

        // Add multiple years filter if selected
        if (searchParams.years && searchParams.years.length > 0) {
          requestPayload.years = searchParams.years;
        }

        // Add multiple branches filter if selected
        if (searchParams.branches && searchParams.branches.length > 0) {
          requestPayload.branches = searchParams.branches;
        }
      }

      // If we already have the data in our component state, use it directly
      if (data && data.certificates && data.certificates.length > 0) {
        const csvBlob = convertJsonToCsv(data.certificates);

        // Create a URL for the blob
        const url = window.URL.createObjectURL(csvBlob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = url;

        // Set the file name with current date
        const date = new Date().toISOString().split("T")[0];
        const fileName = hasFilters()
          ? `filtered_certificates_${date}.csv`
          : `all_certificates_${date}.csv`;

        link.setAttribute("download", fileName);

        // Append to the document, trigger click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL
        window.URL.revokeObjectURL(url);
      } else {
        // Make the API call to get the data
        const response = await api.post(
          `${BASE_URL}/internship/certificatesVerifiedexport`,
          requestPayload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Convert the API response to CSV
        const csvBlob = convertJsonToCsv(response.data.certificates);

        // Create a URL for the blob
        const url = window.URL.createObjectURL(csvBlob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = url;

        // Set the file name with current date
        const date = new Date().toISOString().split("T")[0];
        const fileName = hasFilters()
          ? `filtered_certificates_${date}.csv`
          : `all_certificates_${date}.csv`;

        link.setAttribute("download", fileName);

        // Append to the document, trigger click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again later.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <ExportButton
        variant="contained"
        startIcon={
          exporting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <DownloadIcon />
          )
        }
        onClick={handleExport}
        disabled={exporting || loading || (data && data.length === 0)}
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
          minWidth: "140px",
          whiteSpace: "nowrap",
        }}
      >
        {getButtonText()}
      </ExportButton>
    </motion.div>
  );
};

export default ExportCSV;
