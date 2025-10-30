// import React, { useState } from "react";
// import {
//   Box,
//   Container,
//   InputBase,
//   Pagination,
//   Typography,
// } from "@mui/material";

// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { useTheme } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import { Helmet } from "react-helmet-async";

// import { DataSearch } from "./dataSearch";
// import Widgets from "./Widgets";
// import TogglePage from "../../components/common/toggleButton/togglePage";

// const CorporateProgram = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [tableData, setTableData] = useState();
//   const [column, setColumns] = useState();
//   //
//   const [pagination, setPagination] = useState();
//   const [pageSize, setPageSize] = useState(10);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [tableLoading, setTableLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState();

//   //

//   const handleSearchQueryChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const tableDataWithIds = tableData?.map((row, index) => ({
//     ...row,
//     id: index + 1, // You can use a different logic to generate unique ids
//   }));
//   const filteredRows = tableDataWithIds?.filter((row) => {
//     // Filter logic based on the searchQuery
//     return Object.values(row).some((value) =>
//       value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   const customPagination = () => {
//     return (
//       <Box
//         sx={{
//           backgroundColor: colors.blueAccent[800],
//           py: 1.5,
//           mb: 3,
//           borderRadius: "0px 0px 5px 5px",
//           boxShadow: `0px 4px 5px -2px ${colors.grey[900]}`,
//         }}
//       >
//         <Box sx={{display:'flex', justifyContent:'space-between', px:2,}}>
//           <TogglePage onChangePageSize={setPageSize} pageSize={pageSize}/>
//           <Pagination
//             sx={{ display: "flex", justifyContent: "flex-end" }}
//             count={pagination?.total_pages}
//             page={pagination?.page}
//             onChange={(event, newPage) => setPage(newPage)}
//             color="primary"
//           />
//         </Box>
//       </Box>
//     );
//   };

//   const getRowStyle = (params) => {
//     const isCompletedValue = params.row["status"];

//     const rowStyle = {
//       backgroundColor:
//         isCompletedValue === "Completed"
//           ? "green"
//           : isCompletedValue === "Partial"
//           ? "red"
//           : isCompletedValue === "Pending"
//           ? "yellow"
//           : "black",
//       color: "white", // You can add more styles here if needed
//     };

//     return rowStyle;
//   };

//   return (
//     <>
//       <Helmet>
//         <title> Corporate Program | EduSkills </title>
//       </Helmet>

//       <Container maxWidth="xl" sx={{ my: 2 }}>
//         <Box px={4} bgcolor={colors.blueAccent[900]}></Box>
//         <Widgets setErrorMsg={setErrorMsg} />
//         <Box m="0px auto" position="relative">
//           <Box>
//             <DataSearch
//               setTableData={setTableData}
//               setColumns={setColumns}
//               tableData={tableData}
//               page={page}
//               setPagination={setPagination}
//               loading={loading}
//               setLoading={setLoading}
//               setErrorMsg={setErrorMsg}
//               setTableLoading={setTableLoading}
//               pageSize={pageSize}
//               setPageSize={setPageSize}
//             />
//           </Box>
//           {tableData && column && !errorMsg && (
//             <Box sx={{ my: 2 }}>
//               <Box
//                 sx={{
//                   [theme.breakpoints.up("sm")]: {
//                     position: "absolute",
//                     right: "0.7%",
//                     zIndex: 10,
//                     mt: 1,
//                   },
//                   [theme.breakpoints.down("sm")]: {
//                     maxWidth: "100%",
//                     mt: 1,
//                   },
//                 }}
//               >
//                 <Box
//                   display="flex"
//                   backgroundColor={colors.primary[400]}
//                   borderRadius="3px"
//                   justifyContent="space-between"
//                   height={26}
//                 >
//                   <InputBase
//                     sx={{ ml: 1, fontSize: "14px" }}
//                     placeholder={`Search...`}
//                     value={searchQuery}
//                     onChange={handleSearchQueryChange}
//                   />
//                   <Box display="flex" pr={1} alignItems="center">
//                     <Search
//                       sx={{
//                         width: 15,
//                         color: colors.grey[700],
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Box>

//               <Box
//                 sx={{
//                   mt: 2,
//                   height: "90vh",
//                   // maxHeight:"90vh",

//                   "& .MuiDataGrid-root": {
//                     border: "none",
//                     boxShadow: `0px -4px 5px -2px ${colors.grey[900]}`,
//                   },
//                   "& .MuiDataGrid-cell": {
//                     borderBottom: "none",
//                   },
//                   "& .Is Completed-column--cell": {
//                     color: colors.greenAccent[300],
//                   },
//                   "& .MuiDataGrid-columnHeaders": {
//                     backgroundColor: colors.blueAccent[800],
//                     borderBottom: "none",
//                     borderRadius: 0,
//                     boxShadow: `0px -4px 5px -2px ${colors.grey[900]}`,
//                   },
//                   "& .MuiDataGrid-virtualScroller": {
//                     backgroundColor: colors.primary[400],
//                   },
//                   "& .MuiDataGrid-footerContainer": {
//                     borderTop: "none",
//                     display: "none",
//                     backgroundColor: colors.blueAccent[700],
//                   },
//                   "& .MuiCheckbox-root": {
//                     color: `${colors.greenAccent[200]} !important`,
//                   },
//                   "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//                     color: `${colors.blueAccent[100]} !important`,
//                     height: 35,
//                   },
//                 }}
//               >
//                 {column && (
//                   <DataGrid
//                     rows={filteredRows}
//                     columns={column}
//                     components={{ Toolbar: GridToolbar }}
//                     disableColumnMenu
//                     disableColumnFilter
//                     loading={tableLoading}
//                     getRowStyle={getRowStyle}
//                   />
//                 )}
//               </Box>
//               {customPagination()}
//             </Box>
//           )}
//           {errorMsg && (
//             <Box
//               sx={{
//                 bgcolor: colors.blueAccent[900],
//                 height: "40vh",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: 2,
//                 my: 2,

//               }}
//             >
//               <Typography variant="h4" fontWeight={600}>
//                 {errorMsg}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Container>
//     </>
//   );
// };

// export default CorporateProgram;

import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
// import { sample } from 'lodash';
import {
  useEffect,
  // useEffect,
  useState,
} from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  // Avatar,

  // Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  // TablePagination,
  Box,
  CircularProgress,
  Tooltip,
  Popover,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
// components
// import Label from "../../../components/label";
// import Iconify from '../components/iconify';
// import Scrollbar from "../../components/common/scrollbar";
// sections
// import { UserListHead, UserListToolbar } from "../../../components/common/user";
// mock
// import USERLIST from "../../_mock/user";
import { Icon } from "@iconify/react";
// import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
// import { useEffect } from "react";
// import { AdminService } from "../../../services/dataService";
import { CustomPagination } from "../../components/common/pagination";
import Widgets from "./Widgets";
import { DataSearch } from "./dataSearch";
import { UserListHead, UserListToolbar } from "../../components/common/user";
import Label from "../../components/label";
import { tokens } from "../../theme";
import UnderWorkingModal from "../../components/common/modal/UnderWorkingModal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "sl_no", label: "#", alignRight: false },
  { id: "academy_name", label: "Academy Name", alignRight: false },
  { id: "educator", label: "Educator", alignRight: true },
  { id: "completed", label: "Completed", alignRight: true },
  { id: "student", label: "Student", alignRight: true },
  { id: "limit", label: "Domain Limit", alignRight: true },
  { id: "status", label: "Status", alignRight: true },
  "",
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.academy_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CorporateProgram() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [oldPage, setOldPage] = useState(0);
  // const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const [loadingTable, setLoadingTable] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState([]);
  const [column, setColumns] = useState();
  //
  const [pagination, setPagination] = useState();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [open, setOpen] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openDomainChangeDialog, setOpenDomainChangeDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const onClose = () => {
    setIsWorking(false)
  };
  const handleCloseMenu = () => {
    setOpen(null);
    setActionType("");
  };
  const handleOpenMenu = (event, rowData) => {
    setOpen(event.currentTarget);
    setSelectedRowData(rowData);
  };

  const handleDomainChangeDialog = (action) => {
    setActionType(action);
    setOpenDomainChangeDialog(true);
    setOpen(null);
  };

  // const handleOpenConfirmationDialog = (action) => {
  //   setActionType(action);
  //   setOpenConfirmationDialog(true);
  //   setOpen(null);
  // };

  useEffect(() => {
    if (pagination?.total_pages) {
      setCount(pagination.total_pages);
    }
  }, [page, rowsPerPage, pagination?.total_pages]);

  useEffect(() => {
    if (pagination?.total_pages) {
      setPage(1);
    }
  }, [pagination?.total_pages]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tableData.map((n) => n.academy_name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleFilterByName = (event) => {
    // setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    oldPage > 0
      ? Math.max(0, (1 + oldPage) * rowsPerPage - tableData?.length)
      : 0;

  const filteredUsers = applySortFilter(
    tableData,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Educators | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        {/* <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: colors.blueAccent[300] }}
          >
            Welcome back to Educators !
          </Typography>
     
        </Stack> */}

        <Widgets setErrorMsg={setErrorMsg} />
        {/* <Box m="0px auto" position="relative"> */}
        <Box sx={{ mb: 2 }}>
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
            pageSize={rowsPerPage}
            setPageSize={setRowsPerPage}
          />
        </Box>
        {tableData.length !== 0 && (
          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            {tableLoading ? ( // Check if data is loading
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 332,
                }}
              >
                <CircularProgress color="info" size={50} />
              </Box>
            ) : (
              <TableContainer sx={{ minHeight: 332 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(
                        oldPage * rowsPerPage,
                        oldPage * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const {
                          sl_no,
                          academy_name,
                          educator,
                          completed,
                          student,
                          status,
                        } = row;
                        const selectedUser =
                          selected.indexOf(academy_name) !== -1;

                        return (
                          <TableRow
                            hover
                            key={sl_no}
                            tabIndex={-1}
                            // role="checkbox"
                            selected={selectedUser}
                          >
                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              {sl_no}
                            </TableCell>
                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              component="th"
                              align="left"
                            >
                              <Stack
                                direction="row"
                                alignItems="start"
                                spacing={2}
                              >
                                <Tooltip title={academy_name}>
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    sx={{
                                      maxWidth: "25ch", // Adjust this value as needed
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {academy_name}
                                  </Typography>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              align="right"
                            >
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "30ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {educator}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              align="right"
                            >
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "25ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {completed}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              align="right"
                            >
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "14ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {student}
                              </Typography>
                            </TableCell>

                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              align="right"
                            >
                              <Tooltip
                                title={
                                  student === 150
                                    ? "Limit Exceeded"
                                    : student > 150
                                    ? ""
                                    : "Max Limit 150"
                                }
                              >
                                <Typography
                                  fontSize={12}
                                  noWrap
                                  sx={{
                                    maxWidth: "14ch", // Adjust this value as needed
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontWeight: student === 150 ? 700 : 400,
                                    color: student === 150 ? "red" : "inherit",
                                  }}
                                >
                                  {student}
                                </Typography>
                              </Tooltip>
                            </TableCell>

                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              align="right"
                            >
                              <Label
                                color={
                                  status === "InProgress"
                                    ? "warning"
                                    : status === "InActive"
                                    ? "error"
                                    : "success"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>

                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              align="right"
                            >
                              <IconButton
                                size="medium"
                                sx={{ p: 0.5 }}
                                color="inherit"
                                onClick={(event) => handleOpenMenu(event, row)}
                              >
                                <Icon icon="eva:more-vertical-fill" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={7} sx={{ py: 19.6 }}>
                          <Box
                            sx={{
                              textAlign: "center",
                              py: 2,
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete
                              words.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            )}

            <Popover
              open={Boolean(open)}
              anchorEl={open}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  p: 1,
                  // width: 140,
                  "& .MuiMenuItem-root": {
                    px: 1,
                    typography: "body2",
                    borderRadius: 0.75,
                  },
                },
              }}
            >
              <MenuItem
                sx={{ color: "info.main" }}
                disabled={selectedRowData?.status === "InActive"}
                onClick={() => handleDomainChangeDialog("limit_increase")}
              >
                <Icon icon={"emojione-monotone:up-arrow"} />
                <Typography sx={{ ml: 0.5, fontSize: 12, fontWeight: 500 }}>
                  Limit Increase Request
                </Typography>
              </MenuItem>

              <MenuItem
                sx={{ color: "warning.main" }}
                disabled={
                  selectedRowData?.status === "Active" ||
                  selectedRowData?.status === "InProgress"
                }
                onClick={() => handleDomainChangeDialog("domain_active")}
              >
                <Icon icon={"mdi:tick-circle"} />
                <Typography sx={{ ml: 0.5, fontSize: 12, fontWeight: 500 }}>
                  Domain Active Request
                </Typography>
              </MenuItem>
              <MenuItem
                sx={{ color: "error.main" }}
                disabled={selectedRowData?.status !== "Active"}
                onClick={() => handleDomainChangeDialog("domain_inactive")}
              >
                <Icon icon={"gridicons:cross-circle"} />
                <Typography sx={{ ml: 0.5, fontSize: 12, fontWeight: 500 }}>
                  InActive
                </Typography>
              </MenuItem>
            </Popover>

            <CustomPagination
              page={page}
              count={count}
              setRowsPerPage={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
            />
          </Card>
        )}

        <Dialog
          open={openDomainChangeDialog}
          onClose={() => setOpenDomainChangeDialog(false)}
          aria-labelledby="confirmation-dialog-title"
        >
          <DialogTitle id="confirmation-dialog-title" sx={{ pb: 0.5 }}>
            <Typography style={{ fontSize: 12, fontWeight: 500 }}>
              {actionType === "limit_increase"
                ? "Domain Limit Request for.."
                : actionType === "domain_active"
                ? "Domain Active Request for.."
                : "Domain InActive for.."}
            </Typography>
            <Typography
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: colors.greenAccent[400],
              }}
            >
              {selectedRowData?.academy_name?.length > 30
                ? selectedRowData?.academy_name.slice(0, 30) + "..."
                : selectedRowData?.academy_name}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 0.5, pt: 1 }}>
            {actionType === "limit_increase" && (
              <TextField
                size="small"
                placeholder="Enter your limit.."
                type="number"
              />
            )}
          </DialogContent>

          <DialogActions
            sx={{
              mx: 2,
              mb: 1,
              display: "flex",
              // justifyContent: "space-between",
            }}
          >
            <Box>
              <Button
                onClick={() => setOpenDomainChangeDialog(false)}
                variant="outlined"
                color="error"
                size="small"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="info"
                size="small"
                onClick={() => setIsWorking(!isWorking)}
              >
                {actionType === "limit_increase"
                  ? "Limit Request"
                  : actionType === "domain_active"
                  ? "Active Request"
                  : "InActive"}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
        {isWorking && <UnderWorkingModal onClose={onClose} />}
      </Container>
    </>
  );
}
