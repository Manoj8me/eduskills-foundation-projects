import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Autocomplete,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
  LocationOn as LocationIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material";

const OnboardingForm = ({ onSubmit, statesInstitutes }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    stateId: "",
    instituteId: "",
    modeOfMeeting: "",
    currentStatus: "",
    statusDescription: "",
    summaryText: "",
    instituteAttendees: "",
    ownAttendees: "",
  });

  const [contactPersons, setContactPersons] = useState([
    {
      id: 1,
      name: "",
      email: "",
      designation: "",
      phone: "",
      whatsapp: "",
      sameAsPhone: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [states, setStates] = useState([]);
  const [institutes, setInstitutes] = useState([]);

  const meetingModes = ["Physical", "Virtual"];
  const statusOptions = ["Completed", "In Progress", "Failed"];

  // Extract unique states from statesInstitutes prop
  useEffect(() => {
    if (statesInstitutes && statesInstitutes.length > 0) {
      const uniqueStates = Array.from(
        new Map(statesInstitutes.map((item) => [item.state_id, item])).values()
      ).map((item) => ({
        id: item.state_id,
        name: item.state_name,
      }));

      setStates(uniqueStates);
    }
  }, [statesInstitutes]);

  // Update institutes when state changes
  useEffect(() => {
    if (formData.stateId && statesInstitutes) {
      const filteredInstitutes = statesInstitutes
        .filter((item) => item.state_id === formData.stateId)
        .map((item) => ({
          id: item.institute_id,
          name: item.institute_name,
        }));
      setInstitutes(filteredInstitutes);
    } else {
      setInstitutes([]);
    }
    // Reset institute selection when state changes
    if (formData.instituteId) {
      setFormData((prev) => ({ ...prev, instituteId: "" }));
    }
  }, [formData.stateId, statesInstitutes]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddContactPerson = () => {
    setContactPersons((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        email: "",
        designation: "",
        phone: "",
        whatsapp: "",
        sameAsPhone: false,
      },
    ]);
  };

  const handleRemoveContactPerson = (id) => {
    if (contactPersons.length > 1) {
      setContactPersons((prev) => prev.filter((person) => person.id !== id));
    }
  };

  const handleContactPersonChange = (id, field, value) => {
    setContactPersons((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, [field]: value } : person
      )
    );
  };

  const handleSameAsPhoneChange = (id, checked) => {
    setContactPersons((prev) =>
      prev.map((person) => {
        if (person.id === id) {
          return {
            ...person,
            sameAsPhone: checked,
            whatsapp: checked ? person.phone : person.whatsapp,
          };
        }
        return person;
      })
    );
  };

  const handlePhoneChange = (id, value) => {
    setContactPersons((prev) =>
      prev.map((person) => {
        if (person.id === id) {
          return {
            ...person,
            phone: value,
            whatsapp: person.sameAsPhone ? value : person.whatsapp,
          };
        }
        return person;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Call the onSubmit function passed from parent
      const result = await onSubmit({
        ...formData,
        contactPersons,
      });

      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });

        // Reset form
        handleCancel();
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to save activity",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      startDate: "",
      endDate: "",
      stateId: "",
      instituteId: "",
      modeOfMeeting: "",
      currentStatus: "",
      statusDescription: "",
      summaryText: "",
      instituteAttendees: "",
      ownAttendees: "",
    });
    setContactPersons([
      {
        id: 1,
        name: "",
        email: "",
        designation: "",
        phone: "",
        whatsapp: "",
        sameAsPhone: false,
      },
    ]);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Date and Location Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.813rem",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="State"
              value={formData.stateId}
              onChange={(e) => handleInputChange("stateId", e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.813rem",
                },
              }}
            >
              {states.map((state) => (
                <MenuItem
                  key={state.id}
                  value={state.id}
                  sx={{ fontSize: "0.813rem" }}
                >
                  {state.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={institutes}
              getOptionLabel={(option) => option.name}
              value={
                institutes.find((inst) => inst.id === formData.instituteId) ||
                null
              }
              onChange={(event, newValue) =>
                handleInputChange("instituteId", newValue?.id || "")
              }
              disabled={!formData.stateId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Institute"
                  placeholder="Search for institute..."
                  size="small"
                />
              )}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.813rem",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Mode of Meeting"
              value={formData.modeOfMeeting}
              onChange={(e) =>
                handleInputChange("modeOfMeeting", e.target.value)
              }
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.813rem",
                },
              }}
            >
              {meetingModes.map((mode) => (
                <MenuItem key={mode} value={mode} sx={{ fontSize: "0.813rem" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {mode === "Physical" ? (
                      <LocationIcon
                        sx={{ fontSize: "1rem", color: "#4CAF50" }}
                      />
                    ) : (
                      <VideoCallIcon
                        sx={{ fontSize: "1rem", color: "#2196F3" }}
                      />
                    )}
                    {mode}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Person Section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          {" "}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PeopleIcon sx={{ color: "#FF9800", fontSize: "1.1rem" }} />
            <Typography
              variant="subtitle2"
              sx={{ color: "#1F2937", fontWeight: 600, fontSize: "0.875rem" }}
            >
              Contact Persons
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: "1rem" }} />}
            onClick={handleAddContactPerson}
            sx={{
              backgroundColor: "#2196F3",
              "&:hover": { backgroundColor: "#1976D2" },
              textTransform: "none",
              borderRadius: "6px",
              fontSize: "0.75rem",
              py: 0.5,
              px: 1.5,
            }}
          >
            Add Person
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            overflowX: "auto",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#F8FAFC",
                  borderBottom: "1px solid #D1D5DB",
                }}
              >
                <TableCell sx={{ borderRight: "1px solid #E5E7EB", py: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.75rem",
                    }}
                  >
                    Name
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB", py: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.75rem",
                    }}
                  >
                    Email
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB", py: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.75rem",
                    }}
                  >
                    Designation
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB", py: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.75rem",
                    }}
                  >
                    Phone No.
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB", py: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.75rem",
                    }}
                  >
                    WhatsApp No.
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "0.75rem",
                    }}
                  >
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contactPersons.map((person, index) => (
                <TableRow
                  key={person.id}
                  sx={{
                    "&:hover": { backgroundColor: "#F9FAFB" },
                    "& td": {
                      borderBottom:
                        index === contactPersons.length - 1
                          ? "none"
                          : "1px solid #E5E7EB",
                      py: 0.75,
                    },
                  }}
                >
                  <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter name"
                      value={person.name}
                      onChange={(e) =>
                        handleContactPersonChange(
                          person.id,
                          "name",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                        },
                        "& .MuiOutlinedInput-input": {
                          py: 0.75,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter email"
                      type="email"
                      value={person.email}
                      onChange={(e) =>
                        handleContactPersonChange(
                          person.id,
                          "email",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                        },
                        "& .MuiOutlinedInput-input": {
                          py: 0.75,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter designation"
                      value={person.designation}
                      onChange={(e) =>
                        handleContactPersonChange(
                          person.id,
                          "designation",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                        },
                        "& .MuiOutlinedInput-input": {
                          py: 0.75,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter phone"
                      value={person.phone}
                      onChange={(e) =>
                        handlePhoneChange(person.id, e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                        },
                        "& .MuiOutlinedInput-input": {
                          py: 0.75,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter WhatsApp"
                        value={person.whatsapp}
                        onChange={(e) =>
                          handleContactPersonChange(
                            person.id,
                            "whatsapp",
                            e.target.value
                          )
                        }
                        disabled={person.sameAsPhone}
                        sx={{
                          mb: 0.5,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                          },
                          "& .MuiOutlinedInput-input": {
                            py: 0.75,
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={person.sameAsPhone}
                            onChange={(e) =>
                              handleSameAsPhoneChange(
                                person.id,
                                e.target.checked
                              )
                            }
                            size="small"
                            sx={{
                              py: 0,
                              "& .MuiSvgIcon-root": { fontSize: "1rem" },
                            }}
                          />
                        }
                        label="Same as Phone"
                        sx={{
                          m: 0,
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                            color: "#6B7280",
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveContactPerson(person.id)}
                      disabled={contactPersons.length === 1}
                      sx={{
                        color: "#EF4444",
                        "&:hover": { backgroundColor: "#FEE2E2" },
                        "&:disabled": { color: "#D1D5DB" },
                        p: 0.5,
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Summary Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
          <DescriptionIcon sx={{ color: "#9C27B0", fontSize: "1.1rem" }} />
          <Typography
            variant="subtitle2"
            sx={{ color: "#1F2937", fontWeight: 600, fontSize: "0.875rem" }}
          >
            Summary
          </Typography>
        </Box>

        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Attendees from Institute"
              placeholder="e.g., Dr. John Doe, Prof. Jane Smith"
              value={formData.instituteAttendees}
              onChange={(e) =>
                handleInputChange("instituteAttendees", e.target.value)
              }
              multiline
              rows={2}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.813rem",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Attendees from Own Side"
              placeholder="e.g., Team Member 1, Team Member 2"
              value={formData.ownAttendees}
              onChange={(e) =>
                handleInputChange("ownAttendees", e.target.value)
              }
              multiline
              rows={2}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.813rem",
                },
              }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Summary Details"
          placeholder="Enter a detailed summary of the onboarding activity..."
          value={formData.summaryText}
          onChange={(e) => handleInputChange("summaryText", e.target.value)}
          multiline
          rows={3}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              fontSize: "0.813rem",
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.813rem",
            },
          }}
        />
      </Box>

      {/* Current Status Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: "#374151",
            fontWeight: 600,
            mb: 1,
            fontSize: "0.813rem",
          }}
        >
          Current Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={statusOptions}
              value={formData.currentStatus}
              onChange={(event, newValue) =>
                handleInputChange("currentStatus", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select status..."
                  size="small"
                />
              )}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Status description..."
              value={formData.statusDescription}
              onChange={(e) =>
                handleInputChange("statusDescription", e.target.value)
              }
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.813rem",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Submit Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          pt: 2,
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          size="small"
          disabled={loading}
          sx={{
            color: "#6B7280",
            borderColor: "#D1D5DB",
            "&:hover": {
              borderColor: "#9CA3AF",
              backgroundColor: "#F9FAFB",
            },
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            py: 1,
            fontSize: "0.875rem",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              <SaveIcon sx={{ fontSize: "1rem" }} />
            )
          }
          onClick={handleSubmit}
          size="small"
          disabled={loading}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#45A049" },
            "&:disabled": { backgroundColor: "#9CA3AF" },
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            py: 1,
            fontSize: "0.875rem",
          }}
        >
          {loading ? "Saving..." : "Save Activity"}
        </Button>
      </Box>
    </Box>
  );
};

export default OnboardingForm;
