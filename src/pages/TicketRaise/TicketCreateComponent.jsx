import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Available categories
const CATEGORIES = [
  "IT",
  "HR",
  "Finance",
  "Development",
  "Marketing",
  "Sales",
  "Customer Support",
  "Operations",
];

// Priority levels
const PRIORITIES = [
  { value: "Low", color: "#4caf50" },
  { value: "Medium", color: "#ff9800" },
  { value: "High", color: "#f44336" },
  { value: "Critical", color: "#9c27b0" },
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

const TicketCreateComponent = ({ onTicketCreate }) => {
  // State for the new ticket form
  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
    category: null,
    priority: PRIORITIES[1], // Default to Medium
    files: [],
  });

  // State for file preview/management
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);

  // State for validation errors
  const [errors, setErrors] = useState({});

  // State for loading status
  const [isLoading, setIsLoading] = useState(false);

  // State for drag and drop
  const [isDragging, setIsDragging] = useState(false);

  // State for toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Generate a new ticket ID
  const generateTicketId = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `TKT-${randomId}`;
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

    const newFiles = [...ticketData.files, ...filteredFiles];

    // Create preview URLs for images
    const newFilePreviewUrls = filteredFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    });

    setTicketData({
      ...ticketData,
      files: newFiles,
    });

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
    const updatedFiles = [...ticketData.files];
    updatedFiles.splice(index, 1);

    const updatedPreviews = [...filePreviewUrls];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    updatedPreviews.splice(index, 1);

    setTicketData({
      ...ticketData,
      files: updatedFiles,
    });
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle Quill editor change for description
  const handleQuillChange = (content) => {
    setTicketData({
      ...ticketData,
      description: content,
    });

    // Clear error for description if it exists
    if (errors.description) {
      setErrors({
        ...errors,
        description: "",
      });
    }
  };

  // Handle autocomplete changes
  const handleAutocompleteChange = (name, value) => {
    setTicketData({
      ...ticketData,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!ticketData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Check if description has actual content (handling HTML content)
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = ticketData.description;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (!textContent.trim()) {
      newErrors.description = "Description is required";
    }

    if (!ticketData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        open: true,
        message: "Please fix the errors in the form",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const newTicket = {
        id: generateTicketId(),
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority.value,
        status: "Open",
        date: new Date().toISOString().split("T")[0],
        files: ticketData.files.map((file) => file.name),
      };

      // Reset form
      setTicketData({
        title: "",
        description: "",
        category: null,
        priority: PRIORITIES[1],
        files: [],
      });
      setFilePreviewUrls([]);

      setIsLoading(false);

      // Show success notification
      setToast({
        open: true,
        message: `Ticket ${newTicket.id} created successfully!`,
        severity: "success",
      });

      // Call parent callback with new ticket
      if (onTicketCreate) {
        onTicketCreate(newTicket);
      }
    }, 1500);
  };

  // Handle toast close
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          border: "1px solid rgba(0, 0, 0, 0.04)",
        }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ticket Title"
                  name="title"
                  value={ticketData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="Briefly describe your issue"
                  InputProps={{
                    sx: { borderRadius: 1 },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  size="small"
                  options={CATEGORIES}
                  value={ticketData.category}
                  onChange={(e, newValue) =>
                    handleAutocompleteChange("category", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      error={!!errors.category}
                      helperText={errors.category}
                      InputProps={{
                        ...params.InputProps,
                        sx: { borderRadius: 1 },
                      }}
                    />
                  )}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  size="small"
                  options={PRIORITIES}
                  getOptionLabel={(option) => option.value}
                  value={ticketData.priority}
                  onChange={(e, newValue) =>
                    handleAutocompleteChange(
                      "priority",
                      newValue || PRIORITIES[1]
                    )
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: option.color,
                          mr: 1,
                        }}
                      />
                      {option.value}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Priority"
                      InputProps={{
                        ...params.InputProps,
                        sx: { borderRadius: 1 },
                        startAdornment: ticketData.priority ? (
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: ticketData.priority.color,
                              ml: 1,
                              mr: -0.5,
                            }}
                          />
                        ) : null,
                      }}
                    />
                  )}
                  disableClearable
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  color={errors.description ? "error" : "textSecondary"}
                  sx={{ mb: 0.5, display: "block" }}
                >
                  Description *
                </Typography>
                <Box
                  sx={{
                    "& .quill": {
                      borderRadius: 1,
                      border: errors.description
                        ? "1px solid #d32f2f"
                        : "1px solid rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        borderColor: errors.description
                          ? "#d32f2f"
                          : "rgba(0, 0, 0, 0.87)",
                      },
                      "&:focus-within": {
                        borderColor: errors.description ? "#d32f2f" : "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                    "& .ql-toolbar": {
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                      borderTopLeftRadius: 1,
                      borderTopRightRadius: 1,
                    },
                    "& .ql-container": {
                      borderBottom: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      borderBottomLeftRadius: 1,
                      borderBottomRightRadius: 1,
                      minHeight: "100px",
                    },
                    "& .ql-editor": {
                      minHeight: "100px",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                    },
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={ticketData.description}
                    onChange={handleQuillChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Please provide details about your issue"
                    readOnly={isLoading}
                  />
                </Box>
                {errors.description && (
                  <Typography variant="caption" color="error" sx={{ pl: 1 }}>
                    {errors.description}
                  </Typography>
                )}
              </Grid>

              {/* File Upload Section */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                    borderRadius: 1.5,
                    border: isDragging
                      ? "2px dashed #1976d2"
                      : "2px dashed rgba(25, 118, 210, 0.3)",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 1,
                      py: ticketData.files.length === 0 ? 2 : 0,
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
                      disabled={isLoading}
                    />

                    {ticketData.files.length === 0 && (
                      <>
                        <CloudUploadIcon
                          sx={{
                            color: "primary.main",
                            fontSize: 36,
                            mb: 1,
                            opacity: 0.8,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="primary.main"
                          fontWeight={500}
                          align="center"
                        >
                          Drag & drop files here
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          align="center"
                          sx={{ mt: 0.5 }}
                        >
                          Or click to browse files (10MB max per file)
                        </Typography>
                      </>
                    )}

                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                          disabled={isLoading}
                          size="small"
                          sx={{
                            borderStyle: "dashed",
                            fontSize: "0.75rem",
                            p: "3px 8px",
                            "&:hover": {
                              borderStyle: "dashed",
                              bgcolor: "rgba(25, 118, 210, 0.08)",
                            },
                          }}
                        >
                          {ticketData.files.length === 0
                            ? "Upload Files"
                            : "Add More Files"}
                        </Button>
                      </label>
                    </Box>
                  </Box>

                  {/* Image Preview Modal */}
                  {ticketData.files.some((file) =>
                    file.type.startsWith("image/")
                  ) && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1 }}
                      >
                        Image Previews
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        {ticketData.files.map((file, index) =>
                          file.type.startsWith("image/") &&
                          filePreviewUrls[index] ? (
                            <Box
                              key={`preview-${index}`}
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "8px",
                                overflow: "hidden",
                                cursor: "pointer",
                                border: "1px solid rgba(0, 0, 0, 0.08)",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                },
                              }}
                              onClick={() => {
                                // Open full-size image preview in a new tab
                                window.open(filePreviewUrls[index], "_blank");
                              }}
                            >
                              <img
                                src={filePreviewUrls[index]}
                                alt={file.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </Box>
                          ) : null
                        )}
                      </Box>
                    </Box>
                  )}
                  {ticketData.files.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <AttachFileIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {ticketData.files.length}{" "}
                        {ticketData.files.length === 1 ? "file" : "files"}{" "}
                        attached
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          maxHeight: "200px",
                          overflowY:
                            ticketData.files.length > 3 ? "auto" : "visible",
                          pr: 1,
                        }}
                      >
                        {ticketData.files.map((file, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 1,
                              borderRadius: 1,
                              bgcolor: "background.paper",
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                overflow: "hidden",
                                width: "100%",
                              }}
                            >
                              {file.type.startsWith("image/") &&
                              filePreviewUrls[index] ? (
                                <Box
                                  sx={{
                                    mr: 1,
                                    width: 40,
                                    height: 40,
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                    border: "1px solid rgba(0, 0, 0, 0.08)",
                                  }}
                                >
                                  <img
                                    src={filePreviewUrls[index]}
                                    alt={file.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    mr: 1,
                                    width: 32,
                                    height: 32,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "4px",
                                    bgcolor: "rgba(0, 0, 0, 0.04)",
                                    fontSize: "16px",
                                    flexShrink: 0,
                                  }}
                                >
                                  {getFileTypeIcon(file)}
                                </Box>
                              )}
                              <Box sx={{ overflow: "hidden" }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: { xs: "150px", sm: "250px" },
                                  }}
                                >
                                  {file.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {formatFileSize(file.size)}
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              size="small"
                              onClick={() => handleRemoveFile(index)}
                              sx={{
                                minWidth: "auto",
                                p: 0.5,
                                color: "text.secondary",
                                "&:hover": {
                                  bgcolor: "rgba(0, 0, 0, 0.04)",
                                  color: "error.main",
                                },
                              }}
                            >
                              ×
                            </Button>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Submit Button with Loader */}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendIcon sx={{ fontSize: 16 }} />
                    )
                  }
                  sx={{ px: 2, py: 0.75, fontSize: "0.75rem" }}
                >
                  {isLoading ? "Submitting..." : "Submit Ticket"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>

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
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.15)",
            "& .MuiAlert-message": {
              fontSize: "0.8rem",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TicketCreateComponent;
