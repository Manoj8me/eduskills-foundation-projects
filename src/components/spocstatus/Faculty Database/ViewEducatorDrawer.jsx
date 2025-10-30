import React from "react";
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  Divider,
  Chip,
  Stack,
  Grid,
  useTheme,
  Paper,
  Avatar,
} from "@mui/material";
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

// Enhanced Material UI Blue colors with gradient options
const BLUE = {
  solight: "#EEF7FE",
  light: "#BBDEFB",
  main: "#2196F3",
  dark: "#1976D2",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
};

const ViewEducatorDrawer = ({ open, onClose, educatorData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Function to determine avatar background color
  const getAvatarColor = (initial) => {
    const colors = {
      A: "#FFF3E0", // orange light
      D: "#E3F2FD", // blue light
      N: "#E91E63", // pink
      R: "#009688", // teal
      H: "#9C27B0", // purple
      K: "#FF5722", // deep orange
      J: "#4CAF50", // green
    };
    return colors[initial] || BLUE.light; // default blue light
  };

  // Function to determine text color in avatar
  const getTextColor = (initial) => {
    const colors = {
      N: "#FFFFFF", // white
      R: "#FFFFFF", // white
      H: "#FFFFFF", // white
      K: "#FFFFFF", // white
    };
    return colors[initial] || "#212121"; // default dark
  };

  // Get role display name
  const getRoleDisplayName = (roleName) => {
    const roleMap = {
      leaders: "Leader",
      dspoc: "DSPOC",
      Spoc: "SPOC",
      tpo: "TPO",
      Educator: "Faculty",
    };
    return roleMap[roleName] || roleName;
  };

  // If no educator data, don't render content
  if (!educatorData) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 380 },
          backgroundColor: theme.palette.background.paper,
          borderTopLeftRadius: { xs: 0, sm: "12px" },
          borderBottomLeftRadius: { xs: 0, sm: "12px" },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
            color: "white",
            p: 1.5,
            borderRadius: "10px",
            boxShadow: isDarkMode
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 4px 12px rgba(33, 150, 243, 0.2)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Educator Details
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.25)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Educator Profile Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              bgcolor: getAvatarColor(educatorData.initial),
              color: getTextColor(educatorData.initial),
              width: 80,
              height: 80,
              fontSize: "2rem",
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              mb: 2,
            }}
          >
            {educatorData.initial}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {educatorData.name}
          </Typography>

          {/* Type Badge */}
          {educatorData.type && (
            <Chip
              size="small"
              label={getRoleDisplayName(educatorData.type)}
              sx={{
                bgcolor: isDarkMode ? "rgba(33, 150, 243, 0.2)" : BLUE.solight,
                color: isDarkMode ? BLUE.light : BLUE.dark,
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 24,
                borderRadius: "12px",
                "& .MuiChip-label": {
                  px: 1,
                },
                mb: 1,
              }}
              icon={
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: isDarkMode ? BLUE.light : BLUE.dark,
                    borderRadius: "50%",
                    ml: 1,
                  }}
                />
              }
            />
          )}

          {/* Status Chip */}
          <Chip
            size="small"
            label={educatorData.active ? "Active" : "Inactive"}
            sx={{
              bgcolor: educatorData.active
                ? isDarkMode
                  ? "rgba(46, 125, 50, 0.2)"
                  : "#E8F5E9"
                : isDarkMode
                ? "rgba(211, 47, 47, 0.2)"
                : "#FFEBEE",
              color: educatorData.active
                ? isDarkMode
                  ? "#81c784"
                  : "#2E7D32"
                : isDarkMode
                ? "#e57373"
                : "#D32F2F",
              fontWeight: 500,
              fontSize: "0.75rem",
              height: 24,
              borderRadius: "12px",
              "& .MuiChip-label": {
                px: 1,
              },
            }}
            icon={
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: educatorData.active
                    ? isDarkMode
                      ? "#81c784"
                      : "#2E7D32"
                    : isDarkMode
                    ? "#e57373"
                    : "#D32F2F",
                  borderRadius: "50%",
                  ml: 1,
                }}
              />
            }
          />
        </Box>

        <Divider
          sx={{
            mb: 3,
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(0, 0, 0, 0.12)",
          }}
        />

        {/* Contact Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: isDarkMode ? BLUE.light : BLUE.dark,
            }}
          >
            Contact Information
          </Typography>

          <Grid container spacing={1.5}>
            {/* Email */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                  border: "1px solid",
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.08)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? BLUE.light : BLUE.main }}
                  />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {educatorData.email}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Mobile Number */}
            {educatorData.mobile && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PhoneIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? BLUE.light : BLUE.main }}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Mobile Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {educatorData.mobile}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Designation Field */}
            {educatorData.designation && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <WorkIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? BLUE.light : BLUE.main }}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Designation
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {educatorData.designation}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Institute ID Field */}
            {educatorData.institute_id && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <BadgeIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? BLUE.light : BLUE.main }}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Institute ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {educatorData.institute_id}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Domain Field (if available) */}
            {educatorData.domain && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <SchoolIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? BLUE.light : BLUE.main }}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Domain
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {educatorData.domain}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Branches Section */}
        {educatorData.branch && educatorData.branch.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: isDarkMode ? BLUE.light : BLUE.dark,
              }}
            >
              Branches
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
                border: "1px solid",
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.08)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <SchoolIcon
                  fontSize="small"
                  sx={{
                    color: isDarkMode ? BLUE.light : BLUE.main,
                    mt: 0.5,
                  }}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {educatorData.branch.map((branch, index) => (
                    <Chip
                      key={index}
                      size="small"
                      label={branch}
                      sx={{
                        bgcolor: isDarkMode
                          ? "rgba(33, 150, 243, 0.2)"
                          : BLUE.solight,
                        color: isDarkMode ? BLUE.light : BLUE.dark,
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: 24,
                        borderRadius: "12px",
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Stack>
            </Paper>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ViewEducatorDrawer;
