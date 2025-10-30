
import React from 'react';
import { Typography, Divider, useTheme } from '@mui/material';
import { tokens } from "../theme";


const Footer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <footer 
    style={{ 
      // position:'fixed', 
      // bottom: 0,
      width:'100%',
      // backgroundColor:colors.grey[900]
      }}>
      <Divider />
            <Typography variant="body2" sx={{p:1, pl:3}}>
            {new Date().getFullYear()} © EduSkills Foundation.
            </Typography>
    </footer>
  );
};

export default Footer;

