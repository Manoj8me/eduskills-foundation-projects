import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Grid,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
  AttachFile as AttachFileIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  DoDisturb as DoDisturbIcon,
  ArrowForward as ArrowForwardIcon,
  History as HistoryIcon,
  Comment as CommentIcon,
  NotificationsActive as NotificationsActiveIcon,
  PriorityHigh as PriorityHighIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Priority levels
const PRIORITIES = [
  { value: "Low", color: "#4caf50" },
  { value: "Medium", color: "#ff9800" },
  { value: "High", color: "#f44336" },
  { value: "Critical", color: "#9c27b0" },
];

// Status options
const STATUSES = [
  { value: "Open", color: "#2196f3" },
  { value: "In Progress", color: "#ff9800" },
  { value: "Resolved", color: "#4caf50" },
  { value: "Closed", color: "#9e9e9e" },
];

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

// Quill editor formats
const quillFormats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
];

const TicketDetailsViewComponent = ({
  ticket,
  isOpen,
  onClose,
  onUpdateTicket,
  onAddComment,
  onUpdateStatus,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // State for tab selection
  const [tabValue, setTabValue] = useState(0);

  // State for editing ticket
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTicket, setEditedTicket] = useState({ ...ticket });

  // State for reply/comment
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // State for internal notes
  const [internalNote, setInternalNote] = useState("");
  const [sendingNote, setSendingNote] = useState(false);

  // State for status actions
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [confirmStatusAction, setConfirmStatusAction] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // State for file upload
  const [newFiles, setNewFiles] = useState([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // State for toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Mock ticket history/activity log
  const [activityLog, setActivityLog] = useState([
    {
      id: 1,
      type: "status",
      content: "Ticket created",
      timestamp: "2025-04-14 09:35",
      user: "John Doe",
      avatar: "JD",
    },
    {
      id: 2,
      type: "comment",
      content: "Initial review completed",
      timestamp: "2025-04-14 10:22",
      user: "Support Staff",
      avatar: "SS",
      isInternal: true,
    },
    {
      id: 3,
      type: "status",
      content: "Status changed from Open to In Progress",
      timestamp: "2025-04-14 10:26",
      user: "Support Staff",
      avatar: "SS",
    },
  ]);

  // Mock comments for tickets
  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Support Staff",
      avatar: "SS",
      content:
        "I'm checking the network status. Can you please provide more details about when this started?",
      date: "2025-04-14 14:30",
      isAgent: true,
    },
    {
      id: "c2",
      author: "John Doe",
      avatar: "JD",
      content:
        "It started after the system update yesterday. I can't access any internal tools.",
      date: "2025-04-14 15:45",
      isAgent: false,
    },
  ]);

  // Mock internal notes
  const [internalNotes, setInternalNotes] = useState([
    {
      id: "n1",
      author: "Support Staff",
      avatar: "SS",
      content: "Checking with the network team about the recent system update.",
      date: "2025-04-14 14:40",
    },
    {
      id: "n2",
      author: "Support Staff",
      avatar: "SS",
      content:
        "The update included firewall changes that might be blocking internal connections.",
      date: "2025-04-14 16:10",
    },
  ]);

  // Refs
  const commentsEndRef = useRef(null);
  const notesEndRef = useRef(null);

  // Update edited ticket when the prop changes
  useEffect(() => {
    if (ticket) {
      setEditedTicket({ ...ticket });
    }
  }, [ticket]);

  // Auto-scroll to latest comment/note
  useEffect(() => {
    if (tabValue === 0 && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (tabValue === 1 && notesEndRef.current) {
      notesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, internalNotes, tabValue]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle edited ticket field changes
  const handleEditChange = (field, value) => {
    setEditedTicket({
      ...editedTicket,
      [field]: value,
    });
  };

  // Handle save edited ticket
  const handleSaveTicket = () => {
    if (onUpdateTicket) {
      onUpdateTicket(editedTicket);

      // Add to activity log
      const newActivity = {
        id: activityLog.length + 1,
        type: "edit",
        content: "Ticket details updated",
        timestamp: new Date().toLocaleString(),
        user: "Support Staff",
        avatar: "SS",
      };
      setActivityLog([...activityLog, newActivity]);

      // Show success notification
      setToast({
        open: true,
        message: "Ticket details updated successfully",
        severity: "success",
      });
    }
    setIsEditMode(false);
  };

  // Handle reply text change
  const handleReplyChange = (value) => {
    setReplyText(value);
  };

  // Handle internal note change
  const handleInternalNoteChange = (value) => {
    setInternalNote(value);
  };

  // Handle reply submit
  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    setSendingReply(true);

    // Simulate API call
    setTimeout(() => {
      const newComment = {
        id: `c${comments.length + 1}`,
        author: "Support Staff",
        avatar: "SS",
        content: replyText,
        date: new Date().toLocaleString(),
        isAgent: true,
      };

      setComments([...comments, newComment]);

      // Add to activity log
      const newActivity = {
        id: activityLog.length + 1,
        type: "comment",
        content: "Added response to customer",
        timestamp: new Date().toLocaleString(),
        user: "Support Staff",
        avatar: "SS",
      };
      setActivityLog([...activityLog, newActivity]);

      setSendingReply(false);
      setReplyText("");

      if (onAddComment) {
        onAddComment(newComment);
      }

      // Show success notification
      setToast({
        open: true,
        message: "Response sent to customer",
        severity: "success",
      });
    }, 800);
  };

  // Handle internal note submit
  const handleInternalNoteSubmit = () => {
    if (!internalNote.trim()) return;

    setSendingNote(true);

    // Simulate API call
    setTimeout(() => {
      const newNote = {
        id: `n${internalNotes.length + 1}`,
        author: "Support Staff",
        avatar: "SS",
        content: internalNote,
        date: new Date().toLocaleString(),
      };

      setInternalNotes([...internalNotes, newNote]);

      // Add to activity log
      const newActivity = {
        id: activityLog.length + 1,
        type: "note",
        content: "Added internal note",
        timestamp: new Date().toLocaleString(),
        user: "Support Staff",
        avatar: "SS",
        isInternal: true,
      };
      setActivityLog([...activityLog, newActivity]);

      setSendingNote(false);
      setInternalNote("");

      // Show success notification
      setToast({
        open: true,
        message: "Internal note added",
        severity: "success",
      });
    }, 800);
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    processFiles(selectedFiles);
  };

  // Process files after drop or selection
  const processFiles = (selectedFiles) => {
    // Filter out any files that might exceed size limit (10MB per file)
    const filteredFiles = selectedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );

    if (filteredFiles.length < selectedFiles.length) {
      setToast({
        open: true,
        message:
          "Some files were skipped because they exceed the 10MB size limit",
        severity: "warning",
      });
    }

    const newUploadedFiles = [...newFiles, ...filteredFiles];

    // Create preview URLs for images
    const newFilePreviewUrls = filteredFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    });

    setNewFiles(newUploadedFiles);
    setFilePreviewUrls([...filePreviewUrls, ...newFilePreviewUrls]);
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  // Remove a file
  const handleRemoveFile = (index) => {
    const updatedFiles = [...newFiles];
    updatedFiles.splice(index, 1);

    const updatedPreviews = [...filePreviewUrls];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    updatedPreviews.splice(index, 1);

    setNewFiles(updatedFiles);
    setFilePreviewUrls(updatedPreviews);
  };

  // Get file type icon
  const getFileTypeIcon = (file) => {
    if (file.type.startsWith("image/")) {
      return "📷";
    } else if (file.type === "application/pdf") {
      return "📄";
    } else if (
      file.type.includes("spreadsheet") ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    ) {
      return "📊";
    } else if (
      file.type.includes("document") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx")
    ) {
      return "📝";
    } else {
      return "📎";
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Handle status menu
  const handleStatusClick = (event) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusClose = () => {
    setStatusAnchorEl(null);
  };

  // Handle confirm status change
  const handleConfirmStatus = (status) => {
    setConfirmStatusAction(status);
  };

  const handleCancelStatusChange = () => {
    setConfirmStatusAction(null);
  };

  // Handle status update
  const handleUpdateStatus = () => {
    if (!confirmStatusAction) return;

    setUpdatingStatus(true);

    // Simulate API call
    setTimeout(() => {
      if (onUpdateStatus) {
        onUpdateStatus(ticket.id, confirmStatusAction);
      }

      // Update ticket locally
      setEditedTicket({
        ...editedTicket,
        status: confirmStatusAction,
      });

      // Add to activity log
      const newActivity = {
        id: activityLog.length + 1,
        type: "status",
        content: `Status changed from ${ticket.status} to ${confirmStatusAction}`,
        timestamp: new Date().toLocaleString(),
        user: "Support Staff",
        avatar: "SS",
      };
      setActivityLog([...activityLog, newActivity]);

      // Show success notification
      setToast({
        open: true,
        message: `Ticket status updated to ${confirmStatusAction}`,
        severity: "success",
      });

      setUpdatingStatus(false);
      setConfirmStatusAction(null);
      setStatusAnchorEl(null);
    }, 800);
  };

  // Handle toast close
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    const statusObj = STATUSES.find((s) => s.value === status);
    return (
      <Chip
        label={status}
        size="small"
        style={{
          backgroundColor: statusObj ? statusObj.color : "#9e9e9e",
          color: "white",
          fontWeight: 500,
          height: "20px",
          fontSize: "0.65rem",
        }}
      />
    );
  };

  // Render priority chip with appropriate color
  const renderPriorityChip = (priority) => {
    const priorityObj = PRIORITIES.find((p) => p.value === priority);
    return (
      <Chip
        label={priority}
        size="small"
        style={{
          backgroundColor: priorityObj ? priorityObj.color : "#9e9e9e",
          color: "white",
          fontWeight: 500,
          height: "20px",
          fontSize: "0.65rem",
        }}
      />
    );
  };

  // If no ticket, return null
  if (!ticket) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          maxHeight: "95vh",
          height: fullScreen ? "100%" : "auto",
          margin: { xs: 1, sm: 2 },
          overflow: "hidden",
        },
      }}
    >
      {/* Dialog Header - Enhanced */}
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 2.5 },
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: { xs: "1rem", sm: "1.1rem" },
          minHeight: { xs: "56px", sm: "64px" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Ticket {ticket.id}
          </Typography>
          {renderStatusChip(editedTicket.status)}
        </Box>
        <IconButton color="inherit" onClick={onClose} edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Ticket Details Section - Improved spacing */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              position: "relative",
            }}
          >
            {isEditMode ? (
              // Edit Mode - Better form layout
              <Box component="form" sx={{ mb: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={editedTicket.title}
                      onChange={(e) =>
                        handleEditChange("title", e.target.value)
                      }
                      size="small"
                      sx={{ mb: 2 }}
                      inputProps={{ style: { fontSize: "0.85rem" } }}
                      InputLabelProps={{ style: { fontSize: "0.85rem" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: "0.85rem" }}>
                        Category
                      </InputLabel>
                      <Select
                        value={editedTicket.category}
                        label="Category"
                        onChange={(e) =>
                          handleEditChange("category", e.target.value)
                        }
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {[
                          "IT",
                          "Development",
                          "HR",
                          "Finance",
                          "Marketing",
                          "Sales",
                          "Customer Support",
                          "Operations",
                        ].map((category) => (
                          <MenuItem
                            key={category}
                            value={category}
                            sx={{ fontSize: "0.85rem" }}
                          >
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: "0.85rem" }}>
                        Priority
                      </InputLabel>
                      <Select
                        value={editedTicket.priority}
                        label="Priority"
                        onChange={(e) =>
                          handleEditChange("priority", e.target.value)
                        }
                        sx={{ fontSize: "0.85rem" }}
                        renderValue={(value) => (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                            }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor:
                                  PRIORITIES.find((p) => p.value === value)
                                    ?.color || "#9e9e9e",
                              }}
                            />
                            {value}
                          </Box>
                        )}
                      >
                        {PRIORITIES.map((priority) => (
                          <MenuItem
                            key={priority.value}
                            value={priority.value}
                            sx={{ fontSize: "0.85rem" }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: priority.color,
                                mr: 1.5,
                              }}
                            />
                            {priority.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={editedTicket.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                      multiline
                      rows={4}
                      size="small"
                      inputProps={{ style: { fontSize: "0.85rem" } }}
                      InputLabelProps={{ style: { fontSize: "0.85rem" } }}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsEditMode(false)}
                    sx={{ fontSize: "0.8rem", py: 0.75, px: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveTicket}
                    startIcon={<SaveIcon fontSize="small" />}
                    sx={{ fontSize: "0.8rem", py: 0.75, px: 2 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              // View Mode - More readable layout
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {editedTicket.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setIsEditMode(true)}
                    sx={{ p: 0.6, ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "0.7rem", mb: 0.6 }}
                    >
                      Category
                    </Typography>
                    <Chip
                      label={editedTicket.category}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 24,
                        "& .MuiChip-label": { fontSize: "0.75rem", px: 1 },
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "0.7rem", mb: 0.6 }}
                    >
                      Priority
                    </Typography>
                    {renderPriorityChip(editedTicket.priority)}
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "0.7rem", mb: 0.6 }}
                    >
                      Created
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {editedTicket.date}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "0.7rem", mb: 0.6 }}
                    >
                      Staff Notes
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.8rem", fontStyle: "italic" }}
                    >
                      {editedTicket.staffNotes || "No staff notes"}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.8, fontSize: "0.7rem" }}
                >
                  Description
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 1.5,
                    mb: 2,
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.85rem", lineHeight: 1.5 }}
                  >
                    {editedTicket.description}
                  </Typography>
                </Paper>

                {/* Attachments Section - Enhanced layout */}
                {editedTicket.files && editedTicket.files.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.8, fontSize: "0.7rem" }}
                    >
                      Attachments
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                      {editedTicket.files.map((file, index) => (
                        <Chip
                          key={index}
                          label={file}
                          size="small"
                          variant="outlined"
                          icon={<AttachFileIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            borderRadius: 1.5,
                            bgcolor: "rgba(25, 118, 210, 0.05)",
                            borderColor: "rgba(25, 118, 210, 0.15)",
                            color: "primary.main",
                            height: 24,
                            "& .MuiChip-label": { fontSize: "0.75rem", px: 1 },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Paper>

          {/* Action Buttons - Better spacing */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1.5,
              px: 3,
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              bgcolor: "rgba(0, 0, 0, 0.01)",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
              onClick={handleStatusClick}
              sx={{ fontSize: "0.8rem", py: 0.6, px: 1.5 }}
            >
              Update Status
            </Button>

            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<PriorityHighIcon sx={{ fontSize: 18 }} />}
              sx={{ fontSize: "0.8rem", py: 0.6, px: 1.5, ml: "auto" }}
              disabled={editedTicket.priority === "Critical"}
              onClick={() => {
                handleEditChange("priority", "Critical");

                // Add to activity log
                const newActivity = {
                  id: activityLog.length + 1,
                  type: "priority",
                  content: `Priority escalated to Critical`,
                  timestamp: new Date().toLocaleString(),
                  user: "Support Staff",
                  avatar: "SS",
                };
                setActivityLog([...activityLog, newActivity]);

                // Show notification
                setToast({
                  open: true,
                  message: "Ticket escalated to Critical priority",
                  severity: "warning",
                });
              }}
            >
              Escalate
            </Button>

            {/* Status Change Menu */}
            <Menu
              anchorEl={statusAnchorEl}
              open={Boolean(statusAnchorEl)}
              onClose={handleStatusClose}
              PaperProps={{
                sx: {
                  minWidth: "180px",
                  "& .MuiMenuItem-root": {
                    minHeight: "36px",
                    fontSize: "0.85rem",
                  },
                },
              }}
            >
              {STATUSES.map((status) => (
                <MenuItem
                  key={status.value}
                  onClick={() => {
                    handleConfirmStatus(status.value);
                    handleStatusClose();
                  }}
                  disabled={status.value === editedTicket.status}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: status.color,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    {status.value}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Tabs for Customer Communication and Internal Notes - Improved sizing */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              minHeight: "42px",
              px: 2,
              pt: 0.5,
              pb: 0,
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              "& .MuiTab-root": {
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "none",
                minWidth: "auto",
                minHeight: "42px",
                px: { xs: 1.5, sm: 2 },
                py: 0.8,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                  <CommentIcon sx={{ fontSize: 16 }} />
                  <Box>Communication</Box>
                  <Badge
                    badgeContent={comments.length}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.65rem",
                        height: 16,
                        minWidth: 16,
                        padding: "0 4px",
                      },
                    }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                  <FormatListBulletedIcon sx={{ fontSize: 16 }} />
                  <Box>Notes</Box>
                  <Badge
                    badgeContent={internalNotes.length}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.65rem",
                        height: 16,
                        minWidth: 16,
                        padding: "0 4px",
                      },
                    }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                  <HistoryIcon sx={{ fontSize: 16 }} />
                  <Box>Activity</Box>
                </Box>
              }
            />
          </Tabs>

          {/* Tab Panels - Better scrolling */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            {/* Customer Communication Tab */}
            <Box
              sx={{
                display: tabValue === 0 ? "flex" : "none",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {/* Message History - Enhanced readability */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: "auto",
                  p: { xs: 2, sm: 2.5 },
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {comments.map((comment, index) => (
                  <Paper
                    key={comment.id}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: comment.isAgent
                        ? "rgba(33, 150, 243, 0.05)"
                        : "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      maxWidth: "85%",
                      alignSelf: comment.isAgent ? "flex-start" : "flex-end",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        mb: 0.8,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: comment.isAgent
                            ? "primary.main"
                            : "grey.600",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {comment.avatar}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {comment.author}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.7rem",
                            color: "text.secondary",
                            lineHeight: 1.2,
                          }}
                        >
                          {comment.date}
                        </Typography>
                      </Box>
                      {comment.isAgent && (
                        <Chip
                          label="Staff"
                          size="small"
                          variant="filled"
                          sx={{
                            height: 16,
                            bgcolor: "rgba(25, 118, 210, 0.1)",
                            color: "primary.main",
                            "& .MuiChip-label": {
                              px: 0.8,
                              fontSize: "0.65rem",
                            },
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.8rem", ml: 4 }}
                    >
                      {comment.content}
                    </Typography>
                  </Paper>
                ))}
                <div ref={commentsEndRef} />
              </Box>

              {/* Reply Box - Improved layout */}
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mb: 0.8,
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  Reply to Customer
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <ReactQuill
                    theme="snow"
                    value={replyText}
                    onChange={handleReplyChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Type your reply to the customer..."
                    style={{
                      height: "120px",
                      marginBottom: "35px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                    }}
                  />
                </Box>

                {/* File Upload Section - Enhanced appearance */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 2,
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                    borderRadius: 1.5,
                    border: isDragging
                      ? "2px dashed #1976d2"
                      : "1px dashed rgba(25, 118, 210, 0.3)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    style={{ display: "none" }}
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                          size="small"
                          sx={{
                            fontSize: "0.75rem",
                            borderStyle: "dashed",
                            mr: 1.5,
                            py: 0.8,
                            px: 1.5,
                          }}
                        >
                          Attach Files
                        </Button>
                      </label>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {newFiles.length > 0
                          ? `${newFiles.length} file(s) selected`
                          : "Drag files or click to browse"}
                      </Typography>
                    </Box>

                    {newFiles.length > 0 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          // Clear all files
                          filePreviewUrls.forEach((url) =>
                            URL.revokeObjectURL(url)
                          );
                          setNewFiles([]);
                          setFilePreviewUrls([]);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* File Previews - Better chips */}
                  {newFiles.length > 0 && (
                    <Box
                      sx={{
                        mt: 1.2,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.8,
                      }}
                    >
                      {newFiles.map((file, index) => (
                        <Chip
                          key={index}
                          label={
                            file.name.length > 18
                              ? file.name.substring(0, 16) + "..."
                              : file.name
                          }
                          size="small"
                          onDelete={() => handleRemoveFile(index)}
                          sx={{
                            height: 24,
                            borderRadius: 1.5,
                            "& .MuiChip-label": { fontSize: "0.75rem" },
                            "& .MuiChip-deleteIcon": { fontSize: 16 },
                          }}
                          avatar={
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.9rem",
                              }}
                            >
                              {getFileTypeIcon(file)}
                            </Box>
                          }
                        />
                      ))}
                    </Box>
                  )}
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || sendingReply}
                    startIcon={
                      sendingReply ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SendIcon fontSize="small" sx={{ fontSize: 18 }} />
                      )
                    }
                    sx={{ fontSize: "0.8rem", py: 0.8, px: 2 }}
                  >
                    {sendingReply ? "Sending..." : "Send Reply"}
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Internal Notes Tab - Enhanced layout */}
            <Box
              sx={{
                display: tabValue === 1 ? "flex" : "none",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {/* Notes History - Better formatting */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: "auto",
                  p: { xs: 2, sm: 2.5 },
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {internalNotes.map((note) => (
                  <Paper
                    key={note.id}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        mb: 0.8,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: "secondary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {note.avatar}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {note.author}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.7rem",
                            color: "text.secondary",
                            lineHeight: 1.2,
                          }}
                        >
                          {note.date}
                        </Typography>
                      </Box>
                      <Chip
                        label="Internal Note"
                        size="small"
                        color="secondary"
                        variant="filled"
                        sx={{
                          height: 18,
                          "& .MuiChip-label": {
                            px: 0.8,
                            fontSize: "0.65rem",
                          },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.8rem", ml: 4 }}
                    >
                      {note.content}
                    </Typography>
                  </Paper>
                ))}
                <div ref={notesEndRef} />
              </Box>

              {/* Add Note Box - Improved styling */}
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mb: 0.8,
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  Add Internal Note (not visible to customer)
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <ReactQuill
                    theme="snow"
                    value={internalNote}
                    onChange={handleInternalNoteChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Add a note for internal reference..."
                    style={{
                      height: "120px",
                      marginBottom: "35px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleInternalNoteSubmit}
                    disabled={!internalNote.trim() || sendingNote}
                    startIcon={
                      sendingNote ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SaveIcon fontSize="small" sx={{ fontSize: 18 }} />
                      )
                    }
                    sx={{ fontSize: "0.8rem", py: 0.8, px: 2 }}
                  >
                    {sendingNote ? "Saving..." : "Add Note"}
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Activity Log Tab - Better styling */}
            <Box
              sx={{
                display: tabValue === 2 ? "flex" : "none",
                flexDirection: "column",
                height: "100%",
                overflow: "auto",
                p: { xs: 2, sm: 2.5 },
                bgcolor: "rgba(0, 0, 0, 0.02)",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1.5, fontWeight: 600, fontSize: "0.85rem" }}
              >
                Ticket Activity History
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <List sx={{ p: 0 }}>
                  {activityLog.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        sx={{
                          py: 1,
                          px: 2,
                          bgcolor: activity.isInternal
                            ? "rgba(33, 150, 243, 0.05)"
                            : "transparent",
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              bgcolor:
                                activity.type === "status"
                                  ? STATUSES.find(
                                      (s) => s.value === "In Progress"
                                    )?.color
                                  : activity.type === "priority"
                                  ? PRIORITIES.find(
                                      (p) => p.value === "Critical"
                                    )?.color
                                  : activity.isInternal
                                  ? "secondary.main"
                                  : "grey.600",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {activity.avatar}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.8,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: "0.8rem",
                                  lineHeight: 1.2,
                                }}
                              >
                                {activity.content}
                              </Typography>
                              {activity.isInternal && (
                                <Chip
                                  label="Internal"
                                  size="small"
                                  color="secondary"
                                  sx={{
                                    height: 18,
                                    "& .MuiChip-label": {
                                      px: 0.8,
                                      fontSize: "0.65rem",
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem", lineHeight: 1.2 }}
                            >
                              {activity.user} • {activity.timestamp}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Dialog Actions - Simple footer */}
      <DialogActions
        sx={{ px: 3, py: 1.5, borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}
      >
        <Button
          onClick={onClose}
          size="small"
          sx={{ fontSize: "0.8rem", px: 2 }}
        >
          Close
        </Button>
      </DialogActions>

      {/* Confirmation Dialog for Status Change */}
      <Dialog
        open={!!confirmStatusAction}
        onClose={handleCancelStatusChange}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 0.5,
          },
        }}
      >
        <DialogTitle sx={{ p: 2, fontSize: "1rem" }}>
          Confirm Status Change
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
            Are you sure you want to change the ticket status from{" "}
            <strong>{editedTicket.status}</strong> to{" "}
            <strong>{confirmStatusAction}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCancelStatusChange}
            size="small"
            sx={{ fontSize: "0.8rem" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            color="primary"
            variant="contained"
            size="small"
            disabled={updatingStatus}
            startIcon={
              updatingStatus ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{ fontSize: "0.8rem" }}
          >
            {updatingStatus ? "Updating..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: 1.5,
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.12)",
            "& .MuiAlert-message": {
              fontSize: "0.8rem",
            },
            "& .MuiAlert-icon": {
              fontSize: "1.1rem",
              marginRight: "8px",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default TicketDetailsViewComponent;
