import { Grid, Paper, Typography, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../../theme";
import CountCard from "../../common/card/CountCard";
const data = [];

const TicketSection = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={12} sm={6}>
        <Paper
          elevation={5}
          sx={{
            bgcolor: colors.blueAccent[800],
            px: 1.5,
            py: 1,
            minHeight: 246,
          }}
        >
          <Typography
            color={colors.blueAccent[300]}
            fontWeight={600}
            variant="h6"
            pb={0.6}
            sx={{
              textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
              minWidth: 90,
            }}
          >
            Institute Status
          </Typography>
          <CountCard
            length={4}
            data={data}
            gridSize={{ xs: 12 }}
            spacing={1}
            bgcolor={""}
            cardSize={{
              py: 0.8,
              px: 1,

              skeleton: { icon: 30, count: 18, title: 12 },
              dataCard: { icon: 30, count: 18, title: 12 },
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper
          elevation={5}
          sx={{
            bgcolor: colors.blueAccent[800],
            px: 1.5,
            py: 1,
            minHeight: 246,
          }}
        >
          <Typography
            color={colors.blueAccent[300]}
            fontWeight={600}
            variant="h6"
            pb={0.6}
            sx={{
              textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
              minWidth: 90,
            }}
          >
            MOU Status
          </Typography>
          <CountCard
            length={4}
            data={data}
            gridSize={{ xs: 12 }}
            spacing={1}
            bgcolor={""}
            cardSize={{
              py: 0.8,
              px: 1,

              skeleton: { icon: 30, count: 18, title: 12 },
              dataCard: { icon: 30, count: 18, title: 12 },
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TicketSection;
