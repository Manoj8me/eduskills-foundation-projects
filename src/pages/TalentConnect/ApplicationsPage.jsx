import { Container, Typography, useTheme } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import { tokens } from "../../theme";
import JobApplications from "../../components/TalentConnect/JobApplications";

const ApplicationsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      {/* <Helmet>
        <title> Job Applications | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
        >
          Welcome back to Job Applications !
        </Typography>
      </Container> */}
      <JobApplications />
    </>
  );
};

export default ApplicationsPage;
