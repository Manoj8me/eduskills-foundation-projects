// import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  // Paper,
  // Avatar,
  // Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  // Container,
  Typography,
  IconButton,
  TableContainer,
  // TablePagination,
  Box,
  Pagination,
  useTheme,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
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
import {
  InternshipService,
  TalentConnectService,
} from "../../../services/dataService";
import { toast } from "react-toastify";
import TogglePage from "../../../components/common/toggleButton/togglePage";
import FilterSearch from "./filterSearch";

// ----------------------------------------------------------------------

// ----------------------------------------------------
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
        _user.user_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CustomTable({
  TABLE_HEAD,
  tableData,
  setRowsPerPage,
  rowsPerPage,
  count,
  page,
  setPage,
  setRefresh,
  tableLoading,
  exportData,
  setResumeData,
  setOnSelect,
  setSelectedUserId,
}) {
  const [open, setOpen] = useState(null);

  // const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectRemark, setRejectRemark] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [error, setError] = useState(null);
  const [oldPage, setOldPage] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(true);
  const [openFilter, setOpenFilter] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    console.log("tableData", selectedRowData);
    if (selectedRowData?.resume_id) {
      setSelectedUserId(selectedRowData?.resume_id);
    }
  }, [selectedRowData?.resume_id]);

  const handleOpenMenu = (event, rowData) => {
    setOpen(event.currentTarget);
    setSelectedRowData(rowData);
    setError(null);
    setRejectRemark("");
  };

  const handleOpenFilter = (event) => {
    setOpenFilter(event.currentTarget);
  };

  const handleClosFilter = () => {
    setOpenFilter(null);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setError(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = () => {
    if (isAllChecked) {
      const newSelecteds = tableData
        ?.filter(
          (item) =>
            item.status !== "Approved" &&
            item.status !== "Rejected" &&
            item.status !== "Cancel"
        )
        .map((n) => n.user_id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleClick = (event, user_id) => {
    const selectedIndex = selected.indexOf(user_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, user_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    // Filter out items with status 'Approved' or 'Rejected'
    const filteredSelected = newSelected.filter(
      (internshipId) =>
        tableData.find((item) => item.user_id === internshipId)?.status !==
          "Approved" &&
        tableData.find((item) => item.user_id === internshipId)?.status !==
          "Rejected"
    );

    setSelected(filteredSelected);
  };

  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  function handleErrorMessage(message) {
    toast.error(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

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

  const handleOpenConfirmationDialog = (action) => {
    setActionType(action);
    setOpenConfirmationDialog(true);
    setOpen(null);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;

    const sanitizedInput = inputValue.replace(/\s+/g, " ");

    setRejectRemark(sanitizedInput);

    if (actionType === "reject" && sanitizedInput.length < 50) {
      setError("Minimum 50 characters are required for rejection remark");
    } else {
      setError(null);
    }
  };

  const handleFetchResume = async () => {
    const data = {
      // user_id: selectedRowData?.user_id,
      resume_id: selectedRowData?.resume_id,
    };
    // if (data.user_id && data.resume_id) {
    if (data.resume_id) {
      try {
        const response = await TalentConnectService.resume(data);
        setResumeData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    } else {
    }
  };
  // internship_bulk_approval....................................................

  // const handleApprovalAllConfirmation = () => {
  //   if (selected.length === 0) {
  //     // No items selected, display a message
  //     console.error("No items selected for bulk approval.");
  //     return;
  //   }
  //   handleOpenConfirmationDialog("approveAll");
  // };
  {
    /* const status = [
  {id:0,title:"Rejected"},
  {id:1,title:"Applied"},
  {id:2,title:"Shortlisted R1"},
  {id:3,title:"Shortlisted R2"},
  {id:4,title:"Shortlisted R3"},
  {id:5,title:"Not Attended R1"},
  {id:6,title:"Not Attended R2"},
  {id:7,title:"Not Attended R3"},
  {id:8,title:"Selected"},
] */
  }
  //...............................................................................

  const handleConfirm = async () => {
    let status = null;
    let remark = rejectRemark || "";
    // Determine the status based on the actionType
    switch (actionType) {
      case "Selected":
        status = 8;
        break;
      case "Shortlisted R1":
        status = 2;
        break;
      case "Shortlisted R2":
        status = 3;
        break;
      case "Shortlisted R3":
        status = 4;
        break;
      case "reject":
        if (!rejectRemark) {
          setError("Reject remark is required");
          return;
        }
        status = 0;
        break;
      case "Not Attended R1":
        if (!rejectRemark) {
          setError("Reject remark is required");
          return;
        }
        status = 5;
        break;
      case "Not Attended R2":
        if (!rejectRemark) {
          setError("Reject remark is required");
          return;
        }
        status = 6;
        break;
      case "Not Attended R3":
        if (!rejectRemark) {
          setError("Reject remark is required");
          return;
        }
        status = 7;
        break;
      default:
        console.error("Invalid action type:", actionType);
        return;
    }

    // Create the data object
    const data = {
      is_active: status,
      remark,
      job_id: selectedRowData?.job_id,
    };

    try {
      // Make the API call
      const response = await TalentConnectService.status({
        user_id: selectedRowData?.user_id,
        data,
      });
      handleSuccessMessage(response.data.detail);
      setRefresh(true);
      setSelected([]);
    } catch (error) {
      console.error("Error fetching data:", error);
      handleErrorMessage(error.response.data.detail);
    }

    // Reset state
    setOpenConfirmationDialog(false);
    setError(null);
    setRejectRemark("");
  };

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
            onChangePageSize={setRowsPerPage}
            pageSize={rowsPerPage}
          />
          <Pagination
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
              "@media (min-width: 600px)": {
                m: 0,
              },
            }}
            count={count}
            page={page + 1}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // handleApprovalAll={handleApprovalAllConfirmation}
            // showExport={true}
            // exportData={exportData}
            isFilter={true}
            onFilterOpen={handleOpenFilter}
          />

          {/* <Scrollbar> */}
          <TableContainer>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                tableData={tableData}
                // isCheckShow={true}
              />
              <TableBody>
                {tableLoading ? (
                  <TableRow sx={{ height: 300 }}>
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
                      const { sl_no, user_name, email, user_id, status } = row;
                      const selectedUser = selected.indexOf(user_id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={sl_no}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell
                            // padding="checkbox"
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            {/* <Checkbox
                              checked={selectedUser}
                              disabled={status !== "Applied"}
                              onChange={(event) =>
                                handleClick(event, internship_id)
                              }
                            /> */}
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
                              <Typography variant="subtitle2" noWrap>
                                {user_name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            <Tooltip title={email}>
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "30ch", // Adjust this value as needed
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
                            <Label
                              color={
                                [
                                  "Rejected",
                                  "Not Attended R1",
                                  "Not Attended R2",
                                  "Not Attended R3",
                                ].includes(status)
                                  ? "error"
                                  : status === "Selected"
                                  ? "success"
                                  : [
                                      "Cancel",
                                      "Shortlisted R1",
                                      "Shortlisted R2",
                                      "Shortlisted R3",
                                    ].includes(status)
                                  ? "warning"
                                  : "info"
                              }
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            <IconButton
                              size="medium"
                              color="inherit"
                              disabled={selected.length !== 0}
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
                          <br /> Try checking for typos or using complete words.
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
          {/* <TablePagination
            rowsPerPageOptions={[10, 50]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Card>
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
        <MenuItem
          sx={{ color: "info.main" }}
          // disabled={selectedRowData?.status !== "Applied"}
          onClick={() => {
            handleFetchResume();
            handleCloseMenu();
          }}
        >
          <Icon icon={"pepicons-print:cv"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Resume</Typography>
        </MenuItem>

        <MenuItem
          sx={{ color: "success.main" }}
          // disabled={selectedRowData?.status !== "Applied"}
          // disabled
          onClick={() => handleOpenConfirmationDialog("Shortlisted R1")}
        >
          <Icon icon={"mdi:approve"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Shortlisted R1</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "success.main" }}
          // disabled={selectedRowData?.status !== "Applied"}
          // disabled
          onClick={() => handleOpenConfirmationDialog("Shortlisted R2")}
        >
          <Icon icon={"mdi:approve"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Shortlisted R2</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "success.main" }}
          // disabled={selectedRowData?.status !== "Applied"}
          // disabled
          onClick={() => handleOpenConfirmationDialog("Shortlisted R3")}
        >
          <Icon icon={"mdi:approve"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Shortlisted R3</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "success.main" }}
          // disabled={selectedRowData?.status !== "Applied"}
          // disabled
          onClick={() => handleOpenConfirmationDialog("Selected")}
        >
          <Icon icon={"mdi:approve"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Selected</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          // disabled
          // disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("Not Attended R1")}
        >
          <Icon icon={"fluent:person-delete-24-filled"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>
            Not Attended R1
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          // disabled
          // disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("Not Attended R2")}
        >
          <Icon icon={"fluent:person-delete-24-filled"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>
            Not Attended R2
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          // disabled
          // disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("Not Attended R3")}
        >
          <Icon icon={"fluent:person-delete-24-filled"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>
            Not Attended R3
          </Typography>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          // disabled
          // disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("reject")}
        >
          <Icon icon={"fluent:person-delete-24-filled"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Rejected</Typography>
        </MenuItem>
      </Popover>

      <FilterSearch
        openFilter={openFilter}
        handleClosFilter={handleClosFilter}
        onSelect={setOnSelect}
      />

      <Dialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            {actionType !== "reject"
              ? `Are you sure you want to ${actionType}?`
              : `Are you sure you want to reject?`}
          </Typography>
          {/* const status = [
  {id:0,title:"Rejected"},
  {id:1,title:"Applied"},
  {id:2,title:"Shortlisted R1"},
  {id:3,title:"Shortlisted R2"},
  {id:4,title:"Shortlisted R3"},
  {id:5,title:"Not Attended R1"},
  {id:6,title:"Not Attended R2"},
  {id:7,title:"Not Attended R3"},
  {id:8,title:"Selected"},
] */}

          {[
            "reject",
            "Not Attended R1",
            "Not Attended R2",
            "Not Attended R3",
          ].includes(actionType) && (
            <Box sx={{ width: 300 }}>
              <TextField
                autoFocus
                margin="dense"
                id="rejectRemark"
                size="small"
                sx={{ mt: 2 }}
                label={`${actionType} Remark`}
                multiline
                rows={4}
                type="text"
                fullWidth
                value={rejectRemark}
                onChange={handleChange}
                required
                error={Boolean(error)}
                helperText={error}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ mr: 2, mb: 1 }}>
          <Button
            onClick={() => setOpenConfirmationDialog(false)}
            variant="outlined"
            color="error"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (actionType === "resume") {
                handleFetchResume();
              } else {
                handleConfirm();
              }
              // if (actionType === "approveAll") {
              //   handleApprovalAll();
              // } else {
              // handleConfirm();
              // }
            }}
            variant="outlined"
            color="info"
            disabled={error}
            size="small"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
