import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import api from "../../services/api";

// Static data for years
const years = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
];

// Styled components
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(2.5),
  minWidth: "350px",
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%",
  },
}));

const PassoutYearChangeModal = ({ open, onClose, student, onDataRefresh }) => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes or student changes
  React.useEffect(() => {
    if (open && student) {
      setSelectedYear(student.passoutYear || null);
      setError(null);
      setSuccess(false);
    }
  }, [open, student]);

  const handleSubmit = async () => {
    if (!selectedYear) {
      setError("Please select a passout year");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      // Prepare request payload
      const requestPayload = {
        branch: student.branch,
        passout_year: selectedYear,
        roll_no: student.rollNo,
      };

      // Make API call to update passout year
      const response = await api.put(
        `${BASE_URL}/internship/edit/details/${student.user_id}`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      

      // Check response
      if (response.data && response.status === 200) {
        setSuccess(true);
        // Refresh data after successful update
        if (onDataRefresh) {
          setTimeout(() => {
            onDataRefresh();
          }, 800); // Short delay to show success message
        }
      } else {
        setError("Failed to update passout year");
      }
    } catch (err) {
      console.error("Error updating passout year:", err);
      setError(err.response?.data?.message || "Failed to update passout year");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
        transition: { duration: 0.25, ease: "easeOut" },
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <StyledDialogTitle>
        <CalendarMonthIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" component="div" fontWeight={600}>
          Change Passout Year
        </Typography>
      </StyledDialogTitle>

      <StyledDialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2.5, mt: 1.5, animation: "fadeIn 0.3s ease-in-out" }}
            size="small"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2.5, mt: 1.5, animation: "fadeIn 0.3s ease-in-out" }}
            size="small"
          >
            Passout year updated successfully!
          </Alert>
        )}

        <Autocomplete
          sx={{ mt: 2.5 }}
          value={selectedYear}
          onChange={(event, newValue) => {
            setSelectedYear(newValue);
          }}
          options={years}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Passout Year"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={error && !selectedYear}
              helperText={
                error && !selectedYear ? "Passout year is required" : ""
              }
              sx={{ mt: 2 }}
            />
          )}
          disabled={loading}
        />
      </StyledDialogContent>

      <DialogActions
        sx={{
          px: 2,
          pb: 2,
          pt: 0,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          size="small"
          disabled={loading}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          size="small"
          disabled={loading || success}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            borderRadius: "8px",
            background: "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
            boxShadow: "0 4px 10px rgba(0, 136, 204, 0.3)",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(45deg, #007bb8 30%, #0095d6 90%)",
              boxShadow: "0 6px 12px rgba(0, 136, 204, 0.4)",
            },
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PassoutYearChangeModal;
