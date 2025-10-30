import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Container,
} from "@mui/material";
import SupportDashboardComponent from "./SupportDashboardComponent";
import TicketDetailsViewComponent from "./TicketDetailsViewComponent";

// Mock data for initial tickets (expanded from original data)
const MOCK_TICKETS = [
  {
    id: "TKT-5724",
    title: "Network Issue",
    category: "IT",
    priority: "High",
    status: "Open",
    date: "2025-04-14",
    description:
      "Unable to connect to the company network. Getting timeout errors when trying to access internal resources.",
    files: ["network_log.txt", "screenshot.png"],
    staffNotes: "Need to check firewall settings",
  },
  {
    id: "TKT-8431",
    title: "Software Bug",
    category: "Development",
    priority: "Medium",
    status: "In Progress",
    date: "2025-04-13",
    description:
      "Found a bug in the user registration flow that prevents users from completing the form.",
    files: ["bug_report.docx"],
    staffNotes: "Bug confirmed in testing environment",
  },
  {
    id: "TKT-2196",
    title: "User Access",
    category: "HR",
    priority: "Low",
    status: "Resolved",
    date: "2025-04-12",
    description:
      "Need access to the HR portal for new employee onboarding process.",
    files: [],
    staffNotes: "Access granted on April 12",
  },
  {
    id: "TKT-3847",
    title: "Server Down",
    category: "IT",
    priority: "Critical",
    status: "Open",
    date: "2025-04-11",
    description:
      "Main production server is down. All users are affected and cannot access the application.",
    files: ["server_logs.txt", "error_screenshot.jpg"],
    staffNotes: "Investigating memory leak issues",
  },
  {
    id: "TKT-1562",
    title: "Payment Issue",
    category: "Finance",
    priority: "Medium",
    status: "Resolved",
    date: "2025-04-10",
    description:
      "Customer payment processing is delayed due to gateway timeout errors.",
    files: ["transaction_id.pdf"],
    staffNotes: "Payment provider confirmed issue on their end",
  },
  {
    id: "TKT-6712",
    title: "Database Connection",
    category: "Development",
    priority: "High",
    status: "In Progress",
    date: "2025-04-09",
    description:
      "Database connection is intermittently failing causing sporadic application errors.",
    files: ["error_log.txt"],
    staffNotes: "Database server CPU spiking during failures",
  },
  {
    id: "TKT-4290",
    title: "Email Delivery Failure",
    category: "IT",
    priority: "Medium",
    status: "Closed",
    date: "2025-04-08",
    description:
      "Notification emails are not being delivered to external domains.",
    files: [],
    staffNotes: "SMTP settings reconfigured successfully",
  },
  {
    id: "TKT-9371",
    title: "Payroll Discrepancy",
    category: "Finance",
    priority: "High",
    status: "Resolved",
    date: "2025-04-07",
    description:
      "Overtime hours not correctly calculated in the latest payroll run.",
    files: ["timesheet.xlsx"],
    staffNotes: "Formula error in calculation spreadsheet",
  },
  {
    id: "TKT-2145",
    title: "Customer Data Migration",
    category: "Development",
    priority: "Medium",
    status: "Open",
    date: "2025-04-14",
    description:
      "Need to migrate customer data from legacy system to new platform with minimal downtime.",
    files: ["migration_plan.docx", "customer_records.xlsx"],
    staffNotes: "Planning phase complete, ready for test migration",
  },
  {
    id: "TKT-7890",
    title: "Mobile App Crash",
    category: "Development",
    priority: "High",
    status: "Open",
    date: "2025-04-15",
    description:
      "Users reporting the mobile app crashes when trying to access the profile section.",
    files: ["crash_log.txt"],
    staffNotes: "Only affecting iOS devices on version 15+",
  },
  {
    id: "TKT-6543",
    title: "Meeting Room Booking",
    category: "Operations",
    priority: "Low",
    status: "In Progress",
    date: "2025-04-12",
    description:
      "Need to set up calendar integration for meeting room booking system.",
    files: [],
    staffNotes: "Calendar API endpoints identified",
  },
  {
    id: "TKT-8765",
    title: "Marketing Campaign Setup",
    category: "Marketing",
    priority: "Medium",
    status: "Open",
    date: "2025-04-15",
    description:
      "Request for new email campaign setup for product launch next month.",
    files: ["campaign_brief.pdf"],
    staffNotes: "Pending creative assets from design team",
  },
];

// Create compact modern theme
const supportTheme = createTheme({
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
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13, // Smaller base font size
    h4: {
      fontWeight: 600,
      fontSize: "1.4rem", // Smaller heading
    },
    h6: {
      fontWeight: 600,
      fontSize: "0.95rem", // Smaller sub-heading
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

const OptimizedSupportTicketManagementSystem = () => {
  // State for tickets
  const [tickets, setTickets] = useState(MOCK_TICKETS);

  // State for selected ticket view
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState(false);

  // State for loading
  const [loading, setLoading] = useState(false);

  // State for toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle opening ticket details
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketDetailsOpen(true);
  };

  // Handle closing ticket details
  const handleCloseTicketDetails = () => {
    setTicketDetailsOpen(false);
  };

  // Handle updating ticket
  const handleUpdateTicket = (updatedTicket) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      );

      setTickets(updatedTickets);
      setSelectedTicket(updatedTicket);
      setLoading(false);

      setToast({
        open: true,
        message: `Ticket ${updatedTicket.id} updated successfully`,
        severity: "success",
      });
    }, 800);
  };

  // Handle updating status
  const handleUpdateStatus = (ticketId, newStatus) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      );

      const updatedTicket = updatedTickets.find(
        (ticket) => ticket.id === ticketId
      );

      setTickets(updatedTickets);
      setSelectedTicket(updatedTicket);
      setLoading(false);

      setToast({
        open: true,
        message: `Ticket status updated to ${newStatus}`,
        severity: "success",
      });
    }, 800);
  };

  // Handle adding comment
  const handleAddComment = (ticketId, comment) => {
    // In a real application, this would send the comment to the API
    // For this demo, we simply show a toast notification
    setToast({
      open: true,
      message: "Comment added successfully",
      severity: "success",
    });
  };

  // Handle toast close
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <ThemeProvider theme={supportTheme}>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1400px", // Set maximum width
          px: { xs: 1, sm: 2, md: 3 },
          py: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            mb: 3,
          }}
        >
          Support Staff Portal
        </Typography>

        {/* Main Dashboard Component */}
        <SupportDashboardComponent
          tickets={tickets}
          onViewTicket={handleViewTicket}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Ticket Details Dialog */}
        {selectedTicket && (
          <TicketDetailsViewComponent
            ticket={selectedTicket}
            isOpen={ticketDetailsOpen}
            onClose={handleCloseTicketDetails}
            onUpdateTicket={handleUpdateTicket}
            onAddComment={handleAddComment}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

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
      </Container>
    </ThemeProvider>
  );
};

export default OptimizedSupportTicketManagementSystem;
