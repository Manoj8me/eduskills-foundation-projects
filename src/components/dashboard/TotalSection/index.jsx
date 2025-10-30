import React, { useEffect } from "react";
import CountUp from "react-countup";
import {
  Grid,
  Card,
  Typography,
  Box,
  useTheme,
  Skeleton,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../../theme";
import { DashboardService } from "../../../services/dataService";
import { Icon } from "@iconify/react";
import { fShortenNumber } from "../../../utils/formatNumber";
import { useNavigate } from "react-router-dom";
import OneYear from "../../../assets/imgs/svg/1 Year.svg";
import ThreeYears from "../../../assets/imgs/svg/3 Years.svg";
import FiveYears from "../../../assets/imgs/svg/5 Years.svg";
import TenYears from "../../../assets/imgs/svg/10 Years.svg";
import NoYear from "../../../assets/imgs/svg/No Years.svg";

import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../../store/Slices/dashboard/totalSlice";

const TotalSection = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalStatus = useSelector((state) => state.total.totalStatus);
  const membership = useSelector((state) => state.total.membership);
  const isLoading = useSelector((state) => state.total.isLoading);

  useEffect(() => {
    // Check if data is already available in state
    if (totalStatus?.length === 0 && membership?.length === 0) {
      const fetchData = async () => {
        try {
          const response = await DashboardService.academy_report();
          dispatch(setData(response?.data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [totalStatus, membership, dispatch]);

  const linearProgressData =
    ((membership?.total_days - membership?.left_days) /
      membership?.total_days) *
    100;

  const internship = totalStatus?.map((item) => {
    let icon;
    if (item.title === "Student") {
      icon = "mdi:account-student";
    } else if (item.title === "Academies") {
      icon = "healthicons:i-training-class";
    } else if (item.title === "Educators") {
      icon = "ph:chalkboard-teacher";
    } else if (item.title === "Talent Connect") {
      icon = "icon-park-twotone:agreement";
    }
    return {
      label: item.title,
      value: item.count,
      icon: icon,
    };
  });

  const isInternshipDataZero = internship && internship.length === 0;

  return (
    <Grid container spacing={2} mb={3} mt={0.1}>
      <Grid item xs={12} sm={7}>
        <Grid container spacing={2}>
          {isLoading || isInternshipDataZero
            ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
              Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    elevation={0}
                    className="card-animate"
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
                          p: 1,
                          px: 1.2,
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Skeleton
                          variant="rectangular"
                          width={42}
                          height={42}
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
                            height={24}
                            animation="wave"
                            sx={{ bgcolor: colors.redAccent[900] }}
                          />
                          <Skeleton
                            variant="text"
                            width={60}
                            height={18}
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
                            width={40}
                            height={40}
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
                              width={40}
                              height={22}
                              animation="wave"
                            />
                            <Skeleton
                              variant="text"
                              width={60}
                              height={16}
                              animation="wave"
                            />
                          </Box>
                        </Box>
                      </>
                    )}
                  </Card>
                </Grid>
              ))
            : // Display actual content once data is loaded
              internship?.map((item, key) => (
                <Grid item xs={12} sm={6} lg={6} key={key}>
                  <Card
                    elevation={5}
                    className="card-animate"
                    sx={{ bgcolor: colors.blueAccent[800] }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={1}
                      px={1.2}
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
                          height={32}
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
                          variant="h4"
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
                                    end={parseFloat(fShortenNumber(item.value))}
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
                          variant="body2"
                          color={colors.blueAccent[300]}
                          sx={{
                            //   textTransform: "uppercase",
                            fontWeight: 700,
                            // textShadow: `1px 1px 2px ${colors.grey[300]}`,
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
      {/* <Grid container sm={5}> */}
      <Grid item xs={12} sm={5}>
        {isLoading ? (
          <Card
            elevation={0}
            className="card-animate"
            sx={{
              bgcolor: colors.blueAccent[800],
              p: 2.2,
              px: 4,
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width: "50%" }}>
                <Skeleton
                  variant="circular"
                  height={79}
                  width={79}
                  sx={{ mb: 0.8 }}
                />
              </Box>
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    variant="h3"
                    color={colors.blueAccent[300]}
                    fontWeight={700}
                    sx={{ mr: 0.5 }}
                  >
                    {/* {membership.left_days} */}
                    <Skeleton
                      variant="text"
                      width={40}
                      height={35}
                      sx={{ pb: 0, mb: 0 }}
                    />
                  </Typography>
                  <span>
                    <Typography
                      variant="body1"
                      color={colors.blueAccent[300]}
                      sx={{
                        fontWeight: 700,
                        mb: 0.2,
                      }}
                    >
                      Days left
                    </Typography>
                  </span>
                </Box>
              </Box>
            </Box>
            <Box sx={{ my: 0.5 }}>
              <LinearProgress color={"info"} variant="determinate" value={0} />
            </Box>
          </Card>
        ) : (
          <Card
            elevation={5}
            className="card-animate"
            sx={{ bgcolor: colors.blueAccent[800], p: 2.2, px: 4 }}
          >
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width: "30%" }}>
                <img
                  src={
                    membership.total_days === 365
                      ? OneYear
                      : membership.total_days === 1095
                      ? ThreeYears
                      : membership.total_days === 1825
                      ? FiveYears
                      : membership.total_days === 3650
                      ? TenYears
                      : NoYear
                  }
                  alt="1 year"
                  height={79}
                />
              </Box>
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  // bgcolor: "lightgreen",
                }}
              >
                {linearProgressData > 90 && (
                  <Tooltip title="Renew" arrow placement="top">
                    <IconButton
                      color="info"
                      size="large"
                      onClick={() => navigate("/membership/payment")}
                    >
                      <Icon icon="wpf:renew-subscription" />
                    </IconButton>
                  </Tooltip>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    variant="h3"
                    color={colors.blueAccent[300]}
                    fontWeight={700}
                    sx={{ mr: 0.5 }}
                  >
                    {" "}
                    {membership.left_days > 99999 ? (
                      <>
                        <CountUp
                          start={membership.total_days}
                          end={parseFloat(fShortenNumber(membership.left_days))}
                          duration={1}
                        />
                        {fShortenNumber(membership.left_days).slice(-1)}
                      </>
                    ) : (
                      <CountUp
                        start={membership.total_days}
                        end={parseFloat(membership.left_days)}
                        duration={1}
                      />
                    )}
                    {/* {membership.left_days} */}
                  </Typography>
                  <span>
                    <Typography
                      variant="body1"
                      color={colors.blueAccent[300]}
                      sx={{
                        fontWeight: 700,
                        mb: 0.2,
                      }}
                    >
                      Days left
                    </Typography>
                  </span>
                </Box>
              </Box>
            </Box>
            <Box sx={{ my: 0.5 }}>
              <LinearProgress
                color={"info"}
                variant="determinate"
                value={linearProgressData}
              />
            </Box>
          </Card>
        )}

        {/* </Grid> */}
      </Grid>
      {/* </Grid> */}
    </Grid>
  );
};

export default TotalSection;
