// StatusCard.js
import React from "react";
import { Paper, Typography, Box } from "@mui/material";

// Enhanced Status Card Component with click functionality
const StatusCard = ({ icon, title, count, color, bgColor, onClick }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        backgroundColor: bgColor,
        height: "100%",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
          opacity: 0.95,
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          backgroundColor: color,
          borderRadius: 1,
          p: 0.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          mr: 1.5,
        }}
      >
        {React.cloneElement(icon, { size: 16, color: "white" })}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{
            lineHeight: 1,
            color: "#333",
            fontSize: "1.25rem",
          }}
        >
          {count}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            fontWeight: 500,
            mt: 0.25,
            fontSize: "0.75rem",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatusCard;
