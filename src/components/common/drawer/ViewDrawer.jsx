// import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Box, Container, useTheme } from "@mui/material";
// import CommonModal from "../modal/CommonModal";
import { tokens } from "../../../theme";

const ViewDrawer = ({ isOpen, onClose, drawerData, title, viewCollage }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer anchor="left" open={isOpen}>
      {/* <div style={{ maxWidth: "600px", padding: "16px" }}> */}
      <Box
        sx={{
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
          {/* {title} */}
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
        }}
      >
        {viewCollage ? (
          <Box>
            <Typography>
              <strong>Institute Name:</strong> {viewCollage.institute_name}
            </Typography>
            <Typography>
              <strong>City Name:</strong> {viewCollage.city_name}
            </Typography>
            <Typography>
              <strong>State Name:</strong> {viewCollage.state_name}
            </Typography>
            <Typography>
              <strong>Expire Date:</strong> {viewCollage.expire_date}
            </Typography>
            <Typography>
              <strong>Valid Days:</strong> {viewCollage.valid_days}
            </Typography>
            <Typography>
              <strong>Status:</strong> {viewCollage.status}
            </Typography>
          </Box>
        ) : (
          <Typography>No data to view</Typography>
        )}
      </Container>
    </Drawer>
  );
};

export default ViewDrawer;

// import React from "react";
// import Drawer from "@mui/material/Drawer";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import { Typography, Box, Container, useTheme } from "@mui/material";
// import { tokens } from "../../../theme";

// const ViewDrawer = ({ isOpen, onClose, drawerData, title, viewCollage }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const handleClose = () => {
//     onClose();
//   };

//   return (
//     <Drawer anchor="left" open={isOpen}>
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
//         <Typography variant="h6" color={colors.blueAccent[200]} fontWeight={600}>
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
//         {viewCollage ? (
//           <Box>
//             {Object.keys(viewCollage).map((key) => (
//               <Typography key={key}>
//                 <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
//                 {viewCollage[key]}
//               </Typography>
//             ))}
//           </Box>
//         ) : (
//           <Typography>No data to view</Typography>
//         )}
//       </Container>
//     </Drawer>
//   );
// };

// export default ViewDrawer;
