import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Chip,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Mail as MailIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";

// Import the same theme from the parent component
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
  },
  shape: {
    borderRadius: 6,
  },
});

// Mock data for participants
const mockParticipants = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@example.edu",
    department: "Computer Science",
    institute: "National Institute of Technology",
    attendance: {
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      day5: false,
      day6: true,
    },
    certificateIssued: true,
    profilePic: null,
  },
  {
    id: 2,
    name: "Prof. Priya Sharma",
    email: "priya.sharma@example.edu",
    department: "Electronics Engineering",
    institute: "Indian Institute of Technology",
    attendance: {
      day1: true,
      day2: true,
      day3: false,
      day4: true,
      day5: false,
      day6: true,
    },
    certificateIssued: false,
    profilePic: null,
  },
  {
    id: 3,
    name: "Dr. Anand Verma",
    email: "anand.verma@example.edu",
    department: "Information Technology",
    institute: "Delhi University",
    attendance: {
      day1: true,
      day2: false,
      day3: false,
      day4: true,
      day5: false,
      day6: false,
    },
    certificateIssued: false,
    profilePic: null,
  },
  {
    id: 4,
    name: "Dr. Sunita Patel",
    email: "sunita.patel@example.edu",
    department: "Computer Science",
    institute: "Amity University",
    attendance: {
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      day5: true,
      day6: true,
    },
    certificateIssued: true,
    profilePic: null,
  },
  {
    id: 5,
    name: "Prof. Ramesh Joshi",
    email: "ramesh.joshi@example.edu",
    department: "Electrical Engineering",
    institute: "BITS Pilani",
    attendance: {
      day1: false,
      day2: true,
      day3: true,
      day4: false,
      day5: true,
      day6: true,
    },
    certificateIssued: false,
    profilePic: null,
  },
  {
    id: 6,
    name: "Dr. Meena Gupta",
    email: "meena.gupta@example.edu",
    department: "Information Technology",
    institute: "Manipal University",
    attendance: {
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      day5: true,
      day6: false,
    },
    certificateIssued: true,
    profilePic: null,
  },
  {
    id: 7,
    name: "Prof. Arjun Singh",
    email: "arjun.singh@example.edu",
    department: "Computer Applications",
    institute: "SRM University",
    attendance: {
      day1: true,
      day2: false,
      day3: true,
      day4: false,
      day5: true,
      day6: false,
    },
    certificateIssued: false,
    profilePic: null,
  },
  {
    id: 8,
    name: "Dr. Kavita Desai",
    email: "kavita.desai@example.edu",
    department: "Computer Science",
    institute: "VIT University",
    attendance: {
      day1: true,
      day2: true,
      day3: false,
      day4: true,
      day5: false,
      day6: true,
    },
    certificateIssued: false,
    profilePic: null,
  },
];

// FDP details (could be passed from the parent component)
const fdpDetails = {
  id: 1,
  title: "Web Development with React",
  startDate: "2025-05-15",
  endDate: "2025-05-20", // Updated end date to accommodate 6 days
  location: "Engineering Block, Room 302",
  seats: 30,
  enrolledParticipants: 18,
  organizer: "Dr. Sarah Johnson",
  status: "published",
};

// Helper function to get initial letters for avatar
const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to get color based on attendance status
const getAttendanceColor = (isPresent) => {
  return isPresent ? theme.palette.success.main : theme.palette.error.main;
};

// Main Component for FDP Participants View
const FDPParticipantsView = ({ fdpId, onBack }) => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [participants, setParticipants] = useState([]);

  // In a real app, you would fetch the actual participant data based on fdpId
  useEffect(() => {
    // Simulate API call
    setParticipants(mockParticipants);
    // Select the first participant by default (if any exist)
    if (mockParticipants.length > 0) {
      setSelectedParticipant(mockParticipants[0]);
    }
  }, [fdpId]);

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
  };

  // Function to toggle attendance for a specific day
  const toggleAttendance = (participantId, day) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) => {
        if (participant.id === participantId) {
          // Create a new attendance object with the toggled value
          const updatedAttendance = {
            ...participant.attendance,
            [day]: !participant.attendance[day],
          };

          // If this is the selected participant, update that too
          if (selectedParticipant && selectedParticipant.id === participantId) {
            setSelectedParticipant({
              ...selectedParticipant,
              attendance: updatedAttendance,
            });
          }

          return {
            ...participant,
            attendance: updatedAttendance,
          };
        }
        return participant;
      })
    );
  };

  const calculateAttendancePercentage = (attendance) => {
    const days = Object.values(attendance);
    const present = days.filter((day) => day).length;
    return Math.round((present / days.length) * 100);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: "1200px",
          mx: "auto",
          mt: 3, // Add margin from top since it's within a layout with navbar/sidebar
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            size="small"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            {fdpDetails.title} - Participants
          </Typography>
          <Chip
            label={`${participants.length} Enrolled`}
            size="small"
            sx={{
              ml: 2,
              bgcolor: "rgba(25,118,210,0.1)",
              color: "primary.dark",
              fontWeight: 500,
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={1.5}>
          {/* Participants List - Left Side */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                height: "60vh",
                maxHeight: "60vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                  background: "rgba(25,118,210,0.02)",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0 }}>
                  Participants
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Select to view details
                </Typography>
              </Box>

              <List
                sx={{
                  overflow: "auto",
                  flexGrow: 1,
                  px: 0,
                }}
                dense
              >
                {participants.map((participant) => (
                  <ListItem
                    key={participant.id}
                    button
                    selected={
                      selectedParticipant &&
                      selectedParticipant.id === participant.id
                    }
                    onClick={() => handleParticipantSelect(participant)}
                    sx={{
                      borderLeft:
                        selectedParticipant &&
                        selectedParticipant.id === participant.id
                          ? `3px solid ${theme.palette.primary.main}`
                          : "3px solid transparent",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(25,118,210,0.04)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(25,118,210,0.08)",
                        "&:hover": {
                          backgroundColor: "rgba(25,118,210,0.12)",
                        },
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: participant.certificateIssued
                            ? "success.main"
                            : "primary.main",
                          width: 28,
                          height: 28,
                          fontSize: "0.75rem",
                        }}
                      >
                        {getInitials(participant.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            color: "#1e293b",
                          }}
                          noWrap
                        >
                          {participant.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.7rem" }}
                          noWrap
                        >
                          {participant.department}
                        </Typography>
                      }
                    />
                    {participant.certificateIssued && (
                      <Tooltip title="Certificate Issued">
                        <PdfIcon
                          fontSize="small"
                          sx={{ color: "success.main", ml: 1, opacity: 0.8 }}
                        />
                      </Tooltip>
                    )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Participant Details - Right Side */}
          <Grid item xs={12} md={8} lg={9}>
            {selectedParticipant ? (
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  height: "60vh",
                  overflow: "hidden", // Changed from auto to hidden
                  display: "flex",
                  flexDirection: "column", // Make it a flex column to control sections
                }}
              >
                {/* Header with participant name and info */}
                <Box
                  sx={{
                    p: 2,
                    background: "rgba(25,118,210,0.02)",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: "primary.main",
                          background: theme.palette.primary.gradient,
                          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        {getInitials(selectedParticipant.name)}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 600, mb: 0.25, fontSize: "1rem" }}
                      >
                        {selectedParticipant.name}
                      </Typography>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Chip
                          size="small"
                          icon={<SchoolIcon sx={{ fontSize: "0.7rem" }} />}
                          label={selectedParticipant.department}
                          sx={{
                            bgcolor: "rgba(25,118,210,0.08)",
                            color: "primary.dark",
                            height: 20,
                            "& .MuiChip-label": {
                              px: 1,
                              fontSize: "0.65rem",
                            },
                          }}
                        />

                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {selectedParticipant.institute}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item>
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-flex",
                            mb: 0.5,
                          }}
                        >
                          <CircularProgress
                            variant="determinate"
                            value={calculateAttendancePercentage(
                              selectedParticipant.attendance
                            )}
                            size={40}
                            thickness={4}
                            sx={{
                              color:
                                calculateAttendancePercentage(
                                  selectedParticipant.attendance
                                ) === 100
                                  ? "success.main"
                                  : calculateAttendancePercentage(
                                      selectedParticipant.attendance
                                    ) >= 75
                                  ? "primary.main"
                                  : "warning.main",
                            }}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: "absolute",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              component="div"
                              sx={{ fontWeight: 600, fontSize: "0.6rem" }}
                            >
                              {calculateAttendancePercentage(
                                selectedParticipant.attendance
                              )}
                              %
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 500, fontSize: "0.65rem" }}
                        >
                          Attendance
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Scrollable content area */}
                <Box
                  sx={{
                    p: 2,
                    overflow: "auto", // Only this box will scroll
                    flexGrow: 1, // Take remaining space
                  }}
                >
                  <Grid container spacing={2}>
                    {/* Contact Information Card */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={0}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          height: "100%",
                        }}
                      >
                        <CardContent
                          sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 1.5 }}
                          >
                            Contact Information
                          </Typography>

                          <Stack spacing={1.5}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: "rgba(25,118,210,0.1)",
                                }}
                              >
                                <MailIcon
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "primary.main",
                                  }}
                                />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.65rem", display: "block" }}
                                >
                                  Email
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: "0.75rem" }}
                                >
                                  {selectedParticipant.email}
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: "rgba(25,118,210,0.1)",
                                }}
                              >
                                <SchoolIcon
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "primary.main",
                                  }}
                                />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.65rem", display: "block" }}
                                >
                                  Department
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: "0.75rem" }}
                                >
                                  {selectedParticipant.department}
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: "rgba(25,118,210,0.1)",
                                }}
                              >
                                <BadgeIcon
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "primary.main",
                                  }}
                                />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.65rem", display: "block" }}
                                >
                                  Institute
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: "0.75rem" }}
                                >
                                  {selectedParticipant.institute}
                                </Typography>
                              </Box>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Attendance Card */}
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={0}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          height: "100%",
                        }}
                      >
                        <CardContent
                          sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1.5,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              Attendance Record
                            </Typography>

                            <Chip
                              size="small"
                              label="Mark Attendance"
                              color="primary"
                              sx={{
                                fontSize: "0.6rem",
                                height: 20,
                                background: theme.palette.primary.gradient,
                              }}
                            />
                          </Box>

                          {/* Attendance scrollable section */}
                          <Box
                            sx={{
                              maxHeight: "180px",
                              overflowY: "auto",
                              pr: 1,
                              // Custom scrollbar styling
                              "&::-webkit-scrollbar": {
                                width: "8px",
                              },
                              "&::-webkit-scrollbar-track": {
                                backgroundColor: "rgba(0,0,0,0.05)",
                                borderRadius: "4px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(0,0,0,0.15)",
                                borderRadius: "4px",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.25)",
                                },
                              },
                            }}
                          >
                            <Stack spacing={1.5}>
                              {/* Day 1 */}
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: selectedParticipant.attendance.day1
                                      ? "rgba(46,125,50,0.1)"
                                      : "rgba(211,47,47,0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                  onClick={() =>
                                    toggleAttendance(
                                      selectedParticipant.id,
                                      "day1"
                                    )
                                  }
                                >
                                  {selectedParticipant.attendance.day1 ? (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "success.main",
                                      }}
                                    />
                                  ) : (
                                    <CloseIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "error.main",
                                      }}
                                    />
                                  )}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.65rem",
                                      display: "block",
                                    }}
                                  >
                                    Day 1 - May 15, 2025
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: getAttendanceColor(
                                        selectedParticipant.attendance.day1
                                      ),
                                      fontWeight: 500,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {selectedParticipant.attendance.day1
                                      ? "Present"
                                      : "Absent"}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        ml: 0.5,
                                        color: "text.secondary",
                                        fontSize: "0.6rem",
                                        opacity: 0.7,
                                      }}
                                    >
                                      (click to toggle)
                                    </Typography>
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* Day 2 */}
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: selectedParticipant.attendance.day2
                                      ? "rgba(46,125,50,0.1)"
                                      : "rgba(211,47,47,0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                  onClick={() =>
                                    toggleAttendance(
                                      selectedParticipant.id,
                                      "day2"
                                    )
                                  }
                                >
                                  {selectedParticipant.attendance.day2 ? (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "success.main",
                                      }}
                                    />
                                  ) : (
                                    <CloseIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "error.main",
                                      }}
                                    />
                                  )}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.65rem",
                                      display: "block",
                                    }}
                                  >
                                    Day 2 - May 16, 2025
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: getAttendanceColor(
                                        selectedParticipant.attendance.day2
                                      ),
                                      fontWeight: 500,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {selectedParticipant.attendance.day2
                                      ? "Present"
                                      : "Absent"}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        ml: 0.5,
                                        color: "text.secondary",
                                        fontSize: "0.6rem",
                                        opacity: 0.7,
                                      }}
                                    >
                                      (click to toggle)
                                    </Typography>
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* Day 3 */}
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: selectedParticipant.attendance.day3
                                      ? "rgba(46,125,50,0.1)"
                                      : "rgba(211,47,47,0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      boxShadow: "0 1px 3px rgba0,0,0,0.1)",
                                    },
                                  }}
                                  onClick={() =>
                                    toggleAttendance(
                                      selectedParticipant.id,
                                      "day3"
                                    )
                                  }
                                >
                                  {selectedParticipant.attendance.day3 ? (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "success.main",
                                      }}
                                    />
                                  ) : (
                                    <CloseIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "error.main",
                                      }}
                                    />
                                  )}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.65rem",
                                      display: "block",
                                    }}
                                  >
                                    Day 3 - May 17, 2025
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: getAttendanceColor(
                                        selectedParticipant.attendance.day3
                                      ),
                                      fontWeight: 500,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {selectedParticipant.attendance.day3
                                      ? "Present"
                                      : "Absent"}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        ml: 0.5,
                                        color: "text.secondary",
                                        fontSize: "0.6rem",
                                        opacity: 0.7,
                                      }}
                                    >
                                      (click to toggle)
                                    </Typography>
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* Day 4 - New */}
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: selectedParticipant.attendance.day4
                                      ? "rgba(46,125,50,0.1)"
                                      : "rgba(211,47,47,0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                  onClick={() =>
                                    toggleAttendance(
                                      selectedParticipant.id,
                                      "day4"
                                    )
                                  }
                                >
                                  {selectedParticipant.attendance.day4 ? (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "success.main",
                                      }}
                                    />
                                  ) : (
                                    <CloseIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "error.main",
                                      }}
                                    />
                                  )}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.65rem",
                                      display: "block",
                                    }}
                                  >
                                    Day 4 - May 18, 2025
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: getAttendanceColor(
                                        selectedParticipant.attendance.day4
                                      ),
                                      fontWeight: 500,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {selectedParticipant.attendance.day4
                                      ? "Present"
                                      : "Absent"}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        ml: 0.5,
                                        color: "text.secondary",
                                        fontSize: "0.6rem",
                                        opacity: 0.7,
                                      }}
                                    >
                                      (click to toggle)
                                    </Typography>
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* Day 5 - New */}
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: selectedParticipant.attendance.day5
                                      ? "rgba(46,125,50,0.1)"
                                      : "rgba(211,47,47,0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                  onClick={() =>
                                    toggleAttendance(
                                      selectedParticipant.id,
                                      "day5"
                                    )
                                  }
                                >
                                  {selectedParticipant.attendance.day5 ? (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "success.main",
                                      }}
                                    />
                                  ) : (
                                    <CloseIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "error.main",
                                      }}
                                    />
                                  )}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.65rem",
                                      display: "block",
                                    }}
                                  >
                                    Day 5 - May 19, 2025
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: getAttendanceColor(
                                        selectedParticipant.attendance.day5
                                      ),
                                      fontWeight: 500,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {selectedParticipant.attendance.day5
                                      ? "Present"
                                      : "Absent"}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        ml: 0.5,
                                        color: "text.secondary",
                                        fontSize: "0.6rem",
                                        opacity: 0.7,
                                      }}
                                    >
                                      (click to toggle)
                                    </Typography>
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* Day 6 - New */}
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: selectedParticipant.attendance.day6
                                      ? "rgba(46,125,50,0.1)"
                                      : "rgba(211,47,47,0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                  onClick={() =>
                                    toggleAttendance(
                                      selectedParticipant.id,
                                      "day6"
                                    )
                                  }
                                >
                                  {selectedParticipant.attendance.day6 ? (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "success.main",
                                      }}
                                    />
                                  ) : (
                                    <CloseIcon
                                      sx={{
                                        fontSize: "0.8rem",
                                        color: "error.main",
                                      }}
                                    />
                                  )}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.65rem",
                                      display: "block",
                                    }}
                                  >
                                    Day 6 - May 20, 2025
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: getAttendanceColor(
                                        selectedParticipant.attendance.day6
                                      ),
                                      fontWeight: 500,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {selectedParticipant.attendance.day6
                                      ? "Present"
                                      : "Absent"}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        ml: 0.5,
                                        color: "text.secondary",
                                        fontSize: "0.6rem",
                                        opacity: 0.7,
                                      }}
                                    >
                                      (click to toggle)
                                    </Typography>
                                  </Typography>
                                </Box>
                              </Stack>
                            </Stack>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                {/* Certificate section - Fixed at bottom, not scrollable */}
                <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Gradient indicator at top of card */}
                    <Box
                      sx={{
                        height: 4,
                        width: "100%",
                        background: selectedParticipant.certificateIssued
                          ? theme.palette.success.gradient
                          : "linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)",
                      }}
                    />

                    <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={12} sm={7}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                bgcolor: selectedParticipant.certificateIssued
                                  ? "success.main"
                                  : "action.disabled",
                                mr: 1.5,
                              }}
                            >
                              <PdfIcon sx={{ fontSize: "0.8rem" }} />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                              >
                                Certificate Status
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: selectedParticipant.certificateIssued
                                    ? "success.main"
                                    : "text.secondary",
                                  fontWeight:
                                    selectedParticipant.certificateIssued
                                      ? 500
                                      : 400,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {selectedParticipant.certificateIssued
                                  ? "Certificate has been issued"
                                  : calculateAttendancePercentage(
                                      selectedParticipant.attendance
                                    ) >= 75
                                  ? "Eligible for certificate"
                                  : "Not eligible (< 75% attendance)"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={5}
                          sx={{
                            display: "flex",
                            justifyContent: {
                              xs: "flex-start",
                              sm: "flex-end",
                            },
                            mt: { xs: 1, sm: 0 },
                          }}
                        >
                          {selectedParticipant.certificateIssued ? (
                            <Button
                              variant="contained"
                              startIcon={
                                <DownloadIcon sx={{ fontSize: "0.8rem" }} />
                              }
                              size="small"
                              sx={{
                                background: theme.palette.success.gradient,
                                boxShadow: "0 2px 6px rgba(46, 125, 50, 0.3)",
                                borderRadius: 1.5,
                                fontSize: "0.75rem",
                                py: 0.5,
                                "&:hover": {
                                  background: theme.palette.success.gradient,
                                  boxShadow: "0 4px 8px rgba(46, 125, 50, 0.4)",
                                },
                              }}
                            >
                              Download Certificate
                            </Button>
                          ) : calculateAttendancePercentage(
                              selectedParticipant.attendance
                            ) >= 75 ? (
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                background: theme.palette.primary.gradient,
                                boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
                                borderRadius: 1.5,
                                fontSize: "0.75rem",
                                py: 0.5,
                                "&:hover": {
                                  background: theme.palette.primary.gradient,
                                  boxShadow:
                                    "0 4px 8px rgba(25, 118, 210, 0.4)",
                                },
                              }}
                            >
                              Issue Certificate
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              disabled
                              sx={{
                                fontSize: "0.75rem",
                                py: 0.5,
                              }}
                            >
                              Cannot Issue Certificate
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  height: "60vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Select a participant to view details
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default FDPParticipantsView;
