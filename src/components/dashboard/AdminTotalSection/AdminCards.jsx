import { Box, Card, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import React from 'react'
// import { useSelector } from 'react-redux';
import { fShortenNumber } from '../../../utils/formatNumber';
import CountUp from "react-countup";
import { tokens } from '../../../theme';
import { Icon } from '@iconify/react';

const AdminCards = ({total, isLoading}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

//   const totalStatus = useSelector((state) => state.total.totalStatus);
//   const isLoading = useSelector((state) => state.total.isLoading);

  const cardData = total;

  const internship = cardData.map((item) => {
    let icon;
    if (item.title === "Total Student") {
      icon = "mdi:account-student";
    } else if (item.title === "Total Internship") {
      icon = "healthicons:i-training-class";
    } else if (item.title === "Total Educator") {
      icon = "ph:chalkboard-teacher";
    } else if (item.title === "Corporate Academy") {
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
    <Grid item xs={12}>
    <Grid container spacing={2}>
      {
    //   isLoading || 
      isInternshipDataZero
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
                {
                isInternshipDataZero
                //  && !isLoading 
                 ? (
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
  )
}

export default AdminCards