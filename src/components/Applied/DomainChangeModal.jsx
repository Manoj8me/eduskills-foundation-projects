import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Autocomplete,
  IconButton,
  CircularProgress,
  Divider,
  Alert,
  Slide,
  styled,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  DomainVerificationOutlined as DomainIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

// Transition for modal opening
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    overflow: "visible",
    maxWidth: "420px",
    width: "100%",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
  padding: theme.spacing(2.5, 3),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 12,
  top: 12,
  color: theme.palette.grey[500],
  padding: 6,
  backgroundColor: "rgba(0, 0, 0, 0.04)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
}));

const StudentInfoCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  background: "rgba(0, 136, 204, 0.04)",
  borderRadius: 12,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  border: "1px solid rgba(0, 136, 204, 0.1)",
}));

const DomainChangeModal = ({
  open,
  onClose,
  student,
  domains = [],
  onDataRefresh,
}) => {
  const [step, setStep] = useState(1); // 1: domain selection, 2: OTP verification
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showOtp, setShowOtp] = useState(false);

  // Clear alerts after a timeout
  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  // Handle domain selection
  const handleDomainChange = (event, newValue) => {
    setSelectedDomain(newValue);
    setError(null);
  };

  // Handle OTP change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError(null);
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!selectedDomain) {
      setError("Please select a domain");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Ensure we have the user_id from the student object
      const userId = student.user_id || student.id;

      // Send OTP request with the new API endpoint
      await api.get(
        `${BASE_URL}/internship/change/domain/${userId}/${selectedDomain.domain_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Move to OTP verification step
      setStep(2);
      setSuccess("OTP sent successfully to your email address");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying OTP and changing domain
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Ensure we have the user_id from the student object
      const userId = student.user_id || student.id;

      // Verify OTP and change domain using PUT method with OTP in body
      await api.put(
        `${BASE_URL}/internship/change/domain/${userId}/${selectedDomain.domain_id}`,
        { otp: otp }, // Send OTP directly in the body, not nested in 'body' property
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Domain changed successfully");

      // Close modal after a delay and refresh data
      setTimeout(() => {
        handleClose();
        // Refresh the table data after domain change
        if (onDataRefresh) {
          onDataRefresh();
        }
      }, 1500);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset the modal state on close
  const handleClose = () => {
    setStep(1);
    setSelectedDomain(null);
    setOtp("");
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="domain-change-dialog-title"
    >
      <StyledDialogTitle id="domain-change-dialog-title">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ color: "#00000" }}
        >
          {step === 1 ? "Change Domain" : "Verify OTP"}
        </Typography>
      </StyledDialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 3, mb: 2, fontSize: "0.75rem", borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mt: 3, mb: 2, fontSize: "0.75rem", borderRadius: 2 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Step 1: Domain Selection */}
        {step === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" mb={1.5} color="text.secondary">
              Select the new domain for this student:
            </Typography>

            <Autocomplete
              value={selectedDomain}
              onChange={handleDomainChange}
              options={domains}
              getOptionLabel={(option) => option.domain_name || ""}
              isOptionEqualToValue={(option, value) =>
                option.domain_id === value.domain_id
              }
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Domain"
                  required
                  error={error && !selectedDomain}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
              sx={{ mb: 1 }}
            />
          </Box>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" mb={1.5} color="text.secondary">
              An OTP has been sent to <strong>{student?.email}</strong>. Please
              enter it below:
            </Typography>

            <TextField
              label="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              fullWidth
              size="small"
              required
              error={error && !otp}
              type={showOtp ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle OTP visibility"
                      onClick={() => setShowOtp(!showOtp)}
                      edge="end"
                      size="small"
                    >
                      {showOtp ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              inputProps={{ maxLength: 6 }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2.5, backgroundColor: "rgba(0, 0, 0, 0.02)" }}
      >
        <Button
          onClick={handleClose}
          color="inherit"
          size="small"
          sx={{
            fontWeight: 500,
            textTransform: "none",
            borderRadius: 2,
            px: 2,
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
          color="primary"
          variant="contained"
          disabled={
            loading || (step === 1 && !selectedDomain) || (step === 2 && !otp)
          }
          size="small"
          sx={{
            fontWeight: 500,
            textTransform: "none",
            minWidth: "120px",
            borderRadius: 2,
            background: "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
            boxShadow: "0 4px 10px rgba(0, 136, 204, 0.3)",
            "&.Mui-disabled": {
              background: "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
              opacity: 0.5,
              color: "white",
            },
            px: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : step === 1 ? (
            "Send OTP"
          ) : (
            "Verify & Change"
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DomainChangeModal;
