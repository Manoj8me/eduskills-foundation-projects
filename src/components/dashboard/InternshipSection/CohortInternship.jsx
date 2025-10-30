import React, { useEffect } from "react";
import {
  Typography,
  useTheme,
  Box,
  Grid,
  Card,
  Button,
  Skeleton,
} from "@mui/material";
import GenderCard from "../common/GenderCard";
import { tokens } from "../../../theme";
import { fShortenNumber } from "../../../utils/formatNumber";
import CountUp from "react-countup";
import { Icon } from "@iconify/react";

import AppBars from "../../common/app/AppBars";

import HorizontalMenu from "../common/HorizontalMenu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCohortData,
  fetchCohortList,
} from "../../../store/Slices/dashboard/cohortInternshipSlice";

const CohortInternship = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cohortData = useSelector((state) => state.cohortInternship.cohortData);
  const cohortLists = useSelector((state) => state.cohortInternship.cohortList);
  const activeCohort = useSelector(
    (state) => state.cohortInternship.activeCohort
  );
  const isLoading = useSelector((state) => state.cohortInternship.isLoading);
  // const activeCohort = useSelector((state) => state.cohortInternship.activeCohort);
  // console.log(activeCohorts)
  const cohort_id = activeCohort;

  useEffect(() => {
    if (cohort_id) {
      dispatch(fetchCohortData(cohort_id, dispatch))
        .unwrap()
        .then((data) => {
          // Handle the data if needed
        });
    }
  }, [cohort_id, dispatch]);

  useEffect(() => {
    dispatch(fetchCohortList(dispatch))
      .unwrap()
      .then(() => {
        // Additional logic after fetching cohort list
      });
  }, [dispatch]);
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const response = await DashboardService.cohort(cohort_id);
  //       dispatch(setCohortChart(response.data?.cohort_chat));
  //       dispatch(setCohortGender(response.data?.cohort_gender));
  //       setCohortTotal(response.data?.cohort_total);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setIsLoading(false);
  //     }
  //   }

  //   fetchData();
  // }, [cohort_id]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await InternshipService.cohort_list();
  //       setCohortLists(response.data.cohort_list);
  //       setActiveCohort(response.data.cohort_active);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  const internship = cohortData?.cohort_total?.map((item) => {
    let icon;
    if (item.title === "Applied") {
      icon = "carbon:task-complete";
    } else if (item.title === "Approved") {
      icon = "mdi:approve";
    } else if (item.title === "Internship Certificate Issued") {
      icon = "fluent-mdl2:completed-solid";
    } else if (item.title === "Assessment Completed") {
      icon = "fluent:tasks-app-28-filled";
    } else if (item.title === "Certificate Verified") {
      icon = "iconamoon:certificate-badge-fill";
    } else if (item.title === "Rejected") {
      icon = "fluent:text-change-reject-24-regular";
    }

    return {
      label: item.title,
      value: item.count,
      icon: icon,
    };
  });

  // const handleCohortChange = (cohort) => {
  //   setActiveCohort(cohort);
  // };
  const isInternshipDataZero = internship && internship.length === 0;

  return (
    <Grid container width="100%">
      <Grid container spacing={2}>
        {/* Left side: Cohort Activity heading */}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            //   alignItems: "center",
            "@media (max-width: 800px)": {
              display: "block",
            },
          }}
        >
          <Box
            bgcolor={colors.blueAccent[300]}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 2,
              // textAlign: "center",
              alignItems: "center",
              justifyContent: "space-between",
              display: "flex",
              "@media (max-width: 800px)": {
                mb: 2,
              },
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              // sx={{fontSize:12}}
              color={colors.blueAccent[900]}
            >
              Cohort Activity
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                bgcolor: colors.blueAccent[800],
                px: 1,
                boxShadow: `inset 1px 1px 1px  rgba(0, 0, 0, 0.2)`,
                borderRadius: 1.2,
                "@media (min-width: 800px)": {
                  ml: 1,
                },
              }}
              color={colors.blueAccent[300]}
            >
              {cohortData?.duration}
            </Typography>
          </Box>
          <HorizontalMenu
            data={cohortLists}
            activeCohort={activeCohort}
            // setActiveCohort={ctiveCohort}
          />
        </Grid>

        <Grid
          container
          // xs={12}
          sx={{ display: "flex", alignItems: "flex-start" }}
        />

        <Grid container spacing={2} mt={0.1} ml={0}>
          <Grid item xs={12} sm={3} md={3}>
            <Grid container spacing={1}>
              {isLoading || isInternshipDataZero
                ? // Display loading skeleton cards or empty cards when data is 0
                  Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        elevation={4}
                        sx={{
                          bgcolor: colors.blueAccent[800],
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {isInternshipDataZero && !isLoading ? (
                          // Display nothing inside the card
                          <Box
                            sx={{
                              p: 1.1,
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Skeleton
                              variant="rectangular"
                              width={30}
                              height={30}
                              sx={{
                                borderRadius: 1,
                                bgcolor: colors.redAccent[900],
                              }}
                              animation="wave"
                            />
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <Skeleton
                                variant="text"
                                width={40}
                                height={15}
                                animation="wave"
                                sx={{ bgcolor: colors.redAccent[900] }}
                              />
                              <Skeleton
                                variant="text"
                                width={60}
                                height={12}
                                animation="wave"
                                sx={{ bgcolor: colors.redAccent[900] }}
                              />
                            </Box>
                          </Box>
                        ) : (
                          // Display a loading skeleton inside the card
                          <>
                            <Box
                              sx={{
                                p: 1.1,
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Skeleton
                                variant="rectangular"
                                width={25}
                                height={25}
                                sx={{ borderRadius: 1 }}
                                animation="wave"
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <Skeleton
                                  variant="text"
                                  width={30}
                                  height={16}
                                  animation="wave"
                                />
                                <Skeleton
                                  variant="text"
                                  width={50}
                                  height={10}
                                  animation="wave"
                                />
                              </Box>
                            </Box>
                          </>
                        )}
                      </Card>
                    </Grid>
                  ))
                : internship?.map((item, key) => (
                    <Grid item xs={12} key={key}>
                      <Card elevation={0} className="card-animate">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          p={0.5}
                          px={1}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            borderRadius={1}
                            p={0.5}
                            bgcolor={colors.blueAccent[300]}
                          >
                            <Icon
                              icon={item.icon}
                              color={colors.blueAccent[800]}
                              height={25}
                            />
                          </Box>
                          <Box
                            sx={{
                              mr: 0.5,
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontSize={14}
                              fontWeight="700"
                              component="span"
                              sx={{
                                textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
                              }}
                              color={colors.blueAccent[100]}
                            >
                              <span className="counter-value" data-target="0">
                                <span>
                                  {" "}
                                  {item.value > 99999 ? (
                                    <>
                                      <CountUp
                                        start={0}
                                        end={parseFloat(
                                          fShortenNumber(item.value)
                                        )}
                                        duration={3}
                                      />
                                      {fShortenNumber(item.value).slice(-1)}
                                    </>
                                  ) : (
                                    <CountUp
                                      start={0}
                                      end={parseFloat(item.value)}
                                      duration={3}
                                    />
                                  )}
                                </span>
                              </span>
                            </Typography>
                            <Typography
                              variant="caption"
                              fontSize={10}
                              color={colors.blueAccent[300]}
                              sx={{
                                fontWeight: 700,
                                mt: -0.4,
                              }}
                              noWrap
                            >
                              {item.label}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={9} md={7}>
            <AppBars chartData={cohortData.cohort_chat} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <GenderCard
                height={150}
                data={cohortData.cohort_gender}
                isLoading={isLoading}
              />
              <Button
                // size="small"
                variant="outlined"
                color="info"
                onClick={() => navigate("/internship")}
                sx={{
                  width: "100%",
                  // height: 20,
                  p: "2px 8px",

                  textTransform: "initial",
                }}
              >
                View More Details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CohortInternship;
