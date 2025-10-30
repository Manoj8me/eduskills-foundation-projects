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
import { EducatorService } from "../../services/dataService";

const statusNames = ["-- All Status --", "Continue", "Completed", "Dropout"];

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
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [showSearchOptions, setShowSearchOptions] = useState(!isSmallScreen);
  const [academyList, setAcademyList] = useState([
    { academy_id: "no_data", academy_brand: "-- no academy available --" },
  ]);
  const [academy, setAcademy] = useState("-- no academy available --");
  const [batchList, setBatchList] = useState([
    { batch_id: "no_data", batch_name: "-- no batch available --" },
  ]);
  const [batch, setBatch] = React.useState("-- no batch available --");
  const [status, setStatus] = React.useState("-- All Status --");
  const [isLoadingDomainList, setIsLoadingDomainList] = useState(true);
  const [isLoadingCohortList, setIsLoadingCohortList] = useState(true);
  //
  const domainId = academyList[0].academy_id;
  const cohortId = batchList[0].batch_id;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await EducatorService.educator_academy();
        const domainListWithAll = [
          { academy_id: 0, academy_brand: "-- All Academy --" }, // Add the "All Domain" option
          ...response.data, // Add the fetched domains
        ];
        setIsLoadingDomainList(false);
        setAcademyList(domainListWithAll);
        setAcademy("-- All Academy --");
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
        const response = await EducatorService.educator_batch();
        const cohortListWithAll = [
          { batch_id: 0, batch_name: "-- All Batch --" }, // Add the "All Domain" option
          ...response.data, // Add the fetched domains
        ];

        setBatchList(cohortListWithAll);
        setIsLoadingCohortList(false);
        setBatch("-- All Batch --");
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

  //

  const selectedAcademyId =
    parseInt(
      academyList.find((item) => item.academy_brand === academy)?.academy_id
    ) || 0;
  const selectedBatchId =
    parseInt(batchList.find((item) => item.batch_name === batch)?.batch_id) ||
    0;

  const selectedStatusIndex = statusNames.indexOf(status);

  const selectedStatusId =
    selectedStatusIndex >= 0 ? selectedStatusIndex : null;

  const dataSearch = {
    academy_id: selectedAcademyId,
    batch_id: selectedBatchId,
    is_status: selectedStatusId,
    page: page,
    page_size: pageSize,
  };

  // const handleSearch = async () => {
  //   if (
  //     dataSearch.academy_id !== null &&
  //     dataSearch.batch_id !== null &&
  //     dataSearch.page !== null &&
  //     dataSearch.is_status !== null
  //   ) {
  //     setLoading(true);
  //     try {
  //       const response = await EducatorService.educator_program(dataSearch);
  //       setTableData();
  //       const fetchedData = response.data.data; // Assuming your API response contains the data

  //       // Add an index (row number) column to each row
  //       const dataWithIndex = fetchedData?.map((rowData, index) => ({
  //         ...rowData,
  //         sl: index + 1, // Adding 1 to start the index from 1
  //       }));

  //       setTableData(dataWithIndex);
  //       setPagination(response.data);
  //       setPageSize(response.data.page_size);
  //       const columnWidths = {};
  //       if (dataWithIndex.length > 0) {
  //         dataWithIndex.forEach((rowData) => {
  //           Object.keys(rowData).forEach((key) => {
  //             // Calculate the width of the cell content for this column
  //             const cellContent = String(rowData[key]);
  //             const cellContentWidth = cellContent.length * 8; // You can adjust the factor as needed

  //             // Update the maximum width for this column
  //             if (!columnWidths[key] || cellContentWidth > columnWidths[key]) {
  //               columnWidths[key] = cellContentWidth;
  //             }
  //           });
  //         });

  //         const formatDate = (inputDate) => {
  //           const date = new Date(inputDate);
  //           const day = date.toLocaleString("en-IN", { day: "2-digit" });
  //           const month = date.toLocaleString("en-IN", { month: "short" });
  //           const year = date.toLocaleString("en-IN", { year: "numeric" });

  //           return `${day} ${month} ${year}`;
  //         };

  //         // Define dynamic columns, including the index column only once
  //         const dynamicColumns = [
  //           {
  //             field: "sl",
  //             headerName: "#", // Header label for the index column
  //             flex: "0 0 20px", // You can adjust the width as needed
  //             minWidth: 20, // Minimum width
  //           },
  //           ...Object.keys(dataWithIndex[0])
  //             ?.map((key) => {
  //               if (key !== "sl" && key !== "edp_id") {
  //                 return {
  //                   field: key,
  //                   headerName: key
  //                     .split("_")
  //                     .map(
  //                       (word) => word.charAt(0).toUpperCase() + word.slice(1)
  //                     )
  //                     .join(" "),
  //                   flex: columnWidths[key] ? `0 0 ${columnWidths[key]}px` : 1,
  //                   minWidth: columnWidths[key],
  //                   valueFormatter: (params) => {
  //                     if (
  //                       params.value &&
  //                       (key === "start_date" || key === "end_date")
  //                     ) {
  //                       return formatDate(params.value);
  //                     }
  //                     return params.value || "_";
  //                   },
  //                 };
  //               }
  //               return null;
  //             })
  //             .filter(Boolean),
  //         ];

  //         setColumns(dynamicColumns);
  //         setErrorMsg("");
  //       } else {
  //         setErrorMsg("Record not found");
  //       }
  //     } catch (error) {
  //       setErrorMsg("Oops! Please try again later.");
  //       setTableData();
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const handleSearch = async () => {
    if (
      dataSearch.academy_id !== null &&
      dataSearch.batch_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setLoading(true);
      try {
        const response = await EducatorService.educator_program(dataSearch);
        setTableData();
        const fetchedData = response.data.data; // Assuming your API response contains the data

        // Add an index (row number) column to each row
        const dataWithIndex = fetchedData?.map((rowData, index) => ({
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

          const dynamicColumns = [
            {
              field: "sl",
              headerName: "#",
              flex: "0 0 20px",
              minWidth: 20,
            },
            ...Object.keys(dataWithIndex[0])
              ?.map((key) => {
                if (key !== "sl" && key !== "edp_id") {
                  const headerLabel = key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  const headerWidth = headerLabel.length * 8;

                  const contentWidth = dataWithIndex.reduce(
                    (maxWidth, rowData) => {
                      const cellContent = String(rowData[key]);
                      const cellContentWidth = cellContent.length * 8;
                      return Math.max(maxWidth, cellContentWidth);
                    },
                    headerWidth
                  );

                  return {
                    field: key,
                    headerName: headerLabel,
                    flex: "0 0 " + Math.max(headerWidth, contentWidth) + "px",
                    minWidth: Math.max(headerWidth, contentWidth),
                    valueFormatter: (params) => {
                      if (
                        params.value &&
                        (key === "start_date" || key === "end_date")
                      ) {
                        return formatDate(params.value);
                      }
                      return params.value || "_";
                    },
                  };
                }
                return null;
              })
              .filter(Boolean),
          ];

          setColumns(dynamicColumns);
          setErrorMsg("");
        } else {
          setErrorMsg("Record not found");
        }
      } catch (error) {
        setErrorMsg("Oops! Please try again later.");
        setTableData();
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Define the handlePageChange function inside the useEffect
  const handlePageChange = async () => {
    if (
      dataSearch.academy_id !== null &&
      dataSearch.batch_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setTableLoading(true);
      try {
        const response = await EducatorService.educator_program(dataSearch);
        setTableData();
        const fetchedData = response.data.data; // Assuming your API response contains the data

        // Add an index (row number) column to each row
        const dataWithIndex = fetchedData?.map((rowData, index) => ({
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
            //   flex: "0 0 20px", // You can adjust the width as needed
            //   minWidth: 20, // Minimum width
            // },
            ...Object.keys(dataWithIndex[0])
              ?.map((key) => {
                if (key !== "sl" && key !== "edp_id") {
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
      handlePageChange();
    }
  }, [page, pageSize]);

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
              <Typography>Educator</Typography>
            </Box>
            {showSearchOptions ? <ArrowDropUp /> : <ArrowDropDown />}
          </Button>
        )}
        {showSearchOptions && (
          <Box display="flex" mt={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={4}>
                {isLoadingDomainList ? (
                  <Skeleton width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    label="Academy"
                    select
                    size="small"
                    color="info"
                    value={academy}
                    onChange={(event) => setAcademy(event.target.value)}
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
                    {academyList?.map((name) => (
                      <MenuItem
                        key={name.academy_id}
                        value={name.academy_brand}
                        sx={{ whiteSpace: "normal" }}
                      >
                        {name.academy_brand}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                {isLoadingCohortList ? (
                  <Skeleton width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    label="Batch"
                    select
                    size="small"
                    color="info"
                    value={batch}
                    onChange={(event) => setBatch(event.target.value)}
                    sx={{ width: "100%" }}
                  >
                    {batchList?.map((name) => (
                      <MenuItem key={name.batch_id} value={name.batch_name}>
                        {name.batch_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={4}
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
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px 0 0 5px !important", // Apply the styles with higher specificity
                        },
                      }}
                    >
                      {statusNames?.map((name) => (
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
                        !academyList.length ||
                        !academyList.length ||
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
