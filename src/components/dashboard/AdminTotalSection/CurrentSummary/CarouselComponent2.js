// CarouselComponent1.js
import React from "react";
import { Paper, Typography } from "@mui/material";

const CarouselComponent2 = ({ title, content }) => {
  return (
    <Paper elevation={0} sx={{width:'100%',height:160}}>
      <Typography variant="h5">{title}</Typography>
      <Typography>{content}</Typography>
    </Paper>
  );
};

export default CarouselComponent2;
