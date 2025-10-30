import React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Box, Container, useTheme, Paper } from "@mui/material";
import { tokens } from "../../../theme";

const CustomViewDrawer = ({ isOpen, onClose, drawerData, title, viewData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    <Drawer anchor="left" open={isOpen}>
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
        {viewData ? (
          <Paper elevation={0} sx={{ p: 2, bgcolor: colors.blueAccent[900] }}>
            {Object.keys(viewData).map((key) => (
              <Box sx={{display:'flex'}} key={key}>
                <Typography sx={{minWidth:120}}>
                  <strong>{formatKey(key)}</strong>
                </Typography>
                <Typography>
                <strong>: </strong>  {viewData[key]}
                </Typography>
              </Box>
            ))}
          </Paper>
        ) : (
          <Typography>No data to view</Typography>
        )}
      </Container>
    </Drawer>
  );
};

export default CustomViewDrawer;
