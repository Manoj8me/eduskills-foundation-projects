import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { Helmet } from "react-helmet-async";
import Widgets from "./Widgets";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import CustomTable from "./CustomTable";
import { DataSearch } from "./dataSearch";

const InternshipApproval = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tableData, setTableData] = useState();
  const [column, setColumns] = useState();
  //
  const [pagination, setPagination] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [refresh, setRefresh] = useState(false)
  const [exportData, setExportData] = useState({});

  const handleSearchResults = (searchResults) => {
    setTableData(searchResults); // Update tableData with search results
  };
 
  const TABLE_HEAD = [
    { id: "full_name", label: "Full Name", alignRight: false },
    { id: "domain", label: "Domain", alignRight: false },
    // { id: "aicte_id", label: "AICTE Id", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    // { id: "started_at", label: "Atarted At", alignRight: false },
    { id: "roll_no", label: "Roll No", alignRight: false },
    { id: "branch", label: "Branch", alignRight: false },
    { id: "passout_year", label: "Passout Year", alignRight: false },
    // { id: "cohort", label: "Cohort", alignRight: false },
    { id: "status", label: "Status", alignRight: false },
    { id: "", label: "Action" },
  ];


  return (
    <>
      <Helmet>
        <title> Internship Approval | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        <Box sx={{ display: "flex",mb:2, justifyContent: "space-between" }}>
          {/* <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
          >
            Welcome back to Internship Approval !
          </Typography> */}
          {/* <Button
            variant="contained"
            size="small"
            color="info"
            sx={{ height: 25 }}
            startIcon={<Icon icon={"icon-park-solid:back"} height={12} />}
            component={Link} // Use Link as the component
            to="/internship"
          >
            Internship
          </Button> */}
        </Box>

        <Box px={4} bgcolor={colors.blueAccent[900]}></Box>
        {/* <Widgets setErrorMsg={setErrorMsg} refresh={refresh} setRefresh={setRefresh}/> */}
        <Box m="0px auto" position="relative">
          <Box>
            <DataSearch
              setTableData={setTableData}
              setColumns={setColumns}
              tableData={tableData}
              page={page}
              setPagination={setPagination}
              loading={loading}
              setLoading={setLoading}
              setErrorMsg={setErrorMsg}
              setTableLoading={setTableLoading}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setRefresh = {setRefresh}
              refresh = {refresh}
              setExportData={setExportData}
            />
          </Box>
      
         
        </Box>
        {tableData?.length > 0 && (
          <CustomTable
            TABLE_HEAD={TABLE_HEAD}
            tableData={tableData}
            setRowsPerPage={setPageSize}
            rowsPerPage={pageSize}
            count={pagination?.total_pages}
            page={pagination?.page -1}
            setPage={setPage}
            tableLoading={tableLoading}
            setRefresh = {setRefresh}
            refresh = {refresh}
            exportData={exportData}
            handleSearchResults={handleSearchResults}
          />
        )}
         {errorMsg && (
            <Box
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
              <Typography variant="h4" fontWeight={600}>
                {errorMsg}
              </Typography>
            </Box>
          )}
      </Container>
    </>
  );
};

export default InternshipApproval;
