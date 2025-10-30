import {
  Avatar,
  Box,
  Card,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { fShortenNumber } from "../../../utils/formatNumber";
import CountUp from "react-countup";
import { tokens } from "../../../theme";
import AlteryxLogo from "../../../assets/imgs/AcademyLogo/Alteryx_logo.svg";
import AWSLogo from "../../../assets/imgs/AcademyLogo/Amazon_Web_Services_Logo.svg";
import BluePrismLogo from "../../../assets/imgs/AcademyLogo/Blue_Prism_logo.svg";
import CelonisLogo from "../../../assets/imgs/AcademyLogo/Celonis_Logo.svg";
import FortinetLogo from "../../../assets/imgs/AcademyLogo/Fortinet_logo.svg";
import GoogleLogo from "../../../assets/imgs/AcademyLogo/Google_Developers_ogo.svg";
import JuniperLogo from "../../../assets/imgs/AcademyLogo/Juniper_Networks_logo.svg";
import MicrochipLogo from "../../../assets/imgs/AcademyLogo/Microchip_logo.svg";
import PaloAltoLogo from "../../../assets/imgs/AcademyLogo/PaloAltoNetworks_Logo.svg";
import UiPathLogo from "../../../assets/imgs/AcademyLogo/UiPath_logo.svg";
import ZscalerLogo from "../../../assets/imgs/AcademyLogo/Zscaler_logo.svg";
import BentleyLogo from "../../../assets/imgs/AcademyLogo/bentley-systems-logo.svg";
import AltairLogo from "../../../assets/imgs/AcademyLogo/Altair_logo.svg";
import EduSkillsLogo from "../../../assets/imgs/AcademyLogo/eduskills-academy-logo.png";
import AnsycLogo from "../../../assets/imgs/AcademyLogo/ansys-logo.jpg";
import MidasLogo from "../../../assets/imgs/AcademyLogo/midas_logo.png";
import WadhwaniLogo from "../../../assets/imgs/AcademyLogo/Wadhwani-Foundation-Logo.webp";

const defaultIconStyle = {
  backgroundColor: "grey",
  borderRadius: "50%",
  width: 48,
  height: 48,
};

const AcademyDetails = ({ corporateList, isLoading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const internship = corporateList?.map((item) => {
    let icon;
    if (item.title === "Alteryx") {
      icon = AlteryxLogo;
    } else if (item.title === "Aws") {
      icon = AWSLogo;
    } else if (item.title === "Bentley ") {
      icon = BentleyLogo;
    } else if (item.title === "Blueprism") {
      icon = BluePrismLogo;
    } else if (item.title === "Celonis") {
      icon = CelonisLogo;
    } else if (item.title === "Fortinet") {
      icon = FortinetLogo;
    } else if (item.title === "Google") {
      icon = GoogleLogo;
    } else if (item.title === "Juniper") {
      icon = JuniperLogo;
    } else if (item.title === "Microchip") {
      icon = MicrochipLogo;
    } else if (item.title === "Paloalto") {
      icon = PaloAltoLogo;
    } else if (item.title === "UiPath") {
      icon = UiPathLogo;
    } else if (item.title === "Zscaler") {
      icon = ZscalerLogo;
    } else if (item.title === "Altair") {
      icon = AltairLogo;
    } else if (item.title === "Ansys") {
      icon = AnsycLogo;
    } else if (item.title === "EduSkills") {
      icon = EduSkillsLogo;
    } else if (item.title === "Midas") {
      icon = MidasLogo;
    } else if (item.title === "Wadhwani Foundation") {
      icon = WadhwaniLogo;
    }

    return {
      label: item.title,
      value: item.count,
      icon: icon,
    };
  });

  const isInternshipDataZero = internship && internship.length === 0;

  return (
    <Card
      elevation={5}
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: colors.blueAccent[800],
        py: 1,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 1.5,
          mb: 0.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="700"
          component="span"
          sx={{
            textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
            fontSize: 10,
            minWidth: 90,
          }}
          color={colors.blueAccent[300]}
        >
          Academy
        </Typography>
        <Typography
          variant="h6"
          fontWeight="700"
          component="span"
          sx={{
            textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
            fontSize: 10,
          }}
          color={colors.blueAccent[300]}
        >
          Institute
        </Typography>
        {/* <Typography
          variant="h6"
          fontWeight="700"
          component="span"
          sx={{
            textShadow: `2px 2px 4px ${colors.greenAccent[900]}`,
            fontSize: 10,
          }}
          color={colors.blueAccent[300]}
        >
          Internship
        </Typography> */}
      </Box>

      <Box sx={{ width: "100%", overflow: "auto", cursor: "pointer" }}>
        <Grid container spacing={2} sx={{ height: 305 }}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {isLoading || isInternshipDataZero
                ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
                  Array.from({ length: 12 }).map((_, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        elevation={0}
                        className="card-animate"
                        sx={{
                          // bgcolor: colors.blueAccent[800],
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
                              width={50}
                              height={20}
                              sx={{
                                borderRadius: 1,
                                bgcolor: colors.redAccent[900],
                              }}
                              animation="wave"
                            />
                            <Box>
                              <Skeleton
                                variant="text"
                                width={40}
                                height={20}
                                animation="wave"
                                sx={{ bgcolor: colors.redAccent[900] }}
                              />
                            </Box>
                          </Box>
                        ) : (
                          // Display a loading skeleton inside the card
                          <Box sx={{ width: "100%", height: "100%", my: 1 }}>
                            <Grid container spacing={1}>
                              {isLoading || isInternshipDataZero
                                ? // Display 4 loading skeleton cards or 4 empty cards when data is 0
                                  Array.from({ length: 1 }).map((_, index) => (
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
                                              p: 0.5,
                                              px: 1.2,
                                              height: "100%",
                                              width: "100%",
                                              display: "flex",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <Skeleton
                                              variant="rectangular"
                                              width={25}
                                              height={20}
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
                                                width={60}
                                                height={10}
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
                                                py: 0.5,
                                                px: 1,
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              <Skeleton
                                                variant="rectangular"
                                                width={60}
                                                height={20}
                                                sx={{ borderRadius: 1 }}
                                                animation="wave"
                                              />

                                              <Skeleton
                                                variant="text"
                                                width={40}
                                                height={20}
                                                animation="wave"
                                              />
                                            </Box>
                                          </>
                                        )}
                                      </Card>
                                    </Grid>
                                  ))
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
                                            sx={{
                                              mr: 0.5,
                                              overflow: "hidden",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                            }}
                                          >
                                            <img
                                              src={item.icon}
                                              alt={item.label}
                                              style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30,
                                              }}
                                            />
                                            <Typography
                                              variant="h6"
                                              fontWeight="700"
                                              color={colors.blueAccent[100]}
                                            >
                                              <span
                                                className="counter-value"
                                                data-target="0"
                                              >
                                                <span>
                                                  {" "}
                                                  {item.value1 > 99999 ? (
                                                    <>
                                                      <CountUp
                                                        start={0}
                                                        end={parseFloat(
                                                          fShortenNumber(
                                                            item.value1
                                                          )
                                                        )}
                                                        duration={3}
                                                      />
                                                      {fShortenNumber(
                                                        item.value1
                                                      ).slice(-1)}
                                                    </>
                                                  ) : (
                                                    <CountUp
                                                      start={0}
                                                      end={parseFloat(
                                                        item.value2
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
                      </Card>
                    </Grid>
                  ))
                : // Display actual content once data is loaded
                  internship?.map((item, key) => (
                    <Grid item xs={12} key={key}>
                      <Card
                        elevation={0}
                        className="card-animate"
                        // sx={{ bgcolor: "transparent" }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          p={1}
                          px={1.2}
                        >
                          <Box
                            sx={{
                              mr: 0.5,
                              overflow: "hidden",
                              display: "flex",
                              //   flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                width: 90,
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <img
                                src={item.icon}
                                alt={item.label}
                                style={{
                                  // width: 60,
                                  height: 18,
                                  // borderRadius: 30,
                                }}
                              />
                            </Box>

                            <Typography
                              variant="h6"
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
                            {/* <Typography
                              variant="h6"
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
                                  {item.value2 > 99999 ? (
                                    <>
                                      <CountUp
                                        start={0}
                                        end={parseFloat(
                                          fShortenNumber(item.value2)
                                        )}
                                        duration={3}
                                      />
                                      {fShortenNumber(item.value2).slice(-1)}
                                    </>
                                  ) : (
                                    <CountUp
                                      start={0}
                                      end={parseFloat(item.value2)}
                                      duration={3}
                                    />
                                  )}
                                </span>
                              </span>
                            </Typography> */}
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default AcademyDetails;
