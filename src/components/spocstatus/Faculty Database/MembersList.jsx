import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  useTheme,
  TablePagination,
  Tabs,
  Tab,
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material";
import {
  Search as SearchIcon,
  FileCopy as FileCopyIcon,
  Engineering as EngineeringIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon,
  StarRate as StarRateIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";
import FacultyActions from "./FacultyAction";
import LeaderDspocActions from "./LeaderDspocActions";
import AddEducatorDrawer from "./AddEducatorDrawer";
import MembersTable from "./MembersTable"; // Import the new table component

// Enhanced Material UI Blue colors with gradient options
const BLUE = {
  solight: "#EEF7FE",
  light: "#1976D2",
  main: "#2196F3",
  dark: "#1565C0",
  white: "#FFFFFF",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
  tabGradient: "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
  tabShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
  tabHoverShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
};

// Create custom theme
const customTheme = createTheme({
  palette: {
    primary: {
      main: BLUE.main,
      light: BLUE.light,
      dark: BLUE.dark,
    },
    background: {
      paper: "#ffffff",
      default: "#f8fafc",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
        },
      },
    },
  },
});

// Styled components for compact Zoho-style tabs with icons
const StyledTabs = styled(Tabs)(({ theme, isDarkMode }) => ({
  minHeight: "42px",
  backgroundColor: "transparent",
  marginBottom: "20px",
  borderBottom: `1px solid ${
    isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#e0e0e0"
  }`,
  "& .MuiTabs-flexContainer": {
    gap: "0px",
  },
  "& .MuiTabs-indicator": {
    height: "2px",
    backgroundColor: BLUE.main,
    borderRadius: "2px 2px 0 0",
  },
}));

const StyledTab = styled(Tab)(({ theme, isDarkMode }) => ({
  textTransform: "none",
  minWidth: "auto",
  minHeight: "42px",
  padding: "8px 16px",
  margin: "0",
  fontWeight: 500,
  fontSize: "0.8rem",
  color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
  backgroundColor: "transparent",
  transition: "all 0.2s ease",
  position: "relative",
  borderRadius: "0",
  "& .MuiTab-iconWrapper": {
    marginBottom: "2px",
    marginRight: "6px",
  },
  "&:hover": {
    color: isDarkMode ? BLUE.light : BLUE.main,
    backgroundColor: isDarkMode
      ? "rgba(25, 118, 210, 0.05)"
      : "rgba(25, 118, 210, 0.03)",
  },
  "&.Mui-selected": {
    color: isDarkMode ? BLUE.light : BLUE.main,
    fontWeight: 600,
    backgroundColor: "transparent",
    "&:hover": {
      color: isDarkMode ? BLUE.light : BLUE.main,
      backgroundColor: isDarkMode
        ? "rgba(25, 118, 210, 0.05)"
        : "rgba(25, 118, 210, 0.03)",
    },
  },
}));

const MembersList = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // State for search
  const [searchQuery, setSearchQuery] = useState("");

  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for members and loading
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for tabs
  const [selectedTab, setSelectedTab] = useState(0);

  // State for faculty checkboxes
  const [selectedIds, setSelectedIds] = useState([]);

  // State for Add Educator Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEducator, setEditingEducator] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for expanded rows (for branch expansion)
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Function to format date in "1 Jun 2025" format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };

      return date.toLocaleString("en-GB", options);
    } catch (error) {
      return "N/A";
    }
  };

  // Function to normalize role names - convert "tpo" to "leaders"
  const normalizeRoleName = (roleName) => {
    if (roleName === "tpo") {
      return "leaders";
    }
    return roleName;
  };

  // Helper function to format branch names with expansion logic
  const formatBranchName = (branchName, memberId, isExpanded = false) => {
    if (!branchName) return "N/A";

    let branches = [];
    if (Array.isArray(branchName)) {
      branches = branchName;
    } else if (typeof branchName === "string") {
      branches = branchName
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b);
    }

    if (branches.length === 0) return "N/A";
    if (branches.length <= 2) return branches.join(", ");

    if (isExpanded) {
      return branches.join(", ");
    } else {
      return branches.slice(0, 2).join(", ");
    }
  };

  // Function to get remaining branch count
  const getRemainingBranchCount = (branchName) => {
    if (!branchName) return 0;

    let branches = [];
    if (Array.isArray(branchName)) {
      branches = branchName;
    } else if (typeof branchName === "string") {
      branches = branchName
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b);
    }

    return Math.max(0, branches.length - 2);
  };

  // Function to toggle row expansion
  const toggleRowExpansion = (memberId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  // Define the specific order for tabs
  const getOrderedTypes = () => {
    const desiredOrder = ["leaders", "Spoc", "dspoc", "Educator"];
    return desiredOrder;
  };

  const orderedTypes = getOrderedTypes();

  // Get count for each tab type
  const getTabCount = (type) => {
    return members.filter((m) => m.type === type).length;
  };

  // Get icon for role type
  const getRoleIcon = (roleName) => {
    const iconMap = {
      leaders: <StarRateIcon sx={{ fontSize: "16px" }} />,
      dspoc: <AdminPanelSettingsIcon sx={{ fontSize: "16px" }} />,
      Spoc: <BusinessIcon sx={{ fontSize: "16px" }} />,
      tpo: <GroupsIcon sx={{ fontSize: "16px" }} />,
      Educator: <SchoolIcon sx={{ fontSize: "16px" }} />,
    };
    return iconMap[roleName] || <EngineeringIcon sx={{ fontSize: "16px" }} />;
  };

  // Check if current tab is DSPOC to show branch column
  const isDSPOCTab = () => {
    const currentType = getCurrentTabType();
    return currentType === "dspoc";
  };

  // Check if current tab is Faculty/Educator to show checkboxes and actions
  const isFacultyTab = () => {
    const currentType = getCurrentTabType();
    return currentType === "Educator";
  };

  // Check if current tab is Leaders or DSPOC to show activation actions
  const isLeaderOrDspocTab = () => {
    const currentType = getCurrentTabType();
    return currentType === "leaders" || currentType === "dspoc";
  };

  // Check if current tab is Leaders to show Add Leader button
  const isLeadersTab = () => {
    const currentType = getCurrentTabType();
    return currentType === "leaders";
  };

  // Function to determine if Add button should be shown for current tab
  const shouldShowAddButton = () => {
    const currentType = getCurrentTabType();
    return currentType === "leaders" || currentType === "dspoc";
  };

  // Fetch members from API
  const fetchMembers = async () => {
    try {
      setLoading(true);

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

      const response = await api(
        `${BASE_URL}/internship/get-leader-dspoc-spoc-faculty`,
        {
          headers,
        }
      );

      // Transform API response to match component structure
      const transformedMembers = response.data.map((member) => ({
        id: member.id,
        name: member.name && member.name.trim() !== "" ? member.name : "N/A",
        email:
          member.email && member.email.trim() !== "" ? member.email : "N/A",
        personalEmail:
          member.email && member.email.trim() !== "" ? member.email : "N/A",
        mobile:
          member.mobile && member.mobile.trim() !== "" ? member.mobile : "",
        designation:
          member.designation && member.designation.trim() !== ""
            ? member.designation
            : "",
        localDesignation: member.localDesignation || "",
        type:
          member.role_name &&
          member.role_name.trim() !== "" &&
          member.role_name !== "staff"
            ? normalizeRoleName(member.role_name)
            : "",
        initial:
          member.name && member.name.trim() !== ""
            ? member.name.charAt(0).toUpperCase()
            : "N",
        branch: member.branch_name || [],
        branch_name: member.branch_name || [],
        active: member.status !== undefined ? member.status : 0,
        institute_id: member.institute_id,
        domain:
          member.domain && member.domain.trim() !== "" ? member.domain : "",
        first_login: member.first_login || null,
        last_login: member.last_login || null,
      }));

      // Filter out staff members completely
      const filteredMembers = transformedMembers.filter(
        (member) => member.type !== ""
      );

      setMembers(filteredMembers);
      setError(null);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to fetch educators");
      showNotification("Failed to fetch educators", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Get current tab type
  const getCurrentTabType = () => {
    return orderedTypes[selectedTab] || null;
  };

  // Filtered members based on search and selected tab
  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase();
    const currentType = getCurrentTabType();

    const typeMatch = currentType
      ? member.type === currentType && member.type.trim() !== ""
      : true;

    const branchText = formatBranchName(
      member.branch_name,
      member.id,
      true
    ).toLowerCase();

    const searchMatch =
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      (member.mobile && member.mobile.toLowerCase().includes(query)) ||
      (member.designation &&
        member.designation.toLowerCase().includes(query)) ||
      branchText.includes(query);

    return typeMatch && searchMatch;
  });

  // Paginated members
  const paginatedMembers = filteredMembers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Show notification
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Initialize Faculty Actions component
  const facultyActions = FacultyActions({
    members,
    selectedIds,
    setSelectedIds,
    onRefreshData: fetchMembers,
    onShowNotification: showNotification,
    isDarkMode,
  });

  // Initialize Leader/DSPOC Actions component
  const leaderDspocActions = LeaderDspocActions({
    members,
    selectedIds,
    setSelectedIds,
    onRefreshData: fetchMembers,
    onShowNotification: showNotification,
    isDarkMode,
    userType: getCurrentTabType(), // Pass current tab type
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(0);
    setSelectedIds([]);
    setExpandedRows(new Set());
  };

  // Reset pagination when search changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedTab]);

  // Close notification
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Handle copy individual email
  const handleCopyIndividualEmail = (email) => {
    if (!email || email.trim() === "" || email === "N/A") {
      showNotification("No email address to copy", "warning");
      return;
    }

    navigator.clipboard
      .writeText(email)
      .then(() => {
        showNotification("Email address copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy email: ", err);
        showNotification("Failed to copy email address", "error");
      });
  };

  // Handle Add Educator
  const handleAddEducator = () => {
    setIsEditing(false);
    setEditingEducator(null);
    setDrawerOpen(true);
  };

  // Handle Close Drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditing(false);
    setEditingEducator(null);
  };

  // Handle Add New Educator from Drawer
  const handleAddNewEducator = (educatorData) => {
    console.log("Adding new educator:", educatorData);
    fetchMembers();
    const userTypeDisplay =
      getCurrentTabType() === "leaders"
        ? "Leader"
        : getCurrentTabType() === "dspoc"
        ? "DSPOC"
        : "Faculty";
    showNotification(`${userTypeDisplay} added successfully`, "success");
    handleCloseDrawer();
  };

  // Handle Update Educator from Drawer
  const handleUpdateEducator = (educatorData) => {
    fetchMembers();
    const userTypeDisplay =
      getCurrentTabType() === "leaders"
        ? "Leader"
        : getCurrentTabType() === "dspoc"
        ? "DSPOC"
        : "Faculty";
    showNotification(`${userTypeDisplay} updated successfully`, "success");
    handleCloseDrawer();
  };

  // Function to determine avatar background color
  const getAvatarColor = (initial) => {
    const colors = {
      A: "#FFF3E0",
      D: "#E3F2FD",
      N: "#E91E63",
      R: "#009688",
      H: "#9C27B0",
      K: "#FF5722",
      J: "#4CAF50",
    };
    return colors[initial] || BLUE.light;
  };

  // Function to determine text color in avatar
  const getTextColor = (initial) => {
    const colors = {
      N: "#FFFFFF",
      R: "#FFFFFF",
      H: "#FFFFFF",
      K: "#FFFFFF",
    };
    return colors[initial] || "#212121";
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

  if (error) {
    return (
      <ThemeProvider theme={customTheme}>
        <Box sx={{ maxWidth: "1600px", margin: "0 auto", p: 2 }}>
          <Alert
            severity="error"
            sx={{ borderRadius: "10px", fontSize: "0.85rem" }}
          >
            {error}
            <Button onClick={fetchMembers} sx={{ ml: 2 }} size="small">
              Retry
            </Button>
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          maxWidth: "1600px",
          margin: "0 auto",
          p: 2,
          backgroundColor: isDarkMode ? "transparent" : "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Compact Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              background: isDarkMode ? BLUE.gradient : BLUE.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mt: 2,
              mb: 0.5,
              letterSpacing: "-0.01em",
              fontSize: "1.4rem",
            }}
          >
            Staff
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.6)",
              fontWeight: 500,
              fontSize: "0.8rem",
            }}
          >
            {filteredMembers.length} Staff Members{" "}
            {searchQuery && `(filtered from ${members.length})`}
          </Typography>
        </Box>

        {/* Compact Zoho-style Tabs with Icons */}
        <StyledTabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          isDarkMode={isDarkMode}
        >
          {orderedTypes.map((type, index) => (
            <StyledTab
              key={type}
              icon={getRoleIcon(type)}
              iconPosition="start"
              label={`${getRoleDisplayName(type)} (${getTabCount(type)})`}
              isDarkMode={isDarkMode}
            />
          ))}
        </StyledTabs>

        {/* Compact Search and Action row */}
        <Box sx={{ display: "flex", mb: 2.5, gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search staff members..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: BLUE.main }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "28px",
                pr: 1.5,
                fontSize: "0.85rem",
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: BLUE.main,
                },
              },
            }}
            sx={{
              width: "350px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "28px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 3px 10px rgba(25, 118, 210, 0.15)",
                },
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                boxShadow: "0 3px 12px rgba(25, 118, 210, 0.2)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: BLUE.main,
                  borderWidth: "2px",
                },
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "0.85rem",
                padding: "10px 14px",
              },
            }}
          />

          {/* Add Button - Show for Leaders and DSPOC tabs */}
          {shouldShowAddButton() && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEducator}
              size="small"
              sx={{
                borderRadius: "24px",
                px: 3,
                py: 1,
                background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
                boxShadow: "0 4px 10px rgba(33, 150, 243, 0.3)",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                "&:hover": {
                  background: isDarkMode ? BLUE.gradient : BLUE.gradientDark,
                  boxShadow: "0 6px 15px rgba(33, 150, 243, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Add {getRoleDisplayName(getCurrentTabType())}
            </Button>
          )}

          {/* Bulk Action Buttons - Show for Faculty tab */}
          {isFacultyTab() && facultyActions.renderBulkActionButtons()}

          {/* Bulk Action Buttons - Show for Leaders/DSPOC tabs */}
          {isLeaderOrDspocTab() && leaderDspocActions.renderBulkActionButtons()}
        </Box>

        {/* Enhanced Table - Now using the separate component */}
        <MembersTable
          loading={loading}
          members={paginatedMembers}
          isDarkMode={isDarkMode}
          isFacultyTab={isFacultyTab()}
          isDSPOCTab={isDSPOCTab()}
          isLeaderOrDspocTab={isLeaderOrDspocTab()}
          shouldShowAddButton={shouldShowAddButton()}
          expandedRows={expandedRows}
          facultyActions={facultyActions}
          leaderDspocActions={leaderDspocActions}
          formatDate={formatDate}
          formatBranchName={formatBranchName}
          getRemainingBranchCount={getRemainingBranchCount}
          toggleRowExpansion={toggleRowExpansion}
          handleCopyIndividualEmail={handleCopyIndividualEmail}
          handleAddEducator={handleAddEducator}
          getAvatarColor={getAvatarColor}
          getTextColor={getTextColor}
          getRoleDisplayName={getRoleDisplayName}
          getCurrentTabType={getCurrentTabType}
        />

        {/* Faculty Action Menu and Confirmation Dialog */}
        {isFacultyTab() && (
          <>
            {facultyActions.renderActionMenu()}
            {facultyActions.renderConfirmationDialog()}
          </>
        )}

        {/* Leader/DSPOC Action Menu and Confirmation Dialog */}
        {isLeaderOrDspocTab() && (
          <>
            {leaderDspocActions.renderActionMenu()}
            {leaderDspocActions.renderConfirmationDialog()}
          </>
        )}

        {/* Enhanced Pagination */}
        {filteredMembers.length > 5 && (
          <TablePagination
            component="div"
            count={filteredMembers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.06)",
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.02)"
                : "white",
              borderRadius: "0 0 12px 12px",
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(0, 0, 0, 0.6)",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                },
              "& .MuiTablePagination-select": {
                color: isDarkMode ? "white" : "black",
                fontWeight: 500,
                fontSize: "0.8rem",
              },
              "& .MuiTablePagination-actions": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(0, 0, 0, 0.6)",
                "& .MuiIconButton-root": {
                  borderRadius: "6px",
                  padding: "6px",
                  "&:hover": {
                    backgroundColor: isDarkMode
                      ? "rgba(25, 118, 210, 0.1)"
                      : "rgba(25, 118, 210, 0.05)",
                  },
                },
              },
              "& .MuiSelect-root": {
                borderRadius: "6px",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                },
              },
            }}
          />
        )}

        {/* Add Educator Drawer - Pass userType based on current tab */}
        <AddEducatorDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onAdd={handleAddNewEducator}
          onUpdate={handleUpdateEducator}
          editData={editingEducator}
          isEditing={isEditing}
          userType={getCurrentTabType()} // Pass the current tab type to the drawer
        />

        {/* Enhanced Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleNotificationClose}
            severity={notification.severity}
            variant="filled"
            sx={{
              width: "100%",
              borderRadius: "10px",
              fontWeight: 500,
              fontSize: "0.85rem",
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
              "& .MuiAlert-icon": {
                fontSize: "1.1rem",
              },
              "& .MuiAlert-action": {
                "& .MuiIconButton-root": {
                  color: "inherit",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default MembersList;
