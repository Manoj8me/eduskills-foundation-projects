import React, { useEffect } from "react";
import CountUp from "react-countup";
import { Grid, Card, Typography, Box, useTheme, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../../theme";
import { Icon } from "@iconify/react";
import { fShortenNumber } from "../../utils/formatNumber";
import { fetchInternshipStatus } from "../../store/Slices/internship/internStatusSlice";

const Widgets = ({ internshipId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const internshipStatus = useSelector((state) => state.internshipStatus.data);
  const isLoading = useSelector((state) => state.internshipStatus.isLoading);

  useEffect(() => {
    if (internshipId !== null || undefined) {
      dispatch(fetchInternshipStatus(internshipId));
    }
  }, [dispatch, internshipId]);

  const internship = internshipStatus.map((item) => {
    let icon;
    if (item.title === "Applied") {
      icon = "mdi:account-tick";
    } else if (item.title === "Completed") {
      icon = "fluent-mdl2:completed-solid";
    } else if (item.title === "Provisional") {
      icon = "ic:twotone-incomplete-circle";
    } else if (item.title === "InProgress") {
      icon = "ic:twotone-pending-actions";
    } else if (item.title === "Shortlist") {
      icon = "ep:list";
    }else if (item.title === "pending"){
      icon = "mdi:account-pending"
    }else if (item.title === "rejected"){
      icon = "gridicons:cross-circle"
    }


    
   

    return {
      label: item.title,
      value: item.count,
      icon: icon,
    };
  });

  const isInternshipDataZero = internship && internship.length === 0;

  return (
    <>
      <Grid container spacing={2}>
        {isLoading || isInternshipDataZero
          ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
            Array.from({ length: 6 }).map((_, index) => (
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
            internship?.map((item, key) => (
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
                    p={1}
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
                        height={20}
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
                        variant="caption"
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
