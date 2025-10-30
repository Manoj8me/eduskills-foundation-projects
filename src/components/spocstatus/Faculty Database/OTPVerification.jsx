import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  CircularProgress,
  Zoom,
  Slide,
  Collapse,
  keyframes,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Verified as VerifiedIcon,
  Email as EmailIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import axios from "axios";

// Enhanced Material UI Blue colors
const BLUE = {
  solight: "#EEF7FE",
  light: "#BBDEFB",
  main: "#2196F3",
  dark: "#1976D2",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
};

// Shake animation for invalid OTP
const shake = keyframes`
  0% { transform: translateX(0); }
  10% { transform: translateX(-10px); }
  20% { transform: translateX(10px); }
  30% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  50% { transform: translateX(-5px); }
  60% { transform: translateX(5px); }
  70% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  90% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const OTPVerification = ({
  email,
  onEmailChange,
  isVerified,
  onVerificationComplete,
  onShowNotification,
  disabled = false,
  required = false,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // OTP verification states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [shakeOtp, setShakeOtp] = useState(false);
  const [emailVerificationDisabled, setEmailVerificationDisabled] =
    useState(false);

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Function to check if email is verified in cookies
  const isEmailVerifiedInCookies = (emailAddress) => {
    const cookies = document.cookie.split(";");
    const verificationCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`email_verified_${emailAddress}=`)
    );
    return verificationCookie
      ? verificationCookie.split("=")[1] === "true"
      : false;
  };

  // Function to set email verification status in cookies
  const setEmailVerificationInCookies = (emailAddress, verified) => {
    if (verified) {
      // Set cookie without expiration (session cookie)
      document.cookie = `email_verified_${emailAddress}=true; path=/`;
    } else {
      // Remove cookie by setting expiration to past date
      document.cookie = `email_verified_${emailAddress}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  };

  // Function to clear email verification from cookies (to be called after form submission)
  const clearEmailVerificationFromCookies = (emailAddress) => {
    document.cookie = `email_verified_${emailAddress}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Expose the clear function to parent components via a ref or callback
  useEffect(() => {
    // Add clear function to window object so parent can access it
    window.clearEmailVerification = () => {
      if (email) {
        clearEmailVerificationFromCookies(email);
      }
    };

    return () => {
      // Clean up
      delete window.clearEmailVerification;
    };
  }, [email]);

  // Check email verification status on component mount and email change
  useEffect(() => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const isVerifiedInCookies = isEmailVerifiedInCookies(email);
      if (isVerifiedInCookies) {
        setEmailVerificationDisabled(true);
        onVerificationComplete(true);
      } else {
        setEmailVerificationDisabled(false);
        onVerificationComplete(false);
      }
    } else {
      setEmailVerificationDisabled(false);
      onVerificationComplete(false);
    }
  }, [email, onVerificationComplete]);

  // Timer effect for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else if (resendTimer === 0 && showOtpInput) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, showOtpInput]);

  // Reset OTP states when verification is complete
  useEffect(() => {
    if (isVerified) {
      setShowOtpInput(false);
      setOtpValues(["", "", "", "", "", ""]);
      setResendTimer(0);
      setCanResend(false);
    }
  }, [isVerified]);

  // Handle email verification - Send OTP
  const handleVerifyEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onShowNotification("Please enter a valid email address", "error");
      return;
    }

    setIsVerifyingEmail(true);

    try {
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

      const response = await axios.post(
        `${BASE_URL}/internship/send-otp/academy-leaders/`,
        {
          email: email,
        },
        {
          headers,
        }
      );

      // Check if response is successful and store OTP in cookies
      if (response.data.message) {
        // Store OTP in cookies with expiration (2 minutes)
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 2);
        document.cookie = `otp_${email}=${
          response.data.otp
        }; expires=${expirationTime.toUTCString()}; path=/`;

        // Disable verify email button immediately when OTP is sent
        setEmailVerificationDisabled(true);

        setShowOtpInput(true);
        setResendTimer(120); // 2 minutes timer
        setCanResend(false);
        onShowNotification("OTP sent to your email address", "success");

        // Auto-focus first OTP input after animation
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 600);
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send OTP. Please try again.";
      onShowNotification(errorMessage, "error");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (
      newOtpValues.every((digit) => digit !== "") &&
      newOtpValues.join("").length === 6
    ) {
      handleVerifyOtp(newOtpValues.join(""));
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Trigger shake animation
  const triggerShakeAnimation = () => {
    setShakeOtp(true);
    setTimeout(() => setShakeOtp(false), 500);
  };

  // Function to get OTP from cookies
  const getOtpFromCookies = () => {
    const cookies = document.cookie.split(";");
    const otpCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`otp_${email}=`)
    );
    if (otpCookie) {
      return otpCookie.split("=")[1];
    }
    return null;
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otp = null) => {
    const otpToVerify = otp || otpValues.join("");

    if (otpToVerify.length !== 6) {
      onShowNotification("Please enter all 6 digits", "error");
      return;
    }

    // Get stored OTP from cookies
    const otpSent = getOtpFromCookies();

    if (!otpSent) {
      onShowNotification(
        "OTP session expired. Please request a new OTP.",
        "error"
      );
      setShowOtpInput(false);
      return;
    }

    setIsVerifyingOtp(true);

    try {
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

      const response = await axios.post(
        `${BASE_URL}/internship/verify-otp/academy-leaders`,
        {
          email: email,
          //   otp_sent: otpSent,
          otp: otpToVerify,
        },
        {
          headers,
        }
      );

      console.log(response);
      // Check if verification is successful
      if (response.statusText === "OK" || response.status === 200) {
        // Clear OTP from cookies after successful verification
        document.cookie = `otp_${email}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        // Set email verification status in cookies
        setEmailVerificationInCookies(email, true);

        // Disable the verify email button
        setEmailVerificationDisabled(true);

        onVerificationComplete(true);
        onShowNotification("Email verified successfully!", "success");
        setShowOtpInput(false);
        setOtpValues(["", "", "", "", "", ""]);
        setResendTimer(0);
        setCanResend(false);
      } else {
        throw new Error(response?.data?.detail || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Invalid OTP. Please try again.";
      onShowNotification(errorMessage, "error");

      // Trigger shake animation and clear OTP fields
      triggerShakeAnimation();
      setOtpValues(["", "", "", "", "", ""]);
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 500);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsVerifyingEmail(true);
    setCanResend(false);

    try {
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

      const response = await axios.post(
        `${BASE_URL}/internship/send-otp/academy-leaders/`,
        {
          email: email,
        },
        {
          headers,
        }
      );

      if (response.data.message) {
        // Store new OTP in cookies with expiration (2 minutes)
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 2);
        document.cookie = `otp_${email}=${
          response.data.otp
        }; expires=${expirationTime.toUTCString()}; path=/`;

        // Keep verify email button disabled since OTP is sent again
        setEmailVerificationDisabled(true);

        setResendTimer(120); // Reset timer to 2 minutes
        setOtpValues(["", "", "", "", "", ""]);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
        onShowNotification("OTP resent successfully", "success");
      } else {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP";
      onShowNotification(errorMessage, "error");
      setCanResend(true); // Allow retry
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box>
      {/* Email Input Field */}
      <TextField
        label="Email"
        fullWidth
        size="small"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required={required}
        type="email"
        disabled={isVerified || disabled}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: isVerified
              ? isDarkMode
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(76, 175, 80, 0.05)"
              : "transparent",
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
        InputProps={{
          endAdornment: isVerified ? (
            <InputAdornment position="end">
              <Zoom in={isVerified}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <VerifiedIcon sx={{ color: "#4CAF50", fontSize: "18px" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#4CAF50", fontWeight: 600 }}
                  >
                    Verified
                  </Typography>
                </Box>
              </Zoom>
            </InputAdornment>
          ) : null,
        }}
        InputLabelProps={{
          sx: {
            color: isDarkMode ? theme.palette.text.secondary : undefined,
          },
        }}
      />

      {/* Email Verification Notice */}
      {!isVerified &&
        !disabled &&
        email &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
          <Collapse in={!isVerified && !showOtpInput}>
            <Box sx={{ mt: 1.5 }}>
              <Alert
                severity="info"
                icon={<InfoIcon />}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: isDarkMode
                    ? "rgba(33, 150, 243, 0.1)"
                    : "rgba(33, 150, 243, 0.05)",
                  border: `1px solid ${
                    isDarkMode
                      ? "rgba(33, 150, 243, 0.3)"
                      : "rgba(33, 150, 243, 0.2)"
                  }`,
                  "& .MuiAlert-icon": {
                    color: isDarkMode ? BLUE.light : BLUE.main,
                  },
                  "& .MuiAlert-message": {
                    color: isDarkMode
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                  },
                }}
              >
                <AlertTitle
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: isDarkMode ? BLUE.light : BLUE.main,
                  }}
                >
                  Email Verification Required
                </AlertTitle>
                <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                  Please verify your email address to proceed with the
                  application.
                </Typography>
              </Alert>
            </Box>
          </Collapse>
        )}

      {/* Verify Email Button */}
      {!isVerified && !disabled && (
        <Collapse in={!isVerified}>
          <Box sx={{ mt: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleVerifyEmail}
              disabled={
                !email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                isVerifyingEmail ||
                emailVerificationDisabled ||
                showOtpInput
              }
              startIcon={
                isVerifyingEmail ? (
                  <CircularProgress size={16} />
                ) : (
                  <EmailIcon />
                )
              }
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "0.75rem",
                py: 0.75,
                px: 2.5,
                borderColor: isDarkMode ? BLUE.light : BLUE.main,
                color: isDarkMode ? BLUE.light : BLUE.main,
                "&:hover": {
                  borderColor: isDarkMode ? BLUE.main : BLUE.dark,
                  backgroundColor: isDarkMode
                    ? "rgba(33, 150, 243, 0.1)"
                    : "rgba(33, 150, 243, 0.05)",
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
              {isVerifyingEmail
                ? "Sending..."
                : emailVerificationDisabled
                ? "OTP Sent"
                : "Verify Email"}
            </Button>
          </Box>
        </Collapse>
      )}

      {/* OTP Input Section */}
      <Slide direction="down" in={showOtpInput} mountOnEnter unmountOnExit>
        <Box
          sx={{
            mt: 2,
            p: 2.5,
            borderRadius: "16px",
            background: isDarkMode
              ? "rgba(33, 150, 243, 0.1)"
              : "rgba(33, 150, 243, 0.05)",
            border: `1px solid ${
              isDarkMode ? "rgba(33, 150, 243, 0.3)" : "rgba(33, 150, 243, 0.2)"
            }`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2.5,
              textAlign: "center",
              color: isDarkMode ? BLUE.light : BLUE.dark,
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Enter the 6-digit code sent to your email
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              mb: 2.5,
              animation: shakeOtp ? `${shake} 0.5s ease-in-out` : "none",
            }}
          >
            {otpValues.map((value, index) => (
              <Zoom
                key={index}
                in={showOtpInput}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <TextField
                  inputRef={(el) => (otpRefs.current[index] = el)}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      padding: "14px",
                    },
                  }}
                  sx={{
                    width: "50px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "white",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: `0 4px 12px ${
                          isDarkMode
                            ? "rgba(33, 150, 243, 0.3)"
                            : "rgba(33, 150, 243, 0.2)"
                        }`,
                      },
                      "&.Mui-focused": {
                        transform: "scale(1.05)",
                        boxShadow: `0 4px 16px ${
                          isDarkMode
                            ? "rgba(33, 150, 243, 0.4)"
                            : "rgba(33, 150, 243, 0.3)"
                        }`,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode ? BLUE.light : BLUE.main,
                          borderWidth: "2px",
                        },
                      },
                    },
                  }}
                  size="small"
                />
              </Zoom>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => handleVerifyOtp()}
              disabled={otpValues.some((val) => val === "") || isVerifyingOtp}
              startIcon={isVerifyingOtp ? <CircularProgress size={16} /> : null}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1,
                background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
                fontWeight: 600,
                "&:hover": {
                  background: isDarkMode ? BLUE.gradient : BLUE.gradientDark,
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                },
                "&.Mui-disabled": {
                  background: isDarkMode
                    ? "rgba(25, 118, 210, 0.3)"
                    : "rgba(33, 150, 243, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </Button>

            {resendTimer > 0 ? (
              <Typography
                variant="caption"
                sx={{
                  color: isDarkMode ? BLUE.light : BLUE.dark,
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              >
                Resend in {formatTimer(resendTimer)}
              </Typography>
            ) : canResend ? (
              <Button
                variant="text"
                size="small"
                onClick={handleResendOtp}
                disabled={isVerifyingEmail}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  color: isDarkMode ? BLUE.light : BLUE.main,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: isDarkMode
                      ? "rgba(33, 150, 243, 0.1)"
                      : "rgba(33, 150, 243, 0.05)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {isVerifyingEmail ? "Sending..." : "Resend OTP"}
              </Button>
            ) : null}
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

export default OTPVerification;
