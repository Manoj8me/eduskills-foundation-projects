import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const CommonModal = ({ open, onClose, onConfirm, action, extMsg }) => {
  const getTitle = () => {
    switch (action) {
      case "update":
        return "Update Confirmation";
      case "save":
        return "Save Confirmation";
      case "delete":
        return "Delete Confirmation";
      default:
        return "Confirmation";
    }
  };

  const getMessage = () => {
    switch (action) {
      case "update":
        return "Are you sure you want to update?";
      case "save":
        return "Are you sure you want to save?";
      case "delete":
        return "Are you sure you want to delete?";
      default:
        return `Are you sure ${extMsg? extMsg:''}?`;
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>{getMessage()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="info">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonModal;
