import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Drawer,
  Autocomplete,
  Stack,
  Divider,
  Grid,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Checkbox,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";
import OTPVerification from "./OTPVerification"; // Import the OTP component

// Enhanced Material UI Blue colors with gradient options - matching main component
const BLUE = {
  solight: "#EEF7FE",
  light: "#BBDEFB",
  main: "#2196F3",
  dark: "#1976D2",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
};

const AddEducatorDrawer = ({
  open,
  onClose,
  onAdd,
  onUpdate,
  editData,
  isEditing = false,
  userType = "leaders", // New prop to determine which type of user we're adding
}) => {
  // Get theme and check if it's dark mode
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for form inputs
  const [educatorName, setEducatorName] = useState("");
  const [customDesignation, setCustomDesignation] = useState(null);
  const [localDesignation, setLocalDesignation] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [branch, setBranch] = useState(""); // Changed to single string for DSPOC

  // Email verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // API call states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for programs and branches from API
  const [programs, setPrograms] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [programBranchesLoading, setProgramBranchesLoading] = useState(false);
  const [programBranchesError, setProgramBranchesError] = useState(null);

  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for field errors
  const [errors, setErrors] = useState({
    educatorName: "",
    customDesignation: "",
    localDesignation: "",
    personalEmail: "",
    mobileNumber: "",
    whatsappNumber: "",
    selectedProgram: "",
    branch: "",
  });

  // State for field touched status
  const [touched, setTouched] = useState({
    educatorName: false,
    customDesignation: false,
    localDesignation: false,
    personalEmail: false,
    mobileNumber: false,
    whatsappNumber: false,
    selectedProgram: false,
    branch: false,
  });

  // Updated designation options based on user type
  const getDesignationOptions = () => {
    if (userType === "dspoc") {
      // Only HOD for DSPOC
      return ["Professor", "Assistant Professor", "Associate Professor"];
    } else {
      // All other designations for Leaders and other types (excluding HOD)
      return [
        "Chairman",
        "Secretary",
        "Chancellor",
        "Pro Chancellor",
        "President",
        "Principal",
        "Vice Principal",
        "Dean",
        "Director",
        "Vice Chancellor",
        "Registrar",
        "Pro Vice Chancellor",
        "TPO",
        "HOD",
        "CEO"
      ];
    }
  };

  // Checkbox icon for Autocomplete
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  // Check if current user type is DSPOC (to show branch selection)
  const isDSPOC = userType === "dspoc";

  // Get drawer title based on user type
  const getDrawerTitle = () => {
    if (isEditing) {
      if (userType === "leaders") return "Edit Leader";
      return "Edit DSPOC";
    }
    if (userType === "leaders") return "Add Leader";
    return "Add DSPOC";
  };

  // Function to clear email verification from cookies
  const clearEmailVerificationFromCookies = (emailAddress) => {
    document.cookie = `email_verified_${emailAddress}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Validation functions
  const validateEducatorName = (name) => {
    if (!name || !name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email || !email.trim()) {
      return "Email address is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateDesignation = (designation) => {
    if (!designation || !designation.trim()) {
      return "Designation is required";
    }
    return "";
  };

  const validateLocalDesignation = (localDesignation) => {
    if (!localDesignation || !localDesignation.trim()) {
      return "Local designation is required";
    }
    return "";
  };

  const validateMobileNumber = (mobile) => {
    if (!mobile || !mobile.trim()) {
      return "Mobile number is required";
    }
    const cleanMobile = mobile.replace(/[\s\-\(\)]/g, "");
    if (!/^[0-9]{10,15}$/.test(cleanMobile)) {
      return "Please enter a valid mobile number (10-15 digits)";
    }
    return "";
  };

  const validateWhatsappNumber = (whatsapp) => {
    if (!whatsapp || !whatsapp.trim()) {
      return "WhatsApp number is required";
    }
    const cleanWhatsapp = whatsapp.replace(/[\s\-\(\)]/g, "");
    if (!/^[0-9]{10,15}$/.test(cleanWhatsapp)) {
      return "Please enter a valid WhatsApp number (10-15 digits)";
    }
    return "";
  };

  const validateProgram = (program) => {
    if (isDSPOC && !program) {
      return "Please select a program";
    }
    return "";
  };

  const validateBranch = (branchValue) => {
    if (isDSPOC && (!branchValue || branchValue.trim() === "")) {
      return "Please select a branch";
    }
    return "";
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {
      educatorName: validateEducatorName(educatorName),
      customDesignation: validateDesignation(customDesignation),
      localDesignation: validateLocalDesignation(localDesignation),
      personalEmail: validateEmail(personalEmail),
      mobileNumber: validateMobileNumber(mobileNumber),
      whatsappNumber: validateWhatsappNumber(
        sameAsMobile ? mobileNumber : whatsappNumber
      ),
      selectedProgram: validateProgram(selectedProgram),
      branch: validateBranch(branch),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    const hasNoErrors = Object.values(errors).every((error) => error === "");
    const hasAllRequiredFields =
      educatorName.trim() &&
      customDesignation &&
      customDesignation.trim() &&
      localDesignation.trim() &&
      personalEmail.trim() &&
      mobileNumber.trim() &&
      (sameAsMobile ? mobileNumber.trim() : whatsappNumber.trim()) &&
      (isEmailVerified || isEditing) &&
      (!isDSPOC || (selectedProgram && branch && branch.trim() !== ""));

    return hasNoErrors && hasAllRequiredFields;
  };

  // Handle field blur for validation
  const handleFieldBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    let error = "";
    switch (fieldName) {
      case "educatorName":
        error = validateEducatorName(value);
        break;
      case "personalEmail":
        error = validateEmail(value);
        break;
      case "customDesignation":
        error = validateDesignation(value);
        break;
      case "localDesignation":
        error = validateLocalDesignation(value);
        break;
      case "mobileNumber":
        error = validateMobileNumber(value);
        break;
      case "whatsappNumber":
        error = validateWhatsappNumber(value);
        break;
      case "selectedProgram":
        error = validateProgram(value);
        break;
      case "branch":
        error = validateBranch(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // Handle mobile number change
  const handleMobileNumberChange = (value) => {
    const cleanValue = value.replace(/[^0-9\s\-\(\)]/g, "");
    setMobileNumber(cleanValue);

    // If "same as mobile" is checked, update WhatsApp number too
    if (sameAsMobile) {
      setWhatsappNumber(cleanValue);
    }

    if (touched.mobileNumber) {
      handleFieldBlur("mobileNumber", cleanValue);
    }
  };

  // Handle WhatsApp number change
  const handleWhatsappNumberChange = (value) => {
    const cleanValue = value.replace(/[^0-9\s\-\(\)]/g, "");
    setWhatsappNumber(cleanValue);

    if (touched.whatsappNumber) {
      handleFieldBlur("whatsappNumber", cleanValue);
    }
  };

  // Handle "same as mobile" checkbox change
  const handleSameAsMobileChange = (event) => {
    const checked = event.target.checked;
    setSameAsMobile(checked);

    if (checked) {
      setWhatsappNumber(mobileNumber);
      // Clear WhatsApp validation error if using mobile number
      if (mobileNumber && validateMobileNumber(mobileNumber) === "") {
        setErrors((prev) => ({ ...prev, whatsappNumber: "" }));
      }
    }
  };

  // Fetch programs and branches from API
  const fetchProgramBranches = async () => {
    try {
      setProgramBranchesLoading(true);
      setProgramBranchesError(null);

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await api.get(
        `${BASE_URL}/internship/programs_branches2`,
        {
          headers,
        }
      );

      // Extract programs and branches from response
      if (response.data && response.data.programs && response.data.branches) {
        // Filter active programs only
        const activePrograms = response.data.programs.filter(
          (program) => program.is_active === "1"
        );
        setPrograms(activePrograms);

        // Store all active branches for filtering later
        const activeBranches = response.data.branches.filter(
          (branch) => branch.is_active === "1"
        );
        setAllBranches(activeBranches);

        // Initialize branch options as empty until program is selected
        setBranchOptions([]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching programs and branches:", err);
      setProgramBranchesError("Failed to fetch programs and branches");
      showNotification("Failed to fetch programs and branches", "error");

      // Fallback to default programs if API fails
      setPrograms([
        { program_id: 1, program_name: "B.Tech", is_active: "1" },
        { program_id: 2, program_name: "M.Tech", is_active: "1" },
        { program_id: 3, program_name: "MBA", is_active: "1" },
        { program_id: 4, program_name: "MCA", is_active: "1" },
      ]);

      // Fallback branches
      setBranchOptions([
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electronics & Communication",
        "Information Technology",
        "Chemical Engineering",
        "Biotechnology",
        "Aerospace Engineering",
      ]);
    } finally {
      setProgramBranchesLoading(false);
    }
  };

  // Update branches when program is selected
  useEffect(() => {
    if (selectedProgram && allBranches.length > 0) {
      // Filter branches based on selected program
      const programBranches = allBranches
        .filter((branch) => branch.program_id === selectedProgram.program_id)
        .map((branch) => branch.branch_name)
        .filter(Boolean);

      // Remove duplicates and sort
      const uniqueBranches = [...new Set(programBranches)].sort();
      setBranchOptions(uniqueBranches);

      // Reset branch selection when program changes
      setBranch("");
    } else {
      setBranchOptions([]);
      setBranch("");
    }
  }, [selectedProgram, allBranches]);

  // Fetch programs and branches when drawer opens and user type is DSPOC
  useEffect(() => {
    if (open && isDSPOC) {
      fetchProgramBranches();
    }
  }, [open, isDSPOC]);

  // Load edit data when opened for editing
  useEffect(() => {
    if (isEditing && editData && open) {
      setTimeout(() => {
        setEducatorName(editData.name || "");
        setCustomDesignation(editData.designation || null);
        setLocalDesignation(editData.localDesignation || "");
        setPersonalEmail(editData.personalEmail || "");
        setMobileNumber(editData.mobile || "");
        setWhatsappNumber(editData.whatsappNumber || editData.mobile || "");
        setSameAsMobile(
          editData.whatsappNumber === editData.mobile ||
            !editData.whatsappNumber
        );
        // For editing, assume email is already verified
        setIsEmailVerified(true);

        // Handle program and branch for DSPOC
        if (isDSPOC) {
          // If editData has program info, set it
          if (editData.program) {
            setSelectedProgram(editData.program);
          }

          // Handle branch as single string for DSPOC
          if (Array.isArray(editData.branch)) {
            setBranch(editData.branch[0] || "");
          } else {
            setBranch(editData.branch || "");
          }
        }
      }, 100);
    } else if (!isEditing && open) {
      resetForm();
    }
  }, [isEditing, editData, open, isDSPOC]);

  // Reset form fields
  const resetForm = () => {
    setEducatorName("");
    setCustomDesignation(null);
    setLocalDesignation("");
    setPersonalEmail("");
    setMobileNumber("");
    setWhatsappNumber("");
    setSameAsMobile(false);
    setSelectedProgram(null);
    setBranch("");
    setIsEmailVerified(false);
    setErrors({
      educatorName: "",
      customDesignation: "",
      localDesignation: "",
      personalEmail: "",
      mobileNumber: "",
      whatsappNumber: "",
      selectedProgram: "",
      branch: "",
    });
    setTouched({
      educatorName: false,
      customDesignation: false,
      localDesignation: false,
      personalEmail: false,
      mobileNumber: false,
      whatsappNumber: false,
      selectedProgram: false,
      branch: false,
    });
  };

  // API call to add leader using /internship/add-leaders
  const addLeader = async (educatorData) => {
    try {
      setIsSubmitting(true);

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // Prepare payload for leaders API
      const payload = {
        fullname: educatorData.name,
        designation: educatorData.designation || "",
        local_designation: educatorData.localDesignation || "",
        domain_email: educatorData.personalEmail,
        mobile_number: educatorData.mobile || "",
        whatsapp_number: educatorData.whatsappNumber || "",
      };

      const response = await api.post(
        `${BASE_URL}/internship/add-leaders`,
        payload,
        { headers }
      );

      // Check if response is successful
      if (response.data) {
        // Clear email verification from cookies after successful submission
        clearEmailVerificationFromCookies(educatorData.personalEmail);

        showNotification("Leader added successfully", "success");

        // Call the onAdd callback to refresh the main component
        if (onAdd) {
          onAdd(educatorData);
        }

        return true;
      } else {
        throw new Error("Failed to add leader");
      }
    } catch (error) {
      console.error("Error adding leader:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Failed to add leader";
      showNotification(errorMessage, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // API call to add DSPOC using /internship/add-dspoc
  const addDSPOC = async (educatorData) => {
    try {
      setIsSubmitting(true);

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // Prepare payload for DSPOC API
      const payload = {
        fullname: educatorData.name,
        designation: educatorData.designation || "",
        local_designation: educatorData.localDesignation || "",
        program_id: educatorData.selectedProgram?.program_id
          ? [educatorData.selectedProgram.program_id]
          : [],
        branch_name: educatorData.branch ? [educatorData.branch] : [], // Array format for branch
        domain_email: educatorData.personalEmail,
        mobile_number: educatorData.mobile || "",
        whatsapp_number: educatorData.whatsappNumber || "",
      };

      const response = await api.post(
        `${BASE_URL}/internship/add-dspoc`,
        payload,
        { headers }
      );

      // Check if response is successful
      if (response.data) {
        // Clear email verification from cookies after successful submission
        clearEmailVerificationFromCookies(educatorData.personalEmail);

        showNotification("DSPOC added successfully", "success");

        // Call the onAdd callback to refresh the main component
        if (onAdd) {
          onAdd(educatorData);
        }

        return true;
      } else {
        throw new Error("Failed to add DSPOC");
      }
    } catch (error) {
      console.error("Error adding DSPOC:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Failed to add DSPOC";
      showNotification(errorMessage, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Mark all fields as touched to show validation errors
    setTouched({
      educatorName: true,
      customDesignation: true,
      localDesignation: true,
      personalEmail: true,
      mobileNumber: true,
      whatsappNumber: true,
      selectedProgram: true,
      branch: true,
    });

    // Validate all fields
    if (!validateAllFields()) {
      showNotification("Please fix the errors in the form", "error");
      return;
    }

    if (!isEmailVerified && !isEditing) {
      showNotification("Please verify your email address first", "error");
      return;
    }

    // Create educator object with form data
    const educatorData = {
      name: educatorName.trim(),
      designation: customDesignation.trim(),
      localDesignation: localDesignation.trim(),
      personalEmail: personalEmail.trim(),
      mobile: mobileNumber.trim(),
      whatsappNumber: (sameAsMobile ? mobileNumber : whatsappNumber).trim(),
      type: userType, // Set the type based on the userType prop
      // Only include program and branch for DSPOC
      ...(isDSPOC && {
        selectedProgram: selectedProgram,
        branch: branch.trim(),
      }),
    };

    if (isEditing && onUpdate) {
      // Handle editing (existing functionality)
      onUpdate({ ...educatorData, id: editData.id });
      const userTypeDisplay = userType === "leaders" ? "Leader" : "DSPOC";
      showNotification(`${userTypeDisplay} updated successfully`, "success");
      handleClose();
    } else {
      // Handle adding new educator via appropriate API
      let success = false;

      if (userType === "leaders") {
        success = await addLeader(educatorData);
      } else if (userType === "dspoc") {
        success = await addDSPOC(educatorData);
      }

      if (success) {
        handleClose();
      }
    }
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  // Show notification
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Handle email verification completion
  const handleEmailVerificationComplete = (verified) => {
    setIsEmailVerified(verified);
  };

  // Get field label based on user type
  const getNameLabel = () => {
    if (userType === "leaders") return "Leader Name";
    return "DSPOC Name";
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 550, md: 600 },
            backgroundColor: theme.palette.background.paper,
            borderTopLeftRadius: { xs: 0, sm: "12px" },
            borderBottomLeftRadius: { xs: 0, sm: "12px" },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
              color: "white",
              p: 2,
              borderRadius: "12px",
              boxShadow: isDarkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(33, 150, 243, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: "0.9rem" }}
            >
              {getDrawerTitle()}
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              disabled={isSubmitting}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                },
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider
            sx={{
              mb: 3,
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.12)",
            }}
          />

          {/* Show error if programs/branches failed to load for DSPOC */}
          {isDSPOC && programBranchesError && (
            <Alert
              severity="warning"
              sx={{ mb: 2, borderRadius: "12px" }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={fetchProgramBranches}
                  disabled={programBranchesLoading}
                >
                  Retry
                </Button>
              }
            >
              {programBranchesError}
            </Alert>
          )}

          {/* Form with Reordered Fields */}
          <Grid container spacing={3}>
            {/* Row 1: Name - Full Width */}
            <Grid item xs={12}>
              <TextField
                label={getNameLabel()}
                fullWidth
                size="small"
                value={educatorName}
                onChange={(e) => {
                  setEducatorName(e.target.value);
                  if (touched.educatorName) {
                    handleFieldBlur("educatorName", e.target.value);
                  }
                }}
                onBlur={() => handleFieldBlur("educatorName", educatorName)}
                disabled={isSubmitting}
                required
                error={touched.educatorName && !!errors.educatorName}
                helperText={touched.educatorName && errors.educatorName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: isDarkMode ? BLUE.light : BLUE.main,
                      borderWidth: "2px",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: isDarkMode ? BLUE.light : BLUE.main,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: isDarkMode
                      ? theme.palette.text.secondary
                      : undefined,
                  },
                }}
              />
            </Grid>

            {/* Row 2: Designation and Local Designation */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                id="custom-designation"
                options={getDesignationOptions()}
                value={customDesignation}
                onChange={(event, newValue) => {
                  setCustomDesignation(newValue);
                  if (touched.customDesignation) {
                    handleFieldBlur("customDesignation", newValue);
                  }
                }}
                onBlur={() =>
                  handleFieldBlur("customDesignation", customDesignation)
                }
                disabled={isSubmitting}
                freeSolo
                ListboxProps={{
                  style: {
                    maxHeight: "200px",
                    overflow: "auto",
                  },
                  sx: {
                    "&::-webkit-scrollbar": {
                      width: "12px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                      borderRadius: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.3)",
                      borderRadius: "6px",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(0, 0, 0, 0.5)",
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Designation"
                    size="small"
                    required
                    error={
                      touched.customDesignation && !!errors.customDesignation
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          <InputAdornment position="end">
                            <ArrowDropDownIcon
                              sx={{
                                color: isDarkMode
                                  ? theme.palette.text.secondary
                                  : undefined,
                              }}
                            />
                          </InputAdornment>
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: isDarkMode ? BLUE.light : BLUE.main,
                          borderWidth: "2px",
                        },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: isDarkMode ? BLUE.light : BLUE.main,
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: isDarkMode
                          ? theme.palette.text.secondary
                          : undefined,
                      },
                    }}
                  />
                )}
                size="small"
                sx={{
                  "& .MuiAutocomplete-paper": {
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "12px",
                    marginTop: "4px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    maxHeight: "250px",
                    border: isDarkMode
                      ? "1px solid rgba(255, 255, 255, 0.12)"
                      : "1px solid rgba(0, 0, 0, 0.12)",
                  },
                  "& .MuiAutocomplete-option": {
                    padding: "10px 16px",
                    borderRadius: "6px",
                    margin: "2px 8px",
                    minHeight: "40px",
                    "&:hover": {
                      backgroundColor: isDarkMode
                        ? "rgba(33, 150, 243, 0.15)"
                        : "rgba(33, 150, 243, 0.08)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: isDarkMode
                        ? "rgba(33, 150, 243, 0.2)"
                        : "rgba(33, 150, 243, 0.12)",
                    },
                  },
                }}
              />
              {touched.customDesignation && errors.customDesignation && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 0.5, ml: 1.75 }}
                >
                  {errors.customDesignation}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Local Designation"
                fullWidth
                size="small"
                value={localDesignation}
                onChange={(e) => {
                  setLocalDesignation(e.target.value);
                  if (touched.localDesignation) {
                    handleFieldBlur("localDesignation", e.target.value);
                  }
                }}
                onBlur={() =>
                  handleFieldBlur("localDesignation", localDesignation)
                }
                disabled={isSubmitting}
                required
                error={touched.localDesignation && !!errors.localDesignation}
                helperText={touched.localDesignation && errors.localDesignation}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: isDarkMode ? BLUE.light : BLUE.main,
                      borderWidth: "2px",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: isDarkMode ? BLUE.light : BLUE.main,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: isDarkMode
                      ? theme.palette.text.secondary
                      : undefined,
                  },
                }}
              />
            </Grid>

            {/* Row 3: Email with OTP Verification - Full Width */}
            <Grid item xs={12}>
              <Box>
                <OTPVerification
                  email={personalEmail}
                  onEmailChange={(value) => {
                    setPersonalEmail(value);
                    if (touched.personalEmail) {
                      handleFieldBlur("personalEmail", value);
                    }
                  }}
                  isVerified={isEmailVerified}
                  onVerificationComplete={handleEmailVerificationComplete}
                  onShowNotification={showNotification}
                  disabled={isEditing || isSubmitting}
                  required={true}
                  size="small"
                />
                {touched.personalEmail && errors.personalEmail && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 0.5, ml: 1.75 }}
                  >
                    {errors.personalEmail}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Row 4: Mobile and WhatsApp Numbers */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                fullWidth
                size="small"
                value={mobileNumber}
                onChange={(e) => handleMobileNumberChange(e.target.value)}
                onBlur={() => handleFieldBlur("mobileNumber", mobileNumber)}
                disabled={isSubmitting}
                required
                error={touched.mobileNumber && !!errors.mobileNumber}
                helperText={touched.mobileNumber && errors.mobileNumber}
                inputProps={{
                  maxLength: 15,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: isDarkMode ? BLUE.light : BLUE.main,
                      borderWidth: "2px",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: isDarkMode ? BLUE.light : BLUE.main,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: isDarkMode
                      ? theme.palette.text.secondary
                      : undefined,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <TextField
                  label="WhatsApp Number"
                  fullWidth
                  size="small"
                  value={sameAsMobile ? mobileNumber : whatsappNumber}
                  onChange={(e) => {
                    if (!sameAsMobile) {
                      handleWhatsappNumberChange(e.target.value);
                    }
                  }}
                  onBlur={() =>
                    handleFieldBlur(
                      "whatsappNumber",
                      sameAsMobile ? mobileNumber : whatsappNumber
                    )
                  }
                  disabled={isSubmitting || sameAsMobile}
                  required
                  error={touched.whatsappNumber && !!errors.whatsappNumber}
                  helperText={touched.whatsappNumber && errors.whatsappNumber}
                  inputProps={{
                    maxLength: 15,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: isDarkMode ? BLUE.light : BLUE.main,
                        borderWidth: "2px",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: isDarkMode ? BLUE.light : BLUE.main,
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: isDarkMode
                        ? theme.palette.text.secondary
                        : undefined,
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsMobile}
                      onChange={handleSameAsMobileChange}
                      disabled={isSubmitting}
                      size="small"
                      sx={{
                        color: isDarkMode ? BLUE.light : BLUE.main,
                        "&.Mui-checked": {
                          color: isDarkMode ? BLUE.light : BLUE.main,
                        },
                      }}
                    />
                  }
                  label="Same as mobile number"
                  sx={{
                    mt: 1,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: isDarkMode
                        ? theme.palette.text.secondary
                        : theme.palette.text.secondary,
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Row 5: Program and Branch Selection - Only show for DSPOC */}
            {isDSPOC && (
              <>
                {/* Program Selection */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Autocomplete
                      id="program"
                      options={programs}
                      value={selectedProgram}
                      loading={programBranchesLoading}
                      disabled={programBranchesLoading || isSubmitting}
                      onChange={(event, newValue) => {
                        setSelectedProgram(newValue);
                        if (touched.selectedProgram) {
                          handleFieldBlur("selectedProgram", newValue);
                        }
                      }}
                      onBlur={() =>
                        handleFieldBlur("selectedProgram", selectedProgram)
                      }
                      getOptionLabel={(option) => option.program_name || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.program_id === value?.program_id
                      }
                      ListboxProps={{
                        style: {
                          maxHeight: "200px",
                          overflow: "auto",
                        },
                        sx: {
                          "&::-webkit-scrollbar": {
                            width: "12px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)",
                            borderRadius: "6px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                            borderRadius: "6px",
                            "&:hover": {
                              backgroundColor: isDarkMode
                                ? "rgba(255, 255, 255, 0.5)"
                                : "rgba(0, 0, 0, 0.5)",
                            },
                          },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Program/Course"
                          placeholder={
                            programBranchesLoading
                              ? "Loading programs..."
                              : "Select a program/course"
                          }
                          size="small"
                          required={isDSPOC}
                          error={
                            touched.selectedProgram && !!errors.selectedProgram
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {programBranchesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "16px",
                            },
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: isDarkMode
                                  ? BLUE.light
                                  : BLUE.main,
                                borderWidth: "2px",
                              },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: isDarkMode ? BLUE.light : BLUE.main,
                            },
                          }}
                          InputLabelProps={{
                            sx: {
                              color: isDarkMode
                                ? theme.palette.text.secondary
                                : undefined,
                            },
                          }}
                        />
                      )}
                      sx={{
                        "& .MuiAutocomplete-paper": {
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "12px",
                          marginTop: "4px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                          maxHeight: "250px",
                          border: isDarkMode
                            ? "1px solid rgba(255, 255, 255, 0.12)"
                            : "1px solid rgba(0, 0, 0, 0.12)",
                        },
                        "& .MuiAutocomplete-option": {
                          padding: "10px 16px",
                          borderRadius: "6px",
                          margin: "2px 8px",
                          minHeight: "40px",
                          "&:hover": {
                            backgroundColor: isDarkMode
                              ? "rgba(33, 150, 243, 0.15)"
                              : "rgba(33, 150, 243, 0.08)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: isDarkMode
                              ? "rgba(33, 150, 243, 0.2)"
                              : "rgba(33, 150, 243, 0.12)",
                          },
                        },
                      }}
                    />
                    {touched.selectedProgram && errors.selectedProgram && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1.75 }}
                      >
                        {errors.selectedProgram}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Branch Selection */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Autocomplete
                      id="branch"
                      options={branchOptions}
                      value={branch || null}
                      disabled={
                        programBranchesLoading ||
                        isSubmitting ||
                        !selectedProgram
                      }
                      onChange={(event, newValue) => {
                        setBranch(newValue || "");
                        if (touched.branch) {
                          handleFieldBlur("branch", newValue || "");
                        }
                      }}
                      onBlur={() => handleFieldBlur("branch", branch)}
                      ListboxProps={{
                        style: {
                          maxHeight: "200px",
                          overflow: "auto",
                        },
                        sx: {
                          "&::-webkit-scrollbar": {
                            width: "12px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)",
                            borderRadius: "6px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                            borderRadius: "6px",
                            "&:hover": {
                              backgroundColor: isDarkMode
                                ? "rgba(255, 255, 255, 0.5)"
                                : "rgba(0, 0, 0, 0.5)",
                            },
                          },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Branch"
                          placeholder={
                            selectedProgram
                              ? "Select a branch"
                              : "Select program first"
                          }
                          size="small"
                          required={isDSPOC}
                          error={touched.branch && !!errors.branch}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "16px",
                            },
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: isDarkMode
                                  ? BLUE.light
                                  : BLUE.main,
                                borderWidth: "2px",
                              },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: isDarkMode ? BLUE.light : BLUE.main,
                            },
                          }}
                          InputLabelProps={{
                            sx: {
                              color: isDarkMode
                                ? theme.palette.text.secondary
                                : undefined,
                            },
                          }}
                        />
                      )}
                      noOptionsText={
                        selectedProgram
                          ? "No branches available for selected program"
                          : "Please select a program first"
                      }
                      sx={{
                        "& .MuiAutocomplete-paper": {
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "12px",
                          marginTop: "4px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                          maxHeight: "250px",
                          border: isDarkMode
                            ? "1px solid rgba(255, 255, 255, 0.12)"
                            : "1px solid rgba(0, 0, 0, 0.12)",
                        },
                        "& .MuiAutocomplete-option": {
                          padding: "10px 16px",
                          borderRadius: "6px",
                          margin: "2px 8px",
                          minHeight: "40px",
                          "&:hover": {
                            backgroundColor: isDarkMode
                              ? "rgba(33, 150, 243, 0.15)"
                              : "rgba(33, 150, 243, 0.08)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: isDarkMode
                              ? "rgba(33, 150, 243, 0.2)"
                              : "rgba(33, 150, 243, 0.12)",
                          },
                        },
                      }}
                    />
                    {touched.branch && errors.branch && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 1.75 }}
                      >
                        {errors.branch}
                      </Typography>
                    )}

                    {selectedProgram && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Selected Program: {selectedProgram.program_name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </>
            )}
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${
                isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
              }`,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
              size="medium"
              sx={{
                borderRadius: "24px",
                px: 4,
                py: 1.5,
                color: isDarkMode ? BLUE.light : BLUE.main,
                borderColor: isDarkMode ? BLUE.light : BLUE.main,
                "&:hover": {
                  borderColor: isDarkMode ? BLUE.main : BLUE.dark,
                  backgroundColor: isDarkMode
                    ? "rgba(33, 150, 243, 0.15)"
                    : "rgba(33, 150, 243, 0.04)",
                },
                "&.Mui-disabled": {
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.26)",
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.26)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              size="medium"
              startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
              sx={{
                borderRadius: "24px",
                px: 4,
                py: 1.5,
                background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
                boxShadow: "0 4px 10px rgba(33, 150, 243, 0.3)",
                "&:hover": {
                  background: isDarkMode ? BLUE.gradient : BLUE.gradientDark,
                  boxShadow: "0 6px 15px rgba(33, 150, 243, 0.4)",
                },
                "&.Mui-disabled": {
                  background: isDarkMode
                    ? "rgba(25, 118, 210, 0.3)"
                    : "rgba(33, 150, 243, 0.3)",
                },
              }}
            >
              {isSubmitting
                ? `${isEditing ? "Updating..." : "Adding..."}`
                : isEditing
                ? `Update ${userType === "leaders" ? "Leader" : "DSPOC"}`
                : `Add ${userType === "leaders" ? "Leader" : "DSPOC"}`}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "12px",
            fontWeight: 500,
            fontSize: "0.85rem",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
            "& .MuiAlert-icon": {
              fontSize: "1.1rem",
            },
            "& .MuiAlert-action": {
              "& .MuiIconButton-root": {
                color: "inherit",
                padding: "4px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              },
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddEducatorDrawer;
