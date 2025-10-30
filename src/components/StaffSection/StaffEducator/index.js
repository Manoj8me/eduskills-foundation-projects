import React, { useEffect, useState } from "react";
import CommonDataSearch from "../../common/dataSearch/CommonDataSearch";
import CountCard from "../../common/card/CountCard";
import { Box, Button, Card, Typography, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import { tokens } from "../../../theme";
import CustomTable from "./CustomTable";
import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCohortList } from "../../../store/Slices/dashboard/cohortInternshipSlice";
import {
  fetchStaffEduStatistics,
  fetchStaffInstitute,
  fetchStaffEducator,
  setSelected,
} from "../../../store/Slices/staff/staffEduSlice";
import CustomAddDrawer from "../../common/drawer/CustomAddDrawer";

const StaffEducator = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const domainList = useSelector((state) => state.domainList.domainList);
  const cohortList = useSelector((state) => state.cohortInternship.cohortList);
  const isTableLoading = useSelector(
    (state) => state.staffEducator.isInternLoading
  );
  const errorMsg = useSelector((state) => state.staffEducator.errorMsg);

  const selected = useSelector((state) => state.staffEducator.selected);

  const instStatistics = useSelector((state) => state.staffEducator.statistics);
  const instituteList = useSelector(
    (state) => state.staffEducator.instituteList
  );

  const internshipData = useSelector((state) => state.staffEducator.internship);

  const designList = useSelector(
    (state) => state.educatorDesignation.data.data
  );

  // const instituteList = useSelector(
  //   (state) => state.adminInstList.instituteList
  // );

  // const updateDesignList = designList?.map((item) => {
  //   return {
  //     value: item.design_id,
  //     label: item.role_name,
  //   };
  // });

  const updateInstList = instituteList?.map((item) => {
    return {
      value: item.institue_id,
      label: item.institute_name,
    };
  });

  const updateDomainList = domainList?.map((item) => {
    return {
      value: item.domain_id,
      label: item.domain_name,
    };
  });

  const categoryList = [
    { value: 2, label: "EDP" },
    { value: 3, label: "FDP" },
  ];

  const configField = [
    // {
    //   name: "institute_id",
    //   label: "Institute Name",
    //   type: "select",
    //   options: updateInstList,
    // },

    {
      name: "category",
      label: "Category",
      type: "select",
      options: categoryList,
    },

    // {
    //   name: "state",
    //   label: "State",
    //   type: "select",
    //   // options: ,
    // },
    {
      name: "institution",
      label: "Institute Name",
      type: "select",
      options: updateInstList,
    },
    {
      name: "domain",
      label: "Domain",
      type: "select",
      options: updateDomainList,
    },
    { name: "educator_name", label: "Educator Name", type: "text" },
    //{ name: "faculty_name", label: "Faculty Name", type: "text" },
    { name: "email", label: "Email ID", type: "text", variant: "email" },
    {
      name: "mobile",
      label: "Mobile No.",
      type: "number",
      variant: "mobileNo",
    },
    {
      name: "design_id",
      label: "Designation",
      type: "text",
      //options: updateDesignList,
    },

    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        {
          value: "male",
          label: "Male",
        },
        { value: "female", label: "Female" },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "completed", label: "completed" },
        { value: "pending", label: "pending" },
      ],
    },
    // {
    //   name: "status",
    //   label: "Status",
    //   type: "switch",
    //   variant: "activeInactive",
    // },
    // {
    //   name: "is_spoc",
    //   label: "Is Spoc",
    //   type: "switch",
    //   variant: "yesNo",
    // },
    // {
    //   name: "status",
    //   label: "Status",
    //   type: "switch",
    //   variant: "activeInactive",
    // },
  ];

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleAddConfirm = () => {
    setIsWorking(!isWorking);
    setIsDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

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
    dispatch(fetchStaffEduStatistics());
    // Set up an interval to dispatch fetchStaffInstStatistics() every 30 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchStaffEduStatistics());
    }, 300000);
    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (Object.values(selected).some((value) => value !== 0)) {
      dispatch(
        fetchStaffEducator({
          page: page,
          page_size: rowPerPage,
          institute_id: selected?.Institute,
          cohort_id: selected?.Batch,
          domain_id: selected?.Course,
          is_status: selected?.Status,
        })
      );
    }
  }, [selected, rowPerPage, page]);

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
    { label: "-- Select Batch --", value: 0 },
    ...cohortList?.map((item) => ({
      value: item.cohort_id,
      label: item.cohort_name,
    })),
  ];

  // const updateDomainList = domainList?.map((item) => ({
  //   value: item.domain_id,
  //   label: item.domain_name,
  // }));

  const data = [
    { label: "Institute", option: updateInstituteList },
    { label: "Course", option: updateDomainList },
    { label: "Batch", option: updateCohortList },
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
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: colors.blueAccent[300], mb: 1 }}
        >
          Welcome back to Educator !
        </Typography>
        <Button
          variant="contained"
          color="info"
          size="small"
          sx={{
            textTransform: "initial",
            maxHeight: 28,
          }}
          startIcon={<Icon icon="fluent:person-add-20-regular" />}
          onClick={handleDrawerOpen}
        >
          Add Educator
        </Button>
      </Box>
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

      <CustomAddDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        config={{
          title: "Add Educator",
          fields: configField,
          saveButtonText: "Add Educator", // Optional, default is "Add"
          cancelButtonText: "Cancel", // Optional, default is "Cancel"
          modalAction: "add", // Optional, default is "add"
        }}
        // onAdd={handleAddItem}
        //refresh={refresh}
        onConfirm={handleAddConfirm}
      />
    </Box>
  );
};

export default StaffEducator;
