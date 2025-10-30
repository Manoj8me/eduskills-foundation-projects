import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Typography,
  useTheme,
  styled,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";
import {
  fetchStudentMetricsWithFilters,
  setSelectedFilters,
  clearMetricsData, // Import the action to clear data when needed
} from "../../../store/Slices/studentnewmetric/studentNewMetricsSlice";
import SchoolIcon from "@mui/icons-material/School";
import api from "../../../services/api";

// Styled components for modern UI
const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #2979ff 100%)",
  padding: theme.spacing(4),
  borderRadius: "12px 12px 0 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#ffffff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const StyledDialogContent = styled(DialogContent)(({ theme, isDarkMode }) => ({
  padding: theme.spacing(4),
  backgroundColor: isDarkMode ? "#1a1a1a" : "#f7f9fc",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
  color: "#ffffff",
  borderRadius: "30px",
  padding: "10px 40px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    background: "linear-gradient(90deg, #1a237e 0%, #3f51b5 100%)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
  },
}));

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
    borderRadius: "10px",
    "& fieldset": {
      borderColor: isDarkMode ? "#444444" : "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: isDarkMode ? "#666666" : "#bbdefb",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2979ff",
    },
  },
  "& .MuiInputLabel-root": {
    color: isDarkMode ? "#bbbbbb" : "#666666",
  },
}));

const InstituteSelectionModal = ({ onClose }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const dispatch = useDispatch();

  // Initialize state variables with empty arrays to prevent "undefined.map" errors
  const [states, setStates] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stateInputValue, setStateInputValue] = useState("");
  const [instituteInputValue, setInstituteInputValue] = useState("");
  const [formError, setFormError] = useState("");
  const [open, setOpen] = useState(true);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  // Function to fetch student information options (states and institutes)
  const fetchStudentInformationOptions = async () => {
    setLoading(true);
    console.log("Fetching student information options...");
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(
        `${BASE_URL}/internship/studentInformationOptions4`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API response:", response.data);

      // Extract states and institutes from the response
      const filterData = response.data.filterData || [];

      // Find state data
      const stateData = filterData.find(
        (filter) => filter.id === "stateStatus"
      );
      if (stateData && stateData.options) {
        console.log("States loaded:", stateData.options.length);
        setStates(stateData.options);
      } else {
        console.log("No states found in API response");
        setStates([]); // Ensure states is always an array
      }

      // Find institute data (but don't set yet as it depends on selected state)
      const instituteData = filterData.find(
        (filter) => filter.id === "instituteStatus"
      );
      if (instituteData && instituteData.options) {
        console.log("Institutes loaded:", instituteData.options.length);
        // Store all institutes, will filter based on selected state
        setAllInstitutes(instituteData.options);
      } else {
        console.log("No institutes found in API response");
        setAllInstitutes([]); // Ensure allInstitutes is always an array
      }

      // Mark data as fetched
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching student information options:", error);
      // Ensure arrays are initialized even on error
      setStates([]);
      setAllInstitutes([]);
      setInstitutes([]);
    } finally {
      setLoading(false);
      // After data is loaded, check for previously selected values
      setTimeout(() => {
        checkStoredSelections();
      }, 100);
    }
  };

  // Check for previously stored selections
  const checkStoredSelections = () => {
    console.log("Checking stored selections");
    const storedStateId = localStorage.getItem("selectedStateId");
    const storedStateName = localStorage.getItem("selectedStateName");
    const storedInstituteId = localStorage.getItem("selectedInstituteId");
    const storedInstituteName = localStorage.getItem("selectedInstituteName");

    console.log("Stored state ID:", storedStateId);
    console.log("States available:", states.length);

    // If we have stored state and institute, pre-select them
    if (storedStateId && states && states.length > 0) {
      const foundState = states.find(
        (state) => state && state.state_id === storedStateId
      );
      if (foundState) {
        console.log("Found matching state:", foundState.state_name);
        setSelectedState(foundState);

        // Filter institutes based on this state
        if (allInstitutes && allInstitutes.length > 0) {
          const stateInstitutes = allInstitutes.filter(
            (institute) =>
              institute && institute.state_id === foundState.state_id
          );
          setInstitutes(stateInstitutes || []);

          // Find selected institute
          if (
            storedInstituteId &&
            stateInstitutes &&
            stateInstitutes.length > 0
          ) {
            const foundInstitute = stateInstitutes.find(
              (institute) =>
                institute && institute.institue_id === storedInstituteId
            );
            if (foundInstitute) {
              console.log(
                "Found matching institute:",
                foundInstitute.institute_name
              );
              setSelectedInstitute(foundInstitute);
            }
          }
        }
      }
    }
  };

  // Fetch data on component mount or when the modal opens
  useEffect(() => {
    // Always reload data when modal is displayed
    if (open) {
      console.log("Modal opened, fetching options");

      // Reset any previous selections
      setSelectedState(null);
      setSelectedInstitute(null);
      setInstitutes([]);

      // Fetch fresh data from API
      fetchStudentInformationOptions();
    }
  }, [open]); // Depend on the 'open' state to reload when modal opens

  // Handle state change
  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue);
    setSelectedInstitute(null); // Reset selected institute when state changes
    setFormError("");

    if (newValue) {
      console.log("State selected:", newValue.state_name);
      // Filter institutes based on selected state
      const filteredInstitutes = (allInstitutes || []).filter(
        (institute) => institute && institute.state_id === newValue.state_id
      );
      console.log("Filtered institutes:", filteredInstitutes.length);
      setInstitutes(filteredInstitutes);
    } else {
      setInstitutes([]);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (!selectedState || !selectedInstitute) {
      setFormError("Please select both a state and an institute");
      return;
    }

    // Create state and institute objects with consistent property names
    const stateObj = {
      id: selectedState.state_id,
      name: selectedState.state_name,
    };

    const instituteObj = {
      id: selectedInstitute.institue_id,
      name: selectedInstitute.institute_name,
    };

    console.log("Submitting selection:", stateObj, instituteObj);

    // Update Redux state with selected filters
    dispatch(
      setSelectedFilters({
        state: stateObj,
        institute: instituteObj,
      })
    );

    // Save the selected state and institute details to localStorage
    localStorage.setItem("selectedStateId", selectedState.state_id);
    localStorage.setItem("selectedStateName", selectedState.state_name);
    localStorage.setItem("selectedInstituteId", selectedInstitute.institue_id);
    localStorage.setItem(
      "selectedInstituteName",
      selectedInstitute.institute_name
    );

    // Dispatch action to fetch metrics with selected filters
    dispatch(
      fetchStudentMetricsWithFilters({
        state_id: selectedState.state_id,
        institute_id: selectedInstitute.institue_id,
        state_name: selectedState.state_name,
        institute_name: selectedInstitute.institute_name,
      })
    );

    // Close the dialog
    setOpen(false);

    // Call the onClose callback to notify parent component
    if (onClose) {
      console.log("Closing modal");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <GradientBox>
        <SchoolIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Welcome to Institution Dashboard
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", opacity: 0.9 }}>
          Please select your state and institution to continue
        </Typography>
      </GradientBox>

      <StyledDialogContent isDarkMode={isDarkMode}>
        {loading && !dataFetched ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: isDarkMode ? "#e0e0e0" : "#424242",
                }}
              >
                State*
              </Typography>
              <Autocomplete
                id="state-select"
                options={states || []}
                getOptionLabel={(option) => option?.state_name || ""}
                value={selectedState}
                onChange={handleStateChange}
                inputValue={stateInputValue}
                onInputChange={(_, newInputValue) => {
                  setStateInputValue(newInputValue);
                }}
                loading={loading}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    placeholder="Select State"
                    fullWidth
                    isDarkMode={isDarkMode}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="primary" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                sx={{ mb: 3 }}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: isDarkMode ? "#e0e0e0" : "#424242",
                }}
              >
                Institution*
              </Typography>
              <Autocomplete
                id="institute-select"
                options={institutes || []}
                getOptionLabel={(option) => option?.institute_name || ""}
                value={selectedInstitute}
                onChange={(_, newValue) => {
                  setSelectedInstitute(newValue);
                  setFormError("");
                }}
                inputValue={instituteInputValue}
                onInputChange={(_, newInputValue) => {
                  setInstituteInputValue(newInputValue);
                }}
                loading={loading && selectedState}
                disabled={!selectedState}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    placeholder={
                      selectedState
                        ? "Select Institution"
                        : "Please select a state first"
                    }
                    fullWidth
                    isDarkMode={isDarkMode}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && selectedState ? (
                            <CircularProgress color="primary" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {formError && (
              <Typography
                color="error"
                variant="body2"
                sx={{
                  mt: 3,
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: isDarkMode
                    ? "rgba(211, 47, 47, 0.1)"
                    : "rgba(211, 47, 47, 0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(211, 47, 47, 0.3)",
                }}
              >
                {formError}
              </Typography>
            )}
          </>
        )}
      </StyledDialogContent>

      <DialogActions
        sx={{
          px: 4,
          py: 3,
          justifyContent: "center",
          backgroundColor: isDarkMode ? "#1a1a1a" : "#f7f9fc",
        }}
      >
        <StyledButton
          onClick={handleSubmit}
          variant="contained"
          disableElevation
          disabled={loading || !selectedState || !selectedInstitute}
        >
          Continue to Dashboard
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default InstituteSelectionModal;
