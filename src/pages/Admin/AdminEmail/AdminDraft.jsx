import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper,
  Autocomplete,
  Grid,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Attachment as AttachmentIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const colleges = ["MIT", "Stanford", "Harvard", "Caltech", "Oxford"];
const states = ["California", "New York", "Texas", "Florida", "Georgia"];
const domains = [
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Law",
];

const AdminDraft = ({
  drafts = [],
  onEditDraft,
  onDeleteDraft,
  onSendDraft,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editedDraft, setEditedDraft] = useState(null);
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null);

  const handleEditClick = (draft) => {
    setEditingId(draft.id);
    setEditedDraft({ ...draft });
    setExpandedPanel(draft.id);
  };

  const handleSaveClick = () => {
    onEditDraft(editedDraft);
    setEditingId(null);
    setEditedDraft(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedDraft(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setEditedDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteClick = (draft) => {
    setDraftToDelete(draft);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteDraft(draftToDelete.id);
    setDeleteConfirmOpen(false);
    setDraftToDelete(null);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setEditedDraft((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newFiles],
    }));
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...(editedDraft.attachments || [])];
    updatedAttachments.splice(index, 1);
    setEditedDraft((prev) => ({ ...prev, attachments: updatedAttachments }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Saved Drafts ({drafts.length})
      </Typography>

      <Box sx={{ mt: 2 }}>
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <Accordion
              key={draft.id}
              expanded={expandedPanel === draft.id}
              onChange={handleAccordionChange(draft.id)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <Typography sx={{ flex: 1 }}>
                    {draft.subject || "Untitled Draft"}
                  </Typography>
                  <Chip
                    size="small"
                    label={formatDate(draft.id)}
                    icon={<AccessTimeIcon />}
                  />
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />

                {editingId === draft.id ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="To"
                        name="to"
                        value={editedDraft.to}
                        onChange={handleFieldChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Subject"
                        name="subject"
                        value={editedDraft.subject}
                        onChange={handleFieldChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={colleges}
                        value={editedDraft.college}
                        onChange={(e, newValue) =>
                          handleAutocompleteChange("college", newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="College" size="small" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={states}
                        value={editedDraft.state}
                        onChange={(e, newValue) =>
                          handleAutocompleteChange("state", newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="State" size="small" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Designation"
                        name="designation"
                        value={editedDraft.designation}
                        onChange={handleFieldChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={domains}
                        value={editedDraft.domain}
                        onChange={(e, newValue) =>
                          handleAutocompleteChange("domain", newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Domain" size="small" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Sending Date"
                          value={editedDraft.date}
                          onChange={(newValue) =>
                            setEditedDraft((prev) => ({
                              ...prev,
                              date: newValue,
                            }))
                          }
                          renderInput={(params) => (
                            <TextField {...params} size="small" fullWidth />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Typography variant="subtitle2">Email Body</Typography>
                      <ReactQuill
                        value={editedDraft.body}
                        onChange={(value) =>
                          setEditedDraft((prev) => ({ ...prev, body: value }))
                        }
                        placeholder="Compose email..."
                        style={{ height: 150 }}
                      />
                    </Grid>

                    {/* Multiple File Upload Section */}
                    <Grid item xs={12}>
                      {/* <Typography variant="subtitle2" >
                        Attachments
                      </Typography> */}
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AttachmentIcon />}
                        sx={{ mt: 4 }}
                      >
                        Upload Files
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={handleFileChange}
                        />
                      </Button>
                      <Box
                        mt={1}
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {editedDraft.attachments &&
                          editedDraft.attachments.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleRemoveAttachment(index)}
                              color="info"
                              size="small"
                            />
                          ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        sx={{ mt: 2 }}
                      >
                        <Button
                          startIcon={<CancelIcon />}
                          onClick={handleCancelEdit}
                          color="inherit"
                        >
                          Cancel
                        </Button>
                        <Button
                          startIcon={<SaveIcon />}
                          onClick={handleSaveClick}
                          variant="contained"
                          color="primary"
                        >
                          Save Changes
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                ) : (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>To:</strong> {draft.to}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Subject:</strong> {draft.subject}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Body:</strong> {draft.body}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>College:</strong> {draft.college || "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>State:</strong> {draft.state || "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Designation:</strong> {draft.designation || "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Domain:</strong> {draft.domain || "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Date:</strong>{" "}
                      {draft.date ? formatDate(draft.date) : "-"}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Tooltip title="Send Draft">
                        <IconButton
                          color="primary"
                          onClick={() => onSendDraft(draft)}
                          size="small"
                        >
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Draft">
                        <IconButton
                          color="info"
                          onClick={() => handleEditClick(draft)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Draft">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(draft)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            <EmailIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">No drafts saved yet</Typography>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the draft "
            {draftToDelete?.subject || "Untitled Draft"}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AdminDraft;
