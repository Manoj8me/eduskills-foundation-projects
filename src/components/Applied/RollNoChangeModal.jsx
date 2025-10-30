import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../services/api";

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

const RollNoChangeModal = ({ open, onClose, student, onDataRefresh }) => {
  const theme = useTheme();
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes or student changes
  React.useEffect(() => {
    if (open && student) {
      setRollNo(student.rollNo || "");
      setError(null);
      setSuccess(false);
    }
  }, [open, student]);

  const handleRollNoChange = (e) => {
    setRollNo(e.target.value);
  };

  const handleSubmit = async () => {
    if (!rollNo.trim()) {
      setError("Please enter a valid roll number");
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
        roll_no: rollNo.trim(),
      };

      // Make API call to update roll number
      const response = await api.put(
        `${BASE_URL}/internship/edit/details/${student.user_id}`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
        setError("Failed to update roll number");
      }
    } catch (err) {
      console.error("Error updating roll number:", err);
      setError(err.response?.data?.message || "Failed to update roll number");
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
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.2 },
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <StyledDialogTitle>
        <EditIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" component="div" fontWeight={600}>
          Change Roll Number
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
            Roll number updated successfully!
          </Alert>
        )}

        {/* <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, fontWeight: 500 }}
        >
          Current:{" "}
          <span style={{ color: "#0088cc" }}>
            {student?.rollNo || "Not assigned"}
          </span>
        </Typography> */}

        <TextField
          sx={{ mt: 2.5 }}
          value={rollNo}
          onChange={handleRollNoChange}
          label="Roll Number"
          variant="outlined"
          size="small"
          fullWidth
          required
          error={error && !rollNo.trim()}
          helperText={error && !rollNo.trim() ? "Roll number is required" : ""}
          disabled={loading}
          autoFocus
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

export default RollNoChangeModal;
