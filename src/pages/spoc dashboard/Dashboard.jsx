import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  useTheme,
  alpha,
  Autocomplete,
  Switch,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
 // Import Tailwind CSS

// Mock data for dashboard
const generateMockData = () => {
  const companies = [
    "Google",
    "Amazon",
    "Microsoft",
    "Apple",
    "Facebook",
    "Netflix",
    "IBM",
    "Oracle",
  ];
  const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager",
  ];
  const locations = [
    "New York",
    "San Francisco",
    "Seattle",
    "Austin",
    "Chicago",
    "Boston",
    "Remote",
  ];
  const statuses = [
    "Eligible",
    "Applied",
    "Shortlisted",
    "Selected",
    "Rejected",
  ];

  // Generate candidates
  const candidates = [];
  for (let i = 1; i <= 100; i++) {
    const companyIndex = Math.floor(Math.random() * companies.length);
    const positionIndex = Math.floor(Math.random() * positions.length);
    const locationIndex = Math.floor(Math.random() * locations.length);

    // Ensure status progression makes sense (can't be selected without being shortlisted, etc.)
    let statusIndex;
    const random = Math.random();
    if (random < 0.3) {
      statusIndex = 0; // Eligible
    } else if (random < 0.6) {
      statusIndex = 1; // Applied
    } else if (random < 0.8) {
      statusIndex = 2; // Shortlisted
    } else if (random < 0.95) {
      statusIndex = 3; // Selected
    } else {
      statusIndex = 4; // Rejected
    }

    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    candidates.push({
      id: i,
      name: `Candidate ${i}`,
      email: `candidate${i}@example.com`,
      company: companies[companyIndex],
      position: positions[positionIndex],
      location: locations[locationIndex],
      status: statuses[statusIndex],
      experience: Math.floor(Math.random() * 10) + 1,
      applicationDate: date.toISOString().split("T")[0],
    });
  }

  return {
    companies,
    positions,
    locations,
    candidates,
  };
};

const mockData = generateMockData();

// Calculate summary metrics
const calculateMetrics = (candidates) => {
  const eligible = candidates.filter((c) => c.status === "Eligible").length;
  const applied = candidates.filter((c) => c.status === "Applied").length;
  const shortlisted = candidates.filter(
    (c) => c.status === "Shortlisted"
  ).length;
  const selected = candidates.filter((c) => c.status === "Selected").length;
  const rejected = candidates.filter((c) => c.status === "Rejected").length;

  return {
    eligible,
    applied,
    shortlisted,
    selected,
    rejected,
    total: candidates.length,
  };
};

// Generate company-wise metrics for charts
const generateCompanyMetrics = (candidates) => {
  const companyData = {};

  candidates.forEach((candidate) => {
    if (!companyData[candidate.company]) {
      companyData[candidate.company] = {
        company: candidate.company,
        eligible: 0,
        applied: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0,
        total: 0,
      };
    }

    companyData[candidate.company][candidate.status.toLowerCase()]++;
    companyData[candidate.company].total++;
  });

  return Object.values(companyData);
};

// Dashboard Component
const SpocDashboard = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: white)");
  // Use system preference for dark mode without a manual toggle
  const isDarkMode = prefersDarkMode;

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#6366F1", // indigo-600
      },
      secondary: {
        main: "#8B5CF6", // purple-600
      },
      success: {
        main: "#10B981", // green-500
      },
      error: {
        main: "#EF4444", // red-500
      },
      info: {
        main: "#3B82F6", // blue-500
      },
    },
    components: {
      MuiAutocomplete: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
      MuiButton: {
        defaultProps: {
          size: "small",
        },
      },
    },
  });

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [companyMetrics, setCompanyMetrics] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [metrics, setMetrics] = useState({
    eligible: 0,
    applied: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
    total: 0,
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    company: "",
    position: "",
    location: "",
    status: "",
    searchQuery: "",
    experienceMin: "",
    experienceMax: "",
  });

  // Custom hex colors for charts
  const COLORS = [
    "#3B82F6", // blue-500
    "#8B5CF6", // purple-500
    "#10B981", // green-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#6366F1", // indigo-500
    "#EC4899", // pink-500
    "#14B8A6", // teal-500
  ];

  // Initialize data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const candidatesData = mockData.candidates;
      setCandidates(candidatesData);
      setFilteredCandidates(candidatesData);
      setMetrics(calculateMetrics(candidatesData));
      setCompanyMetrics(generateCompanyMetrics(candidatesData));
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = candidates;

    if (filters.company) {
      result = result.filter((c) => c.company === filters.company);
    }

    if (filters.position) {
      result = result.filter((c) => c.position === filters.position);
    }

    if (filters.location) {
      result = result.filter((c) => c.location === filters.location);
    }

    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.company.toLowerCase().includes(query) ||
          c.position.toLowerCase().includes(query)
      );
    }

    if (filters.experienceMin) {
      result = result.filter(
        (c) => c.experience >= parseInt(filters.experienceMin)
      );
    }

    if (filters.experienceMax) {
      result = result.filter(
        (c) => c.experience <= parseInt(filters.experienceMax)
      );
    }

    setFilteredCandidates(result);
    setMetrics(calculateMetrics(result));
    setCompanyMetrics(generateCompanyMetrics(result));
    setPage(0); // Reset to first page when filters change
  }, [filters, candidates]);

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      company: "",
      position: "",
      location: "",
      status: "",
      searchQuery: "",
      experienceMin: "",
      experienceMax: "",
    });
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Prepare chart data with hex codes
  const statusData = [
    { name: "Eligible", value: metrics.eligible, color: "#3B82F6" }, // blue-500
    { name: "Applied", value: metrics.applied, color: "#6366F1" }, // indigo-600
    { name: "Shortlisted", value: metrics.shortlisted, color: "#8B5CF6" }, // purple-600
    { name: "Selected", value: metrics.selected, color: "#10B981" }, // green-500
    { name: "Rejected", value: metrics.rejected, color: "#EF4444" }, // red-500
  ];

  // Prepare bar chart data (top 5 companies)
  const barChartData = companyMetrics
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
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
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <DashboardIcon sx={{ mr: 1 }} /> Job Application Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  const candidatesData = generateMockData().candidates;
                  setCandidates(candidatesData);
                  setFilteredCandidates(candidatesData);
                  setMetrics(calculateMetrics(candidatesData));
                  setCompanyMetrics(generateCompanyMetrics(candidatesData));
                  setLoading(false);
                }, 1000);
              }}
            >
              Refresh Data
            </Button>
          </Box>
        </Box>

        {/* Summary Cards using Tailwind CSS with dark mode support */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {/* Eligible Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 transform hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                <PersonAddIcon style={{ color: "white" }} />
              </div>
              <h2 className="text-3xl font-semibold mb-1 text-gray-900 dark:text-white">
                {metrics.eligible}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Eligible Candidates
              </p>
            </div>
          </div>

          {/* Applied Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 transform hover:shadow-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center mb-4">
                <AssignmentIcon style={{ color: "white" }} />
              </div>
              <h2 className="text-3xl font-semibold mb-1 text-gray-900 dark:text-white">
                {metrics.applied}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Applied
              </p>
            </div>
          </div>

          {/* Shortlisted Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 transform hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                <HourglassEmptyIcon style={{ color: "white" }} />
              </div>
              <h2 className="text-3xl font-semibold mb-1 text-gray-900 dark:text-white">
                {metrics.shortlisted}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Shortlisted
              </p>
            </div>
          </div>

          {/* Selected Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 transform hover:shadow-lg hover:bg-green-50 dark:hover:bg-green-900 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <CheckCircleIcon style={{ color: "white" }} />
              </div>
              <h2 className="text-3xl font-semibold mb-1 text-gray-900 dark:text-white">
                {metrics.selected}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Selected
              </p>
            </div>
          </div>

          {/* Rejected Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 transform hover:shadow-lg hover:bg-red-50 dark:hover:bg-red-900 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center mb-4">
                <PeopleIcon style={{ color: "white" }} />
              </div>
              <h2 className="text-3xl font-semibold mb-1 text-gray-900 dark:text-white">
                {metrics.rejected}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Rejected
              </p>
            </div>
          </div>
        </div>

        {/* Filters Button */}
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FilterListIcon sx={{ mr: 1 }} /> Filters
              {Object.values(filters).some((value) => value !== "") && (
                <Chip
                  label="Filters active"
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={showFilters ? <FilterListIcon /> : <FilterListIcon />}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>

          {showFilters && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={mockData.companies}
                    renderInput={(params) => (
                      <TextField {...params} label="Company" fullWidth />
                    )}
                    value={filters.company || null}
                    onChange={(e, newValue) => {
                      setFilters((prev) => ({
                        ...prev,
                        company: newValue || "",
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={mockData.positions}
                    renderInput={(params) => (
                      <TextField {...params} label="Position" fullWidth />
                    )}
                    value={filters.position || null}
                    onChange={(e, newValue) => {
                      setFilters((prev) => ({
                        ...prev,
                        position: newValue || "",
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={mockData.locations}
                    renderInput={(params) => (
                      <TextField {...params} label="Location" fullWidth />
                    )}
                    value={filters.location || null}
                    onChange={(e, newValue) => {
                      setFilters((prev) => ({
                        ...prev,
                        location: newValue || "",
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={[
                      "Eligible",
                      "Applied",
                      "Shortlisted",
                      "Selected",
                      "Rejected",
                    ]}
                    renderInput={(params) => (
                      <TextField {...params} label="Status" fullWidth />
                    )}
                    value={filters.status || null}
                    onChange={(e, newValue) => {
                      setFilters((prev) => ({
                        ...prev,
                        status: newValue || "",
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Search"
                    name="searchQuery"
                    value={filters.searchQuery}
                    onChange={handleFilterChange}
                    placeholder="Search by name, email, company..."
                    InputProps={{
                      startAdornment: (
                        <SearchIcon sx={{ color: "action.active", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleResetFilters}
                    sx={{ height: "100%" }}
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Application Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} candidates`, "Count"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Top 5 Companies - Application Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="company" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="eligible"
                      name="Eligible"
                      stackId="a"
                      fill="#3B82F6"
                    />
                    <Bar
                      dataKey="applied"
                      name="Applied"
                      stackId="a"
                      fill="#6366F1"
                    />
                    <Bar
                      dataKey="shortlisted"
                      name="Shortlisted"
                      stackId="a"
                      fill="#8B5CF6"
                    />
                    <Bar
                      dataKey="selected"
                      name="Selected"
                      stackId="a"
                      fill="#10B981"
                    />
                    <Bar
                      dataKey="rejected"
                      name="Rejected"
                      stackId="a"
                      fill="#EF4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Candidates Table */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <PeopleIcon sx={{ mr: 1 }} /> Candidates
            <Chip
              label={`${filteredCandidates.length} results`}
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Application Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate) => {
                    let statusColor = "#3B82F6"; // blue-500 for Eligible
                    if (candidate.status === "Applied") statusColor = "#6366F1"; // indigo-600
                    if (candidate.status === "Shortlisted")
                      statusColor = "#8B5CF6"; // purple-600
                    if (candidate.status === "Selected")
                      statusColor = "#10B981"; // green-500
                    if (candidate.status === "Rejected")
                      statusColor = "#EF4444"; // red-500

                    return (
                      <TableRow key={candidate.id} hover>
                        <TableCell>{candidate.name}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>
                          <Chip
                            icon={<BusinessIcon />}
                            label={candidate.company}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>{candidate.location}</TableCell>
                        <TableCell>{candidate.applicationDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={candidate.status}
                            sx={{
                              backgroundColor: alpha(statusColor, 0.1),
                              color: statusColor,
                              borderColor: statusColor,
                            }}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredCandidates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No candidates match your filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredCandidates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default SpocDashboard;
