import React from "react";
import { Box, Card, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import CountUp from "react-countup";
import { fShortenNumber } from "../../../utils/formatNumber";
import { tokens } from "../../../theme";

const CountCard = ({
  data,
  // isLoading,
  length = 4,
  cardSize = {
    // py: 1,
    // px: 1.2,
    py: 0.6,
    px: 1,
    skeleton: { icon: 40, count: 24, title: 16 },
    // skeleton: { icon: 43, count: 25, title: 17.6 },
    // dataCard: { icon: 35, count: 20, title: 13 },
    dataCard: { icon: 30, count: 18, title: 12 },
  },
  bgcolor = "#E6F5FF",
  gridSize = { xs: 12, sm: 6, md: 3 },
  spacing = 2,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDataZero = data && data.length === 0;

  return (
    <Grid item xs={12}>
      <Grid container spacing={spacing} sx={{ mb: 0.8 }}>
        {isDataZero
          ? Array.from({ length: length }).map((_, index) => (
              <Grid
                item
                xs={gridSize.xs}
                sm={gridSize.sm}
                md={gridSize.md}
                key={index}
              >
                <Card
                  elevation={0}
                  className="card-animate"
                  sx={{
                    bgcolor: bgcolor,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {isDataZero ? (
                    <Box
                      sx={{
                        p: cardSize.py,
                        px: cardSize.px,
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width={cardSize.skeleton.icon}
                        height={cardSize.skeleton.icon}
                        sx={{
                          borderRadius: 1,
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
                          height={cardSize.skeleton.count}
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          width={60}
                          height={cardSize.skeleton.title}
                          animation="wave"
                        />
                      </Box>
                    </Box>
                  ) : null}
                </Card>
              </Grid>
            ))
          : data?.map((item, key) => (
              <Grid
                item
                xs={gridSize.xs}
                sm={gridSize.sm}
                md={gridSize.md}
                key={key}
              >
                <Card
                  elevation={5}
                  className="card-animate"
                  sx={{ bgcolor: bgcolor }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={cardSize.py}
                    px={cardSize.px}
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
                        height={cardSize.dataCard.icon}
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
                          fontSize: cardSize.dataCard.count,
                          textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
                        }}
                        color={colors.blueAccent[100]}
                      >
                        <span className="counter-value" data-target="0">
                          <span>
                            {item.count > 999999 ? (
                              <>
                                <CountUp
                                  start={item.count < 9999 ? 0 : item.count - 5}
                                  end={parseFloat(fShortenNumber(item.count))}
                                  duration={3}
                                />
                                {fShortenNumber(item.count)}
                              </>
                            ) : (
                              <CountUp
                                start={item.count < 9999 ? 0 : item.count - 5}
                                end={parseFloat(item.count)}
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
                          fontSize: cardSize.dataCard.title,
                          fontWeight: 700,
                        }}
                        noWrap
                      >
                        {/* {{
                          Provisional: "Provisional",
                          Completed: "Provisional",
                        }[item.title] || item.title} */}
                        {item.title}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Grid>
  );
};

export default CountCard;
