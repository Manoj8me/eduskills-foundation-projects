import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Chip,
  Checkbox,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  StarRate as StarRateIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// Enhanced Material UI Blue colors
const BLUE = {
  solight: "#EEF7FE",
  light: "#1976D2",
  main: "#2196F3",
  dark: "#1565C0",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
};

const StaffActions = ({
  member,
  onRefreshData,
  onShowNotification,
  isDarkMode,
}) => {
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // DSPOC modal state
  const [dspocModalOpen, setDspocModalOpen] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmationType, setConfirmationType] = useState(""); // 'leader' or 'dspoc'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkbox icons for Autocomplete
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  // Check if member has leader role
  const hasLeaderRole = () => {
    return (
      member.roles &&
      Array.isArray(member.roles) &&
      member.roles.includes("leaders")
    );
  };

  // Check if member has DSPOC role
  const hasDspocRole = () => {
    return (
      member.roles &&
      Array.isArray(member.roles) &&
      member.roles.includes("dspoc")
    );
  };

  // Fetch branches from API (reused from AddEducatorDrawer)
  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);

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

      const response = await api(`${BASE_URL}/internship/academy-branches`, {
        headers,
      });

      // Extract branches array from response
      if (response.data && response.data.branches) {
        setBranchOptions(response.data.branches);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      onShowNotification("Failed to fetch branches", "error");

      // Fallback to default branches if API fails
      setBranchOptions([
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electronics & Communication",
        "Information Technology",
        "Chemical Engineering",
        "Biotechnology",
        "Aerospace Engineering",
      ]);
    } finally {
      setBranchesLoading(false);
    }
  };

  // Handle menu open
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  // Handle Make Leader click
  const handleMakeLeaderClick = () => {
    handleMenuClose();
    setConfirmationType("leader");
    setConfirmModalOpen(true);
  };

  // Handle Make DSPOC click
  const handleMakeDspocClick = () => {
    handleMenuClose();
    setDspocModalOpen(true);
    // Fetch branches when DSPOC modal opens
    fetchBranches();
  };

  // Handle DSPOC modal proceed
  const handleDspocModalProceed = () => {
    if (selectedBranches.length === 0) {
      onShowNotification("Please select at least one branch", "warning");
      return;
    }
    setDspocModalOpen(false);
    setConfirmationType("dspoc");
    setConfirmModalOpen(true);
  };

  // Handle DSPOC modal close
  const handleDspocModalClose = () => {
    setDspocModalOpen(false);
    setSelectedBranches([]);
  };

  // Handle confirmation modal close
  const handleConfirmModalClose = () => {
    setConfirmModalOpen(false);
    setConfirmationType("");
    if (confirmationType === "dspoc") {
      setSelectedBranches([]);
    }
  };

  // API call to assign leader role
  const assignLeaderRole = async () => {
    try {
      setIsSubmitting(true);

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

      const payload = {
        leader_id: member.id,
      };

      const response = await api.post(
        `${BASE_URL}/internship/assign-leader-role`,
        payload,
        { headers }
      );

      if (response.data) {
        onShowNotification(
          "Staff member promoted to Leader successfully",
          "success"
        );
        if (onRefreshData) {
          onRefreshData();
        }
        return true;
      } else {
        throw new Error("Failed to assign leader role");
      }
    } catch (error) {
      console.error("Error assigning leader role:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to assign leader role";
      onShowNotification(errorMessage, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // API call to assign DSPOC role
  const assignDspocRole = async () => {
    try {
      setIsSubmitting(true);

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

      const payload = {
        leader_id: member.id,
        branch_names: selectedBranches,
      };

      const response = await api.post(
        `${BASE_URL}/internship/assign-dspoc-role`,
        payload,
        { headers }
      );

      if (response.data) {
        onShowNotification(
          "Staff member promoted to DSPOC successfully",
          "success"
        );
        if (onRefreshData) {
          onRefreshData();
        }
        return true;
      } else {
        throw new Error("Failed to assign DSPOC role");
      }
    } catch (error) {
      console.error("Error assigning DSPOC role:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to assign DSPOC role";
      onShowNotification(errorMessage, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirmation proceed
  const handleConfirmationProceed = async () => {
    let success = false;

    if (confirmationType === "leader") {
      success = await assignLeaderRole();
    } else if (confirmationType === "dspoc") {
      success = await assignDspocRole();
    }

    if (success) {
      handleConfirmModalClose();
    }
  };

  return (
    <>
      {/* Action Button */}
      <IconButton
        size="small"
        onClick={handleMenuClick}
        sx={{
          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
          "&:hover": {
            backgroundColor: isDarkMode
              ? "rgba(25, 118, 210, 0.1)"
              : "rgba(25, 118, 210, 0.05)",
            color: BLUE.main,
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            minWidth: 160,
            backgroundColor: isDarkMode ? "rgba(42, 42, 42, 0.95)" : "white",
            backdropFilter: "blur(10px)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Make Leader MenuItem - Disabled if already has leader role */}
        <MenuItem
          onClick={handleMakeLeaderClick}
          disabled={hasLeaderRole()}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: "8px",
            margin: "4px",
            color: hasLeaderRole()
              ? isDarkMode
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.3)"
              : isDarkMode
              ? "white"
              : "rgba(0, 0, 0, 0.87)",
            "&:hover": !hasLeaderRole()
              ? {
                  backgroundColor: isDarkMode
                    ? "rgba(25, 118, 210, 0.15)"
                    : "rgba(25, 118, 210, 0.05)",
                  color: BLUE.main,
                }
              : {},
            "&.Mui-disabled": {
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <StarRateIcon
            sx={{
              mr: 1.5,
              fontSize: "18px",
              color: hasLeaderRole()
                ? isDarkMode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.3)"
                : "inherit",
            }}
          />
          {hasLeaderRole() ? "Already Leader" : "Make Leader"}
        </MenuItem>

        {/* Make DSPOC MenuItem - Always enabled */}
        <MenuItem
          onClick={handleMakeDspocClick}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: "8px",
            margin: "4px",
            color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.87)",
            "&:hover": {
              backgroundColor: isDarkMode
                ? "rgba(25, 118, 210, 0.15)"
                : "rgba(25, 118, 210, 0.05)",
              color: BLUE.main,
            },
          }}
        >
          <AdminPanelSettingsIcon sx={{ mr: 1.5, fontSize: "18px" }} />
          {hasDspocRole() ? "Update DSPOC" : "Make DSPOC"}
        </MenuItem>
      </Menu>

      {/* DSPOC Branch Selection Modal */}
      <Dialog
        open={dspocModalOpen}
        onClose={() => {}} // Prevent closing by clicking outside or pressing Escape
        disableEscapeKeyDown // Disable Escape key closing
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: isDarkMode ? "rgba(42, 42, 42, 0.95)" : "white",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
            color: "white",
            fontWeight: 600,
            borderRadius: "16px 16px 0 0",
          }}
        >
          {hasDspocRole()
            ? "Update Branches for DSPOC Role"
            : "Select Branches for DSPOC Role"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.6)",
            }}
          >
            Select the branches that <strong>{member.name}</strong> will oversee
            as DSPOC.
          </Typography>

          {/* Show current roles if any */}
          {member.roles && member.roles.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Current roles:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {member.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role === "leaders" ? "Leader" : role.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: isDarkMode
                        ? "rgba(33, 150, 243, 0.15)"
                        : BLUE.solight,
                      color: isDarkMode ? BLUE.light : BLUE.dark,
                      borderRadius: "12px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Enhanced Skeleton Loading State */}
          {branchesLoading && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Label Skeleton */}
                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
                  animation="wave"
                  sx={{
                    bgcolor: isDarkMode
                      ? "rgba(255, 255, 255, 0.11)"
                      : "rgba(0, 0, 0, 0.11)",
                  }}
                />

                {/* Input Field Skeleton */}
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={48}
                  animation="wave"
                  sx={{
                    borderRadius: "12px",
                    bgcolor: isDarkMode
                      ? "rgba(255, 255, 255, 0.11)"
                      : "rgba(0, 0, 0, 0.11)",
                  }}
                />

                {/* Sample Chips Skeleton */}
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  <Skeleton
                    variant="rounded"
                    width={120}
                    height={32}
                    animation="wave"
                    sx={{
                      borderRadius: "16px",
                      bgcolor: isDarkMode
                        ? "rgba(255, 255, 255, 0.11)"
                        : "rgba(0, 0, 0, 0.11)",
                    }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={140}
                    height={32}
                    animation="wave"
                    sx={{
                      borderRadius: "16px",
                      bgcolor: isDarkMode
                        ? "rgba(255, 255, 255, 0.11)"
                        : "rgba(0, 0, 0, 0.11)",
                    }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={100}
                    height={32}
                    animation="wave"
                    sx={{
                      borderRadius: "16px",
                      bgcolor: isDarkMode
                        ? "rgba(255, 255, 255, 0.11)"
                        : "rgba(0, 0, 0, 0.11)",
                    }}
                  />
                </Box>

                {/* Loading Text Skeleton */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Skeleton
                    variant="text"
                    width="50%"
                    height={16}
                    animation="wave"
                    sx={{
                      margin: "0 auto",
                      bgcolor: isDarkMode
                        ? "rgba(255, 255, 255, 0.11)"
                        : "rgba(0, 0, 0, 0.11)",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Actual Autocomplete - Only show when not loading */}
          {!branchesLoading && (
            <Autocomplete
              multiple
              id="dspoc-branches"
              options={branchOptions}
              value={selectedBranches}
              disableCloseOnSelect
              onChange={(event, newValue) => {
                setSelectedBranches(newValue);
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    sx={{
                      color: isDarkMode ? BLUE.light : BLUE.main,
                      "&.Mui-checked": {
                        color: isDarkMode ? BLUE.light : BLUE.main,
                      },
                    }}
                  />
                  {option}
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                    sx={{
                      backgroundColor: isDarkMode
                        ? "rgba(33, 150, 243, 0.15)"
                        : BLUE.solight,
                      borderColor: isDarkMode ? BLUE.light : BLUE.main,
                      color: isDarkMode ? BLUE.light : BLUE.dark,
                      borderRadius: "12px",
                      "& .MuiChip-deleteIcon": {
                        color: isDarkMode ? BLUE.light : BLUE.main,
                        "&:hover": {
                          color: isDarkMode ? "white" : BLUE.dark,
                        },
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Branches"
                  placeholder="Select branches"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
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
                />
              )}
              sx={{
                "& .MuiAutocomplete-paper": {
                  borderRadius: "12px",
                  marginTop: "4px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleDspocModalClose}
            disabled={branchesLoading}
            sx={{
              borderRadius: "20px",
              px: 3,
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.6)",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDspocModalProceed}
            variant="contained"
            disabled={selectedBranches.length === 0 || branchesLoading}
            sx={{
              borderRadius: "20px",
              px: 3,
              background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
              "&:hover": {
                background: isDarkMode ? BLUE.gradient : BLUE.gradientDark,
              },
              "&.Mui-disabled": {
                background: isDarkMode
                  ? "rgba(25, 118, 210, 0.3)"
                  : "rgba(33, 150, 243, 0.3)",
              },
            }}
          >
            {branchesLoading ? "Loading..." : "Proceed"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog
        open={confirmModalOpen}
        onClose={handleConfirmModalClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: isDarkMode ? "rgba(42, 42, 42, 0.95)" : "white",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
            color: "white",
            fontWeight: 600,
            borderRadius: "16px 16px 0 0",
          }}
        >
          Confirm Role Assignment
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.87)",
            }}
          >
            Are you sure you want to{" "}
            {confirmationType === "dspoc" && hasDspocRole()
              ? "update"
              : "promote"}{" "}
            <strong>{member.name}</strong>{" "}
            {confirmationType === "dspoc" && hasDspocRole() ? "as" : "to"}{" "}
            <strong>
              {confirmationType === "leader" ? "Leader" : "DSPOC"}
            </strong>
            ?
          </Typography>

          {confirmationType === "dspoc" && selectedBranches.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Selected branches:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selectedBranches.map((branch) => (
                  <Chip
                    key={branch}
                    label={branch}
                    size="small"
                    sx={{
                      backgroundColor: isDarkMode
                        ? "rgba(33, 150, 243, 0.15)"
                        : BLUE.solight,
                      color: isDarkMode ? BLUE.light : BLUE.dark,
                      borderRadius: "12px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Alert
            severity="info"
            sx={{
              mt: 2,
              borderRadius: "12px",
              backgroundColor: isDarkMode
                ? "rgba(33, 150, 243, 0.1)"
                : "rgba(33, 150, 243, 0.05)",
            }}
          >
            This action will{" "}
            {confirmationType === "dspoc" && hasDspocRole()
              ? "update"
              : "change"}{" "}
            the staff member's role and permissions.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleConfirmModalClose}
            disabled={isSubmitting}
            sx={{
              borderRadius: "20px",
              px: 3,
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.6)",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmationProceed}
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
            sx={{
              borderRadius: "20px",
              px: 3,
              background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
              "&:hover": {
                background: isDarkMode ? BLUE.gradient : BLUE.gradientDark,
              },
            }}
          >
            {isSubmitting
              ? "Processing..."
              : `Confirm ${
                  confirmationType === "leader" ? "Leader" : "DSPOC"
                } Role`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StaffActions;
