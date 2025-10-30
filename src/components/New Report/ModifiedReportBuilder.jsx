import React, { useState } from "react";
import { Box, Typography, ThemeProvider, createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import ReportFilter from "./ReportFilter";
import ReportHistory from "./ReportHistory";

// Create a modern blue theme
const blueTheme = createTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2027",
      secondary: "#637381",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 10px 0 rgba(0,0,0,0.08)",
          },
        },
      },
    },
  },
});

const ReportBuilder = ({ onBack }) => {
  // State to trigger report history refresh
  const [refreshHistory, setRefreshHistory] = useState(0);

  // Handler for when a report is generated
  const handleReportGenerated = () => {
    // Increment refresh trigger to cause report history to reload
    setRefreshHistory((prev) => prev + 1);
  };

  return (
    <ThemeProvider theme={blueTheme}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create Bulk Report
          </Typography>
        </Box>

        {/* Report Filter Component */}
        <ReportFilter onGenerateReport={handleReportGenerated} />

        {/* Report History Component */}
        <ReportHistory refreshTrigger={refreshHistory} />
      </Box>
    </ThemeProvider>
  );
};

export default ReportBuilder;
