import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../../../services/configUrls";

const AddNewFacultyModal = ({ open, onClose, bookslotId, onSuccess }) => {
  const [formData, setFormData] = useState({
    edu_name: "",
    email: "",
    phone_no: "",
    designation: "",
    branch: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setFormData({
        edu_name: "",
        email: "",
        phone_no: "",
        designation: "",
        branch: "",
      });
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.edu_name.trim()) {
      setError("Educator name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone_no.trim()) {
      setError("Phone number is required");
      return false;
    }
    // Basic phone number validation (10-11 digits)
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(formData.phone_no)) {
      setError("Please enter a valid phone number (10-11 digits)");
      return false;
    }
    if (!formData.designation.trim()) {
      setError("Designation is required");
      return false;
    }
    if (!formData.branch.trim()) {
      setError("Branch is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        edu_name: formData.edu_name.trim(),
        email: formData.email.trim(),
        phone_no: formData.phone_no.trim(),
        designation: formData.designation.trim(),
        branch: formData.branch.trim(),
        bookslot_id: bookslotId,
      };

      await axios.post(`${BASE_URL}/event/add-faculty`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setSuccess(true);

      // Call onSuccess callback to refresh the parent table
      if (onSuccess) {
        onSuccess();
      }

      // Close modal after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error adding faculty:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add faculty. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <PersonAdd color="primary" />
        <Typography variant="h6" component="span">
          Add New Faculty
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Faculty added successfully!
          </Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Educator Name"
            name="edu_name"
            value={formData.edu_name}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading || success}
            placeholder="Enter educator's full name"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading || success}
            placeholder="example@gmail.com"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading || success}
            placeholder="Enter 10-11 digit phone number"
            variant="outlined"
            inputProps={{
              maxLength: 11,
              pattern: "[0-9]*",
            }}
          />

          <TextField
            fullWidth
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading || success}
            placeholder="e.g., Professor, Assistant Professor"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading || success}
            placeholder="e.g., CSE, ECE, ME"
            variant="outlined"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || success}
          variant="contained"
          color="primary"
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Adding..." : "Add Faculty"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewFacultyModal;
