import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
// import { sample } from 'lodash';
import {
  // useEffect,
  useState,
} from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  // Avatar,
  Button,
  Popover,
  // Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  CircularProgress,
} from "@mui/material";
// components
import Label from "../../../components/label";
// import Iconify from '../components/iconify';
// import Scrollbar from "../../components/common/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../../components/common/user";
// mock
// import USERLIST from "../../_mock/user";
import { Icon } from "@iconify/react";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
// import AssignDrawerAcademy from "../../../components/common/drawer/AssignDrawerAcademy";
// import EditDrawer from "../../components/common/drawer/EditDrawer";
import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import {
  useDispatch,
  // useSelector
} from "react-redux";
// import { fetchDomainList } from "../../store/Slices/internship/domainListSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {
  AdminService,
  TalentConnectService,
} from "../../../services/dataService";
import PostJobDrawer from "../../common/drawer/PostJobDrawer";
import AddPostJobDrawer from "../../common/drawer/AddPostJobDrawer";
import EditPostJobDrawer from "../../common/drawer/EditPostJobDrawer";
import ViewJobDrawer from "../../common/drawer/ViewJobDrawer";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "job_id", label: "Sl. No", alignRight: false },
  { id: "job_title", label: "Job Title", alignRight: false },
  { id: "job_role", label: "Job Role", alignRight: false },
  { id: "no_of_applications", label: "Applications", alignRight: false },
  { id: "start_date", label: "Start Date", alignRight: false },
  { id: "end_date", label: "End Date", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "", label: "Action", alignRight: true },
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
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function JobPost() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  // const domainList = useSelector((state) => state.domainList.domainList);
  // const isLoading = useSelector((state) => state.domainList.isLoading);

  useEffect(() => {
    // Call the async thunk when the component mounts or as needed
    dispatch(fetchDomainList());
  }, [dispatch]);

  const [selectedAssignItems, setSelectedAssignItems] = useState(null);
  // const [selectedEditItems, setSelectedEditItems] = useState();
  const [selectedColleges, setSelectedColleges] = useState([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isAssignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  // const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [setectedRow, setSetectedRow] = useState([]);
  const [academyName, setAcademyName] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [isViewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editData, setEditData] = useState({});
  // const [academyId, setAcademyId] = useState(null);

  // const [instituteList, setInstituteList] = useState([]);
  // Function to open the drawer and set the selected item
  // const dispatch = useDispatch();
  // const isLoadingDomainList = useSelector((state)=> state.domainList.isLoading)




  const foundAcademy = academyName.find(
    (academy) => academy.domain_email === true
  );
  const isDomainEmailId = foundAcademy?.job_id;

  // const handleAddDomain = (newDomain) => {
  //   console.log("Adding a new domain:", newDomain);
  // };

  //..........................................
  const fetchSingleData = async (job_id) => {
    if (job_id) {
      try {
        const { data } = await TalentConnectService.single_job(job_id);
        setEditData(data?.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fatchDateAcademy = async () => {
    try {
      const response = await TalentConnectService.job_list();
      const data = response.data.data;
      setAcademyName(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
    }
  };
  useEffect(() => {
    fatchDateAcademy();
  }, [refreshTable]);
  //...........................................

  const updateAcademy = async (selectedAssignItems) => {
    try {
      // const response = await AdminService.admin_academy_update(
      //   selectedAssignItems
      // );
      // const data = response.data;
      // handleSuccessMessage(data.detail);
      closeDrawer();
      setSelectedColleges([]);
    } catch (error) {
      handleErrorMessage(error.message);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedAssignItems) {
      updateAcademy(selectedAssignItems);
    }
  }, [selectedAssignItems]);

  //...................................................

  const DOMAIN_LIST = academyName.map((item) => ({
    // id: item.job_id,
    sl_no: item.sl_no,
    job_id: item.job_id,
    job_title: item.job_title,
    job_role: item.job_role,
    no_of_applications: item.no_of_post,
    startDate: item.reg_start,
    endDate: item.reg_end,
    status: item.status, // You can replace this with the actual status data if available
  }));

  const openAssignDrawer = (item) => {
    // setSelectedAssignItems(item)
    // setSelectedItem(item);
    // // setAcademyId(item.id)
    // setAssignDrawerOpen(true);
    // handleCloseMenu();
  };
  const openAddDrawer = () => {
    setAddDrawerOpen(true);
    handleCloseMenu();
  };
  const openEditDrawer = (item) => {
    setSelectedItem(item);
    // setAcademyId(item.id)
    setEditDrawerOpen(true);
    handleCloseMenu();
  };
  // Function to close the drawer
  const closeDrawer = () => {
    // setEditDrawerOpen(false);
    setAddDrawerOpen(false);
    setAssignDrawerOpen(false);
    setEditDrawerOpen(false);
    setViewDrawerOpen(false);
  };

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSetectedRow(row);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = DOMAIN_LIST.map((n) => n.job_title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DOMAIN_LIST.length) : 0;

  const filteredUsers = applySortFilter(
    DOMAIN_LIST,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;
  let superAdmin = false;

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

  const openViewDrawer = (item) => {
    setViewDrawerOpen(true);
    fetchSingleData(item?.job_id);
    // fetchSingleJd();
    handleCloseMenu();
  };

  return (
    <>
      <Helmet>
        <title> Job Post | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
          >
            Welcome back to Job Post !
          </Typography>
          <Button
            variant="contained"
            color="info"
            sx={{ textTransform: "initial" }}
            startIcon={<Icon icon="eva:plus-fill" />}
            onClick={() => openAddDrawer()}
          >
            Add Job Post
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          {loadingTable ? ( // Check if data is loading
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "50vh",
              }}
            >
              <CircularProgress color="info" size={50} />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={DOMAIN_LIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        sl_no,
                        job_id,
                        job_title,
                        job_role,
                        no_of_applications,
                        startDate,
                        endDate,
                        status,
                      } = row;
                      const selectedUser = selected.indexOf(job_title) !== -1;

                      return (
                        <TableRow
                          hover
                          key={job_id}
                          tabIndex={-1}
                          // role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3, pl: 3 }}
                          >
                            {/* {page * rowsPerPage + index + 1} */}
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
                              <Typography
                                variant="subtitle2"
                                noWrap
                                sx={{
                                  maxWidth: "25ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {job_title}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Stack
                              direction="row"
                              alignItems="start"
                              spacing={2}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 400,
                                  maxWidth: "25ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                noWrap
                              >
                                {job_role}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Stack
                              direction="row"
                              alignItems="start"
                              sx={{ pl: 2 }}
                              spacing={2}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 400 }}
                                noWrap
                              >
                                {no_of_applications}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Stack
                              direction="row"
                              alignItems="start"
                              spacing={2}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 400 }}
                                noWrap
                              >
                                {startDate}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Stack
                              direction="row"
                              alignItems="start"
                              spacing={2}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 400 }}
                                noWrap
                              >
                                {endDate}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Label
                              color={
                                status === "Close"
                                  ? "error"
                                  : status === "Publish"
                                  ? "success"
                                  : "info"
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
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: "center",
                            py: 4,
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
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={DOMAIN_LIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            minWidth: 100,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        {/* <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          // disabled={setectedRow.id === isDomainEmailId}
          onClick={() => openAssignDrawer(setectedRow)}
          disabled
        >
          <Icon icon={"material-symbols:assignment-outline"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Assign</Typography>
        </MenuItem> */}
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          // disabled
          onClick={() => openViewDrawer(setectedRow)}
        >
          <Icon icon={"lucide:view"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>View</Typography>
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          // disabled
          onClick={() => openEditDrawer(setectedRow)}
        >
          <Icon icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Edit</Typography>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          disabled={!superAdmin}
        >
          <Icon icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Delete</Typography>
        </MenuItem>
      </Popover>
      {/* Render the CommonDrawer component with dynamic fields */}
      <PostJobDrawer
        title={"Update Institute"}
        isOpen={isAssignDrawerOpen}
        onClose={closeDrawer}
        drawerData={selectedItem}
        collageList={DOMAIN_LIST}
        setSelectedColleges={setSelectedColleges}
        selectedColleges={selectedColleges}
        setSelectedAssignItems={setSelectedAssignItems}
        setRefreshTable={setRefreshTable}
        fields={[
          { name: "name", label: "Institute Name" },
          { name: "status", label: "Status", type: "switch" },
        ]}
      />
      <AddPostJobDrawer
        title={"Add Job Post"}
        isOpen={isAddDrawerOpen}
        onClose={closeDrawer}
        // drawerData={selectedItem}
        collageList={DOMAIN_LIST}
        setSelectedColleges={setSelectedColleges}
        selectedColleges={selectedColleges}
        setRefreshTable={setRefreshTable}
        setSelectedAssignItems={setSelectedAssignItems}
        fields={[
          { name: "name", label: "Institute Name" },
          { name: "status", label: "Status", type: "switch" },
        ]}
      />
      <EditPostJobDrawer
        title={"Edit Job Post"}
        isOpen={isEditDrawerOpen}
        onClose={closeDrawer}
        drawerData={selectedItem}
        collageList={DOMAIN_LIST}
        setRefreshTable={setRefreshTable}
        setSelectedColleges={setSelectedColleges}
        selectedColleges={selectedColleges}
        setSelectedAssignItems={setSelectedAssignItems}
        fields={[
          { name: "name", label: "Institute Name" },
          { name: "status", label: "Status", type: "switch" },
        ]}
      />
      <ViewJobDrawer
        isOpen={isViewDrawerOpen}
        onClose={closeDrawer}
        viewData={
          editData
          // selectedRowData && {
          //   ...selectedRowData,
          //   selection_process: selectedRowData.selection_process
          //     ? JSON.parse(selectedRowData.selection_process)
          //     : {},
          //   skill_required: selectedRowData.skill_required
          //     ? JSON.parse(selectedRowData.skill_required)
          //     : [],
          //   year_of_passing: selectedRowData.year_of_passing
          //     ? JSON.parse(selectedRowData.year_of_passing)
          //     : "",
          // }
        }
        isJobView = {true}
        title={"View Details"}
      />
      {/* <EditDrawer
        title={selectedItem ? "Edit Domain" : "Add Doamin"}
        isOpen={isEditDrawerOpen}
        onClose={closeDrawer}
        drawerData={selectedItem}
        setSelectedEditItems={setSelectedEditItems}
        onAddDomain={handleAddDomain}
        fields={[
          { name: "name", label: "Domain Name" },
          // { name: "email", label: "Email" },
          // { name: "mobile", label: "Mobile" },
          { name: "status", label: "Status", type: "switch" },
          // { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
          // Add more fields as needed
        ]}
      /> */}
    </>
  );
}
