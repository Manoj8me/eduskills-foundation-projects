import React from "react";
import { Box, Typography, Paper, Alert, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BusinessCenter as BusinessCenterIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  EmojiEvents as EmojiEventsIcon,
  School as SchoolIcon,
  Star as StarIcon,
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

const SubSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "left",
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
    flexDirection: "column",
    textAlign: "center",
    gap: theme.spacing(1),
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

// Connect Status Component
const ConnectStatusSection = ({ connectData, loading, error }) => {
  const renderSkeletonCards = () => (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 2, sm: 2.5, lg: 3 },
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(6, 1fr)",
        },
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Paper
          key={index}
          sx={{
            padding: { xs: 2, sm: 2.5, lg: 3 },
            borderRadius: 1.2,
            backgroundColor: "#f8f9fa",
            height: "100px",
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
        <SectionTitle variant="body2">Connect Event Status</SectionTitle>
        {renderSkeletonCards()}
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer elevation={0}>
        <SectionTitle variant="body2">Connect Event Status</SectionTitle>
        <Alert severity="error">Error: {error}</Alert>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer elevation={0}>
      <SectionTitle variant="body2">Connect Event Status</SectionTitle>

      {/* All Cards in One Row with Section Backgrounds */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, sm: 2.5, lg: 3 },
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(6, 1fr)",
          },
          position: "relative",
          paddingTop: { xs: "16px", lg: "28px" },
        }}
      >
        {/* Desktop Section Backgrounds */}
        <Box
          sx={{
            display: { xs: "none", lg: "contents" },
          }}
        >
          {/* Individual Section Background */}
          <Box
            sx={{
              position: "absolute",
              gridColumn: "3 / 5", // Spans columns 3-4
              top: "20px",
              bottom: "0px",
              backgroundColor: "rgba(255, 152, 0, 0.04)",
              borderRadius: "8px",
              zIndex: 0,
              margin: "0 -8px", // Slight expansion for visual grouping
            }}
          />

          {/* Institute Section Background */}
          <Box
            sx={{
              position: "absolute",
              gridColumn: "5 / 7", // Spans columns 5-6
              top: "20px",
              bottom: "0px",
              backgroundColor: "rgba(233, 30, 99, 0.04)",
              borderRadius: "8px",
              zIndex: 0,
              margin: "0 -8px", // Slight expansion for visual grouping
            }}
          />
        </Box>

        {/* Desktop Section Labels */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            position: "absolute",
            top: "0px",
            left: "calc(33.33% + 8px)",
            zIndex: 1,
          }}
        >
          <SubSectionTitle
            sx={{ margin: 0, color: "#f57c00", fontSize: "0.7rem" }}
          >
            Individual
          </SubSectionTitle>
        </Box>

        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            position: "absolute",
            top: "0px",
            left: "calc(66.66% + 8px)",
            zIndex: 1,
          }}
        >
          <SubSectionTitle
            sx={{ margin: 0, color: "#c2185b", fontSize: "0.7rem" }}
          >
            Institute
          </SubSectionTitle>
        </Box>

        {/* Mobile/Tablet Section Headers */}
        <Box
          sx={{
            gridColumn: "1 / -1",
            display: { xs: "block", lg: "none" },
            marginBottom: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gap: { xs: 1, sm: 2 },
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                backgroundColor: "rgba(255, 152, 0, 0.08)",
                borderRadius: "6px",
                padding: { xs: "4px 8px", sm: "6px 12px" },
                border: "1px solid rgba(255, 152, 0, 0.2)",
              }}
            >
              <SubSectionTitle
                sx={{
                  margin: 0,
                  color: "#f57c00",
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                }}
              >
                Individual
              </SubSectionTitle>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                backgroundColor: "rgba(233, 30, 99, 0.08)",
                borderRadius: "6px",
                padding: { xs: "4px 8px", sm: "6px 12px" },
                border: "1px solid rgba(233, 30, 99, 0.2)",
              }}
            >
              <SubSectionTitle
                sx={{
                  margin: 0,
                  color: "#c2185b",
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                }}
              >
                Institute
              </SubSectionTitle>
            </Box>
          </Box>
        </Box>

        {/* Card 1: Events Hosted */}
        <StatusCard
          statuscolor="#9c27b0"
          statusbgcolor="#f3e5f5"
          elevation={0}
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#9c27b0">
              <BusinessCenterIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#9c27b0">
                {connectData?.hosted_connect_events_count || 0}
              </CountText>
              <LabelText>Events Hosted</LabelText>
            </Box>
          </Box>
        </StatusCard>

        {/* Card 2: Participated */}
        <StatusCard
          statuscolor="#2196f3"
          statusbgcolor="#e3f2fd"
          elevation={0}
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#2196f3">
              <PeopleIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#2196f3">
                {connectData?.participated_count || 0}
              </CountText>
              <LabelText>Participated</LabelText>
            </Box>
          </Box>
        </StatusCard>

        {/* Card 3: Individual Nominated */}
        <StatusCard
          statuscolor="#ff9800"
          statusbgcolor="#fff3e0"
          elevation={0}
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#ff9800">
              <PersonAddIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#ff9800">
                {connectData?.participant_nominated_count || 0}
              </CountText>
              <LabelText>Nominated</LabelText>
            </Box>
          </Box>
        </StatusCard>

        {/* Card 4: Individual Winner */}
        <StatusCard
          statuscolor="#4caf50"
          statusbgcolor="#e8f5e8"
          elevation={0}
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#4caf50">
              <EmojiEventsIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#4caf50">
                {connectData?.participant_winner_count || 0}
              </CountText>
              <LabelText>Winner</LabelText>
            </Box>
          </Box>
        </StatusCard>

        {/* Card 5: Institute Nominated */}
        <StatusCard
          statuscolor="#e91e63"
          statusbgcolor="#fce4ec"
          elevation={0}
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#e91e63">
              <SchoolIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#e91e63">
                {connectData?.institute_nominated_count || 0}
              </CountText>
              <LabelText>Nominated</LabelText>
            </Box>
          </Box>
        </StatusCard>

        {/* Card 6: Institute Winner */}
        <StatusCard
          statuscolor="#673ab7"
          statusbgcolor="#ede7f6"
          elevation={0}
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#673ab7">
              <StarIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#673ab7">
                {connectData?.institute_winner_count || 0}
              </CountText>
              <LabelText>Winner</LabelText>
            </Box>
          </Box>
        </StatusCard>
      </Box>
    </SectionContainer>
  );
};

export default ConnectStatusSection;
