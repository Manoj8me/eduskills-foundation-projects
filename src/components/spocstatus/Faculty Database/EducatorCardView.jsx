import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Paper,
  useTheme,
  Popper,
  Fade,
} from "@mui/material";
import {
  FileCopy as FileCopyIcon,
  Edit as EditIcon,
  MoreHoriz as MoreHorizIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

// Enhanced Material UI Blue colors with gradient options (same as in MembersList)
const BLUE = {
  solight: "#EEF7FE",
  light: "#1976D2",
  main: "#2196F3",
  dark: "#1565C0",
  white: "#FFFFFF",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
};

const EducatorCardView = ({
  members,
  setIsEditing,
  setEditData,
  setDrawerOpen,
  setViewDrawerOpen,
  setViewData,
  handleCopyIndividualEmail,
  isDarkMode,
}) => {
  const theme = useTheme();

  // State for branch popper
  const [branchPopperAnchorEl, setBranchPopperAnchorEl] = React.useState(null);
  const [popperMember, setPopperMember] = React.useState(null);
  const branchPopperOpen = Boolean(branchPopperAnchorEl);

  // Handle branch popper
  const handleBranchMouseEnter = (event, member) => {
    if (member.branch && member.branch.length > 1) {
      setBranchPopperAnchorEl(event.currentTarget);
      setPopperMember(member);
    }
  };

  const handleBranchMouseLeave = () => {
    setBranchPopperAnchorEl(null);
    setPopperMember(null);
  };

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

  // Function to render branch chips with truncation if needed
  const renderBranchChips = (member) => {
    if (!member.branch || member.branch.length === 0) return null;

    // Show first branch and a count indicator if more exist
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          mt: 1,
        }}
        onMouseEnter={(e) => handleBranchMouseEnter(e, member)}
        onMouseLeave={handleBranchMouseLeave}
      >
        <Chip
          size="small"
          label={member.branch[0]}
          sx={{
            bgcolor: isDarkMode ? "rgba(33, 150, 243, 0.2)" : BLUE.solight,
            color: isDarkMode ? BLUE.light : BLUE.dark,
            fontWeight: 500,
            fontSize: "0.75rem",
            height: 24,
            borderRadius: "12px",
            "& .MuiChip-label": {
              px: 1,
            },
            my: 0.25,
          }}
        />

        {member.branch.length > 1 && (
          <Chip
            size="small"
            icon={<MoreHorizIcon fontSize="small" />}
            label={`+${member.branch.length - 1} more`}
            sx={{
              bgcolor: isDarkMode ? "rgba(33, 150, 243, 0.1)" : BLUE.solight,
              color: isDarkMode ? BLUE.light : BLUE.dark,
              fontWeight: 500,
              fontSize: "0.75rem",
              height: 24,
              borderRadius: "12px",
              "& .MuiChip-label": {
                px: 1,
              },
              my: 0.25,
              cursor: "pointer",
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        {members.length > 0 ? (
          members.map((member) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
              <Card
                elevation={isDarkMode ? 1 : 2}
                sx={{
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid",
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.12)"
                    : "#f0f0f0",
                  boxShadow: isDarkMode
                    ? "none"
                    : "0 4px 20px rgba(0, 0, 0, 0.05)",
                  opacity: member.active ? 1 : 0.6,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    height: "8px",
                    background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(member.initial),
                        color: getTextColor(member.initial),
                        width: 64,
                        height: 64,
                        fontSize: "1.5rem",
                        fontWeight: 500,
                        mb: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {member.initial}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        textAlign: "center",
                        mb: 0.5,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <MailIcon fontSize="small" />
                      {member.email}
                    </Typography>

                    {/* Mobile number if available */}
                    {member.mobile && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <PhoneIcon fontSize="small" />
                        {member.mobile}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    {/* Type */}
                    {member.type && (
                      <Box sx={{ mb: 1.5 }}>
                        <Chip
                          size="small"
                          label={getRoleDisplayName(member.type)}
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
                      </Box>
                    )}

                    {/* Designation */}
                    {member.designation && (
                      <Box sx={{ mb: 1.5 }}>
                        <Chip
                          size="small"
                          label={member.designation}
                          sx={{
                            bgcolor: isDarkMode
                              ? "rgba(76, 175, 80, 0.2)"
                              : "#E8F5E9",
                            color: isDarkMode ? "#81c784" : "#2E7D32",
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
                                bgcolor: isDarkMode ? "#81c784" : "#2E7D32",
                                borderRadius: "50%",
                                ml: 1,
                              }}
                            />
                          }
                        />
                      </Box>
                    )}

                    {/* Branches */}
                    <Box sx={{ mb: 1.5 }}>{renderBranchChips(member)}</Box>

                    {/* Status */}
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        size="small"
                        label={member.active ? "Active" : "Inactive"}
                        sx={{
                          bgcolor: member.active
                            ? isDarkMode
                              ? "rgba(46, 125, 50, 0.2)"
                              : "#E8F5E9"
                            : isDarkMode
                            ? "rgba(211, 47, 47, 0.2)"
                            : "#FFEBEE",
                          color: member.active
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
                              bgcolor: member.active
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
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.12)"
                        : "#f0f0f0",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => {
                          setViewData(member);
                          setViewDrawerOpen(true);
                        }}
                        sx={{
                          color: "#4CAF50",
                          backgroundColor: "#E8F5E9",
                          "&:hover": {
                            backgroundColor: "#E8F5E9",
                            opacity: 0.9,
                            boxShadow: "0 2px 5px rgba(76, 175, 80, 0.2)",
                          },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Educator">
                      <IconButton
                        onClick={() => {
                          setIsEditing(true);
                          setEditData(member);
                          setDrawerOpen(true);
                        }}
                        sx={{
                          color: BLUE.main,
                          backgroundColor: BLUE.solight,
                          "&:hover": {
                            backgroundColor: `${BLUE.solight}`,
                            opacity: 0.9,
                            boxShadow: "0 2px 5px rgba(33, 150, 243, 0.2)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Email Address">
                      <IconButton
                        onClick={() => handleCopyIndividualEmail(member.email)}
                        sx={{
                          color: BLUE.dark,
                          backgroundColor: "#f5f5f5",
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                            opacity: 0.9,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <FileCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: "16px",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No educators found matching your search.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Branch Popper */}
      <Popper
        open={branchPopperOpen}
        anchorEl={branchPopperAnchorEl}
        placement="top-start"
        transition
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mt: -1,
                mb: 2,
                maxWidth: 320,
                backgroundColor: isDarkMode
                  ? theme.palette.background.paper
                  : "white",
                border: "1px solid",
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.08)",
                borderRadius: "12px",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: isDarkMode ? BLUE.light : BLUE.dark,
                  fontWeight: 600,
                }}
              >
                All Branches
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {popperMember?.branch.map((branch, index) => (
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
                      my: 0.25,
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default EducatorCardView;
