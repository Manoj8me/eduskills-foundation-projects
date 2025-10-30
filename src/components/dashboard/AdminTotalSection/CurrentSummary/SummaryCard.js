import { Box, Card, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../../../theme";

const DataCard = ({ bgcolor, textColor, item }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: 27,
        mx: 1,
        mb: 0.8,
        bgcolor: bgcolor,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: textColor,
          fontWeight: 500,
          mx: 1,
          // mt: 0.4,
        }}
      >
        {item.title}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          // color: textColor,
          fontWeight: 700,
          mx: 1,
          // mt: 0.4,
        }}
      >
        {item.count}
      </Typography>
    </Card>
  );
};

const SummaryCard = ({
  CardTitle = "Current active",
  data = [
    { title: "title1", count: 0 },
    { title: "title2", count: 0 },
    { title: "title3", count: 0 },
    { title: "title4", count: 0 },
  ],
  grid =12,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const rows = Math.ceil(data.length / grid);
  return (
    <Card
      elevation={0}
      sx={{ height: "100%", width: "100%", bgcolor: colors.blueAccent[800] }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: colors.blueAccent[300],
          fontWeight: 600,
          mx: 1,
          mt: 0.4,
        }}
      >
        {CardTitle}
      </Typography>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          py: 0.2,
          bgcolor: colors.blueAccent[800],
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Grid container key={rowIndex}>
            {data.slice(rowIndex * grid, (rowIndex + 1) * grid).map((item, index) => (
              <Grid item xs={grid === 12 ? 12 : 12  / grid} key={index}>
                <DataCard
                  bgcolor={colors.background[100]}
                  textColor={colors.blueAccent[300]}
                  item={item}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
    </Card>
  );
};

export default SummaryCard;
