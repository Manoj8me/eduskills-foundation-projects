import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
  Autocomplete,
  Chip,
  Alert,
  CircularProgress,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

const AddTrainerDrawer = ({ open, onClose, onTrainerAdded }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    domains: [],
  });
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch active domains for autocomplete
  const fetchDomains = async () => {
    setDomainsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await api.get(`${BASE_URL}/admin/domains/active`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data) {
        setDomains(response.data);
      }
    } catch (err) {
      console.error("Error fetching domains:", err);
      setError("Failed to fetch domains. Please try again.");
    } finally {
      setDomainsLoading(false);
    }
  };

  // Load domains when drawer opens
  useEffect(() => {
    if (open) {
      fetchDomains();
    }
  }, [open]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.fullname.trim()) {
      errors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (formData.domains.length === 0) {
      errors.domains = "At least one domain is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Prepare payload with domain IDs
      const payload = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        domains: formData.domains.map((domain) => domain.domain_id),
      };

      const response = await api.post(`${BASE_URL}/admin/trainers`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);

        // Reset form
        setFormData({
          fullname: "",
          email: "",
          phone: "",
          domains: [],
        });

        // Notify parent component
        if (onTrainerAdded) {
          onTrainerAdded();
        }

        // Close drawer after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError("Failed to add trainer. Please try again.");
      }
    } catch (err) {
      console.error("Error adding trainer:", err);

      if (err.response?.status === 409) {
        setError("A trainer with this email already exists.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid data provided.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to add trainer. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle drawer close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        domains: [],
      });
      setFormErrors({});
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 600 },
          maxWidth: "100vw",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Add New Trainer
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* Success Message */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Trainer added successfully! Closing drawer...
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullname}
                  onChange={(e) => handleChange("fullname", e.target.value)}
                  error={!!formErrors.fullname}
                  helperText={formErrors.fullname}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  placeholder="Enter trainer's full name"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  placeholder="Enter email address"
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  placeholder="Enter 10-digit phone number"
                />
              </Grid>

              {/* Domains */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={domains}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.domain_name}
                  value={formData.domains}
                  onChange={(event, newValue) =>
                    handleChange("domains", newValue)
                  }
                  disabled={loading || domainsLoading}
                  loading={domainsLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Domains"
                      error={!!formErrors.domains}
                      helperText={formErrors.domains}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <CategoryIcon
                              sx={{ mr: 1, color: "action.active" }}
                            />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                        endAdornment: (
                          <>
                            {domainsLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      placeholder="Select trainer domains"
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option.domain_name}
                        {...getTagProps({ index })}
                        key={option.domain_id}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                  renderOption={(props, option, { selected }) => (
                    <Box component="li" {...props}>
                      <Checkbox checked={selected} sx={{ mr: 2 }} />
                      <ListItemText primary={option.domain_name} />
                    </Box>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.domain_id === value.domain_id
                  }
                />
              </Grid>

              {/* Form Info */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Please fill in all required fields to add a new trainer to the
                  system.
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            p: 3,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
                size="large"
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Adding..." : "Add Trainer"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddTrainerDrawer;
