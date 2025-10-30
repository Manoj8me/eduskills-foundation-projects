import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Container,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
  Button,
  Drawer,
  Backdrop,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControlLabel,
  Switch,
  useMediaQuery,
  Stack,
} from "@mui/material";

import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  AssignmentInd as AssignmentIndIcon,
  Person as PersonIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  FormatListBulleted as FormatListBulletedIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  Email as EmailIcon,
  Archive as ArchiveIcon,
  NotificationsActive as NotificationsActiveIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  LocalOffer as LocalOfferIcon,
  Group as GroupIcon,
  QuestionAnswer as QuestionAnswerIcon,
  History as HistoryIcon,
  Save as SaveIcon,
  NoteAdd as NoteAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Import the existing mock tickets data
import { MOCK_TICKETS } from "./mockData";
import { GridCloseIcon } from "@mui/x-data-grid";

// Admin Support Team Members
const SUPPORT_TEAM = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Support Manager",
    avatar: "SJ",
    department: "IT",
    status: "Available",
    tickets: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Support Specialist",
    avatar: "MC",
    department: "IT",
    status: "Busy",
    tickets: 12,
  },
  {
    id: 3,
    name: "Aisha Patel",
    role: "Technical Support Agent",
    avatar: "AP",
    department: "Development",
    status: "Available",
    tickets: 3,
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Customer Support",
    avatar: "DR",
    department: "Customer Support",
    status: "Away",
    tickets: 7,
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Support Specialist",
    avatar: "EW",
    department: "HR",
    status: "Available",
    tickets: 2,
  },
  {
    id: 6,
    name: "Jamal Thompson",
    role: "Technical Support Agent",
    avatar: "JT",
    department: "Development",
    status: "Available",
    tickets: 8,
  },
];

// Response Templates
const RESPONSE_TEMPLATES = [
  {
    id: 1,
    title: "Technical Issue Acknowledgement",
    content:
      "Thank you for reporting this technical issue. We've received your ticket and are investigating the problem. A member of our technical team will provide an update soon. For urgent matters, please contact us directly at support@company.com.",
    category: "IT",
  },
  {
    id: 2,
    title: "Account Access Resolution",
    content:
      "We've resolved the access issue with your account. Please try logging in again and let us know if you encounter any further problems. We recommend clearing your browser cache for optimal performance.",
    category: "IT",
  },
  {
    id: 3,
    title: "Network Troubleshooting",
    content:
      "We're investigating the network issue you've reported. To help diagnose the problem, please try the following steps:\n\n1. Restart your device\n2. Reset your local network connection\n3. Clear DNS cache\n4. Try connecting via a different network if possible\n\nPlease reply with the results of these steps.",
    category: "IT",
  },
  {
    id: 4,
    title: "HR Request Processing",
    content:
      "Your HR request has been received and is being processed. The typical turnaround time for this type of request is 2-3 business days. We'll notify you once it's been completed.",
    category: "HR",
  },
  {
    id: 5,
    title: "Finance Query Response",
    content:
      "Thank you for your finance-related inquiry. We're reviewing your request and will need to consult with the appropriate department. You can expect a response within the next 48 hours.",
    category: "Finance",
  },
];

// Status options
const STATUSES = [
  { value: "Open", color: "#2196f3" },
  { value: "In Progress", color: "#ff9800" },
  { value: "Resolved", color: "#4caf50" },
  { value: "Closed", color: "#9e9e9e" },
];

// Priority levels
const PRIORITIES = [
  { value: "Low", color: "#4caf50" },
  { value: "Medium", color: "#ff9800" },
  { value: "High", color: "#f44336" },
  { value: "Critical", color: "#9c27b0" },
];

// Categories
const CATEGORIES = [
  "IT",
  "HR",
  "Finance",
  "Development",
  "Marketing",
  "Sales",
  "Customer Support",
  "Operations",
];

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

// Admin ticket note type
const NOTE_TYPES = [
  { value: "internal", label: "Internal Note", color: "#5c6bc0" },
  { value: "follow_up", label: "Follow Up", color: "#26a69a" },
  { value: "escalation", label: "Escalation", color: "#ef5350" },
];

// Enhanced ticket with admin fields
const enhanceTicketsWithAdminFields = (tickets) => {
  return tickets.map((ticket) => ({
    ...ticket,
    assignedTo:
      Math.random() > 0.6
        ? SUPPORT_TEAM[Math.floor(Math.random() * SUPPORT_TEAM.length)].id
        : null,
    lastUpdated: new Date(
      new Date(ticket.date).getTime() + Math.random() * 86400000 * 2
    )
      .toISOString()
      .split("T")[0],
    sla:
      Math.random() > 0.3
        ? "Within SLA"
        : Math.random() > 0.5
        ? "Approaching"
        : "Overdue",
    adminNotes:
      Math.random() > 0.5
        ? [
            {
              id: `note-${Math.floor(1000 + Math.random() * 9000)}`,
              type: NOTE_TYPES[Math.floor(Math.random() * NOTE_TYPES.length)]
                .value,
              author:
                SUPPORT_TEAM[Math.floor(Math.random() * SUPPORT_TEAM.length)]
                  .name,
              authorId:
                SUPPORT_TEAM[Math.floor(Math.random() * SUPPORT_TEAM.length)]
                  .id,
              content: "Internal note about this ticket issue.",
              date: new Date(
                new Date(ticket.date).getTime() + Math.random() * 86400000
              ).toISOString(),
            },
          ]
        : [],
    responseHistory:
      Math.random() > 0.3
        ? [
            {
              id: `resp-${Math.floor(1000 + Math.random() * 9000)}`,
              author:
                SUPPORT_TEAM[Math.floor(Math.random() * SUPPORT_TEAM.length)]
                  .name,
              authorId:
                SUPPORT_TEAM[Math.floor(Math.random() * SUPPORT_TEAM.length)]
                  .id,
              content:
                "We are looking into this issue and will update you shortly.",
              date: new Date(
                new Date(ticket.date).getTime() + Math.random() * 86400000
              ).toISOString(),
              isPublic: true,
            },
          ]
        : [],
  }));
};

// Create admin tickets with enhanced data
const ADMIN_TICKETS = enhanceTicketsWithAdminFields(MOCK_TICKETS);

// Create compact modern theme
const adminTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
      contrastText: "#fff",
    },
    secondary: {
      main: "#03a9f4",
      light: "#35baf6",
      dark: "#0276aa",
      contrastText: "#fff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    sla: {
      within: "#4caf50",
      approaching: "#ff9800",
      overdue: "#f44336",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    h4: {
      fontWeight: 600,
      fontSize: "1.4rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "0.95rem",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "0.85rem",
    },
    body1: {
      fontSize: "0.85rem",
    },
    body2: {
      fontSize: "0.8rem",
    },
    caption: {
      fontSize: "0.75rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.8rem",
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: "none",
          padding: "4px 12px",
          "&:hover": {
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          height: "24px",
        },
        sizeSmall: {
          height: "20px",
          fontSize: "0.7rem",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "8px 16px",
        },
        head: {
          background: "rgba(0, 0, 0, 0.02)",
          borderBottom: "2px solid rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "rgba(0, 0, 0, 0.01)",
          },
        },
      },
    },
  },
});

const AdminTicketManagement = () => {
  const theme = useMediaQuery(adminTheme.breakpoints.down("sm"));

  // State for tickets
  const [tickets, setTickets] = useState(ADMIN_TICKETS);

  // State for loading
  const [loading, setLoading] = useState(false);

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(tickets);

  // State for detail view
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetailOpen, setTicketDetailOpen] = useState(false);

  // State for response and notes
  const [responseText, setResponseText] = useState("");
  const [adminNoteText, setAdminNoteText] = useState("");
  const [adminNoteType, setAdminNoteType] = useState("internal");
  const [isSendingResponse, setIsSendingResponse] = useState(false);

  // State for sort menu
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  // State for filter menu
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [slaFilter, setSlaFilter] = useState("All");

  // State for team management
  const [teamManagementOpen, setTeamManagementOpen] = useState(false);

  // State for response templates drawer
  const [templatesDrawerOpen, setTemplatesDrawerOpen] = useState(false);

  // State for toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for assign ticket dialog
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // State for status change dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  // State for priority change dialog
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);

  // Status mapping for tabs
  const tabStatusMap = [
    "All",
    "Open",
    "In Progress",
    "Resolved",
    "Closed",
    "Unassigned",
  ];
  const currentTabStatus = tabStatusMap[tabValue];

  // Update filtered tickets when tickets, search term, or filters change
  useEffect(() => {
    let filtered = tickets.filter(
      (ticket) =>
        (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (tabValue === 0 ||
          (tabValue === 5
            ? !ticket.assignedTo
            : ticket.status === tabStatusMap[tabValue])) &&
        (priorityFilter === "All" || ticket.priority === priorityFilter) &&
        (categoryFilter === "All" || ticket.category === categoryFilter) &&
        (assigneeFilter === "All" ||
          (assigneeFilter === "Unassigned"
            ? !ticket.assignedTo
            : ticket.assignedTo === parseInt(assigneeFilter))) &&
        (slaFilter === "All" || ticket.sla === slaFilter)
    );

    // Apply sorting
    if (sortOption === "newest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } else if (sortOption === "oldest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else if (sortOption === "priority") {
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      filtered = [...filtered].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else if (sortOption === "lastUpdated") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );
    }

    setFilteredTickets(filtered);
  }, [
    searchTerm,
    tickets,
    sortOption,
    priorityFilter,
    categoryFilter,
    assigneeFilter,
    slaFilter,
    tabValue,
  ]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle sorting menu
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    handleSortClose();
  };

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSortOption("newest");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setAssigneeFilter("All");
    setSlaFilter("All");
  };

  // Handle ticket selection
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketDetailOpen(true);
    setResponseText("");
    setAdminNoteText("");
    setAdminNoteType("internal");
  };

  // Get assigned agent name by ID
  const getAgentNameById = (id) => {
    if (!id) return null;
    const agent = SUPPORT_TEAM.find((agent) => agent.id === id);
    return agent ? agent : null;
  };

  // Handle assign ticket
  const handleAssignTicket = (ticketId, agentId) => {
    setLoading(true);

    // Update the ticket assignment
    setTimeout(() => {
      const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            assignedTo: agentId,
            lastUpdated: new Date().toISOString().split("T")[0],
            status: ticket.status === "Open" ? "In Progress" : ticket.status,
          };
        }
        return ticket;
      });

      setTickets(updatedTickets);

      // If the selected ticket is being updated, update that too
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = updatedTickets.find((t) => t.id === ticketId);
        setSelectedTicket(updatedTicket);
      }

      setLoading(false);
      setAssignDialogOpen(false);

      const agent = getAgentNameById(agentId);
      setToast({
        open: true,
        message: agent
          ? `Ticket assigned to ${agent.name}`
          : "Ticket unassigned",
        severity: "success",
      });
    }, 800);
  };

  // Handle status change
  const handleStatusChange = (ticketId, newStatus) => {
    setLoading(true);

    setTimeout(() => {
      const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status: newStatus,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return ticket;
      });

      setTickets(updatedTickets);

      // If the selected ticket is being updated, update that too
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = updatedTickets.find((t) => t.id === ticketId);
        setSelectedTicket(updatedTicket);
      }

      setLoading(false);
      setStatusDialogOpen(false);

      setToast({
        open: true,
        message: `Ticket status updated to ${newStatus}`,
        severity: "success",
      });
    }, 800);
  };

  // Handle priority change
  const handlePriorityChange = (ticketId, newPriority) => {
    setLoading(true);

    setTimeout(() => {
      const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            priority: newPriority,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return ticket;
      });

      setTickets(updatedTickets);

      // If the selected ticket is being updated, update that too
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = updatedTickets.find((t) => t.id === ticketId);
        setSelectedTicket(updatedTicket);
      }

      setLoading(false);
      setPriorityDialogOpen(false);

      setToast({
        open: true,
        message: `Ticket priority updated to ${newPriority}`,
        severity: "success",
      });
    }, 800);
  };

  // Handle send response
  const handleSendResponse = (ticketId, message, makePublic = true) => {
    if (!message.trim()) return;

    setIsSendingResponse(true);

    setTimeout(() => {
      const now = new Date().toISOString();

      const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newResponse = {
            id: `resp-${Math.floor(1000 + Math.random() * 9000)}`,
            author: "Admin User",
            authorId: 1, // Assuming admin is ID 1
            content: message,
            date: now,
            isPublic: makePublic,
          };

          return {
            ...ticket,
            responseHistory: [...(ticket.responseHistory || []), newResponse],
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return ticket;
      });

      setTickets(updatedTickets);

      // Update selected ticket if needed
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = updatedTickets.find((t) => t.id === ticketId);
        setSelectedTicket(updatedTicket);
      }

      setResponseText("");
      setIsSendingResponse(false);

      setToast({
        open: true,
        message: makePublic
          ? "Response sent to customer"
          : "Draft response saved",
        severity: "success",
      });
    }, 1000);
  };

  // Handle add admin note
  const handleAddAdminNote = (ticketId, note, type) => {
    if (!note.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const now = new Date().toISOString();

      const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newNote = {
            id: `note-${Math.floor(1000 + Math.random() * 9000)}`,
            type: type,
            author: "Admin User",
            authorId: 1, // Assuming admin is ID 1
            content: note,
            date: now,
          };

          return {
            ...ticket,
            adminNotes: [...(ticket.adminNotes || []), newNote],
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return ticket;
      });

      setTickets(updatedTickets);

      // Update selected ticket if needed
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = updatedTickets.find((t) => t.id === ticketId);
        setSelectedTicket(updatedTicket);
      }

      setAdminNoteText("");
      setLoading(false);

      setToast({
        open: true,
        message: "Admin note added",
        severity: "success",
      });
    }, 800);
  };

  // Handle apply response template
  const handleApplyTemplate = (template) => {
    setResponseText(template.content);
    setTemplatesDrawerOpen(false);
  };

  // Handle toast close
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  // Render status indicator
  const renderStatusChip = (status) => {
    const statusObj = STATUSES.find((s) => s.value === status);
    return (
      <Chip
        label={status}
        size="small"
        style={{
          backgroundColor: statusObj ? statusObj.color : "#9e9e9e",
          color: "white",
        }}
      />
    );
  };

  // Render priority indicator
  const renderPriorityChip = (priority) => {
    const priorityObj = PRIORITIES.find((p) => p.value === priority);
    return (
      <Chip
        label={priority}
        size="small"
        style={{
          backgroundColor: priorityObj ? priorityObj.color : "#9e9e9e",
          color: "white",
        }}
      />
    );
  };

  // Render SLA indicator
  const renderSLAIndicator = (sla) => {
    let color;
    switch (sla) {
      case "Within SLA":
        color = adminTheme.palette.sla.within;
        break;
      case "Approaching":
        color = adminTheme.palette.sla.approaching;
        break;
      case "Overdue":
        color = adminTheme.palette.sla.overdue;
        break;
      default:
        color = "#9e9e9e";
    }

    return (
      <Chip
        label={sla}
        size="small"
        style={{
          backgroundColor: color,
          color: "white",
        }}
      />
    );
  };

  // Render assignee information
  const renderAssigneeInfo = (assignedToId) => {
    const agent = getAgentNameById(assignedToId);

    if (!agent) {
      return (
        <Chip
          label="Unassigned"
          size="small"
          variant="outlined"
          sx={{ borderStyle: "dashed" }}
        />
      );
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: "0.75rem",
            bgcolor:
              agent.status === "Available"
                ? "#4caf50"
                : agent.status === "Busy"
                ? "#f44336"
                : "#ff9800",
          }}
        >
          {agent.avatar}
        </Avatar>
        <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
          {agent.name}
        </Typography>
      </Box>
    );
  };

  // Calculate summary stats
  const getTicketStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
      closed: tickets.filter((t) => t.status === "Closed").length,
      unassigned: tickets.filter((t) => !t.assignedTo).length,
      critical: tickets.filter(
        (t) => t.priority === "Critical" && t.status !== "Closed"
      ).length,
      overdueCount: tickets.filter(
        (t) => t.sla === "Overdue" && t.status !== "Closed"
      ).length,
    };
  };

  const ticketStats = getTicketStats();

  return (
    <ThemeProvider theme={adminTheme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Top Header/AppBar */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
            zIndex: 10,
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 64,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SupervisorAccountIcon
                  sx={{ fontSize: 24, color: "primary.main", mr: 1.5 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  Support Ticket Administration
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  onClick={() => setTeamManagementOpen(true)}
                >
                  Manage Team
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DashboardIcon />}
                  sx={{
                    px: 2,
                    py: 0.75,
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                    boxShadow: "0px 2px 4px rgba(25, 118, 210, 0.25)",
                  }}
                >
                  Dashboard
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <Container
            maxWidth="xl"
            sx={{
              py: { xs: 2, sm: 3 },
              px: { xs: 1.5, sm: 2 },
            }}
          >
            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "primary.light",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                    {ticketStats.total}
                  </Typography>
                  <Typography variant="body2">Total Tickets</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "#2196f3",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                    {ticketStats.open}
                  </Typography>
                  <Typography variant="body2">Open</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "#ff9800",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                    {ticketStats.inProgress}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "#4caf50",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                    {ticketStats.resolved}
                  </Typography>
                  <Typography variant="body2">Resolved</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "#f44336",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                    {ticketStats.critical}
                  </Typography>
                  <Typography variant="body2">Critical</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "#9c27b0",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                    {ticketStats.overdueCount}
                  </Typography>
                  <Typography variant="body2">SLA Overdue</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Tickets Panel */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1.5,
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.04)",
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    mb: 2,
                  }}
                >
                  Manage Support Tickets
                </Typography>

                {/* Search and Filter Bar */}
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <TextField
                    placeholder="Search tickets..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{ color: "text.secondary", fontSize: 16 }}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 1,
                        fontSize: "0.8rem",
                        height: 36,
                        flexGrow: 1,
                        minWidth: "200px",
                      },
                    }}
                  />

                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Tooltip title="Sort options">
                      <Button
                        size="small"
                        startIcon={<SortIcon sx={{ fontSize: 16 }} />}
                        onClick={handleSortClick}
                        variant="outlined"
                        sx={{
                          height: 36,
                          textTransform: "none",
                          fontSize: "0.75rem",
                          px: 1.5,
                        }}
                      >
                        {sortOption === "newest"
                          ? "Newest"
                          : sortOption === "oldest"
                          ? "Oldest"
                          : sortOption === "lastUpdated"
                          ? "Last Updated"
                          : "Priority"}
                      </Button>
                    </Tooltip>

                    <Menu
                      anchorEl={sortAnchorEl}
                      open={Boolean(sortAnchorEl)}
                      onClose={handleSortClose}
                    >
                      <MenuItem
                        dense
                        onClick={() => handleSortSelect("newest")}
                        selected={sortOption === "newest"}
                      >
                        <Typography variant="body2">Newest first</Typography>
                      </MenuItem>
                      <MenuItem
                        dense
                        onClick={() => handleSortSelect("oldest")}
                        selected={sortOption === "oldest"}
                      >
                        <Typography variant="body2">Oldest first</Typography>
                      </MenuItem>
                      <MenuItem
                        dense
                        onClick={() => handleSortSelect("priority")}
                        selected={sortOption === "priority"}
                      >
                        <Typography variant="body2">Priority</Typography>
                      </MenuItem>
                      <MenuItem
                        dense
                        onClick={() => handleSortSelect("lastUpdated")}
                        selected={sortOption === "lastUpdated"}
                      >
                        <Typography variant="body2">Last updated</Typography>
                      </MenuItem>
                    </Menu>

                    <Tooltip title="Filter options">
                      <Button
                        size="small"
                        startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
                        onClick={handleFilterClick}
                        variant="outlined"
                        sx={{
                          height: 36,
                          textTransform: "none",
                          fontSize: "0.75rem",
                          px: 1.5,
                        }}
                      >
                        Filter
                        {(priorityFilter !== "All" ||
                          categoryFilter !== "All" ||
                          assigneeFilter !== "All" ||
                          slaFilter !== "All") && (
                          <Badge color="primary" variant="dot" sx={{ ml: 1 }} />
                        )}
                      </Button>
                    </Tooltip>

                    <Menu
                      anchorEl={filterAnchorEl}
                      open={Boolean(filterAnchorEl)}
                      onClose={handleFilterClose}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 0.5,
                          display: "block",
                          fontWeight: 500,
                        }}
                      >
                        Priority
                      </Typography>
                      <MenuItem
                        dense
                        onClick={() => setPriorityFilter("All")}
                        selected={priorityFilter === "All"}
                      >
                        <Typography variant="body2">All</Typography>
                      </MenuItem>
                      {PRIORITIES.map((priority) => (
                        <MenuItem
                          key={priority.value}
                          dense
                          onClick={() => setPriorityFilter(priority.value)}
                          selected={priorityFilter === priority.value}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: priority.color,
                              display: "inline-block",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">
                            {priority.value}
                          </Typography>
                        </MenuItem>
                      ))}

                      <Divider sx={{ my: 1 }} />

                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 0.5,
                          display: "block",
                          fontWeight: 500,
                        }}
                      >
                        Category
                      </Typography>
                      <MenuItem
                        dense
                        onClick={() => setCategoryFilter("All")}
                        selected={categoryFilter === "All"}
                      >
                        <Typography variant="body2">All</Typography>
                      </MenuItem>
                      {CATEGORIES.map((category) => (
                        <MenuItem
                          key={category}
                          dense
                          onClick={() => setCategoryFilter(category)}
                          selected={categoryFilter === category}
                        >
                          <Typography variant="body2">{category}</Typography>
                        </MenuItem>
                      ))}

                      <Divider sx={{ my: 1 }} />

                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 0.5,
                          display: "block",
                          fontWeight: 500,
                        }}
                      >
                        Assigned To
                      </Typography>
                      <MenuItem
                        dense
                        onClick={() => setAssigneeFilter("All")}
                        selected={assigneeFilter === "All"}
                      >
                        <Typography variant="body2">All</Typography>
                      </MenuItem>
                      <MenuItem
                        dense
                        onClick={() => setAssigneeFilter("Unassigned")}
                        selected={assigneeFilter === "Unassigned"}
                      >
                        <Typography variant="body2">Unassigned</Typography>
                      </MenuItem>
                      {SUPPORT_TEAM.map((agent) => (
                        <MenuItem
                          key={agent.id}
                          dense
                          onClick={() => setAssigneeFilter(agent.id.toString())}
                          selected={assigneeFilter === agent.id.toString()}
                        >
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 20,
                                height: 20,
                                fontSize: "0.6rem",
                                bgcolor:
                                  agent.status === "Available"
                                    ? "#4caf50"
                                    : agent.status === "Busy"
                                    ? "#f44336"
                                    : "#ff9800",
                              }}
                            >
                              {agent.avatar}
                            </Avatar>
                            <Typography variant="body2">
                              {agent.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}

                      <Divider sx={{ my: 1 }} />

                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 0.5,
                          display: "block",
                          fontWeight: 500,
                        }}
                      >
                        SLA Status
                      </Typography>
                      <MenuItem
                        dense
                        onClick={() => setSlaFilter("All")}
                        selected={slaFilter === "All"}
                      >
                        <Typography variant="body2">All</Typography>
                      </MenuItem>
                      <MenuItem
                        dense
                        onClick={() => setSlaFilter("Within SLA")}
                        selected={slaFilter === "Within SLA"}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: adminTheme.palette.sla.within,
                            display: "inline-block",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">Within SLA</Typography>
                      </MenuItem>
                      <MenuItem
                        dense
                        onClick={() => setSlaFilter("Approaching")}
                        selected={slaFilter === "Approaching"}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: adminTheme.palette.sla.approaching,
                            display: "inline-block",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">Approaching</Typography>
                      </MenuItem>
                      <MenuItem
                        dense
                        onClick={() => setSlaFilter("Overdue")}
                        selected={slaFilter === "Overdue"}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: adminTheme.palette.sla.overdue,
                            display: "inline-block",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">Overdue</Typography>
                      </MenuItem>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ px: 1, py: 0.5 }}>
                        <Button
                          fullWidth
                          size="small"
                          onClick={handleResetFilters}
                          startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
                        >
                          Reset filters
                        </Button>
                      </Box>
                    </Menu>
                  </Box>
                </Box>

                {/* Status Tabs */}
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    mb: 2,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                    "& .MuiTab-root": {
                      minWidth: "auto",
                      px: { xs: 1.5, sm: 2 },
                      py: 1,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "none",
                    },
                    "& .MuiTabs-indicator": {
                      height: 3,
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    },
                  }}
                >
                  {tabStatusMap.map((status, index) => (
                    <Tab
                      key={status}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {status}
                          <Chip
                            label={
                              status === "All"
                                ? ticketStats.total
                                : status === "Open"
                                ? ticketStats.open
                                : status === "In Progress"
                                ? ticketStats.inProgress
                                : status === "Resolved"
                                ? ticketStats.resolved
                                : status === "Closed"
                                ? ticketStats.closed
                                : ticketStats.unassigned
                            }
                            size="small"
                            sx={{
                              height: 18,
                              minWidth: 18,
                              fontSize: "0.65rem",
                              bgcolor:
                                status === "All"
                                  ? "primary.main"
                                  : status === "Open"
                                  ? "#2196f3"
                                  : status === "In Progress"
                                  ? "#ff9800"
                                  : status === "Resolved"
                                  ? "#4caf50"
                                  : status === "Closed"
                                  ? "#9e9e9e"
                                  : "#f44336",
                              color: "white",
                              "& .MuiChip-label": {
                                px: 0.8,
                              },
                            }}
                          />
                        </Box>
                      }
                    />
                  ))}
                </Tabs>

                {/* Table View */}
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    borderRadius: 1.5,
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Table
                    size="small"
                    sx={{ minWidth: 650 }}
                    aria-label="ticket table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        >
                          Title & Category
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        >
                          Priority
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        >
                          Assigned To
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        >
                          SLA Status
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        >
                          Last Updated
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                          align="right"
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTickets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No tickets found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTickets.map((ticket) => (
                          <TableRow
                            key={ticket.id}
                            hover
                            onClick={() => handleSelectTicket(ticket)}
                            sx={{
                              cursor: "pointer",
                              "&:last-child td, &:last-child th": { border: 0 },
                              borderLeft: `4px solid ${
                                STATUSES.find((s) => s.value === ticket.status)
                                  ?.color || "#9e9e9e"
                              }`,
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              <Box sx={{ fontWeight: 500 }}>{ticket.id}</Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block" }}
                              >
                                {ticket.date}
                              </Typography>
                            </TableCell>

                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              <Box sx={{ fontWeight: 500 }}>{ticket.title}</Box>
                              <Chip
                                label={ticket.category}
                                size="small"
                                variant="outlined"
                                sx={{
                                  mt: 0.5,
                                  height: 20,
                                  "& .MuiChip-label": {
                                    fontSize: "0.65rem",
                                    px: 0.8,
                                  },
                                }}
                              />
                            </TableCell>

                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {renderStatusChip(ticket.status)}
                            </TableCell>

                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {renderPriorityChip(ticket.priority)}
                            </TableCell>

                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {renderAssigneeInfo(ticket.assignedTo)}
                            </TableCell>

                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {renderSLAIndicator(ticket.sla)}
                            </TableCell>

                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <AccessTimeIcon
                                  sx={{
                                    fontSize: 12,
                                    mr: 0.5,
                                    color: "text.secondary",
                                  }}
                                />
                                {ticket.lastUpdated}
                              </Box>
                            </TableCell>

                            <TableCell align="right">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="flex-end"
                              >
                                <Tooltip title="Assign ticket">
                                  <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTicket(ticket);
                                      setAssignDialogOpen(true);
                                    }}
                                    sx={{ color: "text.secondary", p: 1 }}
                                  >
                                    <AssignmentIndIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="View ticket details">
                                  <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectTicket(ticket);
                                    }}
                                    sx={{ color: "primary.main", p: 1 }}
                                  >
                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Container>
        </Box>

        {/* Ticket Detail Dialog */}
        <Dialog
          open={ticketDetailOpen}
          onClose={() => setTicketDetailOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, maxHeight: "90vh" },
          }}
        >
          {selectedTicket && (
            <>
              <DialogTitle
                sx={{
                  pb: 1.5,
                  pt: 2,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                  >
                    Ticket {selectedTicket.id}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {renderStatusChip(selectedTicket.status)}
                    {renderSLAIndicator(selectedTicket.sla)}
                  </Box>
                </Box>
              </DialogTitle>

              <DialogContent
                dividers
                sx={{
                  p: 0,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                }}
              >
                {/* Ticket header */}
                <Grid container spacing={0}>
                  <Grid item xs={12} md={8}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 0,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                        borderRight: {
                          xs: "none",
                          md: "1px solid rgba(0, 0, 0, 0.08)",
                        },
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                        >
                          {selectedTicket.title}
                        </Typography>
                        <Chip
                          label={selectedTicket.category}
                          size="small"
                          color="primary"
                          sx={{
                            ml: 1,
                            height: 20,
                            "& .MuiChip-label": { fontSize: "0.7rem" },
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.75,
                          flexWrap: "wrap",
                          mt: 0.75,
                          mb: 1.5,
                        }}
                      >
                        {renderPriorityChip(selectedTicket.priority)}
                        <Chip
                          label={`Created: ${selectedTicket.date}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            "& .MuiChip-label": { fontSize: "0.7rem" },
                          }}
                        />
                        <Chip
                          label={`Last Updated: ${selectedTicket.lastUpdated}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            "& .MuiChip-label": { fontSize: "0.7rem" },
                          }}
                        />
                      </Box>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          bgcolor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: 1.5,
                          border: "1px solid rgba(0, 0, 0, 0.04)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={500}
                          gutterBottom
                        >
                          Description
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          {selectedTicket.description}
                        </Typography>
                      </Paper>

                      {selectedTicket.files &&
                        selectedTicket.files.length > 0 && (
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              mt: 1.5,
                              bgcolor: "rgba(255, 255, 255, 0.7)",
                              borderRadius: 1.5,
                              border: "1px solid rgba(0, 0, 0, 0.04)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontWeight={500}
                              gutterBottom
                            >
                              Attachments
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.75,
                                flexWrap: "wrap",
                              }}
                            >
                              {selectedTicket.files.map((file, index) => (
                                <Chip
                                  key={index}
                                  label={file}
                                  size="small"
                                  variant="outlined"
                                  icon={
                                    <AttachFileIcon sx={{ fontSize: 14 }} />
                                  }
                                  sx={{
                                    borderRadius: 1,
                                    bgcolor: "rgba(25, 118, 210, 0.04)",
                                    borderColor: "rgba(25, 118, 210, 0.12)",
                                    color: "primary.main",
                                    height: 24,
                                    "& .MuiChip-label": { fontSize: "0.7rem" },
                                  }}
                                />
                              ))}
                            </Box>
                          </Paper>
                        )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 0,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1.5 }}
                      >
                        Ticket Management
                      </Typography>

                      <Grid container spacing={1.5}>
                        <Grid item xs={12}>
                          <Box sx={{ mb: 1.5 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Assigned To
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              {selectedTicket.assignedTo ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 28,
                                      height: 28,
                                      fontSize: "0.75rem",
                                      bgcolor:
                                        getAgentNameById(
                                          selectedTicket.assignedTo
                                        ).status === "Available"
                                          ? "#4caf50"
                                          : getAgentNameById(
                                              selectedTicket.assignedTo
                                            ).status === "Busy"
                                          ? "#f44336"
                                          : "#ff9800",
                                    }}
                                  >
                                    {
                                      getAgentNameById(
                                        selectedTicket.assignedTo
                                      ).avatar
                                    }
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {
                                        getAgentNameById(
                                          selectedTicket.assignedTo
                                        ).name
                                      }
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: "0.65rem",
                                        color: "text.secondary",
                                      }}
                                    >
                                      {
                                        getAgentNameById(
                                          selectedTicket.assignedTo
                                        ).role
                                      }
                                    </Typography>
                                  </Box>
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontStyle: "italic" }}
                                >
                                  Unassigned
                                </Typography>
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setAssignDialogOpen(true)}
                                sx={{ fontSize: "0.7rem", py: 0.5 }}
                              >
                                {selectedTicket.assignedTo
                                  ? "Reassign"
                                  : "Assign"}
                              </Button>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ mb: 1.5 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Status
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              {renderStatusChip(selectedTicket.status)}
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setStatusDialogOpen(true)}
                                sx={{ fontSize: "0.7rem", py: 0.5 }}
                              >
                                Update
                              </Button>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ mb: 1.5 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Priority
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              {renderPriorityChip(selectedTicket.priority)}
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setPriorityDialogOpen(true)}
                                sx={{ fontSize: "0.7rem", py: 0.5 }}
                              >
                                Update
                              </Button>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1 }}
                          >
                            Actions
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
                              sx={{ fontSize: "0.7rem" }}
                              onClick={() => setTemplatesDrawerOpen(true)}
                            >
                              Templates
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ArchiveIcon sx={{ fontSize: 16 }} />}
                              sx={{ fontSize: "0.7rem" }}
                            >
                              Archive
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={
                                <NotificationsActiveIcon
                                  sx={{ fontSize: 16 }}
                                />
                              }
                              sx={{ fontSize: "0.7rem" }}
                            >
                              Notify
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Tabs for Conversation, Admin Notes and History */}
                <Box sx={{ p: 2.5 }}>
                  <Tabs
                    value={0}
                    aria-label="ticket detail tabs"
                    sx={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                      mb: 2,
                      "& .MuiTab-root": {
                        minWidth: "auto",
                        px: { xs: 1.5, sm: 2 },
                        py: 1,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        textTransform: "none",
                      },
                    }}
                  >
                    <Tab
                      label="Customer Conversation"
                      icon={<QuestionAnswerIcon sx={{ fontSize: 16 }} />}
                      iconPosition="start"
                    />
                    <Tab
                      label="Admin Notes"
                      icon={<NoteAddIcon sx={{ fontSize: 16 }} />}
                      iconPosition="start"
                    />
                    <Tab
                      label="History"
                      icon={<HistoryIcon sx={{ fontSize: 16 }} />}
                      iconPosition="start"
                    />
                  </Tabs>

                  {/* Conversation History */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1.5 }}
                    >
                      Response History
                    </Typography>

                    {/* Display conversation history */}
                    <Stack spacing={2} sx={{ mb: 2 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.75,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: "0.7rem",
                              bgcolor: "grey.600",
                            }}
                          >
                            {selectedTicket.id.split("-")[1].substring(0, 2)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                            >
                              Customer
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.65rem",
                                color: "text.secondary",
                              }}
                            >
                              {selectedTicket.date}
                            </Typography>
                          </Box>
                          <Chip
                            label="Initial Request"
                            size="small"
                            variant="filled"
                            sx={{
                              height: 16,
                              bgcolor: "rgba(0, 0, 0, 0.08)",
                              color: "text.secondary",
                              "& .MuiChip-label": {
                                px: 0.8,
                                fontSize: "0.6rem",
                              },
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.75rem", pl: 4.5 }}
                        >
                          {selectedTicket.description}
                        </Typography>
                      </Paper>

                      {selectedTicket.responseHistory &&
                        selectedTicket.responseHistory.map((response) => (
                          <Paper
                            key={response.id}
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 1.5,
                              bgcolor: "rgba(25, 118, 210, 0.05)",
                              border: "1px solid rgba(25, 118, 210, 0.12)",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.75,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 28,
                                  height: 28,
                                  fontSize: "0.7rem",
                                  bgcolor: "primary.main",
                                }}
                              >
                                {response.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                                >
                                  {response.author}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "0.65rem",
                                    color: "text.secondary",
                                  }}
                                >
                                  {new Date(response.date).toLocaleString()}
                                </Typography>
                              </Box>
                              <Chip
                                label="Support Team"
                                size="small"
                                variant="filled"
                                sx={{
                                  height: 16,
                                  bgcolor: "rgba(25, 118, 210, 0.1)",
                                  color: "primary.main",
                                  "& .MuiChip-label": {
                                    px: 0.8,
                                    fontSize: "0.6rem",
                                  },
                                }}
                              />
                              {!response.isPublic && (
                                <Chip
                                  label="Internal Only"
                                  size="small"
                                  variant="filled"
                                  sx={{
                                    height: 16,
                                    bgcolor: "rgba(244, 67, 54, 0.1)",
                                    color: "#f44336",
                                    "& .MuiChip-label": {
                                      px: 0.8,
                                      fontSize: "0.6rem",
                                    },
                                  }}
                                />
                              )}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.75rem", pl: 4.5 }}
                            >
                              {response.content}
                            </Typography>
                          </Paper>
                        ))}
                    </Stack>

                    {/* Admin Notes Section */}
                    {selectedTicket.adminNotes &&
                      selectedTicket.adminNotes.length > 0 && (
                        <>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}
                          >
                            Admin Notes
                          </Typography>
                          <Stack spacing={2} sx={{ mb: 2 }}>
                            {selectedTicket.adminNotes.map((note) => {
                              const noteType = NOTE_TYPES.find(
                                (t) => t.value === note.type
                              );
                              return (
                                <Paper
                                  key={note.id}
                                  elevation={0}
                                  sx={{
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    bgcolor: `${
                                      noteType ? noteType.color : "#5c6bc0"
                                    }15`,
                                    border: `1px solid ${
                                      noteType ? noteType.color : "#5c6bc0"
                                    }25`,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      mb: 0.75,
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 28,
                                        height: 28,
                                        fontSize: "0.7rem",
                                        bgcolor: noteType
                                          ? noteType.color
                                          : "#5c6bc0",
                                      }}
                                    >
                                      {note.author
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </Avatar>
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        {note.author}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontSize: "0.65rem",
                                          color: "text.secondary",
                                        }}
                                      >
                                        {new Date(note.date).toLocaleString()}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label={
                                        noteType
                                          ? noteType.label
                                          : "Internal Note"
                                      }
                                      size="small"
                                      variant="filled"
                                      sx={{
                                        height: 16,
                                        bgcolor: `${
                                          noteType ? noteType.color : "#5c6bc0"
                                        }25`,
                                        color: noteType
                                          ? noteType.color
                                          : "#5c6bc0",
                                        "& .MuiChip-label": {
                                          px: 0.8,
                                          fontSize: "0.6rem",
                                        },
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: "0.75rem", pl: 4.5 }}
                                  >
                                    {note.content}
                                  </Typography>
                                </Paper>
                              );
                            })}
                          </Stack>
                        </>
                      )}

                    {/* Response Input */}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1.5, mt: 3 }}
                    >
                      Send Response
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ position: "relative", mb: 2 }}>
                        <ReactQuill
                          theme="snow"
                          value={responseText}
                          onChange={setResponseText}
                          modules={quillModules}
                          placeholder="Type your response to the customer here..."
                          style={{
                            borderRadius: 8,
                            marginBottom: 8,
                            fontSize: "0.8rem",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
                            onClick={() => setTemplatesDrawerOpen(true)}
                            sx={{ mr: 1 }}
                          >
                            Use Template
                          </Button>
                          <FormControlLabel
                            control={<Switch size="small" defaultChecked />}
                            label="Send email notification"
                            sx={{
                              ml: 0.5,
                              "& .MuiFormControlLabel-label": {
                                fontSize: "0.75rem",
                                color: "text.secondary",
                              },
                            }}
                          />
                        </Box>
                        <Box>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1 }}
                            disabled={isSendingResponse || !responseText.trim()}
                            onClick={() =>
                              handleSendResponse(
                                selectedTicket.id,
                                responseText,
                                false
                              )
                            }
                          >
                            Save as Draft
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={<SendIcon />}
                            disabled={isSendingResponse || !responseText.trim()}
                            onClick={() =>
                              handleSendResponse(
                                selectedTicket.id,
                                responseText,
                                true
                              )
                            }
                          >
                            Send Response
                          </Button>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Admin Note Input */}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1.5 }}
                    >
                      Add Admin Note
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add an internal note about this ticket (not visible to customer)"
                        value={adminNoteText}
                        onChange={(e) => setAdminNoteText(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1.5 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={adminNoteType}
                            onChange={(e) => setAdminNoteType(e.target.value)}
                          >
                            {NOTE_TYPES.map((type) => (
                              <FormControlLabel
                                key={type.value}
                                value={type.value}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      color: type.color,
                                      "&.Mui-checked": {
                                        color: type.color,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography variant="caption">
                                    {type.label}
                                  </Typography>
                                }
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          endIcon={<SaveIcon />}
                          disabled={!adminNoteText.trim() || loading}
                          onClick={() =>
                            handleAddAdminNote(
                              selectedTicket.id,
                              adminNoteText,
                              adminNoteType
                            )
                          }
                        >
                          Add Note
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>

              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  onClick={() => setTicketDetailOpen(false)}
                  variant="outlined"
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Assign Ticket Dialog */}
        <Dialog
          open={assignDialogOpen && selectedTicket !== null}
          onClose={() => !loading && setAssignDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Assign Ticket {selectedTicket?.id}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              {selectedTicket?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select a support team member to handle this ticket.
            </Typography>

            <Box sx={{ mt: 1 }}>
              {SUPPORT_TEAM.map((agent) => (
                <Paper
                  key={agent.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: 1,
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    bgcolor:
                      selectedTicket?.assignedTo === agent.id
                        ? "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  onClick={() =>
                    handleAssignTicket(selectedTicket.id, agent.id)
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor:
                          agent.status === "Available"
                            ? "#4caf50"
                            : agent.status === "Busy"
                            ? "#f44336"
                            : "#ff9800",
                      }}
                    >
                      {agent.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {agent.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {agent.role} • {agent.department}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Chip
                          label={agent.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            bgcolor:
                              agent.status === "Available"
                                ? "rgba(76, 175, 80, 0.1)"
                                : agent.status === "Busy"
                                ? "rgba(244, 67, 54, 0.1)"
                                : "rgba(255, 152, 0, 0.1)",
                            color:
                              agent.status === "Available"
                                ? "#4caf50"
                                : agent.status === "Busy"
                                ? "#f44336"
                                : "#ff9800",
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {agent.tickets} active tickets
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <ArrowForwardIcon
                    sx={{ color: "action.disabled", fontSize: 16 }}
                  />
                </Paper>
              ))}

              <Divider sx={{ my: 1.5 }} />

              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                sx={{ mt: 1, borderStyle: "dashed" }}
                onClick={() => handleAssignTicket(selectedTicket.id, null)}
              >
                Unassign Ticket
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog
          open={statusDialogOpen && selectedTicket !== null}
          onClose={() => !loading && setStatusDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Update Ticket Status</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              {selectedTicket?.id}: {selectedTicket?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current status: <strong>{selectedTicket?.status}</strong>
            </Typography>

            <Box sx={{ mt: 1 }}>
              {STATUSES.map((status) => (
                <Paper
                  key={status.value}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: 1,
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    bgcolor:
                      selectedTicket?.status === status.value
                        ? "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  onClick={() =>
                    handleStatusChange(selectedTicket.id, status.value)
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: `${status.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: status.color,
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {status.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {status.value === "Open"
                          ? "Ticket has been opened but not yet addressed."
                          : status.value === "In Progress"
                          ? "Work on the ticket has begun."
                          : status.value === "Resolved"
                          ? "Issue has been resolved, awaiting confirmation."
                          : "Ticket has been closed and archived."}
                      </Typography>
                    </Box>
                  </Box>
                  {selectedTicket?.status === status.value ? (
                    <CheckCircleIcon
                      sx={{ color: status.color, fontSize: 20 }}
                    />
                  ) : (
                    <ArrowForwardIcon
                      sx={{ color: "action.disabled", fontSize: 16 }}
                    />
                  )}
                </Paper>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Priority Change Dialog */}
        <Dialog
          open={priorityDialogOpen && selectedTicket !== null}
          onClose={() => !loading && setPriorityDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Update Ticket Priority</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              {selectedTicket?.id}: {selectedTicket?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current priority: <strong>{selectedTicket?.priority}</strong>
            </Typography>

            <Box sx={{ mt: 1 }}>
              {PRIORITIES.map((priority) => (
                <Paper
                  key={priority.value}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: 1,
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    bgcolor:
                      selectedTicket?.priority === priority.value
                        ? "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  onClick={() =>
                    handlePriorityChange(selectedTicket.id, priority.value)
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: `${priority.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: priority.color,
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {priority.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {priority.value === "Low"
                          ? "Minor issues, resolve when time permits."
                          : priority.value === "Medium"
                          ? "Standard priority, resolve in normal timeframe."
                          : priority.value === "High"
                          ? "Important issue, prioritize above standard tickets."
                          : "Critical issue requiring immediate attention."}
                      </Typography>
                    </Box>
                  </Box>
                  {selectedTicket?.priority === priority.value ? (
                    <CheckCircleIcon
                      sx={{ color: priority.color, fontSize: 20 }}
                    />
                  ) : (
                    <ArrowForwardIcon
                      sx={{ color: "action.disabled", fontSize: 16 }}
                    />
                  )}
                </Paper>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPriorityDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Team Management Dialog */}
        <Dialog
          open={teamManagementOpen}
          onClose={() => setTeamManagementOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
            Support Team Management
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Support Team Members
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  size="small"
                >
                  Add Team Member
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Team Member</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Active Tickets</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {SUPPORT_TEAM.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor:
                                  agent.status === "Available"
                                    ? "#4caf50"
                                    : agent.status === "Busy"
                                    ? "#f44336"
                                    : "#ff9800",
                              }}
                            >
                              {agent.avatar}
                            </Avatar>
                            <Typography variant="body2">
                              {agent.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{agent.role}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={agent.department}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={agent.status}
                            size="small"
                            sx={{
                              height: 24,
                              bgcolor:
                                agent.status === "Available"
                                  ? "rgba(76, 175, 80, 0.1)"
                                  : agent.status === "Busy"
                                  ? "rgba(244, 67, 54, 0.1)"
                                  : "rgba(255, 152, 0, 0.1)",
                              color:
                                agent.status === "Available"
                                  ? "#4caf50"
                                  : agent.status === "Busy"
                                  ? "#f44336"
                                  : "#ff9800",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {agent.tickets}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Team Performance
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Ticket Resolution Rate
                    </Typography>
                    <Box
                      sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Chart visualization would go here
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Average Resolution Time
                    </Typography>
                    <Box
                      sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Chart visualization would go here
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}
          >
            <Button onClick={() => setTeamManagementOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Response Templates Drawer */}
        <Drawer
          anchor="right"
          open={templatesDrawerOpen}
          onClose={() => setTemplatesDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "400px" },
              p: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
              Response Templates
            </Typography>
            <IconButton
              onClick={() => setTemplatesDrawerOpen(false)}
              size="small"
            >
              <GridCloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <TextField
            placeholder="Search templates..."
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Suggested for this ticket
            </Typography>

            {RESPONSE_TEMPLATES.filter(
              (t) => t.category === (selectedTicket?.category || "IT")
            ).map((template) => (
              <Paper
                key={template.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                  },
                }}
                onClick={() => handleApplyTemplate(template)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {template.title}
                  </Typography>
                  <Chip
                    label={template.category}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.65rem" }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontSize: "0.75rem",
                  }}
                >
                  {template.content}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              All Templates
            </Typography>

            {RESPONSE_TEMPLATES.filter(
              (t) => t.category !== (selectedTicket?.category || "IT")
            ).map((template) => (
              <Paper
                key={template.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                  },
                }}
                onClick={() => handleApplyTemplate(template)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {template.title}
                  </Typography>
                  <Chip
                    label={template.category}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.65rem" }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontSize: "0.75rem",
                  }}
                >
                  {template.content}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Box
            sx={{
              mt: "auto",
              pt: 2,
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddCircleIcon />}
              onClick={() => {}}
            >
              Create New Template
            </Button>
          </Box>
        </Drawer>

        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={5000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              borderRadius: 1.5,
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.15)",
              "& .MuiAlert-message": {
                fontSize: "0.8rem",
              },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

// Export the component for use in the application
export default AdminTicketManagement;

// Mock data export for importing in other components
// export const MOCK_TICKETS = [
//   {
//     id: "TKT-5724",
//     title: "Network Issue",
//     category: "IT",
//     priority: "High",
//     status: "Open",
//     date: "2025-04-14",
//     description:
//       "Unable to connect to the company network. Getting timeout errors when trying to access internal resources.",
//     files: ["network_log.txt", "screenshot.png"],
//   },
//   {
//     id: "TKT-8431",
//     title: "Software Bug",
//     category: "Development",
//     priority: "Medium",
//     status: "In Progress",
//     date: "2025-04-13",
//     description:
//       "Found a bug in the user registration flow that prevents users from completing the form.",
//     files: ["bug_report.docx"],
//   },
//   {
//     id: "TKT-2196",
//     title: "User Access",
//     category: "HR",
//     priority: "Low",
//     status: "Resolved",
//     date: "2025-04-12",
//     description:
//       "Need access to the HR portal for new employee onboarding process.",
//     files: [],
//   },
//   {
//     id: "TKT-3847",
//     title: "Server Down",
//     category: "IT",
//     priority: "Critical",
//     status: "Open",
//     date: "2025-04-11",
//     description:
//       "Main production server is down. All users are affected and cannot access the application.",
//     files: ["server_logs.txt", "error_screenshot.jpg"],
//   },
//   {
//     id: "TKT-1562",
//     title: "Payment Issue",
//     category: "Finance",
//     priority: "Medium",
//     status: "Resolved",
//     date: "2025-04-10",
//     description:
//       "Customer payment processing is delayed due to gateway timeout errors.",
//     files: ["transaction_id.pdf"],
//   },
//   {
//     id: "TKT-6712",
//     title: "Database Connection",
//     category: "Development",
//     priority: "High",
//     status: "In Progress",
//     date: "2025-04-09",
//     description:
//       "Database connection is intermittently failing causing sporadic application errors.",
//     files: ["error_log.txt"],
//   },
//   {
//     id: "TKT-4290",
//     title: "Email Delivery Failure",
//     category: "IT",
//     priority: "Medium",
//     status: "Closed",
//     date: "2025-04-08",
//     description:
//       "Notification emails are not being delivered to external domains.",
//     files: [],
//   },
//   {
//     id: "TKT-9371",
//     title: "Payroll Discrepancy",
//     category: "Finance",
//     priority: "High",
//     status: "Resolved",
//     date: "2025-04-07",
//     description:
//       "Overtime hours not correctly calculated in the latest payroll run.",
//     files: ["timesheet.xlsx"],
//   },
// ];
