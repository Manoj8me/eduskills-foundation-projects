import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  IconButton,
  Tooltip,
  Grid,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Help as HelpIcon } from "@mui/icons-material";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

import FDPStatusSection from "./FDPStatusSection";
import TechCampSection from "./TechCampSection";
import ConnectStatusSection from "./ConnectStatusSection";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  fontFamily: '"Poppins","Roboto", "Helvetica", "Arial", sans-serif',
  padding: theme.spacing(3, 4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const HelpIconContainer = styled(IconButton)(({ theme }) => ({
  width: "12px",
  height: "12px",
  backgroundColor: theme.palette.grey[300],
  "&:hover": {
    backgroundColor: theme.palette.grey[400],
  },
  "& .MuiSvgIcon-root": {
    fontSize: "8px",
    color: theme.palette.text.secondary,
  },
}));

// Main Implementation Component
const EventStatusDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BASE_URL}/internship/get-edp-faculty`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setDashboardData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <StyledContainer maxWidth={false}>
        <Box display="flex" alignItems="center" gap={1} mb={4}>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Event Status Overview
          </Typography>
          <Tooltip title="Event status information">
            <HelpIconContainer size="small">
              <HelpIcon />
            </HelpIconContainer>
          </Tooltip>
        </Box>
        <Alert severity="error">Error: {error}</Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth={false}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Event Status Overview
        </Typography>
        <Tooltip title="Event status information">
          <HelpIconContainer size="small">
            <HelpIcon />
          </HelpIconContainer>
        </Tooltip>
      </Box>

      {/* Grid Layout for Sections */}
      <Grid container spacing={3}>
        {/* FDP Status - Full width on mobile, 2/3 on desktop */}
        <Grid item xs={12} lg={8}>
          <FDPStatusSection
            fdpData={dashboardData}
            loading={loading}
            error={error}
          />
        </Grid>

        {/* Tech Camp - Full width on mobile, 1/3 on desktop */}
        <Grid item xs={12} lg={4}>
          <TechCampSection
            techCampData={dashboardData?.techcamp_summary}
            loading={loading}
            error={error}
          />
        </Grid>

        {/* Connect Status - Full width */}
        <Grid item xs={12}>
          <ConnectStatusSection
            connectData={dashboardData?.connect_event_summary}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default EventStatusDashboard;
