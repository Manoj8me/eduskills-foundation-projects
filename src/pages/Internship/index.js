import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  // Divider,
  InputBase,
  Pagination,
  Typography,
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";

import { DataSearch } from "./dataSearch";
import Widgets from "./Widgets";
import TogglePage from "../../components/common/toggleButton/togglePage";
import { Link } from "react-router-dom";
import ExportModal from "./exportData";
import { useSelector } from "react-redux";
import StaffInternship from "../../components/StaffSection/StaffInternship";

const CustomToolbar = ({ searchQuery, onSearchChange }) => (
  <GridToolbar>
    <Box
      display="flex"
      backgroundColor="#1976D2"
      borderRadius="3px"
      justifyContent="space-between"
      height={26}
      width={300} // Adjust the width as needed
    >
      <InputBase
        sx={{ ml: 1, fontSize: "14px" }}
        placeholder="Search..."
        value={searchQuery}
        onChange={onSearchChange}
      />
      <Box display="flex" pr={1} alignItems="center">
        <Search sx={{ width: 15, color: "white" }} />
      </Box>
    </Box>
    {/* You can add more custom toolbar components here */}
    {/* For example, a button or additional filters */}
    <Button variant="contained" size="small" color="warning">
      Custom Button
    </Button>
  </GridToolbar>
);

const Internship = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState();

  const [column, setColumns] = useState();
  //
  const [pagination, setPagination] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const [exportData, setExportData] = useState(null);
  const [exportId, setExportId] = useState(null);
  const [internshipId, setInternshipId] = useState(0)
  const userRole = useSelector((state) => state.authorise.userRole);
  //

  //
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const tableDataWithIds = tableData?.map((row, index) => ({
    ...row,
    id: index + 1, // You can use a different logic to generate unique ids
  }));
  const filteredRows = tableDataWithIds?.filter((row) => {
    // Filter logic based on the searchQuery
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const customPagination = () => {
    return (
      <Box
        sx={{
          backgroundColor: colors.blueAccent[800],
          py: 1,
          // mb: 3,
          borderRadius: "0px 0px 5px 5px",
          boxShadow: `0px 4px 5px -2px ${colors.grey[900]}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            flexDirection: "column", // Set the default flex direction to "column"
            "@media (min-width: 600px)": {
              flexDirection: "row", // Use "row" for screens wider than 600px
            },
          }}
        >
          <TogglePage onChangePageSize={setPageSize} pageSize={pageSize} />
          <Pagination
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
              "@media (min-width: 600px)": {
                m: 0,
              },
            }}
            count={pagination?.total_pages}
            page={pagination?.page}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Box>
    );
  };

  const getRowStyle = (params) => {
    const isCompletedValue = params.row["status"];

    const rowStyle = {
      backgroundColor:
        isCompletedValue === "Completed"
          ? "green"
          : isCompletedValue === "Partial"
          ? "red"
          : isCompletedValue === "Pending"
          ? "yellow"
          : "black",
      color: "white", // You can add more styles here if needed
    };

    return rowStyle;
  };

  const borderColor = `1px solid ${colors.blueAccent[600]}`;

  return (
    <>
      <Helmet>
        <title> Internship | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        {userRole === "staff" ? (
          <Box>
            <StaffInternship />
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", mb:2, justifyContent: "space-between" }}>
              {/* <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: colors.blueAccent[300],
                }}
              >
                Welcome back to Internship !
              </Typography> */}

              <Button
                variant="contained"
                size="small"
                // disabled
                color="warning"
                sx={{ height: 25 }}
                component={Link} // Use Link as the component
                to="/internship-approval"
              >
                Approval
              </Button>
            </Box>

            <Widgets setErrorMsg={setErrorMsg} internshipId={internshipId}/>
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
                  setExportData={setExportData}
                  setExportId={setExportId}
                  setInternshipId={setInternshipId}
                />
              </Box>
              {tableData && column && !errorMsg && (
                <Box sx={{ my: 2 }}>
                  {/* <Box
                sx={{
                  [theme.breakpoints.up("sm")]: {
                    position: "absolute",
                    right: "0.7%",
                    zIndex: 10,
                    mt: 1,
                  },
                  [theme.breakpoints.down("sm")]: {
                    maxWidth: "100%",
                    mt: 1,
                  },
                }}
              >
                
              </Box> */}
                  <Box
                    height={40}
                    bgcolor={colors.blueAccent[800]}
                    sx={{
                      borderRadius: "5px 5px 0 0",
                      boxShadow: `0px -4px 5px -2px ${colors.grey[900]}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1,
                    }}
                  >
                    <Box
                      display="flex"
                      backgroundColor={colors.blueAccent[900]}
                      borderRadius="3px"
                      border={borderColor}
                      justifyContent="space-between"
                      height={26}
                      width={200}
                    >
                      <InputBase
                        sx={{ ml: 1, fontSize: "14px" }}
                        placeholder={`Search...`}
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                      />
                      <Box display="flex" pr={1} alignItems="center">
                        <Search
                          sx={{
                            width: 15,
                            color: colors.grey[400],
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <ExportModal
                        exportData={exportData}
                        exportIds={exportId}
                      />
                    </Box>
                  </Box>
                  {/* <Divider/> */}
                  <Box
                    sx={{
                      height: 410,

                      // maxHeight:"90vh",

                      "& .MuiDataGrid-root": {
                        border: "none",

                        // boxShadow: `0px 0px 5px -3px ${colors.grey[900]}`,
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                      },
                      "& .Is Completed-column--cell": {
                        color: colors.greenAccent[300],
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[900],
                        borderBottom: "none",
                        borderRadius: 0,
                        boxShadow: `0px -4px 5px -2px ${colors.grey[900]}`,
                      },
                      "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        display: "none",
                        backgroundColor: colors.blueAccent[700],
                      },
                      "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                      },
                      "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.blueAccent[100]} !important`,
                        height: 35,
                      },
                    }}
                  >
                    {column && (
                      <DataGrid
                        rows={filteredRows}
                        columns={column}
                        // components={{ Toolbar: GridToolbar }}
                        // components={{
                        //   Toolbar: () => (
                        //     <CustomToolbar searchQuery={searchQuery} onSearchChange={handleSearchQueryChange} />
                        //   ),
                        // }}
                        loading={tableLoading}
                        getRowStyle={getRowStyle}
                        density="compact"
                        disableColumnSelector
                        disableExportSelector
                        disableColumnMenu
                        disableColumnFilter
                      />
                    )}
                  </Box>
                  {customPagination()}
                </Box>
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
            </Box>
          </>
        )}
        {/* <Box px={4} bgcolor={colors.blueAccent[900]}></Box> */}
      </Container>
    </>
  );
};

export default Internship;
