import { Box, Card, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import React from "react";
import { fShortenNumber } from "../../../utils/formatNumber";
import CountUp from "react-countup";
import { tokens } from "../../../theme";
import { Icon } from "@iconify/react";
import DonutChart from "../../common/app/DonutChart";

const InstituteDetails = ({ institute, isLoading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const cardData = institute;
  const DonutData = institute;

  const internship = cardData.map((item) => {
    let icon;
    if (item.title === "Total") {
      icon = "fa:university";
    } else if (item.title === "Active") {
      icon = "fontisto:checkbox-active";
    } else if (item.title === "InActive") {
      icon = "octicon:no-entry-16";
    }
    return {
      label: item.title,
      value: item.count,
      icon: icon,
    };
  });

  const isInternshipDataZero = internship && internship.length === 0;

  return (
    <Grid item xs={12}>
      <Card
        elevation={5}
        sx={{
          width: "100%",
          height: "100%",
          py: 1,
          px: 2,
          bgcolor: colors.blueAccent[800],
        }}
      >
        <Typography
          variant="h6"
          fontWeight="700"
          // component="span"
          // sx={{
          //   textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
          // }}
          color={colors.blueAccent[300]}
        >
          Institute Details
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={7.5} my={0.5} height={145}>
            {/* <Card elevation={0} sx={{ width: "100%", height: 195, my: 1 }}> */}
            <DonutChart data={DonutData} isLoading={false} isAdmin={true} />
            {/* </Card> */}
          </Grid>
          <Grid item xs={12} sm={4.5} my={0.5} height={145}>
            <Grid container spacing={1}>
              {isLoading || isInternshipDataZero
                ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
                  Array.from({ length: 3 }).map((_, index) => (
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
                              {isLoading || isInternshipDataZero
                                ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
                                  (
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
                                                  bgcolor:
                                                    colors.redAccent[900],
                                                }}
                                              />
                                              <Skeleton
                                                variant="text"
                                                width={20}
                                                height={13}
                                                animation="wave"
                                                sx={{
                                                  bgcolor:
                                                    colors.redAccent[900],
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
                                                px:1,
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
                                  )
                                : // Display actual content once data is loaded
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
                                                  {" "}
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
                                                      end={parseFloat(
                                                        item.value
                                                      )}
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
        </Grid>
      </Card>
    </Grid>
  );
};

export default InstituteDetails;
