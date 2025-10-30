import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import {
  Edit,
  Male,
  Female,
  Transgender,
  School,
  Business,
  Work,
  EmojiEvents,
  PersonAdd,
  Groups,
  Psychology,
  Event,
} from "@mui/icons-material";

const BasicDetailsComponent = ({ formData, handleInputChange }) => {
  const genderOptions = [
    { value: "Male", label: "Male", icon: <Male /> },
    { value: "Female", label: "Female", icon: <Female /> },
    { value: "Other", label: "Other", icon: <Transgender /> },
  ];

  const userTypeOptions = [
    { value: "College Students", label: "College Students", icon: <School /> },
    { value: "Professional", label: "Professional", icon: <Business /> },
    { value: "School Student", label: "School Student", icon: <Groups /> },
    { value: "Fresher", label: "Fresher", icon: <PersonAdd /> },
  ];

  const purposeOptions = [
    { value: "To find a Job", label: "Find a Job", icon: <Work /> },
    {
      value: "Compete & Upskill",
      label: "Compete & Upskill",
      icon: <Psychology />,
    },
    { value: "To Host an Event", label: "Host an Event", icon: <Event /> },
    { value: "To be a Mentor", label: "Be a Mentor", icon: <EmojiEvents /> },
  ];

  return (
    <Box sx={{ height: "100vh", overflow: "auto", bgcolor: "#FAFAFA" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          borderBottom: "1px solid #E3F2FD",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#1565C0",
              mr: 2,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1565C0" }}>
            Basic Details
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Profile Avatar and Basic Info */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #E3F2FD",
            bgcolor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 3,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, #1565C0 0%, #FF6F00 100%)",
                fontSize: "2rem",
                fontWeight: 700,
                alignSelf: { xs: "center", sm: "flex-start" },
              }}
            >
              S
            </Avatar>

            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  required
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      "&.Mui-focused fieldset": {
                        borderColor: "#1565C0",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1565C0",
                    },
                  }}
                />
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      "&.Mui-focused fieldset": {
                        borderColor: "#1565C0",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1565C0",
                    },
                  }}
                />
              </Box>

              <TextField
                label="Username"
                value={formData.username}
                onChange={handleInputChange("username")}
                required
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&.Mui-focused fieldset": {
                      borderColor: "#1565C0",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#1565C0",
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Contact Information */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #E3F2FD",
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, color: "#1565C0" }}
          >
            Contact Information
          </Typography>

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
            fullWidth
            size="small"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&.Mui-focused fieldset": {
                  borderColor: "#1565C0",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1565C0",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Edit />}
                    sx={{
                      color: "#FF6F00",
                      "&:hover": {
                        bgcolor: "#FFF3E0",
                      },
                    }}
                  >
                    Update
                  </Button>
                </InputAdornment>
              ),
            }}
          />

          {/* Mobile */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <FormControl sx={{ minWidth: 80 }}>
              <Select
                value="+91"
                size="small"
                sx={{
                  borderRadius: 1,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1565C0",
                  },
                }}
              >
                <MenuItem value="+91">+91</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={formData.mobile}
              onChange={handleInputChange("mobile")}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "&.Mui-focused fieldset": {
                    borderColor: "#1565C0",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#FF6F00",
                        "&:hover": {
                          bgcolor: "#E65100",
                        },
                      }}
                    >
                      Verify
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Gender with Icons */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #E3F2FD",
            bgcolor: "white",
          }}
        >
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel
              component="legend"
              sx={{ mb: 2, fontWeight: 600, color: "#1565C0" }}
            >
              Gender *
            </FormLabel>
            <RadioGroup
              row
              value={formData.gender}
              onChange={handleInputChange("gender")}
              sx={{ gap: 1, flexWrap: "wrap" }}
            >
              {genderOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio sx={{ display: "none" }} />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {option.icon}
                      <Typography variant="body2">{option.label}</Typography>
                    </Box>
                  }
                  sx={{
                    border:
                      formData.gender === option.value
                        ? "2px solid #1565C0"
                        : "1px solid #E0E0E0",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    m: 0,
                    bgcolor:
                      formData.gender === option.value ? "#E3F2FD" : "white",
                    cursor: "pointer",
                    minWidth: 100,
                    "&:hover": {
                      borderColor: "#1565C0",
                      bgcolor: "#F8F9FA",
                    },
                    "& .MuiFormControlLabel-label": {
                      color:
                        formData.gender === option.value ? "#1565C0" : "#666",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* User Type with Icons */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #E3F2FD",
            bgcolor: "white",
          }}
        >
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel
              component="legend"
              sx={{ mb: 2, fontWeight: 600, color: "#1565C0" }}
            >
              User Type *
            </FormLabel>
            <RadioGroup
              row
              value={formData.userType}
              onChange={handleInputChange("userType")}
              sx={{ gap: 1, flexWrap: "wrap" }}
            >
              {userTypeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio sx={{ display: "none" }} />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {option.icon}
                      <Typography variant="body2">{option.label}</Typography>
                    </Box>
                  }
                  sx={{
                    border:
                      formData.userType === option.value
                        ? "2px solid #1565C0"
                        : "1px solid #E0E0E0",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    m: 0,
                    bgcolor:
                      formData.userType === option.value ? "#E3F2FD" : "white",
                    cursor: "pointer",
                    minWidth: 130,
                    "&:hover": {
                      borderColor: "#1565C0",
                      bgcolor: "#F8F9FA",
                    },
                    "& .MuiFormControlLabel-label": {
                      color:
                        formData.userType === option.value ? "#1565C0" : "#666",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* Purpose with Icons in Row */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #E3F2FD",
            bgcolor: "white",
          }}
        >
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel
              component="legend"
              sx={{ mb: 2, fontWeight: 600, color: "#1565C0" }}
            >
              Purpose *
            </FormLabel>
            <RadioGroup
              row
              value={formData.purpose}
              onChange={handleInputChange("purpose")}
              sx={{ gap: 1, flexWrap: "wrap" }}
            >
              {purposeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio sx={{ display: "none" }} />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {option.icon}
                      <Typography variant="body2">{option.label}</Typography>
                    </Box>
                  }
                  sx={{
                    border:
                      formData.purpose === option.value
                        ? "2px solid #1565C0"
                        : "1px solid #E0E0E0",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    m: 0,
                    bgcolor:
                      formData.purpose === option.value ? "#E3F2FD" : "white",
                    cursor: "pointer",
                    minWidth: 140,
                    "&:hover": {
                      borderColor: "#1565C0",
                      bgcolor: "#F8F9FA",
                    },
                    "& .MuiFormControlLabel-label": {
                      color:
                        formData.purpose === option.value ? "#1565C0" : "#666",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* Save Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            pt: 2,
            borderTop: "1px solid #E3F2FD",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              px: 3,
              py: 1,
              borderColor: "#E0E0E0",
              color: "#666",
              "&:hover": {
                borderColor: "#BDBDBD",
                bgcolor: "#F5F5F5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              bgcolor: "#1565C0",
              "&:hover": {
                bgcolor: "#0D47A1",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicDetailsComponent;
