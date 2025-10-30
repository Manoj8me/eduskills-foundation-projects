import React, { useState } from "react";
import {
  Box,
  Container,
  InputBase,
  Pagination,
  Typography,
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
// import { DataSearch } from "../../components/common/dataSearch/DataSearch";
// import Widgets from "../Report/Widgets";

const Placement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchQuery, setSearchQuery] = useState("");
  // const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState();
  //
  const [pagination, setPagination] = useState();
  // const [displayedPlaceholder, setDisplayedPlaceholder] = useState(
  //   placeholderTexts[0]
  // );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const setErrorMsg = (msg) => {
    setErrorMessage(msg);
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
          py: 1.5,
          borderRadius: "0px 0px 5px 5px",
          boxShadow: `0px 4px 5px -2px ${colors.grey[900]}`,
        }}
      >
        <Pagination
          sx={{ display: "flex", justifyContent: "flex-end" }}
          count={pagination?.totalPages}
          page={pagination?.currentPage}
          onChange={(event, newPage) => setPage(newPage)}
        />
      </Box>
    );
  };

  const getRowStyle = (params) => {
    const isCompletedValue = params.row["is_completed"];

    const rowStyle = {
      backgroundColor:
        isCompletedValue === "active"
          ? "green"
          : isCompletedValue === "deactive"
          ? "red"
          : "white",
    };

    return rowStyle;
  };

  const pageConfig = {
    setLoading,
    setTableData,
    setColumns,
    setPagination,
    loading,
    setErrorMsg,
    setTableLoading,
  };

  return (
    <>
      <Helmet>
        <title> Publication | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 3 }}>
        <Box px={4} bgcolor={colors.blueAccent[900]}>
          {/* <BreadCrumb title="Contacts" pageTitle="Manage"/> */}
        </Box>
        {/* <Divider/> */}

        {/* <Widgets setErrorMsg={setErrorMsg} /> */}
        <Box m="0px auto" position="relative">
          {/* <Box pt={1.5}>
        <Widgets/>
        </Box> */}
          <Box>
            {/* <DataSearch
              setTableData={setTableData}
              setColumns={setColumns}
              setPagination={setPagination}
              loading={loading}
              setLoading={setLoading}
              setErrorMsg={setErrorMsg}
              setTableLoading={setTableLoading}
              column={columns}
              page={1} // You can specify the page number here
              pageConfig={pageConfig} // Pass the page-specific configuration
            /> */}
          </Box>
          {tableData && (
            <Box sx={{ my: 2 }}>
              <Box
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
                <Box
                  display="flex"
                  backgroundColor={colors.primary[400]}
                  borderRadius="3px"
                  justifyContent="space-between"
                  height={26}
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
                        color: colors.grey[700],
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  height: 625,
                  "& .MuiDataGrid-root": {
                    border: "none",
                    boxShadow: `0px -4px 5px -2px ${colors.grey[900]}`,
                  },
                  "& .MuiDataGrid-cell": {
                    // borderBottom: 1,
                    // border:"none",
                  },
                  "& .Is Completed-column--cell": {
                    color: colors.greenAccent[300],
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[800],
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
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  components={{ Toolbar: GridToolbar }}
                  disableColumnMenu
                  disableColumnFilter
                  loading={tableLoading}
                  getRowStyle={getRowStyle}
                  disableSelectionOnClick={true}
                />
              </Box>
              {customPagination()}
            </Box>
          )}
          {errorMessage !== "" && (
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
                {errorMessage}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Placement;
