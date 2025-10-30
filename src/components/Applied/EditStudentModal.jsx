import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
  Alert,
  Autocomplete,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Domain as DomainIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    maxWidth: "500px",
    width: "100%",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 3),
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
  "& .MuiTypography-root": {
    fontWeight: 600,
    fontSize: "1.1rem",
    background: "linear-gradient(45deg, #006699, #0088cc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));

const FormLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.85rem",
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: theme.palette.text.primary,
  "& svg": {
    color: theme.palette.primary.main,
    fontSize: "1rem",
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  background: "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
  boxShadow: "0 2px 8px rgba(0, 136, 204, 0.3)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0, 136, 204, 0.3)",
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const EditStudentModal = ({
  open,
  onClose,
  student,
  filterOptions = { domains: [], branches: [] },
  onDataRefresh,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    domain: null,
    branch: null,
    rollNo: "",
    passoutYear: null,
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  // Initialize form data when student changes
  useEffect(() => {
    if (student) {
      // Find matching domain object
      // We need to ensure we correctly identify the existing domain
      let selectedDomain = null;

      if (student.domain_id) {
        // First try by domain_id if available
        selectedDomain = filterOptions.domains.find(
          (domain) => Number(domain.domain_id) === Number(student.domain_id)
        );
      }

      // If not found and we have a domain name, try by name
      if (!selectedDomain && student.domain) {
        selectedDomain = filterOptions.domains.find(
          (domain) =>
            domain.domain_name.toLowerCase() === student.domain.toLowerCase()
        );
      }

      // Still not found? Create a temporary object from the student data
      // This ensures we always display something even if it's not in the options
      if (!selectedDomain && student.domain) {
        selectedDomain = {
          domain_id: student.domain_id || 0,
          domain_name: student.domain,
        };
      }

      // Find matching branch object with similar fallback logic
      let selectedBranch = null;
      if (student.branch) {
        selectedBranch = filterOptions.branches.find(
          (branch) =>
            branch.branch_name.toLowerCase() === student.branch.toLowerCase()
        );

        // Create a temporary object if not found
        if (!selectedBranch) {
          selectedBranch = {
            branch_id: 0,
            branch_name: student.branch,
          };
        }
      }

      // Find matching year
      const selectedYear = student.passoutYear
        ? { label: student.passoutYear, value: student.passoutYear }
        : null;

      setFormData({
        domain: selectedDomain, // This will now always have a value if student has a domain
        branch: selectedBranch,
        rollNo: student.rollNo || "",
        passoutYear: selectedYear,
      });

      // Reset states
      setError(null);
      setSuccess(false);
      setFormErrors({});
    }
  }, [student, open, filterOptions]);

  // Handle text field changes
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Handle autocomplete changes
  const handleAutocompleteChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (formData.rollNo && !/^[A-Za-z0-9]+$/.test(formData.rollNo)) {
      errors.rollNo = "Roll No should contain only alphanumeric characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Prepare request data
      const requestData = {
        user_id: student.user_id,
        internship_id: student.internship_id,
      };

      // Only include fields that have values
      if (formData.domain) {
        requestData.domain_id = formData.domain.domain_id;
      }

      if (formData.branch) {
        requestData.branch = formData.branch.branch_name;
      }

      if (formData.rollNo) {
        requestData.roll_no = formData.rollNo;
      }

      if (formData.passoutYear) {
        requestData.passout_year = formData.passoutYear.value;
      }

      // Send update request to API
      const response = await api.post(
        `${BASE_URL}/internship/spoc/update-student`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle success
      setSuccess(true);

      // Refresh data after successful update
      if (onDataRefresh) {
        setTimeout(() => {
          onDataRefresh();
        }, 1000);
      }

      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error updating student:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update student information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Get year options (current year - 5 to current year + 5)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push({ label: i.toString(), value: i.toString() });
    }

    return years;
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="edit-student-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <StyledDialogTitle id="edit-student-dialog-title">
        <Typography>Edit Student</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleDialogClose}
          aria-label="close"
          disabled={loading}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <StyledDialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Student information updated successfully!
          </Alert>
        )}

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {student?.name || "Student"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {student?.email || ""}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <SectionHeading>
              <PersonIcon fontSize="small" />
              Basic Information
            </SectionHeading>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormLabel>Roll No</FormLabel>
            <TextField
              name="rollNo"
              value={formData.rollNo}
              onChange={handleTextChange}
              placeholder="Enter Roll No"
              fullWidth
              size="small"
              variant="outlined"
              disabled={loading}
              error={!!formErrors.rollNo}
              helperText={formErrors.rollNo}
              InputProps={{
                sx: { fontSize: "0.85rem" },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormLabel>Passout Year</FormLabel>
            <Autocomplete
              value={formData.passoutYear}
              onChange={(event, newValue) => {
                handleAutocompleteChange("passoutYear", newValue);
              }}
              options={getYearOptions()}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select Year"
                  error={!!formErrors.passoutYear}
                  helperText={formErrors.passoutYear}
                />
              )}
              disabled={loading}
              disableClearable
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <SectionHeading>
              <DomainIcon fontSize="small" />
              Domain
            </SectionHeading>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              value={formData.domain}
              onChange={(event, newValue) => {
                handleAutocompleteChange("domain", newValue);
              }}
              options={filterOptions.domains || []}
              getOptionLabel={(option) => option?.domain_name || ""}
              isOptionEqualToValue={(option, value) => {
                // Check if both option and value exist
                if (!option || !value) return false;

                // Compare by id if available
                if (option.domain_id && value.domain_id) {
                  return Number(option.domain_id) === Number(value.domain_id);
                }

                // Fallback to name comparison
                return option.domain_name === value.domain_name;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select Domain"
                />
              )}
              disabled={loading}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <SectionHeading>
              <SchoolIcon fontSize="small" />
              Branch
            </SectionHeading>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              value={formData.branch}
              onChange={(event, newValue) => {
                handleAutocompleteChange("branch", newValue);
              }}
              options={filterOptions.branches || []}
              getOptionLabel={(option) => option?.branch_name || ""}
              isOptionEqualToValue={(option, value) => {
                // Check if both option and value exist
                if (!option || !value) return false;

                // Compare by id if available
                if (option.branch_id && value.branch_id) {
                  return Number(option.branch_id) === Number(value.branch_id);
                }

                // Fallback to name comparison
                return option.branch_name === value.branch_name;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select Branch"
                />
              )}
              disabled={loading}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </StyledDialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button
          onClick={handleDialogClose}
          disabled={loading}
          variant="outlined"
          size="small"
          sx={{ borderRadius: "8px" }}
        >
          Cancel
        </Button>
        <SaveButton
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          size="small"
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {loading ? "Saving..." : "Save"}
        </SaveButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditStudentModal;
