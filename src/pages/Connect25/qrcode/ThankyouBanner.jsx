// Create a new component file: ThankYouBanner.jsx
import React from "react";
import {
  Box,
  Typography,
  Modal,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { X, Heart, Users } from "lucide-react";

const ThankYouBanner = ({ name, category, onClose }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Card
        sx={{
          minWidth: 400,
          maxWidth: 600,
          position: "relative",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(147, 51, 234, 0.2)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "#64748b",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(248, 250, 252, 0.9)",
              transform: "scale(1.05)",
            },
          }}
        >
          <X size={18} />
        </IconButton>

        <CardContent sx={{ p: 4, textAlign: "center" }}>
          {/* Heart Icon */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              mb: 3,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: -3,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c4b5fd, #8b5cf6)",
                zIndex: -1,
                opacity: 0.3,
              },
            }}
          >
            <Heart size={32} color="white" fill="white" />
          </Box>

          {/* Thank You Message */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Thank You for Participating in Education Excellence Award 2025!
          </Typography>

          {/* Name and Category */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#4c1d95",
              mb: 1,
            }}
          >
            {name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#6b46c1",
              fontWeight: 500,
              mb: 3,
            }}
          >
            {category}
          </Typography>

          {/* Appreciation Message */}
          {/* <Box
            sx={{
              p: 3,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              mb: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#5b21b6",
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              Your participation in this nomination process is greatly
              appreciated. Every nomination contributes to recognizing
              excellence in our community.
            </Typography>
          </Box> */}

          {/* Participation Icon */}
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "#7c3aed",
            }}
          >
            <Users size={20} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#7c3aed",
              }}
            >
              Thank you for being part of our community
            </Typography>
          </Box> */}
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ThankYouBanner;
