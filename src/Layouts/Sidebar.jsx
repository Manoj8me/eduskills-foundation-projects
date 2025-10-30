import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Drawer,
  Button,
  Tooltip,
  Stack,
  Chip,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import { MenuItems } from "./navConfig";
import LogoDark from "../assets/imgs/logo-dark.svg";
import LogoLight from "../assets/imgs/logo-dark.svg";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

const Item = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  isMobileView,
  setToggleDrawer,
  badge, // Added badge prop
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleSelection = () => {
    setSelected(title);
    if (isMobileView) {
      setToggleDrawer(false);
    }
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: selected === title ? "#0d47a1" : "#64748b",
        position: "relative",
      }}
      onClick={handleSelection}
      icon={icon}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography>{title}</Typography>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              height: "18px",
              fontSize: "10px",
              fontWeight: 600,
              backgroundColor: "#ff9800",
              color: "#fff",
              borderRadius: "4px",
              ml: 1,
              "& .MuiChip-label": {
                px: 0.5,
              },
            }}
          />
        )}
      </Box>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ toggleDrawer, setToggleDrawer }) => {
  const menuItems = MenuItems();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const isActiveRole = useSelector((state) => state.authorise.userRole);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth < theme.breakpoints.values.lg
  );

  const [showFeedbackTooltip, setShowFeedbackTooltip] = useState(false);

  useEffect(() => {
    const selectedItem = menuItems.find((nav) => nav.path === currentPath);
    setSelected(selectedItem?.title);
  }, [currentPath, menuItems]);

  // Replace the selection useEffect hooks in Sidebar.js with this:

  useEffect(() => {
    let selectedTitle = "Dashboard"; // Default fallback

    // Create a flat array of all menu items (parent and children)
    const allMenuItems = [];

    menuItems.forEach((item) => {
      allMenuItems.push(item);
      if (item.children) {
        item.children.forEach((child) => {
          allMenuItems.push(child);
        });
      }
    });

    // Find exact path match, prioritizing child items over parent items
    const childMatch = allMenuItems.find(
      (item) => item.parent && item.path === currentPath
    );

    const parentMatch = allMenuItems.find(
      (item) => !item.parent && item.path === currentPath
    );

    if (childMatch) {
      selectedTitle = childMatch.title;
    } else if (parentMatch) {
      selectedTitle = parentMatch.title;
    }

    setSelected(selectedTitle);
  }, [currentPath, menuItems]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < theme.breakpoints.values.lg);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme.breakpoints.values.lg]);

  const handleFeedbackClick = () => {
    localStorage.setItem("hasProvidedFeedback", "true");
    // You can also navigate to the feedback page here
    navigate("/feedback");
  };

  const handleSubscriptionClick = () => {
    navigate("/subscription");
  };

  useEffect(() => {
    // Show the tooltip 5 seconds after the dashboard is opened
    const openTooltipTimeout = setTimeout(() => {
      setShowFeedbackTooltip(true);
    }, 5000);

    // Close the tooltip 10 seconds after opening
    const closeTooltipTimeout = setTimeout(() => {
      setShowFeedbackTooltip(false);
    }, 15000);

    // Cleanup timeouts when the component unmounts
    return () => {
      clearTimeout(openTooltipTimeout);
      clearTimeout(closeTooltipTimeout);
    };
  }, []);

  const feedbackMessages = [
    "Share Your Thoughts",
    "Your Feedback Matters",
    "We Value Your Input",
    // "Help Us Improve",
    "Click to Give Feedback",
  ];

  const randomMessage =
    feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];

  const feedbackButtonLabel =
    localStorage.getItem("hasProvidedFeedback") === "true"
      ? randomMessage
      : null;

  // Modern white theme colors
  const sidebarBg = "#ffffff";
  const headerBg = "#f8fafc";
  const textPrimary = "#1e293b";
  const textSecondary = "#64748b";
  const activeColor = "#0d47a1"; // Deeper blue
  const hoverBg = "#d1e7fd"; // Deeper blue background for both hover and active
  const activeBg = "#d1e7fd"; // Same as hover for consistency
  const borderColor = "#e2e8f0";

  const SidebarContent = (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${sidebarBg} !important`,
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          borderRight: `1px solid ${borderColor}`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          color: `${textSecondary} !important`,
        },
        "& .pro-inner-item": {
          p: "12px 20px !important",
          color: `${textSecondary} !important`,
          borderRadius: "8px",
          // margin: "2px 8px",
          fontSize: "14px",
          fontWeight: 500,
        },
        "& .pro-inner-item:hover": {
          color: `${activeColor} !important`,
          backgroundColor: `${hoverBg} !important`,
          borderLeft: `3px solid ${activeColor}`,
          transition: "all 0.2s ease-out",
        },
        "& .pro-menu-item.active": {
          color: `${activeColor} !important`,
          backgroundColor: `${activeBg} !important`,
          borderLeft: `3px solid ${activeColor}`,
          borderRadius: `8px`,
          margin: "2px 8px",
          fontWeight: 600,
        },
        "& .pro-menu-item .pro-icon": {
          color: `${textSecondary} !important`,
          fontSize: "18px",
        },
        "& .pro-menu-item:hover .pro-icon": {
          color: `${activeColor} !important`,
        },
        "& .pro-menu-item.active .pro-icon": {
          color: `${activeColor} !important`,
        },
        "& .pro-item-content": {
          color: `${textSecondary} !important`,
        },
        "& .pro-sub-menu": {
          backgroundColor: `${sidebarBg} !important`,
        },
        "& .pro-sub-menu .pro-inner-item": {
          // paddingLeft: "40px !important",
          fontSize: "13px",
        },
        "& .pro-arrow": {
          color: `${textSecondary} !important`,
        },
        "& .pro-menu": {
          color: `${textSecondary} !important`,
          paddingTop: "16px",
        },
        "& .logo": {
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: headerBg,
          borderBottom: `1px solid ${borderColor}`,
        },
        "& .logo img": {
          height: "80px",
          padding: "20px",
          transition: "all 0.3s ease-out",
          filter: "brightness(0.8)",
        },
        bgcolor: `${sidebarBg} !important`,
        height: "100vh",
      }}
    >
      <Box
        sx={{
          [theme.breakpoints.down("lg")]: {
            display: "block",
          },
          height: "100%",
          background: `${sidebarBg} !important`,
        }}
      >
        <ProSidebar style={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: headerBg,
              position: "relative",
            }}
          >
            <Box className="logo">
              <img src={LogoLight} alt="Logo" />
            </Box>
            <Box
              sx={{
                p: "4px 8px",
                borderRadius: 2,
                mt: 2,
                fontSize: "10px",
                ml: -1,
                zIndex: 999,
                color: "#ffffff",
                bgcolor: activeColor,
                fontWeight: 700,
                boxShadow: "0 2px 4px rgba(25, 118, 210, 0.3)",
              }}
            >
              V1
            </Box>
          </Box>
          <Menu
            iconShape="square"
            style={{
              padding: "8px 0",
              height: "100%",
              color: textSecondary,
            }}
          >
            {menuItems?.map((nav, idx) => (
              <div key={idx}>
                {nav?.children ? (
                  <SubMenu
                    title={nav.title}
                    icon={nav.icon}
                    style={{
                      color: textSecondary,
                      fontWeight: 500,
                    }}
                  >
                    {nav?.children?.map((child, childIdx) => (
                      <Item
                        key={childIdx}
                        title={child.title}
                        to={child.path}
                        icon={child.icon}
                        selected={selected}
                        setSelected={setSelected}
                        setToggleDrawer={setToggleDrawer}
                        isMobileView={isMobileView}
                        badge={child.badge} // Pass badge to child items
                      />
                    ))}
                  </SubMenu>
                ) : (
                  <Item
                    title={nav.title}
                    to={nav.path}
                    icon={nav.icon}
                    selected={selected}
                    setSelected={setSelected}
                    setToggleDrawer={setToggleDrawer}
                    isMobileView={isMobileView}
                    badge={nav.badge} // Pass badge to parent items
                  />
                )}
              </div>
            ))}
          </Menu>
          {isActiveRole === "spoc" && (
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                borderTop: `1px solid ${borderColor}`,
                mt: "auto",
              }}
            >
              <Stack spacing={1}>
                {/* Subscription Button */}
                {/* <Button
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    color: textPrimary,
                    borderColor: borderColor,
                    backgroundColor: "transparent",
                    fontWeight: 500,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: hoverBg,
                      borderColor: activeColor,
                      color: activeColor,
                    },
                  }}
                  color={currentPath === "/subscription" ? "primary" : "inherit"}
                  variant="outlined"
                  startIcon={<Icon icon="mdi:crown-outline" />}
                  onClick={handleSubscriptionClick}
                >
                  Subscription
                </Button> */}

                {/* Feedback Button */}
                {/* <Tooltip
                  title={feedbackButtonLabel}
                  open={showFeedbackTooltip}
                  arrow
                >
                  <Button
                    sx={{
                      width: "100%",
                      textTransform: "none",
                      color: textPrimary,
                      borderColor: borderColor,
                      backgroundColor: "transparent",
                      fontWeight: 500,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: hoverBg,
                        borderColor: activeColor,
                        color: activeColor,
                      },
                    }}
                    color={currentPath === "/feedback" ? "primary" : "inherit"}
                    variant="outlined"
                    startIcon={
                      <Icon icon="fluent:person-feedback-16-regular" />
                    }
                    onClick={handleFeedbackClick}
                  >
                    Feedback
                  </Button>
                </Tooltip> */}
              </Stack>
            </Box>
          )}
        </ProSidebar>
      </Box>
    </Box>
  );

  return (
    <Box>
      {isMobileView ? (
        <Drawer
          variant="temporary"
          anchor="left"
          open={toggleDrawer}
          onClose={() => setToggleDrawer(false)}
          PaperProps={{
            sx: {
              boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            },
          }}
        >
          {SidebarContent}
        </Drawer>
      ) : (
        SidebarContent
      )}
    </Box>
  );
};

export default Sidebar;
