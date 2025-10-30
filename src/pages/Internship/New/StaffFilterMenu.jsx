// ModernUpfrontFilters.js
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Popover,
  TextField,
  Chip,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  Filter as FilterIcon,
  RefreshCw,
  Search,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// Custom theme for filters
const filterTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: "6px",
          color: "#0061f2",
          "&.Mui-checked": {
            color: "#0061f2",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        },
      },
    },
  },
});

// Helper function to format dates in MMM YYYY format
const formatDateToMonthYear = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const FilterButton = ({
  label,
  icon,
  selectedCount,
  onClick,
  anchorEl,
  onClose,
  children,
  filterKey,
}) => {
  const isOpen = Boolean(anchorEl && anchorEl.id === filterKey);

  return (
    <>
      <Button
        id={filterKey}
        onClick={onClick}
        variant="outlined"
        endIcon={<ChevronDown size={14} />}
        sx={{
          borderRadius: "12px",
          padding: { xs: "4px 8px", sm: "6px 12px" },
          minHeight: { xs: "28px", sm: "32px" },
          borderColor: selectedCount > 0 ? "#0061f2" : "rgba(0, 0, 0, 0.12)",
          backgroundColor: selectedCount > 0 ? "#e3f2fd" : "transparent",
          color: selectedCount > 0 ? "#0061f2" : "#666",
          textTransform: "none",
          fontSize: { xs: "0.75rem", sm: "0.8rem" },
          minWidth: { xs: "auto", sm: "120px" },
          "&:hover": {
            borderColor: "#0061f2",
            backgroundColor: "#e3f2fd",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {React.cloneElement(icon, { size: 14 })}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>{label}</Box>
          {selectedCount > 0 && (
            <Box
              sx={{
                backgroundColor: "#0061f2",
                color: "#fff",
                borderRadius: "10px",
                padding: "0 6px",
                fontSize: "0.75rem",
                minWidth: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 0.5,
              }}
            >
              {selectedCount}
            </Box>
          )}
        </Box>
      </Button>
      <Popover
        id={filterKey}
        open={isOpen}
        anchorEl={anchorEl?.element}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              width: { xs: "90vw", sm: 320 },
              maxWidth: 320,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>{children}</Box>
      </Popover>
    </>
  );
};

const FilterPopoverContent = ({
  title,
  options,
  selectedValues,
  onSelectionChange,
  valueKey,
  labelKey,
  displayKey,
  onSearch,
  searchTerm,
  loading,
}) => {
  // Fix: Safely handle potential undefined values including numbers
  const filteredOptions = options.filter((option) => {
    // First get the display value safely
    const displayValue =
      typeof option === "number"
        ? option.toString()
        : displayKey && option[displayKey]
        ? option[displayKey]
        : option[labelKey] || (typeof option === "string" ? option : null);

    // Only if displayValue exists, continue with filtering
    return displayValue && typeof displayValue === "string"
      ? displayValue.toLowerCase().includes((searchTerm || "").toLowerCase())
      : false;
  });

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 1, fontSize: "0.9rem" }}
      >
        {title}
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder={`Search ${title.toLowerCase()}`}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} color="#666" />
            </InputAdornment>
          ),
          sx: { height: "32px", fontSize: "0.8rem" },
        }}
        sx={{ mb: 1.5 }}
      />
      <Box
        sx={{
          maxHeight: 250,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ddd",
            borderRadius: "2px",
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        ) : filteredOptions.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              color: "#666",
              py: 2,
              fontSize: "0.8rem",
            }}
          >
            No results found
          </Typography>
        ) : (
          filteredOptions.map((option, index) => {
            // Handle when option is a simple string or number
            const optionId =
              typeof option === "number"
                ? option.toString()
                : typeof option === "object"
                ? option[valueKey]
                : typeof option === "string"
                ? option
                : index.toString();

            const optionLabel =
              typeof option === "number"
                ? option.toString()
                : typeof option === "object"
                ? displayKey && option[displayKey]
                  ? option[displayKey]
                  : option[labelKey]
                : option;

            return (
              <FormControlLabel
                key={optionId}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedValues.includes(optionId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectionChange([...selectedValues, optionId]);
                      } else {
                        onSelectionChange(
                          selectedValues.filter((id) => id !== optionId)
                        );
                      }
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {optionLabel || "Unnamed Option"}
                  </Typography>
                }
                sx={{
                  width: "100%",
                  m: 0,
                  py: 0.25,
                  "&:hover": { backgroundColor: "#f8f9fa" },
                  borderRadius: "6px",
                  "& .MuiFormControlLabel-label": {
                    width: "100%",
                  },
                }}
              />
            );
          })
        )}
      </Box>
    </>
  );
};

const StaffModernUpfrontFilters = ({ onFilterChange, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedInstituteId, setSelectedInstituteId] = useState(() => {
    return localStorage.getItem("selectedInstituteId") || "";
  });

  const [filters, setFilters] = useState({
    cohorts: [],
    domains: [],
    branches: [],
    passoutYears: [],
  });

  const [filterOptions, setFilterOptions] = useState(null);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    cohorts: "",
    domains: "",
    branches: "",
    passoutYears: "",
  });
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);

  // Generate passout years dynamically
  const passoutYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 2023; i <= currentYear + 5; i++) {
      years.push({ year_id: i.toString(), year_name: i.toString() });
    }
    return years;
  }, []);

  // Process cohorts to include formatted date range
  const processedCohorts = useMemo(() => {
    if (!filterOptions?.cohortsResponse) return [];

    return filterOptions.cohortsResponse.map((cohort) => {
      const startFormatted = formatDateToMonthYear(cohort.start_date);
      const endFormatted = formatDateToMonthYear(cohort.end_date);

      return {
        ...cohort,
        displayName: `${cohort.cohort_name} (${startFormatted} - ${endFormatted})`,
      };
    });
  }, [filterOptions?.cohortsResponse]);

  // Process branches response to convert strings to objects with ids
  const processedBranches = useMemo(() => {
    if (
      !filterOptions?.branchesResponse ||
      !Array.isArray(filterOptions.branchesResponse)
    )
      return [];

    // If branches are strings, convert to objects with id and name
    if (
      filterOptions.branchesResponse.length > 0 &&
      typeof filterOptions.branchesResponse[0] === "string"
    ) {
      return filterOptions.branchesResponse.map((branch, index) => ({
        branch_id: index.toString(),
        branch_name: branch,
      }));
    }

    return filterOptions.branchesResponse;
  }, [filterOptions?.branchesResponse]);

  // Process domains response to convert strings to objects with ids
  const processedDomains = useMemo(() => {
    if (
      !filterOptions?.domainsResponse ||
      !Array.isArray(filterOptions.domainsResponse)
    )
      return [];

    // If domains are strings, convert to objects with id and name
    if (
      filterOptions.domainsResponse.length > 0 &&
      typeof filterOptions.domainsResponse[0] === "string"
    ) {
      return filterOptions.domainsResponse.map((domain, index) => ({
        domain_id: index.toString(),
        domain_name: domain,
      }));
    }

    return filterOptions.domainsResponse;
  }, [filterOptions?.domainsResponse]);

  // Process years from yearsResponse
  const processedYears = useMemo(() => {
    if (
      !filterOptions?.yearsResponse ||
      !Array.isArray(filterOptions.yearsResponse)
    )
      return passoutYears;

    // If years are numbers, convert to objects with id and name
    if (
      filterOptions.yearsResponse.length > 0 &&
      typeof filterOptions.yearsResponse[0] === "number"
    ) {
      return filterOptions.yearsResponse.map((year) => ({
        year_id: year.toString(),
        year_name: year.toString(),
      }));
    }

    return filterOptions.yearsResponse;
  }, [filterOptions?.yearsResponse, passoutYears]);

  // Find the latest cohort
  const latestCohort = useMemo(() => {
    if (!processedCohorts.length) return null;

    return processedCohorts.reduce((latest, current) => {
      const currentDate = new Date(current.start_date);
      const latestDate = new Date(latest.start_date);
      return currentDate > latestDate ? current : latest;
    }, processedCohorts[0]);
  }, [processedCohorts]);

  // Setup localStorage listener for institute_id changes
  useEffect(() => {
    // Function to check for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "selectedInstituteId") {
        const newInstituteId = e.newValue || "";
        if (newInstituteId !== selectedInstituteId) {
          setSelectedInstituteId(newInstituteId);
          // Refetch filter options with new institute ID
          fetchFilterOptions();
        }
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [selectedInstituteId]);

  // Check for institute_id changes periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentInstituteId =
        localStorage.getItem("selectedInstituteId") || "";
      if (currentInstituteId !== selectedInstituteId) {
        setSelectedInstituteId(currentInstituteId);
        // Refetch filter options with new institute ID
        fetchFilterOptions();
      }
    }, 2000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [selectedInstituteId]);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      setOptionsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const instituteId = localStorage.getItem("selectedInstituteId") || "";

      const response = await api.post(
        `${BASE_URL}/internship/studentInformationOptionsStaff`,
        { institute_id: instituteId }, // Send institute_id in the request payload
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFilterOptions(response.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    } finally {
      setOptionsLoading(false);
    }
  };

  // Fetch filter options when component mounts or when institute ID changes
  useEffect(() => {
    fetchFilterOptions();
  }, [selectedInstituteId]);

  // Apply the latest cohort as the default filter immediately when available
  useEffect(() => {
    if (latestCohort && !initialSetupComplete && !filters.cohorts.length) {
      const updatedFilters = {
        ...filters,
        cohorts: [latestCohort.cohort_id],
      };

      setFilters(updatedFilters);

      // This triggers the parent component to fetch data with the selected cohort right away
      onFilterChange(updatedFilters);

      setInitialSetupComplete(true);
    }
  }, [latestCohort, onFilterChange, filters, initialSetupComplete]);

  const handleClick = (event, filterKey) => {
    event.preventDefault();
    setAnchorEl({ id: filterKey, element: event.currentTarget });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectionChange = (filterType, selectedIds) => {
    // Update the filters state
    setFilters((prev) => ({
      ...prev,
      [filterType]: selectedIds,
    }));
  };

  const handleSearch = (filterType, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      cohorts: [],
      domains: [],
      branches: [],
      passoutYears: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

  return (
    <ThemeProvider theme={filterTheme}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 1.5 },
          mb: 2,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "16px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1.5 },
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", sm: "flex-start" },
            }}
          >
            <FilterButton
              label="Cohorts"
              icon={<Users />}
              selectedCount={filters.cohorts.length}
              onClick={(e) => handleClick(e, "cohorts")}
              anchorEl={anchorEl}
              onClose={handleClose}
              filterKey="cohorts"
            >
              <FilterPopoverContent
                title="Select Cohorts"
                options={processedCohorts}
                selectedValues={filters.cohorts}
                onSelectionChange={(selected) =>
                  handleSelectionChange("cohorts", selected)
                }
                valueKey="cohort_id"
                labelKey="cohort_name"
                displayKey="displayName"
                onSearch={(value) => handleSearch("cohorts", value)}
                searchTerm={searchTerms.cohorts}
                loading={optionsLoading}
              />
            </FilterButton>
            <FilterButton
              label="Domains"
              icon={<BookOpen />}
              selectedCount={filters.domains.length}
              onClick={(e) => handleClick(e, "domains")}
              anchorEl={anchorEl}
              onClose={handleClose}
              filterKey="domains"
            >
              <FilterPopoverContent
                title="Select Domains"
                options={processedDomains}
                selectedValues={filters.domains}
                onSelectionChange={(selected) =>
                  handleSelectionChange("domains", selected)
                }
                valueKey="domain_id"
                labelKey="domain_name"
                onSearch={(value) => handleSearch("domains", value)}
                searchTerm={searchTerms.domains}
                loading={optionsLoading}
              />
            </FilterButton>

            <FilterButton
              label="Branches"
              icon={<GraduationCap />}
              selectedCount={filters.branches.length}
              onClick={(e) => handleClick(e, "branches")}
              anchorEl={anchorEl}
              onClose={handleClose}
              filterKey="branches"
            >
              <FilterPopoverContent
                title="Select Branches"
                options={processedBranches}
                selectedValues={filters.branches}
                onSelectionChange={(selected) =>
                  handleSelectionChange("branches", selected)
                }
                valueKey="branch_id"
                labelKey="branch_name"
                onSearch={(value) => handleSearch("branches", value)}
                searchTerm={searchTerms.branches}
                loading={optionsLoading}
              />
            </FilterButton>

            <FilterButton
              label="Passout Years"
              icon={<Calendar />}
              selectedCount={filters.passoutYears.length}
              onClick={(e) => handleClick(e, "passoutYears")}
              anchorEl={anchorEl}
              onClose={handleClose}
              filterKey="passoutYears"
            >
              <FilterPopoverContent
                title="Select Passout Years"
                options={processedYears}
                selectedValues={filters.passoutYears}
                onSelectionChange={(selected) =>
                  handleSelectionChange("passoutYears", selected)
                }
                valueKey="year_id"
                labelKey="year_name"
                onSearch={(value) => handleSearch("passoutYears", value)}
                searchTerm={searchTerms.passoutYears}
                loading={optionsLoading}
              />
            </FilterButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: { xs: "flex-end", sm: "flex-end" },
            }}
          >
            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<RefreshCw size={14} />}
                onClick={handleClearFilters}
                sx={{
                  textTransform: "none",
                  color: "#666",
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  minHeight: { xs: "28px", sm: "32px" },
                  px: { xs: 1, sm: 2 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                Clear All
              </Button>
            )}

            <Button
              variant="contained"
              onClick={handleApplyFilters}
              disabled={loading}
              startIcon={<FilterIcon size={14} />}
              sx={{
                backgroundColor: "#0061f2",
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 0.5 },
                minHeight: { xs: "28px", sm: "32px" },
                borderRadius: "12px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#0051d2",
                  boxShadow: "0 2px 4px rgba(0, 97, 242, 0.2)",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default StaffModernUpfrontFilters;
