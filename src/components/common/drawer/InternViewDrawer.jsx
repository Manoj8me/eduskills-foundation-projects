// import React from "react";
// import Drawer from "@mui/material/Drawer";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   Typography,
//   Box,
//   Container,
//   useTheme,
//   //   Paper,
//   Stack,
//   Paper,
// } from "@mui/material";
// import { tokens } from "../../../theme";
// import StudentAccordions from "../accordion/StudentAccordion";

// const InternViewDrawer = ({ isOpen, onClose, drawerData, title, viewData }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const { profile, internship } = viewData;

//   const handleClose = () => {
//     onClose();
//   };
//   console.log(viewData);
//   const formatKey = (key) => {
//     const formattedKey = key
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (match) => match.toUpperCase());
//     return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
//   };

//   return (
//     <Drawer anchor="left" open={isOpen} sx={{overflowY: "hidden" }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           bgcolor: colors.blueAccent[800],
//           px: 2,
//           py: 0.5,

//         }}
//       >
//         <Typography
//           variant="h6"
//           color={colors.blueAccent[200]}
//           fontWeight={600}
//         >
//           {drawerData?.name || title}
//         </Typography>
//         <IconButton
//           color="inherit"
//           aria-label="Close Drawer"
//           onClick={handleClose}
//           edge="end"
//         >
//           <CloseIcon />
//         </IconButton>
//       </Box>
//       <Container
//         sx={{
//           [theme.breakpoints.down("sm")]: {
//             maxWidth: "600px",
//           },
//           [theme.breakpoints.up("sm")]: {
//             width: "600px",
//           },
//           my: 1,
//         }}
//       >
//         {profile ? (
//           <Paper elevation={0} sx={{ p: 2, bgcolor: colors.blueAccent[900] }}>
//             {profile.map((value, index) => (
//               <Box sx={{ display: "flex" }} key={index}>
//                 <Typography sx={{ minWidth: 85 }}>
//                   <strong>{formatKey(value.title)}</strong>
//                 </Typography>
//                 <Typography>
//                   <strong>: </strong> {value.value}
//                 </Typography>
//               </Box>
//             ))}
//           </Paper>
//         ) : (
//           <Typography>No data to view</Typography>
//         )}
//         {/* <Paper elevation={0}> */}
//         <Stack
//           direction="column"
//           // spacing={2}
//           sx={{
//             // overflowY: "auto", // Enable vertical scrolling
//             maxHeight: "90vh", // Set a maximum height to control the scrollable area
//             p: 1,
//           }}
//         >
//           <StudentAccordions />
//         </Stack>
//         {/* </Paper> */}
//       </Container>
//     </Drawer>
//   );
// };

// export default InternViewDrawer;

import React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Box,
  Container,
  useTheme,
  Stack,
  Paper,
} from "@mui/material";
import { tokens } from "../../../theme";
import StudentAccordions from "../accordion/StudentAccordion";

const InternViewDrawer = ({ isOpen, onClose, drawerData, title, viewData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { profile, internship } = viewData;

  const handleClose = () => {
    onClose();
  };

  const formatKey = (key) => {
    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
    return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
  };

  return (
    <Drawer anchor="left" open={isOpen} sx={{ overflowY: "hidden" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.drawer + 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: colors.blueAccent[800],
          px: 2,
          py: 0.5,
        }}
      >
        <Typography
          variant="h6"
          color={colors.blueAccent[200]}
          fontWeight={600}
        >
          {drawerData?.name || title}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Close Drawer"
          onClick={handleClose}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Container
        sx={{
          [theme.breakpoints.down("sm")]: {
            maxWidth: "600px",
          },
          [theme.breakpoints.up("sm")]: {
            width: "600px",
          },
          my: 1,
          overflowY: "auto",
          flex: 1,
        }}
      >
        {profile && (
          <Paper
            elevation={1}
            sx={{ py: 1.5, px: 1, bgcolor: colors.blueAccent[900], my: 0.5 }}
          >
            <Typography
              variant="body2"
              sx={{
                mb: 0.2,
                ml: 1,
                color: colors.blueAccent[300],
                fontWeight: 600,
              }}
            >
              Profile
            </Typography>
            <Paper elevation={0} sx={{ px: 1, py: 0.5 }}>
              {profile.map((value, index) => (
                <Box sx={{ display: "flex" }} key={index}>
                  <Typography sx={{ minWidth: 85 }}>
                    <strong>{formatKey(value.title)}</strong>
                  </Typography>
                  <Typography>
                    <strong>: </strong> {value.value}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Paper>
        )}
        <Paper
          // direction="column"
          sx={{
            bgcolor: colors.blueAccent[900],
            overflowY: "auto",
            maxHeight: "calc(100vh - 60px)", // Adjust the height accordingly
            p: 1,
            my: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              my: 0.2,
              ml: 1,
              color: colors.blueAccent[300],
              fontWeight: 600,
            }}
          >
            Internship
          </Typography>
          <StudentAccordions data={internship} />
        </Paper>
      </Container>
    </Drawer>
  );
};

export default InternViewDrawer;
