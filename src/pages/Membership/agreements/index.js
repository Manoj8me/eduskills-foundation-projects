import React, { useState } from "react";
import {
  Box,
  Container,
  InputBase,
  Pagination,
  Typography,
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";

import { DataSearch } from "./dataSearch";
import Widgets from "./Widgets";
import TogglePage from "../../../components/common/toggleButton/togglePage";

const Agreements = () => {
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
          py: 1.5,
          mb: 3,
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

  return (
    <>
      <Helmet>
        <title> Agreements | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>

      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
      >
        Welcome back to Agreements !
      </Typography>
        <Box px={4} bgcolor={colors.blueAccent[900]}></Box>
        <Widgets setErrorMsg={setErrorMsg} />
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
            />
          </Box>
          {tableData && column && !errorMsg && (
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
                  height: "55vh",
                  // maxHeight:"90vh",

                  "& .MuiDataGrid-root": {
                    border: "none",
                    boxShadow: `0px -4px 5px -2px ${colors.grey[900]}`,
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none",
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
                {column && (
                  <DataGrid
                    rows={filteredRows}
                    columns={column}
                    components={{ Toolbar: GridToolbar }}
                    disableColumnMenu
                    disableColumnFilter
                    loading={tableLoading}
                    getRowStyle={getRowStyle}
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
      </Container>
    </>
  );
};

export default Agreements;
