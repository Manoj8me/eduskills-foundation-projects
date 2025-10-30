import React, { useState } from "react";
import { Container, Typography, Paper, Box, Grid, Button } from "@mui/material";
import banner from "../../assets/imgs/collage imgs/trident.jpg";
import logo from "../../assets/imgs/collage imgs/trident_logo.jpeg";
import { Helmet } from "react-helmet-async";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import Payment from "./payment/Payment";
import Agreements from "./agreements";

const Membership = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [menu, setMenu] = useState("Institutional");

  const handleMenu = (menu) => {
    setMenu(menu);
  };

  return (
    <Container maxWidth="xl" sx={{ my: 2 }}>
      <Helmet>
        <title> Membership | EduSkills </title>
      </Helmet>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
      >
        Welcome back to Membership !
      </Typography>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={2}
          sx={{
            display: { xs: "flex", md: "block" },
            gap: 1,
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Button
            size="large"
            color={menu === "Institutional" ? "info" : "inherit"}
            variant="contained"
            onClick={() => handleMenu("Institutional")}
            sx={{
              width: "96%",
              mb: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              textTransform: "none", // Remove capital letters
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6">Institutional Details</Typography>
          </Button>

          <Button
            size="large"
            color={menu === "Payment" ? "info" : "inherit"}
            variant="contained"
            onClick={() => handleMenu("Payment")}
            sx={{
              width: "96%",
              mb: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              textTransform: "none", // Remove capital letters
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6">Payment</Typography>
          </Button>

          <Button
            size="large"
            color={menu === "Agreements" ? "info" : "inherit"}
            variant="contained"
            onClick={() => handleMenu("Agreements")}
            sx={{
              width: "96%",
              mb: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              textTransform: "none", // Remove capital letters
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6">Agreements</Typography>
          </Button>
        </Grid>
        {menu === "Payment" && (
          <Grid item xs={12} md={10}>
            <Payment />
          </Grid>
        )}
        {menu === "Agreements" && (
          <Grid item xs={12} md={10}>
            <Agreements/>
          </Grid>
        )}
        {menu === "Institutional" && (
          <Grid item xs={12} md={10}>
            <Grid item xs={12}>
              <Grid item xs={12}>
                {/* Background Banner */}
                <Paper
                  elevation={3}
                  style={{
                    backgroundImage: `url(${banner})`, 
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: "20px",
                    minHeight: "160px",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  {/* Content in the Banner */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(265, 265, 265, 0.7)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "10px",
                      p: 1,
                    }}
                  >
                    <img
                      src={logo} // Set the path to your institution's logo
                      alt="Institution Logo"
                      style={{
                        maxWidth: "100%",
                        height: "60px",
                        borderRadius: "10%",
                      }}
                    />
                    <Box mx={2}>
                      <Typography variant="h4" fontWeight={800} gutterBottom>
                        Trident Academy of Technology
                      </Typography>
                      <Typography variant="subtitle1" color="textPrimary">
                        Bhubaneswar, Odisha
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} my={2}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h4" gutterBottom>
                  Institutional Profile
                </Typography>
                <Box marginTop={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">About Us</Typography>
                      <p>Insert your institution's description here.</p>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Contact Information</Typography>
                      <p>Insert your contact information here.</p>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Address</Typography>
                      <p>Insert your address here.</p>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Membership;
