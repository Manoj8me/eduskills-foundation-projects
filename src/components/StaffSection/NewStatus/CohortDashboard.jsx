import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Skeleton,
  Fade,
  Grow,
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WorkIcon from "@mui/icons-material/Work";
import CancelIcon from "@mui/icons-material/Cancel";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Styled components
const CohortButton = styled(Button)(({ theme, isActive }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  padding: "2px 3px",
  minWidth: "auto",
  borderRadius: "4px",
  marginRight: "6px",
  color: isActive ? "white" : "#0277bd",
  backgroundColor: isActive ? "#0277bd" : "transparent",
  border: isActive ? "none" : "none",
  "&:hover": {
    backgroundColor: isActive ? "#01579b" : "rgba(2, 119, 189, 0.08)",
  },
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  padding: 4,
  color: "#0277bd",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "rgba(2, 119, 189, 0.08)",
  },
}));

const StatusCard = styled(Card)(({ theme, statusColor }) => ({
  display: "flex",
  height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down("sm")]: {
    height: "70px",
  },
}));

const IconContainer = styled(Box)(({ statusColor, theme }) => ({
  backgroundColor: statusColor || "#1976d2",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "12px",
  borderRadius: "4px 0 0 4px",
  width: "48px",
  [theme.breakpoints.down("sm")]: {
    width: "36px",
    padding: "8px",
    "& svg": {
      fontSize: "1.2rem",
    },
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: "8px 16px",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: "4px 10px",
  },
}));

const CohortDashboard = () => {
  const [selectedCohort, setSelectedCohort] = useState("Cohort 12");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const menuRef = React.useRef(null);

  // Mock cohort data - increased to demonstrate scrolling with many cohorts
  const cohorts = Array.from({ length: 100 }, (_, i) => `Cohort ${100 - i}`);

  // Status configuration with icons and colors
  const statusConfig = {
    Applied: { icon: <PersonIcon />, color: "#0288d1" }, // Blue
    Approved: { icon: <CheckCircleIcon />, color: "#388e3c" }, // Green
    "Certificate Verified": { icon: <VerifiedIcon />, color: "#7b1fa2" }, // Purple
    "Assessment Completed": {
      icon: <AssignmentTurnedInIcon />,
      color: "#f57c00",
    }, // Orange
    "Internship Certificate Issued": { icon: <WorkIcon />, color: "#0097a7" }, // Teal
    Rejected: { icon: <CancelIcon />, color: "#d32f2f" }, // Red
  };

  // Simulate data fetching
  useEffect(() => {
    setLoading(true);

    // Mock API call delay
    const fetchData = setTimeout(() => {
      // Generate random stats for demonstration
      const mockStats = {
        Applied: Math.floor(Math.random() * 500) + 300,
        Approved: Math.floor(Math.random() * 300) + 200,
        "Certificate Verified": Math.floor(Math.random() * 250) + 150,
        "Assessment Completed": Math.floor(Math.random() * 200) + 100,
        "Internship Certificate Issued": Math.floor(Math.random() * 150) + 50,
        Rejected: Math.floor(Math.random() * 50) + 10,
      };

      setStats(mockStats);
      setLoading(false);
    }, 1200);

    // Clean up timeout
    return () => clearTimeout(fetchData);
  }, [selectedCohort]);

  const handleCohortChange = (cohort) => {
    setSelectedCohort(cohort);
  };

  // Improved scroll function for smoother scrolling
  const scrollLeft = () => {
    if (menuRef.current) {
      // Scroll by exactly one button width to ensure alignment
      const buttonWidth = menuRef.current.querySelector("button").offsetWidth;
      const newPosition = Math.max(0, scrollPosition - buttonWidth);

      menuRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setScrollPosition(newPosition);
    }
  };

  // Improved scroll function for smoother scrolling
  const scrollRight = () => {
    if (menuRef.current) {
      // Scroll by exactly one button width to ensure alignment
      const buttonWidth = menuRef.current.querySelector("button").offsetWidth;
      const maxScroll =
        menuRef.current.scrollWidth - menuRef.current.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + buttonWidth);

      menuRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setScrollPosition(newPosition);
    }
  };

  // Update scroll position when scrolling manually
  const handleScroll = () => {
    if (menuRef.current) {
      setScrollPosition(menuRef.current.scrollLeft);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener("scroll", handleScroll);
      return () => {
        menuElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <Box
      sx={{ maxWidth: "100%", margin: "0 auto", mt: 3, px: { xs: 1, sm: 2 } }}
    >
      {/* Custom horizontal menu with fixed width to show exactly 4 cohorts */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <ScrollButton
          size="small"
          onClick={scrollLeft}
          disabled={scrollPosition <= 0}
          sx={{
            mr: 1,
            visibility: scrollPosition <= 0 ? "hidden" : "visible",
          }}
        >
          <ChevronRightIcon sx={{ transform: "rotate(180deg)" }} />
        </ScrollButton>

        <Box
          ref={menuRef}
          sx={{
            display: "flex",
            overflowX: "hidden", // Hide overflow to show exactly 4 cohorts
            scrollbarWidth: "none", // Hide scrollbar for Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Chrome
            msOverflowStyle: "none", // Hide scrollbar for IE
            width: { xs: "280px", sm: "320px", md: "360px" }, // Width to fit exactly 4 cohorts
            transition: "transform 0.3s ease", // Smooth transition for scrolling
          }}
        >
          {cohorts.map((cohort) => (
            <CohortButton
              key={cohort}
              isActive={selectedCohort === cohort}
              onClick={() => handleCohortChange(cohort)}
              disableRipple
              disableElevation
              variant="outlined"
              sx={{
                flexShrink: 0, // Prevent button from shrinking
                width: { xs: "70px", sm: "80px", md: "90px" }, // Fixed width for each button
              }}
            >
              {cohort}
            </CohortButton>
          ))}
        </Box>

        <ScrollButton
          size="small"
          onClick={scrollRight}
          disabled={
            menuRef.current &&
            scrollPosition >=
              menuRef.current.scrollWidth - menuRef.current.clientWidth
          }
          sx={{
            ml: 1,
            visibility:
              menuRef.current &&
              scrollPosition >=
                menuRef.current.scrollWidth - menuRef.current.clientWidth
                ? "hidden"
                : "visible",
          }}
        >
          <ChevronRightIcon />
        </ScrollButton>
      </Box>

      <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        sx={{
          my: { xs: 2, sm: 2.5 },
          fontWeight: 500,
          fontSize: { xs: "1rem", sm: "1.25rem" },
        }}
      >
        {selectedCohort} Statistics
      </Typography>

      {loading ? (
        // Skeleton loader for cards
        <Grid container spacing={isMobile ? 1 : 2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={6} sm={4} md={4} lg={3} key={index}>
              <Skeleton
                variant="rectangular"
                height={isMobile ? 60 : 80}
                sx={{ borderRadius: "4px" }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Actual cards with animation
        <Fade in={!loading} timeout={500}>
          <Grid container spacing={isMobile ? 1 : 2}>
            {stats &&
              Object.entries(stats).map(([status, count], index) => {
                const { icon, color } = statusConfig[status] || {
                  icon: <PersonIcon />,
                  color: "#1976d2",
                };

                return (
                  <Grid item xs={6} sm={4} md={4} lg={3} key={status}>
                    <Grow
                      in={!loading}
                      timeout={(index + 1) * 200}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <StatusCard statusColor={color}>
                        <IconContainer statusColor={color}>
                          {icon}
                        </IconContainer>
                        <ContentContainer>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="right"
                            sx={{
                              width: "100%",
                              fontSize: { xs: "0.65rem", sm: "0.75rem" },
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {status.toUpperCase()}
                          </Typography>
                          <Typography
                            variant={isMobile ? "h5" : "h4"}
                            fontWeight={600}
                            color="text.primary"
                            align="right"
                            sx={{
                              width: "100%",
                              fontSize: {
                                xs: "1.5rem",
                                sm: "2rem",
                                md: "2.125rem",
                              },
                            }}
                          >
                            {count}
                          </Typography>
                        </ContentContainer>
                      </StatusCard>
                    </Grow>
                  </Grid>
                );
              })}
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default CohortDashboard;
