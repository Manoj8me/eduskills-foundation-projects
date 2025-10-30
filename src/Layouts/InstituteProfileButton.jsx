import React, { forwardRef } from "react";
import { Button, Tooltip } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { tokens } from "../theme";
import { useTheme } from "@mui/material/styles";

// Custom button component with ripple effect and animations
const InstituteProfileButton = forwardRef(({ onClick }, ref) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Tooltip title="Open Institute Profile Form">
      <Button
        ref={ref}
        variant="contained"
        className="institute-profile-btn"
        startIcon={<SchoolIcon />}
        onClick={onClick}
        sx={{
          mr: 2,
          backgroundColor: colors.blueAccent[600],
          "&:hover": {
            backgroundColor: colors.blueAccent[700],
            transform: "translateY(-2px)",
            boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
          },
          transition: "all 0.2s ease-in-out",
          textTransform: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          fontWeight: 600,
          position: "relative",
          overflow: "hidden",
          // Add a subtle pulse animation to draw attention
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": {
              boxShadow: `0 0 0 0 ${
                theme.palette.mode === "dark"
                  ? "rgba(66, 165, 245, 0.7)"
                  : "rgba(25, 118, 210, 0.7)"
              }`,
            },
            "70%": {
              boxShadow: `0 0 0 10px ${
                theme.palette.mode === "dark"
                  ? "rgba(66, 165, 245, 0)"
                  : "rgba(25, 118, 210, 0)"
              }`,
            },
            "100%": {
              boxShadow: `0 0 0 0 ${
                theme.palette.mode === "dark"
                  ? "rgba(66, 165, 245, 0)"
                  : "rgba(25, 118, 210, 0)"
              }`,
            },
          },
        }}
      >
        Institute Profile
      </Button>
    </Tooltip>
  );
});

export default InstituteProfileButton;
