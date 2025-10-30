import * as React from "react";
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Skeleton,
  // IconButton,
  // Switch,
  Menu,
} from "@mui/material";
import { useState, useEffect } from "react";

import { Button, Box, useMediaQuery } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { InternshipService } from "../../../services/dataService";
// import { Icon } from "@iconify/react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDomainList } from "../../store/Slices/dashboard/domainListSlice";

const statusNames = [
  { id: 6, name: "-- All Status --" },

  { id: 0, name: "Applied" },
  { id: 1, name: "Approved" },
  { id: 5, name: "Rejected" },
];
// ["-- All Status --", "Approved", "Applied", "Rejected"];
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
  setRefresh,
  refresh,
  setExportData,
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [showSearchOptions, setShowSearchOptions] = useState(!isSmallScreen);
  const [domainList, setDomainList] = useState([
    { domain_id: "no_data", domain_name: "-- no domain available --" },
  ]);
  const [domain, setDomain] = useState("-- no domain available --");
  // const [cohort, setCohort] = React.useState("-- no cohort available --");
  const [status, setStatus] = React.useState("Applied");
  const [isLoadingDomainList, setIsLoadingDomainList] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = useState(""); // New email state

  // const dispatch = useDispatch();
  // const isLoadingDomainList = useSelector((state)=> state.domainList.isLoading)
  // const domainList = useSelector((state)=> state.domainList.domainList)
  //

  const handleAction = (action) => {
    // Handle your action based on the selected menu item
    setSelectedOption(action);

    // Close the menu
    setAnchorEl(null);
  };

  const domainId = domainList[0].domain_id;

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

  const toggleSearchOptions = () => {
    setShowSearchOptions(!showSearchOptions);
  };

  const selectedDomainId =
    parseInt(
      domainList.find((item) => item.domain_name === domain)?.domain_id
    ) || 0;

  // const selectedStatusIndex = statusNames.indexOf(status);
  const selectedStatusIndex = statusNames.find(
    (item) => item.name === status
  )?.id;

  const selectedStatusId =
    selectedStatusIndex >= 0 ? selectedStatusIndex : null;

  const dataSearch = {
    domain_id: selectedDomainId,
    is_status: selectedStatusId,
    page: page,
    page_size: pageSize,
    search: email,
  };

  const handleSearch = async () => {
    setExportData({ domainList: domainList });

    const dataSearch = {
      domain_id: selectedDomainId,
      is_status: selectedStatusId,
      page: 1, // Start from the first page
      page_size: pageSize, // Keep this as per your requirements
      search: email, // Include the email search term
    };

    if (
      dataSearch.cohort_id !== null &&
      dataSearch.domain_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setLoading(true);
      setTableData([]); // Clear existing table data

      try {
        // Get the first page of data
        const response = await InternshipService.intern_approval_list(
          dataSearch
        );
        let fetchedData = response.data.internships;
        const totalRecords = response.data.total_records; // Assuming the total record count is provided
        const totalPages = Math.ceil(totalRecords / pageSize); // Calculate total pages

        // Loop through remaining pages if more data exists
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          const nextPageDataSearch = {
            ...dataSearch,
            page: currentPage, // Update the page number for the subsequent requests
          };
          const nextPageResponse = await InternshipService.intern_approval_list(
            nextPageDataSearch
          );
          fetchedData = [...fetchedData, ...nextPageResponse.data.internships]; // Aggregate data
        }

        // Add an index (row number) column to each row
        const dataWithIndex = fetchedData.map((rowData, index) => ({
          ...rowData,
          sl: index + 1, // Adding 1 to start the index from 1
        }));

        setTableData(dataWithIndex);
        setPagination({ totalRecords, totalPages, pageSize }); // Update pagination info
        setPageSize(pageSize);

        const columnWidths = {};
        if (dataWithIndex.length > 0) {
          dataWithIndex.forEach((rowData) => {
            Object.keys(rowData).forEach((key) => {
              const cellContent = String(rowData[key]);
              const cellContentWidth = cellContent.length * 8; // Adjust the factor as needed

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

          const dynamicColumns = [
            {
              field: "sl",
              headerName: "#",
              flex: "0 0 10px",
              minWidth: 10,
            },
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
                    flex: columnWidths[key] ? `0 0 ${columnWidths[key]}px` : 1,
                    minWidth: columnWidths[key],
                    valueFormatter: (params) => {
                      if (params.value && key === "started_at") {
                        return formatDate(params.value);
                      }
                      return params.value || " NA";
                    },
                  };
                }
                return null;
              })
              .filter(Boolean),
            {
              field: "action",
              headerName: "Action",
              flex: "0 0 100px",
              minWidth: 100,
              renderCell: (params) => (
                <div>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ height: 20 }}
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    {selectedOption
                      ? `Selected: ${selectedOption}`
                      : "Approval"}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleAction("approve")}>
                      Approve
                    </MenuItem>
                    <MenuItem onClick={() => handleAction("reject")}>
                      Reject
                    </MenuItem>
                  </Menu>
                </div>
              ),
            },
          ];

          setColumns(dynamicColumns);
          setErrorMsg("");
        } else {
          setErrorMsg("Record not found");
        }
      } catch (error) {
        setErrorMsg("Unable to fetch data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // setTableLoading(true);

  const handlePageChange = async (dataSearch) => {
    if (
      dataSearch.domain_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setTableLoading(true);

      try {
        const response = await InternshipService.intern_approval_list(
          dataSearch
        );
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
            {
              field: "sl",
              headerName: "#", // Header label for the index column
              flex: "0 0 10px", // You can adjust the width as needed
              minWidth: 10, // Minimum width
            },
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
            {
              field: "action",
              headerName: "Action",
              flex: "0 0 100px",
              minWidth: 100,
              renderCell: (params) => (
                <div>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ height: 20 }}
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget); // Set anchorEl to the button element
                    }}
                  >
                    {selectedOption
                      ? `Selected: ${selectedOption}`
                      : "Approval"}{" "}
                    {/* Display the selected option or default text */}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleAction("approve")}>
                      Approve
                    </MenuItem>
                    <MenuItem onClick={() => handleAction("reject")}>
                      Reject
                    </MenuItem>
                  </Menu>
                </div>
              ),
            },
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
    if (tableData) {
      handlePageChange(dataSearch);
    }
  }, [page]);

  useEffect(() => {
    if (tableData) {
      handlePageChange({ ...dataSearch, page: 1 });
    }
  }, [pageSize]);

  useEffect(() => {
    if (tableData && dataSearch) {
      handleSearch();
    }
  }, [refresh]);

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
              <Typography>Internship Approval</Typography>
            </Box>
            {showSearchOptions ? <ArrowDropUp /> : <ArrowDropDown />}
          </Button>
        )}
        {showSearchOptions && (
          <Box display="flex" mt={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={4}>
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
              <Grid item xs={12} sm={12} md={4}>
                <TextField
                  label="Enter Email"
                  size="small"
                  color="info"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                {isLoadingDomainList ? (
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
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px 0 0 5px !important", // Apply the styles with higher specificity
                        },
                      }}
                    >
                      {statusNames.map((name) => (
                        <MenuItem key={name.name} value={name.name}>
                          {name.name}
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
                        !domainList.length ||
                        !!domainId
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
