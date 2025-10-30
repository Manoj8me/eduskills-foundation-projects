import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Button,
  Checkbox,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Container,
  Divider,
  Tooltip,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Skeleton,
  Paper,
  FormControl,
  Popover,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { BASE_URL } from "../../services/configUrls";

// Static data for years and statuses
const years = ["2020", "2021", "2022", "2023", "2024", "2025"];
const statuses = [
  "Not Applied",
  "Internship Applied",
  "Internship Approved",
  "Certificate Verified",
  "Final Certificate Issued",
  "Failed Students",
];

// Checkbox icon for multiple select
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
  overflow: "hidden",
  width: "100%",
  marginBottom: theme.spacing(3),
}));

const FilterFormContainer = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(2),
  backgroundColor: "rgba(240, 240, 240, 0.3)",
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const FilterRowContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  flexWrap: "wrap",
  alignItems: "center",
  width: "100%",
}));

const FilterDropdown = styled(Button)(({ theme, selected, open }) => ({
  background: selected
    ? "linear-gradient(45deg, #006699 30%, #0088cc 90%)"
    : "#0288D1",
  borderRadius: theme.spacing(1),
  boxShadow: selected ? "0 4px 10px rgba(0, 102, 153, 0.3)" : "none",
  color: "white",
  textTransform: "none",
  padding: "4px 10px",
  minWidth: "auto",
  height: "40px",
  position: "relative",
  "&:hover": {
    background: selected
      ? "linear-gradient(45deg, #006699 30%, #0088cc 90%)"
      : "#0277BD",
    boxShadow: "0 4px 10px rgba(0, 102, 153, 0.2)",
  },
}));

const ExportButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 10px rgba(76, 175, 80, 0.3)",
  color: "white",
  textTransform: "none",
  padding: "6px 16px",
  height: "40px",
  alignSelf: "flex-end",
  "&:hover": {
    background: "linear-gradient(45deg, #43A047 30%, #4CAF50 90%)",
    boxShadow: "0 6px 12px rgba(76, 175, 80, 0.4)",
  },
}));

const PopoverContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: 400,
  maxWidth: "95vw",
}));

const FilterList = styled(List)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  overflowY: "auto",
  maxHeight: "50vh",
  padding: theme.spacing(1),
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#0288D1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#0277BD",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "#0288D1 #f1f1f1",
}));

const PopoverHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Skeleton for filter buttons while loading
const FilterSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((item) => (
      <Skeleton
        key={item}
        variant="rectangular"
        width={80}
        height={40}
        sx={{ borderRadius: 1 }}
      />
    ))}
  </>
);

const FilterForm = ({ onSearch, onExport, baseUrl = BASE_URL || "" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for filter options and selected values
  const [filterOptions, setFilterOptions] = useState({
    domains: [],
    cohorts: [],
    branches: [],
  });
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);

  // Popover state
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("");
  const [openFilter, setOpenFilter] = useState("");

  // Search within popover
  const [popoverSearchTerm, setPopoverSearchTerm] = useState("");

  // Refs for filter buttons
  const domainButtonRef = useRef(null);
  const statusButtonRef = useRef(null);
  const cohortButtonRef = useRef(null);
  const yearButtonRef = useRef(null);
  const branchButtonRef = useRef(null);

  // Fetch filter options directly in this component
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get the access token from local storage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setError("Authentication token not found. Please login again.");
          return;
        }

        const response = await axios.get(
          `${baseUrl}/internship/studentInformationOptions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Parse the response
        const { data } = response;

        if (data) {
          setFilterOptions({
            domains: data.domainsResponse || [],
            cohorts: data.cohortsResponse || [],
            branches: data.branchesResponse || [],
          });
          console.log("Filter options loaded:", data);
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to fetch filter options. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch filter options
    fetchFilterOptions();
  }, [baseUrl]);

  const handleFilterClick = (filterType, event) => {
    // If clicking the same filter that's already open, close it
    if (currentFilter === filterType && Boolean(anchorEl)) {
      setAnchorEl(null);
      setCurrentFilter("");
      setOpenFilter("");
    } else {
      // Otherwise, open the new filter
      setCurrentFilter(filterType);
      setOpenFilter(filterType);
      setPopoverSearchTerm(""); // Reset search term when opening a new popover
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setPopoverSearchTerm("");
    setOpenFilter(""); // Reset the open filter state
    // Auto-apply filters when popover is closed
    handleApplyFilters();
  };

  const handleApplyFilters = () => {
    const filterParams = {
      domain_id:
        selectedDomains.length > 0
          ? selectedDomains.map((domain) => domain.domain_id)
          : 0,
      status: selectedStatus.length > 0 ? selectedStatus : null,
      cohort_id:
        selectedCohorts.length > 0
          ? selectedCohorts.map((cohort) => cohort.cohort_id)
          : null,
      year: selectedYears.length > 0 ? selectedYears : null,
      branch:
        selectedBranches.length > 0
          ? selectedBranches.map((branch) => branch.branch_name)
          : null,
    };

    // Call the parent component's onSearch function with the filter parameters
    if (onSearch) {
      onSearch(filterParams);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExportLoading(true);

      // Create the filter parameters object
      const filterParams = {
        domain_id:
          selectedDomains.length > 0
            ? selectedDomains.map((domain) => domain.domain_id)
            : 0,
        status: selectedStatus.length > 0 ? selectedStatus : null,
        cohort_id:
          selectedCohorts.length > 0
            ? selectedCohorts.map((cohort) => cohort.cohort_id)
            : null,
        year: selectedYears.length > 0 ? selectedYears : null,
        branch:
          selectedBranches.length > 0
            ? selectedBranches.map((branch) => branch.branch_name)
            : null,
      };

      // Check if any filters are selected
      const hasAnyFilterSelected =
        selectedDomains.length > 0 ||
        selectedStatus.length > 0 ||
        selectedCohorts.length > 0 ||
        selectedYears.length > 0 ||
        selectedBranches.length > 0;

      console.log(
        `Exporting CSV with ${hasAnyFilterSelected ? "filters" : "all data"}:`,
        filterParams
      );

      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      // Call API with axios
      const response = await axios({
        url: `${baseUrl}/internship/export`,
        method: "POST",
        data: filterParams,
        responseType: "blob", // Important for handling file downloads
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Create a download link for the CSV file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Get filename from content-disposition header if available
      const contentDisposition = response.headers["content-disposition"];
      let filename = hasAnyFilterSelected
        ? "filtered_internship_students.csv"
        : "all_internship_students.csv";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // For backward compatibility, still call onExport if provided
      if (onExport) {
        onExport(filterParams);
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError("Failed to export CSV. Please try again later.");
    } finally {
      setExportLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedDomains([]);
    setSelectedStatus([]);
    setSelectedCohorts([]);
    setSelectedYears([]);
    setSelectedBranches([]);

    // Apply the reset filters immediately
    handleApplyFilters();
  };

  // Handle closing error alert
  const handleCloseError = () => {
    setError(null);
  };

  // Active filters count for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedDomains.length > 0) count++;
    if (selectedStatus.length > 0) count++;
    if (selectedCohorts.length > 0) count++;
    if (selectedYears.length > 0) count++;
    if (selectedBranches.length > 0) count++;
    return count;
  };

  // Get filter label and count
  const getFilterLabel = (type) => {
    switch (type) {
      case "domains":
        return {
          label: "Domains",
          count: selectedDomains.length,
          hasSelection: selectedDomains.length > 0,
        };
      case "status":
        return {
          label: "Status",
          count: selectedStatus.length,
          hasSelection: selectedStatus.length > 0,
        };
      case "cohorts":
        return {
          label: "Cohorts",
          count: selectedCohorts.length,
          hasSelection: selectedCohorts.length > 0,
        };
      case "years":
        return {
          label: "Years",
          count: selectedYears.length,
          hasSelection: selectedYears.length > 0,
        };
      case "branches":
        return {
          label: "Branches",
          count: selectedBranches.length,
          hasSelection: selectedBranches.length > 0,
        };
      default:
        return { label: type, count: 0, hasSelection: false };
    }
  };

  // Toggle selection in the popover
  const toggleSelection = (type, item) => {
    switch (type) {
      case "domains":
        const domainExists = selectedDomains.some(
          (domain) => domain.domain_id === item.domain_id
        );
        if (domainExists) {
          setSelectedDomains(
            selectedDomains.filter(
              (domain) => domain.domain_id !== item.domain_id
            )
          );
        } else {
          setSelectedDomains([...selectedDomains, item]);
        }
        break;
      case "status":
        if (selectedStatus.includes(item)) {
          setSelectedStatus(selectedStatus.filter((status) => status !== item));
        } else {
          setSelectedStatus([...selectedStatus, item]);
        }
        break;
      case "cohorts":
        const cohortExists = selectedCohorts.some(
          (cohort) => cohort.cohort_id === item.cohort_id
        );
        if (cohortExists) {
          setSelectedCohorts(
            selectedCohorts.filter(
              (cohort) => cohort.cohort_id !== item.cohort_id
            )
          );
        } else {
          setSelectedCohorts([...selectedCohorts, item]);
        }
        break;
      case "years":
        if (selectedYears.includes(item)) {
          setSelectedYears(selectedYears.filter((year) => year !== item));
        } else {
          setSelectedYears([...selectedYears, item]);
        }
        break;
      case "branches":
        const branchExists = selectedBranches.some(
          (branch) => branch.branch_id === item.branch_id
        );
        if (branchExists) {
          setSelectedBranches(
            selectedBranches.filter(
              (branch) => branch.branch_id !== item.branch_id
            )
          );
        } else {
          setSelectedBranches([...selectedBranches, item]);
        }
        break;
      default:
        break;
    }
  };

  // Check if an item is selected
  const isItemSelected = (type, item) => {
    switch (type) {
      case "domains":
        return selectedDomains.some(
          (domain) => domain.domain_id === item.domain_id
        );
      case "status":
        return selectedStatus.includes(item);
      case "cohorts":
        return selectedCohorts.some(
          (cohort) => cohort.cohort_id === item.cohort_id
        );
      case "years":
        return selectedYears.includes(item);
      case "branches":
        return selectedBranches.some(
          (branch) => branch.branch_id === item.branch_id
        );
      default:
        return false;
    }
  };

  // Render popover content based on current filter
  const renderPopoverContent = () => {
    let items = [];
    let title = "";

    switch (currentFilter) {
      case "domains":
        items = filterOptions.domains || [];
        title = "Select Domains";
        break;
      case "status":
        items = statuses;
        title = "Select Status";
        break;
      case "cohorts":
        items = filterOptions.cohorts || [];
        title = "Select Cohorts";
        break;
      case "years":
        items = years;
        title = "Select Years";
        break;
      case "branches":
        items = filterOptions.branches || [];
        title = "Select Branches";
        break;
      default:
        return null;
    }

    // Filter items based on search term if provided
    const filteredItems = items.filter((item) => {
      if (popoverSearchTerm === "") return true;

      let itemValue = "";
      if (typeof item === "object") {
        if (currentFilter === "domains") itemValue = item.domain_name;
        else if (currentFilter === "cohorts") itemValue = item.cohort_name;
        else if (currentFilter === "branches") itemValue = item.branch_name;
      } else {
        itemValue = String(item);
      }

      return itemValue.toLowerCase().includes(popoverSearchTerm.toLowerCase());
    });

    return (
      <PopoverContent>
        <PopoverHeader>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              background: "linear-gradient(45deg, #006699, #0088cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small" onClick={handleClosePopover}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </PopoverHeader>

        {/* Search bar in popover */}
        <Box sx={{ p: 1, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${title.split(" ")[1]}...`}
            value={popoverSearchTerm}
            onChange={(e) => setPopoverSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
              endAdornment: popoverSearchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="clear search"
                    onClick={() => setPopoverSearchTerm("")}
                    edge="end"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "rgba(0, 0, 0, 0.03)",
              },
            }}
          />
        </Box>

        {filteredItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">No matching items found</Typography>
          </Box>
        ) : (
          <FilterList>
            {filteredItems.map((item, index) => {
              // Fixed property access based on filter type
              let itemValue = "";
              if (typeof item === "object") {
                if (currentFilter === "domains") itemValue = item.domain_name;
                else if (currentFilter === "cohorts")
                  itemValue = item.cohort_name;
                else if (currentFilter === "branches")
                  itemValue = item.branch_name;
              } else {
                itemValue = item;
              }

              const isSelected = isItemSelected(currentFilter, item);

              return (
                <ListItem
                  button
                  key={index}
                  onClick={() => toggleSelection(currentFilter, item)}
                  dense
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    bgcolor: isSelected
                      ? "rgba(0, 102, 153, 0.1)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: isSelected
                        ? "rgba(0, 102, 153, 0.15)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    padding: "6px 12px",
                    width: "100%",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "32px" }}>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      icon={icon}
                      checkedIcon={checkedIcon}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        color: isSelected ? "#006699" : undefined,
                        "&.Mui-checked": {
                          color: "#006699",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={itemValue || `Item ${index + 1}`}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      whiteSpace: "normal",
                      overflow: "visible",
                    }}
                    sx={{
                      overflow: "visible",
                      wordBreak: "break-word",
                    }}
                  />
                </ListItem>
              );
            })}
          </FilterList>
        )}

        <Box sx={{ mt: "auto", p: 1, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              switch (currentFilter) {
                case "domains":
                  setSelectedDomains([]);
                  break;
                case "status":
                  setSelectedStatus([]);
                  break;
                case "cohorts":
                  setSelectedCohorts([]);
                  break;
                case "years":
                  setSelectedYears([]);
                  break;
                case "branches":
                  setSelectedBranches([]);
                  break;
                default:
                  break;
              }
            }}
            sx={{
              flex: 1,
              borderRadius: 2,
              background: "linear-gradient(45deg, #FF9800 30%, #FFA726 90%)",
              boxShadow: "0 4px 10px rgba(255, 152, 0, 0.3)",
              color: "white",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #F57C00 30%, #FF9800 90%)",
                boxShadow: "0 6px 12px rgba(255, 152, 0, 0.4)",
              },
            }}
            startIcon={<RestartAltIcon />}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleClosePopover}
            sx={{
              flex: 1,
              borderRadius: 2,
              background: "linear-gradient(45deg, #006699 30%, #0088cc 90%)",
              boxShadow: "0 4px 10px rgba(0, 102, 153, 0.3)",
              color: "white",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #005588 30%, #0077bb 90%)",
                boxShadow: "0 6px 12px rgba(0, 102, 153, 0.4)",
              },
            }}
            endIcon={<CheckCircleIcon />}
          >
            Done
          </Button>
        </Box>
      </PopoverContent>
    );
  };

  // Get appropriate anchor element for each filter
  const getButtonRefForFilter = (filterType) => {
    switch (filterType) {
      case "domains":
        return domainButtonRef;
      case "status":
        return statusButtonRef;
      case "cohorts":
        return cohortButtonRef;
      case "years":
        return yearButtonRef;
      case "branches":
        return branchButtonRef;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledCard>
          <CardHeader>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                background: "linear-gradient(45deg, #006699, #0088cc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Report
            </Typography>

            <Tooltip title="Reset All Filters">
              <IconButton
                onClick={resetFilters}
                sx={{
                  height: "40px",
                  width: "40px",
                  backgroundColor: "rgba(0,0,0,0.05)",
                }}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardHeader>

          <CardContent>
            <Box component="form" noValidate autoComplete="off">
              {/* Filter Form Box */}
              <FilterFormContainer>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Filters
                </Typography>

                {loading ? (
                  <FilterRowContainer>
                    <FilterSkeleton />
                  </FilterRowContainer>
                ) : (
                  <FilterRowContainer>
                    {/* Domains filter with updated arrow logic */}
                    <FilterDropdown
                      ref={domainButtonRef}
                      selected={selectedDomains.length > 0}
                      open={openFilter === "domains"}
                      onClick={(e) => handleFilterClick("domains", e)}
                      endIcon={
                        openFilter === "domains" ? (
                          <ArrowDropUpIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedDomains.length > 0
                                  ? "white"
                                  : "inherit",
                            }}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedDomains.length > 0
                                  ? "white"
                                  : "inherit",
                            }}
                          />
                        )
                      }
                    >
                      Domains
                      {selectedDomains.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            backgroundColor: "#ff9800",
                            color: "white",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          {selectedDomains.length}
                        </Box>
                      )}
                    </FilterDropdown>

                    {/* Status filter with updated arrow logic */}
                    <FilterDropdown
                      ref={statusButtonRef}
                      selected={selectedStatus.length > 0}
                      open={openFilter === "status"}
                      onClick={(e) => handleFilterClick("status", e)}
                      endIcon={
                        openFilter === "status" ? (
                          <ArrowDropUpIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedStatus.length > 0 ? "white" : "inherit",
                            }}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedStatus.length > 0 ? "white" : "inherit",
                            }}
                          />
                        )
                      }
                    >
                      Status
                      {selectedStatus.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            backgroundColor: "#ff9800",
                            color: "white",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          {selectedStatus.length}
                        </Box>
                      )}
                    </FilterDropdown>

                    {/* Cohorts filter with updated arrow logic */}
                    <FilterDropdown
                      ref={cohortButtonRef}
                      selected={selectedCohorts.length > 0}
                      open={openFilter === "cohorts"}
                      onClick={(e) => handleFilterClick("cohorts", e)}
                      endIcon={
                        openFilter === "cohorts" ? (
                          <ArrowDropUpIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedCohorts.length > 0
                                  ? "white"
                                  : "inherit",
                            }}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedCohorts.length > 0
                                  ? "white"
                                  : "inherit",
                            }}
                          />
                        )
                      }
                    >
                      Cohorts
                      {selectedCohorts.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            backgroundColor: "#ff9800",
                            color: "white",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          {selectedCohorts.length}
                        </Box>
                      )}
                    </FilterDropdown>

                    {/* Years filter with updated arrow logic */}
                    <FilterDropdown
                      ref={yearButtonRef}
                      selected={selectedYears.length > 0}
                      open={openFilter === "years"}
                      onClick={(e) => handleFilterClick("years", e)}
                      endIcon={
                        openFilter === "years" ? (
                          <ArrowDropUpIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedYears.length > 0 ? "white" : "inherit",
                            }}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedYears.length > 0 ? "white" : "inherit",
                            }}
                          />
                        )
                      }
                    >
                      Years
                      {selectedYears.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            backgroundColor: "#ff9800",
                            color: "white",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          {selectedYears.length}
                        </Box>
                      )}
                    </FilterDropdown>

                    {/* Branches filter with updated arrow logic */}
                    <FilterDropdown
                      ref={branchButtonRef}
                      selected={selectedBranches.length > 0}
                      open={openFilter === "branches"}
                      onClick={(e) => handleFilterClick("branches", e)}
                      endIcon={
                        openFilter === "branches" ? (
                          <ArrowDropUpIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedBranches.length > 0
                                  ? "white"
                                  : "inherit",
                            }}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            sx={{
                              fontSize: 16,
                              color:
                                selectedBranches.length > 0
                                  ? "white"
                                  : "inherit",
                            }}
                          />
                        )
                      }
                      sx={{
                        minWidth: "90px",
                      }}
                    >
                      Branches
                      {selectedBranches.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            backgroundColor: "#ff9800",
                            color: "white",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          {selectedBranches.length}
                        </Box>
                      )}
                    </FilterDropdown>
                  </FilterRowContainer>
                )}

                {getActiveFiltersCount() > 0 && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      bgcolor: "rgba(0, 136, 204, 0.05)",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {getActiveFiltersCount()}{" "}
                      {getActiveFiltersCount() === 1 ? "filter" : "filters"}{" "}
                      applied
                    </Typography>
                  </Box>
                )}
              </FilterFormContainer>

              {/* Export Button in right corner */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={40}
                    sx={{ borderRadius: 1 }}
                  />
                ) : (
                  <ExportButton
                    variant="contained"
                    onClick={handleExportCSV}
                    startIcon={exportLoading ? null : <DownloadIcon />}
                    disabled={exportLoading}
                  >
                    {exportLoading
                      ? "Exporting..."
                      : isMobile
                      ? "Export"
                      : getActiveFiltersCount() > 0
                      ? "Export Filtered"
                      : "Export All"}
                  </ExportButton>
                )}
              </Box>
            </Box>
          </CardContent>
        </StyledCard>
      </motion.div>

      {/* Popover for filter selections with fixed positioning */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            mt: 1, // Small margin for visual separation
            "& .MuiPopover-paper": {
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            },
            // Remove the arrow pointing up for a cleaner look
            "&:before": {
              display: "none", // Hide the arrow
            },
          },
        }}
      >
        {renderPopoverContent()}
      </Popover>

      {/* Error Snackbar */}
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
    </Container>
  );
};

export default FilterForm;
