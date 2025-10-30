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
  // TablePagination,
  Box,
  CircularProgress,
  Tooltip,
  TablePagination,
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
import AssignDrawerAcademy from "../../../components/common/drawer/AssignDrawerAcademy";
// import EditDrawer from "../../components/common/drawer/EditDrawer";
import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import {
  useDispatch,
  useSelector,
  // useSelector
} from "react-redux";
// import { fetchDomainList } from "../../store/Slices/internship/domainListSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AdminService } from "../../../services/dataService";
import CustomAddDrawer from "../../../components/common/drawer/CustomAddDrawer";
import CustomEditDrawer from "../../../components/common/drawer/CustomEditDrawer";
import { fetchEducatorDesignation } from "../../../store/Slices/admin/adminEduDesigSlice";
import { CustomPagination } from "../../../components/common/pagination";
import CommonModal from "../../../components/common/modal/CommonModal";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "", label: "Sl.", alignRight: false },
  { id: "full_name", label: "Staff Name", alignRight: false },

  { id: "email", label: "Email Id", alignRight: false },

  { id: "", label: "Action", alignRight: true },
];

const staffData = [
  {
    staff_id: 1,
    sl_no: 1,
    full_name: "Demo Name 1",
    design_id: 2,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "yes",
    status: "Active",
    state_id: [1, 2],
    roles: [1, 2],
  },
  {
    staff_id: 2,
    sl_no: 2,
    full_name: "Demo Name 2",
    design_id: 3,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "yes",
    status: "Active",
    state_id: [1, 9],
    roles: [2, 3],
  },
  {
    staff_id: 3,
    sl_no: 3,
    full_name: "Demo Name 3",
    design_id: 2,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "yes",
    status: "Active",
    state_id: [1, 3],
    roles: [3, 1],
  },
  {
    staff_id: 4,
    sl_no: 4,
    full_name: "Demo Name 4",
    design_id: 3,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "yes",
    status: "Active",
    state_id: [1, 7],
    roles: [2],
  },
  {
    staff_id: 5,
    sl_no: 5,
    full_name: "Demo Name 5",
    design_id: 2,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "no",
    status: "Active",
    state_id: [1, 8],
    roles: [1],
  },
  {
    staff_id: 6,
    sl_no: 6,
    full_name: "Demo Name 6",
    design_id: 3,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "no",
    status: "Active",
    state_id: [1, 2],
    roles: [2],
  },
  {
    staff_id: 7,
    sl_no: 7,
    full_name: "Demo Name 7",
    design_id: 2,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "no",
    status: "Active",
    state_id: [1, 5],
    roles: [2, 1],
  },
  {
    staff_id: 8,
    sl_no: 8,
    full_name: "Demo Name 8",
    design_id: 1,
    email: "demo@eduskills.com",
    mobile: "9876543210",
    login_access: "no",
    status: "Active",
    state_id: [1, 3],
    roles: [1, 3],
  },
];

// const staffRole = [
//   { role_id: 1, role_name: "spoc" },
//   { role_id: 2, role_name: "admin" },
//   { role_id: 3, role_name: "staff" },
// ];

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
        _user.full_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AdminStaff() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [staffRole, setStaffRole] = useState([]);
  useEffect(() => {
    dispatch(fetchEducatorDesignation());
    dispatch(fetchDomainList());
    dispatch(fetchInstituteState());
  }, [dispatch]);

  // const designList = useSelector(
  //   (state) => state.educatorDesignation.data.data
  // );
  // const instituteList = useSelector(
  //   (state) => state.adminInstList.instituteList
  // );

  const stateList = useSelector((state) => state.statePackage.instituteState);

  // const stateList = [
  //   {state_id:1,state_name:'Odisha'},
  //   {state_id:2,state_name:'Andrapradesh'},
  // ]

  const updateStateList = stateList?.map((state) => {
    return {
      value: state.state_id,
      label: state.state_name,
    };
  });

  const updateRoleList = staffRole?.map((item) => {
    return {
      value: item.role_id,
      label: item.role_name,
    };
  });

  // const updateInstList = instituteList?.map((item) => {
  //   return {
  //     value: item.institue_id,
  //     label: item.institute_name,
  //   };
  // });

  const configField = [
    {
      name: "full_name",
      label: "Full Name",
      //   type: "select",
      //   options: updateInstList,
    },
    { name: "email", label: "Email ID", type: "text", variant: "email" },
    {
      name: "states",
      label: "State",
      type: "multiselect",
      options: updateStateList,
    },

    {
      name: "roles",
      label: "Roles",
      type: "multiselect",
      options: updateRoleList,
    },
    // {
    //   name: "login_access",
    //   label: "Login Access",
    //   type: "switch",
    //   variant: "yesNo",
    // },
    // {
    //   name: "status",
    //   label: "Status",
    //   type: "switch",
    //   variant: "activeInactive",
    // },
  ];

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [setectedRow, setSetectedRow] = useState({});
  const [educator, setEducator] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(() => {
    const defaultValues = {};

    configField.forEach((field) => {
      if (field.type === "switch") {
        // Set default value for switch type fields
        defaultValues[field.name] =
          field.variant === "yesNo" ? "no" : "InActive";
      }
    });

    return defaultValues;
  });


  const [refresh, setRefresh] = useState(false);
  const [educatorId, setEducatorId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // modal................................
  const handleDelete = () => {
    handleCloseMenu();
    if (educatorId) {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (educatorId) {
      handleDeleteEducator(educatorId);
    }
  };

  const handleCloseModal = () => {
    setIsConfirmationModalOpen(false);
    setEducatorId(null);
  };
  // Edit ......................................
  const handleEdit = (item) => {
    // Open the edit drawer and set the item to edit
    if (Object.keys(item)?.length !== 0) {
      setIsEditDrawerOpen(true);
      setEditedItem(item);
    } else {
      handleErrorMessage("No data found.");
    }

    handleCloseMenu();
  };

  const handleCloseEditDrawer = () => {
    // Close the edit drawer
    setIsEditDrawerOpen(false);
    setEditedItem({});
  };

  const updateToEditItem = {
    // design_id: editedItem.design_id,
    email: editedItem.email,
    full_name: editedItem.full_name,
    states: editedItem.states,
    roles: editedItem.roles,
    // mobile: editedItem.mobile,
    // login_access: editedItem.login_access,
    // status: editedItem.status,
  };

  const handleEditConfirm = (editedItem) => {

    const updateEditItem = {
      // full_name: editedItem.full_name,
      // email: editedItem.email,
      // mobile: editedItem.mobile,
      // is_spoc: editedItem.is_spoc === "yes" ? 1 : 0,
      // status: editedItem.status === "Active" ? 1 : 0,
      email: editedItem.email,
      full_name: editedItem.full_name,
      state_ids: editedItem.states,
      role_ids: editedItem.roles,
    };
    delete updateEditItem.states;
    delete updateEditItem.roles;
    console.warn(typeof updateEditItem.role_ids);
 
    if (educatorId) {
      handleUpdateEducator(updateEditItem);
    }
  };

  const handleAddConfirm = (addedItem) => {
    const updateAddedItem = {
      ...addedItem,
      // is_spoc: addedItem.is_spoc === "yes" ? 1 : 0,
      // status: addedItem.status === "Active" ? 1 : 0,
      // domain_id: 14,
      state_ids: addedItem.states?.map((item) => item.value),
      role_ids: addedItem.roles?.map((item) => item.value),
    };

    delete updateAddedItem.states;
    delete updateAddedItem.roles;
    handleAddEducator(updateAddedItem);
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

  //..........................................

  const fetchStaffList = async () => {
    try {
      const response = await AdminService.admin_all_staff();
      const data = response.data.data;
      const filterData = data.map((staff) => ({
        ...staff,
        states: staff.states.map((element) => parseInt(element)),
        roles: staff.roles.map((element) => parseInt(element)),
      }));
      setEducator(filterData);

      // setEducator(staffData);
    } catch (error) {
      //   console.error("Error fetching data:", error);
    } finally {
      setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
    }
  };
  useEffect(() => {
    fetchStaffList();
  }, [refresh]);
  // Staff role...................................

  const fetchRoleList = async () => {
    try {
      const res = await AdminService.admin_staff_role();
      setStaffRole(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchRoleList();
  }, []);

  // View Staff................................

  // const fetchStaffView = async () => {
  //   if (setectedRow?.user_id) {
  //     try {
  //       const res = await AdminService.admin_view_staff(setectedRow?.user_id);
  
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  //...........................................

  const handleAddEducator = async (addedItem) => {
    try {
      const response = await AdminService.admin_add_staff(addedItem);
      const data = response.data;
      handleSuccessMessage(data.detail);
      setRefresh((prev) => !prev);
      handleDrawerClose();
    } catch (error) {
      handleErrorMessage(error.response.data.detail || error.message);
      console.error("Error fetching data:", error);
    }
  };

  //...........................................

  const handleUpdateEducator = async (editItem) => {
    try {
      const response = await AdminService.admin_edit_staff(
        educatorId,
        editItem
      );
      const data = response.data;
      handleSuccessMessage(data.detail);
      setRefresh((prev) => !prev);
      handleCloseEditDrawer();
    } catch (error) {
      handleErrorMessage(error.response.data.detail || error.message);
      console.error("Error fetching data:", error);
    }
  };

  //...................................................
  const handleDeleteEducator = async (educatorId) => {
    try {
      const response = await AdminService.admin_delete_staff(educatorId);
      const data = response.data;
      handleSuccessMessage(data.detail);
      setRefresh((prev) => !prev);
      setIsConfirmationModalOpen(false);
      setEducatorId(null);
    } catch (error) {
      handleErrorMessage(error.response.data.detail || error.message);
      console.error("Error fetching data:", error);
    }
  };

  //...................................................

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSetectedRow(row);
    setEducatorId(row.user_id);
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
      const newSelecteds = educator.map((n) => n.full_name);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - educator?.length) : 0;

  const filteredUsers = applySortFilter(
    educator,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers?.length && !!filterName;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <>
      <Helmet>
        <title> Staff | EduSkills </title>
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
            sx={{ fontWeight: "bold", color: colors.blueAccent[300] }}
          >
            Welcome back to Staff !
          </Typography>
          <Button
            variant="contained"
            color="info"
            size="small"
            sx={{ textTransform: "initial" }}
            startIcon={<Icon icon="eva:plus-fill" />}
            onClick={handleDrawerOpen}
          >
            Add Staff
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected?.length}
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
            <TableContainer sx={{ minHeight: 378 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredUsers?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
           
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        user_id,
                        full_name,
                        email,

                        // login_access,
                        // status,
                      } = row;
                      const selectedUser = selected.indexOf(full_name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={user_id}
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
                            align="left"
                          >
                            <Stack
                              direction="row"
                              alignItems="start"
                              spacing={2}
                            >
                              <Tooltip title={full_name}>
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
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Tooltip title={email}>
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "25ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {email}
                              </Typography>
                            </Tooltip>
                          </TableCell>

                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="right"
                          >
                            <IconButton
                              size="medium"
                              color="inherit"
                              sx={{ p: 0.5 }}
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
                      <TableCell align="center" colSpan={7} sx={{ py: 14.2 }}>
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

          {/* <CustomPagination
            page={page}
            count={count}
            setRowsPerPage={setRowsPerPage}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
          /> */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={educator.length}
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
            // width: 140,
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
          onClick={fetchStaffView}
        >
          <Icon icon={"lucide:view"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>View</Typography>
        </MenuItem> */}
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          // disabled
          onClick={() => handleEdit(setectedRow)}
        >
          <Icon icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Edit</Typography>
        </MenuItem>

        <MenuItem
          // disabled
          sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          onClick={handleDelete}
        >
          <Icon icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Delete</Typography>
        </MenuItem>
      </Popover>
      {/* Render the CommonDrawer component with dynamic fields */}

      <CustomAddDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        config={{
          title: "Add Staff",
          fields: configField,
          saveButtonText: "Add Staff", // Optional, default is "Add"
          cancelButtonText: "Cancel", // Optional, default is "Cancel"
          modalAction: "add", // Optional, default is "add"
        }}
        // onAdd={handleAddItem}
        refresh={refresh}
        onConfirm={handleAddConfirm}
      />

      <CustomEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        config={{
          title: "Edit Staff",
          fields: configField,
          saveButtonText: "Update Staff", // Optional, default is "Add"
          cancelButtonText: "Cancel", // Optional, default is "Cancel"
          modalAction: "Update", // Optional, default is "add"
        }}
        editedItem={updateToEditItem} // Pass the item to edit
        setEditedItem={setEditedItem}
        onConfirm={handleEditConfirm}
      />
      <CommonModal
        open={isConfirmationModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        action={"Delete"}
      />
    </>
  );
}
