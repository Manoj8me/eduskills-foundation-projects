import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  ThemeProvider,
  Paper,
  Stack,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  LinearProgress,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  ArrowBack as BackIcon,
  CalendarMonth as CalendarIcon,
  PersonOutline as PersonIcon,
  LocationOn as LocationIcon,
  DownloadForOffline as DownloadIcon,
  Edit as EditIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Send as SendIcon,
  Description as DescriptionIcon,
  AssessmentOutlined as AssessmentIcon,
  EventNote as EventNoteIcon,
  PeopleOutline as PeopleOutlineIcon,
  TimelineOutlined as TimelineIcon,
  MoreVert as MoreVertIcon,
  PlayCircleOutline as PlayCircleIcon,
  Link as LinkIcon,
  Notifications as NotificationsIcon,
  HelpOutline as HelpIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { CodeIcon } from "lucide-react";

// Assuming we're using the same theme from the parent component
// This would be imported from a shared theme file in a real application
const createTheme = (theme) => ({
  ...theme,
});

// Mock participants data
const mockParticipants = [
  {
    id: 1,
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    department: "Computer Science",
    institution: "Tech University",
    attendance: { day1: true, day2: true, day3: false },
    certificateIssued: false,
    photo: null,
    registrationDate: "2025-04-01",
  },
  {
    id: 2,
    name: "Dr. Emily Johnson",
    email: "emily.johnson@college.edu",
    department: "Information Technology",
    institution: "State College",
    attendance: { day1: true, day2: true, day3: true },
    certificateIssued: true,
    photo: null,
    registrationDate: "2025-04-02",
  },
  {
    id: 3,
    name: "Prof. Michael Brown",
    email: "michael.brown@institute.org",
    department: "Software Engineering",
    institution: "Technical Institute",
    attendance: { day1: false, day2: true, day3: true },
    certificateIssued: false,
    photo: null,
    registrationDate: "2025-04-03",
  },
  {
    id: 4,
    name: "Dr. Sarah Williams",
    email: "sarah.williams@academy.edu",
    department: "Data Science",
    institution: "National Academy",
    attendance: { day1: true, day2: false, day3: false },
    certificateIssued: false,
    photo: null,
    registrationDate: "2025-04-05",
  },
  {
    id: 5,
    name: "Prof. Robert Davis",
    email: "robert.davis@university.edu",
    department: "Artificial Intelligence",
    institution: "Tech University",
    attendance: { day1: true, day2: true, day3: true },
    certificateIssued: true,
    photo: null,
    registrationDate: "2025-04-02",
  },
  {
    id: 6,
    name: "Dr. Lisa Martinez",
    email: "lisa.martinez@college.edu",
    department: "Cybersecurity",
    institution: "State College",
    attendance: { day1: true, day2: true, day3: false },
    certificateIssued: false,
    photo: null,
    registrationDate: "2025-04-04",
  },
];

// Mock schedule data
const mockSchedule = [
  {
    day: "Day 1",
    date: "May 15, 2025",
    sessions: [
      {
        time: "09:00 - 10:30",
        title: "Introduction to React Fundamentals",
        speaker: "Dr. Sarah Johnson",
        description:
          "Overview of core React concepts and modern development practices.",
        materials: ["slides.pdf", "code-examples.zip"],
      },
      {
        time: "10:45 - 12:30",
        title: "Component Architecture",
        speaker: "Dr. Sarah Johnson",
        description:
          "Best practices for designing and organizing React components.",
        materials: ["component-patterns.pdf"],
      },
      {
        time: "13:30 - 15:00",
        title: "State Management",
        speaker: "Prof. Alex Turner",
        description: "Working with state in React applications.",
        materials: ["state-management.pdf", "practice-exercises.zip"],
      },
      {
        time: "15:15 - 17:00",
        title: "Hands-on Workshop",
        speaker: "Dr. Sarah Johnson & Prof. Alex Turner",
        description: "Practical exercises with React development.",
        materials: ["workshop-tasks.pdf"],
      },
    ],
  },
  {
    day: "Day 2",
    date: "May 16, 2025",
    sessions: [
      {
        time: "09:00 - 10:30",
        title: "React Hooks Deep Dive",
        speaker: "Dr. Sarah Johnson",
        description: "Advanced usage of React Hooks for functional components.",
        materials: ["hooks-examples.pdf"],
      },
      {
        time: "10:45 - 12:30",
        title: "Performance Optimization",
        speaker: "Prof. Alex Turner",
        description: "Techniques for optimizing React application performance.",
        materials: ["performance-slides.pdf"],
      },
      {
        time: "13:30 - 15:00",
        title: "Testing React Applications",
        speaker: "Dr. Mark Williams",
        description: "Strategies and tools for testing React components.",
        materials: ["testing-guide.pdf"],
      },
      {
        time: "15:15 - 17:00",
        title: "Group Project Work",
        speaker: "All Instructors",
        description: "Work on assigned projects with mentor guidance.",
        materials: ["project-requirements.pdf"],
      },
    ],
  },
  {
    day: "Day 3",
    date: "May 17, 2025",
    sessions: [
      {
        time: "09:00 - 10:30",
        title: "Advanced React Patterns",
        speaker: "Dr. Sarah Johnson",
        description: "Advanced design patterns for complex React applications.",
        materials: ["advanced-patterns.pdf"],
      },
      {
        time: "10:45 - 12:30",
        title: "React with Backend Integration",
        speaker: "Prof. Alex Turner",
        description: "Connecting React applications with backend services.",
        materials: ["api-integration.pdf"],
      },
      {
        time: "13:30 - 15:00",
        title: "Project Presentations",
        speaker: "All Participants",
        description: "Group presentations of developed projects.",
        materials: [],
      },
      {
        time: "15:15 - 16:30",
        title: "Q&A Panel and Closing Remarks",
        speaker: "All Instructors",
        description: "Open discussion and program conclusion.",
        materials: ["resources-list.pdf"],
      },
    ],
  },
];

// Mock resources data
const mockResources = [
  {
    id: 1,
    type: "presentation",
    title: "React Fundamentals Slides",
    description: "Complete slide deck covering React basics and core concepts",
    uploadDate: "2025-04-10",
    fileSize: "4.2 MB",
    fileType: "PDF",
    downloadCount: 15,
  },
  {
    id: 2,
    type: "code",
    title: "Code Examples Package",
    description:
      "Collection of working code samples demonstrated during sessions",
    uploadDate: "2025-04-10",
    fileSize: "8.7 MB",
    fileType: "ZIP",
    downloadCount: 12,
  },
  {
    id: 3,
    type: "document",
    title: "React Hooks Reference Guide",
    description:
      "Comprehensive guide to all built-in React hooks with examples",
    uploadDate: "2025-04-12",
    fileSize: "2.1 MB",
    fileType: "PDF",
    downloadCount: 18,
  },
  {
    id: 4,
    type: "video",
    title: "Component Architecture Walkthrough",
    description: "Recorded video explaining effective component structure",
    uploadDate: "2025-04-14",
    fileSize: "175 MB",
    fileType: "MP4",
    downloadCount: 9,
  },
  {
    id: 5,
    type: "link",
    title: "React Official Documentation",
    description: "Direct link to the official React documentation website",
    uploadDate: "2025-04-08",
    fileType: "URL",
    url: "https://reactjs.org/docs",
  },
];

// Mock feedback data
const mockFeedbackSummary = {
  totalResponses: 12,
  averageRating: 4.5,
  contentQuality: 4.7,
  presentationQuality: 4.3,
  organizationQuality: 4.6,
  resourcesQuality: 4.4,
  comments: [
    {
      participant: "Anonymous",
      rating: 5,
      comment:
        "Excellent program, very practical and immediately applicable to my work.",
      date: "2025-05-17",
    },
    {
      participant: "Anonymous",
      rating: 4,
      comment:
        "Great content, would have appreciated more time for hands-on exercises.",
      date: "2025-05-17",
    },
    {
      participant: "Anonymous",
      rating: 5,
      comment:
        "The instructors were knowledgeable and very responsive to questions.",
      date: "2025-05-17",
    },
  ],
};

// Mock FDP details
const mockFdpDetails = {
  id: 1,
  title: "Web Development with React",
  startDate: "2025-05-15",
  endDate: "2025-05-17",
  location: "Engineering Block, Room 302",
  seats: 30,
  enrolledParticipants: 18,
  organizer: "Dr. Sarah Johnson",
  status: "published",
  description:
    "This comprehensive Faculty Development Program focuses on modern web development using React. Participants will learn fundamental and advanced concepts of React, component architecture, state management, and how to build efficient single-page applications. The program includes hands-on workshops, practical exercises, and a mini-project to solidify learning.",
  objectives: [
    "Understand core React concepts and architecture",
    "Master component development and state management",
    "Learn performance optimization techniques",
    "Implement testing strategies for React applications",
    "Build a functional web application using React",
  ],
  prerequisites:
    "Basic knowledge of HTML, CSS, and JavaScript is required. Participants should bring their own laptops with Node.js installed.",
  certificationCriteria:
    "Minimum 80% attendance across all three days and completion of assigned exercises is required for certification.",
};

const FDPDetails = ({ fdpData = mockFdpDetails, onBack }) => {
  const [mainTab, setMainTab] = useState(0);
  const [scheduleTab, setScheduleTab] = useState(0);
  const [certificateDialog, setCertificateDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle main tab change
  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
  };

  // Handle schedule tab change
  const handleScheduleTabChange = (event, newValue) => {
    setScheduleTab(newValue);
  };

  // Calculate attendance percentage for a participant
  const calculateAttendance = (attendance) => {
    const days = Object.keys(attendance);
    const present = days.filter((day) => attendance[day]).length;
    return (present / days.length) * 100;
  };

  // Check if participant is eligible for certificate
  const isEligibleForCertificate = (participant) => {
    const attendancePercentage = calculateAttendance(participant.attendance);
    return attendancePercentage >= 80 && !participant.certificateIssued;
  };

  // Open certificate dialog
  const handleOpenCertificateDialog = (participant) => {
    setSelectedParticipant(participant);
    setCertificateDialog(true);
  };

  // Issue certificate
  const handleIssueCertificate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, update participant status via API
      setLoading(false);
      setCertificateDialog(false);
      // Show success message
    }, 1500);
  };

  // Open notification dialog
  const handleOpenNotificationDialog = () => {
    setNotificationDialog(true);
  };

  // Send notification
  const handleSendNotification = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setNotificationDialog(false);
      setMessageText("");
      // Show success message
    }, 1500);
  };

  // Format date range for display
  const formatDateRange = (startDate, endDate) => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const start = new Date(startDate).toLocaleDateString("en-US", options);
    const end = new Date(endDate).toLocaleDateString("en-US", options);
    return `${start} to ${end}`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        maxWidth: "1200px",
        mx: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        bgcolor: "#ffffff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        mb: 4,
      }}
    >
      {/* Header with back button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={onBack}
          sx={{
            mr: 2,
            color: "primary.dark",
            "&:hover": { bgcolor: "rgba(21, 101, 192, 0.04)" },
          }}
        >
          Back
        </Button>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 600, color: "#1e293b" }}
        >
          {fdpData.title}
        </Typography>
        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Tooltip title="Send Notification">
            <IconButton
              color="primary"
              onClick={handleOpenNotificationDialog}
              sx={{
                bgcolor: "rgba(21, 101, 192, 0.08)",
                "&:hover": { bgcolor: "rgba(21, 101, 192, 0.15)" },
              }}
            >
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              borderRadius: 1.5,
              background: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
              boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            Edit FDP
          </Button>
        </Box>
      </Box>

      {/* FDP Summary Card */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #e0e0e0",
        }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <Typography variant="body1">{fdpData.description}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Learning Objectives
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {fdpData.objectives.map((objective, index) => (
                      <Chip
                        key={index}
                        label={objective}
                        size="small"
                        sx={{
                          bgcolor: "rgba(21, 101, 192, 0.08)",
                          color: "primary.dark",
                          fontSize: "0.75rem",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack
                spacing={2}
                sx={{ height: "100%", justifyContent: "space-between" }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(21, 101, 192, 0.04)",
                    p: 2,
                    borderRadius: 1.5,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CalendarIcon color="primary" fontSize="small" />
                      <Typography variant="body2">
                        {formatDateRange(fdpData.startDate, fdpData.endDate)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationIcon color="primary" fontSize="small" />
                      <Typography variant="body2">
                        {fdpData.location}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PersonIcon color="primary" fontSize="small" />
                      <Typography variant="body2">
                        Organizer: {fdpData.organizer}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Enrollment Progress:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "primary.dark",
                        bgcolor: "rgba(21, 101, 192, 0.08)",
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                      }}
                    >
                      {fdpData.enrolledParticipants}/{fdpData.seats} (
                      {Math.round(
                        (fdpData.enrolledParticipants / fdpData.seats) * 100
                      )}
                      %)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(fdpData.enrolledParticipants / fdpData.seats) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(0,0,0,0.05)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={mainTab}
          onChange={handleMainTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="FDP management tabs"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              background: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
            },
            "& .MuiTab-root": {
              minHeight: 48,
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
            label="Participants"
            icon={<PeopleOutlineIcon />}
            iconPosition="start"
          />
          <Tab label="Schedule" icon={<EventNoteIcon />} iconPosition="start" />
          <Tab
            label="Resources"
            icon={<DescriptionIcon />}
            iconPosition="start"
          />
          <Tab
            label="Feedback & Analytics"
            icon={<AssessmentIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Participants Tab */}
      <Box sx={{ display: mainTab === 0 ? "block" : "none" }}>
        {/* Participants Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Enrolled Participants ({mockParticipants.length})
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              size="small"
              startIcon={<FileDownloadIcon />}
              sx={{
                borderRadius: 1.5,
                color: "primary.dark",
                bgcolor: "rgba(21, 101, 192, 0.08)",
                "&:hover": { bgcolor: "rgba(21, 101, 192, 0.15)" },
              }}
            >
              Export List
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<UploadIcon />}
              sx={{
                borderRadius: 1.5,
                background: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              Bulk Upload Attendance
            </Button>
          </Box>
        </Box>

        {/* Participants Table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(21, 101, 192, 0.04)" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Institution</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Day 1</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Day 2</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Day 3</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Attendance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Certificate</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockParticipants.map((participant) => {
                const attendancePercentage = calculateAttendance(
                  participant.attendance
                );
                const isEligible = isEligibleForCertificate(participant);

                return (
                  <TableRow
                    key={participant.id}
                    sx={{
                      "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            fontSize: "0.875rem",
                          }}
                        >
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {participant.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {participant.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{participant.department}</TableCell>
                    <TableCell>{participant.institution}</TableCell>
                    <TableCell>
                      {participant.attendance.day1 ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {participant.attendance.day2 ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {participant.attendance.day3 ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${attendancePercentage}%`}
                        size="small"
                        sx={{
                          bgcolor:
                            attendancePercentage >= 80
                              ? "rgba(46, 125, 50, 0.1)"
                              : "rgba(211, 47, 47, 0.1)",
                          color:
                            attendancePercentage >= 80
                              ? "success.dark"
                              : "error.dark",
                          fontSize: "0.75rem",
                          minWidth: 60,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {participant.certificateIssued ? (
                        <Chip
                          label="Issued"
                          size="small"
                          color="success"
                          icon={<CheckCircleIcon />}
                          sx={{
                            fontSize: "0.75rem",
                            bgcolor: "rgba(46, 125, 50, 0.1)",
                            color: "success.dark",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color={isEligible ? "success" : "error"}
                          startIcon={
                            isEligible ? <DownloadIcon /> : <CancelIcon />
                          }
                          disabled={!isEligible}
                          onClick={() =>
                            handleOpenCertificateDialog(participant)
                          }
                          sx={{
                            borderRadius: 1,
                            py: 0.25,
                            fontSize: "0.75rem",
                          }}
                        >
                          {isEligible ? "Issue" : "Ineligible"}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Message Participant">
                        <IconButton
                          size="small"
                          color="primary"
                          sx={{
                            mr: 0.5,
                            bgcolor: "rgba(21, 101, 192, 0.08)",
                            "&:hover": { bgcolor: "rgba(21, 101, 192, 0.15)" },
                          }}
                        >
                          <MessageIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Actions">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.08)" },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Certificate Info Card */}
        <Card
          sx={{
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DescriptionIcon color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Certificate Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Certification Criteria
                </Typography>
                <Typography variant="body1">
                  {fdpData.certificationCriteria}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Certificate Status
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={`${
                        mockParticipants.filter((p) => p.certificateIssued)
                          .length
                      } Issued`}
                      size="small"
                      color="success"
                      sx={{
                        bgcolor: "rgba(46, 125, 50, 0.1)",
                        color: "success.dark",
                      }}
                    />
                    <Chip
                      label={`${
                        mockParticipants.filter((p) =>
                          isEligibleForCertificate(p)
                        ).length
                      } Eligible`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(21, 101, 192, 0.08)",
                        color: "primary.dark",
                      }}
                    />
                    <Chip
                      label={`${
                        mockParticipants.filter(
                          (p) =>
                            !isEligibleForCertificate(p) && !p.certificateIssued
                        ).length
                      } Ineligible`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(211, 47, 47, 0.1)",
                        color: "error.dark",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    sx={{
                      borderRadius: 1.5,
                      borderColor: "rgba(21, 101, 192, 0.5)",
                    }}
                  >
                    Download Certificate Template
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    sx={{
                      borderRadius: 1.5,
                      background:
                        "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                      boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
                    }}
                  >
                    Bulk Issue Certificates
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Schedule Tab */}
      <Box sx={{ display: mainTab === 1 ? "block" : "none" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Program Schedule
          </Typography>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            sx={{
              borderRadius: 1.5,
              color: "primary.dark",
              bgcolor: "rgba(21, 101, 192, 0.08)",
              "&:hover": { bgcolor: "rgba(21, 101, 192, 0.15)" },
            }}
          >
            Download Full Schedule
          </Button>
        </Box>

        {/* Schedule Day Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={scheduleTab}
            onChange={handleScheduleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Schedule day tabs"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                background: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
              },
              "& .MuiTab-root": {
                minHeight: 42,
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
            {mockSchedule.map((day, index) => (
              <Tab
                key={index}
                label={`${day.day} - ${day.date}`}
                icon={<TimelineIcon fontSize="small" />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* Schedule Content */}
        {mockSchedule.map((day, dayIndex) => (
          <Box
            key={dayIndex}
            sx={{ display: scheduleTab === dayIndex ? "block" : "none" }}
          >
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {day.sessions.map((session, sessionIndex) => (
                <React.Fragment key={sessionIndex}>
                  <Box
                    sx={{
                      p: 2,
                      ...(sessionIndex % 2 === 0 && {
                        bgcolor: "rgba(21, 101, 192, 0.02)",
                      }),
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={2}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "primary.dark",
                            bgcolor: "rgba(21, 101, 192, 0.08)",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {session.time}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={10}>
                        <Stack spacing={1}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {session.title}
                            </Typography>

                            {session.materials &&
                              session.materials.length > 0 && (
                                <Box>
                                  {session.materials.map((material, idx) => (
                                    <Button
                                      key={idx}
                                      size="small"
                                      startIcon={
                                        material.endsWith(".pdf") ? (
                                          <DescriptionIcon fontSize="small" />
                                        ) : material.endsWith(".zip") ? (
                                          <UploadIcon fontSize="small" />
                                        ) : (
                                          <DescriptionIcon fontSize="small" />
                                        )
                                      }
                                      sx={{
                                        ml: 1,
                                        fontSize: "0.75rem",
                                        color: "primary.dark",
                                        "&:hover": {
                                          bgcolor: "rgba(21, 101, 192, 0.08)",
                                        },
                                      }}
                                    >
                                      {material}
                                    </Button>
                                  ))}
                                </Box>
                              )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#475569" }}
                            >
                              Speaker:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {session.speaker}
                            </Typography>
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            {session.description}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                  {sessionIndex < day.sessions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Resources Tab */}
      <Box sx={{ display: mainTab === 2 ? "block" : "none" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Program Resources
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<UploadIcon />}
            sx={{
              borderRadius: 1.5,
              background: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
              boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
            }}
          >
            Upload Resource
          </Button>
        </Box>

        <Grid container spacing={2}>
          {mockResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ pb: 1.5 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Box
                      sx={{
                        p: 1.2,
                        mr: 2,
                        borderRadius: "50%",
                        bgcolor: "rgba(21, 101, 192, 0.08)",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {resource.type === "presentation" && <DescriptionIcon />}
                      {resource.type === "code" && <CodeIcon />}
                      {resource.type === "document" && <DescriptionIcon />}
                      {resource.type === "video" && <PlayCircleIcon />}
                      {resource.type === "link" && <LinkIcon />}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {resource.title}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={resource.fileType}
                          size="small"
                          sx={{
                            height: 22,
                            bgcolor: "rgba(21, 101, 192, 0.08)",
                            color: "primary.dark",
                            fontSize: "0.7rem",
                            px: 0.5,
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />

                        {resource.fileSize && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {resource.fileSize}
                          </Typography>
                        )}

                        {resource.downloadCount && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {resource.downloadCount} downloads
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {resource.description}
                  </Typography>
                </CardContent>

                <Box
                  sx={{
                    px: 2,
                    pb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    Added: {resource.uploadDate}
                  </Typography>

                  {resource.type === "link" ? (
                    <Button
                      size="small"
                      startIcon={<LinkIcon />}
                      sx={{
                        borderRadius: 1.5,
                        color: "primary.dark",
                        "&:hover": { bgcolor: "rgba(21, 101, 192, 0.08)" },
                      }}
                    >
                      Visit Link
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      sx={{
                        borderRadius: 1.5,
                        color: "primary.dark",
                        "&:hover": { bgcolor: "rgba(21, 101, 192, 0.08)" },
                      }}
                    >
                      Download
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Feedback & Analytics Tab */}
      <Box sx={{ display: mainTab === 3 ? "block" : "none" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Feedback & Analytics
          </Typography>
          <Button
            size="small"
            startIcon={<FileDownloadIcon />}
            sx={{
              borderRadius: 1.5,
              color: "primary.dark",
              bgcolor: "rgba(21, 101, 192, 0.08)",
              "&:hover": { bgcolor: "rgba(21, 101, 192, 0.15)" },
            }}
          >
            Export Report
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Analytics Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Overall Rating
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "primary.dark" }}
                      >
                        {mockFeedbackSummary.averageRating.toFixed(1)}
                      </Typography>
                      <Chip
                        label="Out of 5.0"
                        size="small"
                        sx={{
                          bgcolor: "rgba(21, 101, 192, 0.08)",
                          color: "primary.dark",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Based on {mockFeedbackSummary.totalResponses} responses
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Attendance
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "primary.dark" }}
                      >
                        85%
                      </Typography>
                      <Chip
                        label="Average"
                        size="small"
                        sx={{
                          bgcolor: "rgba(46, 125, 50, 0.1)",
                          color: "success.dark",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Day 1: 92% | Day 2: 86% | Day 3: 78%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Ratings by Category
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Stack spacing={1.5}>
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography variant="body2">
                                  Content Quality
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {mockFeedbackSummary.contentQuality.toFixed(
                                    1
                                  )}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (mockFeedbackSummary.contentQuality / 5) * 100
                                }
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 3,
                                    background:
                                      "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                                  },
                                }}
                              />
                            </Box>

                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography variant="body2">
                                  Presentation Quality
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {mockFeedbackSummary.presentationQuality.toFixed(
                                    1
                                  )}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (mockFeedbackSummary.presentationQuality /
                                    5) *
                                  100
                                }
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 3,
                                    background:
                                      "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                                  },
                                }}
                              />
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Stack spacing={1.5}>
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography variant="body2">
                                  Organization Quality
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {mockFeedbackSummary.organizationQuality.toFixed(
                                    1
                                  )}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (mockFeedbackSummary.organizationQuality /
                                    5) *
                                  100
                                }
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 3,
                                    background:
                                      "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                                  },
                                }}
                              />
                            </Box>

                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography variant="body2">
                                  Resources Quality
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {mockFeedbackSummary.resourcesQuality.toFixed(
                                    1
                                  )}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (mockFeedbackSummary.resourcesQuality / 5) *
                                  100
                                }
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 3,
                                    background:
                                      "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                                  },
                                }}
                              />
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Comments Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: 600, mb: 2 }}
                >
                  Participant Comments
                </Typography>

                <Stack
                  spacing={2}
                  divider={<Divider flexItem />}
                  sx={{ maxHeight: 350, overflow: "auto", pr: 1 }}
                >
                  {mockFeedbackSummary.comments.map((comment, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {comment.participant}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "primary.dark" }}
                          >
                            {comment.rating}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 0.5 }}
                          >
                            /5
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {comment.comment}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.tertiary"
                        sx={{ mt: 0.5, fontSize: "0.75rem" }}
                      >
                        {comment.date}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>

              <Box sx={{ mt: "auto", p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MessageIcon />}
                  sx={{
                    borderRadius: 1.5,
                    borderColor: "rgba(21, 101, 192, 0.5)",
                  }}
                >
                  View All Feedback
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Issue Certificate Dialog */}
      <Dialog
        open={certificateDialog}
        onClose={() => setCertificateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Issue Certificate
        </DialogTitle>

        <DialogContent dividers>
          {selectedParticipant && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                You are about to issue a certificate to{" "}
                <strong>{selectedParticipant.name}</strong>. This action will
                generate and email the certificate to the participant.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Certificate ID"
                    value={`CERT-FDP-${fdpData.id}-${selectedParticipant.id}`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Issue Date"
                    value={new Date().toISOString().split("T")[0]}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Template</InputLabel>
                    <Select value="default" label="Template">
                      <MenuItem value="default">
                        Default FDP Certificate
                      </MenuItem>
                      <MenuItem value="premium">Premium Certificate</MenuItem>
                      <MenuItem value="custom">Custom Template</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Send email notification to participant"
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setCertificateDialog(false)}
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleIssueCertificate}
            startIcon={loading ? null : <DownloadIcon />}
            disabled={loading}
            sx={{
              borderRadius: 1.5,
              ml: 1,
              background: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
              boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Issue Certificate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog
        open={notificationDialog}
        onClose={() => setNotificationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Send Notification
        </DialogTitle>

        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 3 }}>
            This will send a notification to all enrolled participants of this
            FDP.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                fullWidth
                variant="outlined"
                size="small"
                defaultValue="Important Update: Web Development with React FDP"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Message"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Send as email"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Send as in-app notification"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setNotificationDialog(false)}
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendNotification}
            startIcon={loading ? null : <SendIcon />}
            disabled={loading || !messageText.trim()}
            sx={{
              borderRadius: 1.5,
              ml: 1,
              background: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
              boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Send Notification"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FDPDetails;
