// Enhanced SectionCard component with tooltip
import React from "react";
import { Paper, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { HelpCircle, Info } from "lucide-react";

// Improved Section Card component with info tooltip
const SectionCard = ({ title, children, tooltipText }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          gap: 0.5,
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: "#1a1a1a", fontSize: "1rem" }}
        >
          {title}
        </Typography>

        {tooltipText && (
          <Tooltip
            title={
              <Typography sx={{ fontSize: "0.8rem", p: 0.5 }}>
                {tooltipText}
              </Typography>
            }
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#000000",
                  maxWidth: 220,
                  p: 1.5,
                  borderRadius: 1.5,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              },
              arrow: {
                sx: {
                  color: "#000000",
                },
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                width: 24,
                height: 24,
                color: "rgba(0,0,0,0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                  color: "rgba(0,0,0,0.8)",
                },
              }}
            >
              <Info size={16} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {children}
    </Paper>
  );
};

export default SectionCard;
