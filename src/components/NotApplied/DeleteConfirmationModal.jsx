import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
  textTransform: "none",
  fontWeight: 600,
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  textTransform: "none",
  fontWeight: 600,
}));

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  selectedCount,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "100%",
          maxWidth: "450px",
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "error.main",
          pt: 3,
        }}
      >
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="delete-dialog-description"
          sx={{ color: "text.primary", opacity: 0.9 }}
        >
          Are you sure you want to delete {selectedCount} inactive{" "}
          {selectedCount === 1 ? "profile" : "profiles"}?
          <span style={{ display: "block", marginTop: "8px", fontWeight: 500 }}>
            This action cannot be undone.
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <CancelButton
          onClick={onClose}
          variant="outlined"
          color="primary"
          disabled={isLoading}
        >
          Cancel
        </CancelButton>
        <DeleteButton
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          startIcon={
            isLoading && (
              <span
                className="MuiCircularProgress-root MuiCircularProgress-indeterminate"
                style={{
                  width: "16px",
                  height: "16px",
                  color: "inherit",
                }}
              />
            )
          }
        >
          {isLoading ? "Deleting..." : "Delete"}
        </DeleteButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
