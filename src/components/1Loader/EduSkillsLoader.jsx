import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Card,
  CardContent,
  Alert,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Business,
  Work,
  LocationOn,
  Schedule,
  School,
  AdminPanelSettings,
} from "@mui/icons-material";

// You'll need to install these packages:
// npm install @marsidev/react-turnstile react-toastify
import { Turnstile } from "@marsidev/react-turnstile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoimage from "../../assets/imgs/logo-dark.svg";

const TURNSTILE_SITE_KEY = "0x4AAAAAAAzPpbGutwXyyFrF";
const API_URL = "YOUR_API_URL"; // Replace with your actual API URL

export default function JobStopMUIComplete() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userType, setUserType] = useState(0); // 0 for student, 1 for admin
  const [timer, setTimer] = useState(900);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errors, setErrors] = useState({
    email: "",
    turnstile: "",
    otp: "",
  });

  // Carousel data
  const carouselSlides = [
    {
      title: "Find Your Dream Job",
      subtitle: "Thousands of opportunities waiting",
      icon: <Work sx={{ fontSize: 100, color: "rgba(0,0,0,0.3)" }} />,
      cards: [
        { label: "Remote", color: "#e91e63" },
        { label: "Full-Time", color: "#2196f3" },
        { label: "Flexible", color: "#4caf50" },
        { label: "Hybrid", color: "#ff9800" },
      ],
    },
    {
      title: "Global Opportunities",
      subtitle: "Work from anywhere in the world",
      icon: <LocationOn sx={{ fontSize: 100, color: "rgba(0,0,0,0.3)" }} />,
      cards: [
        { label: "USA", color: "#e91e63" },
        { label: "Europe", color: "#2196f3" },
        { label: "Asia", color: "#4caf50" },
        { label: "Remote", color: "#ff9800" },
      ],
    },
    {
      title: "Flexible Schedule",
      subtitle: "Balance work and life perfectly",
      icon: <Schedule sx={{ fontSize: 100, color: "rgba(0,0,0,0.3)" }} />,
      cards: [
        { label: "Part-Time", color: "#e91e63" },
        { label: "Contract", color: "#2196f3" },
        { label: "Freelance", color: "#4caf50" },
        { label: "Intern", color: "#ff9800" },
      ],
    },
    {
      title: "Top Companies",
      subtitle: "Join industry leaders and startups",
      icon: <Business sx={{ fontSize: 100, color: "rgba(0,0,0,0.3)" }} />,
      cards: [
        { label: "Tech", color: "#e91e63" },
        { label: "Finance", color: "#2196f3" },
        { label: "Healthcare", color: "#4caf50" },
        { label: "Startup", color: "#ff9800" },
      ],
    },
  ];

  const emailRegex = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const parseHtmlToText = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Timer for OTP expiry
  useEffect(() => {
    let timerInterval;
    if (isOtpSent && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(timerInterval);
      setIsOtpExpired(true);
    }

    return () => clearInterval(timerInterval);
  }, [isOtpSent, timer]);

  const handleTabChange = (event, newValue) => {
    setUserType(newValue);
    setErrors({ email: "", turnstile: "", otp: "" });
    setIsOtpSent(false);
    setOtp("");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!turnstileToken) {
      newErrors.turnstile = "Please complete the verification";
    }

    if (isOtpSent && !otp) {
      newErrors.otp = "OTP is required";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateFields()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/token/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          turnstile_response: turnstileToken,
          email,
          user_type: userType,
        }),
      });

      const data = await response.json();
      const parsedDetail = parseHtmlToText(data.detail);
      toast.info(parsedDetail, { position: "top-center" });

      if (parsedDetail === "OTP send successfully.") {
        setIsOtpSent(true);
        setTimer(900);
        setIsOtpExpired(false);
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateFields()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/token/verify/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, user_type: userType }),
      });

      const data = await response.json();
      const parsedDetail = parseHtmlToText(data.detail);
      toast.success("OTP Verified Successfully");

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        toast.error("OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setIsOtpExpired(false);
    setTimer(900);
    handleSendOtp();
  };

  const isFormValid =
    email &&
    !errors.email &&
    turnstileToken &&
    (isOtpSent ? otp && !errors.otp : true);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          bgcolor: "#f1f5f9",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Combined Card Container */}
        <Box
          sx={{
            display: "flex",
            maxWidth: "900px",
            width: "100%",
            boxShadow:
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            borderRadius: "24px",
            overflow: "hidden",
            minHeight: "650px",
          }}
        >
          {/* Left Side - Orange Section with Carousel */}
          <Box
            sx={{
              flex: 1,
              background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
              position: "relative",
              overflow: "hidden",
              display: { xs: "none", lg: "flex" },
              flexDirection: "column",
              p: 4,
              minHeight: "650px",
            }}
          >
            {/* Logo */}
            <Box sx={{ mb: 4 }}>
              <Box
                component="img"
                src={logoimage}
                alt="Logo"
                sx={{
                  height: 40,
                  width: "auto",
                  maxWidth: 200,
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  // Fallback to text if image fails to load
                  const fallback = document.createElement("div");
                  fallback.style.cssText = `
                    background: #1976d2;
                    color: white;
                    border-radius: 20px;
                    text-transform: none;
                    font-weight: bold;
                    padding: 8px 24px;
                    display: inline-block;
                    font-size: 16px;
                  `;
                  fallback.textContent = "JobStop";
                  e.target.parentNode.appendChild(fallback);
                }}
              />
            </Box>

            {/* Carousel Container */}
            <Box
              sx={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Slides Container */}
              <Box
                sx={{
                  display: "flex",
                  width: `${carouselSlides.length * 100}%`,
                  height: "100%",
                  transform: `translateX(-${
                    currentSlide * (100 / carouselSlides.length)
                  }%)`,
                  transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {carouselSlides.map((slide, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: `${100 / carouselSlides.length}%`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    {/* Main Content */}
                    <Box sx={{ position: "relative", textAlign: "center" }}>
                      {/* Icon/Figure */}
                      <Box
                        sx={{
                          width: 180,
                          height: 240,
                          bgcolor: "rgba(0,0,0,0.1)",
                          borderRadius: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 4,
                          mx: "auto",
                        }}
                      >
                        {slide.icon}
                      </Box>

                      {/* Floating Cards */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -20,
                          right: -60,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {slide.cards.map((item, cardIndex) => (
                          <Card
                            key={cardIndex}
                            sx={{
                              width: 100,
                              boxShadow: 3,
                              borderRadius: "12px",
                              transform: `translateY(${cardIndex * 5}px)`,
                              animation: `float 3s ease-in-out infinite ${
                                cardIndex * 0.5
                              }s`,
                              "@keyframes float": {
                                "0%, 100%": {
                                  transform: `translateY(${cardIndex * 5}px)`,
                                },
                                "50%": {
                                  transform: `translateY(${
                                    cardIndex * 5 - 10
                                  }px)`,
                                },
                              },
                            }}
                          >
                            <CardContent
                              sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    bgcolor: item.color,
                                    borderRadius: "6px",
                                    opacity: 0.8,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontSize="0.7rem"
                                >
                                  {item.label}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>

                      {/* Bottom Info Card */}
                      <Card
                        sx={{
                          position: "absolute",
                          bottom: -40,
                          left: -20,
                          width: 220,
                          boxShadow: 4,
                          borderRadius: "16px",
                          transform: "scale(1)",
                          animation: "pulse 2s ease-in-out infinite",
                          "@keyframes pulse": {
                            "0%, 100%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.05)" },
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {slide.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {slide.subtitle}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Side - Login Form Card */}
          <Box
            sx={{
              width: { xs: "100%", lg: "450px" },
              bgcolor: "white",
              minHeight: "650px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, flex: 1 }}>
              {/* Header */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  }}
                >
                  Welcome Back
                </Typography>

                {/* Compact Material-UI Tabs */}
                <Box
                  sx={{
                    bgcolor: "#f8fafc",
                    borderRadius: "16px",
                    p: 0.25,
                    mb: 3,
                    width: "fit-content",
                    mx: "auto",
                  }}
                >
                  <Tabs
                    value={userType}
                    onChange={handleTabChange}
                    sx={{
                      minHeight: "auto",
                      "& .MuiTabs-indicator": {
                        display: "none",
                      },
                      "& .MuiTab-root": {
                        minHeight: "32px",
                        height: "32px",
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        color: "#64748b",
                        minWidth: "auto",
                        padding: "4px 12px",
                        "&.Mui-selected": {
                          bgcolor: "white",
                          color: "#1976d2",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: "16px",
                        },
                      },
                      "& .MuiTabs-flexContainer": {
                        gap: "4px",
                      },
                    }}
                  >
                    <Tab
                      icon={<Person />}
                      iconPosition="start"
                      label="Student"
                      value={0}
                    />
                    <Tab
                      icon={<AdminPanelSettings />}
                      iconPosition="start"
                      label="Institution"
                      value={1}
                    />
                  </Tabs>
                </Box>
              </Box>

              {/* Divider */}
              <Box sx={{ textAlign: "center", my: 3 }}>
                <Divider>
                  <Typography
                    color="text.secondary"
                    sx={{ px: 2, fontSize: "0.875rem" }}
                  >
                    Login with OTP
                  </Typography>
                </Divider>
              </Box>

              {/* Login Form */}
              <Box>
                {/* Email Field - Always visible */}
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isOtpSent}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      backgroundColor: "#f8fafc",
                      "& fieldset": {
                        borderColor: "#e2e8f0",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 500,
                    },
                  }}
                  variant="outlined"
                  size="medium"
                />

                {/* Turnstile Captcha - Show when email is filled and OTP not sent */}
                {email && !isOtpSent && (
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={setTurnstileToken}
                      onError={() => {
                        setErrors((prev) => ({
                          ...prev,
                          turnstile: "Verification failed. Please try again.",
                        }));
                        setTurnstileToken("");
                      }}
                      onExpire={() => {
                        setErrors((prev) => ({
                          ...prev,
                          turnstile:
                            "Verification expired. Please verify again.",
                        }));
                        setTurnstileToken("");
                      }}
                      options={{
                        theme: "light",
                        size: "normal",
                        refreshExpired: "auto",
                      }}
                    />
                  </Box>
                )}
                {errors.turnstile && (
                  <Typography
                    color="error"
                    variant="caption"
                    display="block"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    {errors.turnstile}
                  </Typography>
                )}

                {/* Send OTP Button */}
                {email && !isOtpSent && (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSendOtp}
                    disabled={
                      !email || !!errors.email || !turnstileToken || isLoading
                    }
                    sx={{
                      mb: 3,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: "16px",
                      textTransform: "none",
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                      },
                      "&:disabled": {
                        background: "#e2e8f0",
                        color: "#94a3b8",
                      },
                    }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Verifying...
                      </Box>
                    ) : (
                      "Verify & Send OTP"
                    )}
                  </Button>
                )}

                {/* OTP Verification */}
                {isOtpSent && (
                  <>
                    <TextField
                      fullWidth
                      type="text"
                      label="Enter OTP"
                      value={otp}
                      onChange={handleOtpChange}
                      error={!!errors.otp}
                      helperText={errors.otp}
                      inputProps={{ maxLength: 6 }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "16px",
                          backgroundColor: "#f8fafc",
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#64748b",
                          fontWeight: 500,
                        },
                      }}
                    />

                    {!isOtpExpired ? (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, textAlign: "center" }}
                        >
                          Resend OTP in {Math.floor(timer / 60)}:
                          {(timer % 60).toString().padStart(2, "0")}
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={handleVerifyOtp}
                          disabled={!isFormValid || isLoading}
                          sx={{
                            mb: 3,
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "16px",
                            textTransform: "none",
                            background:
                              "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                            },
                            "&:disabled": {
                              background: "#e2e8f0",
                              color: "#94a3b8",
                            },
                          }}
                        >
                          {isLoading ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Verifying OTP...
                            </Box>
                          ) : (
                            "Verify OTP"
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Alert severity="error" sx={{ mb: 2 }}>
                          OTP has expired
                        </Alert>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          sx={{
                            mb: 3,
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "16px",
                            textTransform: "none",
                            background:
                              "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                            },
                            "&:disabled": {
                              background: "#e2e8f0",
                              color: "#94a3b8",
                            },
                          }}
                        >
                          {isLoading ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Resending OTP...
                            </Box>
                          ) : (
                            "Resend OTP"
                          )}
                        </Button>
                      </>
                    )}
                  </>
                )}

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Don't have an account?{" "}
                    <Box
                      component="a"
                      href="https://eduskillsfoundation.org/internshipreg/"
                      color="primary"
                      fontWeight="600"
                      sx={{
                        textDecoration: "none",
                        color: "#1976d2",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Create Account
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer position="top-center" />
    </>
  );
}
