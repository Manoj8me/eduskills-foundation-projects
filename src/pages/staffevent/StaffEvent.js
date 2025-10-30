import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  MenuItem,
  Box,
  FormControl,
  Select,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import { Icon } from "@iconify/react/dist/iconify.js";
import AddDetailsDrawer from "../../components/StaffSection/StaffInternship/AddDetailsDrawer";
import AddEventDetailsDrawer from "./AddEventDetailsDrawer";
import AddEventDetailsCard from "./AddEventDetailsDrawer";

const DashboardEventForm = () => {
  const [formData, setFormData] = useState({
    institute: null,
    eventType: "",
    domain: "",
    date: "",
    remarks: "",
    category: "",
    facultyName: "",
    branch: "",
    year: "",
  });
  const [institutes, setInstitutes] = useState([]);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("accessToken");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);

  useEffect(() => {
    // Fetch Institutes from API when component mounts
    axios
      .get(`${BASE_URL}/staff/institute`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInstitutes(response.data.data); // Assuming the API returns an array of institutes
      })
      .catch((error) => {
        console.error("There was an error fetching the institutes!", error);
      });
  }, [token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAutocompleteChange = (event, newValue) => {
    setFormData({ ...formData, institute: newValue });
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.institute) {
      formErrors.institute = "Institute is required";
    }

    if (!formData.eventType) {
      formErrors.eventType = "Event Type is required";
    }

    if (!formData.date) {
      formErrors.date = "Date is required";
    }

    if (!formData.remarks) {
      formErrors.remarks = "Remarks are required";
    }

    // Add conditional validation for other fields
    if (
      (formData.eventType === "EDP" ||
        formData.eventType === "FDP" ||
        formData.eventType === "TechCamp") &&
      !formData.domain
    ) {
      formErrors.domain = "Domain is required for this event type";
    }

    if (formData.eventType === "Connect Award") {
      if (!formData.category) {
        formErrors.category = "Category is required for Connect Award";
      }
      if (!formData.facultyName) {
        formErrors.facultyName = "Faculty Name is required for Connect Award";
      }
    }

    if (formData.eventType === "Career Talk" && !formData.branch) {
      formErrors.branch = "Branch is required for Career Talk";
    }

    setErrors(formErrors);

    // If there are no errors, return true
    return Object.keys(formErrors).length === 0;
  };

  const handleEventTypeChange = (event) => {
    const selectedEventType = event.target.value;
    setSelectedEvent(selectedEventType);
    // setIsEventDrawerOpen(true); // Open the drawer when an event type is selected
  };

  // const handleEventOpenDrawer = () => {
  //   setIsEventDrawerOpen(true);
  // };

  const handleEventCloseDrawer = () => {
    setIsEventDrawerOpen(false);
    setSelectedEvent("");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form Submitted:", formData);
      // Handle form submission here, likely an API call
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <>
      <Card
        style={{
          maxWidth: "90%",
          margin: "8px auto",
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Institute Details
            </Typography>

            {/* Button to Add Institute Details */}
            <Grid item xs={4} container justifyContent="flex-end">
              <Button
                variant="contained"
                color="info"
                size="small"
                sx={{
                  textTransform: "initial",
                  maxHeight: 28,
                  marginBottom: 1,
                }}
                startIcon={<Icon icon="mdi:college-outline" />}
                onClick={handleOpenDrawer}
              >
                Add Institute Details
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card
        style={{
          maxWidth: "90%",
          margin: "8px auto",
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>

            {/* Button to Add Institute Details */}
            <Grid item xs={4} container justifyContent="flex-end">
              <FormControl sx={{ width: 150 }}>
                <Select
                  value={selectedEvent}
                  onChange={handleEventTypeChange}
                  displayEmpty
                  variant="outlined"
                  size="small"
                  color="info"
                  sx={{
                    backgroundColor: "#0288d1", // Button-like color (blue)
                    color: "#fff", // Text color (white)
                    padding: "6px 16px", // Button-like padding
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow
                    height: "30px", // Set a specific height for the select
                    minHeight: "30px", // Ensure it doesn’t stretch taller
                    "& .MuiSelect-icon": {
                      display: "none", // Hide the dropdown icon
                    },
                    "&:hover": {
                      backgroundColor: "#1565c0", // Darker shade on hover
                    },
                  }}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                      }}
                    >
                      {selected ? selected : <>Add Event Details</>}
                    </Box>
                  )}
                >
                  <MenuItem disabled value="">
                    Add Event Details
                  </MenuItem>
                  <MenuItem value="EDP">EDP</MenuItem>
                  <MenuItem value="FDP">FDP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* <Card
        style={{
          maxWidth: "90%",
          margin: "20px auto",
          backgroundColor: "#fff",
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            borderTop: "20px solid",
            borderLeft: "12px solid",
            borderRight: "12px solid",
            borderBottom: "8px solid",
            borderColor: "#bbdefb", // Material UI blue color
            padding: 2,
          }}
        >
          <CardContent sx={{ borderRadius: "10px" }}>
            <Typography variant="h6" mb={5} gutterBottom>
              Add Event/Service Details
            </Typography>
            

            <form>
              <Grid container spacing={2}>
               
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={institutes}
                    getOptionLabel={(option) => option.institute_name || ""}
                    value={formData.institute}
                    onChange={handleAutocompleteChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Institute"
                        fullWidth
                        size="small"
                        error={!!errors.institute}
                        helperText={errors.institute}
                      />
                    )}
                  />
                </Grid>

                
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Event Type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    error={!!errors.eventType}
                    helperText={errors.eventType}
                  >
                    <MenuItem value="EDP">EDP</MenuItem>
                    <MenuItem value="FDP">FDP</MenuItem>
                    <MenuItem value="TechCamp">TechCamp</MenuItem>
                    <MenuItem value="Connect Award">Connect Award</MenuItem>
                    <MenuItem value="Publication Details">
                      Publication Details
                    </MenuItem>
                    <MenuItem value="Career Talk">Career Talk</MenuItem>
                    <MenuItem value="Student Briefing">
                      Student Briefing
                    </MenuItem>
                    <MenuItem value="Faculty Briefing">
                      Faculty Briefing
                    </MenuItem>
                  </TextField>
                </Grid>

                
                {(formData.eventType === "EDP" ||
                  formData.eventType === "FDP" ||
                  formData.eventType === "TechCamp") && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Domain"
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      fullWidth
                      size="small"
                      error={!!errors.domain}
                      helperText={errors.domain}
                    />
                  </Grid>
                )}

                
                {formData.eventType === "Connect Award" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Select Year"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                      >
                        {Array.from({ length: 20 }, (_, i) => (
                          <MenuItem key={i} value={2024 - i}>
                            {2024 - i}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                        error={!!errors.category}
                        helperText={errors.category}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Faculty Name"
                        name="facultyName"
                        value={formData.facultyName}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                        error={!!errors.facultyName}
                        helperText={errors.facultyName}
                      />
                    </Grid>
                  </>
                )}

                
                {formData.eventType === "Career Talk" && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      fullWidth
                      size="small"
                      error={!!errors.branch}
                      helperText={errors.branch}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    error={!!errors.date}
                    helperText={errors.date}
                  />
                </Grid>

                
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Remarks (Student Count)"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    error={!!errors.remarks}
                    helperText={errors.remarks}
                  />
                </Grid>

                
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Box>
      </Card> */}
      <AddDetailsDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
      {selectedEvent && (
        <AddEventDetailsCard
          eventType={selectedEvent}
          onSubmit={() => setSelectedEvent("")}
        />
      )}
    </>
  );
};

export default DashboardEventForm;
