import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  ThemeProvider,
  createTheme,
  Paper,
  LinearProgress,
  Stack,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  PersonOutline as PersonIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  PendingActions as PendingIcon,
} from "@mui/icons-material";

import education from "../../assets/imgs/vecteezy_three-people-talking-to-each-other-cartoon-style_48035375.png";
import FDPParticipantsView from "./FDPParticipants";
// Import the participants view component

// Create custom theme with Material blue gradients
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
      gradient: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
    },
    secondary: {
      main: "#03a9f4",
      light: "#4fc3f7",
      dark: "#0288d1",
      contrastText: "#fff",
      gradient: "linear-gradient(135deg, #29b6f6 0%, #0277bd 100%)",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      gradient: "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
    },
    warning: {
      main: "#f0ad4e",
      light: "#ffca28",
      dark: "#ef6c00",
      gradient: "linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 3px 6px 0 rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeSmall: {
          padding: "4px 8px",
          fontSize: "0.75rem",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 36,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 36,
          textTransform: "none",
          fontSize: "0.875rem",
          fontWeight: 500,
        },
      },
    },
  },
});

// Mock data for FDP cards
const mockFdpData = [
  {
    id: 1,
    title: "Web Development with React",
    startDate: "2025-05-15",
    endDate: "2025-05-17",
    location: "Engineering Block, Room 302",
    seats: 30,
    enrolledParticipants: 18,
    organizer: "Dr. Sarah Johnson",
    status: "published",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    startDate: "2025-05-22",
    endDate: "2025-05-24",
    location: "Computer Science Building, Lab 101",
    seats: 25,
    enrolledParticipants: 20,
    organizer: "Prof. Michael Chen",
    status: "published",
  },
  {
    id: 3,
    title: "Cloud Computing Workshop",
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    location: "Technology Center, Conference Room A",
    seats: 40,
    enrolledParticipants: 15,
    organizer: "Dr. Amanda Williams",
    status: "published",
  },
  {
    id: 4,
    title: "Database Design and Implementation",
    startDate: "2025-06-18",
    endDate: "2025-06-20",
    location: "Engineering Block, Room 205",
    seats: 30,
    enrolledParticipants: 8,
    organizer: "Prof. Robert Davis",
    status: "unpublished",
  },
  {
    id: 5,
    title: "Cybersecurity Essentials",
    startDate: "2025-07-08",
    endDate: "2025-07-10",
    location: "Computer Science Building, Lab 203",
    seats: 25,
    enrolledParticipants: 0,
    organizer: "Dr. James Wilson",
    status: "unpublished",
  },
];

// Format date for display
const formatDateRange = (startDate, endDate) => {
  const options = { month: "short", day: "numeric" };
  const start = new Date(startDate).toLocaleDateString("en-US", options);
  const end = new Date(endDate).toLocaleDateString("en-US", options);
  return `${start} - ${end}`;
};

// FDP Management component
const FDPManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [bannerImage, setBannerImage] = useState(null);
  const [selectedFdp, setSelectedFdp] = useState(null);
  const [viewParticipants, setViewParticipants] = useState(false);

  useEffect(() => {
    // In a real application, you might handle image loading errors
    // This is a placeholder for the local image path usage
    setBannerImage(education);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewFdp = (fdp) => {
    setSelectedFdp(fdp);
    setViewParticipants(true);
  };

  const handleBackToFdpList = () => {
    setViewParticipants(false);
    setSelectedFdp(null);
  };

  const publishedFdps = mockFdpData.filter((fdp) => fdp.status === "published");
  const unpublishedFdps = mockFdpData.filter(
    (fdp) => fdp.status === "unpublished"
  );

  // Render participant view when a card is clicked
  if (viewParticipants && selectedFdp) {
    return (
      <FDPParticipantsView
        fdpId={selectedFdp.id}
        onBack={handleBackToFdpList}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {/* UPDATED BANNER WITH SIDE IMAGE */}
      <Box
        sx={{
          position: "relative",
          height: 180,
          width: "100%",
          maxWidth: "1500px",
          mx: "auto",
          mt: 4,
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Gradient Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, rgba(21, 101, 192, 0.9), rgba(33, 150, 243, 0.7))",
            zIndex: 1,
          }}
        />

        {/* Side Image with no background */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "auto",
            maxWidth: "40%",
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box
            component="img"
            src={bannerImage} // This uses your imported image
            alt="FDP Banner"
            sx={{
              height: "90%",
              objectFit: "contain",
              objectPosition: "center right",
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "65%", // Make room for the image on the right
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 4,
            zIndex: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Manage Activities
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255,255,255,0.9)",
              maxWidth: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            Create slots for all activities and manage them from one place.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "6px",
                px: 2.5,
                py: 1,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                "&:hover": {
                  background: "rgba(255,255,255,0.3)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                },
              }}
            >
              Create Slots
            </Button>
          </Box>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          pt: 2.5,
          maxWidth: "1500px",
          mx: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <Box sx={{ mt: 1, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="standard"
            aria-label="FDP status tabs"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                background: theme.palette.primary.gradient,
              },
              "& .MuiTab-root": {
                fontWeight: 600,
                mx: 1,
                "&.Mui-selected": {
                  color: "primary.dark",
                },
                "&:first-of-type": {
                  ml: 0,
                },
              },
            }}
          >
            <Tab
              label="Published"
              icon={<CheckIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label="Unpublished"
              icon={<PendingIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box sx={{ display: tabValue === 0 ? "block" : "none" }}>
          <Grid container spacing={2.5}>
            {publishedFdps.map((fdp) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fdp.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    width: "100%",
                    maxWidth: 300,
                    mx: "auto",
                    overflow: "hidden",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 20px rgba(25, 118, 210, 0.15)",
                      cursor: "pointer", // Add pointer cursor to indicate clickable
                    },
                  }}
                  onClick={() => handleViewFdp(fdp)} // Add click handler to the entire card
                >
                  <Box
                    sx={{
                      height: 8,
                      width: "100%",
                      background: theme.palette.primary.gradient,
                    }}
                  />
                  <CardContent sx={{ p: 2.5, pb: 1.5, flexGrow: 1 }}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="h6"
                            gutterBottom
                            noWrap
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: "#1e293b",
                              mb: 0.5,
                            }}
                          >
                            {fdp.title}
                          </Typography>
                          <Chip
                            size="small"
                            color="primary"
                            icon={<CheckIcon sx={{ fontSize: "0.75rem" }} />}
                            label="Published"
                            sx={{
                              height: 20,
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "0.65rem",
                              },
                              background: theme.palette.primary.gradient,
                            }}
                          />
                        </Stack>
                      </Box>

                      <Stack spacing={1}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                        >
                          <CalendarIcon
                            sx={{ fontSize: "0.875rem", color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatDateRange(fdp.startDate, fdp.endDate)}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                        >
                          <PersonIcon
                            sx={{ fontSize: "0.875rem", color: "primary.main" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {fdp.organizer}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                        >
                          <LocationIcon
                            sx={{ fontSize: "0.875rem", color: "primary.main" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {fdp.location}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack spacing={0.75}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem", color: "#475569" }}
                          >
                            Enrollment: {fdp.enrolledParticipants}/{fdp.seats}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              bgcolor: "rgba(25, 118, 210, 0.1)",
                              color: "primary.dark",
                            }}
                          >
                            {Math.round(
                              (fdp.enrolledParticipants / fdp.seats) * 100
                            )}
                            %
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={(fdp.enrolledParticipants / fdp.seats) * 100}
                          sx={{
                            height: 5,
                            borderRadius: 2,
                            bgcolor: "rgba(0,0,0,0.05)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                              background: theme.palette.primary.gradient,
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>

                  <CardActions
                    sx={{
                      px: 2.5,
                      pt: 1,
                      pb: 2,
                      justifyContent: "flex-end",
                      mt: "auto",
                    }}
                  >
                    {/* <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        minWidth: "80px",
                        borderRadius: 1.5,
                        borderColor: "rgba(25, 118, 210, 0.5)",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "rgba(25, 118, 210, 0.04)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                      }}
                    >
                      Edit
                    </Button> */}
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        minWidth: "80px",
                        borderRadius: 1.5,
                        ml: 1,
                        background: theme.palette.primary.gradient,
                        boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
                        "&:hover": {
                          background: theme.palette.primary.gradient,
                          boxShadow: "0 4px 8px rgba(25, 118, 210, 0.4)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                        handleViewFdp(fdp);
                      }}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {publishedFdps.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No published FDPs found
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: tabValue === 1 ? "block" : "none" }}>
          <Grid container spacing={2.5}>
            {unpublishedFdps.map((fdp) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fdp.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    width: "100%",
                    maxWidth: 300,
                    mx: "auto",
                    overflow: "hidden",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      cursor: "pointer", // Add pointer cursor to indicate clickable
                    },
                  }}
                  onClick={() => handleViewFdp(fdp)} // Add click handler to the entire card
                >
                  <Box
                    sx={{
                      height: 8,
                      width: "100%",
                      background: theme.palette.warning.gradient,
                    }}
                  />
                  <CardContent sx={{ p: 2.5, pb: 1.5, flexGrow: 1 }}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="h6"
                            gutterBottom
                            noWrap
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: "#1e293b",
                              mb: 0.5,
                            }}
                          >
                            {fdp.title}
                          </Typography>
                          <Chip
                            size="small"
                            icon={<PendingIcon sx={{ fontSize: "0.75rem" }} />}
                            label="Unpublished"
                            sx={{
                              height: 20,
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "0.65rem",
                              },
                              background: theme.palette.warning.gradient,
                              color: "white",
                            }}
                          />
                        </Stack>
                      </Box>

                      <Stack spacing={1}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                        >
                          <CalendarIcon
                            sx={{ fontSize: "0.875rem", color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatDateRange(fdp.startDate, fdp.endDate)}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                        >
                          <PersonIcon
                            sx={{ fontSize: "0.875rem", color: "primary.main" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {fdp.organizer}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                        >
                          <LocationIcon
                            sx={{ fontSize: "0.875rem", color: "primary.main" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {fdp.location}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack spacing={0.75}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem", color: "#475569" }}
                          >
                            Enrollment: {fdp.enrolledParticipants}/{fdp.seats}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              bgcolor: "rgba(25, 118, 210, 0.1)",
                              color: "primary.dark",
                            }}
                          >
                            {Math.round(
                              (fdp.enrolledParticipants / fdp.seats) * 100
                            )}
                            %
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={(fdp.enrolledParticipants / fdp.seats) * 100}
                          sx={{
                            height: 5,
                            borderRadius: 2,
                            bgcolor: "rgba(0,0,0,0.05)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                              background: theme.palette.warning.gradient,
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>

                  <CardActions
                    sx={{
                      px: 2.5,
                      pt: 1,
                      pb: 2,
                      justifyContent: "flex-end",
                      mt: "auto",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        minWidth: "80px",
                        borderRadius: 1.5,
                        borderColor: "rgba(25, 118, 210, 0.5)",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "rgba(25, 118, 210, 0.04)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      sx={{
                        minWidth: "80px",
                        borderRadius: 1.5,
                        ml: 1,
                        background: theme.palette.success.gradient,
                        boxShadow: "0 2px 6px rgba(46, 125, 50, 0.3)",
                        "&:hover": {
                          background: theme.palette.success.gradient,
                          boxShadow: "0 4px 8px rgba(46, 125, 50, 0.4)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                      }}
                    >
                      Publish
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {unpublishedFdps.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No unpublished FDPs found
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default FDPManagement;
