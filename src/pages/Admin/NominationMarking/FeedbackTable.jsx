import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Alert,
  Snackbar,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Modal,
  Grid,
  Chip,
  IconButton,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  Visibility,
  Close,
  Star,
  Search,
  FilterList,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// Create a theme instance (using your existing theme)
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
    fontFamily: '"Poppins","Roboto", "Helvetica", "Arial", sans-serif',
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

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  background: "#ffffff",
  overflow: "hidden",
  border: "1px solid rgba(0, 136, 204, 0.08)",
}));

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 900,
  maxHeight: "90vh",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  padding: 0,
  outline: "none",
  overflow: "hidden",
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2, 3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxHeight: "70vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c1c1c1",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "#a8a8a8",
    },
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: "#f8f9fa",
  border: "1px solid rgba(0, 136, 204, 0.08)",
}));

const RatingDisplay = ({ rating }) => {
  const numRating = parseInt(rating);
  const stars = [];

  for (let i = 1; i <= 10; i++) {
    stars.push(
      <Star
        key={i}
        sx={{
          fontSize: 16,
          color:
            i <= numRating
              ? theme.palette.warning.main
              : theme.palette.grey[300],
        }}
      />
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ display: "flex" }}>{stars}</Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {rating}/10
      </Typography>
    </Box>
  );
};

const getRatingColor = (rating) => {
  if (!rating || typeof rating !== "string") {
    return "default";
  }

  switch (rating.toLowerCase()) {
    case "excellent":
      return "success";
    case "good":
      return "primary";
    case "fair":
    case "average":
      return "warning";
    case "poor":
      return "error";
    default:
      return "default";
  }
};

function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [availableDesignations, setAvailableDesignations] = useState([]);
  const [availableInstitutes, setAvailableInstitutes] = useState([]);

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  // Filter data whenever search term or filters change
  useEffect(() => {
    filterData();
  }, [feedbackData, searchTerm, selectedDesignations, selectedInstitutes]);

  const filterData = () => {
    let filtered = [...feedbackData];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(searchLower)) ||
          (item.email && item.email.toLowerCase().includes(searchLower)) ||
          (item.institute &&
            item.institute.toLowerCase().includes(searchLower)) ||
          (item.designation &&
            item.designation.toLowerCase().includes(searchLower))
      );
    }

    // Designation filter
    if (selectedDesignations.length > 0) {
      filtered = filtered.filter((item) =>
        selectedDesignations.includes(item.designation)
      );
    }

    // Institute filter
    if (selectedInstitutes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedInstitutes.includes(item.institute)
      );
    }

    setFilteredData(filtered);
    setPage(0); // Reset page when filtering
  };

  const extractUniqueValues = (data) => {
    const designations = [
      ...new Set(data.map((item) => item.designation).filter(Boolean)),
    ].sort();
    const institutes = [
      ...new Set(data.map((item) => item.institute).filter(Boolean)),
    ].sort();

    setAvailableDesignations(designations);
    setAvailableInstitutes(institutes);
  };

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await api.get(`${BASE_URL}/admin/get-feedback`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        setFeedbackData(response.data);
        extractUniqueValues(response.data);
      } else {
        setFeedbackData([]);
        setAvailableDesignations([]);
        setAvailableInstitutes([]);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);

      // Handle different error scenarios
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access this data.");
      } else if (err.response?.status === 404) {
        setError("Feedback endpoint not found.");
      } else {
        setError("Failed to fetch feedback data. Please try again later.");
      }

      setFeedbackData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleRetry = () => {
    fetchFeedbackData();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDesignationChange = (event) => {
    const value = event.target.value;
    setSelectedDesignations(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleInstituteChange = (event) => {
    const value = event.target.value;
    setSelectedInstitutes(typeof value === "string" ? value.split(",") : value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDesignations([]);
    setSelectedInstitutes([]);
  };

  const paginatedData = filteredData.slice(
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
              "0%": {
                opacity: 0,
              },
              "100%": {
                opacity: 1,
              },
            },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: "center",
            }}
          >
            Connect Feedback
          </Typography>

          <StyledPaper>
            {/* Search and Filter Section */}
            <FilterContainer>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, institute, or designation..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <Search
                          sx={{ color: theme.palette.grey[400], mr: 1 }}
                        />
                      ),
                    }}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Designation</InputLabel>
                    <Select
                      multiple
                      value={selectedDesignations}
                      onChange={handleDesignationChange}
                      input={<OutlinedInput label="Designation" />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {availableDesignations.map((designation) => (
                        <MenuItem key={designation} value={designation}>
                          <Checkbox
                            checked={
                              selectedDesignations.indexOf(designation) > -1
                            }
                          />
                          <ListItemText primary={designation} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Institute</InputLabel>
                    <Select
                      multiple
                      value={selectedInstitutes}
                      onChange={handleInstituteChange}
                      input={<OutlinedInput label="Institute" />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {availableInstitutes.map((institute) => (
                        <MenuItem key={institute} value={institute}>
                          <Checkbox
                            checked={selectedInstitutes.indexOf(institute) > -1}
                          />
                          <ListItemText primary={institute} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    fullWidth
                    size="small"
                    startIcon={<FilterList />}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>

              {(searchTerm ||
                selectedDesignations.length > 0 ||
                selectedInstitutes.length > 0) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Showing {filteredData.length} of {feedbackData.length}{" "}
                    results
                  </Typography>
                </Box>
              )}
            </FilterContainer>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  gap: 2,
                }}
              >
                <CircularProgress size={60} />
                <Typography variant="body1" color="textSecondary">
                  Loading feedback data...
                </Typography>
              </Box>
            ) : error ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="error">
                  Error Loading Data
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ maxWidth: 400 }}
                >
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleRetry}
                  sx={{ mt: 2 }}
                >
                  Retry
                </Button>
              </Box>
            ) : feedbackData.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  No Feedback Data Found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  There are no feedback submissions to display at this time.
                </Typography>
                <Button variant="outlined" onClick={handleRetry} sx={{ mt: 2 }}>
                  Refresh
                </Button>
              </Box>
            ) : filteredData.length === 0 &&
              (searchTerm ||
                selectedDesignations.length > 0 ||
                selectedInstitutes.length > 0) ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 300,
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  No Results Found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  No feedback matches your current search criteria.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{ mt: 2 }}
                >
                  Clear Filters
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer
                  sx={{
                    maxHeight: 600,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      height: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#c1c1c1",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#a8a8a8",
                      },
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: theme.palette.grey[50] }}
                      >
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                        >
                          Institute
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                        >
                          Designation
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                          align="center"
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((feedback, index) => (
                        <TableRow
                          key={feedback.email + index}
                          sx={{
                            "&:hover": {
                              backgroundColor: theme.palette.grey[50],
                            },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {feedback.name || "N/A"}
                          </TableCell>
                          <TableCell>{feedback.email || "N/A"}</TableCell>
                          <TableCell sx={{ maxWidth: 250 }}>
                            <Typography
                              variant="body2"
                              noWrap
                              title={feedback.institute}
                              sx={{ cursor: "help" }}
                            >
                              {feedback.institute || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>{feedback.designation || "N/A"}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewDetails(feedback)}
                              sx={{
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.main,
                                  color: "white",
                                },
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    mt: 2,
                  }}
                />
              </>
            )}
          </StyledPaper>

          {/* Feedback Details Modal */}
          <Modal open={modalOpen} onClose={handleCloseModal}>
            <ModalBox>
              <ModalHeader>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  Feedback Details
                </Typography>
                <IconButton onClick={handleCloseModal} sx={{ color: "white" }}>
                  <Close />
                </IconButton>
              </ModalHeader>

              {selectedFeedback && (
                <ModalContent>
                  <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: theme.palette.primary.main }}
                      >
                        Basic Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedFeedback.name || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {selectedFeedback.email || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Institute
                          </Typography>
                          <Typography variant="body1">
                            {selectedFeedback.institute || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Designation
                          </Typography>
                          <Typography variant="body1">
                            {selectedFeedback.designation || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Mobile Number
                          </Typography>
                          <Typography variant="body1">
                            {selectedFeedback.mobile_number || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Registration Code
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontFamily: "monospace" }}
                          >
                            {selectedFeedback.registrationCode || "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Overall Rating */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: theme.palette.primary.main }}
                      >
                        Overall Rating
                      </Typography>
                      {selectedFeedback.rating && (
                        <RatingDisplay rating={selectedFeedback.rating} />
                      )}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        Expectations Met:{" "}
                        <strong>
                          {selectedFeedback.expectations || "N/A"}
                        </strong>
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    {/* Speaker Ratings */}
                    {selectedFeedback.speaker_ratings &&
                      selectedFeedback.speaker_ratings.length > 0 && (
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, color: theme.palette.primary.main }}
                          >
                            Speaker Ratings (
                            {selectedFeedback.speaker_ratings.length} speakers)
                          </Typography>
                          <Grid container spacing={2}>
                            {selectedFeedback.speaker_ratings.map(
                              (speaker, index) => (
                                <Grid item xs={12} key={index}>
                                  <Box
                                    sx={{
                                      p: 2,
                                      border: `1px solid ${theme.palette.divider}`,
                                      borderRadius: 1,
                                      mb: 1,
                                    }}
                                  >
                                    <Grid
                                      container
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Grid item xs={12} md={4}>
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: 600 }}
                                        >
                                          {speaker.speaker_name}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          {speaker.topic}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} md={2}>
                                        <Chip
                                          label={speaker.rating || "N/A"}
                                          color={getRatingColor(speaker.rating)}
                                          size="small"
                                          variant="outlined"
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Grid>
                              )
                            )}
                          </Grid>
                        </Grid>
                      )}

                    {/* Panel Rating */}
                    {selectedFeedback.panel &&
                      selectedFeedback.panel.topic &&
                      selectedFeedback.panel.rating && (
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, color: theme.palette.primary.main }}
                          >
                            Panel Discussion
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={8}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {selectedFeedback.panel.topic}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Chip
                                  label={selectedFeedback.panel.rating}
                                  color={getRatingColor(
                                    selectedFeedback.panel.rating
                                  )}
                                  size="small"
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      )}

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    {/* Likes */}
                    {(selectedFeedback.like1 ||
                      selectedFeedback.like2 ||
                      selectedFeedback.like3) && (
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, color: theme.palette.success.main }}
                        >
                          What They Liked
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {[1, 2, 3].map(
                            (num) =>
                              selectedFeedback[`like${num}`] && (
                                <Typography
                                  key={num}
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <span
                                    style={{ marginRight: 8, fontWeight: 600 }}
                                  >
                                    •
                                  </span>
                                  {selectedFeedback[`like${num}`]}
                                </Typography>
                              )
                          )}
                        </Box>
                      </Grid>
                    )}

                    {/* Dislikes */}
                    {(selectedFeedback.dislike1 ||
                      selectedFeedback.dislike2 ||
                      selectedFeedback.dislike3) && (
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, color: theme.palette.error.main }}
                        >
                          What They Disliked
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {[1, 2, 3].map(
                            (num) =>
                              selectedFeedback[`dislike${num}`] && (
                                <Typography
                                  key={num}
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <span
                                    style={{ marginRight: 8, fontWeight: 600 }}
                                  >
                                    •
                                  </span>
                                  {selectedFeedback[`dislike${num}`]}
                                </Typography>
                              )
                          )}
                        </Box>
                      </Grid>
                    )}

                    {/* Suggestions */}
                    {selectedFeedback.suggestions && (
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, color: theme.palette.primary.main }}
                        >
                          Suggestions
                        </Typography>
                        <Paper
                          sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}
                        >
                          <Typography variant="body2">
                            {selectedFeedback.suggestions}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    {/* Referral Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: theme.palette.secondary.main }}
                      >
                        Referral Information
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Will refer:</strong>{" "}
                        {selectedFeedback.referral || "N/A"}
                      </Typography>

                      {selectedFeedback.referral === "Yes" ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Reference Name
                            </Typography>
                            <Typography variant="body2">
                              {selectedFeedback.referenceName || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Reference Email
                            </Typography>
                            <Typography variant="body2">
                              {selectedFeedback.referenceEmail || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Reference Contact
                            </Typography>
                            <Typography variant="body2">
                              {selectedFeedback.referenceContact || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              Reference Institute
                            </Typography>
                            <Typography variant="body2">
                              {selectedFeedback.referenceInstitute || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : selectedFeedback.noReferralReason ? (
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Reason for not referring
                          </Typography>
                          <Typography variant="body2">
                            {selectedFeedback.noReferralReason}
                          </Typography>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </ModalContent>
              )}
            </ModalBox>
          </Modal>

          {/* Error notification */}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default FeedbackTable;
