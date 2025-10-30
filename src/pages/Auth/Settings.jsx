import React, { useState } from "react";
import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Container,
  Box,
  Grid,
  useTheme,
  Divider,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { tokens } from "../../theme";
import profile from "../../assets/imgs/profile.png";
import { Icon } from "@iconify/react";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [showPassword, setShowPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleCurrentPasswordChange = (event) => {
    const newPassword = event.target.value.trim();
    setCurrentPassword(newPassword);
  };

  const handleNewPasswordChange = (event) => {
    const newPasswordValue = event.target.value.trim();
    setNewPassword(newPasswordValue);

    // Validate the new password
    const validationError = validatePassword(newPasswordValue);
    setNewPasswordError(validationError);

    // Check if the new password matches the confirm password
    if (newPasswordValue === currentPassword) {
      setNewPasswordError(
        "New password cannot be the same as the current password"
      );
    } else if (newPasswordValue === "") {
      setNewPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPasswordValue = event.target.value.trim();
    setConfirmPassword(confirmPasswordValue);

    // Check if the new password matches the confirm password
    if (newPassword !== confirmPasswordValue || "") {
      setConfirmPasswordError("New password and confirm password do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const validatePassword = (password) => {
    // Define your password validation rules
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(password);

    if (
      password.length < minLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecialCharacter
    ) {
      return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    // Password is valid
    return "";
  };

  return (
    <Container maxWidth="xl" sx={{ my: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: colors.blueAccent[300] }}
      >
        Hi, Welcome back to Settings!
      </Typography>
      <Paper sx={{ my: 2, bgcolor: colors.blueAccent[800] }}>
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ mt: 1, px: 3 }}>
              <Tabs
                orientation="horizontal"
                value={activeTab}
                onChange={handleTabChange}
              >
                <Tab
                  label="Profile"
                  sx={{
                    textTransform: "initial",
                    color: activeTab === 0 ? colors.blueAccent[300] : "inherit",
                  }}
                />
                <Tab
                  label="Password"
                  sx={{
                    textTransform: "initial",
                    color: activeTab === 1 ? colors.blueAccent[300] : "inherit",
                  }}
                />
              </Tabs>
            </Box>
          </Grid>
          {activeTab === 0 && (
            <>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ bgcolor: colors.blueAccent[800] }}>
                  <Box px={3} py={2}>
                    {/* Profile settings content */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Paper elevation={0} sx={{ p: 2, minHeight: "100%" }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            {/* <Icon icon="gg:profile" height={45} /> */}
                            <Box>
                              <Typography variant="h6">
                                Profile Settings
                              </Typography>
                              <Typography variant="caption">
                                Update your photo and personal details here.
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                              <Button
                                variant="outlined"
                                size="small"
                                color="info"
                                startIcon={
                                  <Icon icon="icon-park-twotone:edit-name" />
                                }
                                sx={{ textTransform: "initial" }}
                              >
                                Edit
                              </Button>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Paper
                            elevation={0}
                            sx={{
                              bgcolor: colors.blueAccent[900],
                              display: "flex",
                              justifyContent: "space-between",
                              py: 1,
                              px: 2,
                              my: 1,
                              alignItems: "baseline",
                            }}
                          >
                            <Typography variant="subtitle2">Name</Typography>
                            <Box display="flex" alignItems="baseline">
                              <Typography variant="h6">Kalali Das</Typography>
                            </Box>
                          </Paper>
                          <Paper
                            elevation={0}
                            sx={{
                              bgcolor: colors.blueAccent[900],
                              display: "flex",
                              justifyContent: "space-between",
                              py: 1,
                              px: 2,
                              my: 1,
                            }}
                          >
                            <Typography variant="subtitle2">Email</Typography>

                            <Typography>demo@gmail.com</Typography>
                          </Paper>
                          {/* <Divider sx={{ my: 1 }} /> */}
                          <Paper
                            elevation={0}
                            sx={{
                              bgcolor: colors.blueAccent[900],
                              display: "flex",
                              justifyContent: "space-between",
                              py: 1,
                              px: 2,
                              my: 1,
                            }}
                          >
                            <Typography variant="subtitle2">
                              Designation
                            </Typography>

                            <Typography>Spoc</Typography>
                          </Paper>
                          {/* <Divider sx={{ my: 1 }} /> */}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={0}>
                          <Box p={3}>
                            {/* Password settings content */}
                            <Typography variant="h6">Profile Photo</Typography>
                            <Typography variant="caption">
                              This will be displayed on your profile.
                            </Typography>
                            <Paper
                              elevation={0}
                              sx={{
                                bgcolor: colors.blueAccent[900],
                                mt: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                p: 2,
                                position: "relative",
                              }}
                            >
                              <img src={profile} alt="profile" height={200} />
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  bottom: 20,
                                  right: 20,
                                }}
                                color="info"
                              >
                                <Icon icon="fluent:image-add-20-filled" />
                              </IconButton>
                            </Paper>
                            {/* Add your password settings form or content here */}
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Add your profile settings form or content here */}
                  </Box>
                </Paper>
              </Grid>
            </>
          )}
          {activeTab === 1 && (
            <>
              <Grid item xs={12} sm={8}>
                <Paper elevation={0} sx={{ mx: 3, my: 2 }}>
                  <Box p={3}>
                    {/* Profile settings content */}
                    <Box display="flex" alignItems="center">
                      <Icon icon="mdi:password-reset" height={45} />

                      <Box ml={1}>
                        <Typography variant="h6">Change Password</Typography>
                        <Typography variant="caption">
                          To change your password, please fill in the fields
                          below.
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: colors.blueAccent[900],
                        display: {
                          xs: "block",
                          md: "flex",
                        },
                        justifyContent: "space-between",
                        py: 1,
                        px: 2,
                        my: 1,
                        alignItems: "baseline",
                      }}
                    >
                      <Typography variant="subtitle2">
                        Current Password
                      </Typography>
                      <Box display="flex" alignItems="baseline">
                        <TextField
                          margin="dense"
                          size="small"
                          required
                          fullWidth
                          name="currentPassword"
                          // label="Password"
                          placeholder="Current password..."
                          type={showPassword ? "text" : "password"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock />
                              </InputAdornment>
                            ),
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
                          id="currentPassword"
                          autoComplete="current-password"
                          value={currentPassword}
                          onChange={handleCurrentPasswordChange}
                          error={passwordError !== ""}
                          helperText={passwordError}
                        />
                      </Box>
                    </Paper>
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: colors.blueAccent[900],
                        display: {
                          xs: "block",
                          md: "flex",
                        },
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        py: 1,
                        px: 2,
                        my: 1,
                      }}
                    >
                      <Typography variant="subtitle2">New Password</Typography>
                      <Box display="flex" alignItems="baseline" maxWidth={250}>
                        <TextField
                          margin="dense"
                          size="small"
                          required
                          fullWidth
                          name="newPassword"
                          placeholder="New password..."
                          // label="Password"
                          type={showPassword ? "text" : "password"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock />
                              </InputAdornment>
                            ),
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
                          id="newPassword"
                          autoComplete="current-password"
                          value={newPassword}
                          onChange={handleNewPasswordChange}
                          error={newPasswordError !== ""}
                          helperText={newPasswordError}
                        />
                      </Box>
                    </Paper>
                    {/* <Divider sx={{ my: 1 }} /> */}
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: colors.blueAccent[900],
                        display: {
                          xs: "block",
                          md: "flex",
                        },
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        py: 1,
                        px: 2,
                        my: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        Confirm Password
                      </Typography>

                      <Box display="flex" alignItems="baseline">
                        <TextField
                          margin="dense"
                          size="small"
                          required
                          fullWidth
                          name="confirmPassword"
                          placeholder="Confirm password..."
                          // label="Password"
                          type={showPassword ? "text" : "password"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock />
                              </InputAdornment>
                            ),
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
                          id="confirmPassword"
                          autoComplete="current-password"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          error={confirmPasswordError !== ""}
                          helperText={confirmPasswordError}
                        />
                      </Box>
                    </Paper>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        size="medium"
                        color="info"
                        startIcon={<Icon icon="mdi:password-reset" />}
                        sx={{ textTransform: "initial" }}
                      >
                        Change Password
                      </Button>
                    </Box>
                    {/* Add your profile settings form or content here */}
                  </Box>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Settings;
