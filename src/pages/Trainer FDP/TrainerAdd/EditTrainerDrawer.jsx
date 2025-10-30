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

const EditTrainerDrawer = ({ open, onClose, trainer, onTrainerUpdated }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    domains: [],
  });
  const [originalData, setOriginalData] = useState({
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

  // Load trainer data and domains when drawer opens
  useEffect(() => {
    if (open && trainer) {
      // Parse trainer domains
      let trainerDomains = [];
      if (Array.isArray(trainer.domains)) {
        trainerDomains = trainer.domains;
      } else if (
        typeof trainer.domains === "string" &&
        trainer.domains.trim()
      ) {
        trainerDomains = trainer.domains.split(",").map((d) => d.trim());
      }

      const initialData = {
        fullname: trainer.fullname || "",
        email: trainer.email || "",
        phone: trainer.phone || "",
        domains: trainerDomains,
      };

      setFormData(initialData);
      setOriginalData(initialData);

      fetchDomains();
    }
  }, [open, trainer]);

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

  // Validate form - all fields are optional for update
  const validateForm = () => {
    const errors = {};

    // Only validate if fields are filled
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (
      formData.phone.trim() &&
      !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      errors.phone = "Please enter a valid 10-digit phone number";
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

      // Prepare payload - only include fields that have changed
      const payload = {};

      // Check if fullname changed
      if (formData.fullname.trim() !== originalData.fullname.trim()) {
        payload.fullname = formData.fullname.trim();
      }

      // Check if email changed
      if (formData.email.trim() !== originalData.email.trim()) {
        payload.email = formData.email.trim();
      }

      // Check if phone changed
      if (formData.phone.trim() !== originalData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }

      // Check if domains changed
      const currentDomainIds = formData.domains
        .map((domain) =>
          typeof domain === "object" ? domain.domain_id : domain
        )
        .sort();

      const originalDomainIds = originalData.domains
        .map((domain) =>
          typeof domain === "object" ? domain.domain_id : domain
        )
        .sort();

      const domainsChanged =
        currentDomainIds.length !== originalDomainIds.length ||
        !currentDomainIds.every((id, index) => id === originalDomainIds[index]);

      if (domainsChanged) {
        payload.domains = currentDomainIds;
      }

      // Only make request if there are fields to update
      if (Object.keys(payload).length === 0) {
        setError(
          "No changes detected. Please modify at least one field to update."
        );
        setLoading(false);
        return;
      }

      const response = await api.put(
        `${BASE_URL}/admin/trainers/${trainer.trainer_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setSuccess(true);

        // Notify parent component
        if (onTrainerUpdated) {
          onTrainerUpdated();
        }

        // Close drawer after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError("Failed to update trainer. Please try again.");
      }
    } catch (err) {
      console.error("Error updating trainer:", err);

      if (err.response?.status === 409) {
        setError("A trainer with this email already exists.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid data provided.");
      } else if (err.response?.status === 404) {
        setError("Trainer not found.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to update trainer. Please try again."
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
      setOriginalData({
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

  // Map trainer domains to domain objects for Autocomplete
  const getSelectedDomains = () => {
    if (!formData.domains || formData.domains.length === 0) {
      return [];
    }

    return formData.domains.map((domain) => {
      // If domain is already an object with domain_id, return it
      if (typeof domain === "object" && domain.domain_id) {
        return domain;
      }
      // If domain is a string, find matching domain object
      const found = domains.find((d) => d.domain_name === domain);
      return found || { domain_id: domain, domain_name: domain };
    });
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
            Edit Trainer
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
              Trainer updated successfully! Closing drawer...
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
                  helperText={formErrors.fullname || "Optional"}
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
                  helperText={formErrors.email || "Optional"}
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
                  helperText={formErrors.phone || "Optional"}
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
                  getOptionLabel={(option) => option.domain_name || option}
                  value={getSelectedDomains()}
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
                      helperText={formErrors.domains || "Optional"}
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
                        label={option.domain_name || option}
                        {...getTagProps({ index })}
                        key={option.domain_id || index}
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
                    option.domain_id === value.domain_id ||
                    option.domain_name === value.domain_name
                  }
                />
              </Grid>

              {/* Form Info */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                {/* <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Only modified fields will be updated. Fields that remain
                  unchanged will not be sent in the update request.
                </Typography> */}
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
                {loading ? "Updating..." : "Update Trainer"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditTrainerDrawer;
