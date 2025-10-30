import React, { useState, useEffect } from "react";
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
  Skeleton,
  Alert,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import ApprovedReport from "../Report/approvedreport/Report";
import PendingApproval from "../../components/PendingApproval/PendingApproval";
import ImprovedInternshipDashboard from "../Internship/New/InternshipDashboard";
import Manage from "../../components/manage/Manage";
import ComingSoonPage from "../../components/comingsoon/ComingSoon";
import CertificateDashboard from "../../components/Certificates/CertificateDashboard";
import ModernDashboardReports from "../../components/New Report/ReportsLayout";
import MaterialExcelInterface from "../StudentInfo/ExcelPasteInterface";
import Applied from "../../components/Applied/Applied";
import NewMaterialExcelInterface from "../StudentInfo/NewExcelPasteInterface";
import StudentStatusApp from "../../components/NotApplied/NotApplied";
import ManageReportLayout from "../../components/New Report/ManageReport/ManageReportLayout";
import ManageModifiedReportBuilder from "../../components/New Report/ManageReport/ManageModifiedReportBuilder";
import ConferenceApp from "../Connect25/ConferenceApp";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import AwardsAccordion from "../Connect25/AwardsAccordion";

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

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "16px",
  flexWrap: "wrap",
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 600,
  color: "#333333",
  flexShrink: 0,
}));

const ContactNote = styled(Alert)(({ theme }) => ({
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: 500,
  backgroundColor: "#fff3cd",
  color: "#856404",
  border: "1px solid #ffeaa7",
  borderRadius: "6px",
  "& .MuiAlert-icon": {
    fontSize: "16px",
    alignItems: "center",
    marginRight: "8px",
  },
  "& .MuiAlert-message": {
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    padding: "6px 12px",
  },
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  borderBottom: "2px solid #e4e6ef",
  marginTop: "8px",
  backgroundColor: "transparent",
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
  // backgroundColor: "#f8f9fa",
}));

// Content area wrapper
const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "hidden",
}));

// Skeleton components
const SkeletonTabsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  borderBottom: "2px solid #e4e6ef",
  marginTop: "8px",
  backgroundColor: "transparent",
  maxWidth: "100%",
  minHeight: "50px",
}));

const SkeletonTab = styled(Box)(({ theme }) => ({
  padding: "10px 20px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexShrink: 0,
}));

const LoadingSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <PageLayout>
      <ZohoTopBar>
        <Container maxWidth="xl">
          <HeaderTitle>Student Management</HeaderTitle>

          {/* Desktop Tabs Skeleton */}
          {!isMobile && (
            <SkeletonTabsContainer>
              {[1, 2, 3].map((index) => (
                <SkeletonTab key={index}>
                  <Skeleton
                    variant="text"
                    width={Math.random() * 50 + 80}
                    height={20}
                    sx={{ borderRadius: "4px" }}
                  />
                  <Skeleton variant="circular" width={14} height={14} />
                </SkeletonTab>
              ))}
            </SkeletonTabsContainer>
          )}

          {/* Mobile Dropdown Skeleton */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton
                variant="rounded"
                width={200}
                height={40}
                sx={{ borderRadius: "6px" }}
              />
            </Box>
          )}
        </Container>
      </ZohoTopBar>

      {/* Content Area Skeleton */}
      <ContentWrapper>
        <ContentContainer>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Header skeleton */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton variant="rectangular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>

            {/* Card skeletons */}
            {[1, 2, 3].map((index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width="30%" height={24} />
                </Box>
                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={20}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Skeleton variant="rounded" width={80} height={32} />
                  <Skeleton variant="rounded" width={100} height={32} />
                </Box>
              </Paper>
            ))}

            {/* Table skeleton */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Skeleton variant="text" width="25%" height={28} />
                <Box sx={{ flex: 1 }} />
                <Skeleton variant="rounded" width={120} height={36} />
              </Box>

              {/* Table header */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid #e4e6ef",
                }}
              >
                {[1, 2, 3, 4].map((col) => (
                  <Box key={col} sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={20} />
                  </Box>
                ))}
              </Box>

              {/* Table rows */}
              {[1, 2, 3, 4, 5].map((row) => (
                <Box key={row} sx={{ display: "flex", gap: 2, mb: 2, py: 1 }}>
                  {[1, 2, 3, 4].map((col) => (
                    <Box key={col} sx={{ flex: 1 }}>
                      <Skeleton
                        variant="text"
                        width={Math.random() * 30 + 50 + "%"}
                        height={20}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Paper>

            {/* Stats cards skeleton */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {[1, 2, 3, 4].map((index) => (
                <Paper
                  key={index}
                  sx={{
                    flex: 1,
                    minWidth: 200,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={24} />
                      <Skeleton variant="text" width="60%" height={32} />
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </ContentContainer>
      </ContentWrapper>
    </PageLayout>
  );
};

// Component
const ConnectUser = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State for popover menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);

  // State for user authorization
  const [userAuth, setUserAuth] = useState(null);

  // State for payment status
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);

  // State for active setting - will be set after payment status is loaded
  const [activeSetting, setActiveSetting] = useState(null);

  // Get authorization from localStorage on component mount
  useEffect(() => {
    try {
      const authValue = localStorage.getItem("Authorise");
      setUserAuth(authValue);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setUserAuth(null);
    }
  }, []);

  // Fetch payment status from API
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      setIsLoadingPayment(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/internship/registration-info`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPaymentStatus(response.data.payment_status);
      } catch (error) {
        console.error("Error fetching payment status:", error);
      } finally {
        setIsLoadingPayment(false);
      }
    };

    fetchPaymentStatus();
  }, []);

  // Base menu items
  const baseMenuItems = [
    {
      id: "registration",
      label: "Registration",
      tooltip: "Register Here for Connect'25",
    },
    {
      id: "awards",
      label: "Awards",
      tooltip: "Coming Soon! This section will be available soon.",
    },
    {
      id: "agenda",
      label: "Agenda",
      tooltip: "Coming Soon! This section will be available soon.",
    },
  ];

  // Filter menu items based on user authorization and payment status
  const menuItems = baseMenuItems.filter((item) => {
    // Show registration if payment_status is NOT null
    if (item.id === "registration") {
      return paymentStatus !== null && paymentStatus !== undefined;
    }

    // Hide report section if user authorization is "leaders"
    if (item.id === "report" && userAuth === "leaders") {
      return false;
    }

    return true;
  });

  // Update active setting when payment status changes or when initially loading
  useEffect(() => {
    // Only proceed if payment status has been loaded (not loading)
    if (!isLoadingPayment) {
      if (activeSetting === null) {
        // Initial load - prioritize registration if available
        const registrationAvailable =
          paymentStatus !== null && paymentStatus !== undefined;
        if (registrationAvailable) {
          setActiveSetting("registration");
        } else if (menuItems.length > 0) {
          setActiveSetting(menuItems[0].id);
        }
      } else {
        // Check if current setting is still available
        const isCurrentSettingAvailable = menuItems.some(
          (item) => item.id === activeSetting
        );

        if (!isCurrentSettingAvailable && menuItems.length > 0) {
          // If current setting is not available, prioritize registration if available
          const registrationAvailable =
            paymentStatus !== null && paymentStatus !== undefined;
          if (registrationAvailable) {
            setActiveSetting("registration");
          } else {
            setActiveSetting(menuItems[0].id);
          }
        }
      }
    }
  }, [menuItems, activeSetting, isLoadingPayment, paymentStatus]);

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
      case "registration":
        return <ConferenceApp />;
      case "awards":
        return <AwardsAccordion />;
      case "agenda":
        return <ComingSoonPage />;
      default:
        return null;
    }
  };

  // Show loading skeleton while fetching payment status or if activeSetting is not set
  if (isLoadingPayment || activeSetting === null) {
    return <LoadingSkeleton />;
  }

  return (
    <PageLayout>
      <ZohoTopBar>
        <Container maxWidth="xl">
          <HeaderContainer>
            <HeaderTitle>Student Management</HeaderTitle>
            {/* Show contact note when payment status is null */}
            {paymentStatus === null && (
              <ContactNote icon={<ContactSupportIcon />} severity="warning">
                Contact your relationship manager for registration
              </ContactNote>
            )}
          </HeaderContainer>

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
          {isMobile && menuItems.length > 0 && activeSetting && (
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
      <ContentWrapper >
        <ContentContainer>{renderSettingComponent()}</ContentContainer>
      </ContentWrapper>
    </PageLayout>
  );
};

export default ConnectUser;
