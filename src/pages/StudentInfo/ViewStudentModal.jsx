import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Avatar,
  IconButton
} from '@mui/material';
import { Mail, Building2, Phone, User, UserCircle2 } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';

const ViewStudentModal = ({ open, onClose, student }) => {
  if (!student) return null;

  const studentDetails = [
    {
      label: "Email",
      value: student.mail_id,
      Icon: Mail,
      color: "#3b82f6",
    },
    {
      label: "Branch",
      value: student.branch,
      Icon: Building2,
      color: "#8b5cf6",
    },
    {
      label: "Mobile",
      value: student.mobile,
      Icon: Phone,
      color: "#10b981",
    },
    {
      label: "Gender",
      value: student.gender,
      Icon: User,
      color: "#f59e0b",
    },
    {
      label: "Passout Year",
      value: student.year,
      Icon: Building2,
      color: "#6366f1",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: theme => theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: theme =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #312e81 0%, #1e40af 100%)"
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <UserCircle2 size={24} />
          <Typography variant="h6">Student Details</Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          bgcolor: theme => theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
          mt: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: "#3b82f6",
                fontSize: "1.75rem",
              }}
            >
              {student.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: theme => theme.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
                }}
              >
                {student.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme => theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                }}
              >
                ID: {student.intake_id}
              </Typography>
            </Box>
          </Grid>

          {studentDetails.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "12px",
                  border: theme => `1px solid ${theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"}`,
                  bgcolor: theme => theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: item.color,
                    boxShadow: `0 4px 6px -1px ${item.color}20`,
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  <item.Icon size={18} color={item.color} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme => theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme => theme.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
                    fontWeight: 500,
                    pl: "26px",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          bgcolor: theme => theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="warning"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewStudentModal;