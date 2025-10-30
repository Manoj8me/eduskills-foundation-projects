// ModernTabDashboardReports.jsx
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
} from "@mui/material";

import { blue } from "@mui/material/colors";

// import SingleReport from "../NewSingleReport/SingleReport";
import ManageModifiedReportBuilder from "./ManageModifiedReportBuilder";
import SingleReport from "../../NewSingleReport/SingleReport";
// import ManageModifiedReportBuilder from "./ManageModifiedReportBuilder";

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
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
        indicator: {
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          minHeight: 48,
          textTransform: "none",
          fontSize: "0.9rem",
          padding: "12px 24px",
          "&.Mui-selected": {
            color: blue[600],
          },
        },
      },
    },
  },
});

// Styled component for the scrollable content area
const ScrollableContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  height: "100%",
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

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
    </div>
  );
}

// Tab props
function a11yProps(index) {
  return {
    id: `reports-tab-${index}`,
    "aria-controls": `reports-tabpanel-${index}`,
  };
}

const ManageReportLayout = () => {
  // State for active tab index
  const [tabIndex, setTabIndex] = useState(0);

  // Media query for responsive design
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <ThemeProvider theme={blueTheme}>
      <Box
        sx={{
          mt: 4,
          mx: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: isSmallScreen
              ? "calc(100vh - 100px)"
              : "calc(100vh - 120px)",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            boxShadow: "0 0 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Tabs Bar */}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="report tabs"
            sx={{
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 0.6),
              px: 2,
            }}
          >
            <Tab label="Single Report" {...a11yProps(0)} />
            <Tab label="Bulk Report" {...a11yProps(1)} />
          </Tabs>

          {/* Content Panels */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <TabPanel value={tabIndex} index={0}>
              <ScrollableContentBox>
                <Box sx={{ p: 3 }}>
                  <SingleReport />
                </Box>
              </ScrollableContentBox>
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
              <ScrollableContentBox>
                <Box sx={{ p: 3 }}>
                  <ManageModifiedReportBuilder />
                </Box>
              </ScrollableContentBox>
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ManageReportLayout;
