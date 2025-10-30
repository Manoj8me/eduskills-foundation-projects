import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Box,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import axios from 'axios';
import { BASE_URL } from "../../../services/configUrls";

export const ITSupportModals = ({
  selectedRow,
  categories,
  fetchUserCategories,
  handleSupportStatusToggle,
  handleSuccessMessage,
  handleErrorMessage,
  authToken,
}) => {
  const theme = useTheme();

  // States for categories modal
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedUserCategories, setSelectedUserCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [switchLoadingStates, setSwitchLoadingStates] = useState({});

  // States for Update Meeting Link Modal
  const [isUpdateMeetingModalOpen, setIsUpdateMeetingModalOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingLinkError, setMeetingLinkError] = useState("");
  const [isUpdatingMeeting, setIsUpdatingMeeting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // States for Add to Category Modal
  const [isAddToCategoryModalOpen, setIsAddToCategoryModalOpen] = useState(false);
  const [selectedCategoryForAdd, setSelectedCategoryForAdd] = useState("");
  const [isAddingToCategory, setIsAddingToCategory] = useState(false);
  const [addToCategoryError, setAddToCategoryError] = useState("");

  // Watch for selectedRow changes to trigger modals
  useEffect(() => {
    if (selectedRow && selectedRow.user_id) {
      // This will be handled by button clicks from parent component
    }
  }, [selectedRow]);

  // Categories modal functions
  const openCategoriesModal = async (row) => {
    if (!row) return;
    
    setSelectedUserEmail(row.email);
    setSelectedUserId(row.user_id);
    setIsCategoriesModalOpen(true);
    setLoadingCategories(true);
    setSwitchLoadingStates({});
    
    try {
      const categories = await fetchUserCategories(row.user_id);
      setSelectedUserCategories(categories || []);
    } catch (error) {
      console.error('Error fetching user categories:', error);
      handleErrorMessage('Failed to fetch user categories');
      setSelectedUserCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCloseCategoriesModal = () => {
    setIsCategoriesModalOpen(false);
    setSelectedUserCategories([]);
    setSelectedUserEmail("");
    setSwitchLoadingStates({});
    setSelectedUserId(null);
  };

  // Update Meeting Link Modal functions
  const openUpdateMeetingModal = (row) => {
    if (!row) return;
    
    setSelectedUserId(row.user_id);
    setSelectedUserEmail(row.email);
    setMeetingLink(row.google_meet_link || "");
    setMeetingLinkError("");
    setIsUpdateMeetingModalOpen(true);
  };

  const handleCloseMeetingModal = () => {
    setIsUpdateMeetingModalOpen(false);
    setMeetingLink("");
    setMeetingLinkError("");
    setSelectedUserId(null);
    setSelectedUserEmail("");
  };

  // Add to Category Modal functions
  const openAddToCategoryModal = (row) => {
    if (!row) return;
    
    setSelectedUserId(row.user_id);
    setSelectedUserEmail(row.email);
    setSelectedCategoryForAdd("");
    setAddToCategoryError("");
    setIsAddToCategoryModalOpen(true);
  };

  const handleCloseAddToCategoryModal = () => {
    setIsAddToCategoryModalOpen(false);
    setSelectedCategoryForAdd("");
    setAddToCategoryError("");
    setSelectedUserId(null);
    setSelectedUserEmail("");
  };

  // Validate Google Meet Link
  const validateMeetingLink = (link) => {
    if (!link.trim()) {
      return "Meeting link is required";
    }
    
    const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
    if (!googleMeetRegex.test(link.trim())) {
      return "Please enter a valid Google Meet link (e.g., https://meet.google.com/abc-defg-hij)";
    }
    
    return "";
  };

  // Handle Meeting Link Update
  const handleConfirmMeetingUpdate = async () => {
    const error = validateMeetingLink(meetingLink);
    if (error) {
      setMeetingLinkError(error);
      return;
    }

    setIsUpdatingMeeting(true);
    
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/updateGoogleMeet`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        data: JSON.stringify({
          user_id: selectedUserId,
          google_meet_link: meetingLink.trim()
        })
      };

      const response = await axios.request(config);
      console.log('Meeting link updated:', response.data);
      
      handleSuccessMessage("Google Meet link updated successfully");
      handleCloseMeetingModal();
      
    } catch (error) {
      console.error('Error updating meeting link:', error);
      handleErrorMessage(error.response?.data?.detail || 'Failed to update meeting link');
    } finally {
      setIsUpdatingMeeting(false);
    }
  };

  // Handle Add to Category
  const handleConfirmAddToCategory = async () => {
    if (!selectedCategoryForAdd) {
      setAddToCategoryError("Please select a category");
      return;
    }

    setIsAddingToCategory(true);
    
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/createNewSupportUser`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        data: JSON.stringify({
          user_id: selectedUserId,
          category: selectedCategoryForAdd
        })
      };

      const response = await axios.request(config);
      console.log('User added to category:', response.data);
      
      handleSuccessMessage("User successfully added to category");
      handleCloseAddToCategoryModal();
      
      // Refresh categories if modal is open
      if (isCategoriesModalOpen) {
        const categories = await fetchUserCategories(selectedUserId);
        setSelectedUserCategories(categories || []);
      }
      
    } catch (error) {
      console.error('Error adding user to category:', error);
      handleErrorMessage(error.response?.data?.detail || 'Failed to add user to category');
    } finally {
      setIsAddingToCategory(false);
    }
  };

  // Handle toggle switch for support status
  const handleStatusToggle = async (supportProfileId, currentStatus) => {
    const newStatus = currentStatus === "1" ? "0" : "1";
    
    setSwitchLoadingStates(prev => ({
      ...prev,
      [supportProfileId]: true
    }));

    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/updateSupportStatus`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        data: JSON.stringify({
          support_profile_id: supportProfileId,
          is_active: newStatus
        })
      };

      const response = await axios.request(config);
      console.log('Status updated:', response.data);
      
      // Update local state
      setSelectedUserCategories(prevCategories => 
        prevCategories.map(category => 
          category.support_profile_id === supportProfileId 
            ? { ...category, is_active: newStatus }
            : category
        )
      );
      
      handleSuccessMessage(`Support status ${newStatus === "1" ? "activated" : "deactivated"} successfully`);
      
    } catch (error) {
      console.error('Error updating support status:', error);
      handleErrorMessage('Failed to update support status');
    } finally {
      setSwitchLoadingStates(prev => {
        const newStates = { ...prev };
        delete newStates[supportProfileId];
        return newStates;
      });
    }
  };

  // Expose functions to parent component
  window.handleViewCategories = openCategoriesModal;
  window.handleAddToCategory = openAddToCategoryModal;
  window.handleUpdateMeetingLink = openUpdateMeetingModal;

  return (
    <>
      {/* View Categories Modal */}
      <Dialog
        open={isCategoriesModalOpen}
        onClose={handleCloseCategoriesModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="eva:list-fill" width={24} height={24} />
            <Typography variant="h6">
              Support Categories for {selectedUserEmail}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {loadingCategories ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
              }}
            >
              <CircularProgress color="info" size={40} />
              <Typography ml={2}>Loading categories...</Typography>
            </Box>
          ) : selectedUserCategories.length > 0 ? (
            <Box>
              <Typography variant="body1" color="text.secondary" mb={2}>
                This support staff member is assigned to the following categories. Use the toggle switches to activate/deactivate each category:
              </Typography>
              <List>
                {selectedUserCategories.map((category, index) => (
                  <Box key={index}>
                    <ListItem
                      sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        p: 2,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Icon icon="eva:folder-outline" width={20} height={20} color={theme.palette.primary?.main || "#1976d2"} />
                              <Typography variant="h6" color="primary" sx={{ textTransform: 'capitalize' }}>
                                {category.name}
                              </Typography>
                              <Chip
                                label={category.is_active === "1" ? "Active" : "Inactive"}
                                color={category.is_active === "1" ? "success" : "error"}
                                size="small"
                              />
                            </Box>
                            
                            <Box display="flex" alignItems="center" gap={1}>
                              {switchLoadingStates[category.support_profile_id] && (
                                <CircularProgress size={16} color="primary" />
                              )}
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={category.is_active === "1"}
                                    onChange={() => handleStatusToggle(
                                      category.support_profile_id, 
                                      category.is_active
                                    )}
                                    disabled={switchLoadingStates[category.support_profile_id]}
                                    color="success"
                                    size="small"
                                  />
                                }
                                label={
                                  <Typography variant="caption" color="text.secondary">
                                    {category.is_active === "1" ? "Active" : "Inactive"}
                                  </Typography>
                                }
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Profile ID:</strong> {category.support_profile_id}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={3}>
                              <Typography variant="caption" color="text.secondary">
                                <Icon icon="eva:calendar-outline" width={14} height={14} style={{ marginRight: 4 }} />
                                <strong>Created:</strong> {new Date(category.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                              {category.updated_at !== category.created_at && (
                                <Typography variant="caption" color="text.secondary">
                                  <Icon icon="eva:edit-outline" width={14} height={14} style={{ marginRight: 4 }} />
                                  <strong>Updated:</strong> {new Date(category.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
  
              </List>
              <Box mt={2} p={2} bgcolor="info.light" borderRadius={1}>
                <Typography variant="body2" color="white">
                  <Icon icon="eva:info-fill" width={16} height={16} style={{ marginRight: 8 }} />
                  Total Categories: {selectedUserCategories.length} | 
                  Active: {selectedUserCategories.filter(cat => cat.is_active === "1").length} | 
                  Inactive: {selectedUserCategories.filter(cat => cat.is_active === "0").length}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                textAlign: "center",
              }}
            >
              <Icon icon="eva:inbox-outline" width={64} height={64} color="#ccc" />
              <Typography variant="h6" color="text.secondary" mt={2}>
                No Categories Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This support staff member has no categories assigned.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseCategoriesModal}
            variant="contained"
            color="primary"
            startIcon={<Icon icon="eva:close-fill" />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add to Category Modal */}
      <Dialog
        open={isAddToCategoryModalOpen}
        onClose={handleCloseAddToCategoryModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="eva:plus-circle-fill" width={24} height={24} color={theme.palette.success?.main || "#4caf50"} />
            <Typography variant="h6">
              Add User to Category
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Box mb={3}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Add <strong>{selectedUserEmail}</strong> to a support category
            </Alert>
          </Box>

          <FormControl fullWidth error={!!addToCategoryError}>
            <InputLabel>Select Category</InputLabel>
            <Select
              value={selectedCategoryForAdd}
              label="Select Category"
              onChange={(e) => {
                setSelectedCategoryForAdd(e.target.value);
                if (addToCategoryError) {
                  setAddToCategoryError("");
                }
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon icon="eva:folder-outline" width={16} height={16} />
                    <Typography>{category.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {addToCategoryError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {addToCategoryError}
              </Typography>
            )}
          </FormControl>

          <Box 
            sx={{ 
              mt: 3,
              p: 2, 
              bgcolor: 'warning.light', 
              borderRadius: 1,
              border: 1,
              borderColor: 'warning.main',
            }}
          >
            <Typography variant="body2" color="warning.dark">
              <Icon icon="eva:info-fill" width={16} height={16} style={{ marginRight: 8 }} />
              <strong>Note:</strong> This will assign the selected category to the support staff member.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseAddToCategoryModal}
            variant="outlined"
            color="inherit"
            disabled={isAddingToCategory}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAddToCategory}
            variant="contained"
            color="success"
            disabled={isAddingToCategory || !selectedCategoryForAdd}
            startIcon={
              isAddingToCategory ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Icon icon="eva:plus-fill" />
              )
            }
          >
            {isAddingToCategory ? "Adding..." : "Add to Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Meeting Link Modal */}
      <Dialog
        open={isUpdateMeetingModalOpen}
        onClose={handleCloseMeetingModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="eva:video-fill" width={24} height={24} color={theme.palette.primary?.main || "#1976d2"} />
            <Typography variant="h6">
              Update Google Meet Link
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Update the Google Meet link for <strong>{selectedUserEmail}</strong>
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Google Meet Link"
            placeholder="https://meet.google.com/abc-defg-hij"
            value={meetingLink}
            onChange={(e) => {
              setMeetingLink(e.target.value);
              if (meetingLinkError) {
                setMeetingLinkError("");
              }
            }}
            error={!!meetingLinkError}
            helperText={meetingLinkError || "Enter a valid Google Meet link"}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  <Icon icon="eva:video-outline" width={20} height={20} color={theme.palette.grey?.[500] || "#9e9e9e"} />
                </Box>
              ),
            }}
          />

          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'info.light', 
              borderRadius: 1,
              border: 1,
              borderColor: 'info.main',
            }}
          >
            <Typography variant="caption" color="info.dark">
              <Icon icon="eva:info-fill" width={16} height={16} style={{ marginRight: 8 }} />
              <strong>Format:</strong> https://meet.google.com/xxx-xxxx-xxx
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseMeetingModal}
            variant="outlined"
            color="inherit"
            disabled={isUpdatingMeeting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmMeetingUpdate}
            variant="contained"
            color="primary"
            disabled={isUpdatingMeeting || !meetingLink.trim()}
            startIcon={
              isUpdatingMeeting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Icon icon="eva:save-fill" />
              )
            }
          >
            {isUpdatingMeeting ? "Updating..." : "Update Link"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
