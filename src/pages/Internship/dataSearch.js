import * as React from "react";
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useState, useEffect } from "react";

import { Button, Box, useMediaQuery } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { InternshipService } from "../../services/dataService";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDomainList } from "../../store/Slices/dashboard/domainListSlice";

const statusNames = [
  "Applied",
  "Shortlisted",
  "Inprogress",
  "Provisional",
  "Completed",
  "Rejected",
  "Pending"
];

export const DataSearch = ({
  setTableData,
  setColumns,
  page,
  tableData,
  setPagination,
  loading,
  setLoading,
  setErrorMsg,
  setTableLoading,
  pageSize,
  setPageSize,
  setExportData,
  setExportId,
  setInternshipId,
}) => {
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
  const [status, setStatus] = React.useState("Applied");
  const [isLoadingDomainList, setIsLoadingDomainList] = useState(true);
  const [isLoadingCohortList, setIsLoadingCohortList] = useState(true);

  // const dispatch = useDispatch();
  // const isLoadingDomainList = useSelector((state)=> state.domainList.isLoading)
  // const domainList = useSelector((state)=> state.domainList.domainList)
  //
  const domainId = domainList[0].domain_id;
  const cohortId = cohortList[0].cohort_id;

  useEffect(() => {
    // dispatch(fetchDomainList())
    async function fetchData() {
      try {
        const response = await InternshipService.domain_list();
        const domainListWithAll = [
          { domain_id: 0, domain_name: "-- All Domain --" }, // Add the "All Domain" option
          ...response.data, // Add the fetched domains
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
          ...response.data.cohort_list, // Add the fetched domains
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
    domain_id: selectedDomainId,
    cohort_id: selectedCohortId,
    is_status: selectedStatusId,
    page: page,
    page_size: pageSize,
  };


  const handleSearch = async () => {
    setExportData({ domainList: domainList, cohortList: cohortList });
    setExportId(dataSearch);

    if (
      dataSearch.cohort_id !== null &&
      dataSearch.domain_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setInternshipId(dataSearch.cohort_id);
      const updateData = { ...dataSearch, page: 1, page_size: 10 };
      setLoading(true);
      try {
        const response = await InternshipService.intern_filter(updateData);
        setTableData();
        const fetchedData = response.data.internships; // Assuming your API response contains the data
        // Add an index (row number) column to each row
        const dataWithIndex = fetchedData.map((rowData, index) => ({
          ...rowData,
          sl: index + 1, // Adding 1 to start the index from 1
        }));

        setTableData(dataWithIndex);
        setPagination(response.data);
        setPageSize(response.data.page_size);

        const columnWidths = {};
        if (dataWithIndex.length > 0) {
          dataWithIndex.forEach((rowData) => {
            Object.keys(rowData).forEach((key) => {
              // Calculate the width of the cell content for this column
              const cellContent = String(rowData[key]);
              const cellContentWidth = cellContent.length * 8; // You can adjust the factor as needed

              // Update the maximum width for this column
              if (!columnWidths[key] || cellContentWidth > columnWidths[key]) {
                columnWidths[key] = cellContentWidth;
              }
            });
          });

          const formatDate = (inputDate) => {
            const date = new Date(inputDate);
            const day = date.toLocaleString("en-IN", { day: "2-digit" });
            const month = date.toLocaleString("en-IN", { month: "short" });
            const year = date.toLocaleString("en-IN", { year: "numeric" });
            return `${day} ${month} ${year}`;
          };
          // Define dynamic columns, including the index column only once
          const dynamicColumns = [
            // {
            //   field: "sl",
            //   headerName: "#", // Header label for the index column
            //   flex: "0 0 30px", // You can adjust the width as needed
            //   minWidth: 30, // Minimum width
            // },
            ...Object.keys(dataWithIndex[0])
              .map((key) => {
                if (key !== "sl") {
                  return {
                    field: key,
                    headerName: key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" "),
                    flex: columnWidths[key] ? `0 0 ${columnWidths[key]}px` : 1, // Set flex based on maximum content width or default to 1
                    minWidth: columnWidths[key],
                    valueFormatter: (params) => {
                      if (params.value && key === "started_at") {
                        return formatDate(params.value);
                      }
                      return params.value || " NA";
                    },
                    // maxWidth: 300,
                  };
                }
                return null; // Skip adding another index column
              })
              .filter(Boolean), // Filter out null entries (skipped index column)
          ];

          setColumns(dynamicColumns);
          setErrorMsg("");
        } else {
          setErrorMsg("Student record not found");
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
  // setTableLoading(true);

  const handlePageChange = async (dataSearch) => {
    if (
      dataSearch.cohort_id !== null &&
      dataSearch.domain_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setTableLoading(true);

      try {
        const response = await InternshipService.intern_filter(dataSearch);
        setTableData();
        const fetchedData = response.data.internships; // Assuming your API response contains the data

        // Add an index (row number) column to each row
        const dataWithIndex = fetchedData.map((rowData, index) => ({
          ...rowData,
          sl: index + 1, // Adding 1 to start the index from 1
        }));

        setTableData(dataWithIndex);
        setPagination(response.data);
        setPageSize(response.data.page_size);
        const columnWidths = {};
        if (dataWithIndex.length > 0) {
          dataWithIndex.forEach((rowData) => {
            Object.keys(rowData).forEach((key) => {
              // Calculate the width of the cell content for this column
              const cellContent = String(rowData[key]);
              const cellContentWidth = cellContent.length * 8; // You can adjust the factor as needed

              // Update the maximum width for this column
              if (!columnWidths[key] || cellContentWidth > columnWidths[key]) {
                columnWidths[key] = cellContentWidth;
              }
            });
          });

          // Define dynamic columns, including the index column only once
          const dynamicColumns = [
            // {
            //   field: "sl",
            //   headerName: "#", // Header label for the index column
            //   flex: "0 0 30px", // You can adjust the width as needed
            //   minWidth: 30, // Minimum width
            // },
            ...Object.keys(dataWithIndex[0])
              .map((key) => {
                if (key !== "sl") {
                  return {
                    field: key,
                    headerName: key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" "),
                    flex: columnWidths[key] ? `0 0 ${columnWidths[key]}px` : 1, // Set flex based on maximum content width or default to 1
                    minWidth: columnWidths[key],
                    // maxWidth: 300,
                  };
                }
                return null; // Skip adding another index column
              })
              .filter(Boolean), // Filter out null entries (skipped index column)
          ];

          setColumns(dynamicColumns);
          setErrorMsg("");
        }
      } catch (error) {
        setErrorMsg("Unable to fetch data. Please try again later.");
        setTableLoading(false);
        setTableData([]);
        console.error("Error fetching data:", error);
      } finally {
        setTableLoading(false);
      }
    }
  };

  useEffect(() => {
    // Automatically trigger the 'handlePageChange' function
    if (tableData) {
      handlePageChange(dataSearch);
    }
  }, [page]);

  useEffect(() => {
    // Automatically trigger the 'handlePageChange' function
    if (tableData) {
      handlePageChange({ ...dataSearch, page: 1 });
    }
  }, [pageSize]);

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
              {/* <Grid item xs={12} sm={6} md={3}>
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
              </Grid> */}

              <Grid item xs={12} sm={12} md={7}>
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
                      sx={{
                        width: "100%",
                        // borderRadius: "5px 0 0 5px", // Specify the border-radius directly
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px 0 0 5px !important", // Apply the styles with higher specificity
                        },
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
    </Box>
  );
};
