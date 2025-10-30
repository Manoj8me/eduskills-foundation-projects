// CustomModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Checkbox,
  CircularProgress,
  InputAdornment,
  Paper,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";
import { TalentConnectService } from "../../../services/dataService";

import { tokens } from "../../../theme";

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
const PostJobModal = ({
  isOpen,
  onClose,
  onSave,
  type,
  drawerData,
  setSelectedAssignItems,
  jobTitleList,
  setJobTitleList,
  setSelectedJobTitles,
  setSelectedStates,
  setSelectedCollege,
  alignment,
  colleges,
  title,
  states,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [doaminList, setDoaminList] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [instituteList, setInstituteList] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState(
    colleges?.length > 0 ? colleges : []
  );

  const dispatch = useDispatch();
  const stateList = useSelector((state) => state.statePackage.instituteState);
  const stateData = stateList?.map((state) => ({
    value: state.state_id,
    label: state.state_name,
  }));

  const handleStateChange = (event, newValues) => {
    const updatedValues = newValues || [];
    setSelectedState(updatedValues);
  };

  const fltrStateData = stateData?.filter((state) =>
    states?.includes(state.value)
  );

  useEffect(() => {
    if (colleges?.length > 0 && selectedColleges !== colleges) {
      setSelectedColleges(colleges);
      const fltrInstituteData = instituteList?.filter((state) =>
        colleges?.includes(state.institute_id)
      );
    }

    if (states?.length > 0 && fltrStateData) {
      setSelectedState(fltrStateData);
    }

    if (title && selectedJobTitle !== title) {
      setSelectedJobTitle(title);
    }
  }, [states, colleges, title]);

  const fetchInstitute = async () => {
    if (selectedState.length > 0) {
      const stateIds = { states: selectedState.map((item) => item.value) };

      try {
        const res = await TalentConnectService.institute_by_state(stateIds);
        const data = res.data.data;
        const updateData = data.map((item) => ({ ...item, status: "0" }));

        setInstituteList(updateData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    // Check if there are colleges to update
    if (colleges && colleges.length > 0) {
      // Check if the institutes need updating
      const needUpdate = instituteList.some((institute) =>
        colleges.includes(institute.institute_id)
      );

      if (needUpdate) {
        // Filter the institutes in instituteList that match the colleges
        const updatedInstituteList = instituteList.map((institute) => {
          if (colleges.includes(institute.institute_id)) {
            // If the institute_id is in the colleges array, update the status to "1"
            return { ...institute, status: "1" };
          }
          return institute;
        });

        // Update the state with the modified instituteList
        setInstituteList(updatedInstituteList);
      }
    }
  }, [instituteList.length > 0]);

  useEffect(() => {
    fetchInstitute();
  }, [selectedState.length]);
  useEffect(() => {
    dispatch(fetchInstituteState());
  }, []);
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

  const handleSelectAll = () => {
    const allIds = instituteList.map((domain) => domain.institute_id);
    const updatedSelectedColleges =
      selectedColleges.length === allIds.length ? [] : allIds;

    setSelectedColleges(updatedSelectedColleges);
    const updatedList = instituteList.map((domain) => ({
      ...domain,
      status: updatedSelectedColleges.includes(domain.institute_id) ? "1" : "0",
    }));
    setInstituteList(updatedList);
  };

  useEffect(() => {
    const activeList = instituteList?.filter((domain) => domain.status === "1");
    const activeDomainIds = activeList?.map((domain) => domain.institute_id);
    setSelectedColleges(activeDomainIds);
  }, [instituteList]);

  const handleCheckboxChange = (institue_id) => {
    const selectedDomain = instituteList.find(
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

    setInstituteList((prevDoaminList) =>
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
    return instituteList?.filter((domain) =>
      domain.institute_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const fetchEducatorList = async () => {
    try {
      const response = await TalentConnectService.jd();
      const updateJdData = response?.data?.data
        .map((jd) =>
          jd.status === "Active"
            ? {
                jd_id: jd.jd_id,
                job_title: jd.job_title,
              }
            : null
        )
        .filter((jd) => jd !== null);

      setJobTitleList(updateJdData);
      //   setEducator(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      //   setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
    }
  };

  useEffect(() => {
    fetchEducatorList();
  }, []);

  const handleSave = () => {
    switch (type) {
      case "jobTitle":
        onSave(selectedJobTitle);
        setSelectedJobTitles(selectedJobTitle); // Replace with your logic for jobTitle
        break;
      case "state":
        onSave(selectedState);
        setSelectedStates(selectedState); // Replace with your logic for state
        break;
      case "institute":
        onSave(selectedColleges);
        setSelectedCollege(selectedColleges); // Replace with your logic for institute
        break;
      default:
        console.error("Invalid type:", type);
        break;
    }
    onClose();
  };

  const renderContent = () => {
    switch (type) {
      case "jobTitle":
        return (
          <Autocomplete
            size="small"
            fullWidth
            options={jobTitleList?.map((job) => job?.job_title)}
            value={selectedJobTitle}
            onChange={(event, newValue) => setSelectedJobTitle(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Job Title" />
            )}
          />
        );
      case "state":
        return (
          <Autocomplete
            multiple
            fullWidth
            value={selectedState}
            onChange={handleStateChange}
            sx={{ mb: 0.5 }}
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
        );
      case "institute":
        return (
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
                  checked={selectedColleges.length === instituteList.length}
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
                      onChange={() => handleCheckboxChange(domain.institute_id)}
                    />
                    <Typography>{domain?.institute_name}</Typography>
                  </Box>
                ))
              )}
            </Paper>
          </>
        );
      // Add more cases for different types of content
      default:
        return null;
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 1,
          p: 2,
        }}
      >
        <Typography variant="h5" mb={2}>
          {type}
        </Typography>
        {renderContent()}
        <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
          <Button
            size="small"
            color="success"
            variant="outlined"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            sx={{ ml: 1 }}
            color="error"
            size="small"
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PostJobModal;
