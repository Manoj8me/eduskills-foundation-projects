// CarouselComponent1.js
import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
// import { tokens } from "../../../../theme";
import SummaryCard from "./SummaryCard";

const CarouselComponent1 = ({ title, content }) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ width: "100%", height: 160, overflow: "auto" }}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <SummaryCard
            CardTitle="Current active1"
            data={[
              { title: "title1", count: 773 },
              { title: "title2", count: 314 },
              { title: "title3", count: 131 },
              { title: "title4", count: 131 },
            ]}
            grid={12}
          />
        </Grid>
        <Grid item xs={9}>
          <SummaryCard
            CardTitle="Current active2"
            data={[
              { title: "title1", count: 3 },
              { title: "title2", count: 12 },
              { title: "title3", count: 212 },
              { title: "title4", count: 212 },
              { title: "title5", count: 212 },
              { title: "title6", count: 212 },
              { title: "title7", count: 212 },
              { title: "title8", count: 212 },
              { title: "title9", count: 212 },
              { title: "title10", count: 212 },
            ]}
            grid={4}
          />
        </Grid>
        {/* <Grid item xs={3}>
          <SummaryCard />
        </Grid>
        <Grid item xs={3}>
          <SummaryCard />
        </Grid>
        <Grid item xs={3}>
          <SummaryCard />
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default CarouselComponent1;
