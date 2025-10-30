import React from "react";
// import InternshipSection from "../../dashboard/InternshipSection";
import { Box, Grid } from "@mui/material";
// import TotalSection from "./TotalSection";
// import TicketSection from "./TicketSection";
// import InstituteSection from "./InstituteSection";
import Status from "./Status";

const StaffDashboard = () => {
  return (
    <Box sx={{ my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Status />
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <TotalSection />
        </Grid> */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={7}>
              <TicketSection />
            </Grid>
            <Grid item xs={12} sm={5}>
              <InstituteSection />
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      <Box my={2}>{/* <InternshipSection /> */}</Box>
    </Box>
  );
};

export default StaffDashboard;
