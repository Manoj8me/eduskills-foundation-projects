import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Popover,
  Select,
  TextField,
  Tooltip,
  useTheme,
  MenuItem,
  Autocomplete,
  Button,
} from "@mui/material";
import { tokens } from "../../../../theme";
import DomainWise from "./DomainWise";
import StateWise from "./StateWise";
import InstituteWise from "./InstituteWise";
import { Icon } from "@iconify/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { StaffService } from "../../../../services/dataService";
import CommonModal from "../../../common/modal/CommonModal";
import { fetchCohortList } from "../../../../store/Slices/dashboard/cohortInternshipSlice";
import { useDispatch, useSelector } from "react-redux";
import SelectWithSearch from "../../../common/SelectWithSearch";

const Status = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [domainData, setDomainData] = useState([]);
  const [stateData, setStateData] = useState([]);

  const [isLoadingDomain, setIsLoadingDomain] = useState(false);
  const [isLoadingInstitute, setIsLoadingInstitute] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [errDomain, setErrDomain] = useState("");
  const [errInstitute, setErrInstitute] = useState("");
  const [errState, setErrState] = useState("");
  const [instituteData, setInstituteData] = useState([]);
  const [instituteList, setInstituteList] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const cohortList = useSelector((state) => state.cohortInternship);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedInstOption, setSelectedInstOption] = useState({
    label: "",
    id: 0,
  });

  const filterInstitute = instituteList.map((inst) => ({
    label: inst.institute_name,
    id: inst.institue_id,
  }));

  const handleChanges = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCloseModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmDownload = () => {
    exportData(value);
    handleCloseModal();
  };

  //---------------------------------------------------------------

  useEffect(() => {
    dispatch(fetchCohortList());
  }, [dispatch]);

  useEffect(() => {
    setSelectedOption(cohortList?.activeCohort || "");
  }, [cohortList]);

  const fetchData = async () => {
    setIsLoadingDomain(true);
    setErrDomain("");
    setDomainData([]);
    const inst_id = selectedInstOption?.id || 0;
    if (selectedOption) {
      try {
        const { data } = await StaffService.staff_dashboard_domain(
          selectedOption,
          inst_id
        );

        setDomainData(data.summery);
        setIsLoadingDomain(false);
      } catch (error) {
        console.error(error);
        setErrDomain("Unable to fetch domain data. Please try again later.");
        setIsLoadingDomain(false);
      } finally {
        setIsLoadingDomain(false);
        setHasMounted(true);
      }
    }
  };
  useEffect(() => {
    if (!hasMounted) {
      fetchData();
    }
  }, [selectedOption]);

  const fetchInstituteData = async () => {
    setIsLoadingInstitute(true);
    setErrInstitute("");
    setInstituteData([]);
    if (selectedOption) {
      try {
        const { data } = await StaffService.staff_dashboard_institution(
          selectedOption
        );

        setInstituteData(data.summery);
        setIsLoadingInstitute(false);
      } catch (error) {
        console.error(error);
        setErrInstitute(
          "Unable to fetch institution data. Please try again later."
        );
        setIsLoadingInstitute(false);
      } finally {
        setIsLoadingInstitute(false);
      }
    }
  };
  useEffect(() => {
    if (!hasMounted) {
      fetchInstituteData();
    }
  }, [selectedOption]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await StaffService.staff_institute();

        setInstituteList(data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const fetchStateData = async () => {
    setIsLoadingState(true);
    setErrState("");
    setStateData([]);
    if (selectedOption) {
      try {
        const { data } = await StaffService.staff_dashboard_state(
          selectedOption
        );

        setStateData(data.summery);
        setIsLoadingState(false);
      } catch (error) {
        console.error(error);
        setErrState("Unable to fetch state data. Please try again later.");
        setIsLoadingState(false);
      } finally {
        setIsLoadingState(false);
      }
    }
  };
  useEffect(() => {
    if (!hasMounted) {
      fetchStateData();
    }
  }, [selectedOption]);

  //------------------------------------------------------------------

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term
  };
  const handleSearchIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchPopoverClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  const handleFilterIconClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleFilterPopoverClose = () => {
    setAnchorEl2(null);
  };
  const openSearchPopover = Boolean(anchorEl);
  const openfilterPopover = Boolean(anchorEl2);

  const filteredData =
    value === 0 ? domainData : value === 1 ? instituteData : stateData;
  // Filter data based on search term
  const filteredResults = filteredData.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportData = (value) => {
    const downloadData =
      value === 0 ? domainData : value === 1 ? instituteData : stateData;
    exportToExcel(downloadData);
  };

  const exportToExcel = (downloadData) => {
    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Function to capitalize the first letter of each word
    const capitalizeFirstLetter = (str) => {
      return str.replace(/(?:^|\s|_)\S/g, (match) => match.toUpperCase());
    };

    // Add header row with underscores removed and headers capitalized
    const headerRow = worksheet.addRow(
      Object.keys(downloadData[0]).map((header) =>
        capitalizeFirstLetter(header.replace(/_/g, " "))
      )
    );
    // Make the header row bold
    headerRow.font = { bold: true };

    // Add data rows
    downloadData.forEach((data) => {
      const values = Object.values(data);
      worksheet.addRow(values);
    });
    //
    // const todayDate = new Date().toISOString().split("T")[0];
    const todayDate = new Date().toLocaleDateString("en-GB");
    // Save the workbook as a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // Save the blob using FileSaver.js
      saveAs(
        blob,
        "EduSkills-" +
          (value === 0
            ? "Domain-Wise-Report-Cohort" +
                selectedOption +
                "-" +
                selectedInstOption?.label || ""
            : value === 1
            ? "Institute-Wise-Report-Cohort" + selectedOption
            : "State-Wise-Report-Cohort" + selectedOption) +
          "-" +
          todayDate +
          ".xlsx"
      );
    });
  };

  return (
    <Paper elevation={5} sx={{ px: 2, pb: 2, bgcolor: colors.blueAccent[800] }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          // indicatorColor={colors.greenAccent[300]}
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: colors.blueAccent[400] },
            "& .MuiTab-root": { minWidth: "auto", fontSize: 10 },
          }}
        >
          <Tab
            // disabled={domainData.length === 0}
            label="Domain"
            sx={{
              color: colors.blueAccent[300],
            }}
          />
          <Tab
            // disabled={instituteData.length === 0}
            label="Institute"
            sx={{
              color: colors.blueAccent[300],
            }}
          />
          <Tab
            // disabled={stateData.length === 0}
            label="State"
            sx={{
              color: colors.blueAccent[300],
              // textTransform:'capitalize'
            }}
          />
        </Tabs>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* ----------------------------------------------------------- */}
          <Tooltip
            title={`${value === 0 ? "Filter Domain" : ""}`}
            placement="top"
          >
            <span>
              <IconButton
                // disabled={value !== 0}
                color="info"
                onClick={handleFilterIconClick}
              >
                <Icon icon="bi:filter-square-fill" height={16} />
              </IconButton>
            </span>
          </Tooltip>
          <Popover
            open={openfilterPopover}
            anchorEl={anchorEl2}
            onClose={handleFilterPopoverClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box px={2} py={2}>
              {/*  Label, options, setValue, borderRadius, isLoading */}
              {value === 0 && (
                <Autocomplete
                  value={selectedInstOption || { label: "", id: 0 }}
                  disabled={isLoadingDomain || value !== 0}
                  onChange={(event, newValue) => {
                    setSelectedInstOption(newValue);
                  }}
                  options={filterInstitute}
                  getOptionLabel={(option) => option?.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Institute"
                      variant="outlined"
                      disabled={isLoadingDomain || value !== 0}
                      size="small"
                      sx={{ minWidth: 200 }}
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 0.5,
                }}
              >
                <FormControl sx={{ minWidth: 60 }}>
                  <Select
                    value={selectedOption}
                    size="small"
                    color="info"
                    disabled={isLoadingDomain}
                    sx={{ maxHeight: 28, fontSize: 10, mx: 0, px: 0 }}
                    onChange={handleChanges}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {cohortList?.cohortList?.map((item) => (
                      <MenuItem
                        key={item.cohort_id}
                        value={item.cohort_id}
                        style={{ textAlign: "center", fontSize: 12 }}
                      >
                        {item.cohort_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  color="info"
                  variant="outlined"
                  size="small"
                  disabled={isLoadingDomain}
                  sx={{ ml: 1 }}
                  startIcon={<Icon icon="uil:search" />}
                  onClick={() => {
                    handleFilterPopoverClose();
                    // value === 0
                    //   ? fetchData()
                    //   : value === 1
                    //   ? fetchInstituteData()
                    //   : fetchStateData();
                    fetchData();
                    fetchInstituteData();
                    fetchStateData();
                  }}
                >
                  Search
                </Button>
              </Box>
              {/* <TextField
                variant="standard"
                size="small"
                color="info"
                fullWidth
                placeholder={`Search ${
                  value === 0 ? "Domain" : value === 1 ? "Institute" : "State"
                }...`}
                onChange={handleSearchChange}
                value={searchTerm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        color={colors.blueAccent[300]}
                        icon="fa-solid:search"
                      />
                    </InputAdornment>
                  ),
                }}
              /> */}
            </Box>
          </Popover>
          {/* ----------------------------------------------------------- */}

          <Tooltip
            title={`Search ${
              value === 0 ? "Domain" : value === 1 ? "Institute" : "State"
            }`}
            placement="top"
          >
            <span>
              <IconButton
                disabled={
                  value === 0
                    ? domainData.length === 0
                    : value === 1
                    ? instituteData.length === 0
                    : stateData.length === 0
                }
                color="info"
                onClick={handleSearchIconClick}
              >
                <Icon icon="mdi:text-box-search" />
              </IconButton>
            </span>
          </Tooltip>
          <Popover
            open={openSearchPopover}
            anchorEl={anchorEl}
            onClose={handleSearchPopoverClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box px={2} py={0.5}>
              <TextField
                variant="standard"
                size="small"
                color="info"
                fullWidth
                placeholder={`Search ${
                  value === 0 ? "Domain" : value === 1 ? "Institute" : "State"
                }...`}
                onChange={handleSearchChange}
                value={searchTerm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        color={colors.blueAccent[300]}
                        icon="fa-solid:search"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Popover>

          <Tooltip
            title={`Export ${
              value === 0 ? "Domain" : value === 1 ? "Institute" : "State"
            }`}
            placement="top"
          >
            <span>
              <IconButton
                disabled={
                  value === 0
                    ? domainData.length === 0
                    : value === 1
                    ? instituteData.length === 0
                    : stateData.length === 0
                }
                color="info"
                onClick={() => setIsConfirmationModalOpen(true)}
              >
                <Icon icon="material-symbols:export-notes" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <CommonModal
          open={isConfirmationModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDownload}
          action={"Confirmation"}
          extMsg={`to download ${
            value === 0 ? "Domain" : value === 1 ? "Institute" : "State"
          }-wise report`}
        />
      </Box>
      <div>
        {value === 0 && (
          <DomainWise
            data={filteredResults}
            isLoading={isLoadingDomain}
            errDomain={errDomain}
          />
        )}
        {value === 1 && (
          <InstituteWise
            data={filteredResults}
            isLoading={isLoadingInstitute}
            errInstitute={errInstitute}
          />
        )}
        {value === 2 && (
          <StateWise
            data={filteredResults}
            isLoading={isLoadingState}
            errState={errState}
          />
        )}
      </div>
    </Paper>
  );
};

export default Status;
