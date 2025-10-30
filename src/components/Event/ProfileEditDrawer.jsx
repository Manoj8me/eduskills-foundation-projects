import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Container,
  IconButton,
  Drawer,
  TextField,
  LinearProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  Share,
  Visibility,
  Edit,
  ArrowBack,
  Settings,
  AccountCircle,
  Description,
  Person,
  Work,
  School,
  BusinessCenter,
  EmojiEvents,
  PersonalVideo,
  ShareOutlined,
  Business,
  Code,
  CheckCircle,
  RadioButtonUnchecked,
  Male,
  Female,
  Transgender,
  Groups,
  PersonAdd,
  Psychology,
  Event,
} from "@mui/icons-material";
import BasicDetailsComponent from "./BasicDetailsComponent";



// Main Profile Component
export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Suryadutta",
    lastName: "Dash",
    username: "codinsur99386",
    email: "codingsurya335@gmail.com",
    mobile: "7978627916",
    gender: "Male",
    userType: "Professional",
    purpose: "To find a Job",
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const sidebarItems = [
    {
      icon: <AccountCircle />,
      label: "Basic Details",
      required: true,
      active: true,
      completed: false,
    },
    {
      icon: <Description />,
      label: "Resume",
      required: false,
      completed: false,
    },
    {
      icon: <Person />,
      label: "About",
      required: true,
      completed: false,
    },
    {
      icon: <Work />,
      label: "Skills",
      required: true,
      completed: true,
    },
    {
      icon: <School />,
      label: "Education",
      required: false,
      completed: false,
    },
    {
      icon: <BusinessCenter />,
      label: "Work Experience",
      required: true,
      completed: false,
    },
    {
      icon: <EmojiEvents />,
      label: "Accomplishments",
      required: false,
      completed: false,
    },
    {
      icon: <PersonalVideo />,
      label: "Personal Details",
      required: false,
      completed: false,
    },
    {
      icon: <ShareOutlined />,
      label: "Social Links",
      required: false,
      completed: false,
    },
  ];

  const drawerWidth = isMobile ? "100vw" : "55vw";

  return (
    <Box>
      {/* Main Profile Page */}
      <Box
        sx={{
          bgcolor: "#1565C0",
          minHeight: "280px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            bgcolor: "#FF6F00",
            opacity: 0.1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 40,
            right: 80,
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 30,
            left: 40,
            width: 60,
            height: 60,
            borderRadius: "8px",
            bgcolor: "#FF6F00",
            opacity: 0.2,
            transform: "rotate(45deg)",
          }}
        />

        {/* Top Right Action Button */}
        <Box sx={{ position: "absolute", top: 20, right: 20 }}>
          <IconButton
            sx={{
              bgcolor: "rgba(255, 111, 0, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 111, 0, 0.3)",
              },
            }}
          >
            <Edit />
          </IconButton>
        </Box>

        <Container maxWidth="lg" sx={{ pt: 4, pb: 2 }}>
          {/* Profile Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              position: "relative",
              zIndex: 2,
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 0 },
            }}
          >
            {/* Profile Avatar with Progress Ring */}
            <Box
              sx={{
                position: "relative",
                mr: { xs: 0, md: 3 },
                alignSelf: { xs: "center", md: "flex-end" },
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(#FF6F00 0deg 281deg, rgba(255,255,255,0.3) 281deg 360deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: "4px",
                }}
              >
                <Avatar
                  sx={{
                    width: 112,
                    height: 112,
                    bgcolor: "#1565C0",
                    border: "4px solid white",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                  }}
                >
                  S
                </Avatar>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  bottom: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontWeight: 600,
                  bgcolor: "#FF6F00",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                78%
              </Typography>
            </Box>

            {/* Profile Info */}
            <Box
              sx={{
                color: "white",
                pb: 2,
                textAlign: { xs: "center", md: "left" },
                flex: 1,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Suryadutta Dash
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                @codinsur99386
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  <Business sx={{ fontSize: 16, color: "#FFE0B2" }} />
                  <Typography variant="body2">
                    Utkal university Bhubaneswar
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(255, 111, 0, 0.2)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  <Code sx={{ fontSize: 16, color: "#FFE0B2" }} />
                  <Typography variant="body2">Developer</Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                ml: { xs: 0, md: "auto" },
                display: "flex",
                gap: 2,
                pb: 2,
                justifyContent: "center",
              }}
            >
              <IconButton
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <Share />
              </IconButton>
              <IconButton
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <Visibility />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setDrawerOpen(true)}
                sx={{
                  bgcolor: "white",
                  color: "#1565C0",
                  "&:hover": { bgcolor: "#f5f5f5" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Compact Edit Profile Drawer - 55% Width */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            maxWidth: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", height: "100vh" }}>
          {/* Compact Left Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: 280 },
              bgcolor: "#FAFAFA",
              borderRight: "2px solid #E3F2FD",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: "1px solid #E3F2FD" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    mr: 1,
                    bgcolor: "#E3F2FD",
                    color: "#1565C0",
                    "&:hover": { bgcolor: "#BBDEFB" },
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1565C0" }}
                >
                  Edit Profile
                </Typography>
              </Box>

              {/* Compact Resume Banner */}
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#1565C0",
                  color: "white",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      bgcolor: "#FF6F00",
                    }}
                  >
                    <Description sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      Create Resume
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.9, fontSize: "0.7rem" }}
                    >
                      Build your CV
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Compact Profile Enhancement */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1, color: "#1565C0" }}
                >
                  Profile Strength
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    sx={{
                      flexGrow: 1,
                      mr: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#E3F2FD",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#FF6F00",
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#1565C0",
                      minWidth: 35,
                    }}
                  >
                    78%
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem" }}
                >
                  22% more to complete
                </Typography>
              </Box>
            </Box>

            {/* Compact Navigation List */}
            <Box sx={{ flexGrow: 1, py: 1 }}>
              <List sx={{ py: 0 }}>
                {sidebarItems.map((item, index) => (
                  <ListItemButton
                    key={index}
                    selected={item.active}
                    sx={{
                      py: 1,
                      px: 2,
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 1,
                      minHeight: 48,
                      "&:hover": {
                        bgcolor: "#F8F9FA",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#E3F2FD",
                        borderLeft: "3px solid #1565C0",
                        "& .MuiTypography-root": {
                          color: "#1565C0",
                          fontWeight: 600,
                        },
                        "& .MuiListItemIcon-root": {
                          color: "#1565C0",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: item.active ? "#1565C0" : "#666",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: {
                          fontWeight: item.active ? 600 : 500,
                          fontSize: "0.85rem",
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.required && (
                        <Chip
                          label="Req"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            bgcolor: "#FF6F00",
                            color: "white",
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      )}
                      {item.completed ? (
                        <CheckCircle sx={{ fontSize: 16, color: "#4CAF50" }} />
                      ) : (
                        <RadioButtonUnchecked
                          sx={{ fontSize: 16, color: "#CBD5E1" }}
                        />
                      )}
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>

          {/* Main Content Area - Basic Details Component */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1 }}>
              <BasicDetailsComponent
                formData={formData}
                handleInputChange={handleInputChange}
                onClose={() => setDrawerOpen(false)}
              />
            </Box>
          )}

          {/* Mobile Content */}
          {isMobile && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "white",
                zIndex: 10,
                overflow: "auto",
              }}
            >
              <BasicDetailsComponent
                formData={formData}
                handleInputChange={handleInputChange}
                onClose={() => setDrawerOpen(false)}
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
