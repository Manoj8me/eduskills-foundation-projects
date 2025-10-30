import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import PageNotFoundImg from "../../assets/imgs/svg/404 Error Page not Found.svg";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/imgs/logo-dark.svg";
import { Helmet } from "react-helmet-async";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PageNotFound = () => {
  const navigate = useNavigate();
  const [fadeInComplete, setFadeInComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initially, set isLoading to true

  useEffect(() => {
    // Introduce a 1-second delay before setting fadeInComplete to true
    const delayTimeout = setTimeout(() => {
      setFadeInComplete(true);
      setIsLoading(false); // After the delay, set isLoading to false
    }, 50); // 1000 milliseconds = 1 second

    // Clear the timeout if the component unmounts
    return () => clearTimeout(delayTimeout);
  }, []);

  return (
    <>
      <Helmet>
        <title> Page Not Found | EduSkills </title>
      </Helmet>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to bottom, #ffff, #BCE2FF)",
        }}
      >
        <Box
          sx={{
            maxHeight: "80vh",
            width: "90vw",
            maxWidth: "80vw",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            animation: fadeInComplete ? `${fadeIn} 0.2s ease-in` : "",
            opacity: fadeInComplete ? 1 : 0,
          }}
        >
          {isLoading ? (
            <CircularProgress /> // Display a circular loader while loading
          ) : (
            <>
              <img src={Logo} alt="Logo" style={{ maxWidth: 200 }} />
              <img
                src={PageNotFoundImg}
                alt="404"
                style={{ maxHeight: "62vh", maxWidth: "70vw" }}
              />
              <Button
                onClick={() => navigate("/")}
                variant="contained"
                color="info"
                sx={{ width: "130px", maxWidth: "180px", height: 25 }}
              >
                Back to Home
              </Button>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default PageNotFound;
