import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Autocomplete,
  Grid,
  Snackbar,
  Alert,
  InputAdornment,
  FormControl,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Badge,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SubjectIcon from "@mui/icons-material/Subject";
import AttachmentIcon from "@mui/icons-material/Attachment";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import EmojiPicker from "emoji-picker-react";
import DraftsList from "./DraftList";
import { GridCloseIcon } from "@mui/x-data-grid";
import DraftsIcon from "@mui/icons-material/Drafts";

const colleges = ["MIT", "Stanford", "Harvard", "Caltech", "Oxford"];
const states = ["California", "New York", "Texas", "Florida", "Georgia"];
const domains = [
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Law",
];

const EmailDraft = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
    college: null,
    state: null,
    designation: "",
    domain: null,
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [touched, setTouched] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "to":
        if (!value) error = "Email is required";
        else if (!validateEmail(value)) error = "Invalid email format";
        break;
      case "subject":
        if (!value) error = "Subject is required";
        else if (value.length < 3)
          error = "Subject must be at least 3 characters";
        break;
      case "body":
        if (!value) error = "Body is required";
        else if (value.length < 10)
          error = "Body must be at least 10 characters";
        break;
      case "college":
      case "state":
      case "designation":
      case "domain":
      case "date":
        if (!value)
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        break;
      default:
        break;
    }
    return error;
  };

  const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.primary.main,
      height: 3,
      borderRadius: "3px 3px 0 0",
    },
    "& .MuiTabs-flexContainer": {
      justifyContent: "center",
    },
  }));

  const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    "&.Mui-selected": {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:hover": {
      color: theme.palette.primary.main,
      opacity: 1,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "& .MuiBadge-badge": {
      fontSize: 10,
      height: 20,
      minWidth: 20,
      padding: "0 4px",
    },
  }));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -15,
      top: -2,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, emailData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
    if (touched[name])
      setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleAutocompleteChange = (name, value) => {
    setEmailData({ ...emailData, [name]: value });
    if (touched[name])
      setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to Array
    setEmailData({
      ...emailData,
      attachments: [...emailData.attachments, ...newFiles],
    });
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...emailData.attachments];
    updatedAttachments.splice(index, 1);
    setEmailData({ ...emailData, attachments: updatedAttachments });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(emailData).forEach((name) => {
      const error = validateField(name, emailData[name]);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(
      Object.keys(emailData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (validateForm()) {
      setSnackbarMessage("Email sent successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      console.log("Email data:", { ...emailData, date });
    } else {
      setSnackbarMessage("Please fix the errors before submitting.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSaveDraft = () => {
    const newDraft = {
      ...emailData,
      date,
      id: new Date().toISOString(), // Unique ID for each draft
    };
    setDrafts([...drafts, newDraft]); // Add new draft to the list
    setSnackbarMessage("Draft saved successfully!");
    setSnackbarSeverity("info");
    setOpenSnackbar(true);
    setEmailData({
      to: "",
      subject: "",
      body: "",
      college: null,
      state: null,
      designation: "",
      domain: null,
      attachments: [],
    });
  };

  const handleEditDraft = (updatedDraft) => {
    setDrafts(
      drafts.map((draft) =>
        draft.id === updatedDraft.id ? updatedDraft : draft
      )
    );
  };

  const handleDeleteDraft = (id) => {
    setDrafts(drafts.filter((draft) => draft.id !== id));
  };

  const handleSendDraft = (draft) => {
    setSnackbarMessage(`Draft sent to ${draft.to}!`);
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: "auto", mt: 4 }}>
        <StyledTabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <StyledTab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body1">Compose Email</Typography>
              </Box>
            }
          />
          <StyledTab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StyledBadge badgeContent={drafts.length} color="secondary">
                  <DraftsIcon fontSize="small" />
                </StyledBadge>
                <Typography variant="body1">Draft List</Typography>
              </Box>
            }
          />
        </StyledTabs>

        {tabIndex === 0 && (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Left Column */}
              {/* <Grid item xs={12} md={6}> */}
              {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}> */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="To"
                  name="to"
                  value={emailData.to}
                  onChange={handleChange}
                  onBlur={() => handleBlur("to")}
                  error={touched.to && !!errors.to}
                  helperText={touched.to && errors.to}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={colleges}
                  value={emailData.college}
                  onChange={(e, newValue) =>
                    handleAutocompleteChange("college", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="College"
                      onBlur={() => handleBlur("college")}
                      error={touched.college && !!errors.college}
                      helperText={touched.college && errors.college}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SchoolIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      size="small"
                      required
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={states}
                  value={emailData.state}
                  onChange={(e, newValue) =>
                    handleAutocompleteChange("state", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      onBlur={() => handleBlur("state")}
                      error={touched.state && !!errors.state}
                      helperText={touched.state && errors.state}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      size="small"
                      required
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Designation"
                  name="designation"
                  value={emailData.designation}
                  onChange={handleChange}
                  onBlur={() => handleBlur("designation")}
                  error={touched.designation && !!errors.designation}
                  helperText={touched.designation && errors.designation}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  fullWidth
                  required
                />
              </Grid>
              {/* </Box> */}
              {/* </Grid> */}

              {/* Right Column */}
              {/* <Grid item xs={12} md={6}> */}
              {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}> */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={domains}
                  value={emailData.domain}
                  onChange={(e, newValue) =>
                    handleAutocompleteChange("domain", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Domain"
                      onBlur={() => handleBlur("domain")}
                      error={touched.domain && !!errors.domain}
                      helperText={touched.domain && errors.domain}
                      size="small"
                      required
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {/* <FormControl error={touched.date && !!errors.date}> */}
                <DatePicker
                  label="Sending Date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                    if (touched.date)
                      setErrors({
                        ...errors,
                        date: validateField("date", newValue),
                      });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      required
                      error={touched.date && !!errors.date}
                      onBlur={() => handleBlur("date")}
                    />
                  )}
                  minDate={new Date()}
                />
                {/* </FormControl> */}
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Subject"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleChange}
                  onBlur={() => handleBlur("subject")}
                  error={touched.subject && !!errors.subject}
                  helperText={touched.subject && errors.subject}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SubjectIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2">Email Body</Typography>
                  <ReactQuill
                    value={emailData.body}
                    onChange={(value) =>
                      setEmailData({ ...emailData, body: value })
                    }
                    placeholder="Compose email..."
                    style={{ height: 150 }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  {/* <Typography variant="subtitle2" sx={{ mb: 1, mt: 4 }}>
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
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {emailData.attachments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => handleRemoveAttachment(index)}
                        deleteIcon={<GridCloseIcon />}
                        color="info"
                        size="small"
                      />
                    ))}
                  </Box>
                </FormControl>
              </Grid>

              {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      color="primary"
                      component="label"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <AttachmentIcon />
                      <input type="file" hidden onChange={handleFileChange} />
                    </IconButton>
                    {emailData.attachment && (
                      <Chip
                        label={emailData.attachment.name}
                        onDelete={handleRemoveAttachment}
                        deleteIcon={<GridCloseIcon />}
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box> */}
              {/* </Box> */}
              {/* </Grid> */}

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Button
                    variant="contained"
                    color="info"
                    type="submit"
                    fullWidth
                    startIcon={<SendIcon />}
                    size="small"
                  >
                    Send Email
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSaveDraft}
                    startIcon={<SaveIcon />}
                    fullWidth
                    size="small"
                  >
                    Save Draft
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabIndex === 1 && (
          <DraftsList
            drafts={drafts}
            onEditDraft={handleEditDraft}
            onDeleteDraft={handleDeleteDraft}
            onSendDraft={handleSendDraft}
          />
        )}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ fontSize: "0.875rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default EmailDraft;
