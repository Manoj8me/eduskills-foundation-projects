import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  textTransform: "none",
  fontWeight: 600,
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textTransform: "none",
  fontWeight: 500,
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 600,
  padding: theme.spacing(3, 3, 2, 3),
  color: theme.palette.primary.main,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  "& .MuiTextField-root, & .MuiAutocomplete-root": {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: theme.shape.borderRadius,
  },
  "& .MuiOutlinedInput-root": {
    padding: theme.spacing(0.5, 1),
  },
  "& .MuiAutocomplete-endAdornment": {
    right: theme.spacing(1),
  },
  "& .MuiAutocomplete-popupIndicator": {
    padding: theme.spacing(0.5),
  },
  "& .MuiAutocomplete-popper": {
    zIndex: 1500,
  },
}));

const EditModal = ({
  open,
  onClose,
  studentId,
  studentData,
  filterOptions,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [branch, setBranch] = useState(null);
  const [passoutYear, setPassoutYear] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [passoutYears, setPassoutYears] = useState([]);
  const [error, setError] = useState(null);
  const [loadingProgramBranches, setLoadingProgramBranches] = useState(false);

  // Track original values to detect changes
  const [originalValues, setOriginalValues] = useState({});

  // Set initial values based on student data
  useEffect(() => {
    if (studentData && open) {
      const rollNoValue = studentData.rollNo || "";
      const branchValue = studentData.branch || null;
      const passoutYearValue = studentData.passoutYear || null;

      setRollNo(rollNoValue);
      setBranch(branchValue);
      setPassoutYear(passoutYearValue);

      // Store original values
      setOriginalValues({
        rollNo: rollNoValue,
        branch: branchValue,
        passoutYear: passoutYearValue,
      });

      // Reset program selection when opening modal
      setSelectedProgram(null);
    }
  }, [studentData, open]);

  // Extract available passout years from filter options
  useEffect(() => {
    if (filterOptions && filterOptions.filterData) {
      const yearFilter = filterOptions.filterData.find(
        (filter) => filter.id === "years"
      );
      if (yearFilter && Array.isArray(yearFilter.options)) {
        setPassoutYears(yearFilter.options.filter(Boolean));
      }
    }
  }, [filterOptions]);

  // Fetch programs and branches from the API
  useEffect(() => {
    const fetchProgramBranches = async () => {
      if (open) {
        try {
          setLoadingProgramBranches(true);
          setError(null);

          const accessToken = localStorage.getItem("accessToken");

          if (!accessToken) {
            setError("Authentication token not found. Please login again.");
            setLoadingProgramBranches(false);
            return;
          }

          const response = await api.get(
            `${BASE_URL}/internship/programs_branches`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.data) {
            const { programs: programsData, branches: branchesData } =
              response.data;

            const activePrograms =
              programsData?.filter((program) => program.is_active === "1") ||
              [];
            setPrograms(activePrograms);

            const activeBranches =
              branchesData?.filter((branch) => branch.is_active === "1") || [];
            setAllBranches(activeBranches);

            setBranches([]);
          }
        } catch (err) {
          console.error("Error fetching program branches:", err);
          setError(
            "Failed to fetch program and branch options. Please try again later."
          );
        } finally {
          setLoadingProgramBranches(false);
        }
      }
    };

    fetchProgramBranches();
  }, [open]);

  // Update branches when program is selected
  useEffect(() => {
    if (selectedProgram && allBranches.length > 0) {
      const programBranches = allBranches
        .filter((branch) => branch.program_id === selectedProgram.program_id)
        .map((branch) => branch.branch_name)
        .filter(Boolean);

      const uniqueBranches = [...new Set(programBranches)].sort();
      setBranches(uniqueBranches);

      // Only reset branch if it's not compatible with the new program
      if (branch && !uniqueBranches.includes(branch)) {
        setBranch(null);
      }
    } else {
      setBranches([]);
    }
  }, [selectedProgram, allBranches, branch]);

  // Check if branch or passout year changed
  const isBranchOrYearChanged = () => {
    return (
      branch !== originalValues.branch ||
      passoutYear !== originalValues.passoutYear
    );
  };

  // Check if program is required
  const isProgramRequired = () => {
    return isBranchOrYearChanged();
  };

  // Check if branch is required (when program is selected or year/branch is changed)
  const isBranchRequired = () => {
    return selectedProgram || isBranchOrYearChanged();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if program is required when branch or year is changed
      if (isProgramRequired() && !selectedProgram) {
        setError(
          "Please select a program when changing branch or passout year."
        );
        setLoading(false);
        return;
      }

      // Check if branch is required when program is selected or when changing year
      if (isBranchRequired() && !branch) {
        setError(
          "Please select a branch when program is selected or when changing passout year."
        );
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Prepare the payload with only changed values
      const payload = {};
      let hasChanges = false;

      // Add roll number if changed
      if (rollNo !== originalValues.rollNo) {
        payload.roll_no = rollNo;
        hasChanges = true;
      }

      // Add branch and program if changed
      if (branch !== originalValues.branch) {
        if (!selectedProgram) {
          setError("Please select a program when changing branch.");
          setLoading(false);
          return;
        }
        payload.program_id = selectedProgram.program_id;
        payload.branch = branch;
        hasChanges = true;
      }

      // Add passout year if changed
      if (passoutYear !== originalValues.passoutYear) {
        if (!selectedProgram) {
          setError("Please select a program when changing passout year.");
          setLoading(false);
          return;
        }
        if (!branch) {
          setError("Please select a branch when changing passout year.");
          setLoading(false);
          return;
        }
        // Include program_id and branch if not already added
        if (!payload.program_id) {
          payload.program_id = selectedProgram.program_id;
        }
        if (!payload.branch) {
          payload.branch = branch;
        }
        payload.passout_year = passoutYear.toString();
        hasChanges = true;
      }

      // Check if there are any changes to save
      if (!hasChanges) {
        setError("No changes detected. Please modify at least one field.");
        setLoading(false);
        return;
      }

      const response = await api.put(
        `${BASE_URL}/internship/edit/details/${studentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.status === 200) {
        onSuccess({
          ...response.data,
          action: "update",
          field: "student_details",
        });
        onClose();
      }
    } catch (err) {
      console.error("Error updating student details:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update student details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
      container={() => document.body}
      keepMounted
    >
      <StyledDialogTitle>Edit Student Details</StyledDialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <ContentWrapper>
          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mb: 2, fontWeight: 500 }}
            >
              {error}
            </Typography>
          )}

          {/* Roll Number Field */}
          <TextField
            label="Roll Number"
            fullWidth
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Enter roll number"
            disabled={loading}
            variant="outlined"
            size="medium"
            sx={{ mt: 3 }}
            helperText="Can be changed independently"
          />

          {/* Program/Course Selection */}
          <StyledAutocomplete
            options={programs}
            value={selectedProgram}
            onChange={(event, newValue) => setSelectedProgram(newValue)}
            disabled={loading || loadingProgramBranches}
            loading={loadingProgramBranches}
            getOptionLabel={(option) => option.program_name || ""}
            isOptionEqualToValue={(option, value) =>
              option.program_id === value?.program_id
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Program/Course ${isProgramRequired() ? "*" : ""}`}
                placeholder="Select program/course"
                fullWidth
                variant="outlined"
                helperText={
                  isProgramRequired()
                    ? "Required when changing branch or passout year"
                    : "Optional for roll number changes only"
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingProgramBranches ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            disablePortal={false}
            fullWidth
          />

          {/* Branch Selection */}
          <StyledAutocomplete
            options={branches}
            value={branch}
            onChange={(event, newValue) => setBranch(newValue)}
            disabled={
              loading ||
              loadingProgramBranches ||
              (isProgramRequired() && !selectedProgram)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Branch ${isBranchRequired() ? "*" : ""}`}
                placeholder={
                  isProgramRequired() && !selectedProgram
                    ? "Select program first"
                    : "Select branch"
                }
                fullWidth
                variant="outlined"
                helperText={
                  selectedProgram
                    ? `Available branches for ${selectedProgram.program_name}`
                    : isProgramRequired()
                    ? "Select program first to see available branches"
                    : isBranchRequired()
                    ? "Required when changing passout year"
                    : "Current branch selection"
                }
              />
            )}
            disablePortal={false}
            fullWidth
            noOptionsText={
              selectedProgram
                ? "No branches available for selected program"
                : "Please select a program first"
            }
          />

          {/* Passout Year Selection */}
          <StyledAutocomplete
            options={passoutYears}
            value={passoutYear}
            onChange={(event, newValue) => setPassoutYear(newValue)}
            disabled={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Passout Year"
                placeholder="Select passout year"
                fullWidth
                variant="outlined"
                helperText="Available passout years"
              />
            )}
            disablePortal={false}
            fullWidth
          />

          {/* Information Box */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "rgba(25, 118, 210, 0.04)",
              borderRadius: 1,
              borderLeft: "4px solid #1976d2",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> Program and branch selection are mandatory
              when changing passout year. Program selection is mandatory when
              changing branch. Roll number can be updated independently without
              selecting a program or branch.
            </Typography>
          </Box>
        </ContentWrapper>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <CancelButton onClick={onClose} disabled={loading} variant="text">
          Cancel
        </CancelButton>
        <SaveButton
          onClick={handleSave}
          disabled={loading || loadingProgramBranches}
          variant="contained"
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? "Saving..." : "Save Changes"}
        </SaveButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
