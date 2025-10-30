import React from "react";
import MultiYAxisChart from "./MultiYAxisChart";
import { Box, Container, Typography } from "@mui/material";
import Dashboard from "./Dashboard";

const AllPerformance = () => {
  return (
    <Container>
      {/* <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          ApexCharts Multiple Y-Axis Example
        </Typography>
        <MultiYAxisChart />
      </Box> */}
      <Dashboard />
    </Container>
  );
};

export default AllPerformance;
