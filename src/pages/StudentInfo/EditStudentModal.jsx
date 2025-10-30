import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Grid,
  CircularProgress,
  InputAdornment,
  useTheme,
} from '@mui/material';
import { Building2, Mail, Phone, User, Calendar } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';

const EditEmailModal = ({
  open,
  onClose,
  selectedStudent,
  editMailId,
  setEditMailId,
  handleUpdateEmail,
  isEditing
}) => {
  const theme = useTheme();

  // Field definitions for the info cards
  const infoFields = [
    {
      label: "Branch",
      value: selectedStudent?.branch,
      icon: Building2,
    },
    {
      label: "Mobile",
      value: selectedStudent?.mobile,
      icon: Phone,
    },
    {
      label: "Gender",
      value: selectedStudent?.gender,
      icon: User,
    },
    {
      label: "Passout Year",
      value: selectedStudent?.year,
      icon: Calendar,
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={() => !isEditing && onClose()}
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
          <Mail size={24} />
          <Typography variant="h6">Edit Email Address</Typography>
        </Box>
        <IconButton
          onClick={() => !isEditing && onClose()}
          sx={{ color: "#ffffff" }}
          disabled={isEditing}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 3, pb: 4 }}>
        <Box sx={{ px: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
              pb: 3,
              borderBottom: theme =>
                `1px solid ${theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"}`,
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: theme =>
                  theme.palette.mode === "dark" ? "#3b82f6" : "#2563eb",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {selectedStudent?.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: theme =>
                    theme.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
                  fontWeight: 600,
                  wordBreak: "break-word",
                }}
              >
                {selectedStudent?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme =>
                    theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                  mt: 0.5,
                }}
              >
                ID: {selectedStudent?.intake_id}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {infoFields.map((field, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    border: theme =>
                      `1px solid ${theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"}`,
                    bgcolor: theme =>
                      theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: theme =>
                        theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <field.icon
                      size={16}
                      color={theme.palette.mode === "dark" ? "#60a5fa" : "#3b82f6"}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme =>
                          theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                        fontWeight: 500,
                      }}
                    >
                      {field.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme =>
                        theme.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
                      fontWeight: 500,
                      pl: "24px",
                    }}
                  >
                    {field.value}
                  </Typography>
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 2,
                  p: 3,
                  borderRadius: "12px",
                  border: theme =>
                    `2px solid ${theme.palette.mode === "dark" ? "#3b82f6" : "#60a5fa"}`,
                  bgcolor: theme =>
                    theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme =>
                      theme.palette.mode === "dark" ? "#60a5fa" : "#3b82f6",
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Update Email Address
                </Typography>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={editMailId}
                  onChange={(e) => setEditMailId(e.target.value)}
                  error={!editMailId.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)}
                  helperText={
                    !editMailId.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) &&
                    editMailId &&
                    "Please enter a valid email address"
                  }
                  variant="outlined"
                  size="small"
                  disabled={isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail
                          size={16}
                          color={theme.palette.mode === "dark" ? "#60a5fa" : "#3b82f6"}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: theme =>
                          theme.palette.mode === "dark" ? "#475569" : "#e2e8f0",
                      },
                      "&:hover fieldset": {
                        borderColor: theme =>
                          theme.palette.mode === "dark" ? "#60a5fa" : "#3b82f6",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={() => !isEditing && onClose()}
          variant="outlined"
          color="warning"
          disabled={isEditing}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateEmail}
          variant="contained"
          color="info"
          disabled={
            isEditing ||
            !editMailId.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/) ||
            editMailId === selectedStudent?.mail_id
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 4,
          }}
        >
          {isEditing ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Updating...
            </>
          ) : (
            "Update Email"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmailModal;