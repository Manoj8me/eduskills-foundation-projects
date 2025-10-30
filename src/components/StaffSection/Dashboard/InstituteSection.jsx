import { Box, Paper, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../../theme";
import AcademyDetails from "../../dashboard/AdminTotalSection/AcademyDetails";

const InstituteSection = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box sx={{height: 246}}>
    <AcademyDetails corporateList = {[]} isLoading = {false}/>
    </Box>
    // <Paper
    //   elevation={5}
    //   sx={{ bgcolor: colors.blueAccent[800], height: 246, px:1.5 , py:1  }}
    // >
    //   <div>Academy Section</div>
    // </Paper>
  );
};

export default InstituteSection;
