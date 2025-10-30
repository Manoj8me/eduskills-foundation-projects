import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  studentName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: "error.main",
          color: "error.contrastText",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <WarningIcon />
        Confirm Deletion
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "inherit",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" color="text.primary">
          Are you sure you want to delete the intake data for{" "}
          <Box component="span" fontWeight="bold">
            {studentName}
          </Box>
          ?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderColor: "grey.300",
            color: "text.primary",
            "&:hover": {
              borderColor: "grey.400",
              bgcolor: "grey.50",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          color="error"
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
          sx={{
            minWidth: 100,
            "&.Mui-disabled": {
              bgcolor: "error.main",
              opacity: 0.7,
              color: "error.contrastText",
            },
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
