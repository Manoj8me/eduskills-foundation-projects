import { Grid, useTheme } from "@mui/material";
import React from "react";
import CountCard from "../../common/card/CountCard";
import { tokens } from "../../../theme";
const data = [];

const TotalSection = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CountCard
          length={4}
          data={data}
          gridSize={{ xs: 12, sm: 6, md: 12 }}
          bgcolor={colors.blueAccent[800]}
          cardSize={{
            py: 0.6,
            px: 1,
            skeleton: { icon: 40, count: 24, title: 16 },
            dataCard: { icon: 30, count: 18, title: 12 },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TotalSection;
