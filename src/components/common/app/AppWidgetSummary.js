// // @mui
// import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
// import { Box, Card, Divider, Grid, Typography,Button, useTheme } from '@mui/material';
// // utils
// import { fShortenNumber } from '../../../utils/formatNumber';
// import { Link } from 'react-router-dom';
// import { tokens } from '../../../theme';
// import { useState } from 'react';
// // ----------------------------------------------------------------------

// const CommonTextStyle = styled(Button)(({ color,opacity,disabled }) => ({
//   bgcolor: (theme) => theme.palette[color].lighter,

//   opacity:opacity,
  
//   transition: 'background-color 0.4s, opacity 0.4s',
//   width:'100%',
//   '&:hover': {
//       opacity: 0.9,
//       color:'#ffff',
//     },

//     }));

// // ----------------------------------------------------------------------

// AppWidgetSummary.propTypes = {
//   title: PropTypes.string.isRequired,
//   upcoming: PropTypes.number.isRequired,
//   inprogress: PropTypes.number.isRequired,
//   completed: PropTypes.number.isRequired,
//   color: PropTypes.string,
//   sx: PropTypes.object,
// };

// export default function AppWidgetSummary({ title, total, icon,upcoming,inprogress,completed, color = 'primary', sx, ...other }) {

//   const anchor = title.toLowerCase().replace(/ /g, '-');
//   const [activeSection, setActiveSection] = useState('upcoming');
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <Card
//     elevation={4}
//     className="card-animate"
//       sx={{
//         py: 2,
//         px:2,
//         // boxShadow: 0,
//         textAlign: 'center',
//         color: colors.blueAccent[100],
//         bgcolor: colors.blueAccent[800],
        
//         ...sx,
//       }}
//       {...other}
//     >

//       <Box mb={2}>
//         <Typography variant='h5' sx={{ opacity: 0.72,mb:1}}>
//           {title}
//           </Typography>
//         <Divider/>
//       </Box>
       
//       <Grid container spacing={1} mb={1}>
//           <Grid item xs={4}>
//           <Link to={`${anchor}`}>
//               <CommonTextStyle
//               variant='contained' 
//               size='small' 
//               color="warning"
//               onClick={() => setActiveSection('upcoming')}
//               >
//                   Upcoming
//               </CommonTextStyle>
//             </Link>
//           </Grid>
//           <Grid item xs={4}>
//             <Link to={`${anchor}`}>
//               <CommonTextStyle 
//               variant='contained' 
//               size='small' 
//               color="info"
//               onClick={() => setActiveSection('inprogress')}
//                >
//                   Inprogress
//               </CommonTextStyle>
//             </Link>
//           </Grid>
//           <Grid item xs={4}>
//             <Link to={`${anchor}`}>
//               <CommonTextStyle 
//               variant='contained' 
//               size='small' 
//               color="success"
//               onClick={() => setActiveSection('completed')}
//               >
//                   Completed
//               </CommonTextStyle>
//             </Link> 
//           </Grid>
//       </Grid>
      
//       <Grid container spacing={2}>
//           <Grid item xs={4}>
//           <Typography variant="h4" >
//           {fShortenNumber(upcoming)}
//       </Typography>
//           </Grid>
//           <Grid item xs={4}>
//           <Typography variant="h4" >
//           {fShortenNumber(inprogress)}
//       </Typography>
//           </Grid>
//           <Grid item xs={4}>
//           <Typography variant="h4" >
//           {fShortenNumber(completed)}
//       </Typography>
//           </Grid>
//       </Grid> 
//     </Card>
//   );
// }

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Card, Divider, Grid, Typography, useTheme } from '@mui/material';
import { fShortenNumber } from '../../../utils/formatNumber';
import { tokens } from '../../../theme';


const CommonTextStyle = styled('div')(({ color }) => ({
  backgroundColor: color,
  width: '100%',
  borderRadius:3
}));

AppWidgetSummary.propTypes = {
  title: PropTypes.string.isRequired,
  upcoming: PropTypes.number.isRequired,
  inprogress: PropTypes.number.isRequired,
  completed: PropTypes.number.isRequired,
  color: PropTypes.string,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({ title, total, icon, upcoming, inprogress, completed, color = 'primary', sx, ...other }) {
  const anchor = title.toLowerCase().replace(/ /g, '-');
  // const [activeSection, setActiveSection] = useState('upcoming');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      elevation={4}
      className="card-animate"
      sx={{
        py: 2,
        px: 2,
        textAlign: 'center',
        color: colors.blueAccent[100],
        bgcolor: colors.blueAccent[800],
        ...sx,
      }}
      {...other}
    >
      <Box mb={2}>
        <Typography variant='h5' sx={{ opacity: 0.72, mb: 1 }}>
          {title}
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={1} mb={1}>
        <Grid item xs={4}>
       
            <CommonTextStyle color={colors.redAccent[700]}>
              Upcoming
            </CommonTextStyle>
      
        </Grid>
        <Grid item xs={4}>
      
            <CommonTextStyle color={colors.blueAccent[600]}>
              Inprogress
            </CommonTextStyle>
    
        </Grid>
        <Grid item xs={4}>

            <CommonTextStyle color={colors.greenAccent[700]}>
              Completed
            </CommonTextStyle>

        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h4">
            {fShortenNumber(upcoming)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4">
            {fShortenNumber(inprogress)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4">
            {fShortenNumber(completed)}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}
