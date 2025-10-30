import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Typography, Grid, useTheme } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { tokens } from "../../theme";

const BreadCrumb = ({ title, pageTitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
 
    <Grid container justifyContent="space-between" alignItems='center'>
      <Grid item>
        <Typography variant="h5" fontWeight="bold" textTransform={'uppercase'}>{title}</Typography>
      </Grid>
      <Grid item>
        <Breadcrumbs separator={<NavigateBeforeIcon fontSize="small"/>} aria-label="breadcrumb" >
          
          <Typography variant='h6' color={colors.blueAccent[300]}>{title}</Typography>

          <Link color="inherit" href="#" style={{textDecoration:'none'}}>
            <Typography variant='h6' color={colors.blueAccent[400]}>
            {pageTitle}
            </Typography>
          </Link>
        </Breadcrumbs>
      </Grid>

    </Grid>
  );
};

export default BreadCrumb;
