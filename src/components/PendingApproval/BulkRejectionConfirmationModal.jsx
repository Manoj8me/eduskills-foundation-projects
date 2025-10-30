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
  useTheme,
  Badge,
  Snackbar,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
    maxWidth: "400px",
    width: "100%",
    margin: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
  padding: theme.spacing(1.5, 2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const BulkRejectionConfirmationModal = ({
  open,
  onClose,
  studentsCount,
  internshipIds,
  onDataRefresh,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleCloseAlert = () => {
    setError(null);
  };

  const handleClose = () => {
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false);
    setSuccessMessage(null);
  };

  const handleReject = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Prepare the request payload
      const requestPayload = {
        data: internshipIds.map((id) => ({
          internship_id: id,
          status: 2,  // Using 0 for reject, adjust if your API uses a different value
        })),
      };

      // Call the API
      const response = await api.put(
        `${BASE_URL}/internship/spoc/bulk/rejection`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Check if the operation was successful
      if (response.status === 200) {
        // Set success message
        setSuccessMessage(
          `Successfully rejected ${studentsCount} student${
            studentsCount !== 1 ? "s" : ""
          }!`
        );
        setShowSuccessAlert(true);

        // Refresh data BEFORE closing modal
        if (onDataRefresh) {
          onDataRefresh();
        }

        // Close modal immediately to allow for more interactions
        handleClose();
      }
    } catch (err) {
      console.error("Error rejecting internships:", err);
      setError(
        err.response?.data?.message ||
          "Failed to reject internships. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledDialog
        open={open}
        onClose={loading ? null : handleClose}
        fullWidth
        maxWidth="xs"
      >
        <StyledDialogTitle>
          <Badge
            badgeContent={studentsCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#f44336",
                color: "white",
                fontWeight: "bold",
              },
            }}
          >
            <BlockIcon color="error" />
          </Badge>
          <Typography variant="subtitle1" component="div" fontWeight={600}>
            Bulk Reject Students
          </Typography>
        </StyledDialogTitle>

        <DialogContent sx={{ py: 2, px: 2, mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              p: 1.5,
              borderRadius: "6px",
              color: theme.palette.error.dark,
              fontSize: "0.85rem",
            }}
          >
            You are about to reject {studentsCount} student
            {studentsCount !== 1 ? "s" : ""}. This action cannot be undone. Are
            you sure?
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2, borderRadius: "6px" }}
              onClose={handleCloseAlert}
            >
              {error}
            </Alert>
          )}
        </DialogContent>

        <StyledDialogActions>
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={loading}
            size="small"
            sx={{
              fontWeight: 500,
              borderRadius: "6px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={loading}
            size="small"
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CancelIcon fontSize="small" />
              )
            }
            sx={{
              fontWeight: 600,
              color: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
              background:
                "linear-gradient(45deg, #c62828 0%, #f44336 50%, #e57373 100%)",
              "&:hover": {
                boxShadow: "0 6px 14px rgba(244, 67, 54, 0.3)",
                background:
                  "linear-gradient(45deg, #b71c1c 0%, #d32f2f 50%, #ef5350 100%)",
              },
            }}
          >
            {loading ? "Processing..." : "Reject All"}
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      {/* Success Snackbar - Outside the modal */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={4000}
        onClose={handleSuccessAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSuccessAlertClose}
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "8px",
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BulkRejectionConfirmationModal;