import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  styled,
  Button,
  Typography,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import {
  School as SchoolIcon,
  FilterAlt as FilterIcon,
  LocationOn as LocationIcon,
  Domain as DomainIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../services/configUrls";
import {
  fetchStudentMetricsWithFilters,
  setSelectedFilters,
} from "../store/Slices/studentnewmetric/studentNewMetricsSlice";
import api from "../services/api";

// Styled components for dropdowns
const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: isDarkMode ? "#1e2030" : "#ffffff",
    borderRadius: "10px",
    height: "36px",
    "& fieldset": {
      borderColor: isDarkMode ? "#2d3748" : "#e2e8f0",
      transition: "all 0.2s ease",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: isDarkMode ? "#4a5568" : "#cbd5e0",
    },
    "&.Mui-focused fieldset": {
      borderColor: isDarkMode ? "#3182ce" : "#3182ce",
      borderWidth: "1px",
    },
    boxShadow: isDarkMode
      ? "0 2px 4px rgba(0, 0, 0, 0.3)"
      : "0 1px 3px rgba(0, 0, 0, 0.08)",
    "&.Mui-disabled": {
      backgroundColor: isDarkMode ? "#242736" : "#f7fafc",
    },
  },
  "& .MuiAutocomplete-input": {
    color: isDarkMode ? "#e2e8f0" : "#2d3748",
    fontSize: "0.8rem",
    padding: "4px 8px !important",
  },
  "& .MuiAutocomplete-clearIndicator": {
    color: isDarkMode ? "#718096" : "#a0aec0",
  },
}));

// Styled modal components
const StyledModalContent = styled(DialogContent)(({ theme, isDarkMode }) => ({
  padding: "24px",
  backgroundColor: isDarkMode ? "#171923" : "#f8fafc",
  borderRadius: "12px",
}));

const StyledModalPaper = styled(Paper)(({ theme, isDarkMode }) => ({
  borderRadius: "12px",
  boxShadow: isDarkMode
    ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
    : "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.8)",
  backgroundColor: isDarkMode ? "#171923" : "#ffffff",
  border: isDarkMode ? "1px solid #2d3748" : "1px solid #e2e8f0",
  overflow: "hidden",
}));

// Styled filter container
const FilterContainer = styled(Box)(({ theme, isDarkMode }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: isDarkMode ? "#171923" : "#f8fafc",
  borderRadius: "12px",
  padding: "6px 12px",
  boxShadow: isDarkMode
    ? "0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
    : "0 2px 10px rgba(0, 0, 0, 0.03), inset 0 0 0 1px rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(8px)",
  border: isDarkMode ? "1px solid #2d3748" : "1px solid #e2e8f0",
  transition: "all 0.2s ease",
}));

// Styled button for the apply filters action
const ApplyFilterButton = styled(Button)(({ theme, isDarkMode }) => ({
  backgroundColor: "#3182ce",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "4px 12px",
  height: "36px",
  minWidth: "unset",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: isDarkMode
    ? "0 2px 6px rgba(49, 130, 206, 0.4)"
    : "0 2px 8px rgba(49, 130, 206, 0.3)",
  "&:hover": {
    backgroundColor: "#2b6cb0",
    boxShadow: isDarkMode
      ? "0 4px 10px rgba(49, 130, 206, 0.5)"
      : "0 4px 12px rgba(49, 130, 206, 0.4)",
    transform: "translateY(-1px)",
  },
  "&.Mui-disabled": {
    backgroundColor: isDarkMode ? "#2d3748" : "#e2e8f0",
    color: isDarkMode ? "#4a5568" : "#a0aec0",
  },
  transition: "all 0.2s ease",
}));

// Status badge component with shadow
const StatusBadge = styled("span")(({ theme, isDarkMode, isActive }) => ({
  fontSize: "0.65rem",
  fontWeight: 600,
  padding: "2px 6px",
  borderRadius: "4px",
  marginLeft: "6px",
  display: "inline-block",
  backgroundColor: isActive
    ? isDarkMode
      ? "rgba(49, 130, 206, 0.25)"
      : "rgba(49, 130, 206, 0.15)"
    : isDarkMode
    ? "rgba(229, 62, 62, 0.25)"
    : "rgba(229, 62, 62, 0.15)",
  color: isActive
    ? isDarkMode
      ? "#63b3ed"
      : "#2b6cb0"
    : isDarkMode
    ? "#fc8181"
    : "#e53e3e",
  boxShadow: isActive
    ? isDarkMode
      ? "0 1px 3px rgba(49, 130, 206, 0.4)"
      : "0 1px 3px rgba(49, 130, 206, 0.3)"
    : isDarkMode
    ? "0 1px 3px rgba(229, 62, 62, 0.4)"
    : "0 1px 3px rgba(229, 62, 62, 0.3)",
  border: isActive
    ? isDarkMode
      ? "1px solid rgba(49, 130, 206, 0.4)"
      : "1px solid rgba(49, 130, 206, 0.3)"
    : isDarkMode
    ? "1px solid rgba(229, 62, 62, 0.4)"
    : "1px solid rgba(229, 62, 62, 0.3)",
  transition: "all 0.2s ease",
}));

// Label chip component
const LabelChip = styled(Chip)(({ theme, isDarkMode }) => ({
  backgroundColor: isDarkMode ? "#2c5282" : "#ebf8ff",
  color: isDarkMode ? "#e2e8f0" : "#2b6cb0",
  fontWeight: 600,
  fontSize: "0.7rem",
  height: "24px",
  borderRadius: "6px",
  "& .MuiChip-icon": {
    color: isDarkMode ? "#bee3f8" : "#3182ce",
    marginRight: "2px",
    marginLeft: "6px",
  },
  "& .MuiChip-label": {
    padding: "0 8px 0 6px",
  },
}));

// Info banner component
const InfoBanner = styled(Box)(({ theme, isDarkMode }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: isDarkMode ? "rgba(49, 130, 206, 0.15)" : "#ebf8ff",
  borderRadius: "8px",
  padding: "12px 16px",
  marginBottom: "20px",
  border: isDarkMode
    ? "1px solid rgba(49, 130, 206, 0.3)"
    : "1px solid #bee3f8",
  boxShadow: isDarkMode
    ? "0 2px 6px rgba(0, 0, 0, 0.2)"
    : "0 2px 6px rgba(0, 0, 0, 0.05)",
}));

const InstitutionFilters = ({ colors }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const dispatch = useDispatch();

  // States for institution selection
  const [states, setStates] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stateInputValue, setStateInputValue] = useState("");
  const [instituteInputValue, setInstituteInputValue] = useState("");
  const [formError, setFormError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  // Function to fetch student information options (states and institutes)
  const fetchStudentInformationOptions = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(
        `${BASE_URL}/internship/studentInformationStatesInstitutes`,
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
    } else if (initialLoad) {
      // If no selections are stored and this is initial load, show the modal
      setIsModalOpen(true);
      setInitialLoad(false);
    }
  };

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

  // Handle institute selection
  const handleInstituteSelect = (event, newValue) => {
    setSelectedInstitute(newValue);
    setFormError("");
  };

  // Handle apply filters button click
  const handleApplyFilters = () => {
    if (selectedState && selectedInstitute) {
      // Create state and institute objects with consistent property names
      const stateObj = {
        id: selectedState.state_id,
        name: selectedState.state_name,
      };

      const instituteObj = {
        id: selectedInstitute.institue_id,
        name: selectedInstitute.institute_name,
      };

      console.log("Applying filters:", stateObj, instituteObj);

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
      localStorage.setItem(
        "selectedInstituteId",
        selectedInstitute.institue_id
      );
      localStorage.setItem(
        "selectedInstituteName",
        selectedInstitute.institute_name
      );

      // Dispatch the action to fetch data with filters
      dispatch(
        fetchStudentMetricsWithFilters({
          state_id: selectedState.state_id,
          institute_id: selectedInstitute.institue_id,
          state_name: selectedState.state_name,
          institute_name: selectedInstitute.institute_name,
        })
      );

      // Find and click the refresh button in the NewTotalInternship component
      setTimeout(() => {
        const refreshButton = document.querySelector(
          '[data-testid="refresh-data-button"]'
        );
        if (refreshButton) {
          console.log("Triggering refresh button click");
          refreshButton.click();
        } else {
          console.log("Refresh button not found");
        }
      }, 100); // Small delay to ensure component is rendered

      handleSuccessMessage(
        `Applied filters for ${selectedInstitute.institute_name}`
      );

      // Close the modal if it's open
      setIsModalOpen(false);
    } else {
      setFormError("Please select both state and institute");
    }
  };

  // Custom option renderer for institute dropdown
  const renderInstituteOption = (props, option, { selected }) => {
    if (!option) return null;

    const isActive = option.is_active === "1";
    const regOpen = option.reg_open === "1";

    return (
      <li {...props} style={{ padding: "6px 8px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            backgroundColor: selected
              ? isDarkMode
                ? "rgba(49, 130, 206, 0.15)"
                : "rgba(235, 248, 255, 0.9)"
              : isDarkMode
              ? "rgba(30, 32, 48, 0.5)"
              : "rgba(255, 255, 255, 0.9)",
            borderRadius: "6px",
            p: 0.8,
            boxShadow: selected
              ? isDarkMode
                ? "0 2px 4px rgba(0, 0, 0, 0.3)"
                : "0 2px 4px rgba(0, 0, 0, 0.1)"
              : isDarkMode
              ? "0 1px 2px rgba(0, 0, 0, 0.2)"
              : "0 1px 2px rgba(0, 0, 0, 0.05)",
            border: selected
              ? isDarkMode
                ? "1px solid rgba(49, 130, 206, 0.4)"
                : "1px solid rgba(49, 130, 206, 0.3)"
              : isDarkMode
              ? "1px solid rgba(45, 55, 72, 0.6)"
              : "1px solid rgba(226, 232, 240, 0.8)",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: isDarkMode
                ? selected
                  ? "rgba(49, 130, 206, 0.2)"
                  : "rgba(45, 55, 72, 0.3)"
                : selected
                ? "rgba(235, 248, 255, 1)"
                : "rgba(247, 250, 252, 0.9)",
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: selected ? 600 : 400,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            <span style={{ marginRight: "auto" }}>{option.institute_name}</span>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                ml: "auto",
                flexShrink: 0,
              }}
            >
              <StatusBadge isActive={isActive} isDarkMode={isDarkMode}>
                {isActive ? "Active" : "Inactive"}
              </StatusBadge>
              <StatusBadge
                isActive={regOpen}
                isDarkMode={isDarkMode}
                sx={{ ml: 0.5 }}
              >
                {regOpen ? "Reg Open" : "Reg Closed"}
              </StatusBadge>
            </Box>
          </Typography>
        </Box>
      </li>
    );
  };

  // Handle manual filter selection
  const handleShowFilters = () => {
    setIsModalOpen(true);
  };

  // Fetch data on component mount
  useEffect(() => {
    const userRole = localStorage.getItem("Authorise");
    // Only fetch if user is a staff member
    if (userRole === "staff") {
      fetchStudentInformationOptions();
    }
  }, []);

  return (
    <>
      <Fade in timeout={400}>
        <FilterContainer
          sx={{ ml: 2 }}
          isDarkMode={isDarkMode}
          onClick={handleShowFilters}
        >
          <Button
            variant="text"
            startIcon={<FilterIcon />}
            sx={{
              color: isDarkMode ? "#e2e8f0" : "#2d3748",
              textTransform: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {selectedState && selectedInstitute ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LabelChip
                  label={selectedState.state_name}
                  icon={<LocationIcon fontSize="small" />}
                  isDarkMode={isDarkMode}
                />
                <LabelChip
                  label={selectedInstitute.institute_name}
                  icon={<DomainIcon fontSize="small" />}
                  isDarkMode={isDarkMode}
                />
              </Box>
            ) : (
              "Select Institution Filters"
            )}
          </Button>
        </FilterContainer>
      </Fade>

      {/* Institution Selection Modal */}
      <Dialog
        open={isModalOpen}
        maxWidth="md"
        fullWidth
        PaperComponent={(props) => (
          <StyledModalPaper {...props} isDarkMode={isDarkMode} />
        )}
        disableEscapeKeyDown={!selectedState || !selectedInstitute}
        onClose={(event, reason) => {
          // Only allow closing if both state and institute are selected
          if (selectedState && selectedInstitute) {
            setIsModalOpen(false);
          }
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: isDarkMode
              ? "1px solid #2d3748"
              : "1px solid #e2e8f0",
            backgroundColor: isDarkMode ? "#1a202c" : "#f8fafc",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#e2e8f0" : "#1a202c",
              }}
            >
              Select Institution Filters
            </Typography>
            {selectedState && selectedInstitute && (
              <Button
                onClick={() => setIsModalOpen(false)}
                sx={{ minWidth: "unset", p: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </Button>
            )}
          </Box>
        </DialogTitle>

        <StyledModalContent sx={{ mt: 2 }} isDarkMode={isDarkMode}>
          <InfoBanner isDarkMode={isDarkMode}>
            <InfoIcon sx={{ color: isDarkMode ? "#63b3ed" : "#3182ce" }} />
            <Typography
              variant="body2"
              sx={{ color: isDarkMode ? "#e2e8f0" : "#2d3748" }}
            >
              Please select both a state and an institution to continue. This
              selection is required to view the data.
            </Typography>
          </InfoBanner>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: isDarkMode ? "#e2e8f0" : "#2d3748",
                }}
              >
                1. Select State
              </Typography>
              <Autocomplete
                id="state-select-modal"
                options={states || []}
                getOptionLabel={(option) => option?.state_name || ""}
                value={selectedState}
                onChange={handleStateChange}
                inputValue={stateInputValue}
                onInputChange={(_, newInputValue) => {
                  setStateInputValue(newInputValue);
                }}
                loading={loading}
                fullWidth
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    placeholder="Select State"
                    fullWidth
                    isDarkMode={isDarkMode}
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <LocationIcon
                          fontSize="small"
                          sx={{
                            mr: 0.5,
                            ml: 1,
                            color: isDarkMode ? "#63b3ed" : "#3182ce",
                            opacity: 0.9,
                          }}
                        />
                      ),
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="primary" size={16} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: isDarkMode ? "#e2e8f0" : "#2d3748",
                }}
              >
                2. Select Institution
              </Typography>
              <Autocomplete
                id="institute-select-modal"
                options={institutes || []}
                getOptionLabel={(option) => option?.institute_name || ""}
                renderOption={renderInstituteOption}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    placeholder={
                      selectedState
                        ? "Select Institution"
                        : "Select state first"
                    }
                    fullWidth
                    isDarkMode={isDarkMode}
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <DomainIcon
                          fontSize="small"
                          sx={{
                            mr: 0.5,
                            ml: 1,
                            color: isDarkMode ? "#63b3ed" : "#3182ce",
                            opacity: 0.9,
                          }}
                        />
                      ),
                      endAdornment: (
                        <>
                          {loading && selectedState ? (
                            <CircularProgress color="primary" size={16} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                value={selectedInstitute}
                onChange={handleInstituteSelect}
                inputValue={instituteInputValue}
                onInputChange={(_, newInputValue) => {
                  setInstituteInputValue(newInputValue);
                }}
                loading={loading && selectedState}
                disabled={!selectedState}
                fullWidth
                ListboxProps={{
                  sx: {
                    padding: "4px",
                    "& .MuiAutocomplete-option": {
                      margin: "3px 0",
                      borderRadius: "6px",
                    },
                    backgroundColor: isDarkMode ? "#131520" : "#f8fafc",
                    border: isDarkMode
                      ? "1px solid #2d3748"
                      : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: isDarkMode
                      ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                      : "0 4px 12px rgba(0, 0, 0, 0.08)",
                  },
                }}
              />
            </Box>
          </Box>

          {formError && (
            <Typography
              variant="caption"
              sx={{
                mt: 2,
                display: "block",
                color: isDarkMode ? "#fc8181" : "#e53e3e",
                fontWeight: 500,
              }}
            >
              {formError}
            </Typography>
          )}
        </StyledModalContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: isDarkMode ? "1px solid #2d3748" : "1px solid #e2e8f0",
            backgroundColor: isDarkMode ? "#1a202c" : "#f8fafc",
          }}
        >
          <ApplyFilterButton
            variant="contained"
            onClick={handleApplyFilters}
            disabled={!selectedState || !selectedInstitute}
            startIcon={<FilterIcon fontSize="small" />}
            isDarkMode={isDarkMode}
            fullWidth
            sx={{ py: 1.2 }}
          >
            {selectedState && selectedInstitute
              ? `Apply Filters for ${selectedInstitute.institute_name}`
              : "Select State and Institution to Continue"}
          </ApplyFilterButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstitutionFilters;
