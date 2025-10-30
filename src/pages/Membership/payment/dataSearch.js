import * as React from "react";
import {
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";

import { Box, useMediaQuery } from "@mui/material";
import { InternshipService } from "../../../services/dataService";

const statusNames = ["-- All Status --", "Completed", "Partial", "Pending"];

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

  //

  useEffect(() => {
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
    if (
      dataSearch.cohort_id !== null &&
      dataSearch.domain_id !== null &&
      dataSearch.page !== null &&
      dataSearch.is_status !== null
    ) {
      setLoading(true);
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

          const formatDate = (inputDate) => {
            const date = new Date(inputDate);
            const day = date.toLocaleString("en-IN", { day: "2-digit" });
            const month = date.toLocaleString("en-IN", { month: "short" });
            const year = date.toLocaleString("en-IN", { year: "numeric" });
            return `${day} ${month} ${year}`;
          };
          // Define dynamic columns, including the index column only once
          const dynamicColumns = [
            {
              field: "sl",
              headerName: "#", // Header label for the index column
              flex: "0 0 30px", // You can adjust the width as needed
              minWidth: 30, // Minimum width
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
          setErrorMsg("Record not found");
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
              flex: "0 0 30px", // You can adjust the width as needed
              minWidth: 30, // Minimum width
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
    handleSearch()
  }, []);

  useEffect(() => {
    // Automatically trigger the 'handlePageChange' function
    if (tableData) {
      handlePageChange();
    }
  }, [page, pageSize]);

  return (
    <Box display="flex" alignItems="center" mt={1}>
      <Grid container flexDirection="column">

  
      </Grid>
    </Box>
  );
};
