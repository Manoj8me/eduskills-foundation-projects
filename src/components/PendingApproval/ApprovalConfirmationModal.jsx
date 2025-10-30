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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../../services/api";
import AWSAcademyAccessModal from "./AWSAcademyAccessModal"; // Import the new modal

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

const ApprovalConfirmationModal = ({
  open,
  onClose,
  student,
  onDataRefresh,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAWSModal, setShowAWSModal] = useState(false);

  // Reset state when modal opens/closes or student changes
  React.useEffect(() => {
    if (open && student) {
      setError(null);
      setSuccess(false);
      setShowAWSModal(false);
    }
  }, [open, student]);

  // Check if domain starts with "AWS" (case insensitive)
  const isAWSDomain = student?.domain?.toLowerCase().startsWith("aws");

  const handleApprove = async (accessGiven = null) => {
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
        status: 1, // Assuming 1 is the ID for "Approved" status
      };

      // Add access_given key if it's an AWS domain
      if (isAWSDomain && accessGiven !== null) {
        requestPayload.access_given = accessGiven;
      }

      // Make API call to approve student
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
        setShowAWSModal(false); // Close AWS modal if open
        // Refresh data after successful update
        if (onDataRefresh) {
          setTimeout(() => {
            onDataRefresh();
            onClose();
          }, 1000); // Short delay to show success message
        }
      } else {
        setError("Failed to approve student");
      }
    } catch (err) {
      console.error("Error approving student:", err);
      setError(err.response?.data?.detail || "Failed to approve student");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = () => {
    if (isAWSDomain) {
      // Show AWS Academy access modal first
      setShowAWSModal(true);
    } else {
      // Proceed with normal approval
      handleApprove();
    }
  };

  const handleAWSAccessConfirm = (accessGiven) => {
    setShowAWSModal(false);
    // Only proceed with approval if accessGiven is true
    if (accessGiven === true) {
      handleApprove(accessGiven);
    }
    // If accessGiven is null/undefined (cancelled), don't approve
  };

  const handleAWSModalClose = () => {
    setShowAWSModal(false);
    setLoading(false);
  };

  return (
    <>
      <Dialog
        open={open && !showAWSModal}
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
          <CheckCircleIcon color="success" fontSize="small" />
          <Typography variant="subtitle1" component="div" fontWeight={600}>
            Approve Student
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
              sx={{ mb: 2.5, mt: 5, animation: "fadeIn 0.3s ease-in-out" }}
              size="small"
            >
              Student approved successfully!
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              Are you sure you want to approve <strong>{student?.name}</strong>{" "}
              for the internship?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              This action will update their status to "Approved" and they will
              be notified.
            </Typography>

            {/* {isAWSDomain && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  backgroundColor: theme.palette.warning.light,
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.warning.main}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.warning.contrastText,
                  }}
                >
                  📋 Note: This is an {student?.domain} domain. You'll be asked
                  to verify AWS Academy access.
                </Typography>
              </Box>
            )} */}
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
            onClick={handleApproveClick}
            color="success"
            variant="contained"
            size="small"
            disabled={loading || success}
            startIcon={
              loading ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={{
              color: "#fff",
              borderRadius: "8px",
              background: "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
              boxShadow: "0 4px 10px rgba(76, 175, 80, 0.3)",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(45deg, #286c2b 30%, #43a047 90%)",
                boxShadow: "0 6px 12px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            {loading ? "Processing..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AWS Academy Access Modal */}
      <AWSAcademyAccessModal
        open={showAWSModal}
        onClose={handleAWSModalClose}
        domain={student?.domain}
        studentName={student?.name}
        studentEmail={student?.email}
        onConfirm={handleAWSAccessConfirm}
        isMultiple={false}
      />
    </>
  );
};

export default ApprovalConfirmationModal;
