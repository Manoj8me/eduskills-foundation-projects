import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
  IconButton,
  Container,
  Popover,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Applied from "../../components/Applied/Applied";
import InternshipDashboard from "../Internship/New/InternshipDashboard";
// Make sure the path to the AppliedStatus component is correct based on your file structure
// import AppliedStatus from "../Internship/New/AppliedStatus";

// Styled components for Topbar
const TopbarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#0d47a1", // Deep material blue color
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  borderRadius: "0 0 12px 12px",
  position: "sticky",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  minWidth: 120,
  padding: "12px 16px",
  borderRadius: "8px",
  margin: "0 4px",
  transition: "all 0.2s ease",
  color: "rgba(255, 255, 255, 0.7)",
  "&.Mui-selected": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "white",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
}));

const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "white",
  borderRadius: 8,
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  minHeight: "calc(100vh - 120px)",
  display: "flex",
  flexDirection: "column",
}));

// Custom Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Component for Settings App
const NewSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State for popover menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);

  // State for cohort filter
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const openFilterPopover = Boolean(filterAnchorEl);
  const [selectedCohorts, setSelectedCohorts] = useState(["Cohort 1"]);

  // Student counts data
  const [studentCounts, setStudentCounts] = useState({
    internshipApplied: 78,
  });

  // Settings menu items - only keep "Manage" (renamed from "Internship Applied")
  const menuItems = [
    {
      id: "manage",
      label: "Manage",
      count: studentCounts.internshipApplied,
    },
  ];

  // State for active setting
  const [activeSetting, setActiveSetting] = useState("dashboard");
  const [showDashboard, setShowDashboard] = useState(true);

  // Handle setting selection
  const handleSettingClick = (settingId) => {
    if (settingId === "dashboard") {
      setShowDashboard(true);
    } else {
      setShowDashboard(false);
      setActiveSetting(settingId);
    }
    handlePopoverClose();
  };

  // Handles tab change
  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      setShowDashboard(true);
    } else {
      setShowDashboard(false);
      setActiveSetting(menuItems[newValue - 1].id);
    }
  };

  // Get current tab index from active setting
  const getCurrentTabIndex = () => {
    if (showDashboard) return 0;
    return menuItems.findIndex((item) => item.id === activeSetting) + 1;
  };

  // Popover handlers
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Filter popover handlers
  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle cohort selection
  const handleCohortToggle = (cohort) => {
    const currentIndex = selectedCohorts.indexOf(cohort);
    const newSelectedCohorts = [...selectedCohorts];

    if (currentIndex === -1) {
      newSelectedCohorts.push(cohort);
    } else {
      newSelectedCohorts.splice(currentIndex, 1);
    }

    setSelectedCohorts(newSelectedCohorts);

    // Update student counts based on selected cohorts
    if (newSelectedCohorts.length > 0) {
      const multiplier = newSelectedCohorts.length * 0.8;
      setStudentCounts({
        internshipApplied: Math.round(78 * multiplier),
      });
    } else {
      setStudentCounts({
        internshipApplied: 0,
      });
    }
  };

  // Component to render based on active setting
  const renderSettingComponent = () => {
    return <Applied />;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Topbar for desktop */}
      {!isMobile && (
        <TopbarContainer position="sticky">
          <Container maxWidth="xl">
            <Toolbar
              sx={{ justifyContent: "center", py: 1, position: "relative" }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color="white"
                sx={{ position: "absolute", left: 24 }}
              >
                Status
              </Typography>

              <Tabs
                value={getCurrentTabIndex()}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  style: { display: "none" },
                }}
                sx={{
                  minHeight: "60px",
                  "& .MuiTabs-flexContainer": {
                    gap: 1,
                  },
                }}
                centered
              >
                <StyledTab
                  label="Dashboard"
                  disableRipple
                  selected={showDashboard}
                  icon={
                    showDashboard ? <CheckCircleIcon fontSize="small" /> : null
                  }
                  iconPosition="end"
                />
                {menuItems.map((item) => (
                  <StyledTab
                    key={item.id}
                    label={item.label}
                    disableRipple
                    selected={activeSetting === item.id}
                    icon={
                      activeSetting === item.id ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : null
                    }
                    iconPosition="end"
                  />
                ))}
                <StyledTab
                  label="Certificate Status"
                  disableRipple
                  selected={false}
                  iconPosition="end"
                />
              </Tabs>
            </Toolbar>
          </Container>
        </TopbarContainer>
      )}

      {/* Mobile header with popover for small screens */}
      {isMobile && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 3 },
            py: 2,
            borderBottom: "1px solid #eaeaea",
            backgroundColor: "#0d47a1",
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {isSmallScreen ? (
            <>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="white"
                sx={{ position: "absolute", left: 16 }}
              >
                Status
              </Typography>

              <Typography variant="subtitle1" fontWeight={600} color="white">
                Certificate Status
              </Typography>
              <Button
                onClick={handlePopoverOpen}
                endIcon={<ExpandMoreIcon />}
                variant="contained"
                sx={{
                  textTransform: "none",
                  px: 2,
                  position: "absolute",
                  right: 16,
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                {showDashboard
                  ? "Dashboard"
                  : menuItems.find((item) => item.id === activeSetting)?.label}
              </Button>
              <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Paper sx={{ width: 250 }}>
                  <List>
                    <ListItem
                      button
                      selected={showDashboard}
                      onClick={() => handleSettingClick("dashboard")}
                      sx={{
                        backgroundColor: showDashboard
                          ? "#1976d2"
                          : "transparent",
                        color: showDashboard ? "white" : "inherit",
                        "&:hover": {
                          backgroundColor: showDashboard
                            ? "#1565c0"
                            : "#f0f0f0",
                        },
                        py: 1.5,
                        mx: 1,
                        borderRadius: "4px",
                        my: 0.5,
                      }}
                    >
                      <ListItemText primary="Dashboard" />
                      {showDashboard && (
                        <CheckCircleIcon
                          sx={{ color: "white" }}
                          fontSize="small"
                        />
                      )}
                    </ListItem>
                    {menuItems.map((item) => (
                      <ListItem
                        key={item.id}
                        button
                        selected={activeSetting === item.id}
                        onClick={() => handleSettingClick(item.id)}
                        sx={{
                          backgroundColor:
                            activeSetting === item.id
                              ? "#1976d2"
                              : "transparent",
                          color:
                            activeSetting === item.id ? "white" : "inherit",
                          "&:hover": {
                            backgroundColor:
                              activeSetting === item.id ? "#1565c0" : "#f0f0f0",
                          },
                          py: 1.5,
                          mx: 1,
                          borderRadius: "4px",
                          my: 0.5,
                        }}
                      >
                        <ListItemText primary={item.label} />
                        {activeSetting === item.id && (
                          <CheckCircleIcon
                            sx={{ color: "white" }}
                            fontSize="small"
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Popover>
            </>
          ) : (
            <>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="white"
                sx={{ mr: 2 }}
              >
                Status
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="white"
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                Dashboard
              </Typography>
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={handlePopoverOpen}
                sx={{ position: "absolute", right: 16, color: "white" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="span"
                variant="subtitle1"
                color="white"
                sx={{ ml: 1, fontWeight: 500 }}
              >
                {showDashboard
                  ? "Dashboard"
                  : menuItems.find((item) => item.id === activeSetting)?.label}
              </Typography>
              <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Paper sx={{ width: 250 }}>
                  <List>
                    <ListItem
                      button
                      selected={showDashboard}
                      onClick={() => handleSettingClick("dashboard")}
                      sx={{
                        backgroundColor: showDashboard
                          ? "#1976d2"
                          : "transparent",
                        color: showDashboard ? "white" : "inherit",
                        "&:hover": {
                          backgroundColor: showDashboard
                            ? "#1565c0"
                            : "#f0f0f0",
                        },
                        py: 1.5,
                        mx: 1,
                        borderRadius: "4px",
                        my: 0.5,
                      }}
                    >
                      <ListItemText primary="Dashboard" />
                      {showDashboard && (
                        <CheckCircleIcon
                          sx={{ color: "white" }}
                          fontSize="small"
                        />
                      )}
                    </ListItem>
                    {menuItems.map((item) => (
                      <ListItem
                        key={item.id}
                        button
                        selected={activeSetting === item.id}
                        onClick={() => handleSettingClick(item.id)}
                        sx={{
                          backgroundColor:
                            activeSetting === item.id
                              ? "#1976d2"
                              : "transparent",
                          color:
                            activeSetting === item.id ? "white" : "inherit",
                          "&:hover": {
                            backgroundColor:
                              activeSetting === item.id ? "#1565c0" : "#f0f0f0",
                          },
                          py: 1.5,
                          mx: 1,
                          borderRadius: "4px",
                          my: 0.5,
                        }}
                      >
                        <ListItemText primary={item.label} />
                        {activeSetting === item.id && (
                          <CheckCircleIcon
                            sx={{ color: "white" }}
                            fontSize="small"
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Popover>
            </>
          )}
        </Box>
      )}

      <Grid container spacing={2}>
        {/* Content area */}
        <Grid item xs={12}>
          <ContentContainer>
            <Box sx={{ p: { xs: 0.1, sm: 1 } }}>
              {showDashboard ? (
                // InternshipDashboard now includes the AppliedStatus component
                <InternshipDashboard />
              ) : (
                renderSettingComponent()
              )}
            </Box>
          </ContentContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewSidebar;
