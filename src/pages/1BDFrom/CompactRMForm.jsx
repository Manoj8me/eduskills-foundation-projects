import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Divider,
  Chip,
  Autocomplete,
  Paper,
  Container,
  Fade,
  Slide,
  useTheme,
  alpha,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";

// Custom Gray-White Theme with Blue Inputs
const grayWhiteTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#6b7280",
      light: "#9ca3af",
      dark: "#4b5563",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#374151",
      secondary: "#6b7280",
    },
  },
  components: {
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

const CollegeContactForm = () => {
  const [formData, setFormData] = useState({
    rmName: "",
    rmMob: "",
    collegeName: "",
    collegeWebsite: "",
    collegeAddress: "",
    state: null,
    contacts: [
      {
        id: 1,
        designation: "",
        name: "",
        email: "",
        mobile: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "warning" | "info"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile.replace(/\s+/g, ""));
  };

  const validateWebsite = (website) => {
    try {
      new URL(website.startsWith("http") ? website : `https://${website}`);
      return true;
    } catch {
      return false;
    }
  };

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic information fields are mandatory
    if (!formData.rmName.trim()) newErrors.rmName = "RM Name is required";
    if (!formData.rmMob.trim()) {
      newErrors.rmMob = "RM Mobile is required";
    } else if (!validateMobile(formData.rmMob)) {
      newErrors.rmMob = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.collegeName.trim())
      newErrors.collegeName = "College Name is required";
    if (!formData.collegeAddress.trim())
      newErrors.collegeAddress = "College Address is required";
    if (!formData.state) newErrors.state = "State is required";

    // Website validation if provided
    if (formData.collegeWebsite && !validateWebsite(formData.collegeWebsite)) {
      newErrors.collegeWebsite = "Please enter a valid website URL";
    }

    // Contact validation - All contact fields are now mandatory
    formData.contacts.forEach((contact, index) => {
      if (!contact.designation.trim()) {
        newErrors[`contacts.${index}.designation`] = "Designation is required";
      }
      if (!contact.name.trim()) {
        newErrors[`contacts.${index}.name`] = "Name is required";
      }
      if (!contact.email.trim()) {
        newErrors[`contacts.${index}.email`] = "Email is required";
      } else if (!validateEmail(contact.email)) {
        newErrors[`contacts.${index}.email`] = "Please enter a valid email";
      }
      if (!contact.mobile.trim()) {
        newErrors[`contacts.${index}.mobile`] = "Mobile number is required";
      } else if (!validateMobile(contact.mobile)) {
        newErrors[`contacts.${index}.mobile`] =
          "Please enter a valid 10-digit mobile number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
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
    const newContacts = [...formData.contacts];
    newContacts[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      contacts: newContacts,
    }));

    const errorKey = `contacts.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }));
    }
  };

  const addContact = () => {
    const newContact = {
      id: Date.now(),
      designation: "",
      name: "",
      email: "",
      mobile: "",
    };
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, newContact],
    }));
  };

  const removeContact = (index) => {
    if (formData.contacts.length > 1) {
      const newContacts = formData.contacts.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        contacts: newContacts,
      }));
    }
  };

  const submitToAPI = async (data) => {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Access token not found. Please login again.");
      }

      const response = await axios.post(
        `${BASE_URL}/internship/nonmen_data`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("API submission error:", error);

      if (error.response) {
        // Server responded with error status
        throw new Error(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("Network error. Please check your connection.");
      } else {
        // Something else happened
        throw new Error(error.message || "An unexpected error occurred.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API submission with correct keys
      const apiData = {
        rm_name: formData.rmName,
        rm_mob: formData.rmMob,
        colg_name: formData.collegeName,
        colg_website: formData.collegeWebsite,
        colg_address: formData.collegeAddress,
        state: formData.state,
        contacts: formData.contacts.map((contact) => ({
          contact_person_name: contact.name,
          email: contact.email,
          mob: contact.mobile,
          designation: contact.designation,
        })),
      };

      const response = await submitToAPI(apiData);

      console.log("Form submitted successfully:", response);
      showToast("Form submitted successfully! 🎉", "success");

      // Reset form after successful submission
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (error) {
      console.error("Submission failed:", error);
      showToast(
        error.message || "Failed to submit form. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      rmName: "",
      rmMob: "",
      collegeName: "",
      collegeWebsite: "",
      collegeAddress: "",
      state: null,
      contacts: [
        {
          id: 1,
          designation: "",
          name: "",
          email: "",
          mobile: "",
        },
      ],
    });
    setErrors({});
    showToast("Form has been reset", "info");
  };

  return (
    <ThemeProvider theme={grayWhiteTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={600}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                height: "85vh",
              }}
            >
              {/* Simple Header */}
              <Box
                sx={{
                  p: 3,
                  pb: 2,
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  College Information
                </Typography>
              </Box>

              {/* Form Content - Scrollable */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  px: 3,
                  pb: 1,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f5f9",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#cbd5e1",
                    borderRadius: "10px",
                    "&:hover": {
                      background: "#94a3b8",
                    },
                  },
                }}
              >
                {/* Basic Information Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "1.1rem",
                      mb: 2,
                      textAlign: "left",
                    }}
                  >
                    Basic Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="RM Name *"
                        value={formData.rmName}
                        onChange={(e) =>
                          handleInputChange("rmName", e.target.value)
                        }
                        error={!!errors.rmName}
                        helperText={errors.rmName}
                        variant="outlined"
                        size="small"
                        disabled={isSubmitting}
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
                          "& .MuiFormHelperText-root": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="RM Mobile *"
                        value={formData.rmMob}
                        onChange={(e) =>
                          handleInputChange("rmMob", e.target.value)
                        }
                        error={!!errors.rmMob}
                        helperText={errors.rmMob}
                        variant="outlined"
                        size="small"
                        placeholder="1234567890"
                        disabled={isSubmitting}
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
                          "& .MuiFormHelperText-root": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="College Name *"
                        value={formData.collegeName}
                        onChange={(e) =>
                          handleInputChange("collegeName", e.target.value)
                        }
                        error={!!errors.collegeName}
                        helperText={errors.collegeName}
                        variant="outlined"
                        size="small"
                        disabled={isSubmitting}
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
                          "& .MuiFormHelperText-root": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        size="small"
                        options={INDIAN_STATES}
                        value={formData.state}
                        onChange={(event, newValue) =>
                          handleInputChange("state", newValue)
                        }
                        disabled={isSubmitting}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="State *"
                            error={!!errors.state}
                            helperText={errors.state}
                            variant="outlined"
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
                              "& .MuiFormHelperText-root": {
                                fontSize: "0.75rem",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="College Website"
                        value={formData.collegeWebsite}
                        onChange={(e) =>
                          handleInputChange("collegeWebsite", e.target.value)
                        }
                        error={!!errors.collegeWebsite}
                        helperText={errors.collegeWebsite}
                        placeholder="https://example.com"
                        variant="outlined"
                        size="small"
                        disabled={isSubmitting}
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
                          "& .MuiFormHelperText-root": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="College Address *"
                        value={formData.collegeAddress}
                        onChange={(e) =>
                          handleInputChange("collegeAddress", e.target.value)
                        }
                        error={!!errors.collegeAddress}
                        helperText={errors.collegeAddress}
                        multiline
                        rows={3}
                        variant="outlined"
                        size="small"
                        placeholder="Enter complete college address"
                        disabled={isSubmitting}
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
                            "& .MuiInputBase-input": {
                              fontSize: "0.875rem",
                              "&::-webkit-scrollbar": {
                                width: "4px",
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "#f1f5f9",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "#cbd5e1",
                                borderRadius: "2px",
                              },
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            "&.Mui-focused": {
                              color: "#1976d2",
                            },
                          },
                          "& .MuiFormHelperText-root": {
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2, background: "#e5e7eb" }} />

                {/* Contact Information Section */}
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
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        fontSize: "1.1rem",
                        textAlign: "left",
                      }}
                    >
                      Contact Information *
                    </Typography>
                    <Chip
                      label={`${formData.contacts.length} Contact${
                        formData.contacts.length !== 1 ? "s" : ""
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

                  {formData.contacts.map((contact, index) => (
                    <Slide
                      key={contact.id}
                      direction="up"
                      in
                      timeout={200 + index * 50}
                    >
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
                              fontSize: "0.9rem",
                              textAlign: "left",
                            }}
                          >
                            Contact {index + 1} *
                          </Typography>
                          {formData.contacts.length > 1 && (
                            <IconButton
                              onClick={() => removeContact(index)}
                              size="small"
                              disabled={isSubmitting}
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                                },
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Designation *"
                              value={contact.designation}
                              onChange={(e) =>
                                handleContactChange(
                                  index,
                                  "designation",
                                  e.target.value
                                )
                              }
                              error={!!errors[`contacts.${index}.designation`]}
                              helperText={
                                errors[`contacts.${index}.designation`]
                              }
                              variant="outlined"
                              size="small"
                              placeholder="e.g., Principal"
                              disabled={isSubmitting}
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
                                "& .MuiFormHelperText-root": {
                                  fontSize: "0.7rem",
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Name *"
                              value={contact.name}
                              onChange={(e) =>
                                handleContactChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              error={!!errors[`contacts.${index}.name`]}
                              helperText={errors[`contacts.${index}.name`]}
                              variant="outlined"
                              size="small"
                              disabled={isSubmitting}
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
                                "& .MuiFormHelperText-root": {
                                  fontSize: "0.7rem",
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Email *"
                              type="email"
                              value={contact.email}
                              onChange={(e) =>
                                handleContactChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              error={!!errors[`contacts.${index}.email`]}
                              helperText={errors[`contacts.${index}.email`]}
                              variant="outlined"
                              size="small"
                              disabled={isSubmitting}
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
                                "& .MuiFormHelperText-root": {
                                  fontSize: "0.7rem",
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Mobile Number *"
                              value={contact.mobile}
                              onChange={(e) =>
                                handleContactChange(
                                  index,
                                  "mobile",
                                  e.target.value
                                )
                              }
                              error={!!errors[`contacts.${index}.mobile`]}
                              helperText={errors[`contacts.${index}.mobile`]}
                              placeholder="1234567890"
                              variant="outlined"
                              size="small"
                              disabled={isSubmitting}
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
                                "& .MuiFormHelperText-root": {
                                  fontSize: "0.7rem",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Slide>
                  ))}

                  <Button
                    startIcon={<AddIcon />}
                    onClick={addContact}
                    variant="outlined"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
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
                      "&:disabled": {
                        opacity: 0.6,
                      },
                    }}
                  >
                    Add Another Contact
                  </Button>
                </Box>
              </Box>

              {/* Action Buttons - Fixed at bottom */}
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  gap: 1.5,
                  justifyContent: "flex-end",
                  p: 3,
                  pt: 2,
                  borderTop: "1px solid #e5e7eb",
                  flexDirection: { xs: "column", sm: "row" },
                  backgroundColor: "#ffffff",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RefreshIcon />}
                  size="small"
                  disabled={isSubmitting}
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
                      opacity: 0.6,
                    },
                  }}
                >
                  Reset Form
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  endIcon={
                    isSubmitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  size="small"
                  disabled={isSubmitting}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontSize: "0.8rem",
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      transform: isSubmitting ? "none" : "translateY(-1px)",
                    },
                    "&:disabled": {
                      backgroundColor: "#9ca3af",
                      color: "white",
                    },
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            "& .MuiSnackbarContent-root": {
              borderRadius: 3,
              minWidth: "auto",
            },
          }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              borderRadius: 3,
              fontSize: "0.875rem",
              fontWeight: 500,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              minWidth: "300px",
              "& .MuiAlert-icon": {
                fontSize: "1.2rem",
              },
              "& .MuiAlert-action": {
                alignItems: "center",
              },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CollegeContactForm;
