import { Card, Divider, Typography, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../../theme";

const Company = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card
      sx={{ bgcolor: colors.blueAccent[800], py: 0.5, px: 1, height:"100%" }}
      elevation={5}
    >
      <Typography
        sx={{
          fontSize: 14,
          color: colors.blueAccent[300],
          fontWeight: 600,
          ml: 0.5,
        }}
      >
        Company
      </Typography>
      <Divider />
    </Card>
  );
};

export default Company;