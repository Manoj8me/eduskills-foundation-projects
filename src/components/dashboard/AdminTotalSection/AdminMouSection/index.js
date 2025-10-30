import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useTheme,
} from "@mui/material";
import CountCardSection from "./CountCardSection";
import AcademySection from "./AcademyCard";
import CostomSearch from "../../../common/search/costomSearch";

import { AdminService } from "../../../../services/dataService";
import { useDispatch, useSelector } from "react-redux";
import { fetchCohortList } from "../../../../store/Slices/dashboard/cohortInternshipSlice";
import { Icon } from "@iconify/react";
import { tokens } from "../../../../theme";

const AdminMouSection = () => {
  const [viewType, setViewType] = useState(2); // Placeholder for the selected view type
  const [instituteList, setInstituteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const dispatch = useDispatch();
  const cohortList = useSelector((state) => state.cohortInternship);
  const openfilterPopover = Boolean(anchorEl2);
  // const [selected, setSelected] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [total, setTotal] = useState([]);
  const [data, setData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const handleSearch = (searchQuery) => {
    if (viewType === 1) {
      // Filter instituteList based on search query
      const filteredList = instituteList.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // Update the filtered list
      setInstituteList(filteredList);
    }
    // If viewType is not 0, you can implement other search logic here
  };

  const handleFilterPopoverClose = () => {
    setAnchorEl2(null);
  };

  const handleChanges = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFilterIconClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  useEffect(() => {
    setSelectedOption(cohortList?.activeCohort || "");
  }, [cohortList]);

  const fetchCohortSummery = async () => {
    setLoading(true);
    try {
      const res = await AdminService.admin_dashboard_cohort_summery(
        selectedOption,
        viewType
      );
      
      setTotal(res.data.total);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOption && viewType) {
      fetchCohortSummery();
    }
  }, [selectedOption, viewType]);

  useEffect(() => {
    dispatch(fetchCohortList());
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{ py: 1, px: 1.5, bgcolor: colors.background[100] }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <CountCardSection total={total} loading={loading}/>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            {/* <CostomSearch
              onSearch={handleSearch}
              setRefresh={setRefresh}
              height={24}
            /> */}
            <Box></Box>
            <Box>
              <Tooltip title="Filter Cohort" placement="top">
                <span>
                  <IconButton
                    // disabled={value !== 0}
                    sx={{ mr: 0.5 }}
                    color="info"
                    onClick={handleFilterIconClick}
                  >
                    <Icon icon="bi:filter-square-fill" height={16} />
                  </IconButton>
                </span>
              </Tooltip>
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={handleViewTypeChange}
                aria-label="page size"
                sx={{ height: "25px" }}
              >
                <ToggleButton
                  color="info"
                  value={2}
                  aria-label="2"
                  sx={{ fontSize: 10 }}
                >
                  Academy
                </ToggleButton>
                <ToggleButton
                  color="info"
                  value={1}
                  aria-label="1"
                  sx={{ fontSize: 10 }}
                >
                  State
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <AcademySection viewType={viewType} data={data} loading={loading} />
        </Grid>
      </Grid>
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
        <Box px={2} py={1.5}>
          {/*  Label, options, setValue, borderRadius, isLoading */}

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
                // disabled={isLoadingDomain}
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

            {/* <Button
              color="info"
              variant="outlined"
              size="small"
              // disabled={isLoadingDomain}
              sx={{ ml: 1 }}
              startIcon={<Icon icon="uil:search" />}
              onClick={() => {
                handleFilterPopoverClose();
                // fetchData();
                // fetchInstituteData();
                // fetchStateData();
              }}
            >
              Search
            </Button> */}
          </Box>
        </Box>
      </Popover>
    </Paper>
  );
};

export default AdminMouSection;
