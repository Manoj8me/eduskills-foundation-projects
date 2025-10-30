import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Drawer,
  TextField,
  Button,
  Grid,
  Chip,
  Typography,
  IconButton,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

// If you have these imports available, use them; otherwise use the axios call above
import api from "../../services/api";
import { BASE_URL } from "../../services/configUrls";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const CollegeEditDrawer = ({ open, onClose, college, onSave }) => {
  const [editingCollege, setEditingCollege] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (college) {
      // Ensure contacts array exists
      const collegeWithContacts = {
        ...college,
        contacts:
          college.contacts && college.contacts.length > 0
            ? college.contacts
            : [
                {
                  nonmen_id: Date.now(),
                  designation: "",
                  contact_person_name: "",
                  email: "",
                  mob: "",
                },
              ],
      };
      setEditingCollege(collegeWithContacts);
      setErrors({});
      setSaveError(null);
    }
  }, [college]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile.replace(/\s+/g, ""));
  };

  const validateWebsite = (website) => {
    if (!website) return true; // Optional field
    try {
      new URL(website.startsWith("http") ? website : `https://${website}`);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!editingCollege) return false;

    const newErrors = {};

    // Basic information validation
    if (!editingCollege.rm_name?.trim())
      newErrors.rm_name = "RM Name is required";
    if (!editingCollege.rm_mob?.trim())
      newErrors.rm_mob = "RM Mobile is required";
    else if (!validateMobile(editingCollege.rm_mob)) {
      newErrors.rm_mob = "Please enter a valid 10-digit mobile number";
    }

    // College name is frozen, so no validation needed
    if (!editingCollege.colg_address?.trim())
      newErrors.colg_address = "College Address is required";

    // State validation
    if (!editingCollege.state?.trim()) newErrors.state = "State is required";

    if (
      editingCollege.colg_website &&
      !validateWebsite(editingCollege.colg_website)
    ) {
      newErrors.colg_website = "Please enter a valid website URL";
    }

    // Contact validation (first contact is required)
    if (!editingCollege.contacts || editingCollege.contacts.length === 0) {
      newErrors.contact_person_name = "Contact person is required";
      newErrors.email = "Email is required";
      newErrors.mob = "Mobile number is required";
    } else {
      const contact = editingCollege.contacts[0];
      if (!contact.contact_person_name?.trim()) {
        newErrors.contact_person_name = "Contact person name is required";
      }
      if (!contact.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(contact.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!contact.mob?.trim()) {
        newErrors.mob = "Mobile number is required";
      } else if (!validateMobile(contact.mob)) {
        newErrors.mob = "Please enter a valid 10-digit mobile number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setEditingCollege((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...editingCollege.contacts];
    newContacts[index][field] = value;
    setEditingCollege((prev) => ({
      ...prev,
      contacts: newContacts,
    }));

    // Clear errors for the main contact fields
    const errorKey = field;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }));
    }
  };

  const addContact = () => {
    const newContact = {
      nonmen_id: Date.now(),
      designation: "",
      contact_person_name: "",
      email: "",
      mob: "",
    };
    setEditingCollege((prev) => ({
      ...prev,
      contacts: [...prev.contacts, newContact],
    }));
  };

  const removeContact = (index) => {
    if (editingCollege.contacts.length > 1) {
      const newContacts = editingCollege.contacts.filter((_, i) => i !== index);
      setEditingCollege((prev) => ({
        ...prev,
        contacts: newContacts,
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Prepare payload according to the new format
      const payload = {
        rm_name: editingCollege.rm_name,
        rm_mob: editingCollege.rm_mob,
        colg_name: editingCollege.colg_name, // Keep original college name
        colg_website: editingCollege.colg_website || null,
        colg_address: editingCollege.colg_address || null,
        state: editingCollege.state || null,
        contacts: editingCollege.contacts.map((contact) => ({
          contact_person_name: contact.contact_person_name,
          email: contact.email,
          mob: contact.mob,
          designation: contact.designation || null,
        })),
      };

      console.log("Saving payload:", payload);

      // Use your API configuration if available, otherwise use axios directly
      const response = await api.post(
        `${BASE_URL}/internship/nonmen_data`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Save response:", response.data);

      if (response.data) {
        // Update the college data with response data if available
        const updatedCollege = {
          ...editingCollege,
          ...response.data,
        };
        onSave(updatedCollege);
      } else {
        onSave(editingCollege);
      }
    } catch (error) {
      console.error("Error saving college data:", error);

      if (error.response?.status === 401) {
        setSaveError("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        setSaveError("You don't have permission to save this data.");
      } else if (error.response?.status === 422) {
        setSaveError("Invalid data format. Please check all fields.");
      } else if (error.response?.status >= 500) {
        setSaveError("Server error. Please try again later.");
      } else if (error.request) {
        setSaveError("Network error. Please check your connection.");
      } else {
        setSaveError(error.message || "An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setSaveError(null);
    onClose();
  };

  if (!editingCollege) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 500 },
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            pb: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
              fontSize: "1.1rem",
            }}
          >
            Edit College Information
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "#6b7280",
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {saveError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setSaveError(null)}
          >
            {saveError}
          </Alert>
        )}

        {/* Drawer Content */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#374151",
                mb: 2,
                fontSize: "1rem",
              }}
            >
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="RM Name *"
                  value={editingCollege.rm_name || ""}
                  onChange={(e) => handleInputChange("rm_name", e.target.value)}
                  error={!!errors.rm_name}
                  helperText={errors.rm_name}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      fontSize: "0.875rem",
                      borderRadius: 3,
                      "& fieldset": {
                        borderColor: "#d1d5db",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="RM Mobile *"
                  value={editingCollege.rm_mob || ""}
                  onChange={(e) => handleInputChange("rm_mob", e.target.value)}
                  error={!!errors.rm_mob}
                  helperText={errors.rm_mob}
                  placeholder="9876543210"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon
                        sx={{
                          color: "#1976d2",
                          mr: 1,
                          fontSize: 16,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      fontSize: "0.875rem",
                      borderRadius: 3,
                      "& fieldset": {
                        borderColor: "#d1d5db",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Frozen College Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="College Name (Read Only)"
                  value={editingCollege.colg_name || ""}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <LockIcon
                        sx={{
                          color: "#9ca3af",
                          mr: 1,
                          fontSize: 16,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f3f4f6",
                      fontSize: "0.875rem",
                      borderRadius: 3,
                      "& fieldset": {
                        borderColor: "#d1d5db",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#9ca3af",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6b7280",
                      fontWeight: 500,
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    color: "#9ca3af",
                    mt: 0.5,
                    ml: 1,
                    fontStyle: "italic",
                  }}
                >
                  College name cannot be modified
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={INDIAN_STATES}
                  value={editingCollege.state || ""}
                  onChange={(event, newValue) => {
                    handleInputChange("state", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State *"
                      error={!!errors.state}
                      helperText={errors.state}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#f8fafc",
                          fontSize: "0.875rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  )}
                  sx={{
                    "& .MuiAutocomplete-popupIndicator": {
                      color: "#6b7280",
                    },
                    "& .MuiAutocomplete-clearIndicator": {
                      color: "#6b7280",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="College Website"
                  value={editingCollege.colg_website || ""}
                  onChange={(e) =>
                    handleInputChange("colg_website", e.target.value)
                  }
                  error={!!errors.colg_website}
                  helperText={errors.colg_website}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      fontSize: "0.875rem",
                      borderRadius: 3,
                      "& fieldset": {
                        borderColor: "#d1d5db",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="College Address *"
                  value={editingCollege.colg_address || ""}
                  onChange={(e) =>
                    handleInputChange("colg_address", e.target.value)
                  }
                  error={!!errors.colg_address}
                  helperText={errors.colg_address}
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      borderRadius: 3,
                      "& fieldset": {
                        borderColor: "#d1d5db",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2, backgroundColor: "#e5e7eb" }} />

          {/* Contact Information */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: "1rem",
                }}
              >
                Contact Information *
              </Typography>
              <Chip
                label={`${editingCollege.contacts?.length || 0} Contact${
                  (editingCollege.contacts?.length || 0) !== 1 ? "s" : ""
                }`}
                sx={{
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  height: 24,
                  borderRadius: 3,
                }}
              />
            </Box>

            {/* Primary Contact (Required) */}
            {editingCollege.contacts?.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.875rem",
                    }}
                  >
                    Primary Contact
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={editingCollege.contacts[0]?.designation || ""}
                      onChange={(e) =>
                        handleContactChange(0, "designation", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Person Name *"
                      value={
                        editingCollege.contacts[0]?.contact_person_name || ""
                      }
                      onChange={(e) =>
                        handleContactChange(
                          0,
                          "contact_person_name",
                          e.target.value
                        )
                      }
                      error={!!errors.contact_person_name}
                      helperText={errors.contact_person_name}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email *"
                      type="email"
                      value={editingCollege.contacts[0]?.email || ""}
                      onChange={(e) =>
                        handleContactChange(0, "email", e.target.value)
                      }
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <EmailIcon
                            sx={{
                              color: "#1976d2",
                              mr: 1,
                              fontSize: 16,
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mobile Number *"
                      value={editingCollege.contacts[0]?.mob || ""}
                      onChange={(e) =>
                        handleContactChange(0, "mob", e.target.value)
                      }
                      error={!!errors.mob}
                      helperText={errors.mob}
                      placeholder="1234567890"
                      InputProps={{
                        startAdornment: (
                          <PhoneIcon
                            sx={{
                              color: "#1976d2",
                              mr: 1,
                              fontSize: 16,
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Additional Contacts */}
            {editingCollege.contacts?.slice(1).map((contact, index) => (
              <Paper
                key={contact.nonmen_id}
                elevation={0}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.875rem",
                    }}
                  >
                    Additional Contact {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeContact(index + 1)}
                    size="small"
                    sx={{
                      color: "#ef4444",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                      },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={contact.designation || ""}
                      onChange={(e) =>
                        handleContactChange(
                          index + 1,
                          "designation",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={contact.contact_person_name || ""}
                      onChange={(e) =>
                        handleContactChange(
                          index + 1,
                          "contact_person_name",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={contact.email || ""}
                      onChange={(e) =>
                        handleContactChange(index + 1, "email", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <EmailIcon
                            sx={{
                              color: "#1976d2",
                              mr: 1,
                              fontSize: 16,
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      value={contact.mob || ""}
                      onChange={(e) =>
                        handleContactChange(index + 1, "mob", e.target.value)
                      }
                      placeholder="1234567890"
                      InputProps={{
                        startAdornment: (
                          <PhoneIcon
                            sx={{
                              color: "#1976d2",
                              mr: 1,
                              fontSize: 16,
                            }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.8rem",
                          borderRadius: 3,
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addContact}
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                py: 1,
                borderRadius: 3,
                borderStyle: "dashed",
                borderColor: "#d1d5db",
                color: "#6b7280",
                fontSize: "0.8rem",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Add Another Contact
            </Button>
          </Box>
        </Box>

        {/* Drawer Footer */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
            pt: 2,
            borderTop: "1px solid #e5e7eb",
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            startIcon={<CloseIcon />}
            size="small"
            disabled={saving}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 3,
              fontSize: "0.8rem",
              color: "#6b7280",
              borderColor: "#d1d5db",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb",
              },
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            endIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            size="small"
            disabled={saving}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 3,
              fontSize: "0.8rem",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
                transform: saving ? "none" : "translateY(-1px)",
              },
              "&:disabled": {
                backgroundColor: "#9ca3af",
                transform: "none",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CollegeEditDrawer;
