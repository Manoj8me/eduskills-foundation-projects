import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import CancelIcon from "@mui/icons-material/Cancel";
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

const RejectionConfirmationModal = ({
  open,
  onClose,
  student,
  onDataRefresh,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes or student changes
  React.useEffect(() => {
    if (open && student) {
      setError(null);
      setSuccess(false);
    }
  }, [open, student]);

  const handleReject = async () => {
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
        status: 2, // Assuming 3 is the ID for "Rejected" status
      };

      // Make API call to reject student
      const response = await api.put(
        `${BASE_URL}/internship/spoc/approval/${student.internship_id}`,
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
            onClose();
          }, 1000); // Short delay to show success message
        }
      } else {
        setError("Failed to reject student");
      }
    } catch (err) {
      console.error("Error rejecting student:", err);
      setError(err.response?.data?.detail || "Failed to reject student");
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
        <CancelIcon color="error" fontSize="small" />
        <Typography variant="subtitle1" component="div" fontWeight={600}>
          Reject Student
        </Typography>
      </StyledDialogTitle>

      <StyledDialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2.5, animation: "fadeIn 0.3s ease-in-out" }}
            size="small"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2.5, animation: "fadeIn 0.3s ease-in-out" }}
            size="small"
          >
            Student rejected successfully!
          </Alert>
        )}

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            Are you sure you want to reject <strong>{student?.name}</strong> for
            the internship?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            This action will update their status to "Rejected" and they will be
            notified.
          </Typography>
        </Box>
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
          onClick={handleReject}
          color="error"
          variant="contained"
          size="small"
          disabled={loading || success}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            borderRadius: "8px",
            background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
            boxShadow: "0 4px 10px rgba(244, 67, 54, 0.3)",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(45deg, #c62828 30%, #e53935 90%)",
              boxShadow: "0 6px 12px rgba(244, 67, 54, 0.4)",
            },
          }}
        >
          {loading ? "Rejecting..." : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionConfirmationModal;
