// import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Popover,
  // Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
  Box,
  Pagination,
  useTheme,
  CircularProgress,
  Tooltip,
  Divider,
} from "@mui/material";
// components
import Label from "../../../components/label/Label";

// import Scrollbar from "../../../components/common/scrollbar/Scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../../components/common/user";
// mock
// import users from "../../../_mock/user";
import { Icon } from "@iconify/react";
// import TogglePage from "../../../components/common/toggleButton/togglePage";
import { tokens } from "../../../theme";
// import { toast } from "react-toastify";
import TogglePage from "../../../components/common/toggleButton/togglePage";
import CustomViewDrawer from "../../common/drawer/CustomViewDrawer";

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
    const lowerCaseQuery = query.toLowerCase();
    return filter(
      array,
      (_user) =>
        _user.full_name.toLowerCase().indexOf(lowerCaseQuery) !== -1 ||
        _user.email.toLowerCase().indexOf(lowerCaseQuery) !== -1
    );
  }

  return stabilizedThis?.map((el) => el[0]);
}

export default function CustomTable({
  TABLE_HEAD,
  tableData,
  setRowsPerPage,
  rowsPerPage,
  count,
  page,
  setPage,
  // setRefresh,
  // tableLoading,
  isTableLoading,
}) {
  const [open, setOpen] = useState(null);
  // const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");

  // const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  // const [actionType, setActionType] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [oldPage, setOldPage] = useState(0);
  // const [isAllChecked, setIsAllChecked] = useState(true);
  const [isViewDrawerOpen, setViewDrawerOpen] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleOpenMenu = (event, rowData) => {
    setOpen(event.currentTarget);
    setSelectedRowData(rowData);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setPage(1);
    setRowsPerPage(newRowsPerPage);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter out items with status 'Approved' or 'Rejected'

  // function handleSuccessMessage(message) {
  //   toast.success(message, {
  //     autoClose: 2000,
  //     position: "top-center",
  //   });
  // }

  // function handleErrorMessage(message) {
  //   toast.error(message, {
  //     autoClose: 2000,
  //     position: "top-center",
  //   });
  // }

  const handleFilterByName = (event) => {
    setOldPage(0);
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

  // const handleOpenConfirmationDialog = (action) => {
  //   setActionType(action);
  //   setOpen(null);
  // };

  // ..................................................
  const viewDrawerOpen = () => {
    setViewDrawerOpen(true);
    handleCloseMenu();
  };
  const closeDrawer = () => {
    setViewDrawerOpen(false);
  };

  //...............................................................................

  const customPagination = () => {
    return (
      <Box
        sx={{
          backgroundColor: colors.blueAccent[800],
          py: 1,
          borderRadius: "0px 0px 5px 5px",
          //   boxShadow: `0px 4px 5px -2px ${colors.grey[900]}`,
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
          <TogglePage
            onChangePageSize={handleRowsPerPageChange}
            pageSize={rowsPerPage}
          />
          <Pagination
            size="small"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
              "@media (min-width: 600px)": {
                m: 0,
              },
            }}
            count={count}
            page={page}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ my: 2 }}>
        {!tableData.length == 0 && (
          <Card>
            <UserListToolbar
              // numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              searchButton={true}
              // handleApprovalAll={handleApprovalAllConfirmation}
              // showExport={true}
            />
            <Divider />
            {/* <Scrollbar> */}
            <TableContainer sx={{ maxHeight: "394px", overflowY: "auto" }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  // numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                  tableData={tableData}
                />
                <TableBody>
                  {isTableLoading ? (
                    <TableRow sx={{ height: 420 }}>
                      <TableCell align="center" colSpan={11}>
                        <CircularProgress color="info" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers
                      .slice(
                        oldPage * rowsPerPage,
                        oldPage * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const {
                          sl_no,
                          full_name,
                          domain,
                          email,
                          roll_no,
                          branch,
                          status,
                        } = row;
                        // const selectedUser = selected.indexOf(sl_no) !== -1;

                        return (
                          <TableRow
                            hover
                            key={sl_no}
                            tabIndex={-1}
                            role="checkbox"
                            // selected={selectedUser}
                          >
                            <TableCell
                              // padding="checkbox"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {sl_no}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Tooltip
                                  title={
                                    full_name?.length > 25 ? full_name : ""
                                  }
                                >
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    sx={{
                                      maxWidth: "25ch", // Adjust this value as needed
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {full_name}
                                  </Typography>
                                </Tooltip>
                              </Stack>
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Tooltip title={domain}>
                                <Typography
                                  fontSize={12}
                                  noWrap
                                  sx={{
                                    maxWidth: "20ch", // Adjust this value as needed
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {domain}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Tooltip title={email?.length > 23 ? email : ""}>
                                <Typography
                                  fontSize={12}
                                  noWrap
                                  sx={{
                                    maxWidth: "23ch", // Adjust this value as needed
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {email}
                                </Typography>
                              </Tooltip>
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Tooltip
                                title={roll_no?.length > 16 ? roll_no : ""}
                              >
                                <Typography
                                  fontSize={12}
                                  noWrap
                                  sx={{
                                    maxWidth: "16ch", // Adjust this value as needed
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {roll_no}
                                </Typography>
                              </Tooltip>
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Tooltip title={branch?.length > 7 ? branch : ""}>
                                <Typography
                                  fontSize={12}
                                  noWrap
                                  sx={{
                                    maxWidth: "7ch", // Adjust this value as needed
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {branch}
                                </Typography>
                              </Tooltip>
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Label
                                color={
                                  status === "Pending"
                                    ? "error"
                                    : status === "Completed"
                                    ? "success"
                                    : status === "Partial"
                                    ? "warning"
                                    : "info"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <IconButton
                                // size='small'
                                sx={{ p: 0.6 }}
                                color="inherit"
                                // disabled={selected.length !== 0}
                                onClick={(event) => handleOpenMenu(event, row)}
                              >
                                <Icon icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={11} sx={{ py: 3 }}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 2,
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
            {/* </Scrollbar> */}
            {customPagination()}
          </Card>
        )}
      </Box>

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
        <MenuItem sx={{ color: "info.main" }} onClick={viewDrawerOpen}>
          <Icon icon={"lucide:view"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>View Details</Typography>
        </MenuItem>

        <MenuItem disabled>
          <Icon icon={"fluent:person-delete-24-filled"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Edit</Typography>
        </MenuItem>
      </Popover>
      <CustomViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={closeDrawer}
        viewData={selectedRowData}
        title={"View Details"}
      />
    </>
  );
}
