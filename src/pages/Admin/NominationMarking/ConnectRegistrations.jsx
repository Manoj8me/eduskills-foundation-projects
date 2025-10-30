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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Modal,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Badge,
  Checkbox,
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "../../../services/api";
import { BASE_URL } from "../../../services/configUrls";

// Create a theme instance (same as your original)
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: "1px solid rgba(0, 136, 204, 0.08)",
  "& .MuiTableHead-root": {
    "& .MuiTableRow-root": {
      "& .MuiTableCell-root": {
        backgroundColor: "#f8f9fa",
        fontWeight: 600,
        fontSize: "0.875rem",
        color: theme.palette.text.primary,
      },
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      "&:hover": {
        backgroundColor: "rgba(0, 136, 204, 0.04)",
      },
    },
  },
}));

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 900,
  maxHeight: "95vh",
  overflowY: "scroll",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  padding: theme.spacing(2),

  // Custom scrollbar styles for modal
  "&::-webkit-scrollbar": {
    width: "12px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f8f9fa",
    borderRadius: "6px",
    margin: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(180deg, #0088cc 0%, #006699 100%)",
    borderRadius: "6px",
    border: "2px solid #f8f9fa",
    "&:hover": {
      background: "linear-gradient(180deg, #006699 0%, #004466 100%)",
    },
  },
  "&::-webkit-scrollbar-thumb:active": {
    background: "#004466",
  },
  "&::-webkit-scrollbar-corner": {
    background: "#f8f9fa",
  },

  // Firefox scrollbar
  scrollbarWidth: "thin",
  scrollbarColor: "#0088cc #f8f9fa",
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: theme.spacing(2),
}));

const DayTableContainer = styled(Box)(({ theme }) => ({
  maxHeight: "none", // Remove height restriction
  overflowY: "visible", // Remove scroll from table
  border: "1px solid rgba(0, 136, 204, 0.12)",
  borderRadius: theme.spacing(1),

  "& .MuiTable-root": {
    "& .MuiTableHead-root": {
      "& .MuiTableCell-root": {
        backgroundColor: "#f8f9fa",
        fontWeight: 600,
        fontSize: "0.75rem",
        padding: theme.spacing(1),
      },
    },
    "& .MuiTableBody-root": {
      "& .MuiTableCell-root": {
        fontSize: "0.75rem",
        padding: theme.spacing(1),
      },
    },
  },
}));

// Filter Button Component
const FilterButton = styled(Button)(({ theme, hasselections }) => ({
  minWidth: 160,
  justifyContent: "space-between",
  textTransform: "none",
  backgroundColor: hasselections ? "rgba(0, 136, 204, 0.1)" : "white",
  color: hasselections
    ? theme.palette.primary.main
    : theme.palette.text.primary,
  border: `1px solid ${
    hasselections ? theme.palette.primary.main : "rgba(0, 0, 0, 0.23)"
  }`,
  "&:hover": {
    backgroundColor: hasselections
      ? "rgba(0, 136, 204, 0.15)"
      : "rgba(0, 0, 0, 0.04)",
    borderColor: hasselections
      ? theme.palette.primary.main
      : "rgba(0, 0, 0, 0.23)",
  },
}));

// Popover Content Component
const PopoverContent = styled(Box)(({ theme }) => ({
  width: 320,
  maxHeight: 400,
  padding: theme.spacing(1),
}));

const SearchableList = styled(List)(({ theme }) => ({
  maxHeight: 300,
  overflowY: "auto",
  padding: 0,

  // Custom scrollbar styles
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f8f9fa",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(180deg, #0088cc 0%, #006699 100%)",
    borderRadius: "4px",
    "&:hover": {
      background: "linear-gradient(180deg, #006699 0%, #004466 100%)",
    },
  },
  "&::-webkit-scrollbar-thumb:active": {
    background: "#004466",
  },
  // Firefox scrollbar
  scrollbarWidth: "thin",
  scrollbarColor: "#0088cc #f8f9fa",
}));

function ConnectRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Popover states
  const [designationAnchorEl, setDesignationAnchorEl] = useState(null);
  const [instituteAnchorEl, setInstituteAnchorEl] = useState(null);
  const [designationSearch, setDesignationSearch] = useState("");
  const [instituteSearch, setInstituteSearch] = useState("");

  // Fetch registrations data
  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await api.get(
        `${BASE_URL}/admin/connect-registrations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data) {
        setRegistrations(response.data.registrations || []);
        setTotalCount(response.data.total_registrations || 0);
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError("Failed to fetch registrations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Get unique designations and institutes for filters
  const uniqueDesignations = [
    ...new Set(
      registrations
        .map((reg) => reg.designation)
        .filter((designation) => designation && designation.trim() !== "")
    ),
  ].sort();

  const uniqueInstitutes = [
    ...new Set(
      registrations
        .map((reg) => reg.institute)
        .filter((institute) => institute && institute.trim() !== "")
    ),
  ].sort();

  // Filter options based on search
  const filteredDesignations = uniqueDesignations.filter((designation) =>
    designation.toLowerCase().includes(designationSearch.toLowerCase())
  );

  const filteredInstitutes = uniqueInstitutes.filter((institute) =>
    institute.toLowerCase().includes(instituteSearch.toLowerCase())
  );

  // Filter registrations based on search and filters
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registration_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation =
      selectedDesignations.length === 0 ||
      (reg.designation &&
        selectedDesignations.includes(reg.designation.trim()));

    const matchesInstitute =
      selectedInstitutes.length === 0 ||
      (reg.institute && selectedInstitutes.includes(reg.institute.trim()));

    return matchesSearch && matchesDesignation && matchesInstitute;
  });

  // Get current page data
  const paginatedRegistrations = filteredRegistrations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle view details
  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRegistration(null);
  };

  // Clear error
  const handleCloseError = () => {
    setError(null);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedDesignations([]);
    setSelectedInstitutes([]);
    setPage(0);
  };

  // Popover handlers
  const handleDesignationClick = (event) => {
    setDesignationAnchorEl(event.currentTarget);
  };

  const handleInstituteClick = (event) => {
    setInstituteAnchorEl(event.currentTarget);
  };

  const handleDesignationClose = () => {
    setDesignationAnchorEl(null);
    setDesignationSearch("");
  };

  const handleInstituteClose = () => {
    setInstituteAnchorEl(null);
    setInstituteSearch("");
  };

  const handleDesignationToggle = (designation) => {
    const newSelected = selectedDesignations.includes(designation)
      ? selectedDesignations.filter((item) => item !== designation)
      : [...selectedDesignations, designation];

    setSelectedDesignations(newSelected);
    setPage(0);
  };

  const handleInstituteToggle = (institute) => {
    const newSelected = selectedInstitutes.includes(institute)
      ? selectedInstitutes.filter((item) => item !== institute)
      : [...selectedInstitutes, institute];

    setSelectedInstitutes(newSelected);
    setPage(0);
  };

  // Get button text for filters
  const getDesignationButtonText = () => {
    if (selectedDesignations.length === 0) return "Select Designations";
    if (selectedDesignations.length === 1) return selectedDesignations[0];
    return `${selectedDesignations.length} designations selected`;
  };

  const getInstituteButtonText = () => {
    if (selectedInstitutes.length === 0) return "Select Institutes";
    if (selectedInstitutes.length === 1) return selectedInstitutes[0];
    return `${selectedInstitutes.length} institutes selected`;
  };

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
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Connect Event Registrations
          </Typography>

          {/* Search and Filters */}
          <StyledPaper>
            <FilterContainer>
              <TextField
                placeholder="Search by name, email, or registration ID..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />

              {/* Designation Filter Button */}
              <Badge
                badgeContent={selectedDesignations.length}
                color="secondary"
                invisible={selectedDesignations.length === 0}
              >
                <FilterButton
                  hasselections={selectedDesignations.length > 0 ? 1 : 0}
                  onClick={handleDesignationClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  <Box
                    sx={{
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {getDesignationButtonText()}
                  </Box>
                </FilterButton>
              </Badge>

              {/* Designation Popover */}
              <Popover
                open={Boolean(designationAnchorEl)}
                anchorEl={designationAnchorEl}
                onClose={handleDesignationClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <PopoverContent>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search designations..."
                    value={designationSearch}
                    onChange={(e) => setDesignationSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                  <SearchableList>
                    {filteredDesignations.map((designation) => (
                      <ListItem key={designation} disablePadding>
                        <ListItemButton
                          onClick={() => handleDesignationToggle(designation)}
                          dense
                        >
                          <ListItemIcon>
                            <Checkbox
                              checked={selectedDesignations.includes(
                                designation
                              )}
                              size="small"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={designation}
                            primaryTypographyProps={{ fontSize: "0.875rem" }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </SearchableList>
                </PopoverContent>
              </Popover>

              {/* Institute Filter Button */}
              <Badge
                badgeContent={selectedInstitutes.length}
                color="secondary"
                invisible={selectedInstitutes.length === 0}
              >
                <FilterButton
                  hasselections={selectedInstitutes.length > 0 ? 1 : 0}
                  onClick={handleInstituteClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ minWidth: 200 }}
                >
                  <Box
                    sx={{
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {getInstituteButtonText()}
                  </Box>
                </FilterButton>
              </Badge>

              {/* Institute Popover */}
              <Popover
                open={Boolean(instituteAnchorEl)}
                anchorEl={instituteAnchorEl}
                onClose={handleInstituteClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <PopoverContent>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search institutes..."
                    value={instituteSearch}
                    onChange={(e) => setInstituteSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                  <SearchableList>
                    {filteredInstitutes.map((institute) => (
                      <ListItem key={institute} disablePadding>
                        <ListItemButton
                          onClick={() => handleInstituteToggle(institute)}
                          dense
                        >
                          <ListItemIcon>
                            <Checkbox
                              checked={selectedInstitutes.includes(institute)}
                              size="small"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={institute}
                            primaryTypographyProps={{ fontSize: "0.875rem" }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </SearchableList>
                </PopoverContent>
              </Popover>

              {(searchTerm ||
                selectedDesignations.length > 0 ||
                selectedInstitutes.length > 0) && (
                <IconButton
                  onClick={clearAllFilters}
                  color="error"
                  size="small"
                  sx={{
                    border: "1px solid rgba(244, 67, 54, 0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 0.04)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </FilterContainer>
          </StyledPaper>

          {/* Results Table */}
          <StyledPaper>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Count Display */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    backgroundColor: "rgba(0, 136, 204, 0.06)",
                    borderRadius: 1,
                    border: "1px solid rgba(0, 136, 204, 0.12)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="primary.main"
                    >
                      Total
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "white",
                        px: 2,
                        py: 0.5,
                        borderRadius: "20px",
                        border: "1px solid rgba(0, 136, 204, 0.2)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="primary.main"
                      >
                        {filteredRegistrations.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        registrations
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <StyledTableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Registration ID</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Institute</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRegistrations.map((registration) => (
                        <TableRow key={registration.registration_id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {registration.registration_id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {registration.fullname}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {registration.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {registration.designation}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {registration.institute}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(registration)}
                              color="primary"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredRegistrations.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </>
            )}
          </StyledPaper>

          {/* Details Modal */}
          <Modal open={modalOpen} onClose={handleCloseModal}>
            <ModalContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight={600}>
                  Registration Details
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {selectedRegistration && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        src={selectedRegistration.image}
                        sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                      />
                      <Typography variant="h6" fontWeight={600}>
                        {selectedRegistration.fullname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRegistration.designation}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Registration ID
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRegistration.registration_id}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {selectedRegistration.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Mobile Number
                        </Typography>
                        <Typography variant="body1">
                          {selectedRegistration.mobile_number}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          WhatsApp Number
                        </Typography>
                        <Typography variant="body1">
                          {selectedRegistration.whatsup_number}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Institute
                        </Typography>
                        <Typography variant="body1">
                          {selectedRegistration.institute}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Registration Title
                        </Typography>
                        <Typography variant="body1">
                          {selectedRegistration.reg_title}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Paid Amount
                        </Typography>
                        <Typography variant="body1">
                          ₹{selectedRegistration.paid_amount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Event Days Participation
                    </Typography>

                    <DayTableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Day</TableCell>
                            <TableCell align="center">Participation</TableCell>
                            <TableCell>Food Preference</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Day 1
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={selectedRegistration.day1 ? "Yes" : "No"}
                                color={
                                  selectedRegistration.day1
                                    ? "success"
                                    : "error"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {selectedRegistration.day1_food_preferences ||
                                  "Not specified"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Day 2
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={selectedRegistration.day2 ? "Yes" : "No"}
                                color={
                                  selectedRegistration.day2
                                    ? "success"
                                    : "error"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {selectedRegistration.day2_food_preferences ||
                                  "Not specified"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Day 3
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={selectedRegistration.day3 ? "Yes" : "No"}
                                color={
                                  selectedRegistration.day3
                                    ? "success"
                                    : "error"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {selectedRegistration.day3_food_preferences ||
                                  "Not specified"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Day 4
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={selectedRegistration.day4 ? "Yes" : "No"}
                                color={
                                  selectedRegistration.day4
                                    ? "success"
                                    : "error"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                -
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </DayTableContainer>

                    {/* Single row for drink preference and travel mode */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "rgba(0, 136, 204, 0.02)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Drink Preference
                          </Typography>
                          <Typography variant="body2">
                            {selectedRegistration.day1_drink_preferences ||
                              "Not specified"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "rgba(0, 136, 204, 0.02)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Travel Mode
                          </Typography>
                          <Typography variant="body2">
                            {selectedRegistration.day1_travel_mode ||
                              "Not specified"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Food Allergies
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body1">
                        {selectedRegistration.food_allergies
                          ? `Yes - ${selectedRegistration.specific_food_allergies}`
                          : "No food allergies reported"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </ModalContainer>
          </Modal>

          {/* Error Snackbar */}
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

export default ConnectRegistrations;
