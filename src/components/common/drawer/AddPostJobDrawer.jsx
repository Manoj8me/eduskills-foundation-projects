import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Box,
  TextField,
  Paper,
  Container,
  useTheme,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  Grid,
  Autocomplete,
} from "@mui/material";
import { tokens } from "../../../theme";
import CommonModal from "../modal/CommonModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";
import { TalentConnectService } from "../../../services/dataService";
import PostJobModal from "../modal/PostJobModal";
import { toast } from "react-toastify";
import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import _ from "lodash";
// import { AdminService } from "../../../services/dataService";
// import DomainConfirmationModal from "../modal/DomainConfirmationModal";

const dummyDomainList = [
  {
    institute_id: 1,
    institute_name: "Institute A",
    status: "Active",
    academy_id: 101,
  },
  {
    institute_id: 2,
    institute_name: "Institute B",
    status: "Inactive",
    academy_id: 102,
  },
  {
    institute_id: 3,
    institute_name: "Institute C",
    status: "Active",
    academy_id: 103,
  },
  {
    institute_id: 4,
    institute_name: "Institute D",
    status: "Inactive",
    academy_id: 104,
  },
];

// const initialFormData = {
//   jobTitle: "",
//   state: [],
//   institute: [],
//   startDate: "",
//   endDate: "",
//   numOfApplications: "",
// };
//...................................
const AddPostJobDrawer = ({
  isOpen,
  onClose,
  drawerData,
  setSelectedAssignItems,
  setRefreshTable,
}) => {
  // const [selectedColleges, setSelectedColleges] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentAction, setCurrentAction] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [doaminList, setDoaminList] = useState([]);
  const [alignment, setAlignment] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(0);
  const [applicationLimit, setApplicationLimit] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedValue, setSelectedValue] = useState({
    domain: null,
    passout: null,
    metric: null,
    intermediate: null,
    btech: null,
    gender: null,
  });

  const dispatch = useDispatch();
  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  function handleErrorMessage(message) {
    toast.error(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }
  useEffect(() => {
    setSelectedValues([]);
  }, [alignment]);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      setSelectedColleges([]);
      setSelectedState([]);
      setSelectedJobTitle("");
      setStartDate("");
      setEndDate("");
      setApplicationLimit(0);
      setStatus(0);
    }
    // setAlignment(newAlignment);
  };

  const academy_id = drawerData?.id || null;

  const fetchData = async (academy_id) => {
    try {
      //   const response = await AdminService.admin_academy_all_Institute(
      //     academy_id
      //   );
      //   const data = response.data.data.map((domain) => ({
      //     ...domain,
      //     status: domain.status === "Active" ? "1" : "0",
      //   }));
      //   setDoaminList(data);
      const data = dummyDomainList.map((domain) => ({
        ...domain,
        status: domain.status === "Active" ? "1" : "0",
      }));
      setDoaminList(data);
      setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingList(false);
    } finally {
      setLoadingList(false); // Set loading to false when fetching is complete (success or failure)
    }
  };

  useEffect(() => {
    // if (academy_id) {
    fetchData(academy_id);
    // }
  }, []);

  const handleOpenConfirmationModal = (action) => {
    setCurrentAction(action);
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleClose = () => {
    // onClose();
    setIsModalOpen(false);
    setSearchTerm("");
  };

  const selectedJdId = jobTitleList?.filter(
    (item) => item?.job_title === selectedJobTitle
  )[0]?.jd_id;

  const selectedStateId = selectedState.map((state) => state.value);
  const handleConfirmAction = async () => {
    if (currentAction === "update") {
      const updatedData = doaminList.map((domain) => {
        const isSelected = selectedColleges.includes(domain.institute_id);
        return {
          institute_id: domain.institute_id,
          status: isSelected ? "1" : "0",
        };
      });
      const updatedValue = {
        btech: selectedValue.btech.value,
        domain: selectedValue.domain?.map(item => item.value)||[],
        gender: selectedValue.gender.value,
        intermediate: selectedValue.intermediate.value,
        metric: selectedValue.metric.value,
        passout: selectedValue.passout?.map((item)=> item.value),
      };
      // setSelectedAssignItems({ data: updatedData, academy_id: academy_id });
      const data = {
        post_type: 2,
        jd_id: selectedJdId,
        state:  selectedStateId,
        institute:  selectedColleges,
        start_date: startDate,
        end_date: endDate,
        no_of_applications: applicationLimit,
        status: status,
        ...updatedValue,
      };
      console.log(data);

      try {
        const res = await TalentConnectService.job_post(data);
        handleSuccessMessage(res.data.detail || "Job Post added successfully");
        handleCloseConfirmationModal();
        handleCancel();
        setRefreshTable((prev) => !prev);
      } catch (error) {
        console.error(error);
        handleErrorMessage(error.response.data.detail || error.message);
      }

      setSearchTerm("");
    } else if (currentAction === "save") {
      // Perform delete action
      // ...
    }
  };

  const handleCancel = () => {
    onClose();
    setSearchTerm("");
    setSelectedColleges([]);
    setSelectedState([]);
    setSelectedJobTitle("");
    setStartDate("");
    setEndDate("");
    setApplicationLimit(0);
    setStatus(0);
  };

  const handleOpenModal = (header, type) => {
    setIsModalOpen(true);
    setModalHeader(header);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setSelectedValues([]);
  };

  const handleSave = (value) => {
    // Handle save logic based on the modal content

    // console.log("Saved:", {
    //   selectedJobTitle,
    //   selectedState,
    //   selectedColleges,
    // });
    handleCloseModal();
    setModalType("");
  };

  const validateData = () => {
    let isValid = false;

    switch (alignment) {
      case 0:
        isValid =
          selectedJobTitle !== "" &&
          startDate !== "" &&
          endDate !== "" &&
          applicationLimit > -1;
        break;
      case 1:
        isValid =
          selectedJobTitle !== "" &&
          startDate !== "" &&
          endDate !== "" &&
          applicationLimit > -1 &&
          selectedState.length > 0;
        break;
      case 2:
        isValid =
          selectedJobTitle !== "" &&
          startDate !== "" &&
          endDate !== "" &&
          applicationLimit > -1 &&
          selectedState.length > 0 &&
          selectedColleges.length > 0;
        break;
      default:
        isValid = false;
    }

    setIsFormValid(isValid);

    return isValid;
  };

  useEffect(() => {
    validateData();
  }, [
    alignment,
    selectedJobTitle,
    startDate,
    endDate,
    applicationLimit,
    selectedState,
    selectedColleges,
  ]);

  const handleAutocompleteChange = (name, value) => {
    setSelectedValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const currentYear = new Date().getFullYear();
  const yearData = [];
  for (let year = currentYear - 4; year <= currentYear + 1; year++) {
    yearData.push({
      title: year.toString(),
      value: year,
    });
  }
  const updateYr = [{ title: "-- ALL --", value: 0 }, ...yearData];

  useEffect(() => {
    dispatch(fetchDomainList());
  }, []);
  // admin_academy_list
  const domainList = useSelector((state) => state.domainList.domainList);
  const updateDomain = domainList?.map((item) => ({
    title: item.domain_name,
    value: item.domain_id,
  }));

  const markPer = [
    {
      title: "-- ALL --",
      value: 0,
    },
    {
      title: "50% or above",
      value: 50,
    },
    {
      title: "60% or above",
      value: 60,
    },
    {
      title: "70% or above",
      value: 70,
    },
    {
      title: "80% or above",
      value: 80,
    },
    {
      title: "90% or above",
      value: 90,
    },
  ];
  const markCgpa = [
    {
      title: "-- ALL --",
      value: 0,
    },
    {
      title: "5CGPA or above",
      value: 5,
    },
    {
      title: "6CGPA or above",
      value: 6,
    },
    {
      title: "7CGPA or above",
      value: 7,
    },
    {
      title: "8CGPA or above",
      value: 8,
    },
    {
      title: "9CGPA or above",
      value: 9,
    },
  ];

  const gender = [
    {
      title: "-- ALL --",
      value: ["Male", "Female", "Transgender"],
    },
    {
      title: "Male",
      value: ["Male"],
    },
    {
      title: "Female",
      value: ["Female"],
    },
    {
      title: "Transgender",
      value: ["Transgender"],
    },
    {
      title: "Male, Female",
      value: ["Male", "Female"],
    },
  ];

  const filterData = [
    {
      placeholder: "Select Domain",
      type: "select",
      name: "domain",
      isDisable: false,
      option: updateDomain || [],
    },
    {
      placeholder: "Passout Year",
      type: "multiselect",
      name: "passout",
      isDisable: false,
      option: updateYr || [],
    },
    {
      placeholder: "10th Mark",
      type: "select",
      name: "metric",
      isDisable: false,
      option: markPer || [],
    },
    {
      placeholder: "12th/Diploma Mark",
      type: "select",
      name: "intermediate",
      isDisable: false,
      option: markPer || [],
    },
    {
      placeholder: "Btech/Gradution Mark",
      type: "select",
      name: "btech",
      isDisable: false,
      option: markCgpa || [],
    },
    {
      placeholder: "Gender",
      type: "select",
      name: "gender",
      isDisable: false,
      option: gender || [],
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: colors.blueAccent[800],
          px: 2,
          py: 0.5,
        }}
      >
        <Typography
          variant="h6"
          color={colors.blueAccent[200]}
          fontWeight={600}
        >
          {/* {title} */}
          {drawerData?.name || "Add Job Post"}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Close Drawer"
          onClick={handleCancel}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Container
        sx={{
          [theme.breakpoints.down("sm")]: {
            width: "100vw",
          },
          [theme.breakpoints.up("sm")]: {
            width: "600px",
          },
          my: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "94vh",
        }}
      >
        <Paper
          elevation={0}
          sx={{ overflowY: "auto", p: 1, bgcolor: colors.blueAccent[900] }}
        >
          {/* <Box sx={{ display: "flex" }}>
            <ToggleButtonGroup
              color="info"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
              sx={{ height: "25px" }}
            >
              <ToggleButton value={0}>All</ToggleButton>
              <ToggleButton value={1}>State</ToggleButton>
              <ToggleButton value={2}>Institute</ToggleButton>
            </ToggleButtonGroup>
          </Box> */}
          {/* add form here */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              my: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: 14 }}
            >{`Title : ${selectedJobTitle}`}</Typography>

            <Box>
              {/* <IconButton sx={{p:0.5}}><Icon icon='uil:edit'/></IconButton> */}
              <Button
                size="small"
                // sx={{ height: 20, fontSize: 10 }}
                variant="outlined"
                color="info"
                onClick={() => handleOpenModal("Select Job Title", "jobTitle")}
              >
                Select Title
              </Button>
            </Box>
          </Paper>
          {/* {(alignment === 1 || alignment === 2) && ( */}
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                my: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 14 }}
              >{`State : ${selectedState.length}`}</Typography>

              <Box>
                {/* <IconButton sx={{p:0.5}}><Icon icon='uil:edit'/></IconButton> */}
                <Button
                  size="small"
                  // sx={{ height: 20, fontSize: 10 }}
                  variant="outlined"
                  color="info"
                  onClick={() => handleOpenModal("Select State", "state")}
                >
                  Selected State
                </Button>
              </Box>
            </Paper>
          {/* )} */}
          {/* {alignment === 2 && ( */}
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                my: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 14 }}
              >{`Institute : ${selectedColleges.length}`}</Typography>

              <Box>
                {/* <IconButton sx={{p:0.5}}><Icon icon='uil:edit'/></IconButton> */}
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  disabled={selectedState.length === 0}
                  // sx={{ height: 20, fontSize: 10 }}
                  onClick={() =>
                    handleOpenModal("Select Institute", "institute")
                  }
                >
                  Select Institute
                </Button>
              </Box>
            </Paper>
          {/* )} */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              pb: 1,
              pt: 1.5,
              my: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  color="info"
                  size="small"
                  value={startDate}
                  // sx={{ mr: 1 }}
                  variant="outlined"
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  color="info"
                  size="small"
                  // sx={{ ml: 1 }}
                  variant="outlined"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 2,
              my: 1,
            }}
          >
            <Grid container spacing={2}>
              {filterData.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  {item.type === "select" ? (
                    <Autocomplete
                      size="small"
                      disabled={item.isDisable}
                      options={item.option}
                      value={selectedValue[item.name]}
                      getOptionLabel={(option) => option?.title}
                      renderInput={(params) => (
                        <TextField
                          color="info"
                          {...params}
                          label={item.placeholder}
                          variant="outlined"
                        />
                      )}
                      onChange={(event, value) =>
                        handleAutocompleteChange(item?.name, value)
                      }
                    />
                  ) : item.type === "multiselect" ? (
                    <Autocomplete
                      multiple
                      value={selectedValue[item.name] || []}
                      onChange={(event, newValues) => {
                        const uniqueNewValues = _.uniqBy(
                          newValues,
                          (obj) => obj.value
                        ); // Remove duplicates based on "id" property
                        const newSelectedValues = {
                          ...selectedValue,
                          [item.name]: uniqueNewValues,
                        };
                        setSelectedValue(newSelectedValues);
                        handleAutocompleteChange(item?.name, uniqueNewValues);
                      }}
                      options={item.option || []}
                      size="small"
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={item.placeholder}
                          variant="outlined"
                          // margin="dense" // Optional
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <> {params.InputProps.endAdornment} </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : (
                    ""
                  )}
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              my: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Application Limit"
                  type="text" // Use text type to allow custom input constraints
                  value={applicationLimit}
                  color="info"
                  size="small"
                  onChange={(e) => {
                    // Check if the input is a valid number before updating the state
                    if (/^\d*$/.test(e.target.value)) {
                      setApplicationLimit(e.target.value);
                    }
                  }}
                  variant="outlined"
                  sx={{ mt: 0.5 }}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ alignItems: "center", display: "flex" }}>
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 500,
                      color:
                        status === 1
                          ? colors.blueAccent[300]
                          : colors.grey[600],
                      bgcolor:
                        status === 1
                          ? colors.blueAccent[700]
                          : colors.grey[900],
                      px: 1.5,
                      py: 0.3,
                      borderRadius: 1,
                    }}
                  >
                    {/* {field.label} */}
                    Publish
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        // name={field.name}
                        color="info"
                        sx={{ ml: 1.5 }}
                        checked={status === 1}
                        onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                      />
                    }
                    // label={
                    //   (field.variant === "yesNo" && addedItem[field.name]) ||
                    //   (field.variant === "activeInactive" &&
                    //     addedItem[field.name])
                    // }
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Paper>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            right: 0,
            p: 1,
            mr: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="info"
            disabled={!isFormValid}
            onClick={() => handleOpenConfirmationModal("update")}
          >
            Add Job Post
          </Button>
          <Button variant="contained" color="inherit" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
        <CommonModal
          open={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmAction}
          action={currentAction}
        />
        {/* Modal */}

        {/* <DomainConfirmationModal
            isOpen={isDomainConfirmationModalOpen}
            onClose={handleCloseDomainConfirmationModal}
            setInstStatus={setInstStatus}
            // onConfirm={handleDomainConfirmation}
            // domain={selectedDomain}
            institueId={institue_id}
          /> */}
        <PostJobModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onSave={handleSave}
          selectedColleges={selectedColleges}
          setSelectedCollege={setSelectedColleges}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          selectedJobTitle={selectedJobTitle}
          setSelectedJobTitles={setSelectedJobTitle}
          jobTitleList={jobTitleList}
          setJobTitleList={setJobTitleList}
          selectedState={selectedState}
          setSelectedStates={setSelectedState}
          type={modalType}
          alignment={alignment}
        />
      </Container>
    </Drawer>
  );
};

export default AddPostJobDrawer;
