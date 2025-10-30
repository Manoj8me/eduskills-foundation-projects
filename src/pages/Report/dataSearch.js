import * as React from "react";
import {
  Grid,
  TextField,
  Popover,
  useTheme,
  Typography,
  MenuItem,
  CircularProgress,
  Skeleton,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Edit, Delete } from "@mui/icons-material";

import { Button, Box, useMediaQuery } from "@mui/material";
import {
  ArrowDropDown,
  ArrowDropUp,
  DateRangeOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { InternshipService } from "../../services/dataService";
import CommonDrawer from "../../components/common/drawer/CommonDrawer";
import DeleteModal from "../../components/common/modal/DeleteModal";

const statusNames = ["-- All Status --", "Completed", "Partial", "Pending"];

export const DataSearch = ({
  setTableData,
  setColumns,
  page,
  setPagination,
  loading,
  setLoading,
  setErrorMsg,
  setTableLoading,
  column,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [showSearchOptions, setShowSearchOptions] = useState(!isSmallScreen);
  const [domainList, setDomainList] = useState([
    { domain_id: "no_data", domain_name: "-- no domain available --" },
  ]);
  const [domain, setDomain] = useState("-- no domain available --");
  const [cohortList, setCohortList] = useState([
    { cohort_id: "no_data", cohort_name: "-- no cohort available --" },
  ]);
  const [cohort, setCohort] = React.useState("-- no cohort available --");
  const [status, setStatus] = React.useState("-- All Status --");
  const [isLoadingDomainList, setIsLoadingDomainList] = useState(true);
  const [isLoadingCohortList, setIsLoadingCohortList] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerData, setDrawerData] = useState();

  const toggleDrawer = (item) => {
    setDrawerData(item)
    setIsOpen(!isOpen);
  };

  //
  const domainId = domainList[0].domain_id;
  const cohortId = cohortList[0].cohort_id;

  const handleDelete = () => {

  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await InternshipService.domain_list();
        const domainListWithAll = [
          { domain_id: 0, domain_name: "-- All Domain --" }, // Add the "All Domain" option
          ...response.data.data, // Add the fetched domains
        ];
        setIsLoadingDomainList(false);
        setDomainList(domainListWithAll);
        setDomain("-- All Domain --");
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingDomainList(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await InternshipService.cohort_list();

        const cohortListWithAll = [
          { cohort_id: 0, cohort_name: "-- All Cohort --" }, // Add the "All Domain" option
          ...response.data.data, // Add the fetched domains
        ];

        setCohortList(cohortListWithAll);
        setIsLoadingCohortList(false);
        setCohort("-- All Cohort --");
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingCohortList(false);
      }
    }

    fetchData();
  }, []);

  const toggleSearchOptions = () => {
    setShowSearchOptions(!showSearchOptions);
  };

  const handleSelect = (ranges) => {
    setSelectedDates([ranges.selection]);
  };

  const handleTextFieldClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  //
  const startDate = selectedDates[0].startDate;
  const endDate = selectedDates[0].endDate;

  // Get time format (milliseconds) for start and end dates
  const selectedStartDateMillis = startDate.getTime();
  const selectedEndDateMillis = endDate.getTime();

  const selectedDomainId =
    parseInt(
      domainList.find((item) => item.domain_name === domain)?.domain_id
    ) || 0;
  const selectedCohortId =
    parseInt(
      cohortList.find((item) => item.cohort_name === cohort)?.cohort_id
    ) || 0;

  const selectedStatusIndex = statusNames.indexOf(status);

  const selectedStatusId =
    selectedStatusIndex >= 0 ? selectedStatusIndex : null;

  const dataSearch = {
    date_from: selectedStartDateMillis,
    date_to: selectedEndDateMillis,
    domain_id: selectedDomainId,
    cohort_id: selectedCohortId,
    is_status: selectedStatusId,
    page: page,
  };

  const actionsColumn = {
    field: "actions",
    headerName: "Actions",
    minWidth: 100,
    flex:1,
    sortable: false,
    renderCell: (params) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* Edit button */}
        <IconButton color="success" onClick={() => toggleDrawer(params.row)}>
          <Edit />
        </IconButton>
        {/* Delete button */}
        <IconButton color="error" onClick={() => setIsDeleteModalOpen(true)}>
          <Delete />
        </IconButton>
      </div>
    ),
  };

  const handleSearch = async () => {
    if (
      dataSearch.cohort_id !== null &&
      dataSearch.domain_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setLoading(true);
      try {
        const response = await InternshipService.intern_filter(dataSearch);
        const fetchedData = response.data.data; // Assuming your API response contains the data
        setTableData(fetchedData);
        setPagination(response.data?.pagination);

        const columnWidths = {};
        if (fetchedData.length > 0) {
          fetchedData.forEach((rowData) => {
            Object.keys(rowData).forEach((key) => {
              // Calculate the width of the cell content for this column
              const cellContent = String(rowData[key]);
              const cellContentWidth = cellContent.length * 8; // You can adjust the factor as needed

              // Update the maximum width for this column
              if (!columnWidths[key] || cellContentWidth > columnWidths[key]) {
                columnWidths[key] = cellContentWidth;
              }
            });
            const dynamicColumns = Object.keys(fetchedData[0]).map((key) => ({
              field: key,
              headerName: key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              flex: columnWidths[key] ? `0 0 ${columnWidths[key]}px` : 1, // Set flex based on maximum content width or default to 1
              minWidth: columnWidths[key],
              // maxWidth: 300,
            }));

            setColumns([...dynamicColumns, actionsColumn]);
            setErrorMsg("");
          });
        }
      } catch (error) {
        setErrorMsg("Unable to fetch data. Please try again later.");
        setTableData();
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = async () => {
    if (
      dataSearch.cohort_id !== null &&
      dataSearch.domain_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setTableLoading(true);
      try {
        const response = await InternshipService.intern_filter(dataSearch);
        const fetchedData = response.data.data; // Assuming your API response contains the data
        setTableData(fetchedData);
        setPagination(response.data?.pagination);

        const columnWidths = {};
        if (fetchedData.length > 0) {
          fetchedData.forEach((rowData) => {
            Object.keys(rowData).forEach((key) => {
              // Calculate the width of the cell content for this column
              const cellContent = String(rowData[key]);
              const cellContentWidth = cellContent.length * 8; // You can adjust the factor as needed

              // Update the maximum width for this column
              if (!columnWidths[key] || cellContentWidth > columnWidths[key]) {
                columnWidths[key] = cellContentWidth;
              }
            });
            const dynamicColumns = Object.keys(fetchedData[0]).map((key) => ({
              field: key,
              headerName: key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              flex: columnWidths[key] ? `0 0 ${columnWidths[key]}px` : 1, // Set flex based on maximum content width or default to 1
              minWidth: columnWidths[key],
              // maxWidth: 300,
            }));

            setColumns(dynamicColumns);
            setErrorMsg("");
          });
        }
      } catch (error) {
        setErrorMsg("Unable to fetch data. Please try again later.");
        setTableLoading(false);
        setTableData();
      } finally {
        setTableLoading(false);
      }
    }
  };

  return (
    <Box display="flex" alignItems="center" mt={1}>
      <Grid container flexDirection="column">
        {isSmallScreen && (
          <Button
            color={"info"}
            variant="outlined"
            onClick={toggleSearchOptions}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Box>
              <Typography>Internship</Typography>
            </Box>
            {showSearchOptions ? <ArrowDropUp /> : <ArrowDropDown />}
          </Button>
        )}
        {showSearchOptions && (
          <Box display="flex" mt={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={3}>
                {isLoadingDomainList && isLoadingCohortList ? (
                  <Skeleton width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    label="Select Date Range"
                    color="info"
                    onClick={handleTextFieldClick}
                    value={`${selectedDates[0].startDate.toDateString()} to ${selectedDates[0].endDate.toDateString()}`}
                    size="small"
                    sx={{
                      width: "100%",
                      cursor: "pointer",
                    }}
                    InputProps={{
                      endAdornment: (
                        <DateRangeOutlined
                          sx={{
                            color: colors.grey[500], // Customize the color of the icon
                          }}
                        />
                      ),
                    }}
                  />
                )}

                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClosePopover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <DateRange
                    ranges={selectedDates}
                    onChange={handleSelect}
                    editableDateInputs={true}
                    minDate={new Date("2020-01-01")} // 1st January 2020
                    maxDate={
                      new Date(
                        selectedDates[0].startDate.getTime() +
                          365 * 24 * 60 * 60 * 1000
                      )
                    }
                  />
                </Popover>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                {isLoadingDomainList ? (
                  <Skeleton width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    label="Domain"
                    select
                    size="small"
                    color="info"
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    sx={{ width: "100%" }}
                    SelectProps={{
                      // Use SelectProps instead of MenuProps
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300, // Set the maxHeight to 200px
                            maxWidth: 300,
                          },
                        },
                      },
                    }}
                  >
                    {domainList?.map((name) => (
                      <MenuItem
                        key={name.domain_id}
                        value={name.domain_name}
                        sx={{ whiteSpace: "normal" }}
                      >
                        {name.domain_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                {isLoadingCohortList ? (
                  <Skeleton width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    label="Cohort"
                    select
                    size="small"
                    color="info"
                    value={cohort}
                    onChange={(event) => setCohort(event.target.value)}
                    sx={{ width: "100%" }}
                  >
                    {cohortList?.map((name) => (
                      <MenuItem key={name.cohort_id} value={name.cohort_name}>
                        {name.cohort_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                {isLoadingCohortList && isLoadingDomainList ? (
                  <Skeleton width="100%" height={40} animation="wave" />
                ) : (
                  <>
                    <TextField
                      label="Status"
                      select
                      size="small"
                      color="info"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      // sx={{width: "100%",borderRadius: "5px 0px 0px 5px" }}
                      style={{
                        width: "100%",
                        borderRadius: "5px 0px 0px 5px !important",
                      }}
                    >
                      {statusNames.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      variant="contained"
                      color={"info"}
                      sx={{
                        borderRadius: "0px 5px 5px 0px",
                        width: "80%",
                      }}
                      onClick={handleSearch}
                      disabled={
                        loading ||
                        isLoadingDomainList ||
                        isLoadingCohortList ||
                        !domainList.length ||
                        !cohortList.length ||
                        domainId ||
                        cohortId === "no_data"
                      }
                    >
                      {loading ? ( // Conditionally render loader or button text
                        <CircularProgress size={24} color="inherit" /> // Loader
                      ) : (
                        <Typography fontWeight={600}>Search</Typography> // Button text
                      )}
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </Grid>
      <CommonDrawer isOpen={isOpen} onClose={toggleDrawer} width={600} drawerData={drawerData}/>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </Box>
  );
};
