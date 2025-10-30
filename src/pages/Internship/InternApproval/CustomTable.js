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
  Autocomplete,
  InputAdornment,
  FormControl,
  InputLabel,
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
import { InternshipService } from "../../../services/dataService";
import { toast } from "react-toastify";
import TogglePage from "../../../components/common/toggleButton/togglePage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AppUserListToolbar from "./AppUserListToolbar";

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

  // Apply the filter across the full dataset, not just the visible page
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.full_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
}) {
  const [open, setOpen] = useState(null);

  // const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openDomainChangeDialog, setOpenDomainChangeDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectRemark, setRejectRemark] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [domainList, setDomainList] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [inputDomain, setInputDomain] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [finalSuccessMsg, setFinalSuccessMsg] = useState("");
  const [error, setError] = useState(null);
  const [oldPage, setOldPage] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(true);
  const [otp, setOtp] = useState("");
  const [errorOtp, setErrorOtp] = useState("");
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainOtpLoading, setDomainOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [updatedRollNo, setUpdatedRollNo] = useState("");

  // const [openPassoutYearDialog, setOpenPassoutYearDialog] = useState(false);
  const [selectedPassoutYear, setSelectedPassoutYear] = useState(null);
  // const currentYear = new Date().getFullYear();
  const passoutYears = Array.from(
    { length: 2040 - 2000 + 1 },
    (_, i) => 2040 - i
  ); // List years from 2040 to 2000// List years from 2000 to 2040

  // Function to handle opening Passout Year dialog
  const handlePassoutYearChangeDialog = () => {
    setActionType("passoutYearChange"); // Set the action type for passout year change
    setOpenConfirmationDialog(true);
    setSelectedPassoutYear(null); // Reset passout year on dialog open
  };

  const handleBranchChange = (event, newValue) => {
    setSelectedBranch(newValue || "");
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleOpenMenu = (event, rowData) => {
    setOpen(event.currentTarget);
    setSelectedRowData(rowData);
    setError(null);
    setRejectRemark("");
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
        .map((n) => n.internship_id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleClick = (event, internship_id) => {
    const selectedIndex = selected.indexOf(internship_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, internship_id);
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
        tableData.find((item) => item.internship_id === internshipId)
          ?.status !== "Approved" &&
        tableData.find((item) => item.internship_id === internshipId)
          ?.status !== "Rejected"
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

  // Apply pagination after filtering
  const paginatedUsers = filteredUsers.slice(
    oldPage * rowsPerPage,
    oldPage * rowsPerPage + rowsPerPage
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleOpenConfirmationDialog = (action) => {
    setActionType(action);
    setOpenConfirmationDialog(true);
    setOpen(null);
  };

  //---------------------------------------------------

  useEffect(() => {
    let countdownInterval;

    if (isCountdownActive && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isCountdownActive, countdown]);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleDomainChangeDialog = async () => {
    setOpenDomainChangeDialog(true);
    setOpen(null);
    if (selectedRowData?.user_id) {
      setDomainLoading(true);
      try {
        const res = await InternshipService.internship_approval_domain_list(
          selectedRowData.user_id
        );
        setDomainList(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setDomainLoading(false);
      }
    } else {
      console.error("Please select valid user");
    }
  };

  const handleDomainChangeSend = async () => {
    console.log(selectedDomain);
    if (selectedRowData?.user_id && selectedDomain?.domain_id) {
      setDomainLoading(true);
      try {
        const res = await InternshipService.internship_approval_domain_send(
          selectedRowData.user_id,
          selectedDomain.domain_id
        );
        setSuccessMsg(res.data.detail);
        setIsCountdownActive(true); // Start countdown timer
        setCountdown(300);
        handleSuccessMessage(res.data.detail || "");
      } catch (error) {
        console.error(error);
        handleErrorMessage(error.response.data.detail || "Otp Sending Error");
      } finally {
        setDomainLoading(false);
      }
    }
  };

  const handleDomainOtpConfirm = async () => {
    if (
      selectedRowData?.user_id &&
      selectedDomain?.domain_id &&
      otp.length === 6
    ) {
      setDomainOtpLoading(true);
      try {
        const res = await InternshipService.internship_approval_domain_otp(
          selectedRowData.user_id,
          selectedDomain?.domain_id,
          { otp: otp }
        );
        setFinalSuccessMsg(res.data.detail);
        setIsCountdownActive(false); // Start the countdown
        setCountdown(0);
        handleSuccessMessage(res.data.detail || "");
        handleCancel();
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error(error);
        handleErrorMessage(
          error.response.data.detail || "Please enter valid Otp"
        );
      } finally {
        setDomainOtpLoading(false);
      }
    } else {
      console.error("Error invalid user_id or domain_id for otp submit");
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedDomain(newValue);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputDomain(newInputValue);
  };

  const handleChangeOtp = (event) => {
    const input = event.target.value;
    // Validate input to ensure it is a number and has a length of 6
    if (/^\d{0,6}$/.test(input)) {
      setOtp(input);
      setErrorOtp(""); // Clear error when input is valid
    } else {
      setErrorOtp("Invalid OTP. Please enter a 6-digit number.");
    }
  };

  const handleCancel = () => {
    setOpenDomainChangeDialog(false);
    setSelectedRowData(null);
    setFinalSuccessMsg("");
    setSuccessMsg("");
    setOtp("");
    setErrorOtp("");
    setCountdown(0);
    setIsCountdownActive(false);
    setShowPassword(false);
    setSelectedDomain(null);
  };
  //-----------------------------------------------------

  // const handleChange = (e) => {
  //   const inputValue = e.target.value;
  //   setRejectRemark(inputValue);
  //   // const hasNonSpaceCharacter = inputValue.trim().length > 1;
  //   // console.log(hasNonSpaceCharacter);
  //   // const hasNonSpaceAfterFirstSpace = /^\S+\s\S/.test(inputValue);
  //   if (actionType === "reject" && inputValue.length < 50) {
  //     setError("Minimum 50 characters are required for rejection remark");
  //   } else {
  //     setError(null);
  //   }
  // };
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

  // internship_bulk_approval..................................................

  const handleApprovalAllConfirmation = () => {
    if (selected.length === 0) {
      // No items selected, display a message
      console.error("No items selected for bulk approval.");
      return;
    }
    handleOpenConfirmationDialog("approveAll");
  };

  const handleApprovalAll = async () => {
    if (actionType === "approveAll") {
      const selectedBulkApproval = {
        data: selected.map((internship_id) => ({
          internship_id,
          status: 1,
        })),
      };

      try {
        const response = await InternshipService.internship_bulk_approval(
          selectedBulkApproval
        );
        handleSuccessMessage(
          response.data.detail || "Bulk approval successful."
        );
        setSelected([]);
        setRefresh(true);
        setOpenConfirmationDialog(false);
      } catch (error) {
        console.error("Error during bulk approval:", error);
        handleErrorMessage(
          error.response.data.detail ||
            "Error during bulk approval. Please try again."
        );
      }
    }
  };

  //...............................................................................

  const handleConfirm = async () => {
    if (actionType === "approve") {
      const data = { status: 1, remark: "" };
      const approveData = {
        internship_id: selectedRowData?.internship_id,
        data,
      };

      try {
        const response = await InternshipService.intern_approval_update(
          approveData
        );
        handleSuccessMessage(response.data.detail);
        setRefresh(true);
        setSelected([]);
      } catch (error) {
        console.error("Error fetching data:", error);
        handleErrorMessage(error.response.data.detail);
      }
    } else if (actionType === "reject") {
      if (!rejectRemark) {
        setError("Reject remark is required");
        return;
      }
      setError(null);
      const data = { status: 2, remark: rejectRemark };
      const approveData = {
        internship_id: selectedRowData?.internship_id,
        data,
      };

      try {
        const response = await InternshipService.intern_approval_update(
          approveData
        );
        handleSuccessMessage(response.data.detail);
        setRefresh(true);
        setSelected([]);
      } catch (error) {
        console.error("Error fetching data:", error);
        handleErrorMessage(error.response.data.detail);
      }
    } else if (actionType === "branchChange") {
      if (selectedRowData?.user_id) {
        const body = {
          roll_no: selectedRowData?.roll_no,
          branch: selectedBranch || selectedRowData?.branch,
        };
        console.log("branchChange", body);
        try {
          const res = await InternshipService.internship_edit_branch_rollno(
            selectedRowData?.user_id,
            body
          );
          console.log(res.data);
          handleSuccessMessage(res?.data?.detail);
          setRefresh(true);
        } catch (error) {
          console.error(error);
          handleErrorMessage(error.response.data.detail);
        }
      }
    } else if (actionType === "rollChange") {
      if (selectedRowData?.user_id) {
        const body = {
          roll_no: updatedRollNo || selectedRowData?.roll_no,
          branch: selectedRowData?.branch,
        };
        console.log("rollChange", body);
        try {
          const res = await InternshipService.internship_edit_branch_rollno(
            selectedRowData?.user_id,
            body
          );
          console.log(res.data);
          handleSuccessMessage(res?.data?.detail);
          setRefresh(true);
        } catch (error) {
          console.error(error);
          handleErrorMessage(error.response.data.detail);
        }
      }
    } else if (actionType === "passoutYearChange") {
      if (selectedRowData?.user_id && selectedPassoutYear) {
        const body = {
          roll_no: selectedRowData?.roll_no,
          branch: selectedRowData?.branch,
          passout_year: String(selectedPassoutYear), // Convert passout year to string
        };
        try {
          const res = await InternshipService.internship_edit_branch_rollno(
            selectedRowData?.user_id,
            body
          );
          handleSuccessMessage(res?.data?.detail);
          setRefresh(true);
        } catch (error) {
          console.error(error);
          handleErrorMessage(error.response.data.detail);
        }
      }
    }

    // alert(`SelectedBranch: ${selectedBranch}`);
    setSelectedBranch("");
    setUpdatedRollNo("");
    // setSelectedStream("");
    setOpenConfirmationDialog(false);
    setError(null);
    setRejectRemark("");
    setSelectedPassoutYear("");
  };

  const handleCancelModal = () => {
    // setSelectedBranch("");
    // setSelectedStream("");
    setOpenConfirmationDialog(false);
    setError(null);
    setRejectRemark("");
  };

  const customPagination = () => {
    return (
      <Box
        sx={{
          backgroundColor: colors.blueAccent[800],
          py: 1,
          // maxHeight:40,
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
            page={page + 1}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Box>
    );
  };

  const getBranch = async () => {
    if (selectedRowData?.user_id) {
      try {
        const res = await InternshipService.internship_get_branch(
          selectedRowData?.user_id
        );
        console.log(res.data);
        setBranchList(res?.data?.data);
        setUpdatedRollNo(selectedRowData?.roll_no);
        setSelectedBranch(selectedRowData?.branch);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (selectedRowData?.user_id) {
      getBranch();
    }
  }, [selectedRowData?.user_id]);

  return (
    <>
      <Box sx={{ my: 2 }}>
        <Card>
          <AppUserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            handleApprovalAll={handleApprovalAllConfirmation}
            showExport={true}
            exportData={exportData}
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
                isCheckShow={true}
              />
              <TableBody>
                {tableLoading ? (
                  <TableRow sx={{ height: 300 }}>
                    <TableCell align="center" colSpan={11}>
                      <CircularProgress color="info" />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((row) => {
                    const {
                      internship_id,
                      full_name,
                      domain,
                      email,
                      roll_no,
                      passout_year,
                      branch,
                      status,
                    } = row;
                    const selectedUser = selected.indexOf(internship_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={internship_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedUser}
                      >
                        <TableCell
                          padding="checkbox"
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Checkbox
                            checked={selectedUser}
                            disabled={status !== "Applied"}
                            onChange={(event) =>
                              handleClick(event, internship_id)
                            }
                          />
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
                              {full_name}
                            </Typography>
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
                        {/* <TableCell
                            align="left"
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            <Typography fontSize={12} noWrap>
                              {aicte_id}
                            </Typography>
                          </TableCell> */}
                        <TableCell
                          align="left"
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Tooltip title={email}>
                            <Typography
                              fontSize={12}
                              noWrap
                              sx={{
                                maxWidth: "20ch", // Adjust this value as needed
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {email}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        {/* <TableCell
                          align="left"
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Typography fontSize={12} noWrap>
                            {started_at}
                          </Typography>
                        </TableCell> */}

                        <TableCell
                          align="left"
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Typography fontSize={12} noWrap>
                            {roll_no}
                          </Typography>
                        </TableCell>

                        <TableCell
                          align="left"
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Tooltip title={branch}>
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
                          <Tooltip title={passout_year}>
                            <Typography
                              fontSize={12}
                              noWrap
                              sx={{
                                maxWidth: "7ch", // Adjust this value as needed
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {passout_year}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        {/* <TableCell
                          align="left"
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Typography fontSize={12} noWrap>
                            {cohort}
                          </Typography>
                        </TableCell> */}

                        <TableCell
                          align="left"
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Label
                            color={
                              status === "Rejected"
                                ? "error"
                                : status === "Approved"
                                ? "success"
                                : status === "Cancel"
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
          sx={{ color: "success.main" }}
          disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("approve")}
        >
          <Icon icon={"mdi:approve"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Approve</Typography>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("reject")}
        >
          <Icon icon={"fluent:person-delete-24-filled"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Reject</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "warning.main" }}
          disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleDomainChangeDialog()}
        >
          <Icon icon={"game-icons:card-exchange"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Domain Change</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "warning.main" }}
          disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("branchChange")}
        >
          <Icon icon={"tabler:exchange"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Branch Change</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "warning.main" }}
          disabled={selectedRowData?.status !== "Applied"}
          onClick={() => handleOpenConfirmationDialog("rollChange")}
        >
          <Icon icon={"bxs:message-square-edit"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>Roll No Change</Typography>
        </MenuItem>
        <MenuItem
          sx={{ color: "warning.main" }}
          disabled={selectedRowData?.status !== "Applied"}
          onClick={handlePassoutYearChangeDialog}
        >
          <Icon icon={"carbon:calendar"} />
          <Typography sx={{ ml: 0.5, fontSize: 12 }}>
            Passout Year Change
          </Typography>
        </MenuItem>
      </Popover>
      <Dialog
        open={openConfirmationDialog}
        onClose={() => handleCancelModal()}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === "approve"
              ? "Are you sure you want to approve?"
              : actionType === "approveAll"
              ? "Are you sure you want to approve all selected items?"
              : actionType === "branchChange"
              ? "Are you sure you want to change this student's branch?"
              : actionType === "rollChange"
              ? "Are you sure you want to change this student's Roll no.?"
              : actionType === "passoutYearChange"
              ? "Are you sure you want to change the Passout Year?"
              : "Are you sure you want to reject?"}
          </Typography>

          {actionType === "passoutYearChange" && (
            <Autocomplete
              size="small"
              fullWidth
              options={passoutYears}
              value={selectedPassoutYear}
              onChange={(event, newValue) => setSelectedPassoutYear(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Passout Year" />
              )}
              sx={{ mt: 2 }}
            />
          )}

          {actionType === "reject" && (
            <Box sx={{ width: 300 }}>
              <TextField
                autoFocus
                margin="dense"
                id="rejectRemark"
                size="small"
                sx={{ mt: 2 }}
                label="Rejection Remark"
                multiline
                rows={4}
                type="text"
                fullWidth
                value={rejectRemark}
                onChange={handleChange}
                required={actionType === "reject"}
                error={Boolean(error)}
                helperText={error}
              />
            </Box>
          )}

          {actionType === "branchChange" && (
            <Box sx={{ mt: 2 }}>
              <Autocomplete
                size="small"
                fullWidth
                value={selectedBranch} // State to hold selected branch
                onChange={(event, newValue) => setSelectedBranch(newValue)} // Update selected branch state
                options={branchList.map((branch) => branch.branch_name)} // Assuming branchList contains branch objects with branch_name field
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Branch"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          )}

          {actionType === "rollChange" && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Enter Roll Number"
                variant="outlined"
                value={updatedRollNo} // State to hold updated roll number
                onChange={(event) => setUpdatedRollNo(event.target.value)} // Update roll number state
                fullWidth
                size="small"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ mr: 2, mb: 1 }}>
          <Button
            onClick={() => handleCancelModal()}
            variant="outlined"
            color="error"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (actionType === "approveAll") {
                handleApprovalAll();
              } else {
                handleConfirm();
              }
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
      <Dialog
        open={openDomainChangeDialog}
        // onClose={() => setOpenDomainChangeDialog(false)}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title" sx={{ pb: 0.5 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>
            Domain change for
          </span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {" "}
            {selectedRowData?.full_name.length > 30
              ? selectedRowData?.full_name.slice(0, 30) + "..."
              : selectedRowData?.full_name}
          </span>
        </DialogTitle>
        <DialogContent sx={{ pb: 0.5, pt: 1 }}>
          {domainList.length !== 0 ? (
            <Autocomplete
              value={selectedDomain}
              onChange={handleAutocompleteChange}
              inputValue={inputDomain}
              onInputChange={handleInputChange}
              id="controllable-states-demo"
              options={domainList}
              disabled={Boolean(successMsg) || domainLoading}
              size="small"
              sx={{ mt: 1 }}
              getOptionLabel={(option) => option?.domain_name}
              renderInput={(params) => (
                <TextField {...params} label="Select Domain" />
              )}
            />
          ) : domainLoading ? (
            <Typography textAlign="center" my={1}>
              <CircularProgress size={40} />
            </Typography>
          ) : (
            <Typography color="error.main" textAlign="center">
              No domain available to change
            </Typography>
          )}
          {successMsg && (
            <TextField
              size="small"
              label="OTP"
              required
              sx={{ mt: 2 }}
              fullWidth
              disabled={domainOtpLoading || Boolean(finalSuccessMsg)}
              variant="outlined"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={otp}
              autoComplete="off"
              onChange={handleChangeOtp}
              inputProps={{ maxLength: 6 }}
              error={Boolean(errorOtp)}
              helperText={errorOtp}
            />
          )}
          {successMsg && (
            <Typography
              color="success.main"
              textAlign="center"
              fontWeight={500}
              mt={1}
              maxWidth={300}
            >
              {countdown === 0
                ? ""
                : finalSuccessMsg
                ? finalSuccessMsg
                : successMsg}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            mx: 2,
            mb: 1,
            display: "flex",
            justifyContent:
              successMsg && !finalSuccessMsg ? "space-between" : "flex-end",
          }}
        >
          {successMsg && !finalSuccessMsg ? (
            <Box
              variant="body2"
              onClick={
                countdown === 0
                  ? domainLoading
                    ? () => {}
                    : handleDomainChangeSend
                  : () => {}
              }
              sx={{
                color: domainLoading ? "lightgray" : "#107ACB",
                cursor:
                  countdown === 0
                    ? domainLoading
                      ? "default"
                      : "pointer"
                    : "default",
                // textAlign: "start",
                // ml: 8,
                mr: 1,
              }}
            >
              {countdown === 0
                ? "Resend"
                : countdown !== 0
                ? `${Math.floor(countdown / 60)}:${(countdown % 60)
                    .toString()
                    .padStart(2, "0")}`
                : ""}
            </Box>
          ) : (
            ""
          )}
          <Box>
            <Button
              onClick={() => handleCancel()}
              variant="outlined"
              color="error"
              size="small"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                otp.length === 6
                  ? handleDomainOtpConfirm()
                  : handleDomainChangeSend();
              }}
              variant="outlined"
              color="info"
              disabled={
                finalSuccessMsg
                  ? true
                  : successMsg
                  ? domainOtpLoading
                    ? true
                    : Boolean(otp.length !== 6)
                  : domainLoading
                  ? true
                  : !selectedDomain
                  ? true
                  : domainOtpLoading
                  ? true
                  : false
              }
              size="small"
            >
              {successMsg ? "Submit OTP" : "Send OTP"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      ;
    </>
  );
}
