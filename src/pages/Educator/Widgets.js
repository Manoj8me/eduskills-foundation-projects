import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import {
  Grid,
  Card,
  Typography,
  Box,
  useTheme,
  Skeleton,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import { EducatorService } from "../../services/dataService";
import { Icon } from "@iconify/react";
import { fShortenNumber } from "../../utils/formatNumber";
import CustomAddDrawer from "../../components/common/drawer/CustomAddDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchEducatorDesignation } from "../../store/Slices/admin/adminEduDesigSlice";
import UnderWorkingModal from "../../components/common/modal/UnderWorkingModal";

const Widgets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [educatorStatus, setEducatorStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const dispatch = useDispatch();
  const onClose = () =>{
    setIsWorking(false)
  }

  useEffect(() => {
    dispatch(fetchEducatorDesignation());
    // dispatch(fetchDomainList());
    // dispatch(fetchInstList());
  }, [dispatch]);

  const designList = useSelector(
    (state) => state.educatorDesignation.data.data
  );

  // const instituteList = useSelector(
  //   (state) => state.adminInstList.instituteList
  // );

  const updateDesignList = designList?.map((item) => {
    return {
      value: item.design_id,
      label: item.role_name,
    };
  });

  console.log(updateDesignList);

  // const updateInstList = instituteList?.map((item) => {
  //   return {
  //     value: item.institue_id,
  //     label: item.institute_name,
  //   };
  // });

  const configField = [
    // {
    //   name: "institute_id",
    //   label: "Institute Name",
    //   type: "select",
    //   options: updateInstList,
    // },
    { name: "educator_name", label: "Educator Name", type: "text" },
    {
      name: "design_id",
      label: "Designation",
      type: "select",
      options: updateDesignList,
    },

    { name: "email", label: "Email ID", type: "text", variant: "email" },
    {
      name: "mobile",
      label: "Mobile No.",
      type: "number",
      variant: "mobileNo",
    },
    // {
    //   name: "is_spoc",
    //   label: "Is Spoc",
    //   type: "switch",
    //   variant: "yesNo",
    // },
    {
      name: "status",
      label: "Status",
      type: "switch",
      variant: "activeInactive",
    },
  ];

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleAddConfirm = () => {
    setIsWorking(!isWorking);
    setIsDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await EducatorService.educator_statistics();
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
    if (item.title === "Completed") {
      icon = "fluent-mdl2:completed-solid";
    } else if (item.title === "Partial") {
      icon = "ic:twotone-incomplete-circle";
    } else if (item.title === "Droupout") {
      icon = "fluent:picture-in-picture-exit-24-filled";
    } else if (item.title === "Enrolled") {
      icon = "ep:list";
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
          >
            Welcome back to Educator !
          </Typography>
          <Button
            variant="contained"
            color="info"
            size="small"
            sx={{ textTransform: "initial", maxHeight: 28 }}
            startIcon={<Icon icon="fluent:person-add-20-regular" />}
            onClick={handleDrawerOpen}
          >
            Add Educator
          </Button>
        </Box>
      )}
      <Grid container spacing={3}>
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
      <CustomAddDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        config={{
          title: "Add Educator",
          fields: configField,
          saveButtonText: "Add Educator", // Optional, default is "Add"
          cancelButtonText: "Cancel", // Optional, default is "Cancel"
          modalAction: "add", // Optional, default is "add"
        }}
        // onAdd={handleAddItem}
        refresh={refresh}
        onConfirm={handleAddConfirm}
      />
      {isWorking && <UnderWorkingModal onClose={onClose}/>}
    </>
  );
};

export default Widgets;
