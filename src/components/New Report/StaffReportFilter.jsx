import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Button,
  Typography,
  styled,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
  Chip,
  alpha,
  Divider,
  CircularProgress,
  Skeleton,
  Modal,
  Fade,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "8px 20px",
  boxShadow: "0 2px 5px 0 rgba(0,0,0,0.08)",
  margin: theme.spacing(1),
  fontSize: "0.875rem",
  fontWeight: 500,
  "&:hover": {
    boxShadow: "0 4px 12px 0 rgba(0,0,0,0.12)",
  },
}));

const SectionTitle = styled(Typography)({
  fontSize: "0.9rem",
  fontWeight: 600,
  marginBottom: 12,
  color: "text.primary",
});

const FilterSection = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  marginBottom: 24,
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
}));

const HoverChip = styled(Chip)(({ theme }) => ({
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    cursor: "default",
  },
}));

const SuccessModalContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  padding: theme.spacing(4),
  textAlign: "center",
}));

const SuccessIcon = styled(CheckCircleOutlineIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2),
}));

const EmailContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: 8,
  padding: theme.spacing(2),
  margin: `${theme.spacing(3)} 0`,
}));

const EmailText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.primary.main,
  fontWeight: 500,
  marginLeft: theme.spacing(1),
}));

const NoDataMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  textAlign: "center",
}));

const InfoIcon = styled(InfoOutlinedIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.info.main,
  marginBottom: theme.spacing(2),
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Function to format date range for cohorts
const formatDateRange = (startDate, endDate) => {
  try {
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Format as "Month YYYY - Month YYYY"
    const startFormatted = start.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const endFormatted = end.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return "Invalid date range";
  }
};

// Convert API response to usable filter format
const processFilterOptions = (apiData) => {
  if (!apiData || !apiData.filterData) return [];

  return apiData.filterData.map((filter) => {
    let options = filter.options;
    let originalOptions = null;

    // Handle different option formats
    if (Array.isArray(options) && options.length > 0) {
      if (typeof options[0] === "object") {
        // Store original objects for reference (for domain_id, etc.)
        originalOptions = [...options];

        // Determine the key pattern
        let nameKey = null;
        if ("domain_name" in options[0]) nameKey = "domain_name";
        else if ("branch_name" in options[0]) nameKey = "branch_name";
        else if ("cohort_name" in options[0]) {
          nameKey = "cohort_name";
          // Special handling for cohorts to include date range
          options = options.map((option) => {
            if (option.start_date && option.end_date) {
              return `${option.cohort_name} (${formatDateRange(
                option.start_date,
                option.end_date
              )})`;
            }
            return option.cohort_name;
          });
        }

        if (nameKey && nameKey !== "cohort_name") {
          // Map objects to strings (for non-cohort objects)
          options = options.map((option) => option[nameKey]);
        }
      }
      // For plain years array or string array, keep as is
    }

    return {
      id: filter.id,
      name: filter.name.charAt(0).toUpperCase() + filter.name.slice(1), // Capitalize first letter
      options: options,
      originalOptions: originalOptions, // Store original objects for ID reference
    };
  });
};

// Function to check if required filters (domain, cohort, branch) are all empty
const checkRequiredFiltersEmpty = (filterData) => {
  const domainFilter = filterData.find(
    (f) =>
      f.name.toLowerCase() === "domains" || f.name.toLowerCase() === "domain"
  );
  const cohortFilter = filterData.find(
    (f) =>
      f.name.toLowerCase() === "cohorts" || f.name.toLowerCase() === "cohort"
  );
  const branchFilter = filterData.find(
    (f) =>
      f.name.toLowerCase() === "branches" || f.name.toLowerCase() === "branch"
  );

  const isDomainEmpty =
    !domainFilter || !domainFilter.options || domainFilter.options.length === 0;
  const isCohortEmpty =
    !cohortFilter || !cohortFilter.options || cohortFilter.options.length === 0;
  const isBranchEmpty =
    !branchFilter || !branchFilter.options || branchFilter.options.length === 0;

  return isDomainEmpty && isCohortEmpty && isBranchEmpty;
};

const StaffReportFilter = ({ onGenerateReport }) => {
  const [filterCriteria, setFilterCriteria] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [hoverTooltip, setHoverTooltip] = useState({ show: false, text: "" });
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
    email: "",
  });
  const [areAllRequiredFiltersEmpty, setAreAllRequiredFiltersEmpty] =
    useState(false);
  const [selectedInstituteId, setSelectedInstituteId] = useState(
    localStorage.getItem("selectedInstituteId") || ""
  );

  // Fetch filter data on component mount and when selectedInstituteId changes
  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const currentInstituteId =
          localStorage.getItem("selectedInstituteId") || "";

        // Update the selectedInstituteId state
        setSelectedInstituteId(currentInstituteId);

        const response = await api.post(
          `${BASE_URL}/internship/studentInformationOptions2staff`,
          {
            institute_id: currentInstituteId, // Send the institute_id in the request body
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const processedData = processFilterOptions(response.data);
        setFilterData(processedData);

        // Check if all required filters are empty
        setAreAllRequiredFiltersEmpty(checkRequiredFiltersEmpty(processedData));

        setError(null);
      } catch (err) {
        console.error("Error fetching filter data:", err);
        setError("Failed to load filter options. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterData();

    // Setup localStorage event listener to detect changes to selectedInstituteId
    const handleStorageChange = (e) => {
      if (
        e.key === "selectedInstituteId" &&
        e.newValue !== selectedInstituteId
      ) {
        // Refresh data when selectedInstituteId changes
        fetchFilterData();
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Also check for changes every second (as a fallback)
    const intervalId = setInterval(() => {
      const currentInstituteId =
        localStorage.getItem("selectedInstituteId") || "";
      if (currentInstituteId !== selectedInstituteId) {
        fetchFilterData();
      }
    }, 1000);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [selectedInstituteId]);

  // Check if form has any valid filters selected
  const hasValidFilters = () => {
    for (const [filterId, values] of Object.entries(filterCriteria)) {
      // If any filter has selections and they're not just "Select All"
      if (
        values?.length > 0 &&
        !(values.length === 1 && values[0] === "Select All")
      ) {
        return true;
      }
    }
    return false;
  };

  // Extract cohort ID from displayed cohort string
  const extractCohortId = (cohortDisplayString, originalOptions) => {
    if (!originalOptions) return null;

    // Extract the cohort name without the date range
    const cohortNameMatch = cohortDisplayString.match(/^(.+?) \(/);
    if (!cohortNameMatch) return null;

    const cohortName = cohortNameMatch[1];

    // Find the matching cohort in original options
    const cohortObj = originalOptions.find(
      (obj) => obj.cohort_name === cohortName
    );
    return cohortObj?.cohort_id;
  };

  // Prepare report data for API submission
  const prepareReportData = () => {
    // Initialize empty payload with default empty arrays for all required fields
    const payload = {
      domains: [],
      cohorts: [],
      years: [],
      branches: [],
      verificationStatus: [],
      assessmentStatus: [],
      issuedStatus: [],
      approvalStatus: [],
      institute_id: selectedInstituteId, // Include the selectedInstituteId in the payload
    };

    // Process each filter type if it exists in the filter data
    filterData.forEach((filter) => {
      const filterName = filter.name.toLowerCase();
      const filterId = filter.id;

      // Skip if no selections for this filter
      if (!filterCriteria[filterId] || filterCriteria[filterId].length === 0) {
        return;
      }

      // Get selected values (excluding "Select All")
      const selectedValues = filterCriteria[filterId].filter(
        (val) => val !== "Select All"
      );

      // Skip if no actual selections
      if (selectedValues.length === 0) {
        return;
      }

      // Handle different filter types
      if (filterName === "domains" || filterName === "domain") {
        // For domains, extract domain_id from originalOptions
        if (filter.originalOptions) {
          const domainIds = [];

          // Loop through selected domain names and find their corresponding domain_ids
          selectedValues.forEach((domainName) => {
            const domainObject = filter.originalOptions.find(
              (obj) => obj.domain_name === domainName
            );
            if (domainObject && domainObject.domain_id) {
              domainIds.push(domainObject.domain_id);
            }
          });

          payload.domains = domainIds;
        } else {
          // Fallback if originalOptions is not available
          payload.domains = selectedValues;
        }
      } else if (filterName === "cohorts" || filterName === "cohort") {
        // For cohorts, extract cohort_id from originalOptions
        if (filter.originalOptions) {
          const cohortIds = [];

          // Loop through selected cohort display strings and find their corresponding cohort_ids
          selectedValues.forEach((cohortDisplayString) => {
            const cohortId = extractCohortId(
              cohortDisplayString,
              filter.originalOptions
            );
            if (cohortId) {
              cohortIds.push(cohortId);
            }
          });

          payload.cohorts = cohortIds;
        } else {
          // Fallback if originalOptions is not available
          payload.cohorts = selectedValues;
        }
      } else if (filterName === "years" || filterName === "year") {
        // For years, convert strings to integers
        payload.years = selectedValues.map((val) => {
          const year = parseInt(val, 10);
          return isNaN(year) ? new Date().getFullYear() : year;
        });
      } else if (filterName === "branches" || filterName === "branch") {
        payload.branches = selectedValues;
      } else if (filterName === "verification status") {
        payload.verificationStatus = selectedValues;
      } else if (filterName === "assessment status") {
        payload.assessmentStatus = selectedValues;
      } else if (filterName === "issued status") {
        payload.issuedStatus = selectedValues;
      } else if (filterName === "approval status") {
        payload.approvalStatus = selectedValues;
      }
    });

    // Ensure we always have at least empty arrays (not null)
    Object.keys(payload).forEach((key) => {
      if (!payload[key] && key !== "institute_id") {
        payload[key] = [];
      }
    });

    // For debugging - log the payload
    console.log("Report payload:", payload);

    return payload;
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal({ open: false, message: "", email: "" });

    // After closing modal, also reset the form
    setFilterCriteria({});
    setShowValidationErrors(false);

    // Notify parent component to refresh report history
    if (onGenerateReport) {
      onGenerateReport();
    }
  };

  const handleGenerateReport = async () => {
    // Check if the form is valid before proceeding
    if (!hasValidFilters()) {
      setShowValidationErrors(true);
      return;
    }

    setIsGeneratingReport(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const reportData = prepareReportData();

      // Send the request to generate the report
      const response = await api.post(
        `${BASE_URL}/internship/internshipsReportServiceStaff`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful response
      if (response.data && response.status === 200) {
        // Show success modal with custom message including email
        setSuccessModal({
          open: true,
          message: "Your request has been received. The report will be sent to",
          email: response.data.email || "",
        });
      } else {
        setError("Failed to generate report. Please try again.");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError(`Failed to generate report: ${err.message}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Handle filter toggle
  const handleToggleFilter = (filterId, value) => {
    const filter = filterData.find((f) => f.id === filterId);
    const filterOptions = filter?.options || [];

    // Check if "Select All" is clicked - we need to see if it's being added or removed
    if (
      value.includes("Select All") &&
      !filterCriteria[filterId]?.includes("Select All")
    ) {
      // "Select All" is being added - select all options
      setFilterCriteria((prev) => ({
        ...prev,
        [filterId]: ["Select All", ...filterOptions],
      }));
    }
    // Check if "Select All" is being removed
    else if (
      !value.includes("Select All") &&
      filterCriteria[filterId]?.includes("Select All")
    ) {
      // "Select All" is being removed - clear all selections
      setFilterCriteria((prev) => ({
        ...prev,
        [filterId]: [],
      }));
    }
    // Regular options are being selected/deselected
    else {
      // If all options are now selected, add "Select All" too
      if (value.length === filterOptions.length) {
        setFilterCriteria((prev) => ({
          ...prev,
          [filterId]: ["Select All", ...value],
        }));
      } else {
        // Not all options selected, remove "Select All" if it exists in value
        const newValue = value.filter((item) => item !== "Select All");
        setFilterCriteria((prev) => ({
          ...prev,
          [filterId]: newValue,
        }));
      }
    }
  };

  // Get all selected filters count (excluding "Select All" entries)
  const totalSelectedFilters = Object.entries(filterCriteria).reduce(
    (sum, [filterId, filters]) => {
      // Count only actual selections, not the "Select All" entry
      const actualSelections =
        filters?.filter((item) => item !== "Select All") || [];
      return sum + actualSelections.length;
    },
    0
  );

  // Process options to include "Select All" for each filter
  const getOptionsWithSelectAll = (filterId) => {
    const filter = filterData.find((f) => f.id === filterId);
    if (!filter) return ["Select All"];
    return ["Select All", ...filter.options];
  };

  // Determine if all options for a filter are selected
  const areAllSelected = (filterId) => {
    const allOptions = filterData.find((f) => f.id === filterId)?.options || [];
    const selectedOptions = filterCriteria[filterId] || [];

    // Check if "Select All" is included or if all individual options are selected
    return (
      selectedOptions.includes("Select All") ||
      (allOptions.length > 0 && selectedOptions.length >= allOptions.length)
    );
  };

  // Render loading state with skeleton
  if (isLoading) {
    return (
      <FilterSection>
        <SectionTitle>Configure Report</SectionTitle>
        <Divider sx={{ mb: 3 }} />

        {/* Skeleton loading state for filters */}
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton
                variant="rectangular"
                height={56}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Skeleton for action button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 2,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </FilterSection>
    );
  }

  // Render error state
  if (error) {
    return (
      <LoadingOverlay>
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </LoadingOverlay>
    );
  }

  // Render "No Report" message when all required filters are empty
  if (areAllRequiredFiltersEmpty) {
    return (
      <FilterSection>
        <SectionTitle>Configure Report</SectionTitle>
        <Divider sx={{ mb: 3 }} />

        <NoDataMessage>
          <InfoIcon />
          <Typography variant="h6" gutterBottom>
            There is no report to generate
          </Typography>
        </NoDataMessage>
      </FilterSection>
    );
  }

  // Render normal filter UI
  return (
    <FilterSection>
      <SectionTitle>Configure Report</SectionTitle>
      <Divider sx={{ mb: 3 }} />

      {/* Filters Grid */}
      <Grid container spacing={2}>
        {filterData.map((filter) => (
          <Grid item xs={12} sm={6} md={4} key={filter.id}>
            <Autocomplete
              multiple
              id={filter.id}
              options={getOptionsWithSelectAll(filter.id)}
              value={filterCriteria[filter.id] || []}
              onChange={(e, newValue) =>
                handleToggleFilter(filter.id, newValue)
              }
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => {
                // Special handling for "Select All" option
                if (option === "Select All") {
                  // Check if "Select All" is selected or if all options are selected
                  const isSelected =
                    filterCriteria[filter.id]?.includes("Select All");

                  return (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={isSelected}
                      />
                      <Typography
                        component="span"
                        fontWeight={500}
                        color="primary.main"
                      >
                        {option}
                      </Typography>
                    </li>
                  );
                }

                // Regular option
                return (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={filter.name}
                  variant="outlined"
                  size="small"
                  placeholder={`Select ${filter.name}`}
                />
              )}
              renderTags={(value, getTagProps) => {
                // Check if "Select All" is selected
                if (value.includes("Select All")) {
                  return (
                    <HoverChip
                      label={`All ${filter.name}`}
                      size="small"
                      {...getTagProps({ index: 0 })}
                      sx={{
                        borderRadius: "4px",
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                      title={`All available ${filter.name.toLowerCase()} options are selected`}
                    />
                  );
                }

                // Show individual chips for each selection (with hover detail)
                return value
                  .map((option, index) => {
                    // Skip "Select All" chip
                    if (option === "Select All") return null;

                    return (
                      <HoverChip
                        key={option}
                        label={option}
                        size="small"
                        {...getTagProps({ index })}
                        sx={{
                          borderRadius: "4px",
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                          fontSize: "0.75rem",
                        }}
                        title={option} // Show full text on hover
                      />
                    );
                  })
                  .filter(Boolean); // Filter out null values
              }}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  fontSize: "0.875rem",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Filter Summary */}
      {totalSelectedFilters > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {totalSelectedFilters} filter
            {totalSelectedFilters !== 1 ? "s" : ""} selected
          </Typography>
        </Box>
      ) : showValidationErrors ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="error">
            Please select at least one filter
          </Typography>
        </Box>
      ) : null}

      {/* Action Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 2,
        }}
      >
        <ActionButton
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Generating...
            </>
          ) : (
            "Generate Report"
          )}
        </ActionButton>
      </Box>

      {/* Success Modal */}
      <Dialog
        open={successModal.open}
        onClose={handleCloseSuccessModal}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          style: {
            borderRadius: 12,
            padding: 8,
          },
        }}
      >
        <DialogTitle
          id="success-dialog-title"
          sx={{ textAlign: "center", pt: 3 }}
        >
          <SuccessIcon color="success" sx={{ fontSize: 64 }} />
          <Typography
            variant="h5"
            component="div"
            fontWeight={600}
            sx={{ mt: 1 }}
          >
            Success!
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseSuccessModal}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4 }}>
          <DialogContentText id="success-dialog-description" sx={{ mb: 1 }}>
            {successModal.message}
          </DialogContentText>

          {successModal.email && (
            <>
              <EmailContainer>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                <EmailText>{successModal.email}</EmailText>
              </EmailContainer>
              <DialogContentText sx={{ mt: 1 }}>
                within 24 hours.
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleCloseSuccessModal}
            sx={{
              borderRadius: 4,
              px: 4,
              py: 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </FilterSection>
  );
};

export default StaffReportFilter;
