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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";
import AWSAcademyAccessModal from "./AWSAcademyAccessModal"; // Import the new modal

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

const BulkApprovalConfirmationModal = ({
  open,
  onClose,
  studentsCount,
  internshipIds,
  onDataRefresh,
  selectedStudents = [], // Add this prop to get selected students data for domain checking
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAWSModal, setShowAWSModal] = useState(false);

  // Check if any selected student has AWS domain
  const hasAWSDomain =
    selectedStudents &&
    selectedStudents.some((student) =>
      student?.domain?.toLowerCase().startsWith("aws")
    );

  // Get AWS domain name from the first AWS student
  const awsDomainName = selectedStudents?.find((student) =>
    student?.domain?.toLowerCase().startsWith("aws")
  )?.domain;

  const handleCloseAlert = () => {
    setError(null);
  };

  const handleClose = () => {
    setError(null);
    setLoading(false);
    setShowAWSModal(false);
    onClose();
  };

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false);
    setSuccessMessage(null);
  };

  const handleApprove = async (accessGiven = null) => {
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
        data: internshipIds.map((id) => {
          const payload = {
            internship_id: id,
            status: 1,
          };

          // Add access_given key if there are AWS domains and accessGiven is provided
          if (hasAWSDomain && accessGiven !== null) {
            payload.access_given = accessGiven;
          }

          return payload;
        }),
      };

      // Call the API
      const response = await api.put(
        `${BASE_URL}/internship/spoc/bulk/approval`,
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
          response.data.detail ||
            `Successfully approved ${studentsCount} student${
              studentsCount !== 1 ? "s" : ""
            }!`
        );
        setShowSuccessAlert(true);
        setShowAWSModal(false); // Close AWS modal if open

        // Refresh data BEFORE closing modal
        if (onDataRefresh) {
          onDataRefresh();
        }

        // Close modal immediately to allow for more interactions
        handleClose();
      }
    } catch (err) {
      console.error("Error approving internships:", err);
      setError(
        err.response?.data?.message ||
          "Failed to approve internships. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = () => {
    if (hasAWSDomain) {
      // Show AWS Academy access modal first
      setShowAWSModal(true);
    } else {
      // Proceed with normal approval
      handleApprove();
    }
  };

  const handleAWSAccessConfirm = (accessGiven) => {
    setShowAWSModal(false);
    // Proceed with approval regardless of accessGiven value (true or false)
    // This allows approval even when AWS access is not confirmed
    handleApprove(accessGiven);
  };

  const handleApproveNonAWS = (nonAwsStudents) => {
    // Handle approval of only non-AWS students
    if (nonAwsStudents && nonAwsStudents.length > 0) {
      const nonAwsInternshipIds = nonAwsStudents.map(
        (student) => student.internship_id
      );

      // Create separate API call for non-AWS students
      const approveNonAWS = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");

          const requestPayload = {
            data: nonAwsInternshipIds.map((id) => ({
              internship_id: id,
              status: 1,
            })),
          };

          const response = await api.put(
            `${BASE_URL}/internship/spoc/bulk/approval`,
            requestPayload,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.status === 200) {
            setSuccessMessage(
              `Successfully approved ${nonAwsStudents.length} non-AWS student${
                nonAwsStudents.length !== 1 ? "s" : ""
              }!`
            );
            setShowSuccessAlert(true);

            if (onDataRefresh) {
              onDataRefresh();
            }
            handleClose();
          }
        } catch (err) {
          console.error("Error approving non-AWS students:", err);
          setError("Failed to approve non-AWS students. Please try again.");
        }
      };

      approveNonAWS();
    }
  };

  const handleAWSModalClose = () => {
    setShowAWSModal(false);
    setLoading(false);
  };

  return (
    <>
      <StyledDialog
        open={open && !showAWSModal}
        onClose={loading ? null : handleClose}
        fullWidth
        maxWidth="xs"
      >
        <StyledDialogTitle>
          <Badge
            badgeContent={studentsCount}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#2196f3",
                color: "white",
                fontWeight: "bold",
              },
            }}
          >
            <DoneAllIcon color="success" />
          </Badge>
          <Typography variant="subtitle1" component="div" fontWeight={600}>
            Bulk Approve Students
          </Typography>
        </StyledDialogTitle>

        <DialogContent sx={{ py: 2, px: 2, mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              p: 1.5,
              borderRadius: "6px",
              color: theme.palette.warning.dark,
              fontSize: "0.85rem",
            }}
          >
            You are about to approve {studentsCount} student
            {studentsCount !== 1 ? "s" : ""}. This action cannot be undone. Are
            you sure?
          </Typography>

          {hasAWSDomain && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                backgroundColor: theme.palette.info.light,
                borderRadius: "6px",
                border: `1px solid ${theme.palette.info.main}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: theme.palette.info.contrastText }}
              >
                📋 Note: Some students have {awsDomainName} domain. You'll be
                asked to verify AWS Academy access.
              </Typography>
            </Box>
          )}

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
            onClick={handleApproveClick}
            color="success"
            variant="contained"
            disabled={loading}
            size="small"
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckCircleIcon fontSize="small" />
              )
            }
            sx={{
              fontWeight: 600,
              color: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
              background:
                "linear-gradient(45deg, #2e7d32 0%, #4caf50 50%, #66bb6a 100%)",
              "&:hover": {
                boxShadow: "0 6px 14px rgba(76, 175, 80, 0.3)",
                background:
                  "linear-gradient(45deg, #1b5e20 0%, #388e3c 50%, #43a047 100%)",
              },
            }}
          >
            {loading ? "Processing..." : "Approve All"}
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      {/* AWS Academy Access Modal */}
      <AWSAcademyAccessModal
        open={showAWSModal}
        onClose={handleAWSModalClose}
        domain={awsDomainName}
        onConfirm={handleAWSAccessConfirm}
        onApproveNonAWS={handleApproveNonAWS}
        isMultiple={true}
        studentsCount={studentsCount}
        selectedStudents={selectedStudents}
      />

      {/* Success Snackbar - Outside the modal */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={9000}
        onClose={handleSuccessAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSuccessAlertClose}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "8px",
            color: "white",
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

export default BulkApprovalConfirmationModal;
