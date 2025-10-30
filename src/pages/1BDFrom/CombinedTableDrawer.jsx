import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import CollegeDataTable from "./CollegeDataTable";
import CollegeEditDrawer from "./CollegeEditDrawer";
import api from "../../services/api";
import { BASE_URL } from "../../services/configUrls";

// Custom Gray-White Theme with Blue Inputs
const grayWhiteTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#6b7280",
      light: "#9ca3af",
      dark: "#4b5563",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#374151",
      secondary: "#6b7280",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

const CombinedTableDrawer = () => {
  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // API Configuration
  const API_ENDPOINT = `${BASE_URL}/internship/nonmen_data_72`;

  // Fetch college data from API
  const fetchCollegeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("accessToken");

      const response = await api.get(API_ENDPOINT, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setCollegeData(response.data);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching college data:", err);

      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access this data.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchCollegeData();
  }, []);

  // Update college data (local state only)
  const updateCollegeData = (updatedCollege) => {
    setCollegeData((prev) =>
      prev.map((college) =>
        college.id === updatedCollege.id ? updatedCollege : college
      )
    );
    return true;
  };

  // Delete college data (local state only)
  const deleteCollegeData = (collegeId) => {
    setCollegeData((prev) =>
      prev.filter((college) => college.id !== collegeId)
    );
    return true;
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this college data?")) {
      deleteCollegeData(id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingCollege(null);
    setError(null);
  };

  const handleSave = (updatedCollege) => {
    updateCollegeData(updatedCollege);
    setDrawerOpen(false);
    setEditingCollege(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleRefresh = () => {
    fetchCollegeData();
  };

  // Error display component
  const ErrorDisplay = ({ error, onRetry }) => (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        margin: "20px",
        textAlign: "center",
      }}
    >
      <h3 style={{ color: "#dc2626", margin: "0 0 10px 0" }}>Error</h3>
      <p style={{ color: "#7f1d1d", margin: "0 0 15px 0" }}>{error}</p>
      <button
        onClick={onRetry}
        style={{
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );

  // Loading display component
  const LoadingDisplay = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f4f6",
          borderTop: "4px solid #1976d2",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p style={{ marginTop: "16px", color: "#6b7280" }}>
        Loading college data...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (loading) {
    return (
      <ThemeProvider theme={grayWhiteTheme}>
        <LoadingDisplay />
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={grayWhiteTheme}>
        <ErrorDisplay error={error} onRetry={handleRefresh} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={grayWhiteTheme}>
      <CollegeDataTable
        collegeData={collegeData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showSuccess={showSuccess}
        onRefresh={handleRefresh}
        loading={loading}
      />

      <CollegeEditDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        college={editingCollege}
        onSave={handleSave}
      />
    </ThemeProvider>
  );
};

export default CombinedTableDrawer;
