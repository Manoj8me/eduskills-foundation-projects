import React, { useState, useRef } from "react";
import { List, ListItem, useTheme, Card, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { tokens } from "../../../theme";
import { useDispatch } from "react-redux";
import { setActiveCohort } from "../../../store/Slices/dashboard/cohortInternshipSlice";

const Tag = ({ data, activeBgColor, color, active, onClick }) => {
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        backgroundColor: active ? activeBgColor : color,
        color: active ? color : activeBgColor,
        padding: "0px 8px",
        borderRadius: "4px",
        margin: "0 4px",
        whiteSpace: "nowrap",
        "&:hover": {
          transform: "scale(1.1)",
          bgcolor: active ? activeBgColor : color,
        },
        transition: "transform 0.3s",
        fontWeight: active ? "bold" : "normal",
      }}
    >
      {data}
    </ListItem>
  );
};

export default function HorizontalMenu({
  data,
  activeCohort,
  // setActiveCohort,
}) {
  const theme = useTheme();
  const dispatch = useDispatch()
  const colors = tokens(theme.palette.mode);
  const scrl = useRef(null);
  const [scrollX, setScrollX] = useState(0);

  // Slide click
  const slide = (shift) => {
    scrl.current.scrollLeft += shift;
    setScrollX(scrollX + shift);
  };

  // Scroll check
  const scrollCheck = () => {
    setScrollX(scrl.current.scrollLeft);
  };

  const handleCohortClick = (cohort) => {
    // setActiveCohort(cohort);
    dispatch(setActiveCohort(cohort))
  };

  return (
    <Card
      elevation={0}
      className="App"
      sx={{
        textAlign: "center",
        height: 30,
        maxWidth: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {scrollX !== 0 && (
        <IconButton
          className="prev"
          onClick={() => slide(-50)}
          sx={{
            border: 0,
            p: "4px",
            color: colors.blueAccent[300],
            fontSize: "12px",
            margin: "0 8px",
            "&:hover": {
              transform: "scale(1.2)",
            },
            transition: "transform 0.3s",
          }}
        >
          <Icon icon="bxs:left-arrow" />
        </IconButton>
      )}
      <List
        ref={scrl}
        sx={{
          px: 1,
          display: "flex",
          alignItems: "center",
          listStyle: "none",
          maxWidth: "100%",
          overflowX: "scroll",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            background: "transparent",
            WebkitAppearance: "none",
            width: 0,
            height: 0,
          },
        }}
        onScroll={scrollCheck}
      >
        {data.map((d, i) => (
          <Tag
            data={d.cohort_name}
            key={i}
            activeBgColor={colors.blueAccent[300]}
            color={colors.blueAccent[900]}
            active={d.cohort_id === activeCohort}
            onClick={() => handleCohortClick(d.cohort_id)}
          />
        ))}
      </List>
      <IconButton
        className="next"
        onClick={() => slide(50)}
        sx={{
          border: 0,
          color: colors.blueAccent[300],
          p: "4px",
          fontSize: "12px",
          margin: "0 8px",
          "&:hover": {
            transform: "scale(1.2)",
          },
          transition: "transform 0.3s",
        }}
      >
        <Icon icon="bxs:right-arrow" />
      </IconButton>
    </Card>
  );
}
