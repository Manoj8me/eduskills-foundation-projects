import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Popover,
  FormControl,
  InputLabel,
  Select,
  Button,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import EnhancedSearchSection from "./EnhancedSearchSection";

// Status types with colors and icons
const statusConfig = {
  Pending: {
    color: "#FEF3C7",
    textColor: "#92400E",
    icon: <CancelIcon fontSize="small" sx={{ color: "#92400E" }} />,
    tooltip: "Request is pending approval",
    fullLabel: "Internship Apply",
  },
  Completed: {
    color: "#D1FAE5",
    textColor: "#065F46",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#065F46" }} />,
    tooltip: "Process has been completed successfully",
    fullLabel: "Completed",
  },
  Started: {
    color: "#DBEAFE",
    textColor: "#1E40AF",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#1E40AF" }} />,
    tooltip: "Process has been initiated",
    fullLabel: "Course Started",
  },
  "Not Applied": {
    color: "#F3F4F6",
    textColor: "#4B5563",
    icon: <CancelIcon fontSize="small" sx={{ color: "#4B5563" }} />,
    tooltip: "No application has been submitted",
    fullLabel: "Not Applied",
  },
  Rejected: {
    color: "#FEE2E2",
    textColor: "#B91C1C",
    icon: <CancelIcon fontSize="small" sx={{ color: "#B91C1C" }} />,
    tooltip: "Application has been rejected",
    fullLabel: "Rejected",
  },
  Approved: {
    color: "#A7F3D0",
    textColor: "#047857",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#047857" }} />,
    tooltip: "Application has been approved",
    fullLabel: "Approved",
  },
  Issued: {
    color: "#A7F3D0",
    textColor: "#047857",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#047857" }} />,
    tooltip: "Certificate has been issued",
    fullLabel: "Certificate Issued",
  },
  "Not Issued": {
    color: "#F3F4F6",
    textColor: "#4B5563",
    icon: <CancelIcon fontSize="small" sx={{ color: "#4B5563" }} />,
    tooltip: "Certificate has not been issued yet",
    fullLabel: "Certificate Not Issued",
  },
};

// Add a legend for status icons
const StatusLegend = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
        p: 2,
        borderRadius: 1,
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Box
            key={status}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "white",
              p: 0.75,
              px: 1.5,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            {config.icon}
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, color: config.textColor }}
            >
              {status}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Filter component
const FilterComponent = ({ onApplyFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    cohort: "",
    domain: "",
    branch: "",
    year: "",
    status: "",
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Sample data for dropdowns
  const cohorts = ["2022", "2023", "2024", "2025"];
  const domains = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "AI/ML",
    "DevOps",
    "Cybersecurity",
  ];
  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
  ];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const statuses = Object.keys(statusConfig);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    // Create array of active filters for display
    const newActiveFilters = Object.entries(filters)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => ({ key, value }));

    setActiveFilters(newActiveFilters);

    // Call parent component's filter handler
    if (onApplyFilters) {
      onApplyFilters(filters);
    }

    handleClose();
  };

  const handleClearFilters = () => {
    setFilters({
      cohort: "",
      domain: "",
      branch: "",
      year: "",
      status: "",
    });
    setActiveFilters([]);

    if (onApplyFilters) {
      onApplyFilters({});
    }
  };

  const handleRemoveFilter = (filterKey) => {
    setFilters({
      ...filters,
      [filterKey]: "",
    });

    setActiveFilters(
      activeFilters.filter((filter) => filter.key !== filterKey)
    );

    if (onApplyFilters) {
      onApplyFilters({
        ...filters,
        [filterKey]: "",
      });
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  // Get display name for filter values
  const getFilterLabel = (key, value) => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return `${capitalize(key)}: ${value}`;
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          aria-label="filter"
          aria-describedby={id}
          onClick={handleClick}
          color={activeFilters.length > 0 ? "primary" : "default"}
          sx={{
            borderRadius: 1,
            border: "1px solid",
            borderColor: activeFilters.length > 0 ? "primary.main" : "divider",
            backgroundColor:
              activeFilters.length > 0 ? "primary.lighter" : "background.paper",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor:
                activeFilters.length > 0 ? "primary.light" : "action.hover",
            },
          }}
        >
          <FilterListIcon />
        </IconButton>

        {activeFilters.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={getFilterLabel(filter.key, filter.value)}
                onDelete={() => handleRemoveFilter(filter.key)}
                size="small"
                color="primary"
                variant="outlined"
                deleteIcon={<ClearIcon fontSize="small" />}
                sx={{
                  animation: "expandWidth 0.3s ease-out forwards",
                  maxWidth: { xs: "150px", sm: "none" },
                }}
              />
            ))}

            {activeFilters.length > 0 && (
              <Chip
                label="Clear All"
                onClick={handleClearFilters}
                size="small"
                color="error"
                variant="outlined"
                sx={{ animation: "expandWidth 0.3s ease-out forwards" }}
              />
            )}
          </Box>
        )}
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            borderRadius: 2,
            width: { xs: 300, sm: 550 },
            overflow: "hidden",
            animation: "fadeIn 0.3s ease-out",
          },
        }}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        <Paper sx={{ maxHeight: "90vh", overflow: "auto" }}>
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.main",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              <FilterAltIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Filter Students
            </Typography>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: "white" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="cohort-label">Cohort</InputLabel>
                  <Select
                    labelId="cohort-label"
                    id="cohort"
                    name="cohort"
                    value={filters.cohort}
                    label="Cohort"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {cohorts.map((cohort) => (
                      <MenuItem key={cohort} value={cohort}>
                        {cohort}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="domain-label">Domain</InputLabel>
                  <Select
                    labelId="domain-label"
                    id="domain"
                    name="domain"
                    value={filters.domain}
                    label="Domain"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {domains.map((domain) => (
                      <MenuItem key={domain} value={domain}>
                        {domain}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="branch-label">Branch</InputLabel>
                  <Select
                    labelId="branch-label"
                    id="branch"
                    name="branch"
                    value={filters.branch}
                    label="Branch"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {branches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    name="year"
                    value={filters.year}
                    label="Year"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={filters.status}
                    label="Status"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              size="small"
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              startIcon={<SearchIcon />}
              size="small"
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

// Enhanced search section
// const EnhancedSearchSection = ({
//   searchTerm,
//   handleSearch,
//   handleFilter,
//   filteredCount,
//   totalCount,
// }) => {
//   return (
//     <Box
//       sx={{
//         marginBottom: 2,
//         display: "flex",
//         flexDirection: { xs: "column", sm: "row" },
//         alignItems: { xs: "flex-start", sm: "center" },
//         gap: 2,
//         width: "100%",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//           width: { xs: "100%", sm: "auto" },
//           flexGrow: 1,
//           maxWidth: { sm: "400px" },
//         }}
//       >
//         <TextField
//           fullWidth
//           variant="outlined"
//           size="small"
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={handleSearch}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//             sx: {
//               borderRadius: 1,
//               bgcolor: "background.paper",
//             },
//           }}
//         />

//         <FilterComponent onApplyFilters={handleFilter} />
//       </Box>

//       {filteredCount !== undefined && (
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{
//             ml: { xs: 0, sm: 2 },
//             mt: { xs: 0, sm: 0.5 },
//             display: "flex",
//             alignItems: "center",
//             fontSize: "0.875rem",
//             fontWeight: 500,
//             flexShrink: 0,
//           }}
//         >
//           Showing{" "}
//           <Box
//             component="span"
//             sx={{ fontWeight: 700, mx: 0.5, color: "primary.main" }}
//           >
//             {filteredCount}
//           </Box>{" "}
//           of{" "}
//           <Box component="span" sx={{ fontWeight: 700, mx: 0.5 }}>
//             {totalCount}
//           </Box>{" "}
//           students
//         </Typography>
//       )}
//     </Box>
//   );
// };

// Generate dummy data
const generateDummyData = (count) => {
  const commonStatuses = [
    "Pending",
    "Completed",
    "Not Applied",
    "Rejected",
    "Approved",
  ];
  const courseStartingStatuses = [
    "Pending",
    "Completed",
    "Started",
    "Not Applied",
    "Rejected",
    "Approved",
  ];
  const certificateStatuses = ["Issued", "Not Issued"];
  const cohorts = ["2022", "2023", "2024", "2025"];
  const domains = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "AI/ML",
    "DevOps",
  ];
  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
  ];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const data = [];

  for (let i = 1; i <= count; i++) {
    const randomCommonStatus = () =>
      commonStatuses[Math.floor(Math.random() * commonStatuses.length)];
    const randomCourseStartingStatus = () =>
      courseStartingStatuses[
        Math.floor(Math.random() * courseStartingStatuses.length)
      ];
    const randomCertificateStatus = () =>
      certificateStatuses[
        Math.floor(Math.random() * certificateStatuses.length)
      ];

    data.push({
      id: i,
      name: `Student ${i}`,
      email: `student${i}@example.com`,
      internshipApply: randomCommonStatus(),
      internshipApproval: randomCommonStatus(),
      courseStarting: randomCourseStartingStatus(),
      certificateUpload: randomCommonStatus(),
      certificateVerify: randomCommonStatus(),
      assessment: randomCommonStatus(),
      finalCertificateIssue: randomCertificateStatus(),
      // Additional fields for filtering
      cohort: cohorts[Math.floor(Math.random() * cohorts.length)],
      domain: domains[Math.floor(Math.random() * domains.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      year: years[Math.floor(Math.random() * years.length)],
    });
  }

  return data;
};

const InternshipTrackingTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [tableLoaded, setTableLoaded] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filters, setFilters] = useState({
    cohort: [],
    domain: [],
    branch: [],
    year: [],
    status: [],
  });

  // Initialize data
  useEffect(() => {
    const dummyData = generateDummyData(25);
    setData(dummyData);
    setFilteredData(dummyData);

    // Trigger animation after data is loaded with a slight delay for better effect
    setTimeout(() => {
      setShowAnimation(true);
      setTableLoaded(true);
    }, 300);
  }, []);

  // Apply search and filters
  const applySearchAndFilters = () => {
    if (!tableLoaded) return;

    setShowAnimation(false);

    // First filter by search term
    let filtered = data.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then apply each filter that has selected values
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        if (key === "status") {
          // Special handling for status which could be in any of the status columns
          filtered = filtered.filter((row) => {
            // Check if any of the selected status values match any of the row's status values
            return values.some(
              (statusValue) =>
                row.internshipApply === statusValue ||
                row.internshipApproval === statusValue ||
                row.courseStarting === statusValue ||
                row.certificateUpload === statusValue ||
                row.certificateVerify === statusValue ||
                row.assessment === statusValue ||
                row.finalCertificateIssue === statusValue
            );
          });
        } else {
          // Standard filtering for other fields - row value must be in the selected values array
          filtered = filtered.filter((row) => values.includes(row[key]));
        }
      }
    });

    setTimeout(() => {
      setFilteredData(filtered);
      setPage(0); // Reset to first page after filtering
      setShowAnimation(true);
    }, 300);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setShowAnimation(false);
    setTimeout(() => {
      setPage(newPage);
      setShowAnimation(true);
    }, 300);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setShowAnimation(false);
    setTimeout(() => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
      setShowAnimation(true);
    }, 300);
  };

  // Handle search
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    // Apply search and filters together
    setTimeout(() => {
      applySearchAndFilters();
    }, 300);
  };

  // Handle filter changes
  const handleFilter = (newFilters) => {
    setFilters(newFilters);

    // Apply search and filters together
    setTimeout(() => {
      applySearchAndFilters();
    }, 300);
  };

  // Handle action menu open
  const handleActionMenuOpen = (event, row) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  // Handle action menu close
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRow(null);
  };

  // Handle action menu item click
  const handleActionClick = (action) => {
    console.log(`Action ${action} clicked for row:`, selectedRow);
    // Here you would implement the actual functionality for each action
    handleActionMenuClose();
  };

  // Enhanced status icon with tooltips for improved accessibility
  const getStatusIcon = (status, columnName) => {
    return (
      <Tooltip
        title={
          <React.Fragment>
            <Typography variant="subtitle2" component="span">
              {status}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              sx={{ mt: 0.5, fontSize: "0.7rem" }}
            >
              {statusConfig[status].tooltip}
            </Typography>
            <Typography
              variant="caption"
              component="p"
              sx={{ mt: 0.5, opacity: 0.8 }}
            >
              {columnName}
            </Typography>
          </React.Fragment>
        }
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: statusConfig[status].color,
              color: statusConfig[status].textColor,
              "& .MuiTooltip-arrow": {
                color: statusConfig[status].color,
              },
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              p: 1,
              border: "1px solid rgba(0,0,0,0.05)",
            },
          },
        }}
      >
        <Box
          sx={{
            "& svg": { fontSize: "1.25rem" },
            cursor: "help",
            display: "inline-flex",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.2)" },
          }}
        >
          {statusConfig[status].icon}
        </Box>
      </Tooltip>
    );
  };

  // Get the page numbers to show in pagination
  const getPageNumberToShow = (index) => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (totalPages <= 5) {
      return index;
    }

    // Current page is among first 3 pages
    if (page < 3) {
      return index;
    }

    // Current page is among last 3 pages
    if (page >= totalPages - 3) {
      return totalPages - 5 + index;
    }

    // Current page is somewhere in the middle
    return page - 2 + index;
  };

  // Action menu
  const ActionMenu = () => (
    <Menu
      anchorEl={actionMenuAnchor}
      open={Boolean(actionMenuAnchor)}
      onClose={handleActionMenuClose}
      TransitionComponent={Fade}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 180,
          overflow: "visible",
          mt: 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          "& .MuiMenuItem-root": {
            px: 2,
            py: 1.5,
            borderRadius: 1,
            mx: 0.5,
            my: 0.25,
          },
        },
      }}
    >
      <MenuItem onClick={() => handleActionClick("edit")}>
        <ListItemIcon>
          <EditIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Edit Details" />
      </MenuItem>
      <MenuItem onClick={() => handleActionClick("reject")}>
        <ListItemIcon>
          <ThumbDownIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Reject" />
      </MenuItem>
      <MenuItem onClick={() => handleActionClick("delete")}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </MenuItem>
    </Menu>
  );

  return (
    <Box
      sx={{
        padding: 4,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        animation: showAnimation ? "fadeIn 800ms ease-out" : "none",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          fontWeight: "bold",
          color: "#1976d2",
          opacity: showAnimation ? 1 : 0,
          transform: showAnimation ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
        }}
      >
        Internship Tracking System
      </Typography>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes expandWidth {
          from {
            width: auto;
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            width: 150px;
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Enhanced Search Section with Filter */}
      <EnhancedSearchSection
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleFilter={handleFilter}
        filteredCount={filteredData.length}
        totalCount={data.length}
      />

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "auto",
          opacity: showAnimation ? 1 : 0,
          transform: showAnimation ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
          maxWidth: "100%",
          maxHeight: "600px",
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
              backgroundColor: "#a1a1a1",
            },
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #1976d2, #2196f3)",
              }}
            >
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  minWidth: "120px",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  minWidth: "150px",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  px: 1,
                  minWidth: "130px",
                  textAlign: "center",
                }}
              >
                Internship Apply
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  px: 1,
                  minWidth: "160px",
                  textAlign: "center",
                }}
              >
                Internship Approval
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  px: 1,
                  minWidth: "140px",
                  textAlign: "center",
                }}
              >
                Course Starting
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  px: 1,
                  minWidth: "160px",
                  textAlign: "center",
                }}
              >
                Certificate Upload
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  px: 1,
                  minWidth: "160px",
                  textAlign: "center",
                }}
              >
                Certificate Verify
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  px: 1,
                  minWidth: "120px",
                  textAlign: "center",
                }}
              >
                Assessment
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  px: 1,
                  minWidth: "180px",
                  textAlign: "center",
                }}
              >
                Final Certificate Issue
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  whiteSpace: "nowrap",
                  py: 2,
                  minWidth: "80px",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  sx={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#6B7280",
                  }}
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      opacity: showAnimation ? 1 : 0,
                      transform: showAnimation
                        ? "translateY(0)"
                        : "translateY(10px)",
                      transition:
                        "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                      transitionDelay: `${index * 80}ms`,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                      },
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      <Tooltip title={row.name} placement="top">
                        <Box
                          sx={{
                            maxWidth: 120,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.name}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.email} placement="top">
                        <Box
                          sx={{
                            maxWidth: 150,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.email}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      {getStatusIcon(
                        row.internshipApply,
                        "Internship Application"
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      {getStatusIcon(
                        row.internshipApproval,
                        "Internship Approval"
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      {getStatusIcon(row.courseStarting, "Course Starting")}
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      {getStatusIcon(
                        row.certificateUpload,
                        "Certificate Upload"
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      {getStatusIcon(
                        row.certificateVerify,
                        "Certificate Verification"
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      {getStatusIcon(row.assessment, "Assessment")}
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      {getStatusIcon(
                        row.finalCertificateIssue,
                        "Final Certificate Issue"
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ p: 1 }}>
                      <IconButton
                        aria-label="actions"
                        size="small"
                        onClick={(e) => handleActionMenuOpen(e, row)}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.12)",
                          },
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        {/* Custom Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderTop: "1px solid rgba(224, 224, 224, 1)",
            backgroundColor: "#f9fafb",
          }}
        >
          {/* Rows per page selector */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Rows per page:
            </Typography>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              style={{
                padding: "6px 8px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                color: "#4b5563",
                fontSize: "0.875rem",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "16px",
                paddingRight: "32px",
              }}
            >
              {[5, 10, 25].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
              {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length}
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <button
              onClick={(e) => handleChangePage(e, 0)}
              disabled={page === 0}
              style={{
                padding: "4px 8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: page === 0 ? "#f3f4f6" : "#e0f2fe",
                color: page === 0 ? "#9ca3af" : "#0369a1",
                cursor: page === 0 ? "default" : "pointer",
                fontWeight: "bold",
                minWidth: "32px",
                boxShadow:
                  page === 0 ? "none" : "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "14px" }}>«</span>
            </button>

            <button
              onClick={(e) => handleChangePage(e, page - 1)}
              disabled={page === 0}
              style={{
                padding: "4px 8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: page === 0 ? "#f3f4f6" : "#e0f2fe",
                color: page === 0 ? "#9ca3af" : "#0369a1",
                cursor: page === 0 ? "default" : "pointer",
                fontWeight: "bold",
                minWidth: "32px",
                boxShadow:
                  page === 0 ? "none" : "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "14px" }}>‹</span>
            </button>

            {/* Page numbers */}
            {[
              ...Array(
                Math.min(5, Math.ceil(filteredData.length / rowsPerPage))
              ),
            ].map((_, index) => {
              const pageNumber = getPageNumberToShow(index);
              if (pageNumber < Math.ceil(filteredData.length / rowsPerPage)) {
                return (
                  <button
                    key={pageNumber}
                    onClick={(e) => handleChangePage(e, pageNumber)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor:
                        page === pageNumber ? "#0ea5e9" : "#e0f2fe",
                      color: page === pageNumber ? "white" : "#0369a1",
                      cursor: "pointer",
                      fontWeight: page === pageNumber ? "bold" : "normal",
                      minWidth: "32px",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s",
                      opacity: showAnimation ? 1 : 0,
                      transform: showAnimation ? "scale(1)" : "scale(0.9)",
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {pageNumber + 1}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={(e) => handleChangePage(e, page + 1)}
              disabled={
                page >= Math.ceil(filteredData.length / rowsPerPage) - 1
              }
              style={{
                padding: "4px 8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "#f3f4f6"
                    : "#e0f2fe",
                color:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "#9ca3af"
                    : "#0369a1",
                cursor:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "default"
                    : "pointer",
                fontWeight: "bold",
                minWidth: "32px",
                boxShadow:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "none"
                    : "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "14px" }}>›</span>
            </button>

            <button
              onClick={(e) =>
                handleChangePage(
                  e,
                  Math.ceil(filteredData.length / rowsPerPage) - 1
                )
              }
              disabled={
                page >= Math.ceil(filteredData.length / rowsPerPage) - 1
              }
              style={{
                padding: "4px 8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "#f3f4f6"
                    : "#e0f2fe",
                color:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "#9ca3af"
                    : "#0369a1",
                cursor:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "default"
                    : "pointer",
                fontWeight: "bold",
                minWidth: "32px",
                boxShadow:
                  page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                    ? "none"
                    : "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "14px" }}>»</span>
            </button>
          </Box>
        </Box>
      </TableContainer>

      {/* Action Menu */}
      <ActionMenu />
    </Box>
  );
};

export default InternshipTrackingTable;
