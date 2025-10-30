import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudIcon from "@mui/icons-material/Cloud";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadIcon from "@mui/icons-material/Download";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    maxWidth: "500px",
    width: "100%",
    margin: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(90deg, #ff9800 0%, #ffc107 100%)",
  padding: theme.spacing(2.5, 3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  color: "white",
}));

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    maxWidth: 350,
    fontSize: "0.8rem",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    padding: 0,
    transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
  },
  "& .MuiTooltip-arrow": {
    color: theme.palette.common.white,
    "&:before": {
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}));

const EmailListContainer = styled(Paper)(({ theme }) => ({
  maxHeight: "200px",
  overflow: "auto",
  borderRadius: "12px",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.grey[300],
    borderRadius: "4px",
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1.2),
  justifyContent: "flex-end",
  flexWrap: "nowrap",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "row",
    gap: theme.spacing(0.8),
    padding: theme.spacing(2, 2),
  },
}));

const AWSAcademyAccessModal = ({
  open,
  onClose,
  domain,
  studentName,
  studentEmail,
  onConfirm,
  isMultiple = false,
  studentsCount = 1,
  selectedStudents = [], // Add this prop for bulk operations
  onApproveNonAWS, // New prop for handling non-AWS students approval
}) => {
  const theme = useTheme();

  // Filter only AWS domain students
  const awsStudents = selectedStudents.filter((student) =>
    student?.domain?.toLowerCase().startsWith("aws")
  );

  // Filter non-AWS domain students
  const nonAwsStudents = selectedStudents.filter(
    (student) => !student?.domain?.toLowerCase().startsWith("aws")
  );

  const awsStudentsCount = awsStudents.length;
  const nonAwsStudentsCount = nonAwsStudents.length;

  const handleAccessGiven = () => {
    onConfirm(true); // Send access_given: true for AWS students
  };

  const handleAccessNotGiven = () => {
    if (isMultiple && nonAwsStudentsCount > 0) {
      // If there are non-AWS students, ask if they want to approve them
      if (
        window.confirm(
          `AWS Academy access not confirmed.\n\nDo you want to approve the remaining ${nonAwsStudentsCount} non-AWS student${
            nonAwsStudentsCount > 1 ? "s" : ""
          } anyway?`
        )
      ) {
        // Approve non-AWS students only
        onApproveNonAWS?.(nonAwsStudents);
      }
    }
    onConfirm(false); // Send access_given: false for AWS students
  };

  // Function to download AWS students as CSV
  const downloadAwsStudentsCSV = () => {
    if (awsStudents.length === 0) return;

    const csvContent = [
      ["Name", "Email", "Roll No", "Domain", "Branch"], // Headers
      ...awsStudents.map((student) => [
        student.name || "",
        student.email || "",
        student.rollNo || "",
        student.domain || "",
        student.branch || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `aws_students_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create email list tooltip content - only AWS students
  const EmailListTooltip = () => (
    <EmailListContainer elevation={0}>
      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
        >
          AWS Students ({awsStudentsCount})
        </Typography>
        <List dense sx={{ py: 0 }}>
          {awsStudents && awsStudents.length > 0 ? (
            awsStudents.map((student, index) => (
              <ListItem key={student.id || index} sx={{ px: 0, py: 0.5 }}>
                <ListItemText
                  primary={student.name || "Unknown Name"}
                  secondary={student.email || "No email provided"}
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.75rem",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemText
                primary="No AWS students found"
                primaryTypographyProps={{
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                  color: "text.secondary",
                }}
              />
            </ListItem>
          )}
        </List>
        {awsStudents.length > 3 && (
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={downloadAwsStudentsCSV}
              sx={{
                fontSize: "0.75rem",
                color: "primary.main",
                textTransform: "none",
              }}
            >
              Download CSV
            </Button>
          </Box>
        )}
      </Box>
    </EmailListContainer>
  );

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <StyledDialogTitle>
        {/* <CloudIcon />
        <Typography variant="subtitle1" component="div" fontWeight={600}>
          {domain} Academy Access Check
        </Typography> */}
      </StyledDialogTitle>

      <DialogContent sx={{ py: 4, px: 4 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body1"
            sx={{ mb: 3, mt: 2, fontWeight: 500, fontSize: "1rem" }}
          >
            {isMultiple ? (
              <>
                Please ensure that students enrolled in {domain} are added to
                AWS Academy before approval.
              </>
            ) : (
              <>
                Is <strong>{studentName}</strong>'s email ID added to the{" "}
                {domain} Academy?
              </>
            )}
          </Typography>

          {!isMultiple && studentEmail && (
            <Box
              sx={{
                backgroundColor: theme.palette.grey[50],
                p: 2.5,
                borderRadius: "12px",
                mb: 3,
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, fontSize: "0.85rem" }}
              >
                Student Email:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  wordBreak: "break-all",
                  fontSize: "0.95rem",
                }}
              >
                {studentEmail}
              </Typography>
            </Box>
          )}

          {isMultiple && (
            <Box
              sx={{
                backgroundColor: theme.palette.info.light,
                color: theme.palette.info.contrastText,
                p: 2.5,
                borderRadius: "12px",
                mb: 3,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {awsStudentsCount} AWS student
                  {awsStudentsCount > 1 ? "s" : ""} need verification
                </Typography>
                {awsStudents && awsStudents.length > 0 && (
                  <CustomTooltip
                    title={<EmailListTooltip />}
                    placement="right"
                    arrow
                    enterDelay={300}
                    leaveDelay={200}
                    TransitionProps={{
                      timeout: 300,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        color: "white",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </CustomTooltip>
                )}
              </Box>

              {nonAwsStudentsCount > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={`${nonAwsStudentsCount} other domain${
                      nonAwsStudentsCount > 1 ? "s" : ""
                    }`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    will be handled separately
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.9rem", lineHeight: 1.6 }}
          >
            Please verify the AWS student
            {isMultiple && awsStudentsCount > 1 ? "s have" : " has"} access
            before proceeding with approval.
          </Typography>
        </Box>
      </DialogContent>

      <StyledDialogActions>
        <Tooltip
          title={
            isMultiple
              ? nonAwsStudentsCount > 0
                ? `AWS students don't have access. You'll be asked about approving ${nonAwsStudentsCount} non-AWS student${
                    nonAwsStudentsCount > 1 ? "s" : ""
                  }.`
                : "AWS students don't have Academy access but proceed anyway"
              : "Student doesn't have AWS Academy access but proceed with approval"
          }
          placement="right"
        >
          <Button
            onClick={handleAccessNotGiven}
            color="error"
            variant="contained"
            size="small"
            startIcon={<CancelIcon fontSize="small" />}
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              color: "white",
              px: 2.5,
              py: 0.75,
              minWidth: "70px",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
            }}
          >
            No
          </Button>
        </Tooltip>

        <Tooltip
          title={
            isMultiple
              ? "Confirm that all AWS students have Academy access and proceed with approval"
              : "Student has AWS Academy access, proceed with approval"
          }
          placement="right"
        >
          <Button
            onClick={handleAccessGiven}
            color="success"
            variant="contained"
            size="small"
            startIcon={<CheckCircleIcon fontSize="small" />}
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              color: "white",
              px: 2.5,
              py: 0.75,
              minWidth: "70px",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
            }}
          >
            Yes
          </Button>
        </Tooltip>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default AWSAcademyAccessModal;
