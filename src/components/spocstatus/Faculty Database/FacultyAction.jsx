import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Chip,
  TableCell,
  CircularProgress,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// Enhanced Material UI Blue colors
const BLUE = {
  main: "#2196F3",
  dark: "#1565C0",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
  white: "#FFFFFF",
};

// Confirmation Dialog Component
const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "8px",
          minWidth: "400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          color: BLUE.dark,
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            fontSize: "0.9rem",
            color: "rgba(0, 0, 0, 0.7)",
            lineHeight: 1.5,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            color: "rgba(0, 0, 0, 0.6)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          sx={{
            background: BLUE.gradient,
            "&:hover": {
              background: BLUE.gradientDark,
            },
            minWidth: "80px",
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FacultyActions = ({
  members,
  selectedIds,
  setSelectedIds,
  onRefreshData,
  onShowNotification,
  isDarkMode,
}) => {
  // State for action menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // State for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    ids: [],
    isLoading: false,
  });

  // Helper function to get member status
  const getMemberStatus = (member) => {
    if (member.active === 1 || member.active === true) return "active";
    if (member.active === 0 || member.active === false) return "inactive";
    if (member.active === 2) return "in-progress";
    return "inactive"; // default fallback
  };

  // Helper function to check if member is activatable (only inactive)
  const isActivatable = (member) => {
    const status = getMemberStatus(member);
    return status === "inactive"; // Only inactive members can be activated
  };

  // Helper function to check if member is deactivatable (only active)
  const isDeactivatable = (member) => {
    const status = getMemberStatus(member);
    return status === "active"; // Only active members can be deactivated
  };

  // Helper function to check if member has actions disabled (in-progress)
  const hasActionsDisabled = (member) => {
    const status = getMemberStatus(member);
    return status === "in-progress"; // In-progress members have all actions disabled
  };

  // Handle checkbox selection
  const handleSelectAll = (event, paginatedMembers) => {
    if (event.target.checked) {
      const newSelecteds = paginatedMembers.map((member) => member.id);
      setSelectedIds(newSelecteds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    setSelectedIds(newSelected);
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

  // Handle action menu
  const handleActionMenuOpen = (event, memberId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMemberId(memberId);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setSelectedMemberId(null);
  };

  // Handle activation/deactivation
  const handleActivateSelected = () => {
    // Filter only inactive members from selection (exclude in-progress)
    const selectedMembers = members.filter((member) =>
      selectedIds.includes(member.id)
    );
    const activatableMembers = selectedMembers.filter((member) =>
      isActivatable(member)
    );
    const activatableMemberIds = activatableMembers.map((member) => member.id);

    if (activatableMemberIds.length === 0) {
      onShowNotification("No inactive members selected to activate", "warning");
      return;
    }

    setConfirmDialog({
      open: true,
      type: "activate_bulk",
      ids: activatableMemberIds,
      isLoading: false,
    });
  };

  const handleDeactivateSelected = () => {
    // Filter only active members from selection (exclude in-progress)
    const selectedMembers = members.filter((member) =>
      selectedIds.includes(member.id)
    );
    const deactivatableMembers = selectedMembers.filter((member) =>
      isDeactivatable(member)
    );
    const deactivatableMemberIds = deactivatableMembers.map(
      (member) => member.id
    );

    if (deactivatableMemberIds.length === 0) {
      onShowNotification("No active members selected to deactivate", "warning");
      return;
    }

    setConfirmDialog({
      open: true,
      type: "deactivate_bulk",
      ids: deactivatableMemberIds,
      isLoading: false,
    });
  };

  const handleActivateSingle = () => {
    if (selectedMemberId) {
      setConfirmDialog({
        open: true,
        type: "activate_single",
        ids: [selectedMemberId],
        isLoading: false,
      });
    }
    handleActionMenuClose();
  };

  const handleDeactivateSingle = () => {
    if (selectedMemberId) {
      setConfirmDialog({
        open: true,
        type: "deactivate_single",
        ids: [selectedMemberId],
        isLoading: false,
      });
    }
    handleActionMenuClose();
  };

  // API calls for activation/deactivation
  const performActivation = async (ids) => {
    try {
      setConfirmDialog((prev) => ({ ...prev, isLoading: true }));

      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      await api.post(
        `${BASE_URL}/internship/send-activation-request`,
        { edu_ids: ids },
        { headers }
      );

      // Updated success message for activation
      onShowNotification(
        `Activation request sent for ${ids.length} member(s) and is now pending approval`,
        "success"
      );

      // Refresh data and clear selections
      await onRefreshData();
      setSelectedIds([]);
    } catch (err) {
      console.error("Error activating members:", err);
      onShowNotification("Failed to send activation request", "error");
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isLoading: false, open: false }));
    }
  };

  const performDeactivation = async (ids) => {
    try {
      setConfirmDialog((prev) => ({ ...prev, isLoading: true }));

      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      await api.post(
        `${BASE_URL}/internship/update-active-inactive`,
        { edu_ids: ids },
        { headers }
      );

      onShowNotification(
        `Successfully deactivated ${ids.length} member(s)`,
        "success"
      );

      // Refresh data and clear selections
      await onRefreshData();
      setSelectedIds([]);
    } catch (err) {
      console.error("Error updating member status:", err);
      onShowNotification("Failed to update member status", "error");
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isLoading: false, open: false }));
    }
  };

  const handleConfirmAction = () => {
    const { type, ids } = confirmDialog;

    if (type === "activate_bulk" || type === "activate_single") {
      performActivation(ids);
    } else if (type === "deactivate_bulk" || type === "deactivate_single") {
      performDeactivation(ids);
    }
  };

  // Get confirmation dialog content - FIXED VERSION
  const getConfirmDialogContent = () => {
    const { type, ids } = confirmDialog;
    const count = ids.length;
    const isSingle = type.includes("single");
    const isActivate = type.includes("activate");

    if (isActivate) {
      return {
        title: "Send Activation Request",
        message: `Are you sure you want to send activation request for ${
          isSingle ? "this member" : `${count} selected members`
        }? The request will be sent for approval.`,
        confirmText: "Send Request",
      };
    } else {
      return {
        title: "Deactivate Members",
        message: `Are you sure you want to deactivate ${
          isSingle ? "this member" : `${count} selected members`
        }? This action will immediately deactivate the selected member(s).`,
        confirmText: "Deactivate",
      };
    }
  };

  const dialogContent = getConfirmDialogContent();

  // Render bulk action buttons
  const renderBulkActionButtons = () => {
    if (selectedIds.length === 0) return null;

    // Get selected members and their statuses
    const selectedMembers = members.filter((member) =>
      selectedIds.includes(member.id)
    );
    const deactivatableMembers = selectedMembers.filter((member) =>
      isDeactivatable(member)
    );
    const activatableMembers = selectedMembers.filter((member) =>
      isActivatable(member)
    );

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {/* Show Activate button only if there are activatable members selected */}
        {activatableMembers.length > 0 && (
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={handleActivateSelected}
            sx={{
              background: "linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #388E3C 0%, #4CAF50 100%)",
              },
              borderRadius: "20px",
              textTransform: "none",
              fontSize: "0.8rem",
              px: 2,
            }}
          >
            Activate ({activatableMembers.length})
          </Button>
        )}

        {/* Show Deactivate button only if there are deactivatable members selected */}
        {deactivatableMembers.length > 0 && (
          <Button
            variant="contained"
            size="small"
            startIcon={<CancelIcon />}
            onClick={handleDeactivateSelected}
            sx={{
              background: "linear-gradient(90deg, #f44336 0%, #ef5350 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #d32f2f 0%, #f44336 100%)",
              },
              borderRadius: "20px",
              textTransform: "none",
              fontSize: "0.8rem",
              px: 2,
            }}
          >
            Deactivate ({deactivatableMembers.length})
          </Button>
        )}
      </Box>
    );
  };

  // Render header checkbox
  const renderHeaderCheckbox = (paginatedMembers) => {
    return (
      <TableCell
        sx={{
          width: "50px",
          color: BLUE.white,
          padding: "12px 8px",
        }}
      >
        <Checkbox
          indeterminate={
            selectedIds.length > 0 &&
            selectedIds.length < paginatedMembers.length
          }
          checked={
            paginatedMembers.length > 0 &&
            selectedIds.length === paginatedMembers.length
          }
          onChange={(event) => handleSelectAll(event, paginatedMembers)}
          sx={{
            color: BLUE.white,
            "&.Mui-checked": {
              color: BLUE.white,
            },
            "&.MuiCheckbox-indeterminate": {
              color: BLUE.white,
            },
          }}
        />
      </TableCell>
    );
  };

  // Render row checkbox
  const renderRowCheckbox = (member) => {
    const isItemSelected = isSelected(member.id);
    return (
      <TableCell sx={{ padding: "12px 8px" }}>
        <Checkbox
          checked={isItemSelected}
          onChange={(event) => handleSelectOne(event, member.id)}
          sx={{
            color: BLUE.main,
            "&.Mui-checked": {
              color: BLUE.main,
            },
          }}
        />
      </TableCell>
    );
  };

  // Render status column with support for in-progress status
  const renderStatusColumn = (member) => {
    const status = getMemberStatus(member);

    const getStatusConfig = (status) => {
      switch (status) {
        case "active":
          return {
            label: "Active",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            color: "#4CAF50",
            borderColor: "#4CAF50",
          };
        case "inactive":
          return {
            label: "Inactive",
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            color: "#f44336",
            borderColor: "#f44336",
          };
        case "in-progress":
          return {
            label: "In Progress",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            color: "#FF9800",
            borderColor: "#FF9800",
          };
        default:
          return {
            label: "Inactive",
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            color: "#f44336",
            borderColor: "#f44336",
          };
      }
    };

    const statusConfig = getStatusConfig(status);

    return (
      <TableCell sx={{ padding: "12px 16px" }}>
        <Chip
          label={statusConfig.label}
          size="small"
          sx={{
            backgroundColor: statusConfig.backgroundColor,
            color: statusConfig.color,
            fontWeight: 600,
            fontSize: "0.7rem",
            height: "24px",
            border: `1px solid ${statusConfig.borderColor}`,
          }}
        />
      </TableCell>
    );
  };

  // Render actions column
  const renderActionsColumn = (member) => {
    const actionsDisabled = hasActionsDisabled(member);

    return (
      <TableCell sx={{ padding: "12px 16px", textAlign: "center" }}>
        <IconButton
          size="small"
          onClick={(event) => handleActionMenuOpen(event, member.id)}
          disabled={actionsDisabled}
          sx={{
            color: actionsDisabled
              ? "rgba(0, 0, 0, 0.26)"
              : isDarkMode
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(0, 0, 0, 0.6)",
            "&:hover": {
              backgroundColor: actionsDisabled
                ? "transparent"
                : isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.04)",
              color: actionsDisabled ? "rgba(0, 0, 0, 0.26)" : BLUE.main,
            },
            "&.Mui-disabled": {
              color: "rgba(0, 0, 0, 0.26)",
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </TableCell>
    );
  };

  // Render action menu - UPDATED TO NOT SHOW FOR IN-PROGRESS MEMBERS
  const renderActionMenu = () => {
    // Find the selected member to check their status
    const selectedMember = members.find(
      (member) => member.id === selectedMemberId
    );

    if (!selectedMember) return null;

    const status = getMemberStatus(selectedMember);

    // Don't show menu for in-progress members
    if (status === "in-progress") {
      return null;
    }

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            minWidth: "150px",
          },
        }}
      >
        {status === "active" ? (
          // Show Deactivate option if member is active
          <MenuItem
            onClick={handleDeactivateSingle}
            sx={{
              fontSize: "0.85rem",
              py: 1,
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                color: "#f44336",
              },
            }}
          >
            <CancelIcon sx={{ fontSize: "16px", mr: 1 }} />
            Deactivate
          </MenuItem>
        ) : (
          // Show Activate option if member is inactive
          <MenuItem
            onClick={handleActivateSingle}
            sx={{
              fontSize: "0.85rem",
              py: 1,
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                color: "#4CAF50",
              },
            }}
          >
            <CheckCircleIcon sx={{ fontSize: "16px", mr: 1 }} />
            Activate
          </MenuItem>
        )}
      </Menu>
    );
  };

  // Render confirmation dialog
  const renderConfirmationDialog = () => {
    return (
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmAction}
        title={dialogContent.title}
        message={dialogContent.message}
        confirmText={dialogContent.confirmText}
        isLoading={confirmDialog.isLoading}
      />
    );
  };

  return {
    // Exposed methods and components
    renderBulkActionButtons,
    renderHeaderCheckbox,
    renderRowCheckbox,
    renderStatusColumn,
    renderActionsColumn,
    renderActionMenu,
    renderConfirmationDialog,
    isSelected,
    selectedIds,
    // Additional utilities
    getColumnCount: () => 3, // checkbox + status + actions columns
  };
};

export default FacultyActions;
