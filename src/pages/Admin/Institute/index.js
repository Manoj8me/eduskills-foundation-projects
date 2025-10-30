import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState } from "react";
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
import EditDrawer from "../../../components/common/drawer/EditDrawer";
import AssignDrawer from "../../../components/common/drawer/AssignDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import { useEffect } from "react";
import { AdminService } from "../../../services/dataService";
import ViewDrawer from "../../../components/common/drawer/ViewDrawer";
import { toast } from "react-toastify";
import AddDrawer from "../../../components/common/drawer/AddDrawer";
import {
  fetchInstituteState,
  fetchMembershipPackage,
} from "../../../store/Slices/dashboard/statepackageSlice";
import CommonModal from "../../../components/common/modal/CommonModal";
import StaffInstitute from "../../../components/StaffSection/StaffInstitute";
import MouTable from "../../../components/Admin/MouTable";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "institue_id", label: "Sl. No", alignRight: false },
  { id: "name", label: "Institute Name", alignRight: false },
  { id: "mem_no", label: "Mem No", alignRight: false },
  { id: "state_name", label: "State Name", alignRight: false },
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
      (_user) =>
        _user.institute_name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CollegeList() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userRole = useSelector((state) => state.authorise.userRole);
  const dispatch = useDispatch();
  const domainList = useSelector((state) => state.domainList.domainList);
  // const isLoading = useSelector((state) => state.domainList.isLoading);

  const DOMAIN_LIST = domainList.map((item) => ({
    id: item.domain_id,
    collageName: item.domain_name,
    status: "active", // You can replace this with the actual status data if available
  }));

  useEffect(() => {
    // Call the async thunk when the component mounts or as needed
    if (userRole === "admin") {
      dispatch(fetchDomainList());
      dispatch(fetchInstituteState());
      dispatch(fetchMembershipPackage());
    }
  }, [dispatch]);

  const [collageList, setCollageList] = useState([]);
  const [viewCollage, setViewCollage] = useState();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedItem, setSelectedItem] = useState(null);
  const [setectedRow, setSetectedRow] = useState({});
  const [selectedEditItems, setSelectedEditItems] = useState(null);
  const [isAssignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setAddDrawerOpen] = useState(false);
  const [selectedAssignItems, setSelectedAssignItems] = useState(null);
  const [selectedAddItems, setSelectedAddItems] = useState(null);
  const [institueId, setInstitueId] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [mouToggle, setMouToggle] = useState(0);

  const instituteState = useSelector(
    (state) => state.statePackage.instituteState
  );

  const subscriptionData = useSelector(
    (state) => state.statePackage.membershipPackage
  );

  const membershipPackages = subscriptionData?.map((sub) => ({
    value: sub.valid_days.toString(), // Assuming valid_days is a number, convert it to string
    label: sub.sub_name,
  }));

  const instituteStates = instituteState?.map((sub) => ({
    value: sub.state_id.toString(), // Assuming valid_days is a number, convert it to string
    label: sub.state_name,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminService.admin_institute_list();
        const data = response.data.data;
        setCollageList(data);
      } catch (error) {
        console.error("Error fetching data:", error?.message);
      } finally {
        setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
      }
    };
    if (userRole === "admin") {
      fetchData();
    }
  }, [selectedAddItems, refreshTable]);

  const fetchInstituteDetails = async (institueId) => {
    try {
      const response = await AdminService.admin_institute(institueId);
      const data = response.data.data;
      setViewCollage(data[0]);
      setInstitueId(null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (institueId) {
      fetchInstituteDetails(institueId);
    }
  }, [institueId]);

  //...................................................

  const updateData = async (selectedEditItems) => {
    const updateEditItems = {
      institue_id: selectedEditItems.institue_id,
      data: {
        mem_no:
          selectedEditItems.mem_no !== ""
            ? parseInt(selectedEditItems.mem_no, 10)
            : 0,
        institute_name: selectedEditItems.institute_name,
        state_id: parseInt(selectedEditItems.state_name, 10),
        city_name: selectedEditItems.city_name,
        valid_days: parseInt(selectedEditItems.valid_days, 10),
        expire_date: selectedEditItems.expire_date,
        status: selectedEditItems.status === "Active" ? 1 : 0,
      },
    };

    try {
      const response = await AdminService.admin_institute_update(
        updateEditItems
      );
      const data = response.data;
      handleSuccessMessage(data.detail);
      setSelectedEditItems(null);
      setRefreshTable((prev) => !prev);
      setViewCollage([]);
      setSetectedRow({});
      closeDrawer();
    } catch (error) {
      handleErrorMessage(error.response.data.detail || error.message);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedEditItems) {
      updateData(selectedEditItems);
    }
  }, [selectedEditItems]);

  //............................................

  const addData = async (selectedAddItems) => {
    const updateAddItem = {
      ...selectedAddItems,
      mem_no: parseInt(selectedAddItems.mem_no, 10),
      state_id: parseInt(selectedAddItems.state_id, 10),
      valid_days: parseInt(selectedAddItems.valid_days, 10),
    };

    try {
      const response = await AdminService.admin_institute_add(updateAddItem);
      const data = response.data;
      handleSuccessMessage(data.detail);
      setRefreshTable((prev) => !prev);
      setSelectedAddItems(null);
      closeDrawer();
    } catch (error) {
      handleErrorMessage(error.response.data.detail || error.message);
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (selectedAddItems) {
      addData(selectedAddItems);
    }
  }, [selectedAddItems]);

  //...............................................

  const updateDomain = async (selectedAssignItems) => {
    try {
      const response = await AdminService.admin_inst_domain_update(
        selectedAssignItems
      );
      // const response = await AdminService.admin_damain_update(
      //   selectedAssignItems
      // );
      const data = response.data;
      handleSuccessMessage(data.detail);
      closeDrawer();
    } catch (error) {
      handleErrorMessage(error.response.data.detail || error.message);
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (selectedAssignItems) {
      updateDomain(selectedAssignItems);
    }
  }, [selectedAssignItems]);
  //........................................

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

  //...........................................................

  const openDeleteModal = (itemId) => {
    setDeleteModalOpen(true);
    setDeletingItemId(itemId);
    handleCloseMenu();
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingItemId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await AdminService.admin_institute_delete(
        deletingItemId
      );
      const data = response.data;
      handleSuccessMessage(data.detail);
      closeDeleteModal();
      setRefreshTable((prev) => !prev);
    } catch (error) {
      // Handle error, show notification, etc.
      handleErrorMessage(error.message);
      console.error("Error deleting item:", error);
    }
  };

  //.....................................................

  const openAssignDrawer = (item) => {
    setSelectedItem(item);
    setAssignDrawerOpen(true);
    handleCloseMenu();
  };

  const openEditDrawer = (item) => {
    setSelectedItem(item);
    setInstitueId(item.institue_id);
    setEditDrawerOpen(true);
    handleCloseMenu();
  };

  const openAddDrawer = () => {
    setAddDrawerOpen(true);
    handleCloseMenu();
  };

  const openViewDrawer = (item) => {
    setInstitueId(item.institue_id);
    fetchInstituteDetails(item.institue_id);
    // setViewCollage(item);
    setViewDrawerOpen(true);
    handleCloseMenu();
  };
  // Function to close the drawer
  const closeDrawer = () => {
    setEditDrawerOpen(false);
    setAssignDrawerOpen(false);
    setAddDrawerOpen(false);
    setSelected([]);
    setViewDrawerOpen(false);
    setViewCollage(null);
    setSelectedItem(null);
    setSetectedRow({});
    setInstitueId(null);
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
      const newSelecteds = collageList.map((n) => n.institute_name);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - collageList.length) : 0;

  const filteredUsers = applySortFilter(
    collageList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;
  // let superAdmin = false;

  return (
    <>
      <Helmet>
        <title> Institute | EduSkills </title>
      </Helmet>
      {userRole === "staff" ? (
        <Container maxWidth="xl" sx={{ my: 2 }}>
          <StaffInstitute />
        </Container>
      ) : mouToggle === 1 ? (
        <MouTable setMouToggle={setMouToggle} mouToggle={mouToggle} />
      ) : (
        <Container maxWidth="xl" sx={{ my: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: colors.blueAccent[300] }}
            >
              Welcome back to Institute !
            </Typography>
            <Button
              variant="contained"
              color="info"
              size="small"
              sx={{ textTransform: "initial" }}
              startIcon={<Icon icon="eva:plus-fill" />}
              onClick={() => openAddDrawer()}
            >
              Add Institute
            </Button>
          </Stack>

          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              isMouToggle={true}
              setMouToggle={setMouToggle}
              mouToggle={mouToggle}
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
              // <Scrollbar>
              <TableContainer>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={collageList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const {
                          institue_id,
                          institute_name,
                          mem_no,
                          state_name,
                          status,
                        } = row;
                        const selectedUser =
                          selected.indexOf(institute_name) !== -1;

                        return (
                          <TableRow
                            hover
                            key={institue_id}
                            tabIndex={-1}
                            // role="checkbox"
                            selected={selectedUser}
                          >
                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              {page * rowsPerPage + index + 1}
                            </TableCell>

                            <TableCell
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                <Typography variant="subtitle2" noWrap>
                                  {institute_name}
                                </Typography>
                              </Stack>
                            </TableCell>

                            {/* <TableCell align="left">{company}</TableCell> */}

                            {/* <TableCell align="left">{role}</TableCell> */}

                            {/* <TableCell align="left">
                          {isVerified ? "Yes" : "No"}
                        </TableCell> */}
                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                <Typography variant="subtitle2" noWrap>
                                  {mem_no}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                <Typography variant="subtitle2" noWrap>
                                  {state_name}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Label
                                color={
                                  (status === "InActive" && "error") ||
                                  "success"
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
                                // size="small"
                                color="inherit"
                                sx={{ p: 0.5 }}
                                onClick={(event) => handleOpenMenu(event, row)}
                              >
                                <Icon icon={"eva:more-vertical-fill"} />
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
                        <TableCell
                          align="center"
                          colSpan={6}
                          sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                        >
                          <Paper
                            sx={{
                              textAlign: "center",
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
              // </Scrollbar>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={collageList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
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
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => openAssignDrawer(setectedRow)}
        >
          <Icon icon={"material-symbols:assignment-outline"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Assign Domain</Typography>
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => openViewDrawer(setectedRow)}
        >
          <Icon icon={"lucide:view"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>View</Typography>
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => openEditDrawer(setectedRow)}
        >
          <Icon icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Edit</Typography>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          // disabled={!superAdmin}
          onClick={() => openDeleteModal(setectedRow.institue_id)}
        >
          <Icon icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Delete</Typography>
        </MenuItem>
      </Popover>
      {/* Render the CommonDrawer component with dynamic fields */}
      <AssignDrawer
        title={"Update Domain"}
        isOpen={isAssignDrawerOpen}
        onClose={closeDrawer}
        drawerData={selectedItem}
        collageList={DOMAIN_LIST}
        setSelectedAssignItems={setSelectedAssignItems}
        fields={[
          { name: "institute_name", label: "Institute Name" },
          { name: "status", label: "Status", type: "switch" },
        ]}
      />
      <EditDrawer
        title={"Edit Institute"}
        isOpen={isEditDrawerOpen}
        isEditDrawerOpen={isEditDrawerOpen}
        setSelectedEditItems={setSelectedEditItems}
        onClose={closeDrawer}
        institueId={institueId}
        memNo={selectedItem?.mem_no}
        fields={[
          { name: "mem_no", label: "Membership No.", type: "number" },
          { name: "institute_name", label: "Institute Name" },
          { name: "city_name", label: "City Name" },
          {
            name: "state_name",
            label: "State",
            type: "select",
            options: instituteStates,
          },
          { name: "expire_date", label: "Expire Date", type: "date" },
          {
            name: "valid_days",
            label: "Select Membership",
            type: "select",
            options: membershipPackages,
          },
          { name: "status", label: "Status", type: "switch" },
        ]}
      />
      <AddDrawer
        title={"Add Institute"}
        isOpen={isAddDrawerOpen}
        onClose={closeDrawer}
        setSelectedAddItems={setSelectedAddItems}
        fields={[
          { name: "mem_no", label: "Membership No.", type: "number" },
          { name: "institute_name", label: "Institute Name" },
          { name: "city_name", label: "City Name" },
          {
            name: "state_id",
            label: "State",
            type: "select",
            options: instituteStates,
          },
          { name: "expire_date", label: "Expire Date", type: "date" },
          {
            name: "valid_days",
            label: "Select Membership",
            type: "select",
            options: membershipPackages,
          },
          { name: "status", label: "Status", type: "switch" },
        ]}
      />
      <ViewDrawer
        title={"Institute Details"}
        isOpen={isViewDrawerOpen}
        viewCollage={viewCollage}
        onClose={closeDrawer}
      />
      <CommonModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        action="delete"
      />
    </>
  );
}

// import { Helmet } from "react-helmet-async";
// import { filter } from "lodash";
// import { sentenceCase } from "change-case";
// import { useState } from "react";
// // @mui
// import {
//   Card,
//   Table,
//   Stack,
//   Paper,
//   // Avatar,
//   Button,
//   Popover,
//   // Checkbox,
//   TableRow,
//   MenuItem,
//   TableBody,
//   TableCell,
//   Container,
//   Typography,
//   IconButton,
//   TableContainer,
//   TablePagination,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// // components
// import Label from "../../../components/label";
// // import Iconify from '../components/iconify';
// // import Scrollbar from "../../components/common/scrollbar";
// // sections
// import { UserListHead, UserListToolbar } from "../../../components/common/user";
// // mock
// // import USERLIST from "../../_mock/user";
// import { Icon } from "@iconify/react";
// import { tokens } from "../../../theme";
// import { useTheme } from "@mui/material";
// import EditDrawer from "../../../components/common/drawer/EditDrawer";
// import AssignDrawer from "../../../components/common/drawer/AssignDrawer";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
// import { useEffect } from "react";
// import { AdminService } from "../../../services/dataService";
// import ViewDrawer from "../../../components/common/drawer/ViewDrawer";
// import { toast } from "react-toastify";
// import AddDrawer from "../../../components/common/drawer/AddDrawer";
// import {
//   fetchInstituteState,
//   fetchMembershipPackage,
// } from "../../../store/Slices/dashboard/statepackageSlice";
// import CommonModal from "../../../components/common/modal/CommonModal";
// import StaffInstitute from "../../../components/StaffSection/StaffInstitute";
// import MouTableDrawer from "../../../components/common/drawer/MouTableDrawer";
// import { setMouInstituteId } from "../../../store/Slices/admin/adminMouSlice";

// // ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: "institue_id", label: "Sl. No", alignRight: false },
//   { id: "name", label: "Institute Name", alignRight: false },
//   { id: "mem_no", label: "Mem No", alignRight: false },
//   { id: "state_name", label: "State Name", alignRight: false },
//   { id: "status", label: "Status", alignRight: false },
//   { id: "", label: "Action", alignRight: true },
// ];

// // ----------------------------------------------------------------------

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function applySortFilter(array, comparator, query) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   if (query) {
//     return filter(
//       array,
//       (_user) =>
//         _user.institute_name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
//     );
//   }
//   return stabilizedThis.map((el) => el[0]);
// }

// export default function CollegeList() {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const userRole = useSelector((state) => state.authorise.userRole);
//   const dispatch = useDispatch();
//   const domainList = useSelector((state) => state.domainList.domainList);
//   // const isLoading = useSelector((state) => state.domainList.isLoading);

//   const DOMAIN_LIST = domainList.map((item) => ({
//     id: item.domain_id,
//     collageName: item.domain_name,
//     status: "active", // You can replace this with the actual status data if available
//   }));

//   useEffect(() => {
//     // Call the async thunk when the component mounts or as needed
//     if (userRole === "admin") {
//       dispatch(fetchDomainList());
//       dispatch(fetchInstituteState());
//       dispatch(fetchMembershipPackage());
//     }
//   }, [dispatch]);

//   const [collageList, setCollageList] = useState([]);
//   const [viewCollage, setViewCollage] = useState();

//   const [open, setOpen] = useState(null);

//   const [page, setPage] = useState(0);

//   const [order, setOrder] = useState("asc");

//   const [selected, setSelected] = useState([]);

//   const [orderBy, setOrderBy] = useState("name");

//   const [filterName, setFilterName] = useState("");

//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const [selectedItem, setSelectedItem] = useState(null);
//   const [setectedRow, setSetectedRow] = useState({});
//   const [selectedEditItems, setSelectedEditItems] = useState(null);
//   const [isAssignDrawerOpen, setAssignDrawerOpen] = useState(false);
//   const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
//   const [isViewDrawerOpen, setViewDrawerOpen] = useState(false);
//   const [isAddDrawerOpen, setAddDrawerOpen] = useState(false);
//   const [selectedAssignItems, setSelectedAssignItems] = useState(null);
//   const [selectedAddItems, setSelectedAddItems] = useState(null);
//   const [institueId, setInstitueId] = useState(null);
//   const [loadingTable, setLoadingTable] = useState(true);
//   const [refreshTable, setRefreshTable] = useState(false);
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deletingItemId, setDeletingItemId] = useState(null);
//   const [isMouDrawerOpen, setIsMouDrawerOpen] = useState(false);

//   const instituteState = useSelector(
//     (state) => state.statePackage.instituteState
//   );

//   const subscriptionData = useSelector(
//     (state) => state.statePackage.membershipPackage
//   );

//   const membershipPackages = subscriptionData?.map((sub) => ({
//     value: sub.valid_days.toString(), // Assuming valid_days is a number, convert it to string
//     label: sub.sub_name,
//   }));

//   const instituteStates = instituteState?.map((sub) => ({
//     value: sub.state_id.toString(), // Assuming valid_days is a number, convert it to string
//     label: sub.state_name,
//   }));

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await AdminService.admin_institute_list();
//         const data = response.data.data;
//         setCollageList(data);
//       } catch (error) {
//         console.error("Error fetching data:", error?.message);
//       } finally {
//         setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
//       }
//     };
//     if (userRole === "admin") {
//       fetchData();
//     }
//   }, [selectedAddItems, refreshTable]);

//   const fetchInstituteDetails = async (institueId) => {
//     try {
//       const response = await AdminService.admin_institute(institueId);
//       const data = response.data.data;
//       setViewCollage(data[0]);
//       setInstitueId(null);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     if (institueId) {
//       fetchInstituteDetails(institueId);
//     }
//   }, [institueId]);

//   //...................................................

//   const updateData = async (selectedEditItems) => {
//     const updateEditItems = {
//       institue_id: selectedEditItems.institue_id,
//       data: {
//         mem_no:
//           selectedEditItems.mem_no !== ""
//             ? parseInt(selectedEditItems.mem_no, 10)
//             : 0,
//         institute_name: selectedEditItems.institute_name,
//         state_id: parseInt(selectedEditItems.state_name, 10),
//         city_name: selectedEditItems.city_name,
//         valid_days: parseInt(selectedEditItems.valid_days, 10),
//         expire_date: selectedEditItems.expire_date,
//         status: selectedEditItems.status === "Active" ? 1 : 0,
//       },
//     };

//     try {
//       const response = await AdminService.admin_institute_update(
//         updateEditItems
//       );
//       const data = response.data;
//       handleSuccessMessage(data.detail);
//       setSelectedEditItems(null);
//       setRefreshTable((prev) => !prev);
//       setViewCollage([]);
//       setSetectedRow({});
//       closeDrawer();
//     } catch (error) {
//       handleErrorMessage(error.response.data.detail || error.message);
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedEditItems) {
//       updateData(selectedEditItems);
//     }
//   }, [selectedEditItems]);

//   //............................................

//   const addData = async (selectedAddItems) => {
//     const updateAddItem = {
//       ...selectedAddItems,
//       mem_no: parseInt(selectedAddItems.mem_no, 10),
//       state_id: parseInt(selectedAddItems.state_id, 10),
//       valid_days: parseInt(selectedAddItems.valid_days, 10),
//     };

//     try {
//       const response = await AdminService.admin_institute_add(updateAddItem);
//       const data = response.data;
//       handleSuccessMessage(data.detail);
//       setRefreshTable((prev) => !prev);
//       setSelectedAddItems(null);
//       closeDrawer();
//     } catch (error) {
//       handleErrorMessage(error.response.data.detail || error.message);
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     if (selectedAddItems) {
//       addData(selectedAddItems);
//     }
//   }, [selectedAddItems]);

//   //...............................................

//   const updateDomain = async (selectedAssignItems) => {
//     try {
//       const response = await AdminService.admin_damain_update(
//         selectedAssignItems
//       );
//       const data = response.data;
//       handleSuccessMessage(data.detail);
//       closeDrawer();
//     } catch (error) {
//       handleErrorMessage(error.response.data.detail || error.message);
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     if (selectedAssignItems) {
//       updateDomain(selectedAssignItems);
//     }
//   }, [selectedAssignItems]);
//   //........................................

//   function handleSuccessMessage(message) {
//     toast.success(message, {
//       autoClose: 2000,
//       position: "top-center",
//     });
//   }

//   function handleErrorMessage(message) {
//     toast.error(message, {
//       autoClose: 2000,
//       position: "top-center",
//     });
//   }

//   //...........................................................

//   const openDeleteModal = (itemId) => {
//     setDeleteModalOpen(true);
//     setDeletingItemId(itemId);
//     handleCloseMenu();
//   };

//   const closeDeleteModal = () => {
//     setDeleteModalOpen(false);
//     setDeletingItemId(null);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       const response = await AdminService.admin_institute_delete(
//         deletingItemId
//       );
//       const data = response.data;
//       handleSuccessMessage(data.detail);
//       closeDeleteModal();
//       setRefreshTable((prev) => !prev);
//     } catch (error) {
//       // Handle error, show notification, etc.
//       handleErrorMessage(error.message);
//       console.error("Error deleting item:", error);
//     }
//   };

//   //.....................................................

//   const openAssignDrawer = (item) => {
//     setSelectedItem(item);
//     setAssignDrawerOpen(true);
//     handleCloseMenu();
//   };

//   const openEditDrawer = (item) => {
//     setSelectedItem(item);
//     setInstitueId(item.institue_id);
//     setEditDrawerOpen(true);
//     handleCloseMenu();
//   };

//   const openMouDrawer = (item) => {
//     setInstitueId(item.institue_id);
//     setSelectedItem(item);
//     setIsMouDrawerOpen(true);
//     handleCloseMenu();
//   };

//   const openAddDrawer = () => {
//     setAddDrawerOpen(true);
//     handleCloseMenu();
//   };

//   const openViewDrawer = (item) => {
//     setInstitueId(item.institue_id);
//     fetchInstituteDetails(item.institue_id);
//     // setViewCollage(item);
//     setViewDrawerOpen(true);
//     handleCloseMenu();
//   };
//   // Function to close the drawer
//   const closeDrawer = () => {
//     setEditDrawerOpen(false);
//     setAssignDrawerOpen(false);
//     setAddDrawerOpen(false);
//     setSelected([]);
//     setViewDrawerOpen(false);
//     setViewCollage(null);
//     setSelectedItem(null);
//     setSetectedRow({});
//     setInstitueId(null);
//     setIsMouDrawerOpen(false);
//   };

//   const handleOpenMenu = (event, row) => {
//     setOpen(event.currentTarget);
//     setSetectedRow(row);
//   };

//   const handleCloseMenu = () => {
//     setOpen(null);
//   };

//   if (open) {
//     dispatch(setMouInstituteId(null));
//   }

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelecteds = collageList.map((n) => n.institute_name);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setPage(0);
//     setRowsPerPage(parseInt(event.target.value, 10));
//   };

//   const handleFilterByName = (event) => {
//     setPage(0);
//     setFilterName(event.target.value);
//   };

//   const emptyRows =
//     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - collageList.length) : 0;

//   const filteredUsers = applySortFilter(
//     collageList,
//     getComparator(order, orderBy),
//     filterName
//   );

//   const isNotFound = !filteredUsers.length && !!filterName;
//   // let superAdmin = false;

//   return (
//     <>
//       <Helmet>
//         <title> Institute | EduSkills </title>
//       </Helmet>
//       {userRole === "staff" ? (
//         <Container maxWidth="xl" sx={{ my: 2 }}>
//           <StaffInstitute />
//         </Container>
//       ) : (
//         <Container maxWidth="xl" sx={{ my: 2 }}>
//           <Stack
//             direction="row"
//             alignItems="center"
//             justifyContent="space-between"
//             mb={2}
//           >
//             <Typography
//               variant="h5"
//               sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
//             >
//               Welcome back to Institute !
//             </Typography>
//             <Button
//               variant="contained"
//               color="info"
//               sx={{ textTransform: "initial" }}
//               startIcon={<Icon icon="eva:plus-fill" />}
//               onClick={() => openAddDrawer()}
//             >
//               Add Institute
//             </Button>
//           </Stack>

//           <Card>
//             <UserListToolbar
//               numSelected={selected.length}
//               filterName={filterName}
//               onFilterName={handleFilterByName}
//               // isMouToggle={true}
//             />
//             {loadingTable ? ( // Check if data is loading
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   height: "50vh",
//                 }}
//               >
//                 <CircularProgress color="info" size={50} />
//               </Box>
//             ) : (
//               // <Scrollbar>
//               <TableContainer>
//                 <Table>
//                   <UserListHead
//                     order={order}
//                     orderBy={orderBy}
//                     headLabel={TABLE_HEAD}
//                     rowCount={collageList.length}
//                     numSelected={selected.length}
//                     onRequestSort={handleRequestSort}
//                     onSelectAllClick={handleSelectAllClick}
//                   />
//                   <TableBody>
//                     {filteredUsers
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((row, index) => {
//                         const {
//                           institue_id,
//                           institute_name,
//                           mem_no,
//                           state_name,
//                           status,
//                         } = row;
//                         const selectedUser =
//                           selected.indexOf(institute_name) !== -1;

//                         return (
//                           <TableRow
//                             hover
//                             key={institue_id}
//                             tabIndex={-1}
//                             // role="checkbox"
//                             selected={selectedUser}
//                           >
//                             <TableCell
//                               sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                             >
//                               {page * rowsPerPage + index + 1}
//                             </TableCell>

//                             <TableCell
//                               sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                               component="th"
//                               scope="row"
//                               padding="none"
//                             >
//                               <Stack
//                                 direction="row"
//                                 alignItems="center"
//                                 spacing={2}
//                               >
//                                 {/* <Avatar alt={name} src={avatarUrl} /> */}
//                                 <Typography variant="subtitle2" noWrap>
//                                   {institute_name}
//                                 </Typography>
//                               </Stack>
//                             </TableCell>

//                             {/* <TableCell align="left">{company}</TableCell> */}

//                             {/* <TableCell align="left">{role}</TableCell> */}

//                             {/* <TableCell align="left">
//                           {isVerified ? "Yes" : "No"}
//                         </TableCell> */}
//                             <TableCell
//                               align="left"
//                               sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                             >
//                               <Stack
//                                 direction="row"
//                                 alignItems="center"
//                                 spacing={2}
//                               >
//                                 {/* <Avatar alt={name} src={avatarUrl} /> */}
//                                 <Typography variant="subtitle2" noWrap>
//                                   {mem_no}
//                                 </Typography>
//                               </Stack>
//                             </TableCell>

//                             <TableCell
//                               align="left"
//                               sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                             >
//                               <Stack
//                                 direction="row"
//                                 alignItems="center"
//                                 spacing={2}
//                               >
//                                 {/* <Avatar alt={name} src={avatarUrl} /> */}
//                                 <Typography variant="subtitle2" noWrap>
//                                   {state_name}
//                                 </Typography>
//                               </Stack>
//                             </TableCell>

//                             <TableCell
//                               align="left"
//                               sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                             >
//                               <Label
//                                 color={
//                                   (status === "InActive" && "error") ||
//                                   "success"
//                                 }
//                               >
//                                 {sentenceCase(status)}
//                               </Label>
//                             </TableCell>

//                             <TableCell
//                               align="right"
//                               sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                             >
//                               <IconButton
//                                 size="medium"
//                                 color="inherit"
//                                 onClick={(event) => handleOpenMenu(event, row)}
//                               >
//                                 <Icon icon={"eva:more-vertical-fill"} />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     {emptyRows > 0 && (
//                       <TableRow style={{ height: 53 * emptyRows }}>
//                         <TableCell colSpan={6} />
//                       </TableRow>
//                     )}
//                   </TableBody>

//                   {isNotFound && (
//                     <TableBody>
//                       <TableRow>
//                         <TableCell
//                           align="center"
//                           colSpan={6}
//                           sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                         >
//                           <Paper
//                             sx={{
//                               textAlign: "center",
//                             }}
//                           >
//                             <Typography variant="h6" paragraph>
//                               Not found
//                             </Typography>

//                             <Typography variant="body2">
//                               No results found for &nbsp;
//                               <strong>&quot;{filterName}&quot;</strong>.
//                               <br /> Try checking for typos or using complete
//                               words.
//                             </Typography>
//                           </Paper>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   )}
//                 </Table>
//               </TableContainer>
//               // </Scrollbar>
//             )}
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={collageList.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </Card>
//         </Container>
//       )}

//       <Popover
//         open={Boolean(open)}
//         anchorEl={open}
//         onClose={handleCloseMenu}
//         anchorOrigin={{ vertical: "top", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//         PaperProps={{
//           sx: {
//             p: 1,
//             width: 140,
//             "& .MuiMenuItem-root": {
//               px: 1,
//               typography: "body2",
//               borderRadius: 0.75,
//             },
//           },
//         }}
//       >
//         <MenuItem
//           sx={{ display: "flex", alignItems: "center" }}
//           onClick={() => openAssignDrawer(setectedRow)}
//         >
//           <Icon icon={"material-symbols:assignment-outline"} sx={{ mr: 2 }} />
//           <Typography ml={0.5}>Assign Domain</Typography>
//         </MenuItem>
//         <MenuItem
//           sx={{ display: "flex", alignItems: "center" }}
//           onClick={() => openViewDrawer(setectedRow)}
//         >
//           <Icon icon={"lucide:view"} sx={{ mr: 2 }} />
//           <Typography ml={0.5}>View</Typography>
//         </MenuItem>
//         <MenuItem
//           sx={{ display: "flex", alignItems: "center" }}
//           onClick={() => openEditDrawer(setectedRow)}
//         >
//           <Icon icon={"eva:edit-fill"} sx={{ mr: 2 }} />
//           <Typography ml={0.5}>Edit</Typography>
//         </MenuItem>
//         <MenuItem
//           sx={{ display: "flex", alignItems: "center" }}
//           onClick={() => openMouDrawer(setectedRow)}
//         >
//           <Icon icon={"pajamas:doc-versions"} sx={{ mr: 2 }} />
//           <Typography ml={0.5}>Mou</Typography>
//         </MenuItem>

//         <MenuItem
//           sx={{ color: "error.main", display: "flex", alignItems: "center" }}
//           // disabled={!superAdmin}
//           onClick={() => openDeleteModal(setectedRow.institue_id)}
//         >
//           <Icon icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
//           <Typography ml={0.5}>Delete</Typography>
//         </MenuItem>
//       </Popover>
//       {/* Render the CommonDrawer component with dynamic fields */}
//       <AssignDrawer
//         title={"Update Domain"}
//         isOpen={isAssignDrawerOpen}
//         onClose={closeDrawer}
//         drawerData={selectedItem}
//         collageList={DOMAIN_LIST}
//         setSelectedAssignItems={setSelectedAssignItems}
//         fields={[
//           { name: "institute_name", label: "Institute Name" },
//           { name: "status", label: "Status", type: "switch" },
//         ]}
//       />
//       <EditDrawer
//         title={"Edit Institute"}
//         isOpen={isEditDrawerOpen}
//         isEditDrawerOpen={isEditDrawerOpen}
//         setSelectedEditItems={setSelectedEditItems}
//         onClose={closeDrawer}
//         institueId={institueId}
//         memNo={selectedItem?.mem_no}
//         fields={[
//           { name: "mem_no", label: "Membership No.", type: "number" },
//           { name: "institute_name", label: "Institute Name" },
//           { name: "city_name", label: "City Name" },
//           {
//             name: "state_name",
//             label: "State",
//             type: "select",
//             options: instituteStates,
//           },
//           { name: "expire_date", label: "Expire Date", type: "date" },
//           {
//             name: "valid_days",
//             label: "Select Membership",
//             type: "select",
//             options: membershipPackages,
//           },
//           { name: "status", label: "Status", type: "switch" },
//         ]}
//       />
//       <AddDrawer
//         title={"Add Institute"}
//         isOpen={isAddDrawerOpen}
//         onClose={closeDrawer}
//         setSelectedAddItems={setSelectedAddItems}
//         fields={[
//           { name: "mem_no", label: "Membership No.", type: "number" },
//           { name: "institute_name", label: "Institute Name" },
//           { name: "city_name", label: "City Name" },
//           {
//             name: "state_id",
//             label: "State",
//             type: "select",
//             options: instituteStates,
//           },
//           { name: "expire_date", label: "Expire Date", type: "date" },
//           {
//             name: "valid_days",
//             label: "Select Membership",
//             type: "select",
//             options: membershipPackages,
//           },
//           { name: "status", label: "Status", type: "switch" },
//         ]}
//       />
//       <MouTableDrawer
//         title={"Mou Details"}
//         isOpen={isMouDrawerOpen}
//         institueId={institueId}
//         onClose={closeDrawer}
//         drawerData={selectedItem}
//       />
//       <ViewDrawer
//         title={"Institute Details"}
//         isOpen={isViewDrawerOpen}
//         viewCollage={viewCollage}
//         onClose={closeDrawer}
//       />
//       <CommonModal
//         open={isDeleteModalOpen}
//         onClose={closeDeleteModal}
//         onConfirm={handleConfirmDelete}
//         action="delete"
//       />
//     </>
//   );
// }
