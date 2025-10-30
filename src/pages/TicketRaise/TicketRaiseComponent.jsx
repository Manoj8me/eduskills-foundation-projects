import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Container,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
  Button,
  Fab,
  Drawer,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import TicketCreateComponent from "./TicketCreateComponent";
import ModifiedTicketListComponent from "./TicketListComponent";


// Mock data for initial tickets
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
  },
];

// Create compact modern theme
const compactTheme = createTheme({
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

const TicketManagementSystem = () => {
  // State for tickets
  const [tickets, setTickets] = useState(MOCK_TICKETS);

  // State for loading
  const [loading, setLoading] = useState(false);

  // State for the create ticket drawer
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  // State for toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Generate a new ticket ID
  const generateTicketId = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `TKT-${randomId}`;
  };

  // Handler for ticket creation
  const handleTicketCreate = (newTicket) => {
    setLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setTickets([newTicket, ...tickets]);
      setCreateDrawerOpen(false);
      setLoading(false);

      // Show success notification
      setToast({
        open: true,
        message: `Ticket ${newTicket.id} created successfully!`,
        severity: "success",
      });
    }, 1000);
  };

  // Handle toast close
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <ThemeProvider theme={compactTheme}>
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
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 64,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  My Support Tickets
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={() => setCreateDrawerOpen(true)}
                sx={{
                  px: 2,
                  py: 0.75,
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                  boxShadow: "0px 2px 4px rgba(25, 118, 210, 0.25)",
                }}
              >
                Create Ticket
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <Container
            maxWidth="lg"
            sx={{
              py: { xs: 2, sm: 3 },
              px: { xs: 1.5, sm: 2 },
            }}
          >
            {/* Modified Ticket List Component */}
            <ModifiedTicketListComponent tickets={tickets} />
          </Container>
        </Box>

        {/* Floating Action Button for mobile */}
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { sm: "none" },
            zIndex: 5,
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setCreateDrawerOpen(true)}
            sx={{
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              boxShadow: "0px 3px 5px rgba(25, 118, 210, 0.3)",
            }}
          >
            <AddCircleIcon />
          </Fab>
        </Box>

        {/* Create Ticket Drawer */}
        <Drawer
          anchor="right"
          open={createDrawerOpen}
          onClose={() => !loading && setCreateDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "50%" },
              maxWidth: "100%",
              p: { xs: 1, sm: 2 },
            },
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
              Create New Ticket
            </Typography>
            <IconButton
              onClick={() => !loading && setCreateDrawerOpen(false)}
              disabled={loading}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <TicketCreateComponent onTicketCreate={handleTicketCreate} />
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

export default TicketManagementSystem;
