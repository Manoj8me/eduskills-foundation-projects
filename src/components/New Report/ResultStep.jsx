import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  alpha,
  styled,
  Divider,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Styled components
const SuccessIcon = styled(CheckCircleOutlineIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2),
}));

const ReportSummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
  backgroundColor: alpha(theme.palette.success.main, 0.05),
}));

const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  padding: "8px 16px",
  boxShadow: "0 3px 5px rgba(0,0,0,0.08)",
  fontWeight: 500,
  fontSize: "0.875rem",
  "&:hover": {
    boxShadow: "0 5px 10px rgba(0,0,0,0.12)",
  },
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 0),
  "&:not(:last-child)": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  },
}));

const ResultStep = ({ reportName, filterCriteria, onBack }) => {
  // Generate CSV for download
  const handleDownloadCSV = () => {
    console.log("Downloading CSV...");
    // In a real app, this would trigger API call to generate and download the CSV

    // Simulated CSV generation notice
    alert("CSV download started. Your report will be downloaded shortly.");
  };

  return (
    <Box>
      {/* Back button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Back to Filters
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", py: 3 }}>
        <SuccessIcon />
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Report Generated Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your report is ready to be exported.
        </Typography>
      </Box>

      <ReportSummaryCard elevation={0}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Report Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ textAlign: "left" }}>
          <SummaryItem>
            <Typography variant="body2" color="text.secondary">
              Report Name
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {reportName || "Untitled Report"}
            </Typography>
          </SummaryItem>

          <SummaryItem>
            <Typography variant="body2" color="text.secondary">
              Generated On
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {new Date().toLocaleString()}
            </Typography>
          </SummaryItem>
        </Box>
      </ReportSummaryCard>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <ExportButton
          variant="contained"
          color="primary"
          startIcon={<FileDownloadIcon />}
          onClick={handleDownloadCSV}
          fullWidth={true}
          sx={{ maxWidth: 220 }}
        >
          Download as CSV
        </ExportButton>
      </Stack>
    </Box>
  );
};

export default ResultStep;
