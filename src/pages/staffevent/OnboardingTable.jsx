import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";

const OnboardingTable = ({ activities, loading, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editDialog, setEditDialog] = useState({
    open: false,
    activity: null,
    updateDate: dayjs().format("YYYY-MM-DD"),
    status: "",
    statusDescription: "",
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    activity: null,
  });

  const handleMenuOpen = (event, activity) => {
    setAnchorEl(event.currentTarget);
    setSelectedActivity(activity);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActivity(null);
  };

  const handleViewClick = () => {
    setViewDialog({
      open: true,
      activity: selectedActivity,
    });
    handleMenuClose();
  };

  const handleViewClose = () => {
    setViewDialog({
      open: false,
      activity: null,
    });
  };

  const handleEditClick = () => {
    setEditDialog({
      open: true,
      activity: selectedActivity,
      updateDate: dayjs().format("YYYY-MM-DD"),
      status: selectedActivity.current_status || "",
      statusDescription: "",
    });
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditDialog({
      open: false,
      activity: null,
      updateDate: dayjs().format("YYYY-MM-DD"),
      status: "",
      statusDescription: "",
    });
  };

  const handleEditSave = async () => {
    if (editDialog.activity && onUpdate) {
      const payload = {
        status: editDialog.status,
        status_date: editDialog.updateDate,
        description: editDialog.statusDescription,
      };

      const result = await onUpdate(editDialog.activity.id, payload);

      if (result.success) {
        alert(result.message);
        handleEditClose();
      } else {
        alert(result.message);
      }
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("completed")) return "success";
    if (statusLower.includes("progress")) return "warning";
    if (statusLower.includes("failed")) return "error";
    return "default";
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("completed"))
      return <CheckCircleIcon sx={{ fontSize: "1.25rem" }} />;
    if (statusLower.includes("progress"))
      return <HourglassEmptyIcon sx={{ fontSize: "1.25rem" }} />;
    if (statusLower.includes("failed"))
      return <CancelIcon sx={{ fontSize: "1.25rem" }} />;
    return null;
  };

  const getStepIconColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("completed")) return "#4CAF50";
    if (statusLower.includes("progress")) return "#FF9800";
    if (statusLower.includes("failed")) return "#EF4444";
    return "#9CA3AF";
  };

  const filteredActivities = activities.filter((activity) => {
    const query = searchQuery.toLowerCase();
    return (
      activity.institute?.institute_name?.toLowerCase().includes(query) ||
      activity.summary?.toLowerCase().includes(query) ||
      activity.current_status?.toLowerCase().includes(query) ||
      activity.start_date?.includes(query)
    );
  });

  const paginatedActivities = filteredActivities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by institute, summary, status, or date..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF", fontSize: "1.2rem" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
            },
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          mb: 1,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
              <TableCell sx={{ fontWeight: 600, color: "#374151", py: 1.5 }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151", py: 1.5 }}>
                Institute
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  py: 1.5,
                  minWidth: 180,
                }}
              >
                Summary
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151", py: 1.5 }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#374151", py: 1.5 }}>
                End Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, color: "#374151", py: 1.5, width: 50 }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    No activities found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedActivities.map((activity) => (
                <TableRow
                  key={activity.id}
                  sx={{
                    "&:hover": { backgroundColor: "#F9FAFB" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#374151", fontSize: "0.875rem" }}
                    >
                      {new Date(activity.start_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          year: "numeric",
                          month: "short",
                        }
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#374151",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      {activity.institute?.institute_name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontSize: "0.875rem",
                        maxWidth: 250,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {activity.summary}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={activity.current_status}
                      color={getStatusColor(activity.current_status)}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: "24px",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#374151", fontSize: "0.875rem" }}
                    >
                      {activity.end_date
                        ? new Date(activity.end_date).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            }
                          )
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }} align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, activity)}
                      sx={{
                        color: "#6B7280",
                        "&:hover": { backgroundColor: "#F3F4F6" },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredActivities.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          borderTop: "1px solid #E5E7EB",
          "& .MuiTablePagination-toolbar": {
            backgroundColor: "#FFFFFF",
            minHeight: "48px",
          },
        }}
      />

      {/* Three-dot menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            minWidth: "160px",
          },
        }}
      >
        <MenuItem
          onClick={handleViewClick}
          sx={{ py: 1, fontSize: "0.875rem" }}
        >
          <VisibilityIcon
            sx={{ mr: 1, fontSize: "1.1rem", color: "#9C27B0" }}
          />
          View Details
        </MenuItem>
        <MenuItem
          onClick={handleEditClick}
          sx={{ py: 1, fontSize: "0.875rem" }}
        >
          <EditIcon sx={{ mr: 1, fontSize: "1.1rem", color: "#2196F3" }} />
          Update Status
        </MenuItem>
      </Menu>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={handleViewClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Activity Details
          </Typography>
          <IconButton
            onClick={handleViewClose}
            size="small"
            sx={{ color: "#6B7280" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {viewDialog.activity && (
            <Box sx={{ pt: 2 }}>
              {/* Basic Information */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                  fontSize: "0.95rem",
                }}
              >
                Basic Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Start Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", fontWeight: 500 }}
                  >
                    {viewDialog.activity.start_date || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    End Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", fontWeight: 500 }}
                  >
                    {viewDialog.activity.end_date || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    State
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", fontWeight: 500 }}
                  >
                    {viewDialog.activity.state?.state_name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Institute
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", fontWeight: 500 }}
                  >
                    {viewDialog.activity.institute?.institute_name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Mode of Meeting
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", fontWeight: 500 }}
                  >
                    {viewDialog.activity.mode_of_meeting || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={viewDialog.activity.current_status}
                    color={getStatusColor(viewDialog.activity.current_status)}
                    size="small"
                    sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Status History with Stepper */}
              {viewDialog.activity.status_history &&
                viewDialog.activity.status_history.length > 0 && (
                  <React.Fragment>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#1F2937",
                        mb: 2,
                        fontSize: "0.95rem",
                      }}
                    >
                      Status History
                    </Typography>
                    <Stepper
                      orientation="vertical"
                      activeStep={viewDialog.activity.status_history.length}
                      sx={{ mb: 2 }}
                    >
                      {viewDialog.activity.status_history
                        .slice()
                        .reverse()
                        .map((item, index) => (
                          <Step key={index} active={true} completed={true}>
                            <StepLabel
                              StepIconComponent={() => (
                                <Box
                                  sx={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: getStepIconColor(
                                      item.status
                                    ),
                                    color: "#FFFFFF",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  {getStatusIcon(item.status)}
                                </Box>
                              )}
                              sx={{
                                "& .MuiStepLabel-label": {
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                  color: "#374151",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#374151",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {item.status}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#6B7280",
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {item.status_date}
                                </Typography>
                              </Box>
                            </StepLabel>
                            <StepContent>
                              {item.description && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#6B7280",
                                    fontSize: "0.813rem",
                                    mt: 0.5,
                                    mb: 1.5,
                                  }}
                                >
                                  {item.description}
                                </Typography>
                              )}
                            </StepContent>
                          </Step>
                        ))}
                    </Stepper>

                    <Divider sx={{ my: 2 }} />
                  </React.Fragment>
                )}

              {/* Contact Persons */}
              {viewDialog.activity.contact_persons &&
                viewDialog.activity.contact_persons.length > 0 && (
                  <React.Fragment>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#1F2937",
                        mb: 2,
                        fontSize: "0.95rem",
                      }}
                    >
                      Contact Persons
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        mb: 3,
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                            <TableCell
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            >
                              Designation
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            >
                              Phone
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            >
                              WhatsApp
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {viewDialog.activity.contact_persons.map(
                            (person, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontSize: "0.813rem" }}>
                                  {person.name || "-"}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.813rem" }}>
                                  {person.email || "-"}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.813rem" }}>
                                  {person.designation || "-"}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.813rem" }}>
                                  {person.phone || "-"}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.813rem" }}>
                                  {person.whatsapp || "-"}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Divider sx={{ my: 2 }} />
                  </React.Fragment>
                )}

              {/* Attendees */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                  fontSize: "0.95rem",
                }}
              >
                Attendees
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    From Institute
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", fontSize: "0.875rem" }}
                  >
                    {viewDialog.activity.institute_attendees || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.75rem", mb: 0.5 }}
                  >
                    From Own Side
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", fontSize: "0.875rem" }}
                  >
                    {viewDialog.activity.own_attendees || "-"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Summary */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                  fontSize: "0.95rem",
                }}
              >
                Summary
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                >
                  {viewDialog.activity.summary || "No summary available"}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleViewClose}
            variant="contained"
            sx={{
              backgroundColor: "#2196F3",
              "&:hover": { backgroundColor: "#1976D2" },
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#1F2937", pb: 1 }}>
          Update Status
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "#374151", fontWeight: 600, mb: 1 }}
            >
              Status Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              value={editDialog.updateDate}
              onChange={(e) =>
                setEditDialog((prev) => ({
                  ...prev,
                  updateDate: e.target.value,
                }))
              }
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Typography
              variant="body2"
              sx={{ color: "#374151", fontWeight: 600, mb: 1 }}
            >
              Status
            </Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={editDialog.status}
              onChange={(e) =>
                setEditDialog((prev) => ({ ...prev, status: e.target.value }))
              }
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </TextField>

            <Typography
              variant="body2"
              sx={{ color: "#374151", fontWeight: 600, mb: 1 }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter status description..."
              value={editDialog.statusDescription}
              onChange={(e) =>
                setEditDialog((prev) => ({
                  ...prev,
                  statusDescription: e.target.value,
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleEditClose}
            sx={{
              color: "#6B7280",
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45A049" },
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnboardingTable;
