import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Paper,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(1),
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(3px)",
  },
}));

const WarningIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: 36,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(1),
}));

const SuccessIcon = styled(VerifiedUserIcon)(({ theme }) => ({
  fontSize: 36,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(1),
}));

const EmailIcon = styled(MarkEmailReadIcon)(({ theme }) => ({
  fontSize: 36,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

// OTP input component with validation
const OtpInput = ({ value, onChange, error, helperText }) => {
  return (
    <TextField
      value={value}
      onChange={(e) => {
        // Only allow digits and max 6 characters
        const newValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
        onChange(newValue);
      }}
      error={error}
      helperText={helperText}
      label="Enter 6-digit OTP"
      variant="outlined"
      placeholder="123456"
      fullWidth
      size="small"
      inputProps={{
        maxLength: 6,
        inputMode: "numeric",
        pattern: "[0-9]*",
        style: {
          letterSpacing: "0.3em",
          fontSize: "1rem",
          textAlign: "center",
        },
      }}
      sx={{ mt: 1.5 }}
      FormHelperTextProps={{ sx: { fontSize: "0.7rem", mt: 0.5 } }}
    />
  );
};

const FailStudentModal = ({
  open,
  onClose,
  student,
  onSendOtp,
  verifyOtp,
  onDataRefresh,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sentOtpSuccess, setSentOtpSuccess] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Two-step process only
  const steps = ["Confirmation", "OTP Verification"];

  // Memoize student data to prevent re-renders
  const [localStudentData, setLocalStudentData] = useState({
    name: "",
    email: "",
    user_id: null,
  });

  // Update local student data when the prop changes
  useEffect(() => {
    if (student) {
      setLocalStudentData({
        name: student.name || "",
        email: student.email || "",
        user_id: student.user_id || null,
      });
    }
  }, [student]);

  // Reset state when modal is closed
  const handleClose = () => {
    if (sendingOtp || verifyingOtp) return;
    onClose();
  };

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (otpCooldown && cooldownTimeLeft > 0) {
      timer = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setOtpCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpCooldown, cooldownTimeLeft]);

  // Format time for display
  const formatTimeLeft = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!localStudentData.email || !localStudentData.user_id) {
      setOtpError("Student information incomplete. Missing email or user ID.");
      return;
    }

    setSendingOtp(true);
    setSentOtpSuccess(false);

    try {
      // Pass both email and user_id to the onSendOtp function
      await onSendOtp(localStudentData.email, localStudentData.user_id);
      setSentOtpSuccess(true);
      // Reset any previous OTP errors
      setOtpError("");
      // Reset OTP input field when sending a new OTP
      setOtp("");

      // Start cooldown timer (10 minutes = 600 seconds)
      setOtpCooldown(true);
      setCooldownTimeLeft(600);
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Show specific error from API if available
      setOtpError(error.message || "Failed to send OTP. Please try again.");
      setSentOtpSuccess(false);
    } finally {
      setSendingOtp(false);
    }
  };

  // Update the handleVerifyOtp function to include user_id
  const handleVerifyOtp = async () => {
    // Validate OTP
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!localStudentData.user_id) {
      setOtpError("Missing user ID. Cannot verify OTP.");
      return;
    }

    setVerifyingOtp(true);

    try {
      // Pass email, otp, and user_id to the verifyOtp function
      // The student is automatically marked as failed when OTP is verified
      await verifyOtp(localStudentData.email, otp, localStudentData.user_id);

      // Success handling - display success message
      setVerificationSuccess(true);
      setSuccessMessage("Student marked as failed successfully!");

      setTimeout(() => {
        handleClose();
        // Refresh data to reflect changes
        if (onDataRefresh) {
          onDataRefresh();
        }
      }, 1500); // Close after 1.5 seconds to show success message
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Show specific error message if available
      setOtpError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Render content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <WarningIcon />
              <DialogContentText
                id="alert-dialog-description"
                sx={{
                  textAlign: "center",
                  fontSize: "0.85rem",
                  mb: 1,
                  width: "100%",
                }}
              >
                Are you sure you want to mark the following student as failed?
              </DialogContentText>
              <Typography
                variant="subtitle2"
                component="div"
                sx={{
                  mt: 1,
                  py: 0.75,
                  px: 1.5,
                  backgroundColor: "rgba(255, 0, 0, 0.05)",
                  borderRadius: 1,
                  fontSize: "0.85rem",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {localStudentData.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: "0.75rem" }}
              >
                {localStudentData.email}
              </Typography>
            </Box>
            <DialogActions
              sx={{ px: 1.5, pb: 1.5, justifyContent: "center", mt: 1.5 }}
            >
              <Button
                onClick={handleClose}
                color="inherit"
                variant="outlined"
                size="small"
                sx={{ minWidth: "80px", fontSize: "0.75rem" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setActiveStep(1)}
                color="primary"
                variant="contained"
                size="small"
                sx={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
                  boxShadow: "0 4px 10px rgba(0, 136, 204, 0.3)",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #007bb8 30%, #0095d6 90%)",
                    boxShadow: "0 6px 12px rgba(0, 136, 204, 0.4)",
                  },
                }}
              >
                Continue
              </Button>
            </DialogActions>
          </>
        );

      case 1:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <EmailIcon />
              <DialogContentText
                id="alert-dialog-description"
                sx={{
                  textAlign: "center",
                  mb: 1,
                  fontSize: "0.8rem",
                  width: "100%",
                }}
              >
                We need to verify this action. Please request and enter the OTP
                sent to the student's email.
              </DialogContentText>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  p: 1,
                  borderRadius: 1,
                  width: "100%",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontSize: "0.75rem" }}
                >
                  Student Information:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  {localStudentData.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {localStudentData.email}
                </Typography>
              </Paper>

              {sentOtpSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    width: "100%",
                    mb: 1,
                    py: 0,
                    alignItems: "center",
                    "& .MuiAlert-message": {
                      fontSize: "0.7rem",
                      py: 0.5,
                    },
                    "& .MuiAlert-icon": {
                      fontSize: "1rem",
                      marginRight: "8px",
                      alignSelf: "center",
                    },
                  }}
                >
                  OTP sent successfully to student's email!
                </Alert>
              )}

              {verificationSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    width: "100%",
                    mb: 1,
                    py: 0,
                    alignItems: "center",
                    "& .MuiAlert-message": {
                      fontSize: "0.7rem",
                      py: 0.5,
                    },
                    "& .MuiAlert-icon": {
                      fontSize: "1rem",
                      marginRight: "8px",
                      alignSelf: "center",
                    },
                  }}
                >
                  {successMessage}
                </Alert>
              )}

              <Button
                variant="outlined"
                color="primary"
                onClick={handleSendOtp}
                disabled={sendingOtp || otpCooldown || verificationSuccess}
                startIcon={sendingOtp ? <CircularProgress size={16} /> : null}
                sx={{ mb: 1, width: "100%", fontSize: "0.75rem", py: 0.75 }}
                size="small"
              >
                {sendingOtp
                  ? "Sending OTP..."
                  : otpCooldown
                  ? `Resend OTP (${formatTimeLeft(cooldownTimeLeft)})`
                  : "Send OTP to Email"}
              </Button>

              <OtpInput
                value={otp}
                onChange={setOtp}
                error={!!otpError}
                helperText={otpError}
                disabled={verificationSuccess}
              />
            </Box>
            <DialogActions
              sx={{ px: 1.5, pb: 1.5, justifyContent: "center", mt: 1.5 }}
            >
              <Button
                onClick={() => setActiveStep(0)}
                color="inherit"
                variant="outlined"
                disabled={verifyingOtp || verificationSuccess}
                size="small"
                sx={{ minWidth: "80px", fontSize: "0.75rem" }}
              >
                Back
              </Button>
              <Button
                onClick={handleVerifyOtp}
                color="primary"
                variant="contained"
                disabled={
                  verifyingOtp ||
                  !otp ||
                  otp.length !== 6 ||
                  verificationSuccess
                }
                startIcon={verifyingOtp ? <CircularProgress size={16} /> : null}
                size="small"
                sx={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
                  boxShadow: "0 4px 10px rgba(0, 136, 204, 0.3)",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #007bb8 30%, #0095d6 90%)",
                    boxShadow: "0 6px 12px rgba(0, 136, 204, 0.4)",
                  },
                }}
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
            </DialogActions>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="fail-student-dialog-title"
      TransitionProps={{
        onExited: () => {
          // Reset on complete exit to ensure the modal is fully gone
          setActiveStep(0);
          setOtp("");
          setOtpError("");
          setSentOtpSuccess(false);
          setVerificationSuccess(false);
          setSuccessMessage("");
          // Don't reset cooldown timer when closing, so it persists if user reopens the modal
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1) !important",
        },
      }}
    >
      <DialogTitle
        id="fail-student-dialog-title"
        sx={{
          pb: 0.5,
          pt: 1.5,
          textAlign: "center",
          fontSize: "1rem",
        }}
      >
        Mark Student as Failed
      </DialogTitle>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          px: 2,
          pt: 0.5,
          pb: 1.5,
          "& .MuiStepLabel-label": {
            fontSize: "0.75rem",
            marginTop: "4px",
          },
          "& .MuiStepIcon-root": {
            fontSize: "1.2rem",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <DialogContent sx={{ textAlign: "center", py: 1.5, px: 2 }}>
        <Fade in={true} timeout={250}>
          <div>{renderStepContent()}</div>
        </Fade>
      </DialogContent>
    </StyledDialog>
  );
};

export default FailStudentModal;
