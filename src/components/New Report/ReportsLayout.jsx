// ModernTabsReports.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  alpha,
  useMediaQuery,
  styled,
  Container,
} from "@mui/material";

import { blue } from "@mui/material/colors";
import CustomReportBuilder from "./CustomReportBuilder";
import AppliedReport from "../../pages/Report/appliedreport/AppliedReport";
import SingleReport from "../NewSingleReport/SingleReport";
import ModifiedReportBuilder from "./ModifiedReportBuilder";

// Create a custom blue theme for modern look
const blueTheme = createTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    secondary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
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
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
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
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.95rem",
          minHeight: "48px",
          "&.Mui-selected": {
            fontWeight: 600,
          },
        },
      },
    },
  },
});

// Styled component for the scrollable content area
const ScrollableContentBox = styled(Box)(({ theme }) => ({
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: alpha(theme.palette.background.default, 0.4),
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.text.secondary, 0.3),
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: alpha(theme.palette.text.secondary, 0.5),
    },
  },
}));

// Fixed tabs container - truly fixed position
const FixedTabsContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  top: "190px", // Position below the main header (54px header + 140px margin from MainSidebar)
  left: 0,
  right: 0,
  zIndex: 999,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  borderRadius: 0,
  marginBottom: 0,
  padding: "8px 300px", // Add some padding for better spacing
  // Adjust for sidebar on desktop if needed
  [theme.breakpoints.up("lg")]: {
    left: 0, // Keep full width since it's inside container
  },
}));

// Content container with proper margin for fixed tabs
const ContentContainer = styled(Box)(() => ({
  marginTop: "100px", // Space for the fixed tabs header
  minHeight: "calc(100vh - 400px)",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  overflow: "hidden",
}));

// Content panel component
function ContentPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`reports-panel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      sx={{
        minHeight: "calc(100vh - 400px)",
        display: value === index ? "block" : "none",
      }}
      {...other}
    >
      {value === index && (
        <ScrollableContentBox>
          <Box sx={{ p: 4 }}>{children}</Box>
        </ScrollableContentBox>
      )}
    </Box>
  );
}

const ModernTabsReports = () => {
  // State for active tab index
  const [activeIndex, setActiveIndex] = useState(0);

  // Media query for responsive design
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // Navigation items
  const navigationItems = [
    { label: "Single Report", id: "single-report" },
    { label: "Bulk Report", id: "bulk-report" },
  ];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveIndex(newValue);
  };

  return (
    <ThemeProvider theme={blueTheme}>
      <Box sx={{ width: "100%" }}>
        {/* Fixed Tabs Header */}
        <FixedTabsContainer elevation={0}>
          <Container maxWidth="xl">
            <Box sx={{ px: 3 }}>
              {/* Header */}
              <Box sx={{ py: 2 }}>

                {/* Tabs */}
                <Tabs
                  value={activeIndex}
                  onChange={handleTabChange}
                  aria-label="reports tabs"
                  sx={{
                    minHeight: "48px",
                    "& .MuiTabs-indicator": {
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                    },
                  }}
                >
                  {navigationItems.map((item, index) => (
                    <Tab
                      key={item.id}
                      label={item.label}
                      id={`reports-tab-${index}`}
                      aria-controls={`reports-panel-${index}`}
                      sx={{ px: 3 }}
                    />
                  ))}
                </Tabs>
              </Box>
            </Box>
          </Container>
        </FixedTabsContainer>

        {/* Main Content Area */}
        <Container maxWidth="xl">
          <ContentContainer>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 0 24px rgba(0,0,0,0.08)",
                minHeight: "calc(100vh - 420px)",
              }}
            >
              <ContentPanel value={activeIndex} index={0}>
                <SingleReport />
              </ContentPanel>

              <ContentPanel value={activeIndex} index={1}>
                <ModifiedReportBuilder />
              </ContentPanel>
            </Paper>
          </ContentContainer>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ModernTabsReports;
