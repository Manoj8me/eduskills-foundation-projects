import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Box,
  Checkbox,
  TextField,
  FormControl,
  InputAdornment,
  Paper,
  Container,
  useTheme,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
} from "@mui/material";
import { tokens } from "../../../theme";
import CommonModal from "../modal/CommonModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";
// import { AdminService } from "../../../services/dataService";
// import DomainConfirmationModal from "../modal/DomainConfirmationModal";

// const stateData = [
//   { value: 1, label: "Option 1" },
//   { value: 2, label: "Option 2" },
//   { value: 3, label: "Option 3" },
// ];
//...................................
const PostJobDrawer = ({
  isOpen,
  onClose,
  drawerData,
  setSelectedAssignItems,
  selectedColleges,
  setSelectedColleges,
}) => {
  // const [selectedColleges, setSelectedColleges] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [doaminList, setDoaminList] = useState([]);
  const [alignment, setAlignment] = useState("all");
  const [selectedValues, setSelectedValues] = useState([]);
  const dispatch = useDispatch();
  const stateList = useSelector((state) => state.statePackage.instituteState);
  const stateData = stateList?.map((state) => ({
    value: state.state_id,
    label: state.state_name,
  }));
  //   console.log(updatedStateList);
  const handleStateChange = (event, newValues) => {
    const updatedValues = newValues || [];
    setSelectedValues(updatedValues);
  };

  useEffect(() => {
    dispatch(fetchInstituteState());
  }, []);

  useEffect(() => {
    setSelectedValues([]);
  }, [alignment]);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
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
      // const data = dummyDomainList.map((domain) => ({
      //   ...domain,
      //   status: domain.status === "Active" ? "1" : "0",
      // }));
      // setDoaminList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingList(false); // Set loading to false when fetching is complete (success or failure)
    }
  };

  useEffect(() => {
    if (academy_id) {
      fetchData(academy_id);
    }
  }, [academy_id]);

  //   const handleOpenDomainConfirmationModal = () => {
  //     setIsDomainConfirmationModalOpen(true);
  //   };

  //   const handleCloseDomainConfirmationModal = () => {
  //     setIsDomainConfirmationModalOpen(false);
  //   };

  const handleOpenConfirmationModal = (action) => {
    setCurrentAction(action);
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
  };

  const handleConfirmAction = () => {
    if (currentAction === "update") {
      const updatedData = doaminList.map((domain) => {
        const isSelected = selectedColleges.includes(domain.institute_id);

        return {
          institute_id: domain.institute_id,
          status: isSelected ? "1" : "0",
        };
      });
      
      setSelectedAssignItems({ data: updatedData, academy_id: academy_id });
      setSearchTerm("");
    } else if (currentAction === "save") {
      // Perform delete action
      // ...
    }

    handleCloseConfirmationModal();
  };

  const handleCancel = () => {
    onClose();
    setSelectedColleges([]);
    setSearchTerm("");
  };

  const handleSelectAll = () => {
    const allIds = doaminList.map((domain) => domain.institute_id);
    const updatedSelectedColleges =
      selectedColleges.length === allIds.length ? [] : allIds;

    setSelectedColleges(updatedSelectedColleges);
    const updatedList = doaminList.map((domain) => ({
      ...domain,
      status: updatedSelectedColleges.includes(domain.institute_id) ? "1" : "0",
    }));
    setDoaminList(updatedList);
  };

  useEffect(() => {
    const activeList = doaminList?.filter((domain) => domain.status === "1");
    const activeDomainIds = activeList?.map((domain) => domain.institute_id);
    setSelectedColleges(activeDomainIds);
  }, [doaminList]);

  const handleCheckboxChange = (institue_id) => {
    const selectedDomain = doaminList.find(
      (item) => item.institute_id === institue_id
    );
    // if (selectedDomain.domain_email === false || instStatus) {
    // If domain_email is false, update the status directly
    const updatedColleges = [...selectedColleges];
    const domainIndex = updatedColleges.indexOf(selectedDomain.institute_id);

    if (domainIndex > -1) {
      updatedColleges.splice(domainIndex, 1);
    } else {
      updatedColleges.push(selectedDomain.institute_id);
    }

    setDoaminList((prevDoaminList) =>
      prevDoaminList.map((item) =>
        item.institute_id === selectedDomain.institute_id
          ? {
              ...item,
              status: updatedColleges.includes(item.institute_id) ? "1" : "0",
            }
          : item
      )
    );
    // } else {
    //   handleOpenDomainConfirmationModal();
    // }
  };

  const filterDomains = () => {
    return doaminList?.filter((domain) =>
      domain.institute_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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
          {drawerData?.name}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Close Drawer"
          onClick={handleClose}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Container
        sx={{
          [theme.breakpoints.down("sm")]: {
            maxWidth: "600px",
          },
          [theme.breakpoints.up("sm")]: {
            width: "600px",
          },
          my: 1,
        }}
      >
        <FormControl fullWidth>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <ToggleButtonGroup
              color="info"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
              sx={{ height: "25px" }}
            >
              <ToggleButton
                value="all"
                disabled={
                  (alignment === "state" && selectedValues.length !== 0) ||
                  (alignment === "institute" && selectedValues.length !== 0)
                }
              >
                All
              </ToggleButton>
              <ToggleButton
                disabled={
                  alignment === "institute" && selectedValues.length !== 0
                }
                value="state"
              >
                State
              </ToggleButton>
              <ToggleButton
                value="institute"
                disabled={alignment === "state" && selectedValues.length !== 0}
              >
                Institute
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {(alignment === "state" || alignment === "institute") && (
            <Autocomplete
              multiple
              value={selectedValues || []}
              onChange={handleStateChange}
              sx={{ my: 0.5 }}
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
          )}
          {alignment === "institute" && (
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
                      <Typography>{domain?.institute_name}</Typography>
                      {/* <Typography sx={{ ml: 1 }}>{college.status}</Typography> */}
                    </Box>
                  ))
                )}
              </Paper>
            </>
          )}
        </FormControl>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            pt: 2,
            mr: 1.1,
          }}
        >
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="info"
            onClick={() => handleOpenConfirmationModal("update")}
          >
            Update
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
        {/* <DomainConfirmationModal
            isOpen={isDomainConfirmationModalOpen}
            onClose={handleCloseDomainConfirmationModal}
            setInstStatus={setInstStatus}
            // onConfirm={handleDomainConfirmation}
            // domain={selectedDomain}
            institueId={institue_id}
          /> */}
      </Container>
    </Drawer>
  );
};

export default PostJobDrawer;
