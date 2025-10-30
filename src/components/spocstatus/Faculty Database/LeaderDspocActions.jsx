import React, { useState } from "react";
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
  Chip,
  Box,
  Checkbox,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  PersonOff as PersonOffIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// Add import for TableCell
import { TableCell } from "@mui/material";

const BLUE = {
  light: "#1976D2",
  main: "#2196F3",
  dark: "#1565C0",
  white: "#FFFFFF",
};

const LeaderDspocActions = ({
  members,
  selectedIds,
  setSelectedIds,
  onRefreshData,
  onShowNotification,
  isDarkMode,
  userType, // 'leaders' or 'dspoc'
}) => {
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
    memberIds: [],
  });

  // Get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return {
          label: "Inactive",
          color: "error",
          icon: <CancelIcon sx={{ fontSize: "12px" }} />,
        };
      case 1:
        return {
          label: "Active",
          color: "success",
          icon: <CheckCircleIcon sx={{ fontSize: "12px" }} />,
        };
      case 2:
        return {
          label: "In Progress",
          color: "warning",
          icon: <HourglassEmptyIcon sx={{ fontSize: "12px" }} />,
        };
      default:
        return {
          label: "Unknown",
          color: "default",
          icon: <CancelIcon sx={{ fontSize: "12px" }} />,
        };
    }
  };

  // Handle API calls
  const handleApiCall = async (endpoint, payload, successMessage) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      await api.post(`${BASE_URL}${endpoint}`, payload, { headers });
      
      onShowNotification(successMessage, "success");
      onRefreshData();
      setSelectedIds([]);
    } catch (error) {
      console.error(`Error with ${endpoint}:`, error);
      onShowNotification(
        error.response?.data?.message || `Operation failed`,
        "error"
      );
    }
  };

  // Handle bulk deactivation
  const handleBulkDeactivate = async (memberIds) => {
    await handleApiCall(
      "/internship/leaders-dspoc-to-inactive",
      { ids: memberIds },
      `${memberIds.length} ${userType === 'leaders' ? 'leader(s)' : 'DSPOC(s)'} deactivated successfully`
    );
  };

  // Handle activation request
  const handleActivationRequest = async (memberIds) => {
    const endpoint = userType === 'leaders' 
      ? "/internship/leader-activation-request"
      : "/internship/dspoc-activation-request";
    
    await handleApiCall(
      endpoint,
      { ids: memberIds },
      `Activation request sent for ${memberIds.length} ${userType === 'leaders' ? 'leader(s)' : 'DSPOC(s)'}`
    );
  };

  // Handle individual member actions
  const handleIndividualAction = (member, action) => {
    // Prevent action if member is in progress (status = 2)
    if (member.active === 2) {
      onShowNotification(`Cannot perform actions on ${userType === 'leaders' ? 'leader' : 'DSPOC'} with "In Progress" status`, "warning");
      return;
    }

    // Prevent deactivate action on inactive members
    if (action === 'deactivate' && member.active === 0) {
      onShowNotification(`${userType === 'leaders' ? 'Leader' : 'DSPOC'} is already inactive`, "warning");
      return;
    }

    // Prevent activate action on active members
    if (action === 'activate' && member.active === 1) {
      onShowNotification(`${userType === 'leaders' ? 'Leader' : 'DSPOC'} is already active`, "warning");
      return;
    }

    const memberIds = [member.id];
    
    if (action === 'deactivate') {
      setConfirmDialog({
        open: true,
        title: `Deactivate ${userType === 'leaders' ? 'Leader' : 'DSPOC'}`,
        message: `Are you sure you want to deactivate ${member.name}?`,
        action: () => handleBulkDeactivate(memberIds),
        memberIds,
      });
    } else if (action === 'activate') {
      setConfirmDialog({
        open: true,
        title: `Request ${userType === 'leaders' ? 'Leader' : 'DSPOC'} Activation`,
        message: `Send activation request for ${member.name}?`,
        action: () => handleActivationRequest(memberIds),
        memberIds,
      });
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) {
      onShowNotification("Please select members first", "warning");
      return;
    }

    const selectedMembers = members.filter(m => selectedIds.includes(m.id));
    
    // Filter out members with "In Progress" status
    const validMembers = selectedMembers.filter(m => m.active !== 2);
    const inProgressMembers = selectedMembers.filter(m => m.active === 2);
    
    if (inProgressMembers.length > 0) {
      onShowNotification(
        `${inProgressMembers.length} ${userType === 'leaders' ? 'leader(s)' : 'DSPOC(s)'} with "In Progress" status cannot be modified`,
        "warning"
      );
    }

    if (validMembers.length === 0) {
      return;
    }

    // For deactivate action, only include active members
    if (action === 'deactivate') {
      const activeMembers = validMembers.filter(m => m.active === 1);
      if (activeMembers.length === 0) {
        onShowNotification("No active members selected for deactivation", "warning");
        return;
      }
      
      setConfirmDialog({
        open: true,
        title: `Deactivate ${userType === 'leaders' ? 'Leaders' : 'DSPOCs'}`,
        message: `Are you sure you want to deactivate ${activeMembers.length} selected ${userType === 'leaders' ? 'leader(s)' : 'DSPOC(s)'}?`,
        action: () => handleBulkDeactivate(activeMembers.map(m => m.id)),
        memberIds: activeMembers.map(m => m.id),
      });
    } 
    // For activate action, only include inactive members
    else if (action === 'activate') {
      const inactiveMembers = validMembers.filter(m => m.active === 0);
      if (inactiveMembers.length === 0) {
        onShowNotification("No inactive members selected for activation", "warning");
        return;
      }
      
      setConfirmDialog({
        open: true,
        title: `Request ${userType === 'leaders' ? 'Leaders' : 'DSPOCs'} Activation`,
        message: `Send activation request for ${inactiveMembers.length} selected ${userType === 'leaders' ? 'leader(s)' : 'DSPOC(s)'}?`,
        action: () => handleActivationRequest(inactiveMembers.map(m => m.id)),
        memberIds: inactiveMembers.map(m => m.id),
      });
    }
  };

  // Check if member is selected
  const isSelected = (memberId) => selectedIds.includes(memberId);

  // Handle select all
  const handleSelectAllClick = (event, members) => {
    if (event.target.checked) {
      const newSelected = members.map((member) => member.id);
      setSelectedIds(newSelected);
    } else {
      setSelectedIds([]);
    }
  };

  // Handle individual selection
  const handleRowSelect = (event, memberId) => {
    const selectedIndex = selectedIds.indexOf(memberId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, memberId);
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

  // Render header checkbox
  const renderHeaderCheckbox = (members) => (
    <TableCell sx={{ padding: "12px 16px", width: "40px" }}>
      <Checkbox
        color="primary"
        indeterminate={selectedIds.length > 0 && selectedIds.length < members.length}
        checked={members.length > 0 && selectedIds.length === members.length}
        onChange={(event) => handleSelectAllClick(event, members)}
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

  // Render row checkbox
  const renderRowCheckbox = (member) => (
    <TableCell sx={{ padding: "12px 16px", width: "40px" }}>
      <Checkbox
        color="primary"
        checked={isSelected(member.id)}
        onChange={(event) => handleRowSelect(event, member.id)}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.1)",
          },
        }}
      />
    </TableCell>
  );

  // Render status column
  const renderStatusColumn = (member) => {
    const statusInfo = getStatusInfo(member.active);
    
    return (
      <TableCell sx={{ padding: "12px 16px", width: "8%" }}>
        <Chip
          icon={statusInfo.icon}
          label={statusInfo.label}
          color={statusInfo.color}
          size="small"
          sx={{
            fontSize: "0.7rem",
            fontWeight: 600,
            height: "22px",
            borderRadius: "11px",
            "& .MuiChip-icon": {
              marginLeft: "6px",
            },
          }}
        />
      </TableCell>
    );
  };

  // Render actions column
  const renderActionsColumn = (member) => (
    <TableCell sx={{ padding: "12px 16px", width: "80px", textAlign: "center" }}>
      <IconButton
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          setActionMenuAnchor({ anchor: event.currentTarget, member });
        }}
        sx={{
          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            color: BLUE.main,
            transform: "scale(1.1)",
          },
        }}
      >
        <MoreVertIcon sx={{ fontSize: "18px" }} />
      </IconButton>
    </TableCell>
  );

  // Render bulk action buttons
  const renderBulkActionButtons = () => {
    if (selectedIds.length === 0) return null;

    // Get selected members and check their statuses
    const selectedMembers = members.filter(m => selectedIds.includes(m.id));
    const hasActiveMembers = selectedMembers.some(m => m.active === 1);
    const hasInactiveMembers = selectedMembers.some(m => m.active === 0);
    const hasInProgressMembers = selectedMembers.some(m => m.active === 2);

    // Count members by status for better messaging
    const activeMembersCount = selectedMembers.filter(m => m.active === 1).length;
    const inactiveMembersCount = selectedMembers.filter(m => m.active === 0).length;
    const inProgressMembersCount = selectedMembers.filter(m => m.active === 2).length;

    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{
            color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
            fontWeight: 500,
            fontSize: "0.85rem",
          }}
        >
          {selectedIds.length} selected
          {hasInProgressMembers && (
            <span style={{ color: "#ff9800", marginLeft: "4px" }}>
              ({inProgressMembersCount} in progress)
            </span>
          )}
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<PersonAddIcon />}
          onClick={() => handleBulkAction('activate')}
          disabled={!hasInactiveMembers} // Disable if no inactive members are selected (excluding in progress)
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            borderColor: hasInactiveMembers ? BLUE.main : (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"),
            color: hasInactiveMembers ? BLUE.main : (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"),
            "&:hover": {
              borderColor: hasInactiveMembers ? BLUE.dark : (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"),
              backgroundColor: hasInactiveMembers ? "rgba(25, 118, 210, 0.05)" : "transparent",
            },
            cursor: hasInactiveMembers ? "pointer" : "not-allowed",
          }}
        >
          Request Activation {inactiveMembersCount > 0 && `(${inactiveMembersCount})`}
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<PersonOffIcon />}
          onClick={() => handleBulkAction('deactivate')}
          disabled={!hasActiveMembers} // Disable if no active members are selected (excluding in progress)
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            borderColor: hasActiveMembers ? "#f44336" : (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"),
            color: hasActiveMembers ? "#f44336" : (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"),
            "&:hover": {
              borderColor: hasActiveMembers ? "#d32f2f" : (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"),
              backgroundColor: hasActiveMembers ? "rgba(244, 67, 54, 0.05)" : "transparent",
            },
            cursor: hasActiveMembers ? "pointer" : "not-allowed",
          }}
        >
          Deactivate {activeMembersCount > 0 && `(${activeMembersCount})`}
        </Button>
      </Box>
    );
  };

  // Render action menu
  const renderActionMenu = () => {
    const member = actionMenuAnchor?.member;
    if (!member) return null;
    
    const isActive = member.active === 1;
    const isInactive = member.active === 0;
    const isInProgress = member.active === 2;
    
    return (
      <Menu
        anchorEl={actionMenuAnchor?.anchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => setActionMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
            backgroundColor: isDarkMode ? "#1e1e1e" : "white",
            minWidth: "160px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isActive && !isInProgress) {
              handleIndividualAction(member, 'activate');
            }
            setActionMenuAnchor(null);
          }}
          disabled={isActive || isInProgress} // Disable if member is active or in progress
          sx={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: (isActive || isInProgress) 
              ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)") 
              : BLUE.main,
            "&:hover": {
              backgroundColor: (isActive || isInProgress) 
                ? "transparent" 
                : "rgba(25, 118, 210, 0.05)",
            },
            cursor: (isActive || isInProgress) ? "not-allowed" : "pointer",
            pointerEvents: (isActive || isInProgress) ? "none" : "auto",
          }}
        >
          <ListItemIcon>
            <PersonAddIcon 
              sx={{ 
                fontSize: "18px", 
                color: (isActive || isInProgress) 
                  ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)") 
                  : BLUE.main 
              }} 
            />
          </ListItemIcon>
          <ListItemText primary="Request Activation" />
        </MenuItem>
        
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isInactive && !isInProgress) {
              handleIndividualAction(member, 'deactivate');
            }
            setActionMenuAnchor(null);
          }}
          disabled={isInactive || isInProgress} // Disable if member is inactive or in progress
          sx={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: (isInactive || isInProgress) 
              ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)") 
              : "#f44336",
            "&:hover": {
              backgroundColor: (isInactive || isInProgress) 
                ? "transparent" 
                : "rgba(244, 67, 54, 0.05)",
            },
            cursor: (isInactive || isInProgress) ? "not-allowed" : "pointer",
            pointerEvents: (isInactive || isInProgress) ? "none" : "auto",
          }}
        >
          <ListItemIcon>
            <PersonOffIcon 
              sx={{ 
                fontSize: "18px", 
                color: (isInactive || isInProgress) 
                  ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)") 
                  : "#f44336" 
              }} 
            />
          </ListItemIcon>
          <ListItemText primary="Deactivate" />
        </MenuItem>
      </Menu>
    );
  };

  // Render confirmation dialog
  const renderConfirmationDialog = () => (
    <Dialog
      open={confirmDialog.open}
      onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          minWidth: "400px",
          backgroundColor: isDarkMode ? "#1e1e1e" : "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          color: isDarkMode ? "white" : "black",
        }}
      >
        {confirmDialog.title}
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {confirmDialog.message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            confirmDialog.action();
            setConfirmDialog({ ...confirmDialog, open: false });
          }}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            backgroundColor: BLUE.main,
            "&:hover": {
              backgroundColor: BLUE.dark,
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {
    isSelected,
    renderHeaderCheckbox,
    renderRowCheckbox,
    renderStatusColumn,
    renderActionsColumn,
    renderBulkActionButtons,
    renderActionMenu,
    renderConfirmationDialog,
  };
};

export default LeaderDspocActions;