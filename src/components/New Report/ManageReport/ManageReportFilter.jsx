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
import api from "../../../services/api";
import { BASE_URL } from "../../../services/configUrls";

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

// Convert API response to usable filter format
const processFilterOptions = (apiData) => {
  if (!apiData || !apiData.filterData) return [];

  return apiData.filterData.map((filter) => {
    return {
      id: filter.id,
      name: filter.name,
      options: filter.options || [],
    };
  });
};

// Function to check if required filters are all empty
const checkRequiredFiltersEmpty = (filterData) => {
  // Check if all filters have empty options
  return filterData.every(
    (filter) => !filter.options || filter.options.length === 0
  );
};

const ManageReportFilter = ({ onGenerateReport }) => {
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

  // Fetch filter data on component mount
  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get(
          `${BASE_URL}/profile/studentInformationOptions1`,
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
  }, []);

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

  // Prepare report data for API submission
  const prepareReportData = () => {
    // Initialize empty payload
    const payload = {
      years: [],
      branches: [],
      profileStatus: [],
      internshipStatus: [],
    };

    // Process each filter type if it exists in the filter data
    filterData.forEach((filter) => {
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

      // Handle different filter types based on filter ID
      if (filterId === "years") {
        // For years, keep as numbers
        payload.years = selectedValues;
      } else if (filterId === "branches") {
        payload.branches = selectedValues;
      } else if (filterId === "profileStatus") {
        payload.profileStatus = selectedValues;
      } else if (filterId === "internshipStatus") {
        payload.internshipStatus = selectedValues;
      }
    });

    // Ensure we always have at least empty arrays (not null)
    Object.keys(payload).forEach((key) => {
      if (!payload[key]) {
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
        `${BASE_URL}/profile/studentReportService`,
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
    const currentSelections = filterCriteria[filterId] || [];

    // Check if "Select All" was just added (clicked)
    if (
      value.includes("Select All") &&
      !currentSelections.includes("Select All")
    ) {
      // "Select All" was clicked - select all options
      setFilterCriteria((prev) => ({
        ...prev,
        [filterId]: ["Select All", ...filterOptions],
      }));
    }
    // Check if "Select All" was just removed (unclicked)
    else if (
      !value.includes("Select All") &&
      currentSelections.includes("Select All")
    ) {
      // "Select All" was unclicked - clear all selections
      setFilterCriteria((prev) => ({
        ...prev,
        [filterId]: [],
      }));
    }
    // Regular individual option changes
    else {
      // Remove "Select All" from the value array for processing
      const regularOptions = value.filter((item) => item !== "Select All");

      // If all regular options are now selected, add "Select All"
      if (
        regularOptions.length === filterOptions.length &&
        filterOptions.length > 0
      ) {
        setFilterCriteria((prev) => ({
          ...prev,
          [filterId]: ["Select All", ...regularOptions],
        }));
      } else {
        // Not all options selected, just set the regular options
        setFilterCriteria((prev) => ({
          ...prev,
          [filterId]: regularOptions,
        }));
      }
    }

    // Special handling for profile status changes
    if (filterId === "profileStatus") {
      // If "active" is being deselected, clear internship status selections
      const newSelections = value.filter((item) => item !== "Select All");
      if (!newSelections.includes("active")) {
        setFilterCriteria((prev) => ({
          ...prev,
          internshipStatus: [],
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

  // Check if internship status should be shown
  const shouldShowInternshipStatus = () => {
    const profileStatusSelections = filterCriteria["profileStatus"] || [];
    // Show internship status only if "active" is selected in profile status
    return profileStatusSelections.includes("active");
  };

  // Get visible filters (hide internship status if profile status doesn't include "active")
  const getVisibleFilters = () => {
    return filterData.filter((filter) => {
      if (filter.id === "internshipStatus") {
        return shouldShowInternshipStatus();
      }
      return true;
    });
  };

  // Render loading state with skeleton
  if (isLoading) {
    return (
      <FilterSection>
        <SectionTitle>Configure Report</SectionTitle>
        <Divider sx={{ mb: 3 }} />

        {/* Skeleton loading state for filters */}
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
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
        {getVisibleFilters().map((filter) => (
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
                  // Check if "Select All" should be checked
                  const currentSelections = filterCriteria[filter.id] || [];
                  const allOptions = filter.options || [];

                  // "Select All" is checked if:
                  // 1. It's explicitly in the selections, OR
                  // 2. All individual options are selected
                  const isSelectAllChecked =
                    currentSelections.includes("Select All") ||
                    (allOptions.length > 0 &&
                      allOptions.every((opt) =>
                        currentSelections.includes(opt)
                      ));

                  return (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={isSelectAllChecked}
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
                const currentSelections = filterCriteria[filter.id] || [];
                const allOptions = filter.options || [];

                // Check if all options are selected (either via "Select All" or individually)
                const allSelected =
                  currentSelections.includes("Select All") ||
                  (allOptions.length > 0 &&
                    allOptions.every((opt) => currentSelections.includes(opt)));

                // If all are selected, show "All [FilterName]" chip
                if (allSelected) {
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

                // Show individual chips for each selection (excluding "Select All")
                const actualSelections = value.filter(
                  (option) => option !== "Select All"
                );

                return actualSelections.map((option, index) => (
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
                ));
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

export default ManageReportFilter;
