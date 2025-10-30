import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { WarningAmber as WarningIcon } from "@mui/icons-material";
import api from "../../../services/api";
import { BASE_URL } from "../../../services/configUrls";

const DeleteTrainerModal = ({ open, onClose, trainer, onDeleteSuccess }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setDeleting(false);
        return;
      }

      // Make DELETE request
      const response = await api.delete(
        `${BASE_URL}/admin/trainers/${trainer.trainer_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        // Success - notify parent and close modal
        if (onDeleteSuccess) {
          onDeleteSuccess(trainer.trainer_id);
        }
        onClose();
      } else {
        setError("Failed to delete trainer. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting trainer:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete trainer. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" sx={{ fontSize: 28 }} />
          <Typography variant="h6" component="span" fontWeight={600}>
            Delete Trainer
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this trainer?
        </Typography>

        <Box
          sx={{
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 1,
            border: 1,
            borderColor: "grey.300",
          }}
        >
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Name:</strong> {trainer?.fullname || "N/A"}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Email:</strong> {trainer?.email || "N/A"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Phone:</strong> {trainer?.phone || "N/A"}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="error"
          sx={{ mt: 2, fontWeight: 500 }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={deleting}
          variant="outlined"
          size="large"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={deleting}
          variant="contained"
          color="error"
          size="large"
          startIcon={deleting ? <CircularProgress size={20} /> : null}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTrainerModal;
