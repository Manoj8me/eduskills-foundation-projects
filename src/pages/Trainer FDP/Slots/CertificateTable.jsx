import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Button,
  CircularProgress,
  Checkbox,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  EmojiEvents as AwardIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";

const CertificateTableSkeleton = () => (
  <TableContainer
    component={Paper}
    sx={{
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
      overflow: "hidden",
    }}
  >
    <Table size="small">
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #D1D5DB",
          }}
        >
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Select
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Student Details
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>Email</TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Roll No
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Branch
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Domain
          </TableCell>
          <TableCell>Certificate Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(8)].map((_, index) => (
          <TableRow key={index}>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton
                variant="rectangular"
                width={18}
                height={18}
                sx={{ mx: "auto" }}
              />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="text" width={120} />
              </Box>
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={150} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={60} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="rounded" width={50} height={18} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={100} />
            </TableCell>
            <TableCell>
              <Skeleton variant="rounded" width={80} height={18} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const CertificateTable = ({
  students,
  searchTerm,
  setSearchTerm,
  getBranchColor,
  loading,
  bookingId,
  onSuccess,
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    studentsToIssue: [],
    nonEligibleStudents: [],
  });

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.track.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm)
  );

  const selectableStudents = filteredStudents.filter(
    (student) => student.is_eligible !== 2 && student.is_eligible !== 3
  );

  const getCertificateStatus = (eligibilityStatus) => {
    switch (eligibilityStatus) {
      case 0:
        return {
          label: "Not Eligible",
          color: "#F44336",
          bgColor: "#FFEBEE",
          icon: <CancelIcon sx={{ fontSize: "0.8rem" }} />,
        };
      case 1:
        return {
          label: "Eligible",
          color: "#4CAF50",
          bgColor: "#E8F5E8",
          icon: <CheckCircleIcon sx={{ fontSize: "0.8rem" }} />,
        };
      case 2:
        return {
          label: "Issued",
          color: "#2196F3",
          bgColor: "#E3F2FD",
          icon: <VerifiedIcon sx={{ fontSize: "0.8rem" }} />,
        };
      case 3:
        return {
          label: "Issued",
          color: "#2196F3",
          bgColor: "#E3F2FD",
          icon: <VerifiedIcon sx={{ fontSize: "0.8rem" }} />,
        };
      default:
        return {
          label: "Unknown",
          color: "#9E9E9E",
          bgColor: "#F5F5F5",
          icon: null,
        };
    }
  };

  const handleSelectStudent = (studentId, isChecked) => {
    if (isChecked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedStudents(selectableStudents.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleIssueCertificate = async () => {
    if (selectedStudents.length === 0) {
      onSuccess("Please select at least one student.", "warning");
      return;
    }

    const studentsToIssue = filteredStudents.filter((student) =>
      selectedStudents.includes(student.id)
    );

    const nonEligibleStudents = studentsToIssue.filter(
      (student) => student.is_eligible === 0
    );

    if (nonEligibleStudents.length > 0) {
      setConfirmationModal({
        open: true,
        studentsToIssue,
        nonEligibleStudents,
      });
      return;
    }

    await proceedWithCertificateIssuance();
  };

  const proceedWithCertificateIssuance = async () => {
    setIssuingCertificate(true);

    try {
      const payload = {
        bookslot_id: parseInt(bookingId),
        student_ids: selectedStudents.map((id) => parseInt(id)),
      };

      const response = await fetch(`${BASE_URL}/event/update-eligibility`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to issue certificates");
      }

      // Refresh data by calling the trainer API
      const refreshResponse = await fetch(
        `${BASE_URL}/event/trainer/${bookingId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        onSuccess("Certificates issued successfully!", "success", refreshData);
      } else {
        onSuccess("Certificates issued successfully!", "success");
      }

      setSelectedStudents([]);
      setConfirmationModal({
        open: false,
        studentsToIssue: [],
        nonEligibleStudents: [],
      });
    } catch (error) {
      console.error("Error issuing certificates:", error);
      onSuccess("Failed to issue certificates. Please try again.", "error");
    } finally {
      setIssuingCertificate(false);
    }
  };

  const handleConfirmIssuance = () => {
    proceedWithCertificateIssuance();
  };

  const handleCancelIssuance = () => {
    setConfirmationModal({
      open: false,
      studentsToIssue: [],
      nonEligibleStudents: [],
    });
  };

  const isAllSelectableSelected =
    selectableStudents.length > 0 &&
    selectableStudents.every((student) =>
      selectedStudents.includes(student.id)
    );

  const isSomeSelectableSelected =
    selectableStudents.some((student) =>
      selectedStudents.includes(student.id)
    ) && !isAllSelectableSelected;

  if (loading) {
    return (
      <>
        <Paper sx={{ p: 2, mb: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Skeleton variant="rounded" width={300} height={40} />
            <Skeleton variant="rounded" width={150} height={36} />
          </Box>
        </Paper>
        <CertificateTableSkeleton />
      </>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 250px)",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Paper sx={{ p: 2, mb: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9CA3AF", fontSize: "1rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 300,
                "& .MuiOutlinedInput-root": { backgroundColor: "#FFFFFF" },
              }}
              size="small"
            />

            {selectableStudents.length > 0 && (
              <Button
                variant="contained"
                startIcon={
                  issuingCertificate ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <AwardIcon />
                  )
                }
                onClick={handleIssueCertificate}
                disabled={selectedStudents.length === 0 || issuingCertificate}
                sx={{
                  backgroundColor: "#4CAF50",
                  "&:hover": { backgroundColor: "#45A049" },
                  "&:disabled": { backgroundColor: "#CCCCCC" },
                }}
              >
                {issuingCertificate
                  ? "Issuing..."
                  : `Issue Certificate${
                      selectedStudents.length > 1 ? "s" : ""
                    } (${selectedStudents.length})`}
              </Button>
            )}
          </Box>
        </Paper>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500 }}>
            Certificate Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            Manage student certificate eligibility and issuance
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#F8FAFC",
                  borderBottom: "1px solid #D1D5DB",
                }}
              >
                <TableCell sx={{ width: 60, borderRight: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {selectableStudents.length > 0 && (
                      <Checkbox
                        checked={isAllSelectableSelected}
                        indeterminate={isSomeSelectableSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        size="small"
                        sx={{
                          color: "#4CAF50",
                          "&.Mui-checked": { color: "#4CAF50" },
                          "&.MuiCheckbox-indeterminate": { color: "#4CAF50" },
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#374151" }}
                    >
                      Select
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Student Details
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Email
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Roll No
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Branch
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Domain
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Certificate Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, index) => {
                const statusInfo = getCertificateStatus(student.is_eligible);
                const isSelectable =
                  student.is_eligible !== 2 && student.is_eligible !== 3;
                const isSelected = selectedStudents.includes(student.id);

                return (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#F9FAFB" },
                      "& td": {
                        borderBottom:
                          index === filteredStudents.length - 1
                            ? "none"
                            : "1px solid #E5E7EB",
                      },
                    }}
                  >
                    <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) =>
                          handleSelectStudent(student.id, e.target.checked)
                        }
                        disabled={!isSelectable}
                        size="small"
                        sx={{
                          color: "#4CAF50",
                          "&.Mui-checked": { color: "#4CAF50" },
                          "&.Mui-disabled": { color: "#BDBDBD" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            backgroundColor: student.avatar,
                            fontWeight: 600,
                            fontSize: "0.6rem",
                          }}
                        >
                          {student.initials}
                        </Avatar>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1F2937",
                            lineHeight: 1.2,
                          }}
                        >
                          {student.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {student.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280", fontWeight: 500 }}
                      >
                        {student.rollNo}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                      <Chip
                        label={student.branch}
                        sx={{
                          backgroundColor: `${getBranchColor(
                            student.branch
                          )}15`,
                          color: getBranchColor(student.branch),
                          fontWeight: 500,
                          borderRadius: "4px",
                          fontSize: "0.6rem",
                          height: "18px",
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#4B5563",
                          fontSize: "0.65rem",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={student.track}
                      >
                        {student.track}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusInfo.icon}
                        label={statusInfo.label}
                        sx={{
                          backgroundColor: statusInfo.bgColor,
                          color: statusInfo.color,
                          fontWeight: 500,
                          borderRadius: "4px",
                          fontSize: "0.6rem",
                          height: "20px",
                        }}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      No students found matching your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Paper
          sx={{ p: 2, mt: 2, mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#1F2937" }}>
            Summary
          </Typography>
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Total Students: <strong>{filteredStudents.length}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Not Eligible:{" "}
              <strong>
                {filteredStudents.filter((s) => s.is_eligible === 0).length}
              </strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Eligible:{" "}
              <strong>
                {filteredStudents.filter((s) => s.is_eligible === 1).length}
              </strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Issued:{" "}
              <strong>
                {
                  filteredStudents.filter(
                    (s) => s.is_eligible === 2 || s.is_eligible === 3
                  ).length
                }
              </strong>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={confirmationModal.open}
        onClose={handleCancelIssuance}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "8px" } }}
      >
        <DialogTitle
          sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
        >
          <WarningIcon sx={{ color: "#FF9800" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Certificate Issuance Confirmation
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            You are about to issue certificates to{" "}
            <strong>{confirmationModal.studentsToIssue.length}</strong> student
            {confirmationModal.studentsToIssue.length > 1 ? "s" : ""}.
          </DialogContentText>

          {confirmationModal.nonEligibleStudents.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: "#F44336", fontWeight: 500, mb: 1 }}
              >
                Warning: The following{" "}
                {confirmationModal.nonEligibleStudents.length > 1
                  ? "students are"
                  : "student is"}{" "}
                marked as "Not Eligible":
              </Typography>
              <Paper
                sx={{
                  p: 1,
                  backgroundColor: "#FFEBEE",
                  border: "1px solid #FFCDD2",
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                <List dense>
                  {confirmationModal.nonEligibleStudents.map((student) => (
                    <ListItem key={student.id} sx={{ py: 0.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: student.avatar,
                            fontSize: "0.6rem",
                          }}
                        >
                          {student.initials}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={student.name}
                        secondary={`${student.rollNo} - ${student.branch}`}
                        primaryTypographyProps={{ fontSize: "0.8rem" }}
                        secondaryTypographyProps={{ fontSize: "0.7rem" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          <Typography variant="body2" sx={{ color: "#4B5563", mt: 2 }}>
            Are you sure you want to proceed with issuing certificates to all
            selected students?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancelIssuance}
            sx={{ color: "#6B7280", "&:hover": { backgroundColor: "#F3F4F6" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmIssuance}
            variant="contained"
            startIcon={
              issuingCertificate ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <AwardIcon />
              )
            }
            disabled={issuingCertificate}
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45A049" },
              "&:disabled": { backgroundColor: "#CCCCCC" },
            }}
          >
            {issuingCertificate ? "Issuing..." : "Issue Certificates"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateTable;
