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
  Select,
  FormControl,
  InputLabel,
  Box,
  Drawer,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Tooltip,
  colors,
  useTheme,
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { tokens } from "../../../theme";
//import LoadingButton from '@mui/lab/LoadingButton';
import { toast, ToastContainer } from "react-toastify";
import dataService, { StaffService } from "../../../services/dataService";

const statusColors = {
  2: { background: "#e3f2fd", color: "#2196f3" },
  3: { background: "#e8f5e9", color: "#4caf50" },
  4: { background: "#ffebee", color: "#f44336" },
};

const LoadingButton = ({ loading, children, ...props }) => (
  <Button {...props} disabled={loading || props.disabled}>
    {loading ? <CircularProgress size={24} /> : children}
  </Button>
);

const Apsche = () => {
  //const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [action, setAction] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [editableCourses, setEditableCourses] = useState([]);
  const [editableBranches, setEditableBranches] = useState([]);
  const [editableSemesters, setEditableSemesters] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorElMap, setAnchorElMap] = useState({});
  const isStatusDisabled = (status) => status === 3 || status === 4;
  const getCompositeKey = (userId, isLongTermApplied) =>
    `${userId}-${isLongTermApplied}`;

  useEffect(() => {
    fetchData();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      //   const response = await axios.get(
      //     "http://192.168.1.12:8000/internship/courseDropdown"
      //   );

      const response = await StaffService.getCourseDropdown();
      console.log(response);
      setCourses(response.data);
      setEditableCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchBranches = async (courseId) => {
    try {
      //   const response = await axios.get(
      //     `http://192.168.1.12:8000/internship/branchDropdown/${courseId}`
      //   );
      const response = await StaffService.getBranchDropdown(courseId);
      console.log(response, "branches");
      setBranches(response.data);
      setEditableBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      //   const response = await axios.get(
      //     `http://192.168.1.12:8000/internship/semesterDropdown/${courseId}`
      //   );
      const response = await StaffService.getSemesterDropdown(courseId);
      console.log(response, "semesters");
      setSemesters(response.data);
      setEditableSemesters(response.data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    setSelectedBranch("");
    setSelectedSemester("");
    fetchBranches(courseId);
    fetchSemesters(courseId);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await StaffService.getUserForApproval();
      setData(response.data.user_response);
      console.log(response.data.user_response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter(
          (selectedItem) =>
            selectedItem.user_id !== item.user_id ||
            selectedItem.is_longterm_applied !== item.is_longterm_applied
        )
      );
    }
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      // Filter out rows with status 3 (Approved) and status 4 (Rejected)
      const selectableItems = filteredData.filter(
        (item) => item.is_apsche_status !== 3 && item.is_apsche_status !== 4
      );
      setSelectedItems(selectableItems);
    } else {
      setSelectedItems([]);
    }
  };

  const isItemSelected = (item) => {
    return selectedItems.some(
      (selectedItem) =>
        selectedItem.user_id === item.user_id &&
        selectedItem.is_longterm_applied === item.is_longterm_applied
    );
  };

  const handleBulkApprove = async () => {
    try {
      setIsSubmitting(true);
      const approvalData = selectedItems.map((item) => ({
        user_id: item.user_id,
        is_longterm_applied: item.is_longterm_applied,
        is_apsche_status: 3,
      }));

      const dataToSend = { data: approvalData };
      console.log(dataToSend);

      const response = await StaffService.bulkApproval(dataToSend);
      console.log(response.data);

      // Fetch updated data after successful bulk approval
      await fetchData();

      toast.success("Selected students have been approved successfully.");
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error in bulk approval:", error);
      toast.error("Failed to approve selected students. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReject = async (action) => {
    if (action === "reject" && remark.trim() === "") {
      toast.error("Please add a reason");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = {
        is_apsche_status: action === "approve" ? 3 : 4,
        is_longterm_applied: selectedData.is_longterm_applied,
        user_id: selectedData.user_id, // Include user_id in the request
      };

      if (action === "reject") {
        data.remark = remark;
      }

      const response = await StaffService.rejectAndApproval(data, selectedData);

      console.log(response.data);

      // Fetch updated data after successful approval/rejection
      await fetchData();

      handleDrawerClose();
      toast.success(
        `Student successfully ${
          action === "approve" ? "approved" : "rejected"
        }.`
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to ${action} student. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [editableData, setEditableData] = useState({
    sl_no: "",
    name: "",
    domain: "",
    email: "",
    roll_no: "",
    branch: "",
    semester: "",
    status: "",
    university_name: "",
    institute_name: "",
    course: "",
    user_id: "",
  });

  const handleMenuClick = (event, userId, isLongTermApplied) => {
    const compositeKey = getCompositeKey(userId, isLongTermApplied);
    setAnchorElMap((prev) => ({
      ...prev,
      [compositeKey]: event.currentTarget,
    }));
  };

  const handleMenuClose = (userId, isLongTermApplied) => {
    const compositeKey = getCompositeKey(userId, isLongTermApplied);
    setAnchorElMap((prev) => {
      const newMap = { ...prev };
      delete newMap[compositeKey];
      return newMap;
    });
  };

  const handleDrawerOpen = (action, rowData) => {
    setAction(action);
    setSelectedData(rowData);
    setEditableData(rowData);
    setDrawerOpen(true);
    handleMenuClose(rowData.user_id, rowData.is_longterm_applied);

    if (action === "edit") {
      fetchCourses();
      fetchBranches(rowData.program_id);
      fetchSemesters(rowData.program_id);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "program_id") {
      fetchBranches(value);
      fetchSemesters(value);
    }
  };

  const handleSaveChanges = async () => {
    try {
      //   const response = await axios.put(
      //     `http://192.168.1.12:8000/internship/updateDetails/${editableData.user_id}`,
      //     {
      //       program_id: editableData.program_id,
      //       branch: editableData.branch,
      //       roll_no: editableData.roll_no,
      //       semester: editableData.semester,
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //       },
      //     }
      //   );

      const response = await StaffService.updateDetails(editableData);

      console.log("Update response:", response.data);
      toast.success("Details updated successfully");
      handleDrawerClose();
      fetchData(); // Refresh the data after update
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("Failed to update details. Please try again.");
    }
  };

  const filteredData = data.filter((row) => {
    // console.log(selectedCourse, selectedBranch, selectedSemester);
    const courseMatch = !selectedCourse || row.course_id === selectedCourse;
    const branchMatch = !selectedBranch || row.branch === selectedBranch;
    const semesterMatch =
      !selectedSemester || row.semester === selectedSemester;

    const searchTermMatch =
      searchTerm === "" ||
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.email &&
        row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      row.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.university_name &&
        row.university_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      row.institute_name.toLowerCase().includes(searchTerm.toLowerCase());

    return courseMatch && branchMatch && semesterMatch && searchTermMatch;
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="info" />
      </Box>
    );
  }
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        maxWidth: 1200,
        marginTop: 4,
        marginRight: "auto",
        marginLeft: "auto",
        marginBottom: 7,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          mt: 2,
          ml: 5,
          fontWeight: "bold",
          color: colors.blueAccent[300],
        }}
      >
        Welcome to Certificate Approval !
      </Typography>
      {data.length > 0 ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            p={2}
            flexWrap="wrap"
          >
            <Box display="flex" gap={2} mb={2} alignItems="center">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  label="Course"
                >
                  <MenuItem value="">Select Course</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.program_id} value={course.program_id}>
                      {course.program_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  label="Branch"
                  disabled={!selectedCourse}
                >
                  <MenuItem value="">All Branches</MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={branch.branch_id} value={branch.branch_name}>
                      {branch.branch_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  label="Semester"
                  disabled={!selectedCourse}
                >
                  <MenuItem value="">All Semesters</MenuItem>
                  {semesters.map((semester) => (
                    <MenuItem key={semester} value={semester}>
                      {semester}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleBulkApprove}
                disabled={selectedItems.length === 0 || isSubmitting}
                sx={{ mr: 2 }}
              >
                Approve All ({selectedItems.length})
              </Button>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 1, minWidth: 200, alignSelf: "center" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          <Box sx={{ maxWidth: "xl", mx: "auto" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        sx={{ color: "white" }}
                      />
                    </TableCell>
                    {/* <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      SL NO
                    </TableCell> */}
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Full Name
                    </TableCell>
                    {/* <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Domain
                    </TableCell> */}
                    {/* <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Email
                    </TableCell> */}
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Roll No
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Course
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Branch
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Semester
                    </TableCell>
                    {/* <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      University Name
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Institute Name
                    </TableCell> */}
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Term
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isSelected = isItemSelected(row);
                        return (
                          <TableRow
                            key={`${row.user_id}-${row.is_longterm_applied}`}
                            sx={{
                              backgroundColor: isSelected
                                ? theme.palette.action.hover
                                : "inherit",
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            {/* <TableCell>{row.sl_no || "Not Available"}</TableCell> */}
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onChange={(event) =>
                                  handleCheckboxChange(event, row)
                                }
                                disabled={
                                  row.is_apsche_status === 3 ||
                                  row.is_apsche_status === 4
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={row.name} placement="top">
                                <span
                                  style={{
                                    display: "block",
                                    maxWidth: "150px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.name || "Not Available"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            {/* <TableCell>
                            <Tooltip title={row.domain} placement="top">
                              <span
                                style={{
                                  display: "block",
                                  maxWidth: "150px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.domain || "Not Available"}
                              </span>
                            </Tooltip>
                          </TableCell> */}
                            {/* <TableCell>
                            <Tooltip title={row.email} placement="top">
                              <span
                                style={{
                                  display: "block",
                                  maxWidth: "150px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.email || "Not Available"}
                              </span>
                            </Tooltip>
                          </TableCell> */}
                            <TableCell>
                              <Tooltip title={row.roll_no} placement="top">
                                <span
                                  style={{
                                    display: "block",
                                    maxWidth: "150px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.roll_no || "Not Available"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={row.course} placement="top">
                                <span
                                  style={{
                                    display: "block",
                                    maxWidth: "150px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.course || "Not Available"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={row.branch} placement="top">
                                <span
                                  style={{
                                    display: "block",
                                    maxWidth: "150px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.branch || "Not Available"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={row.semester} placement="top">
                                <span
                                  style={{
                                    display: "block",
                                    maxWidth: "150px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.semester || "Not Available"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            {/* <TableCell>
                            <Tooltip
                              title={row.university_name}
                              placement="top"
                            >
                              <span
                                style={{
                                  display: "block",
                                  maxWidth: "150px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.university_name || "Not Available"}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={row.institute_name} placement="top">
                              <span
                                style={{
                                  display: "block",
                                  maxWidth: "150px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.institute_name || "Not Available"}
                              </span>
                            </Tooltip>
                          </TableCell> */}
                            <TableCell>
                              <Tooltip
                                title={row.is_longterm_applied}
                                placement="top"
                              >
                                <span
                                  style={{
                                    display: "block",
                                    maxWidth: "150px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {row.is_longterm_applied === 1 && "Long-Term"}
                                  {row.is_longterm_applied === 0 &&
                                    "Short-Term"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  backgroundColor:
                                    statusColors[row.is_apsche_status]
                                      .background,
                                  color:
                                    statusColors[row.is_apsche_status].color,
                                  display: "inline-block",
                                  px: 2,
                                  py: 1,
                                  borderRadius: "19px",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.is_apsche_status === 2 && "Applied"}
                                {row.is_apsche_status === 3 && "Approved"}
                                {row.is_apsche_status === 4 && "Rejected"}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={(e) =>
                                  handleMenuClick(
                                    e,
                                    row.user_id,
                                    row.is_longterm_applied
                                  )
                                }
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={
                                  anchorElMap[
                                    getCompositeKey(
                                      row.user_id,
                                      row.is_longterm_applied
                                    )
                                  ]
                                }
                                open={Boolean(
                                  anchorElMap[
                                    getCompositeKey(
                                      row.user_id,
                                      row.is_longterm_applied
                                    )
                                  ]
                                )}
                                onClose={() =>
                                  handleMenuClose(
                                    row.user_id,
                                    row.is_longterm_applied
                                  )
                                }
                              >
                                <MenuItem
                                  onClick={() => handleDrawerOpen("view", row)}
                                >
                                  <ListItemIcon>
                                    <VisibilityIcon />
                                  </ListItemIcon>
                                  <ListItemText primary="View" />
                                </MenuItem>
                                {row.is_apsche_status !== 3 &&
                                  row.is_apsche_status !== 4 && (
                                    <>
                                      <MenuItem
                                        onClick={() =>
                                          handleDrawerOpen("edit", row)
                                        }
                                      >
                                        <ListItemIcon>
                                          <EditIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Edit" />
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDrawerOpen("approve", row)
                                        }
                                        sx={{ color: "green" }}
                                      >
                                        <ListItemIcon>
                                          <CheckCircleIcon
                                            sx={{ color: "green" }}
                                          />
                                        </ListItemIcon>
                                        <ListItemText primary="Approve" />
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDrawerOpen("reject", row)
                                        }
                                        sx={{ color: "red" }}
                                      >
                                        <ListItemIcon>
                                          <CancelIcon sx={{ color: "red" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Reject" />
                                      </MenuItem>
                                    </>
                                  )}
                              </Menu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerClose}
            sx={{ "& .MuiDrawer-paper": { width: 350, p: 2 } }}
          >
            <Typography variant="h6" gutterBottom>
              {action === "view" && "View Details"}
              {action === "edit" && "Edit Details"}
              {action === "approve" && "Approve Student"}
              {action === "reject" && "Reject Student"}
            </Typography>
            {selectedData && action === "view" && (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>Full Name:</strong> {selectedData.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Domain:</strong> {selectedData.domain}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {selectedData.email || "N/A"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Roll No:</strong> {selectedData.roll_no}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Course:</strong> {selectedData.course}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Branch:</strong> {selectedData.branch}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Semester:</strong> {selectedData.semester}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>University Name:</strong>{" "}
                  {selectedData.university_name || "N/A"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Institute Name:</strong> {selectedData.institute_name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Term:</strong>{" "}
                  {selectedData.user_id &&
                    selectedData.is_longterm_applied === 1 &&
                    "Long-Term"}
                  {selectedData.user_id &&
                    selectedData.is_longterm_applied === 0 &&
                    "Short-Term"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong>{" "}
                  {selectedData.is_apsche_status === 3 && "Approved"}
                  {selectedData.is_apsche_status === 4 && "Rejected"}
                  {selectedData.is_apsche_status === 2 && "Applied"}
                </Typography>
              </>
            )}

            {selectedData && action === "edit" && (
              <>
                <TextField
                  label="SL NO"
                  variant="outlined"
                  fullWidth
                  name="sl_no"
                  value={editableData.sl_no}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled
                />
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={editableData.name}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled
                />
                <TextField
                  label="Domain"
                  variant="outlined"
                  fullWidth
                  name="domain"
                  value={editableData.domain}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled
                />
                <TextField
                  label="Institute Name"
                  variant="outlined"
                  fullWidth
                  name="institute_name"
                  value={editableData.institute_name}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled
                />
                <TextField
                  label="Roll No"
                  variant="outlined"
                  fullWidth
                  name="roll_no"
                  value={editableData.roll_no}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Course</InputLabel>
                  <Select
                    name="program_id"
                    value={editableData.program_id || ""}
                    onChange={handleInputChange}
                    label="Course"
                  >
                    {editableCourses.map((course) => (
                      <MenuItem
                        key={course.program_id}
                        value={course.program_id}
                      >
                        {course.program_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name="branch"
                    value={editableData.branch || ""}
                    onChange={handleInputChange}
                    label="Branch"
                  >
                    {editableBranches.map((branch) => (
                      <MenuItem
                        key={branch.branch_id}
                        value={branch.branch_name}
                      >
                        {branch.branch_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Semester</InputLabel>
                  <Select
                    name="semester"
                    value={editableData.semester || ""}
                    onChange={handleInputChange}
                    label="Semester"
                  >
                    {editableSemesters.map((semester) => (
                      <MenuItem key={semester} value={semester}>
                        {semester}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="info"
                  onClick={handleSaveChanges}
                  sx={{ mt: 2 }}
                  disabled={
                    editableData.is_apsche_status === 3 ||
                    editableData.is_apsche_status === 4
                  }
                >
                  Save Changes
                </Button>
              </>
            )}

            {action === "approve" && (
              <>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Are you sure you want to approve this student?
                </Typography>
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={() => handleApproveReject("approve")}
                  disabled={isStatusDisabled(selectedData?.is_apsche_status)}
                >
                  {selectedData?.is_apsche_status === 3
                    ? "Approved"
                    : "Approve"}
                </LoadingButton>
              </>
            )}

            {action === "reject" && (
              <>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Please provide a reason for rejection:
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleApproveReject("reject")}
                  disabled={isStatusDisabled(selectedData?.is_apsche_status)}
                >
                  {selectedData?.is_apsche_status === 4 ? "Rejected" : "Reject"}
                </LoadingButton>
              </>
            )}
          </Drawer>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Typography variant="h6">No data available</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Apsche;
