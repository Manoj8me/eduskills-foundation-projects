import React, { useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { tokens } from "../../../../theme";
import CarouselComponent1 from "./CarouselComponent1";
// import CarouselComponent2 from "./CarouselComponent2";

const carouselComponents = [
  <CarouselComponent1
    title="Component 1 Title"
    content="Content for Component 1"
  />,
  // <CarouselComponent2
  //   title="Component 2 Title"
  //   content="Content for Component 2"
  // />,
  // Add more carousel components as needed
];

const CurrentSummary = ({ close }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlide = (direction) => {
    const lastIndex = carouselComponents.length - 1;

    if (direction === "left" && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (direction === "right" && activeIndex < lastIndex) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <Paper elevation={2} sx={{ height: 200, bgcolor: colors.background[100] }}>
      {/* <CurrentSummary /> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 0.3,
          px: 0.5,
          bgcolor: colors.blueAccent[800],
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            color: colors.blueAccent[300],
            fontWeight: 600,
            mx: 1,
          }}
        >
          Current Summary
        </Typography>
        <IconButton onClick={close} sx={{ p: 0, m: 0 }}>
          <Icon icon="entypo:cross" />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 1,
        }}
      >
        <Icon
          onClick={() => handleSlide("left")}
          color={
            activeIndex === 0 ? colors.greenAccent[800] : colors.blueAccent[400]
          }
          icon="icon-park-solid:left-one"
          fontSize={30}
          style={{ cursor: activeIndex === 0 ? "not-allowed" : "pointer" }}
        />

          {React.cloneElement(carouselComponents[activeIndex], {
            elevation: 0,
            sx: { height: 160, width: "100%" },
          })}

        <Icon
          onClick={() => handleSlide("right")}
          color={
            activeIndex === carouselComponents.length - 1
              ? colors.greenAccent[800]
              : colors.blueAccent[300]
          }
          icon="icon-park-solid:right-one"
          fontSize={30}
          style={{
            cursor:
              activeIndex === carouselComponents.length - 1
                ? "not-allowed"
                : "pointer",
          }}
        />
      </Box>
    </Paper>
  );
};

export default CurrentSummary;
