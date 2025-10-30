import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Popover,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FilterIcon from "@mui/icons-material/FilterList";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

// Custom Dashboard Card component
const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#0288D1", // Uniform color for all cards as requested
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
}));

const Dashboard = ({
  menuItems,
  handleSettingClick,
  selectedCohorts,
  handleCohortToggle,
  filterAnchorEl,
  openFilterPopover,
  handleFilterOpen,
  handleFilterClose,
}) => {
  // Cohort options for filter
  const cohortOptions = ["Cohort 1", "Cohort 2", "Cohort 3", "Cohort 4"];

  // Helper function to get icon for dashboard card
  const getIconForCard = (cardId) => {
    switch (cardId) {
      case "not-applied":
        return <SchoolIcon />;
      case "internship-applied":
        return <AssignmentIcon />;
      case "internship-approved":
        return <CheckCircleIcon />;
      case "certificate-verified":
        return <VerifiedUserIcon />;
      case "final-certificate":
        return <CardMembershipIcon />;
      case "failed-students":
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="#333">
          Student Status Overview
        </Typography>

        <Box>
          <IconButton
            onClick={handleFilterOpen}
            size="medium"
            sx={{
              backgroundColor: "#e3f2fd",
              "&:hover": { backgroundColor: "#bbdefb" },
            }}
          >
            <FilterIcon />
          </IconButton>

          {selectedCohorts.length > 0 && (
            <Box sx={{ display: "inline-flex", ml: 2 }}>
              {selectedCohorts.map((cohort) => (
                <Chip
                  key={cohort}
                  label={cohort}
                  size="small"
                  color="primary"
                  sx={{ mr: 0.5 }}
                  onDelete={() => handleCohortToggle(cohort)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <DashboardCard
              onClick={() => handleSettingClick(item.id)}
              sx={{ cursor: "pointer" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    color: "#1565c0",
                    mr: 2,
                  }}
                >
                  {getIconForCard(item.id)}
                </Box>
                <Typography variant="subtitle1" fontWeight={600} color="white">
                  {item.label}
                </Typography>
              </Box>

              <Typography
                variant="h3"
                fontWeight={700}
                color="white"
                sx={{ mt: "auto", textAlign: "center" }}
              >
                {item.count}
              </Typography>
            </DashboardCard>
          </Grid>
        ))}
      </Grid>

      {/* Cohort Filter Popover */}
      <Popover
        open={openFilterPopover}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Paper sx={{ width: 250, p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Filter by Cohort
          </Typography>
          <List sx={{ pt: 0 }}>
            {cohortOptions.map((cohort) => (
              <ListItem
                key={cohort}
                dense
                button
                onClick={() => handleCohortToggle(cohort)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <Checkbox
                  edge="start"
                  checked={selectedCohorts.indexOf(cohort) !== -1}
                  tabIndex={-1}
                  disableRipple
                  sx={{
                    color: "#1976d2",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
                <ListItemText primary={cohort} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>
    </Box>
  );
};

export default Dashboard;
