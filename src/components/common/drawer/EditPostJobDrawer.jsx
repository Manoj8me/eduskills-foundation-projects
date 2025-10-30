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
} from "@mui/material";
import { tokens } from "../../../theme";
import CommonModal from "../modal/CommonModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";
import { TalentConnectService } from "../../../services/dataService";
import PostJobModal from "../modal/PostJobModal";
import { toast } from "react-toastify";
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
    status: "InActive",
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
    status: "InActive",
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
const EditPostJobDrawer = ({
  isOpen,
  onClose,
  drawerData,
  setSelectedAssignItems,
  setRefreshTable,
}) => {
  // const [selectedColleges, setSelectedColleges] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //   const [editData, setEditData] = useState({});
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
  //   const [modalContent, setModalContent] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(0);
  const [applicationLimit, setApplicationLimit] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);
  const [jobId, setJobId] = useState(null);

  const dispatch = useDispatch();
  //   useEffect(() => {
  //     // Check if editData has any keys
  //     setHasKeys(Object.keys(editData).length > 0);
  //     if(hasKeys){
  //         setSelectedJobTitle(editData?.job_title || "")
  //         // setAlignment(editData?.post_type || 0 )
  //     }
  // }, [editData]);
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
      //   setSelectedColleges([]);
      //   setSelectedState([]);
      //   setSelectedJobTitle("");
      //   setStartDate("");
      //   setEndDate("");
      //   setApplicationLimit(0);
      //   setStatus(0);
    }
    // setAlignment(newAlignment);
  };

  const job_id = drawerData?.job_id || null;

  const fetchEditData = async (job_id) => {
    if (job_id) {
      try {
        const { data } = await TalentConnectService.single_job(job_id);
        const editData = data?.data;
        setJobId(editData?.job_id || null);
        setSelectedJobTitle(editData?.job_title || "");
        setApplicationLimit(editData?.no_of_post || 0);
        setAlignment(JSON.parse(editData?.post_type) || 0);
        setSelectedColleges(editData?.institute_id || []);
        setSelectedState(editData?.state_id || []);
        setStartDate(editData?.reg_start || "");
        setEndDate(editData?.reg_end || "");
        setStatus(editData?.status === "Draft" ? 0 : 1 || 0);
        //   setEditData(editData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchEditData(job_id);
  }, [job_id]);

  const fetchData = async (job_id) => {
    try {
      //   const response = await AdminService.admin_academy_all_Institute(
      //     job_id
      //   );
      //   const data = response.data.data.map((domain) => ({
      //     ...domain,
      //     status: domain.status === "Active" ? "1" : "0",
      //   }));
      //   setDoaminList(data);
      const data = dummyDomainList.map((domain) => ({
        ...domain,
        status: domain.status === "Active" ? 1 : 0,
      }));
      //   setDoaminList(data);
      //   setLoadingList(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingList(false);
    } finally {
      setLoadingList(false); // Set loading to false when fetching is complete (success or failure)
    }
  };

  useEffect(() => {
    // if (academy_id) {
    fetchData(job_id);
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

  //   const selectedStateId = selectedState.map((state) => state.value);
  const handleConfirmAction = async () => {
    if (currentAction === "update") {
      const updatedData = doaminList.map((domain) => {
        const isSelected = selectedColleges.includes(domain.institute_id);
        return {
          institute_id: domain.institute_id,
          status: isSelected ? "1" : "0",
        };
      });
      const updateData = {
        post_type: alignment,
        jd_id: selectedJdId,
        state: alignment === 0 ? [] : selectedState,
        institute: alignment === 0 || alignment === 1 ? [] : selectedColleges,
        start_date: startDate,
        end_date: endDate,
        no_of_applications: applicationLimit,
        status: status,
      };
      try {
        const res = await TalentConnectService.update_jod(jobId, updateData);
        handleSuccessMessage(res.data.detail || "Job Post added successfully");
        handleCloseConfirmationModal();
        handleCancel();
        setRefreshTable((prev) => !prev);
      } catch (error) {
        handleErrorMessage(error.response.data.detail || error.message);
      }
      //   setSelectedAssignItems({ data: updatedData, academy_id: academy_id });
      setSearchTerm("");
    } else if (currentAction === "save") {
      // Perform delete action
      // ...
    }
  };

  const handleCancel = () => {
    onClose();
    setSearchTerm("");
    // setSelectedColleges([]);
    // setSelectedState([]);
    // setSelectedJobTitle("");
    // setStartDate("");
    // setEndDate("");
    // setApplicationLimit(0);
    // setStatus(0);
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
          {drawerData?.name || "Edit Job Post"}
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
          <Box sx={{ display: "flex" }}>
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
          </Box>
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
            >{`JD Title : ${selectedJobTitle}`}</Typography>

            <Box>
              {/* <IconButton sx={{p:0.5}}><Icon icon='uil:edit'/></IconButton> */}
              <Button
                size="small"
                // sx={{ height: 20, fontSize: 10 }}
                variant="outlined"
                color="info"
                onClick={() => handleOpenModal("Select Job Title", "jobTitle")}
              >
                Select JD Title
              </Button>
            </Box>
          </Paper>
          {(alignment === 1 || alignment === 2) && (
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
          )}
          {alignment === 2 && (
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
          )}
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
                    Status
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
          colleges={selectedColleges}
          setSelectedCollege={setSelectedColleges}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          title={selectedJobTitle}
          setSelectedJobTitles={setSelectedJobTitle}
          jobTitleList={jobTitleList}
          setJobTitleList={setJobTitleList}
          states={selectedState}
          setSelectedStates={setSelectedState}
          type={modalType}
          alignment={alignment}
        />
      </Container>
    </Drawer>
  );
};

export default EditPostJobDrawer;

{
  /* <Autocomplete
            id="highlights-demo"
            sx={{ my: 0.5, width: 400 }}
            size="small"
            options={jobTitleList}
            getOptionLabel={(option) => option.job_title}
            renderInput={(params) => (
              <TextField {...params} label="Select Job Title" margin="dense" />
            )}
            renderOption={(props, option, { inputValue }) => {
              const matches = match(option.job_title, inputValue, {
                insideWords: true,
              });
              const parts = parse(option.job_title, matches);

              return (
                <li {...props}>
                  <div>
                    {parts.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                  </div>
                </li>
              );
            }}
          /> */
}
{
  /* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {(alignment === 1 || alignment === 2) && (
              <>
                <Autocomplete
                  multiple
                  value={selectedValues || []}
                  onChange={handleStateChange}
                  sx={{ mb: 0.5, width: "80%" }}
                  options={stateData}
                  size="small"
                  getOptionLabel={(option) => option?.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select State"
                      variant="outlined"
                      margin="dense"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <>{params.InputProps.endAdornment}</>,
                      }}
                    />
                  )}
                />
                <Button
                  color="info"
                  variant="contained"
                  sx={{ my: 1.1, width: "20%", ml: 1 }}
                >
                  ok
                </Button>
            
              </>
            )}
          </Box> */
}
{
  /* {alignment === 2 && (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={0.5}
                mb={1}
                maxWidth="600px"
              >
                <Box display="flex" alignItems="center">
                  <Checkbox
                    color="info"
                    checked={selectedColleges.length === doaminList.length}
                    onChange={handleSelectAll}
                  />
                  <Typography mr={1}>Select All</Typography>
                </Box>
                <Box>
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search..."
                    color="info"
                    size="small"
                    margin="dense"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          &#128269;
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              <Paper
                elevation={1}
                style={{
                  minHeight: "72vh",
                  maxHeight: "72vh",
                  overflowY: "auto",
                  maxWidth: "600px",
                }}
              >
                {loadingList ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "70vh",
                      maxHeight: "70vh",
                    }}
                  >
                    <CircularProgress color="info" />
                  </Box>
                ) : (
                  filterDomains()?.map((domain) => (
                    <Box
                      key={domain.institute_id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 1,
                        borderRadius: 0.5,
                        // justifyContent: "space-between",
                        bgcolor:
                          selectedColleges.indexOf(domain.academy_id) > -1
                            ? colors.blueAccent[800]
                            : "1",
                        m: 0.3,
                        "&:hover": {
                          bgcolor: colors.blueAccent[800],
                        },
                      }}
                    >
                      <Checkbox
                        color="info"
                        checked={domain.status === "1"}
                        onChange={() =>
                          handleCheckboxChange(domain.institute_id)
                        }
                      />
                      <Typography>{domain?.institute_name}</Typography> */
}
{
  /* <Typography sx={{ ml: 1 }}>{college.status}</Typography> */
}
{
  /* </Box>
                  ))
                )}
              </Paper>
            </>
          )} */
}
