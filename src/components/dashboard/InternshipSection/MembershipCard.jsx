import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";

const AnnouncementCarousel = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(true);

  // Multiple announcements
  const announcements = [
    {
      id: 1,
      title: "New Features Released",
      shortDescription:
        "We've added 5 exciting new tools to enhance your experience!",
      fullDescription:
        "We're thrilled to announce our latest feature release including advanced analytics dashboard, custom reporting tools, team collaboration workspace, integration with popular third-party apps, and AI-powered content suggestions. These features are designed to streamline your workflow and boost productivity.",
      timeRemaining: { days: 5 },
      isNew: true,
    },
    {
      id: 2,
      title: "Upcoming Maintenance",
      shortDescription: "Scheduled maintenance on April 10th from 2-4am EST",
      fullDescription:
        "We'll be performing essential system maintenance to improve performance and reliability. During this time, the platform may experience brief periods of downtime. We've scheduled this during low-usage hours to minimize disruption. All your data will remain secure, and no action is required on your part.",
      timeRemaining: { days: 3 },
      isNew: true,
    },
    {
      id: 3,
      title: "Special Discount Offer",
      shortDescription:
        "Upgrade to Premium and get 30% off for the first year!",
      fullDescription:
        "For a limited time, we're offering an exclusive discount on our Premium subscription. Upgrade now to unlock all premium features including priority support, advanced customization options, and unlimited storage. This offer is available for both new and existing users.",
      timeRemaining: { days: 7 },
      isNew: false,
    },
  ];

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  // Blinking effect for "What's New" indicator
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 800);

    return () => clearInterval(blinkInterval);
  }, []);

  // Function to navigate between announcements
  const navigateAnnouncement = (direction) => {
    if (direction === "next") {
      setCurrentAnnouncementIndex((prev) =>
        prev === announcements.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentAnnouncementIndex((prev) =>
        prev === 0 ? announcements.length - 1 : prev - 1
      );
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Variants for smooth animation
  const containerVariants = {
    collapsed: {
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
    expanded: {
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const contentVariants = {
    collapsed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.3 },
    },
    expanded: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  return (
    <Card
      component={motion.div}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      layout
      layoutRoot
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Gradient background with improved color balance */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, #0288D1 0%, #039BE5 50%, #4FC3F7 100%)",
          zIndex: 0,
        }}
      />

      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "30%",
          height: "100%",
          opacity: 0.05,
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="white" /></svg>')`,
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      {/* Content - Collapsible Layout */}
      <Box
        component={motion.div}
        layout
        sx={{
          px: 3,
          pt: 2,
          pb: isExpanded ? 3 : 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Row */}
        <Box
          component={motion.div}
          layout
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: isExpanded ? 2 : 0,
          }}
        >
          {/* Left side - Icon and announcement title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 45,
                height: 45,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2.5,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                position: "relative",
              }}
            >
              <Icon icon="mdi:bullhorn" color="white" width={28} height={28} />

              {/* "What's New" blinking indicator */}
              {currentAnnouncement.isNew && (
                <Box
                  component={motion.div}
                  animate={{
                    scale: isBlinking ? 1 : 0.9,
                    opacity: isBlinking ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.4 }}
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    bgcolor: "#FF5252",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    letterSpacing: "0.5px",
                  }}
                >
                  New
                </Box>
              )}
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Announcement
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.7rem",
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                  }}
                >
                  {currentAnnouncementIndex + 1}/{announcements.length}
                </Typography>
              </Typography>
              <Typography
                component={motion.h6}
                layout
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                {currentAnnouncement.title}
              </Typography>
            </Box>
          </Box>

          {/* Right side - Time remaining and navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Time remaining indicator */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 6,
                py: 1,
                px: 2,
                background:
                  "linear-gradient(90deg, rgba(2,136,209,0.5) 0%, rgba(3,155,229,0.3) 100%)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <Icon
                icon="clarity:clock-solid"
                width={16}
                height={16}
                color="rgba(255, 255, 255, 1)"
                style={{ marginRight: 6 }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "white",
                  whiteSpace: "nowrap",
                  fontSize: "0.8rem",
                }}
              >
                {currentAnnouncement.timeRemaining.days}{" "}
                {currentAnnouncement.timeRemaining.days === 1 ? "Day" : "Days"}
              </Typography>
            </Box>

            {/* Carousel navigation buttons */}
            <Box sx={{ display: "flex" }}>
              <IconButton
                size="small"
                onClick={() => navigateAnnouncement("prev")}
                sx={{
                  color: "white",
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Icon icon="mdi:chevron-left" width={20} height={20} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => navigateAnnouncement("next")}
                sx={{
                  color: "white",
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Icon icon="mdi:chevron-right" width={20} height={20} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Collapsible Content */}
        <Box component={motion.div} layout>
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key={`short-${currentAnnouncement.id}`}
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                style={{ marginTop: 12 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {currentAnnouncement.shortDescription}
                </Typography>
              </motion.div>
            ) : (
              <motion.div
                key={`full-${currentAnnouncement.id}`}
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    mb: 3,
                    lineHeight: 1.6,
                    mt: 2,
                  }}
                >
                  {currentAnnouncement.fullDescription}
                </Typography>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "white",
                      color: "#0288D1",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)",
                      },
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(255,255,255,0.7)",
                      color: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                      fontWeight: 500,
                    }}
                  >
                    Dismiss
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Expand/Collapse Button */}
        <Box
          component={motion.div}
          layout
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            onClick={toggleExpand}
            size="small"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
            endIcon={
              <Icon
                icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                width={20}
                height={20}
              />
            }
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default AnnouncementCarousel;
