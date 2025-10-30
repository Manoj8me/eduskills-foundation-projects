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
import {
  InternshipService,
  TalentConnectService,
} from "../../../services/dataService";
// import { Icon } from "@iconify/react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDomainList } from "../../store/Slices/dashboard/domainListSlice";

const statusNames = ["-- All Status --", "Approved", "Applied", "Rejected"];

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
  onSelect,
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [showSearchOptions, setShowSearchOptions] = useState(!isSmallScreen);
  const [domainList, setDomainList] = useState([
    { domain_id: "no_data", domain_name: "-- no domain available --" },
  ]);
  const [domain, setDomain] = useState("-- no domain available --");
  // const [cohort, setCohort] = React.useState("-- no cohort available --");
  const [status, setStatus] = React.useState("-- All Status --");
  const [isLoadingDomainList, setIsLoadingDomainList] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

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
        // const response = await InternshipService.domain_list();
        const domainListWithAll = [
          { domain_id: 0, domain_name: "-- All Domain --" }, // Add the "All Domain" option
          // ...response.data, // Add the fetched domains
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

  // const selectedDomainId =
  //   parseInt(
  //     domainList.find((item) => item.domain_name === domain)?.domain_id
  //   ) || 0;

  // const selectedStatusIndex = statusNames.indexOf(status);

  // const selectedStatusId =
  //   selectedStatusIndex >= 0 ? selectedStatusIndex : null;

  const dataSearch = {
    page: page || 1,
    page_size: pageSize || 10,
    company_id: onSelect?.company?.id || null,
    jd_id: onSelect?.job_title?.id || null,
    is_active: onSelect?.status?.id || null,
  };

  useEffect(() => {
    if (
      onSelect?.company?.id &&
      onSelect?.job_title?.id &&
      onSelect?.status?.id
    ) {
      handlePageChange({ ...dataSearch, page: 1 });
    }
  }, [onSelect?.company?.id, onSelect?.job_title?.id, onSelect?.status?.id]);

  const handleSearch = async () => {
    if (dataSearch.page !== null && dataSearch.is_status !== null) {
      setLoading(true);
      try {
        // intern_filter
        const response = await TalentConnectService.appliedStudent(dataSearch);
        setTableData();
        const fetchedData = response.data.data; // Assuming your API response contains the data
        // Add an index (row number) column to each row
        setTableData(fetchedData);
        setPagination(response.data);
        setPageSize(response.data.page_size);

        setErrorMsg("");
        setRefresh(false);
      } catch (error) {
        console.error(error);
        setErrorMsg("Unable to fetch data. Please try again later.");
        setTableData();
        setRefresh(false);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setRefresh(false);
      }
    }
  };
  // setTableLoading(true);

  const handlePageChange = async (dataSearch) => {
    if (dataSearch.page !== null && dataSearch.is_status !== null) {
      setTableLoading(true);
      try {
        const response = await TalentConnectService.appliedStudent(dataSearch);
        setTableData();
        const fetchedData = response.data.data; // Assuming your API response contains the data
        setTableData(fetchedData);
        setPagination(response.data);
        setPageSize(response.data.page_size);

        // setColumns(dynamicColumns);
        setErrorMsg("");
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

  useEffect(() => {
    if (dataSearch.page && dataSearch.page_size) {
      handleSearch();
    }
  }, []);

  return <Box display="flex" alignItems="center" mt={1}></Box>;
};
