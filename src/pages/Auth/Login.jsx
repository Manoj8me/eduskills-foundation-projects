import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/imgs/logo-dark.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setTokens } from "../../store/Slices/auth/authSlice";
import { AuthService } from "../../services/dataService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setUserRole } from "../../store/Slices/auth/authoriseSlice";
import { Helmet } from "react-helmet-async";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  maxWidth: "1600px",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "0.25px",
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});

function Copyright() {
  return (
    <Typography variant="body2" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        sx={{ textDecoration: "none" }}
        href="https://eduskillsfoundation.org/"
      >
        EduSkills Foundation
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpEmailError, setOtpEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState(""); // Add missing state variable
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(true);
  const [showOTPEmail, setShowOTPEmail] = useState(true);
  const [showInputOtp, setShowInputOtp] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = createTheme();
  // const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    let countdownInterval;

    if (isCountdownActive && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isCountdownActive, countdown]);

  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  function handleErrorMessage(message) {
    toast.error(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  const handleOTP = () => {
    setShowOTPEmail(true);
    setShowOTP(true);
    if (countdown < 300) {
      setShowInputOtp(true);
    }
  };

  // Add handleEmailSubmit function.................................................

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!validateOtpEmail()) {
      return;
    }
    setLoading(true);
    try {
      const response = await AuthService.sendOtp(otpEmail);

      if (response && response.status === 200) {
        handleSuccessMessage("OTP sent successfully! Please check your email.");
        setShowInputOtp(true);
        setIsCountdownActive(true); // Start the countdown
        setCountdown(300);
        // setShowOTPEmail(false);
      }
    } catch (error) {
      handleErrorMessage(error.response.data.detail || "Failed to send OTP.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add handleOTPSubmit function..................................................

  const handleOTPSubmit = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }
    setLoading(true);
    try {
      const response = await AuthService.verifyOtp(otpEmail, otp);
      if (response && response.status === 200) {
        setIsCountdownActive(false);
        const { access_token, refresh_token } = response.data;
        dispatch(
          setTokens({ accessToken: access_token, refreshToken: refresh_token })
        );

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("userName", otpEmail);
        // Fetch user roles after successful login
        const rolesResponse = await AuthService.roles();
        const fetchedRoles = rolesResponse.data.roles;
        const activeRole = fetchedRoles.find((role) => role.status === true);

        if (activeRole) {
          const activeRoleNameModified = activeRole.role_name
            .toLowerCase() // Convert to lowercase
            .replace(/ /g, "_"); // Replace spaces with underscores
          localStorage.setItem("Authorise", activeRoleNameModified);
          dispatch(setUserRole(activeRoleNameModified));
          handleSuccessMessage("Login successful!");
          navigate("/dashboard");
          setShowInputOtp(false);
        } else {
          handleErrorMessage("No active role found");
        }
      }
    } catch (error) {
      setOtpError("Invalid OTP");
      handleErrorMessage(error.response.data.detail || "Invalid OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackSignin = () => {
    setShowOTP(false);
    setShowOTPEmail(false);
    setShowInputOtp(false);
  };

  // Add handleSubmit function..................................................

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const response = await AuthService.login(email, password);

      if (response && response.status === 200) {
        const { access_token, refresh_token } = response.data;
        dispatch(
          setTokens({ accessToken: access_token, refreshToken: refresh_token })
        );

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("userName", email);
        // Fetch user roles after successful login
        const rolesResponse = await AuthService.roles();

        const fetchedRoles = rolesResponse.data.roles;
        const activeRole = fetchedRoles.find((role) => role.status === true);

        if (activeRole) {
          const activeRoleNameModified = activeRole.role_name
            .toLowerCase() // Convert to lowercase
            .replace(/ /g, "_"); // Replace spaces with underscores
          localStorage.setItem("Authorise", activeRoleNameModified);
          dispatch(setUserRole(activeRoleNameModified));
          handleSuccessMessage("Login successful");
          navigate("/dashboard");
        } else {
          // Handle the case when no active role is found
          handleErrorMessage("No active role found");
        }
      } else {
        handleErrorMessage("Login failed");
      }
    } catch (error) {
      if (error.response) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 422
        ) {
          handleErrorMessage("Incorrect email or password. Please try again.");
        } else if (error?.response?.status === 404) {
          handleErrorMessage("Login failed. Please try again later.");
          console.error("URL Not Found");
        } else {
          handleErrorMessage("Login failed. Please try again.");
        }
      } else {
        handleErrorMessage("Something went wrong please try again later");
      }
    } finally {
      setLoading(false);
    }
  };
  //..................................................................................

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const validateOtpEmail = () => {
    let valid = true;

    if (!otpEmail) {
      setOtpEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(otpEmail)) {
      setOtpEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setOtpEmailError("");
    }

    return valid;
  };

  const handleOtpEmailChage = (event) => {
    setOtpEmail(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleOTPChange = (event) => {
    const newOTP = event.target.value;

    if (/^\d*$/.test(newOTP)) {
      if (newOTP.length <= 6) {
        setOtp(newOTP);
        setOtpError("");
      } else {
        setOtpError("OTP must be 6 digits");
      }
    } else {
      setOtpError("OTP must contain only numeric digits");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title> Login | EduSkills </title>
      </Helmet>
      <CssBaseline />

      <Paper
        style={{
          minHeight: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "#DBF3FA",
          }}
        >
          <StyledBox>
            <Container>
              <Box
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    [theme.breakpoints.down("md")]: {
                      display: "flex",
                      justifyContent: "center",
                      mb: 3,
                    },
                  }}
                >
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{
                      maxWidth: "250px",
                      padding: "5px 10px",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    marginRight: 6,
                    marginTop: 8,
                    maxWidth: "800px",
                    [theme.breakpoints.down("md")]: { display: "none" },
                  }}
                >
                  <Typography variant="h2" sx={{ fontSize: "50px" }}>
                    <strong>Connecting</strong> Skilled Talent with Industry
                  </Typography>
                </Box>

                <Box
                  sx={{
                    marginTop: 5,
                    maxWidth: "500px",
                    [theme.breakpoints.down("md")]: { display: "none" },
                  }}
                >
                  {/* <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 100, fontSize: "20px" , color:'transparent'}}
                  >
                    Skill Exchange is a one-of-a-kind platform that provides
                    talented and skilled new graduates smooth transitioning from
                    college to the professional world!
                  </Typography> */}
                </Box>
              </Box>
            </Container>
            <Container component="main" maxWidth="xs">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px",
                  border: "1px solid",
                  borderRadius: "5px",
                  mt: 2,
                  [theme.breakpoints.up("md")]: { mr: 3 },
                }}
              >
                <Grid container>
                  <Grid item xs>
                    <Typography variant="h5" sx={{ fontWeight: 200 }}>
                      Hello!
                    </Typography>
                    <Typography variant="p" sx={{ fontWeight: 600 }}>
                      Welcome to Admin/Spoc/Educator Login
                    </Typography>
                  </Grid>
                </Grid>

                {!showOTP && (
                  <>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError !== ""}
                        helperText={emailError}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={passwordError !== ""}
                        helperText={passwordError}
                      />

                      <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Sign In"}
                      </Button>
                      <Grid container>
                        <Grid item xs>
                          <Box
                            variant="body2"
                            onClick={handleOTP}
                            style={{
                              color: "#107ACB",
                              cursor: "pointer",
                              marginLeft: "0.5rem",
                            }}
                          >
                            Sign in with{" "}
                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                              OTP
                            </span>{" "}
                            ?
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}

                {showOTPEmail && (
                  <Box
                    component="form"
                    onSubmit={
                      showInputOtp ? handleOTPSubmit : handleEmailSubmit
                    }
                    noValidate
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      disabled={showInputOtp}
                      value={otpEmail}
                      onChange={handleOtpEmailChage}
                      error={otpEmailError !== ""}
                      helperText={otpEmailError}
                    />
                    {showInputOtp && (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="otp"
                        label="OTP"
                        name="otp"
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        autoComplete="current-password"
                        value={otp}
                        onChange={handleOTPChange}
                        error={otpError !== ""}
                        helperText={otpError}
                      />
                    )}
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={loading}
                      type="submit"
                    >
                      {loading
                        ? "Loading..."
                        : showInputOtp
                        ? "Submit OTP"
                        : "Send OTP"}
                    </Button>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* <Box
                        variant="body2"
                        onClick={handleBackSignin}
                        sx={{
                          color: "#107ACB",
                          cursor: "pointer",
                          marginLeft: "0.5rem",
                        }}
                      >
                        Back to Signin?
                      </Box> */}

                      {showInputOtp && (
                        <Box
                          variant="body2"
                          onClick={
                            countdown === 0 ? handleEmailSubmit : () => {}
                          }
                          sx={{
                            color: "#107ACB",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1, // Adds some space between "Resend in" and timer
                          }}
                        >
                          {countdown === 0 ? (
                            "Resend"
                          ) : countdown !== 0 ? (
                            <>
                              <span>Resend in</span>
                              <span>{`${Math.floor(countdown / 60)}:${(
                                countdown % 60
                              )
                                .toString()
                                .padStart(2, "0")}`}</span>
                            </>
                          ) : null}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Container>
          </StyledBox>
          <Box sx={{ width: "100vw", mb: 2, mt: 5 }}>
            <Divider />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Copyright />
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

export default Login;
