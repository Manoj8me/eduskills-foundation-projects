import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Box,
  Typography,
  Button,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  useTheme,
  Tooltip,
  Badge,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { StaffService } from "../../services/dataService";
import { Icon } from "@iconify/react/dist/iconify.js";
import { tokens } from "../../theme";
import CustomPagination from "./CustomPagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx"; // Import xlsx

const passoutYears = Array.from({ length: 41 }, (_, i) => 2000 + i);

const InternshipAll = () => {
  const [page, setPage] = useState(1); // API page starts from 1
  const [rowsPerPage, setRowsPerPage] = useState(5); // Matches API's page_size
  const [totalPages, setTotalPages] = useState(0); // To keep track of total pages
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Holds the debounced search term
  const [modalOpen, setModalOpen] = useState(false);
  const [dataCache, setDataCache] = useState({}); // Cache for storing pages of data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Separate loading for search
  const [selectedData, setSelectedData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [anchorElMap, setAnchorElMap] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [failModalOpen, setFailModalOpen] = useState(false); // New state for fail modal
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [otpSent, setOtpSent] = useState(false); // New state to track OTP sent
  const [otp, setOtp] = useState(""); // New state for OTP input
  const [timer, setTimer] = useState(14 * 60); // 14 minutes in seconds
  const [canResend, setCanResend] = useState(false); // Controls resend availability
  const [isOtpValid, setIsOtpValid] = useState(false); // State to check OTP validity

  useEffect(() => {
    if (!dataCache[page] || debouncedSearchTerm) {
      fetchData(page, rowsPerPage, debouncedSearchTerm);
    } else {
      setData(dataCache[page]);
    }
  }, [page, rowsPerPage, debouncedSearchTerm]);

  // Debounced effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm === "") {
        // If search term is cleared, fetch all data without filters
        fetchData(1, rowsPerPage);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async (page, pageSize, search = "") => {
    const isSearching = search !== "";
    if (isSearching) {
      setSearchLoading(true); // Show search-specific loading
    } else {
      setLoading(true); // Regular loading
    }

    try {
      const response = await StaffService.getUserForFinalYear(
        page,
        pageSize,
        search
      );
      const { user_response, total_pages } = response.data;

      // Cache the page data and update state
      setDataCache((prevCache) => ({
        ...prevCache,
        [page]: user_response,
      }));
      setData(user_response);
      setTotalPages(total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false); // Stop both loading indicators
    }
  };

  const handleMenuClick = (event, userId) => {
    setAnchorElMap((prev) => ({
      ...prev,
      [userId]: event.currentTarget,
    }));
  };

  const handleMenuClose = (userId) => {
    setAnchorElMap((prev) => {
      const newMap = { ...prev };
      delete newMap[userId];
      return newMap;
    });
  };

  const handleModalOpen = (rowData) => {
    setSelectedData(rowData);
    setEditableData(rowData);
    setModalOpen(true);
    handleMenuClose(rowData.user_id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedData(null);
  };

  const handlePassoutYearChange = (event, newValue) => {
    setEditableData((prevData) => ({
      ...prevData,
      passout_year: newValue,
    }));
  };

  const savePassoutYear = async () => {
    setIsSaving(true);
    try {
      await StaffService.updateFinalYearDetails(
        editableData.user_id,
        editableData.passout_year
      );
      toast.success("Passout year updated successfully.");
      fetchData(page, rowsPerPage, debouncedSearchTerm); // Refresh data after updating
      handleModalClose();
    } catch (error) {
      console.error("Error updating passout year:", error);
      toast.error("Failed to update passout year.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFailModalOpen = (rowData) => {
    setSelectedData(rowData);
    setFailModalOpen(true);
    handleMenuClose(rowData.user_id);
  };

  const handleFailModalClose = () => {
    setFailModalOpen(false);
    setSelectedData(null);
  };

  // const markAsFailed = async () => {
  //   setIsSaving(true);
  //   try {
  //     const response = await StaffService.markAsFailed(selectedData.user_id);

  //     if (response.status === 200) {
  //       toast.success("Student marked as failed.");
  //       fetchData(page, rowsPerPage, debouncedSearchTerm); // Refresh data after updating
  //       handleFailModalClose();
  //     } else if (response.status === 400) {
  //       toast.error("Invalid request. Please check the input data.");
  //     } else if (response.status === 404) {
  //       toast.error("Internship not found.");
  //     } else if (response.status === 500) {
  //       toast.error("Server error. Please try again later.");
  //     } else {
  //       toast.error("An unexpected error occurred.");
  //     }
  //   } catch (error) {
  //     console.error("Error marking student as failed:", error);
  //     toast.error("Failed to mark as failed. Please try again.");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // Effect to handle the countdown timer
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval); // Clear interval on unmount or reset
    } else if (timer === 0) {
      setCanResend(true); // Allow resend when timer hits zero
    }
  }, [otpSent, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const sendOtp = async () => {
    setIsSaving(true);
    try {
      await StaffService.sendOtpMarkAsFailed(selectedData.user_id); // API call to send OTP
      toast.success("OTP sent successfully.");
      setOtpSent(true); // Show OTP input after sending
      setTimer(1 * 60); // Reset timer to 14 minutes
      setCanResend(false); // Disable resend until timer expires
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP.");
    } finally {
      setIsSaving(false);
    }
  };

  const verifyOtpAndMarkAsFailed = async () => {
    console.log(otp);
    setIsSaving(true);
    try {
      const response = await StaffService.verifyOtpAndMarkAsFailed(
        selectedData.user_id,
        otp
      );

      if (response.status === 200) {
        toast.success("Student marked as failed.");
        fetchData(page, rowsPerPage, debouncedSearchTerm);
        handleFailModalClose();
      } else {
        // Handle specific response statuses
        switch (response.status) {
          case 400:
            toast.error("Invalid OTP. Please try again.");
            break;
          case 401:
            toast.error("Unauthorized access. Please log in and try again.");
            break;
          case 403:
            toast.error(
              "Forbidden action. You don't have permission to mark this as failed."
            );
            break;
          case 404:
            toast.error("User not found. Please verify the user ID.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error("Failed to mark as failed. Please verify the OTP.");
        }
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      toast.error("Failed to mark as failed. Please try again.");
    } finally {
      setIsSaving(false);
      setOtp(""); // Clear OTP input after verification
    }
  };

  const handleOtpChange = (event) => {
    const inputOtp = event.target.value;
    setOtp(inputOtp);
    setIsOtpValid(/^\d{6}$/.test(inputOtp)); // Check if OTP is exactly 6 digits
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // Adjust to API's 1-based index
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to the first page when changing rows per page
    setDataCache({}); // Clear cache when rows per page changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to page 1 on search term change
  };

  // const exportToExcel = () => {
  //   const exportData = data.map((row, index) => ({
  //     "SL No": index + 1 + (page - 1) * rowsPerPage,
  //     "Full Name": row.name,
  //     Email: row.email,
  //     "Passout Year": row.passout_year,
  //     Cohort: row.cohort ? `Cohort ${row.cohort}` : "Not Applied",
  //     Status:
  //       row.status === "1"
  //         ? "Not Applied"
  //         : row.status === "2"
  //         ? "Ongoing"
  //         : row.status === "3"
  //         ? "Completed"
  //         : row.status === "4"
  //         ? "Failed"
  //         : "Applied",
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Internship Data");

  //   // Generate the file and prompt download
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });
  //   const blobData = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(blobData, "Internship_Data.xlsx");
  // };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pt: { xs: 1, sm: 2, md: 1 },
        pb: { xs: 1, sm: 2, md: 3 },
        pl: { xs: 1, sm: 2, md: 3 },
        pr: { xs: 1, sm: 2, md: 3 },
        boxSizing: "border-box",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          maxWidth: "100%", // Updated to full-width across all screen sizes
          m: "auto",
          // px: { xs: 2, sm: 3, md: 4 }, // Responsive padding for small to large screens
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            mt: 2,
            ml: 2,
            fontWeight: "bold",
            color: colors.blueAccent[300],
          }}
        >
          Welcome to Student Info !
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          p={2}
          flexWrap="wrap"
        >
          <TextField
            label="Search Email"
            variant="outlined"
            size="small"
            sx={{
              width: 220,
              height: `${28}px !important`,
              transition: "width 0.3s",
              "& fieldset": {
                borderWidth: "1px !important",
                borderColor: `gray !important`,
              },
              "&.MuiInputBase-root, &.MuiOutlinedInput-root": {
                paddingRight: "2px !important",
              },
              [theme.breakpoints.down("sm")]: {
                width: 160,
              },
            }}
            value={searchTerm}
            onChange={handleSearchChange}
            helperText={
              debouncedSearchTerm && data.length === 0
                ? "No results found. Please check your spelling."
                : data.length
                ? ""
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchLoading ? (
                <InputAdornment position="end">
                  <CircularProgress color="info" size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
          {/* <Button
            variant="outlined"
            color="info"
            onClick={exportToExcel}
            size="small"
          >
            Export to XLSX
          </Button> */}
        </Box>

        <TableContainer
          sx={{
            maxHeight: 350,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#555",
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "SL No",
                  "Full Name",
                  "Email",
                  //"Course",
                  //"Branch",
                  "Passout Year",
                  "Cohort",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align={header === "Status" ? "center" : "left"}
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ height: 300 }}>
                  <TableCell align="center" colSpan={11}>
                    <CircularProgress color="info" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={row.user_id}>
                    <TableCell>
                      {index + 1 + (page - 1) * rowsPerPage}
                    </TableCell>
                    <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}>
                      <Tooltip title={row.name}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "20ch", // Adjust this value as needed
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.name}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}>
                      <Tooltip title={row.email}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "20ch", // Adjust this value as needed
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.email}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    {/* <TableCell>{row.course}</TableCell> */}
                    {/* <TableCell>{row.branch}</TableCell> */}
                    <TableCell>
                      <Tooltip title={row.passout_year}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "20ch", // Adjust this value as needed
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.passout_year}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          row.cohort ? `Cohort ${row.cohort}` : "Not Applied"
                        }
                      >
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "20ch", // Adjust this value as needed
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.cohort ? `Cohort ${row.cohort}` : "Not Applied"}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="center">
                      <Badge
                        badgeContent={
                          <Typography
                            sx={{
                              whiteSpace: "nowrap",
                              color: row.status === "1" ? "white" : "inherit",
                              // bgcolor:"gray",
                              // borderRadius: "8px",
                              // padding: "4px 8px",
                            }}
                          >
                            {row.status === "0"
                              ? "Applied"
                              : row.status === "1"
                              ? "Not Applied"
                              : row.status === "2"
                              ? "Ongoing"
                              : row.status === "3"
                              ? "Completed"
                              : "Failed"}
                          </Typography>
                        }
                        color={
                          row.status === "0"
                            ? "warning"
                            : row.status === "1"
                            ? "default"
                            : row.status === "2"
                            ? "info"
                            : row.status === "3"
                            ? "success"
                            : "error"
                        }
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: 12,
                            minWidth: "unset",
                            padding: "4px 8px",
                            backgroundColor: row.status === "1" && "gray", // Set gray background for "Not Applied"
                          },
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, row.user_id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorElMap[row.user_id]}
                        open={Boolean(anchorElMap[row.user_id])}
                        onClose={() => handleMenuClose(row.user_id)}
                      >
                        <MenuItem
                          sx={{ color: "warning.main" }}
                          onClick={() => handleModalOpen(row)}
                        >
                          <Icon icon={"carbon:calendar"} />
                          <Typography sx={{ ml: 0.5, fontSize: 12 }}>
                            Passout Year Change
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleFailModalOpen(row)}
                          disabled={row.internship_status === "0"}
                          sx={{
                            color:
                              row.internship_status === "0" ? "gray" : "red",
                          }}
                        >
                          <Icon
                            icon="mdi:alert-circle-outline"
                            style={{ color: "red", marginRight: "8px" }}
                          />
                          Mark as Fail
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Display Current Page and Total Pages */}
        {/* <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor={theme.palette.mode === "dark" ? "#303030" : "#FAFAFA"} // Adjust background color for dark mode
          px={1.4}
          py={0.7}
        >
          <Typography
            variant="body2"
            sx={{
              mr: 2,
              color: theme.palette.mode === "dark" ? "white" : "black", // Set text color based on theme
            }}
          >
            Page {page} of {totalPages}
          </Typography>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPages * rowsPerPage} // Approximate total for MUI pagination
            rowsPerPage={rowsPerPage}
            page={page - 1} // Adjust for 0-based MUI index
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: theme.palette.mode === "dark" ? "white" : "black", // Set pagination text color based on theme
            }}
          />
        </Box> */}

        <CustomPagination
          count={totalPages * rowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
            setDataCache({});
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />

        <Dialog
          open={modalOpen}
          onClose={handleModalClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Change Passout Year</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={passoutYears}
              getOptionLabel={(option) => option.toString()}
              value={editableData.passout_year || null}
              size="small"
              onChange={handlePassoutYearChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Passout Year"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2 }}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleModalClose}
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={savePassoutYear}
              disabled={isSaving}
              color="info"
              size="small"
            >
              {isSaving ? <CircularProgress size={20} /> : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* <Dialog
          open={failModalOpen}
          onClose={handleFailModalClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Icon
              icon="mdi:alert-outline"
              style={{ color: "red", marginRight: "8px" }}
            />
            Confirmation
          </DialogTitle>
          <DialogContent sx={{ pb: 1, pt: 1 }}>
            Are you sure you want to mark this student as failed?
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleFailModalClose}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={markAsFailed}
              color="info"
              disabled={isSaving}
            >
              {isSaving ? <CircularProgress size={20} /> : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog> */}

        <Dialog
          open={failModalOpen}
          onClose={handleFailModalClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Icon
              icon="mdi:alert-outline"
              style={{ color: "red", marginRight: "8px" }}
            />
            Confirmation
          </DialogTitle>
          <DialogContent sx={{ pb: 1, pt: 1 }}>
            {otpSent ? (
              <>
                <TextField
                  label="Enter OTP"
                  variant="outlined"
                  size="small"
                  value={otp}
                  onChange={handleOtpChange}
                  fullWidth
                  sx={{ mt: 2 }}
                  inputProps={{ maxLength: 6 }} // Limit input to 6 characters
                  disabled={canResend} // Disable input if Resend OTP is enabled
                />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 1 }}
                >
                  {canResend ||
                    (otpSent && (
                      <Typography variant="body2" color={"green"}>
                        Please enter the OTP.
                      </Typography>
                    ))}
                  <Typography variant="body2" color="blue">
                    {canResend
                      ? "You can resend OTP now."
                      : `Resend in ${formatTime(timer)}`}
                  </Typography>
                </Box>
              </>
            ) : (
              "Are you sure you want to mark this student as failed?"
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleFailModalClose}
            >
              Cancel
            </Button>
            {otpSent ? (
              otp && isOtpValid ? (
                <Button
                  variant="outlined"
                  onClick={verifyOtpAndMarkAsFailed}
                  color="info"
                  disabled={isSaving || !otp}
                >
                  {isSaving ? <CircularProgress size={20} /> : "Verify OTP"}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={sendOtp}
                  color="info"
                  disabled={isSaving || !canResend}
                >
                  {isSaving ? <CircularProgress size={20} /> : "Resend OTP"}
                </Button>
              )
            ) : (
              <Button
                variant="outlined"
                onClick={sendOtp}
                color="info"
                disabled={isSaving}
              >
                {isSaving ? <CircularProgress size={20} /> : "Send OTP"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default InternshipAll;
