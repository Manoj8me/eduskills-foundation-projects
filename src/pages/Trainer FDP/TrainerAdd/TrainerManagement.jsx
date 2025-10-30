import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Alert,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";

import AddTrainerDrawer from "./AddTrainerDrawer";
import DeleteTrainerModal from "./DeleteTrainerModal";
import EditTrainerDrawer from "./EditTrainerDrawer";
import TrainerRow from "./TrainerRow";
import api from "../../../services/api";
import { BASE_URL } from "../../../services/configUrls";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#0088cc",
    },
    secondary: {
      main: "#19857b",
    },
    background: {
      default: "#f8f9fa",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function TrainerManagement() {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchEmail, setSearchEmail] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [trainerToEdit, setTrainerToEdit] = useState(null);

  // Fetch trainers from API
  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await api.get(`${BASE_URL}/admin/trainers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data) {
        const processedTrainers = response.data.map((trainer) => ({
          ...trainer,
          trainer_id:
            trainer.trainer_id || trainer.id || Math.random().toString(),
          fullname: trainer.fullname || trainer.name || "N/A",
          email: trainer.email || "N/A",
          phone: trainer.phone || "N/A",
          domains: trainer.domains || [],
        }));

        setTrainers(processedTrainers);
        setFilteredTrainers(processedTrainers);
      } else {
        setError("Failed to fetch trainers data. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching trainers:", err);

      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access this data.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch trainers data. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter trainers based on email search
  useEffect(() => {
    if (searchEmail.trim() === "") {
      setFilteredTrainers(trainers);
    } else {
      const filtered = trainers.filter(
        (trainer) =>
          (trainer.email &&
            trainer.email.toLowerCase().includes(searchEmail.toLowerCase())) ||
          (trainer.fullname &&
            trainer.fullname.toLowerCase().includes(searchEmail.toLowerCase()))
      );
      setFilteredTrainers(filtered);
    }
    setPage(0);
  }, [searchEmail, trainers]);

  // Fetch trainers on component mount
  useEffect(() => {
    fetchTrainers();
  }, []);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search email change
  const handleSearchEmailChange = (event) => {
    setSearchEmail(event.target.value);
  };

  // Handle expand/collapse row
  const handleToggleExpand = (trainerId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(trainerId)) {
      newExpandedRows.delete(trainerId);
    } else {
      newExpandedRows.add(trainerId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Handle delete click
  const handleDeleteClick = (trainer) => {
    setTrainerToDelete(trainer);
    setDeleteModalOpen(true);
  };

  // Handle edit click
  const handleEditClick = (trainer) => {
    setTrainerToEdit(trainer);
    setEditDrawerOpen(true);
  };

  // Handle edit success
  const handleTrainerUpdated = () => {
    fetchTrainers();
    setSuccessMessage("Trainer updated successfully!");
    setEditDrawerOpen(false);
    setTrainerToEdit(null);
  };

  // Close edit drawer
  const handleCloseEditDrawer = () => {
    setEditDrawerOpen(false);
    setTrainerToEdit(null);
  };

  // Handle delete success
  const handleDeleteSuccess = (trainerId) => {
    // Remove trainer from state
    setTrainers((prev) =>
      prev.filter((trainer) => trainer.trainer_id !== trainerId)
    );
    setFilteredTrainers((prev) =>
      prev.filter((trainer) => trainer.trainer_id !== trainerId)
    );
    setSuccessMessage("Trainer deleted successfully!");
    setDeleteModalOpen(false);
    setTrainerToDelete(null);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setTrainerToDelete(null);
  };

  // Clear error message
  const handleCloseError = () => {
    setError(null);
  };

  // Clear success message
  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };

  // Handle refresh data
  const handleRefresh = () => {
    fetchTrainers();
  };

  // Handle trainer added
  const handleTrainerAdded = () => {
    fetchTrainers();
    setSuccessMessage("Trainer added successfully!");
  };

  // Handle open drawer
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  // Handle close drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Get current page data
  const currentPageData = filteredTrainers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            minHeight: "100vh",
            animation: "fadeIn 0.5s ease-in-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0 },
              "100%": { opacity: 1 },
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary"
            >
              Trainer Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Trainers: {filteredTrainers.length}
            </Typography>
          </Box>

          {/* Search Section */}
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Search by email or name..."
                    value={searchEmail}
                    onChange={handleSearchEmailChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, maxWidth: 400 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {searchEmail &&
                      `${filteredTrainers.length} result(s) found`}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDrawer}
                  sx={{
                    minWidth: 150,
                    height: 56,
                    fontWeight: 600,
                  }}
                >
                  Add Trainer
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Main Table */}
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        minWidth: 200,
                      }}
                    >
                      Full Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        minWidth: 250,
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        minWidth: 150,
                      }}
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        minWidth: 300,
                      }}
                    >
                      Domains
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        width: 80,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Loading trainers...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : currentPageData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="textSecondary">
                          {searchEmail
                            ? "No trainers found matching your search."
                            : "No trainers available."}
                        </Typography>
                        {!searchEmail && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 1 }}
                          >
                            <span
                              style={{
                                color: theme.palette.primary.main,
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={handleRefresh}
                            >
                              Click here to refresh
                            </span>
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((trainer) => (
                      <TrainerRow
                        key={trainer.trainer_id}
                        trainer={trainer}
                        isExpanded={expandedRows.has(trainer.trainer_id)}
                        onToggleExpand={handleToggleExpand}
                        onDeleteClick={handleDeleteClick}
                        onEditClick={handleEditClick}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredTrainers.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredTrainers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{
                  borderTop: 1,
                  borderColor: "divider",
                  backgroundColor: theme.palette.background.default,
                }}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
              />
            )}
          </Paper>

          {/* Error notification */}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>

          {/* Success notification */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={4000}
            onClose={handleCloseSuccess}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSuccess}
              severity="success"
              sx={{ width: "100%" }}
            >
              {successMessage}
            </Alert>
          </Snackbar>

          {/* Add Trainer Drawer */}
          <AddTrainerDrawer
            open={drawerOpen}
            onClose={handleCloseDrawer}
            onTrainerAdded={handleTrainerAdded}
          />

          {/* Edit Trainer Drawer */}
          {trainerToEdit && (
            <EditTrainerDrawer
              open={editDrawerOpen}
              onClose={handleCloseEditDrawer}
              trainer={trainerToEdit}
              onTrainerUpdated={handleTrainerUpdated}
            />
          )}

          {/* Delete Trainer Modal */}
          {trainerToDelete && (
            <DeleteTrainerModal
              open={deleteModalOpen}
              onClose={handleCloseDeleteModal}
              trainer={trainerToDelete}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default TrainerManagement;
