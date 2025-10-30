import React, { useEffect, useState } from "react";
import CommonDataSearch from "../../common/dataSearch/CommonDataSearch";
import CountCard from "../../common/card/CountCard";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import CustomTable from "./CustomTable";
import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCohortList } from "../../../store/Slices/dashboard/cohortInternshipSlice";
import {
  fetchStaffInstStatistics,
  fetchStaffInstitute,
  fetchStaffInstitution,
  setSelected,
} from "../../../store/Slices/staff/staffInstSlice";

const StaffInstitute = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState("");
  const domainList = useSelector((state) => state.domainList.domainList);
  const cohortList = useSelector((state) => state.cohortInternship.cohortList);
  const isTableLoading = useSelector(
    (state) => state.staffInstitute.isInternLoading
  );
  const selected = useSelector((state) => state.staffInstitute.selected);
  const isFilterEmpty = filterName === "";

  const instStatistics = useSelector(
    (state) => state.staffInstitute.statistics
  );
  const instituteList = useSelector(
    (state) => state.staffInstitute.instituteList
  );

  const internshipData = useSelector(
    (state) => state.staffInstitute.internship
  );

  const errorMsg = useSelector((state) => state.staffInstitute.errorMsg);

  const statusValue = [
    { value: 0, label: "-- All Status --" },
    { value: 1, label: "Completed" },
    { value: 2, label: "Partial" },
    { value: 3, label: "Pending" },
  ];

  // const [selected, setSelected] = useState({});
  const [rowPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchDomainList());
    dispatch(fetchCohortList());
    dispatch(fetchStaffInstitute());
    dispatch(fetchStaffInstStatistics());
    // Set up an interval to dispatch fetchStaffInstStatistics() every 30 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchStaffInstStatistics());
    }, 300000);
    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (internshipData?.internships?.length === 0) {
      setFilterName("");
    }
  }, [internshipData, filterName]);

  useEffect(() => {
    if (Object.values(selected).some((value) => value !== 0)) {
      dispatch(
        fetchStaffInstitution({
          page: page,
          page_size: rowPerPage,
          institute_id: selected?.Institute,
          cohort_id: selected?.Cohort,
          search_text: filterName,
          domain_id: selected?.Domain,
          is_status: selected?.Status,
        })
      );
      if (internshipData.internships == []) {
        setFilterName("");
      }
    }
  }, [selected, rowPerPage, page, dispatch]);

  const handleSearch = () => {
    // setPage(1)
    if (
      Object.values(selected).some((value) => value !== 0 && !isFilterEmpty)
    ) {
      dispatch(
        fetchStaffInstitution({
          page: 1,
          page_size: rowPerPage,
          institute_id: selected?.Institute,
          cohort_id: selected?.Cohort,
          search_text: filterName,
          domain_id: selected?.Domain,
          is_status: selected?.Status,
        })
      );
    }
  };

  const updateInstituteList = [
    { label: "-- Select Institute --", value: 0 },
    ...instituteList?.map((item) => ({
      value: item.institue_id,
      label: item.institute_name,
    })),
  ];

  const updateStatistics = instStatistics?.map((item) => ({
    ...item,
    icon: "ci:dummy-square",
  }));

  const updateCohortList = [
    { label: "-- Select Cohort --", value: 0 },
    ...cohortList?.map((item) => ({
      value: item.cohort_id,
      label: item.cohort_name,
    })),
  ];

  const updateDomainList = domainList?.map((item) => ({
    value: item.domain_id,
    label: item.domain_name,
  }));

  const data = [
    { label: "Institute", option: updateInstituteList },
    { label: "Domain", option: updateDomainList },
    { label: "Cohort", option: updateCohortList },
    { label: "Status", option: statusValue },
  ];

  const TABLE_HEAD = [
    { id: "sl_no", label: "Sl.", alignRight: false },
    { id: "full_name", label: "Full Name", alignRight: false },
    { id: "domain", label: "Domain", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    { id: "roll_no", label: "Roll No", alignRight: false },
    { id: "branch", label: "Branch", alignRight: false },
    { id: "status", label: "Status", alignRight: false },
    { id: "", label: "Action" },
  ];

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: colors.blueAccent[300], mb: 1 }}
      >
        Welcome back to Institute !
      </Typography>
      <CountCard data={updateStatistics} />
      <CommonDataSearch
        data={data}
        setSelected={setSelected}
        isTableLoading={isTableLoading}
      />
      {internshipData?.internships && (
        <CustomTable
          tableData={internshipData?.internships}
          TABLE_HEAD={TABLE_HEAD}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          rowsPerPage={internshipData?.page_size}
          page={internshipData?.page}
          count={internshipData?.total_pages}
          isTableLoading={isTableLoading}
          setFilterName={setFilterName}
          filterName={filterName}
          handleSearch={handleSearch}
        />
      )}
      {errorMsg && (
        <Card
          sx={{
            bgcolor: colors.blueAccent[900],
            height: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            my: 2,
          }}
        >
          <Typography variant="h4" fontWeight={600} px={5}>
            {errorMsg}
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default StaffInstitute;
