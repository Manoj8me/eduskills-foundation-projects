import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Grid,
  Typography,
  Collapse,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

const AddEventDetailsCard = ({ eventType, onSubmit }) => {
  const [eventDetails, setEventDetails] = React.useState({
    // event_id: "",
    event_name: "",
    domain: "",
    hosted_by: "",
    create_date: null,
    start_date: null,
    end_date: null,
    participants_count: "",
    completion_count: "",
    remarks: "",
    // status: "",
  });

  const [errors, setErrors] = React.useState({});
  const [open, setOpen] = React.useState(true); // State to control open/close animation
  const token = localStorage.getItem("accessToken");
  const [domains, setDomains] = React.useState([]);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.post(
          `https://erpapi.eduskillsfoundation.org/internship/domain`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDomains(response.data); // assuming domains is the array in response
        // console.log(response.data,"domains");

      } catch (error) {
        console.error("Failed to fetch domains:", error);
      }
    };
    fetchDomains();
  }, [token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventDetails({ ...eventDetails, [name]: value });

    // Clear error when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const handleDateChange = (date, name) => {
    setEventDetails({ ...eventDetails, [name]: date });
    setErrors({ ...errors, [name]: "" });
  };

  const handleDomainChange = (event, newValue) => {
    setEventDetails({ ...eventDetails, domain: newValue });
    setErrors({ ...errors, domain: "" });
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(eventDetails).forEach((key) => {
      // Exclude optional fields from validation
      if (
        !["completion_count", "remarks"].includes(key) &&
        (!eventDetails[key] ||
          (typeof eventDetails[key] === "string" && !eventDetails[key].trim()))
      ) {
        newErrors[key] = "This field is required";
        console.log(`Validation failed for field: ${key}`); // Log which field is failing
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Event Details Submitted:", eventDetails);
      // Handle form submission here, likely an API call
      // Only close or reset form if validation passes.
    } else {
      console.log("Validation failed.");
    }
  };

  const handleClose = () => {
    setOpen(false); // Trigger the collapse animation
    setTimeout(onSubmit, 300); // Wait for the animation to finish before actually closing
  };

  return (
    <Collapse in={open} timeout={300}>
      <Card
        style={{
          maxWidth: "90%",
          margin: "8px auto",
          backgroundColor: "#fff",
        }}
        sx={{
          borderTop: "20px solid",
          borderLeft: "12px solid",
          borderRight: "12px solid",
          borderBottom: "8px solid",
          borderColor: "#bbdefb", // Material UI blue color
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            style={{
              padding: "6px",
              textAlign: "left",
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
            gutterBottom
          >
            {eventType} Details
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={4}>
                <TextField
                  label="Event ID"
                  name="event_id"
                  value={eventDetails.event_id}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={Boolean(errors.event_id)}
                  helperText={errors.event_id || ""}
                />
              </Grid> */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Event Name"
                  name="event_name"
                  value={eventDetails.event_name}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={Boolean(errors.event_name)}
                  helperText={errors.event_name || ""}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                {/* <TextField
                  label="Domain"
                  name="domain"
                  value={eventDetails.domain}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={Boolean(errors.domain)}
                  helperText={errors.domain || ""}
                /> */}

                <Autocomplete
                  options={domains}
                  getOptionLabel={(option) => option.domain_name || ""}
                  onChange={handleDomainChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Domain"
                      fullWidth
                      size="small"
                      error={Boolean(errors.domain)}
                      helperText={errors.domain || ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Hosted By"
                  name="hosted_by"
                  value={eventDetails.hosted_by}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={Boolean(errors.hosted_by)}
                  helperText={errors.hosted_by || ""}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Create Date"
                  views={["year", "month", "day"]}
                  value={eventDetails.create_date}
                  onChange={(date) => handleDateChange(date, "create_date")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={Boolean(errors.create_date)}
                      helperText={errors.create_date || ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Start Date"
                  views={["year", "month", "day"]}
                  value={eventDetails.start_date}
                  onChange={(date) => handleDateChange(date, "start_date")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={Boolean(errors.start_date)}
                      helperText={errors.start_date || ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="End Date"
                  value={eventDetails.end_date}
                  views={["year", "month", "day"]}
                  onChange={(date) => handleDateChange(date, "end_date")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={Boolean(errors.end_date)}
                      helperText={errors.end_date || ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Participants Count"
                  name="participants_count"
                  value={eventDetails.participants_count}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={Boolean(errors.participants_count)}
                  helperText={errors.participants_count || ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Completion Count"
                  name="completion_count"
                  value={eventDetails.completion_count}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={Boolean(errors.completion_count)}
                  helperText={errors.completion_count || ""}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <TextField
                  label="Status"
                  name="status"
                  value={eventDetails.status}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={Boolean(errors.status)}
                  helperText={errors.status || ""}
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={eventDetails.remarks}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  error={Boolean(errors.remarks)}
                  helperText={errors.remarks || ""}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-start", padding: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose} // Only close when this button is clicked
            size="small"
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit}
            size="small"
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </Collapse>
  );
};

export default AddEventDetailsCard;
