import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  useTheme,
  Card,
  Skeleton,
} from "@mui/material";
import BannerLight from "../../../assets/imgs/InsBgLight.png";
import BannerDark from "../../../assets/imgs/InsBgDark.png";
import addLogo from "../../../assets/imgs/svg/university.svg";
import { Helmet } from "react-helmet-async";
import { tokens } from "../../../theme";
import { MembershipService } from "../../../services/dataService";
import { useState } from "react";
import { Icon } from "@iconify/react";

const InstitutionalProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [institute, setInstitute] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await MembershipService.institute();
        setInstitute(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const institutionName = institute?.institute?.[0]?.value;
  const institutionCity = institute?.institute?.[2]?.value;
  const institutionState = institute?.institute?.[3]?.value;
  // console.log(institute?.institute[0]?.value);
  return (
    <Container maxWidth="lg" sx={{ my: 2 }}>
      <Helmet>
        <title> Institutional Details | EduSkills </title>
      </Helmet>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
      >
        Welcome back to Institutional Details !
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              {/* Background Banner */}
              <Paper
                elevation={3}
                style={{
                  backgroundImage: `url(${
                    institute.banner_url
                      ? institute.banner_url
                      : theme.palette.mode === "dark"
                      ? BannerDark
                      : BannerLight
                  })`, // Set the path to your banner image
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "20px",
                  minHeight: "220px",
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "space-between",
                  backgroundColor: colors.background[100],
                }}
              >
                {/* Content in the Banner */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // backgroundColor: colors.grey[900],
                    bgcolor: "rgba(220, 220, 220, 0.2)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "10px",
                    p: 1,
                  }}
                >
                  {institute.length === 0 ? (
                    <Skeleton
                      variant="rectangular"
                      height={60}
                      width={60}
                      sx={{ borderRadius: 2 }}
                    />
                  ) : (
                    <img
                      src={institute.logo_url ? institute.logo_url : addLogo}
                      alt="Institution Logo"
                      style={{
                        maxWidth: "100%",
                        height: "60px",
                        padding: 4,
                        borderRadius: "10%",
                        backgroundColor: "#ffff",
                      }}
                    />
                  )}

                  <Box mx={2}>
                    {institutionName ? (
                      <Typography
                        variant="h4"
  
                        fontWeight={800}
                        gutterBottom
                      >
                        {institutionName}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" width={300} height={30} />
                    )}
                    {institutionCity && institutionState ? (
                      <Typography variant="subtitle1" >
                        {institutionCity}, {institutionState}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" width={200} height={20} />
                    )}
                  </Box>
                </Box>
              
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ my: 2 }}>
            <Paper
              elevation={3}
              style={{
                padding: "20px",
                backgroundColor: colors.background[100],
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <Typography
                    textAlign="center"
                    color={colors.blueAccent[300]}
                    variant="h6"
                  >
                    Institutional Details
                  </Typography>
                  <Card
                    elevation={0}
                    // m={2}
                    sx={{ p: 2, mt: 1, bgcolor: colors.blueAccent[900] }}
                  >
                    {institute?.institute?.map((items, key) => (
                      <Box display="flex" alignItems="center" key={key}>
                        <Typography variant="body1" sx={{ minWidth: "120px" }}>
                          {items.title}
                        </Typography>
                        <Typography component="span" variant="body2" ml={1}>
                          :
                        </Typography>
                        <Typography component="span" variant="body2" ml={1}>
                          {items.value ? items.value : "NA"}
                        </Typography>
                      </Box>
                    ))}
                    {!institute?.institute && (
                      <Box>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                      </Box>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Box>
                    <Typography
                      textAlign="center"
                      color={colors.blueAccent[300]}
                      variant="h6"
                    >
                      Contact Person
                    </Typography>

                    {institute?.contact?.map((items, key) => (
                      <Card
                        elevation={0}
                        mx={2}
                        sx={{ bgcolor: colors.blueAccent[900], p: 2, mt: 1 }}
                        key={key}
                      >
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" sx={{ minWidth: "80px" }}>
                            Name
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            :
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            {items.educator_name}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" sx={{ minWidth: "80px" }}>
                            Designation
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            :
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            {items.designation}{" "}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" sx={{ minWidth: "80px" }}>
                            Email
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            :
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            {items.email}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" sx={{ minWidth: "80px" }}>
                            Mobile
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            :
                          </Typography>
                          <Typography component="span" variant="body2" ml={1}>
                            {items.mobile}
                          </Typography>
                        </Box>
                      </Card>
                    ))}
                    {!institute?.contact && (
                      <Card
                        sx={{ p: 2, mt: 1, bgcolor: colors.blueAccent[900] }}
                      >
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                      </Card>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InstitutionalProfile;
