import React from "react";
import { Box, Chip, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import connectimg from "../assets/imgs/favicon (3).png";

const ConnectFeedbackBadge = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down("md"));

  const handleConnectRegistration = () => {
    navigate("/admin-feedback");
  };

  return (
    <Tooltip title="Connect">
      <Box
        sx={{
          position: "relative",
          mr: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            background:
              "linear-gradient(45deg, #FF9800, #FF5722, #FF9800, #FF5722)",
            backgroundSize: "300% 300%",
            borderRadius: isTabletOrSmaller ? "50%" : "18px",
            zIndex: -1,
            animation: "gradient-shift 3s ease infinite",
          },
          "@keyframes gradient-shift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
          "@keyframes pulse-glow": {
            "0%": {
              boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
              transform: "scale(1)",
            },
            "50%": {
              boxShadow: "0 6px 20px rgba(255, 152, 0, 0.6)",
              transform: "scale(1.02)",
            },
            "100%": {
              boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
              transform: "scale(1)",
            },
          },
          "@keyframes bounce-icon": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "25%": { transform: "translateY(-2px) rotate(-2deg)" },
            "75%": { transform: "translateY(-1px) rotate(2deg)" },
          },
          "@keyframes shimmer": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        }}
      >
        {isTabletOrSmaller ? (
          // Icon-only version for tablet and smaller
          <Box
            onClick={handleConnectRegistration}
            sx={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF9800 0%, #FF5722 100%)",
              color: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: "pulse-glow 3s ease-in-out infinite",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "shimmer 2.5s ease-in-out infinite",
              },
              "&:hover": {
                background: "linear-gradient(135deg, #FF5722 0%, #FF9800 100%)",
                transform: "translateY(-3px) scale(1.1)",
                boxShadow: "0 8px 25px rgba(255, 152, 0, 0.5)",
                animation: "none",
                "& img": {
                  animation: "bounce-icon 0.6s ease-in-out infinite",
                },
                "&::after": {
                  animation: "shimmer 1s ease-in-out infinite",
                },
              },
              "&:active": {
                transform: "translateY(-1px) scale(1.05)",
                transition: "all 0.1s ease",
              },
            }}
          >
            <img
              src={connectimg}
              alt="Connect"
              style={{
                width: 20,
                height: 20,
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
                animation: "bounce-icon 2s ease-in-out infinite",
              }}
            />
          </Box>
        ) : (
          // Full chip version for larger screens
          <Chip
            icon={
              <img
                src={connectimg}
                alt="Connect"
                style={{
                  width: 18,
                  height: 18,
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                  animation: "bounce-icon 2s ease-in-out infinite",
                }}
              />
            }
            label="Connect Feedback"
            onClick={handleConnectRegistration}
            sx={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, #FF9800 0%, #FF5722 100%)",
              color: "#FFFFFF",
              fontSize: "0.8rem",
              fontWeight: 600,
              height: 32,
              cursor: "pointer",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: "pulse-glow 3s ease-in-out infinite",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "shimmer 2.5s ease-in-out infinite",
              },
              "&:hover": {
                background: "linear-gradient(135deg, #FF5722 0%, #FF9800 100%)",
                transform: "translateY(-3px) scale(1.05)",
                boxShadow: "0 8px 25px rgba(255, 152, 0, 0.5)",
                animation: "none",
                "& img": {
                  animation: "bounce-icon 0.6s ease-in-out infinite",
                },
                "&::after": {
                  animation: "shimmer 1s ease-in-out infinite",
                },
              },
              "&:active": {
                transform: "translateY(-1px) scale(1.02)",
                transition: "all 0.1s ease",
              },
              "& .MuiChip-icon": {
                marginLeft: "8px",
              },
              "& .MuiChip-label": {
                paddingLeft: "8px",
                paddingRight: "12px",
                position: "relative",
                zIndex: 2,
              },
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default ConnectFeedbackBadge;
