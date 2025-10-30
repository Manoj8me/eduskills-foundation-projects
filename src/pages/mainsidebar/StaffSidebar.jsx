import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  useMediaQuery,
  Container,
  Popover,
  Button,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ApprovedReport from "../Report/approvedreport/Report";
import PendingApproval from "../../components/PendingApproval/PendingApproval";
import ImprovedInternshipDashboard from "../Internship/New/InternshipDashboard";
import Manage from "../../components/manage/Manage";
import ComingSoonPage from "../../components/comingsoon/ComingSoon";
import CertificateDashboard from "../../components/Certificates/CertificateDashboard";
import ModernDashboardReports from "../../components/New Report/ReportsLayout";
import NewCompactInternshipDashboard from "../Internship/New/NewCompactDashboard";
import StaffCertificateDashboard from "../../components/Certificates/StaffCeritificateDashboard";
import StaffManage from "../../components/manage/StaffManage";
import StaffPendingApproval from "../../components/PendingApproval/StaffPendingApproval";
import StaffModernTabDashboardReports from "../../components/New Report/StaffReportLayout";

// Constants for layout dimensions
const HEADER_MOBILE = 70;
const HEADER_DESKTOP = 54;
const SIDEBAR_WIDTH = 270;

// Styled components for Zoho Books style tabs
const ZohoTopBar = styled(Box)(({ theme }) => ({
   backgroundColor: "#fff",
  borderBottom: "1px solid #e4e6ef",
  padding: "16px 24px",
  position: "fixed",
  top: theme.breakpoints.down("sm") ? HEADER_MOBILE : HEADER_DESKTOP,
  left: 0,
  right: 0,
  zIndex: 1000,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  // Adjust for sidebar on desktop
  [theme.breakpoints.up("lg")]: {
    left: SIDEBAR_WIDTH,
  },
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 600,
  color: "#333333",
  marginBottom: "16px",
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  borderBottom: "2px solid #e4e6ef",
  marginTop: "8px",
  // backgroundColor: "#fff",
  maxWidth: "100%",
  overflowX: "auto",
  overflowY: "visible",
  minHeight: "50px",
  "&::-webkit-scrollbar": {
    height: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "2px",
  },
}));

const ZohoTab = styled(Button)(({ theme, active }) => ({
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: 500,
  textTransform: "none",
  color: active ? "#2196f3" : "#64748b",
  backgroundColor: "transparent",
  position: "relative",
  borderRadius: "4px 4px 0 0",
  minWidth: "unset",
  transition: "all 0.2s ease",
  flexShrink: 0,
  height: "48px",

  "&:hover": {
    backgroundColor: "#f8f9fa",
    color: "#2196f3",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-2px",
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: active ? "#2196f3" : "transparent",
    transition: "background-color 0.2s ease",
    zIndex: 2,
  },

  "& .MuiButton-startIcon": {
    marginRight: "8px",
    "& > *:nth-of-type(1)": {
      fontSize: "18px",
    },
  },
}));

// Content container with proper spacing for fixed header
const ContentContainer = styled(Paper)(({ theme }) => ({
  // backgroundColor: "#ffffff",
  backgroundColor: "#f8f9fa",
  borderRadius: 0,
  boxShadow: "none",
  minHeight: "calc(100vh - 200px)",
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  overflow: "auto",
  marginTop: "140px", // Space for fixed header + tabs
  [theme.breakpoints.down("sm")]: {
    marginTop: "120px", // Adjust for mobile
  },
}));

// Mobile dropdown button
const MobileDropdownButton = styled(Button)(({ theme }) => ({
  padding: "8px 16px",
  border: "1px solid #e4e6ef",
  borderRadius: "6px",
  textTransform: "none",
  color: "#333333",
  backgroundColor: "#fff",
  minWidth: "200px",
  maxWidth: "calc(100vw - 48px)", // Ensure it fits on mobile
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "#f8f9fa",
    borderColor: "#2196f3",
  },
}));

// Styled Tooltip
const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    fontSize: "12px",
    padding: "8px 12px",
    borderRadius: "6px",
    maxWidth: 220,
    fontWeight: 400,
  },
  [`& .MuiTooltip-arrow`]: {
    color: "#1a1a1a",
  },
}));

// Main layout container
const PageLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#f8f9fa",
}));

// Content area wrapper
const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "hidden",
}));

// Component
const StaffSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State for popover menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);

  // Settings menu items with tooltips
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      tooltip: "Overview of internship statuses",
    },
    {
      id: "pending_approval",
      label: "Approval",
      tooltip:
        "In this section, you can approve or reject students and also update their domain.",
    },
    {
      id: "manage",
      label: "Manage",
      tooltip: "Here you can able to fail the students",
    },
    {
      id: "certificate",
      label: "Certificate",
      tooltip: "Here you can know all the statuses about students certificates",
    },
    {
      id: "report",
      label: "Report",
      tooltip: "Here you can generate single and bulk reports",
    },
  ];

  // State for active setting
  const [activeSetting, setActiveSetting] = useState("dashboard");

  // Handle setting selection
  const handleSettingClick = (settingId) => {
    setActiveSetting(settingId);
    handlePopoverClose();
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
      case "dashboard":
        return <NewCompactInternshipDashboard />;
      case "pending_approval":
        return <StaffPendingApproval />;
      case "manage":
        return <StaffManage />;
      case "certificate":
        return <StaffCertificateDashboard />;
      case "report":
        return <StaffModernTabDashboardReports />;
      default:
        return <NewCompactInternshipDashboard />;
    }
  };

  return (
    <PageLayout>
      <ZohoTopBar>
        <Container maxWidth="xl">
          <HeaderTitle>Internship Management</HeaderTitle>

          {/* Desktop Tabs */}
          {!isMobile && (
            <TabsContainer>
              {menuItems.map((item) => (
                <ZohoTab
                  key={item.id}
                  onClick={() => handleSettingClick(item.id)}
                  active={activeSetting === item.id}
                  startIcon={
                    activeSetting === item.id ? (
                      <CheckCircleIcon sx={{ fontSize: "16px" }} />
                    ) : null
                  }
                >
                  {item.label}
                  <StyledTooltip
                    title={item.tooltip}
                    arrow
                    placement="right"
                    enterDelay={200}
                    leaveDelay={100}
                  >
                    <InfoOutlinedIcon
                      sx={{
                        fontSize: "14px",
                        ml: 0.5,
                        color:
                          activeSetting === item.id ? "#2196f3" : "#9e9e9e",
                        "&:hover": {
                          color: "#2196f3",
                        },
                      }}
                    />
                  </StyledTooltip>
                </ZohoTab>
              ))}
            </TabsContainer>
          )}

          {/* Mobile Dropdown */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MobileDropdownButton
                onClick={handlePopoverOpen}
                endIcon={<ExpandMoreIcon />}
              >
                {menuItems.find((item) => item.id === activeSetting)?.label}
              </MobileDropdownButton>

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
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border: "1px solid #e4e6ef",
                    maxWidth: "calc(100vw - 48px)",
                  },
                }}
              >
                <List sx={{ py: 0.5, minWidth: "200px" }}>
                  {menuItems.map((item) => (
                    <ListItem
                      key={item.id}
                      button
                      selected={activeSetting === item.id}
                      onClick={() => handleSettingClick(item.id)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        "&.Mui-selected": {
                          backgroundColor: "#f0f7ff",
                          color: "#2196f3",
                          "&:hover": {
                            backgroundColor: "#e6f4ff",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "14px",
                          fontWeight: activeSetting === item.id ? 600 : 400,
                        }}
                      />
                      {activeSetting === item.id && (
                        <CheckCircleIcon
                          sx={{ color: "#2196f3", fontSize: "18px" }}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Popover>
            </Box>
          )}
        </Container>
      </ZohoTopBar>

      {/* Content Area */}
      <ContentWrapper>
        <Container maxWidth="xl" sx={{ py: 0, height: "100%" }}>
          <ContentContainer>{renderSettingComponent()}</ContentContainer>
        </Container>
      </ContentWrapper>
    </PageLayout>
  );
};

export default StaffSidebar;
