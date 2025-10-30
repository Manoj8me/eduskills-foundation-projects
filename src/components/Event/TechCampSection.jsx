import React from "react";
import { Box, Typography, Paper, Alert, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BusinessCenter as BusinessCenterIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Styled components
const SectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0, 136, 204, 0.08)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginBottom: theme.spacing(3),
  "&:hover": {
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  },
  transition: "box-shadow 0.2s ease-in-out",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: "2px solid #f0f0f0",
}));

const StatusCard = styled(Paper)(({ theme, statuscolor, statusbgcolor }) => ({
  padding: theme.spacing(2.5, 3),
  borderRadius: theme.spacing(1.2),
  border: `1px solid ${statuscolor}30`,
  backgroundColor: statusbgcolor,
  cursor: "default",
  transition: "all 0.3s ease-in-out",
  height: "100%",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 6px 20px ${statuscolor}40`,
    borderColor: `${statuscolor}60`,
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2, 2.5),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const IconContainer = styled(Box)(({ theme, iconcolor }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: iconcolor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  "& .MuiSvgIcon-root": {
    color: "white",
    fontSize: "1.1rem",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.2),
    "& .MuiSvgIcon-root": {
      fontSize: "1rem",
    },
  },
}));

const CountText = styled(Typography)(({ theme, countcolor }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: countcolor,
  lineHeight: 1.2,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.1rem",
  },
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: "0.775rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  lineHeight: 1.3,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
    marginTop: theme.spacing(0.25),
  },
}));

// Tech Camp Status Component
const TechCampSection = ({ techCampData, loading, error }) => {
  const renderSkeletonCards = () => (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 2, sm: 2.5, lg: 3 },
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
        },
      }}
    >
      {[1, 2].map((index) => (
        <Paper
          key={index}
          sx={{
            padding: { xs: 2, sm: 2.5, lg: 3 },
            borderRadius: 1.2,
            backgroundColor: "#f8f9fa",
            height: "80px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <Skeleton variant="circular" width={40} height={40} />
            <Box flex={1}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  if (loading) {
    return (
      <SectionContainer elevation={0}>
        <SectionTitle variant="body2">Tech Camp Status</SectionTitle>
        {renderSkeletonCards()}
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer elevation={0}>
        <SectionTitle variant="body2">Tech Camp Status</SectionTitle>
        <Alert severity="error">Error: {error}</Alert>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer elevation={0}>
      <SectionTitle variant="body2">Tech Camp Status</SectionTitle>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, sm: 2.5, lg: 3 },
          gridTemplateColumns: {
            xs: "1fr", // Single column on mobile
            sm: "repeat(2, 1fr)", // 2 columns on tablet and desktop
          },
        }}
      >
        <StatusCard statuscolor="#9c27b0" statusbgcolor="#f3e5f5" elevation={0}>
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#9c27b0">
              <BusinessCenterIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#9c27b0">
                {techCampData?.hosted_count || 0}
              </CountText>
              <LabelText>Programs Hosted</LabelText>
            </Box>
          </Box>
        </StatusCard>

        <StatusCard statuscolor="#2196f3" statusbgcolor="#e3f2fd" elevation={0}>
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#2196f3">
              <GroupIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#2196f3">
                {techCampData?.total_participate_count || 0}
              </CountText>
              <LabelText>Total Participants</LabelText>
            </Box>
          </Box>
        </StatusCard>
      </Box>
    </SectionContainer>
  );
};

export default TechCampSection;
