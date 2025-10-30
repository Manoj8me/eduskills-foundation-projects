import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../../../theme";
import { InternshipService, MembershipService } from "../../../services/dataService";
import { Icon } from "@iconify/react";

const data = [
  { title: "Total MAU", count: "450" },
  { title: "Signed MAU", count: "200" },
  { title: "Inprogress MAU", count: "150" },
  { title: "Pending MAU", count: "100" },
];

const Widgets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [internshipStatus, setInternshipStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await MembershipService.agreement();
        setInternshipStatus(response.data?.counter);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const internship = internshipStatus.map((item) => {
    let icon;
    if (item.title === "Total") {
      icon = "ep:list";
    } else if (item.title === "A. Signed") {
      icon = "ph:pen-bold";
    } else if (item.title === "Inactive") {
      icon = "grommet-icons:in-progress";
    } else if (item.title === "Pending") {
      icon = "ic:twotone-pending-actions";
    }

    return {
      label: item.title,
      value: item.value,
      icon: icon,
    };
  });

  const isInternshipDataZero = internship && internship.length === 0;

  return (
    <>
      <Grid container spacing={3}>
        {isLoading || isInternshipDataZero
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
                        width={35}
                        height={35}
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
                          height={15}
                          animation="wave"
                          sx={{ bgcolor: colors.redAccent[900] }}
                        />
                        <Skeleton
                          variant="text"
                          width={40}
                          height={21}
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
                          width={35}
                          height={35}
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
                            height={15}
                            animation="wave"
                          />
                          <Skeleton
                            variant="text"
                            width={40}
                            height={21}
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
                    py={1.1}
                    px={1.3}
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
                        variant="body2"
                        fontWeight="600"
                        component="span"
                        sx={{
                          textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
                        }}
                        color={colors.blueAccent[100]}
                      >
                        <span className="counter-value" data-target="0">
                          <span>{item.value}</span>
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
