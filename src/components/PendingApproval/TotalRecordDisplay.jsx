import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AssignmentInd as AssignmentIcon } from "@mui/icons-material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(2),
  background: "linear-gradient(90deg, #f8f9fa 0%, #eef1f5 100%)",
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main + "20",
  borderRadius: "50%",
  padding: theme.spacing(1),
  marginRight: theme.spacing(2),
}));

const TextContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const CountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  height: "auto",
  padding: theme.spacing(0.5, 0),
}));

const TotalRecordsDisplay = ({ totalCount = 0, status = "Applied" }) => {
  return (
    <StyledPaper>
      <IconWrapper>
        <AssignmentIcon color="primary" />
      </IconWrapper>
      <TextContent>
        <Typography variant="subtitle1" fontWeight={500}>
          Internship Applications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing all records with status: {status}
        </Typography>
      </TextContent>
      <CountChip
        label={
          <Box sx={{ p: 0.2 }}>
            <Typography variant="body2" fontWeight={600}>
              Total Records
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} align="center">
              {totalCount}
            </Typography>
          </Box>
        }
      />
    </StyledPaper>
  );
};

export default TotalRecordsDisplay;
