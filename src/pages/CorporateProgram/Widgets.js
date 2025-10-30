import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Grid, Card, Typography, Box, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../../theme";
import { CorporateService } from "../../services/dataService";
import { Icon } from "@iconify/react";
import { fShortenNumber } from "../../utils/formatNumber";

const Widgets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [educatorStatus, setEducatorStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await CorporateService.corporate_statistics();
        setEducatorStatus(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const educator = educatorStatus.map((item) => {
    let icon;
    if (item.title === "Active") {
      icon = "fluent-mdl2:completed-solid";
    } else if (item.title === "Total") {
      icon = "fluent-mdl2:total";
    } else if (item.title === "InProgress") {
      icon = "ic:twotone-pending-actions";
    } else if (item.title === "Inactive") {
      icon = "fluent-mdl2:deactivate-orders";
    }

    return {
      label: item.title,
      value: item.count,
      icon: icon,
    };
  });

  const isEducatorDataZero = educator && educator.length === 0;

  return (
    <>
      {isLoading ? (
        <Skeleton
          variant="text" // You can adjust the variant based on your needs
          width={270} // Adjust the width as needed
          height={22} // Adjust the height as needed
          animation="wave"
          sx={{ mb: 2 }} // You can use 'pulse' for a pulsing effect
        />
      ) : (
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
        >
          Welcome back to Corporate Program !
        </Typography>
      )}
      <Grid container spacing={2}>
        {isLoading || isEducatorDataZero
          ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  elevation={0}
                  className="card-animate"
                  sx={{
                    bgcolor: colors.blueAccent[800],
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {isEducatorDataZero && !isLoading ? (
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
                        width={46}
                        height={46}
                        sx={{ borderRadius: 1, bgcolor: colors.redAccent[900] }}
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
                          width={60}
                          height={20}
                          animation="wave"
                          sx={{ bgcolor: colors.redAccent[900] }}
                        />
                        <Skeleton
                          variant="text"
                          width={40}
                          height={26}
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
                          width={46}
                          height={46}
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
                            width={60}
                            height={20}
                            animation="wave"
                          />
                          <Skeleton
                            variant="text"
                            width={40}
                            height={26}
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
            educator?.map((item, key) => (
              <Grid item xs={12} sm={6} lg={3} key={key}>
                <Card
                  elevation={5}
                  className="card-animate"
                  sx={{ bgcolor: colors.blueAccent[800] }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={1.1}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      borderRadius={1}
                      p={1}
                      bgcolor={colors.blueAccent[300]}
                    >
                      <Icon
                        icon={item.icon}
                        color={colors.blueAccent[800]}
                        height={30}
                      />
                    </Box>
                    <Box
                      sx={{
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color={colors.blueAccent[300]}
                        sx={{
                          textTransform: "uppercase",
                          fontWeight: 700,
                          // textShadow: `1px 1px 2px ${colors.grey[300]}`,
                        }}
                        noWrap
                      >
                        {item.label}
                      </Typography>
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
                            {item.value > 999 ? (
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
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
      </Grid>
    </>
  );
};

export default Widgets;
