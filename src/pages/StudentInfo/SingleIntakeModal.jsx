import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  CircularProgress,
  Paper,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  X,
  UserPlus,
  BookOpen,
  Mail,
  Phone,
  User,
  GraduationCap,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StaffService } from "../../services/dataService";
import { toast } from "react-toastify";

// Color constants
const greenColors = {
  primary: "#15803d",
  secondary: "#16a34a",
  light: "#22c55e",
  lighter: "#86efac",
  dark: "#166534",
  contrast: "#f0fdf4",
  surface: "#dcfce7",
  hover: "#15803d",
  gradient: "linear-gradient(145deg, #16a34a 0%, #15803d 100%)",
};

// Styled components remain the same...
// (Keep all your styled components from the previous version)

const SingleIntakeModal = ({ open, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name should be at least 2 characters")
      .max(50, "Name should not exceed 50 characters"),
    mail_id: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    branch: Yup.string()
      .required("Branch is required")
      .min(2, "Branch should be at least 2 characters"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["Male", "Female", "Other"], "Invalid gender selection"),
    year: Yup.number()
      .required("Passout year is required")
      .min(2000, "Passout year must be 2000 or later")
      .max(2040, "Passout year must be 2040 or earlier"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      mail_id: "",
      branch: "",
      mobile: "",
      gender: "",
      year: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("op_type", "SINGLE");
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        const response = await StaffService.uploadIntakeData(formData);

        if (response.status === 200) {
          toast.success(response.data.message);
          formik.resetForm();
          onSuccess(); // Refresh the parent table
          onClose(); // Close the modal
        }
      } catch (error) {
        console.error("Submission error:", error);
        if (error.response) {
          switch (error.response.status) {
            case 400:
              toast.error("Invalid data provided. Please check the form.");
              break;
            case 409:
              toast.error("A student with this email already exists.");
              break;
            case 422:
              toast.error("Please fill all required fields correctly.");
              break;
            default:
              toast.error("Failed to add student. Please try again.");
          }
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => !isSubmitting && onClose()}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          backgroundImage: "none",
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: greenColors.gradient,
          borderRadius: "16px 16px 0 0",
          p: 3,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: greenColors.contrast,
              width: 48,
              height: 48,
              color: greenColors.primary,
            }}
          >
            <UserPlus size={24} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: greenColors.contrast,
              }}
            >
              Add New Student
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: greenColors.surface,
                mt: 0.5,
              }}
            >
              Please fill in all the required information
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => !isSubmitting && onClose()}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: greenColors.contrast,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          disabled={isSubmitting}
        >
          <X size={20} />
        </IconButton>
      </Paper>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} color={greenColors.primary} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="mail_id"
                name="mail_id"
                label="Email ID"
                size="small"
                value={formik.values.mail_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mail_id && Boolean(formik.errors.mail_id)}
                helperText={formik.touched.mail_id && formik.errors.mail_id}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} color={greenColors.primary} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="branch"
                name="branch"
                label="Branch"
                size="small"
                value={formik.values.branch}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.branch && Boolean(formik.errors.branch)}
                helperText={formik.touched.branch && formik.errors.branch}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BookOpen size={18} color={greenColors.primary} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="mobile"
                name="mobile"
                label="Mobile Number"
                size="small"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                disabled={isSubmitting}
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone size={18} color={greenColors.primary} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                id="gender"
                options={genderOptions}
                getOptionLabel={(option) => option.label}
                value={
                  genderOptions.find(
                    (option) => option.value === formik.values.gender
                  ) || null
                }
                onChange={(event, newValue) => {
                  formik.setFieldValue(
                    "gender",
                    newValue ? newValue.value : ""
                  );
                }}
                disabled={isSubmitting}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gender"
                    size="small"
                    error={
                      formik.touched.gender && Boolean(formik.errors.gender)
                    }
                    helperText={formik.touched.gender && formik.errors.gender}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={18} color={greenColors.primary} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="year"
                name="year"
                label="Passout Year"
                size="small"
                type="number"
                value={formik.values.year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GraduationCap size={18} color={greenColors.primary} />
                    </InputAdornment>
                  ),
                  inputProps: {
                    min: 2000,
                    max: 2040,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            bgcolor: greenColors.surface,
          }}
        >
          <Button
            onClick={() => !isSubmitting && onClose()}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              py: 1,
              borderColor: greenColors.primary,
              color: greenColors.primary,
              "&:hover": {
                borderColor: greenColors.dark,
                bgcolor: "rgba(21, 128, 61, 0.04)",
              },
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 4,
              py: 1,
              bgcolor: greenColors.primary,
              "&:hover": {
                bgcolor: greenColors.dark,
              },
              "&.Mui-disabled": {
                bgcolor: greenColors.lighter,
              },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Adding Student...
              </>
            ) : (
              "Add Student"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SingleIntakeModal;
