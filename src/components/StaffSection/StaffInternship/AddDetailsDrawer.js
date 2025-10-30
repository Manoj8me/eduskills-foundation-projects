import React, { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Box,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../services/configUrls";

const AddDetailsDrawer = ({ open, onClose }) => {
  const [instituteData, setInstituteData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [category, setCategory] = useState("");
  const [isWhatsAppSame, setIsWhatsAppSame] = useState(false);
  const [formData, setFormData] = useState({
    instituteName: "",
    designation: "",
    name: "",
    email: "",
    mobileNo: "",
    whatsappNo: "",
    branch: "",
  });
  const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  //   const instituteList = useSelector(
  //     (state) => state.staffEducator.instituteList
  //   );
  const token = localStorage.getItem("accessToken");

  // Management and Faculty Designation Options
  const managementDesignations = [
    "SECRETARY CORRESPONDENT",
    "PRESIDENT",
    "CEO",
    "MANEGING DIRECTOR",
    "VICE - CHANCELLOR",
    "PRO VICE - CHANCELLOR",
    "CHANCELLOR",
    "CHAIRMAN",
    "REGISTRAR",
    "PRINCIPAL",
    "DIRECTOR",
    "DEAN",
  ];

  const facultyDesignations = [
    "TPO",
    "AERONAUTICAL ENGINEERING HOD",
    "AGRICULTURE ENGINEERING HOD",
    "AI & DS HOD",
    "AIE HOD",
    "AI-ML HOD",
    "AUTOMATION AND ROBOTICS HOD",
    "AUTOMOBILE ENGINEERING HOD",
    "BBA HOD",
    "BCA HOD",
    "BIOMEDICAL ENGINEERING HOD",
    "BIOTECHNOLOGY HOD",
    "BME HOD",
    "BSC ITM HOD",
    "CBCBT HOD",
    "CBZ HOD",
    "CHEMICAL ENGINEERING HOD",
    "CIVIL HOD",
    "CMBBT HOD",
    "COMPUTER APPLICATIONS HOD",
    "COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE HOD",
    "COMPUTER SCIENCE AND TECHNOLOGY (CST) HOD",
    "COMPUTER SCIENCE ENGINEERING HOD",
    "CS & BS HOD",
    "CSE HOD",
    "CYBER SECURITY HOD",
    "DATA SCIENCE ( DS) HOD",
    "ECE HOD",
    "EE HOD",
    "EEE HOD",
    "EIE - ELECTRONICS AND INSTRUMENTATION ENGINEERING HOD",
    "ELECTRICAL & ELECTRONICS ENGINEERING HOD",
    "ELECTRONICA & COMMUNICATION ENGINEERING HOD",
    "ELECTRONICS AND COMPUTER SCIENCE (ECS) HOD",
    "ETC HOD",
    "FIRE AND SAFETY ENGINEERING HOD",
    "IOT BLOCKCHAIN AND CYBERSECURITY HOD",
    "IT HOD",
    "MBA HOD",
    "MBBCBT HOD",
    "MCA HOD",
    "MECHANICAL ENGINEERING HOD",
    "MECS HOD",
    "MMS HOD",
    "MPC HOD",
    "MPCS HOD",
    "MSCS HOD",
    "VLSI DESIGN AND TECHNOLOGY HOD",
    "OTHER HOD",
  ];

  useEffect(() => {
    // Fetch institute data from API
    axios
      .get(`${BASE_URL}/staff/institute`, {
        headers: {
          Authorization: `Bearer ${token}`, // replace 'token' with your actual token variable
        },
      })
      .then((response) => {
        console.log(response);
        setInstituteData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching institute data:", error);
      });

    // Fetch branch data from API when faculty is selected
    if (category === "faculty") {
      axios.get("/api/branches").then((response) => {
        setBranchData(response.data);
      });
    }

    // Clear the designation field if no category is selected
    if (!category) {
      setFormData((prevFormData) => ({ ...prevFormData, designation: "" }));
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobile) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.instituteName)
      newErrors.instituteName = "Institute name is required.";
    if (!formData.designation)
      newErrors.designation = "Designation is required.";
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.mobileNo || !validateMobile(formData.mobileNo)) {
      newErrors.mobileNo = "Valid mobile number is required.";
    }
    if (!formData.whatsappNo || !validateMobile(formData.whatsappNo)) {
      newErrors.whatsappNo = "Valid WhatsApp number is required.";
    }

    // Branch validation: Required unless designation is "TPO"
    if (
      category === "faculty" &&
      formData.designation !== "TPO" &&
      !formData.branch
    ) {
      newErrors.branch = "Branch is required for faculty (except TPO).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setOpenModal(true); // Trigger the confirmation modal if validation passes
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    // Submit logic goes here
  };

  const handleWhatsAppCheck = () => {
    setIsWhatsAppSame(!isWhatsAppSame);
    if (!isWhatsAppSame) {
      setFormData({ ...formData, whatsappNo: formData.mobileNo });
    }
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        style={{
          width: "500px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          height: "100%",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          style={{
            backgroundColor: "#e0e0e0",
            padding: "6px",
            textAlign: "left",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          Add Institute Details
        </Typography>

        <Grid container spacing={2}>
          {/* Institute Name Dropdown */}
          <Grid item xs={6}>
            <FormControl
              fullWidth
              margin="dense"
              size="small"
              error={!!errors.instituteName}
            >
              <Autocomplete
                options={instituteData}
                getOptionLabel={(option) => option.institute_name}
                onChange={(e, value) =>
                  setFormData({
                    ...formData,
                    instituteName: value?.institute_name || "",
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Institute Name"
                    error={!!errors.instituteName}
                    helperText={errors.instituteName}
                    size="small"
                  />
                )}
              />
              {errors.instituteName && (
                <Typography color="error">{errors.instituteName}</Typography>
              )}
            </FormControl>
          </Grid>

          {/* Category Dropdown */}
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense" size="small">
              <Autocomplete
                options={["Management", "Administration", "Academy Leaders"]}
                getOptionLabel={(option) => option}
                onChange={(e, value) => setCategory(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Category" size="small" />
                )}
              />
            </FormControl>
          </Grid>

          {/* Designation Dropdown */}
          <Grid item xs={6}>
            <FormControl
              fullWidth
              margin="dense"
              size="small"
              error={!!errors.designation}
              disabled={!category} // Disable if no category is selected
            >
              <InputLabel>Designation</InputLabel>
              <Select
                value={formData.designation}
                name="designation"
                onChange={handleInputChange}
              >
                {category === "Management" || category === "Administration"
                  ? managementDesignations.map((designation) => (
                      <MenuItem key={designation} value={designation}>
                        {designation}
                      </MenuItem>
                    ))
                  : facultyDesignations.map((designation) => (
                      <MenuItem key={designation} value={designation}>
                        {designation}
                      </MenuItem>
                    ))}
              </Select>
              {errors.designation && (
                <Typography color="error">{errors.designation}</Typography>
              )}
            </FormControl>
          </Grid>

          {/* Show Branch dropdown in parallel to WhatsApp No. */}
          {category === "Academy Leaders" && (
            <Grid item xs={6}>
              <FormControl
                fullWidth
                margin="dense"
                size="small"
                error={!!errors.branch}
              >
                <Autocomplete
                  options={branchData}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, value) =>
                    setFormData({ ...formData, branch: value?.name || "" })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch"
                      error={!!errors.branch}
                      helperText={errors.branch}
                      size="small"
                      disabled={!category}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          )}

          {/* Inputs for Name, Email, Mobile No., WhatsApp No., and Branch */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              size="small"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              size="small"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="Mobile No."
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              size="small"
              error={!!errors.mobileNo}
              helperText={errors.mobileNo}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="WhatsApp No."
              name="whatsappNo"
              value={formData.whatsappNo}
              onChange={handleInputChange}
              size="small"
              error={!!errors.whatsappNo}
              helperText={errors.whatsappNo}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isWhatsAppSame}
                  onChange={handleWhatsAppCheck}
                  color="primary"
                  size="small"
                />
              }
              label="Same as Mobile No."
            />
          </Grid>

          {/* Checkbox Under WhatsApp No. */}
          <Grid item xs={12}></Grid>
        </Grid>

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={onClose}
            style={{ marginRight: "10px" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit these details?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle form submission logic here
              setOpenModal(false);
              onClose();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default AddDetailsDrawer;
