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
  Chip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StudentStatusApp from "../../components/NotApplied/NotApplied";
import Applied from "../../components/Applied/Applied";
import CertVerified from "../../components/CertificateVerified/CertVerified";
import CertIssued from "../../components/CertificateIssued/CertIssued";
import Failed from "../../components/Failed/Failed";
import ApprovedReport from "../Report/approvedreport/Report";
import AppliedReport from "../Report/appliedreport/AppliedReport";
import CertVerifiedReport from "../Report/certificateverifiedreport/CertVerifiedReport";
import CertIssuedReport from "../Report/certificateissuedreport/CertIssuedReport";
import FailedReport from "../Report/failedreport/FailedReport";

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
const ReportSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State for popover menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);

  // Settings menu items
  const menuItems = [
    { id: "not-applied", label: "Not Applied" },
    { id: "internship-applied", label: "Internship Applied" },
    { id: "internship-approved", label: "Internship Approved" },
    { id: "certificate-verified", label: "Certificate Verified" },
    { id: "final-certificate", label: "Final Certificate Issued" },
    { id: "failed-students", label: "Failed Students" },
  ];

  // State for active setting
  const [activeSetting, setActiveSetting] = useState("not-applied");

  // Handle setting selection
  const handleSettingClick = (settingId) => {
    setActiveSetting(settingId);
    handlePopoverClose();
  };

  // Handles tab change
  const handleTabChange = (event, newValue) => {
    setActiveSetting(menuItems[newValue].id);
  };

  // Get current tab index from active setting
  const getCurrentTabIndex = () => {
    return menuItems.findIndex((item) => item.id === activeSetting);
  };

  // Popover handlers
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Component to render based on active setting
  const renderSettingComponent = () => {
    switch (activeSetting) {
      case "not-applied":
        return <StudentStatusApp />;
      case "internship-applied":
        return <AppliedReport />;
      case "internship-approved":
        return <ApprovedReport />;
      case "certificate-verified":
        return <CertVerifiedReport />;
      case "final-certificate":
        return <CertIssuedReport />;
      case "failed-students":
        return <FailedReport />;
      default:
        return <StudentStatusApp />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Topbar for desktop */}
      {!isMobile && (
        <TopbarContainer position="sticky">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
              <Typography variant="h6" fontWeight={600} color="white">
                Student Report
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
              >
                {menuItems.map((item, index) => (
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
                sx={{ mr: 2 }}
              >
                Student Report
              </Typography>
              <Button
                onClick={handlePopoverOpen}
                endIcon={<ExpandMoreIcon />}
                variant="contained"
                sx={{
                  textTransform: "none",
                  px: 2,
                  ml: "auto",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                {menuItems.find((item) => item.id === activeSetting)?.label}
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
                    {menuItems.map((item) => (
                      <ListItem
                        key={item.id}
                        button
                        selected={activeSetting === item.id}
                        onClick={() => handleSettingClick(item.id)}
                        style={
                          activeSetting === item.id
                            ? { backgroundColor: "#0d47a1", color: "white" }
                            : {}
                        }
                        sx={{
                          py: 1.5,
                          mx: 1,
                          borderRadius: "4px",
                          my: 0.5,
                          "& .MuiListItemText-primary": {
                            color:
                              activeSetting === item.id ? "white" : "inherit",
                          },
                          "&:hover": {
                            backgroundColor:
                              activeSetting === item.id ? "#0d47a1" : "#f0f0f0",
                          },
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
                color="white" // Fixed: Changed from #2c2c2c to white
                sx={{ mr: 2 }}
              >
                Student Report
              </Typography>
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={handlePopoverOpen}
                sx={{ ml: "auto", color: "white" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="span"
                variant="subtitle1"
                color="white"
                sx={{ ml: 1, fontWeight: 500 }}
              >
                {menuItems.find((item) => item.id === activeSetting)?.label}
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
                    {menuItems.map((item) => (
                      <ListItem
                        key={item.id}
                        button
                        selected={activeSetting === item.id}
                        onClick={() => handleSettingClick(item.id)}
                        style={
                          activeSetting === item.id
                            ? { backgroundColor: "#0d47a1", color: "white" }
                            : {}
                        }
                        sx={{
                          py: 1.5,
                          mx: 1,
                          borderRadius: "4px",
                          my: 0.5,
                          "& .MuiListItemText-primary": {
                            color:
                              activeSetting === item.id ? "white" : "inherit",
                          },
                          "&:hover": {
                            backgroundColor:
                              activeSetting === item.id ? "#0d47a1" : "#f0f0f0",
                          },
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

      {/* <Container
        maxWidth="xl"
        disableGutters
        sx={{ px: { xs: 1, sm: 3 }, mt: 4, pb: 8 }}
      > */}
      <Grid container spacing={2}>
        {/* Content area */}
        <Grid item xs={12}>
          <ContentContainer>
            <Box sx={{ p: { xs: 0.1, sm: 1 } }}>{renderSettingComponent()}</Box>
          </ContentContainer>
        </Grid>
      </Grid>
      {/* </Container> */}
    </Box>
  );
};

export default ReportSidebar;
