import React, { useEffect } from "react";
import { fetchAdminDashState } from "../../../../store/Slices/admin/adminDashStateSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  Grid,
  Paper,
  Typography,
  useTheme,
  Skeleton,
} from "@mui/material";
import { tokens } from "../../../../theme";
import MapChart from "../../../common/app/MapChart";
import CountUp from "react-countup";
import { Icon } from "@iconify/react";
import { fShortenNumber } from "../../../../utils/formatNumber";
// import DynamicBarChart from "../../../common/app/BarChart";
import DonutChart from "../../../common/app/DonutChart";
// import CircleChart from "../../../common/app/CircleChart";

const AdminStateSection = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isLoading = useSelector(
    (state) => state.adminState.dashboardState.isLoading
  );
  const memCount = useSelector(
    (state) => state.adminState.dashboardState.memCount
  );

  const stateCount = useSelector(
    (state) => state.adminState.dashboardState.stateCount
  );
  const regionData = stateCount.reduce((result, state) => {
    result[state.title] = {
      value: state.count,
    };
    return result;
  }, {});

  useEffect(() => {
    dispatch(fetchAdminDashState());
  }, [dispatch]);

  const internship = memCount.map((item) => {
    let icon;
    if (item.title === "1 Yr Membership ") {
      icon = "tabler:square-1-filled";
    } else if (item.title === "3 Yr Membership") {
      icon = "material-symbols:looks-3";
    } else if (item.title === "5 Yr Membership ") {
      icon = "ic:round-looks-5";
    } else if (item.title === "10 Yr Membership ") {
      icon = "mdi:numeric-10-box";
    } else if (item.title === "Trial Membership") {
      icon = "carbon:global-loan-and-trial";
    }
    return {
      label: item.title,
      value: item.count,
      icon: icon,
    };
  });

  const isInternshipDataZero = internship && internship.length === 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper
          elevation={5}
          sx={{ p: 1, bgcolor: colors.blueAccent[800], height: "100%" }}
        >
          {/* <CircleChart data={memCount}/> */}
          <Typography
            sx={{
              fontSize: 12,
              color: colors.blueAccent[300],
              fontWeight: 600,
              mb: 0.4,
              mx: 0.5,
            }}
          >
            Membership Package
          </Typography>
          <Card elevation={0} sx={{ pb: 1, mb: 1, height: 120 }}>
            {/* <DynamicBarChart chartData={memCount} height={120} /> */}
            <DonutChart data={memCount} isLoading={isLoading} />
          </Card>
          <Grid item xs={12} my={0.5}>
            <Grid container spacing={1}>
              {isLoading || isInternshipDataZero
                ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
                  Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        elevation={0}
                        className="card-animate"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {isInternshipDataZero ? (
                          // && !isLoading
                          // Display nothing inside the card
                          <Card
                            elevation={0}
                            sx={{
                              p: 0.8,
                              px: 1,
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Skeleton
                              variant="rectangular"
                              width={28}
                              height={28}
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
                                width={20}
                                height={15}
                                animation="wave"
                                sx={{ bgcolor: colors.redAccent[900] }}
                              />
                              <Skeleton
                                variant="text"
                                width={40}
                                height={13}
                                animation="wave"
                                sx={{ bgcolor: colors.redAccent[900] }}
                              />
                            </Box>
                          </Card>
                        ) : (
                          <Box sx={{ width: "100%" }}>
                            <Grid container spacing={1}>
                              {isLoading || isInternshipDataZero ? (
                                // Display 4 loading skeleton cards or 4 empty cards when data is 0
                                <Grid item xs={12} key={index}>
                                  <Card
                                    elevation={0}
                                    className="card-animate"
                                    sx={{
                                      //   bgcolor: colors.blueAccent[800],
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
                                          width={28}
                                          height={28}
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
                                            sx={{
                                              bgcolor: colors.redAccent[900],
                                            }}
                                          />
                                          <Skeleton
                                            variant="text"
                                            width={20}
                                            height={13}
                                            animation="wave"
                                            sx={{
                                              bgcolor: colors.redAccent[900],
                                            }}
                                          />
                                        </Box>
                                      </Box>
                                    ) : (
                                      // Display a loading skeleton inside the card
                                      <>
                                        <Box
                                          sx={{
                                            p: 0.75,
                                            px: 1,
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <Skeleton
                                            variant="rectangular"
                                            width={28}
                                            height={28}
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
                                              width={20}
                                              height={15}
                                              animation="wave"
                                            />
                                            <Skeleton
                                              variant="text"
                                              width={40}
                                              height={13}
                                              animation="wave"
                                            />
                                          </Box>
                                        </Box>
                                      </>
                                    )}
                                  </Card>
                                </Grid>
                              ) : (
                                // Display actual content once data is loaded
                                internship?.map((item, key) => (
                                  <Grid item xs={12} key={key}>
                                    <Card
                                      elevation={5}
                                      className="card-animate"
                                      // sx={{ bgcolor: colors.blueAccent[800] }}
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
                                            <span
                                              className="counter-value"
                                              data-target="0"
                                            >
                                              <span>
                                                {item.value > 99999 ? (
                                                  <>
                                                    <CountUp
                                                      start={0}
                                                      end={parseFloat(
                                                        fShortenNumber(
                                                          item.value
                                                        )
                                                      )}
                                                      duration={3}
                                                    />
                                                    {fShortenNumber(
                                                      item.value
                                                    ).slice(-1)}
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
                                ))
                              )}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  ))
                : // Display actual content once data is loaded
                  internship?.map((item, key) => (
                    <Grid item xs={12} key={key}>
                      <Card
                        elevation={0}
                        className="card-animate"
                        // sx={{ bgcolor: colors.blueAccent[800] }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          p={0.3}
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
                              height={20}
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
                              variant="h5"
                              fontWeight="700"
                              component="span"
                              sx={{
                                textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
                              }}
                              color={colors.blueAccent[100]}
                            >
                              <span className="counter-value" data-target="0">
                                <span>
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
                              variant="body2"
                              color={colors.blueAccent[300]}
                              sx={{
                                //   textTransform: "uppercase",
                                fontSize: 10,
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
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper elevation={5} sx={{ p: 1, bgcolor: colors.blueAccent[800] }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontSize: 12,
                  color: colors.blueAccent[300],
                  fontWeight: 600,
                  mb: 0.4,
                  mx: 0.5,
                }}
              >
                Institutes Across the Country
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  // height:"100%"
                }}
              >
                <MapChart regionData={regionData} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  mb: 0.4,
                  mx: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: colors.blueAccent[300],
                    fontWeight: 600,
                  }}
                >
                  State
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: colors.blueAccent[300],
                    fontWeight: 600,
                  }}
                >
                  Institutes
                </Typography>
              </Box>

              <Paper elevation={0} sx={{ px: 1.5, py: 0.5 }}>
                <Box sx={{ overflow: "auto", height: 310 }}>
                  {stateCount?.map((state, i) => (
                    <Card
                      key={i}
                      sx={{
                        px: 1,
                        py: 0.2,
                        my: 1,
                        bgcolor: colors.blueAccent[800],
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: 12 }}>
                          {state.title}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "500" }}>
                          <span style={{ color: colors.greenAccent[300] }}>
                            {state.active_count}
                          </span>
                          /{state.count}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminStateSection;
