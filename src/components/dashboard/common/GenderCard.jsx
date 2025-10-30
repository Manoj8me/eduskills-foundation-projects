// import React from "react";
// import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
// import { Icon } from "@iconify/react";
// import { tokens } from "../../../theme";

// const GenderCard = ({ height, data, isLoading }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   // Determine if it's a small screen based on your preferred breakpoint
//   const isSmallScreen = window.innerWidth <= 600; // Adjust the breakpoint as needed
//   const gender = data?.map((item) => {
//     let icon;
//     let color;
//     if (item.title === "Male") {
//       icon = "foundation:male";
//       color = colors.blueAccent[400];
//     } else if (item.title === "Female") {
//       icon = "foundation:female";
//       color = colors.redAccent[400];
//     } else if (item.title === "Other") {
//       icon = "mdi:human-male";
//       color = colors.greenAccent[400];
//     }

//     return {
//       label: item.title,
//       value: item.count,
//       icon: icon,
//       color: color,
//     };
//   });

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         width: "100%",
//         height: isSmallScreen ? 62 : height,
//         mb: isSmallScreen ? 2 : "none",
//       }}
//     >
//       <Typography
//         variant="subtitle2"
//         fontSize={10}
//         sx={{
//           textAlign: "center",
//           py: 0.3,
//           bgcolor: colors.blueAccent[900],
//         }}
//       >
//         Gender
//       </Typography>
//       <CardContent sx={{ m: 0.5, p: 0, height: "100%" }}>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isSmallScreen ? "row" : "column",
//             justifyContent: 'space-evenly',
//             height: "100%",
//           }}
//         >
//           {gender?.map((gender, index) => (
//             <Card
//               key={index}
//               elevation={0}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 mr: isSmallScreen && index < data.length - 1 ? 0.5 : "none",
//                 ml: isSmallScreen && index === data.length - 1 ? 0.5 : "none",
//                 px: 1,
//                 mb: 0.5,
//                 py: 0.2,
//                 bgcolor: colors.blueAccent[800],
//               }}
//             >
//               <Icon icon={gender.icon} height={25} color={gender.color} />
//               <Box display="flex" flexDirection="column" alignItems="flex-end">
//                 <Typography variant="h6" mb={-0.5} fontSize={12}>
//                   {gender.value}
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   fontSize={8}
//                   color={colors.blueAccent[300]}
//                 >
//                   {gender.label}
//                 </Typography>
//               </Box>
//             </Card>
//           ))}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default GenderCard;
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { tokens } from "../../../theme";
import { fShortenNumber } from "../../../utils/formatNumber";
import CountUp from "react-countup";

const GenderCard = ({ height, data, isLoading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Determine if it's a small screen based on your preferred breakpoint
  const isSmallScreen = window.innerWidth <= 600; // Adjust the breakpoint as needed
  const gender = data?.map((item) => {
    let icon;
    let color;
    if (item.title === "Male") {
      icon = "foundation:male";
      color = colors.blueAccent[400];
    } else if (item.title === "Female") {
      icon = "foundation:female";
      color = colors.redAccent[400];
    } else if (item.title === "Other") {
      icon = "mdi:human-male";
      color = colors.greenAccent[400];
    }

    return {
      label: item.title,
      value: item.count,
      icon: icon,
      color: color,
    };
  });

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: isSmallScreen ? 62 : height,
        mb: isSmallScreen ? 2 : "none",
      }}
    >
      <Typography
        variant="subtitle2"
        fontSize={10}
        sx={{
          textAlign: "center",
          py: 0.3,
          bgcolor: colors.blueAccent[900],
        }}
      >
        Gender
      </Typography>
      {isLoading ? (
        <CardContent sx={{ m: 0.5, p: 0, height: "100%" }}>
          {/* Add skeleton loader here */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "row" : "column",
              justifyContent: "space-evenly",
              height: "100%",
            }}
          >
            <Skeleton animation="wave" height="100%"/>
            <Skeleton animation="wave" height="100%"/>
            <Skeleton animation="wave" height="100%"/>
          </Box>
        </CardContent>
      ) : (
        <CardContent sx={{ m: 0.5, p: 0, height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "row" : "column",
              justifyContent: "space-evenly",
              height: "100%",
            }}
          >
            {gender?.map((gender, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  mr: isSmallScreen && index < data.length - 1 ? 0.5 : "none",
                  ml: isSmallScreen && index === data.length - 1 ? 0.5 : "none",
                  px: 1,
                  mb: 0.5,
                  py: 0.2,
                  bgcolor: colors.blueAccent[800],
                }}
              >
                <Icon icon={gender.icon} height={25} color={gender.color} />
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <Typography variant="h6" mb={-0.5} fontSize={12}>
                  {" "}
                              {gender.value > 99999 ? (
                                <>
                                  <CountUp
                                    start={0}
                                    end={parseFloat(fShortenNumber(gender.value))}
                                    duration={3}
                                  />
                                  {fShortenNumber(gender.value).slice(-1)}
                                </>
                              ) : (
                                <CountUp
                                  start={0}
                                  end={parseFloat(gender.value)}
                                  duration={3}
                                />
                              )}
                    {/* {gender.value} */}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontSize={8}
                    color={colors.blueAccent[300]}
                  >
                    {gender.label}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default GenderCard;
