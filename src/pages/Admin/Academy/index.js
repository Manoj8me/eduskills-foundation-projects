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
import AssignDrawerAcademy from "../../../components/common/drawer/AssignDrawerAcademy";
// import EditDrawer from "../../components/common/drawer/EditDrawer";
import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import {
  useDispatch,
  // useSelector
} from "react-redux";
// import { fetchDomainList } from "../../store/Slices/internship/domainListSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AdminService } from "../../../services/dataService";
import CustomAddDrawer from "../../../components/common/drawer/CustomAddDrawer";
import CustomEditDrawer from "../../../components/common/drawer/CustomEditDrawer";
import CommonModal from "../../../components/common/modal/CommonModal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "academy_id", label: "Sl. No", alignRight: false },
  { id: "academy_name", label: "Academy Name", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "", label: "Action", alignRight: true },
];

const configField = [
  {
    name: "academy_name",
    label: "Academy Name",
    //   type: "select",
    //   options: updateInstList,
  },
  {
    name: "academy_brand",
    label: "Academy Brand",
    //   type: "select",
    //   options: updateInstList,
  },
  {
    name: "mou_signed",
    label: "Mou Signed",
    type: "date",
  },
  {
    name: "mou_expired",
    label: "Mou Expired",
    type: "date",
  },
  {
    name: "status",
    label: "Status",
    type: "switch",
    variant: "activeInactive",
  },
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

export default function Academy() {
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

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isAssignDrawerOpen, setAssignDrawerOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [setectedRow, setSetectedRow] = useState([]);
  const [setectedRowView, setSetectedRowView] = useState({});
  const [academyName, setAcademyName] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // const [academyId, setAcademyId] = useState(null);
  // const [instituteList, setInstituteList] = useState([]);
  // Function to open the drawer and set the selected item
  // const dispatch = useDispatch();
  // const isLoadingDomainList = useSelector((state)=> state.domainList.isLoading)

  const handleAddConfirm = async (addedItem) => {
    const updateAddedItem = {
      ...addedItem,
      is_status: addedItem.status === "Active" ? 1 : 0,
    };

    try {
      const res = await AdminService.admin_academy_add(updateAddedItem);
      handleSuccessMessage(res.data.detail);
      fatchDateAcademy();
      handleDrawerClose();
      setRefresh((pre) => !pre);
    } catch (error) {
      handleErrorMessage(error.message);
      console.error(error);
    }
    // handleAddEducator(updateAddedItem);
  };

  const handleEditConfirm = async (editedItem) => {
    const updateEditItem = {
      ...editedItem,
      is_status: editedItem.status === "Active" ? 1 : 0,
    };
    if (updateEditItem?.academy_id && updateEditItem) {
      try {
        const res = await AdminService.admin_academy_edit(
          updateEditItem?.academy_id,
          updateEditItem
        );
        handleSuccessMessage(res.data.detail);
        fatchDateAcademy();
        handleCloseEditDrawer();
        fetchEditAcademyData();
      } catch (error) {
        handleErrorMessage(error.message);
        console.error(error);
      }
    }

    // if (educatorId) {
    //   handleUpdateEducator(updateEditItem);
    // }
  };

  const handleDeleteConfirm = async () => {
    if (setectedRowView?.academy_id) {
      try {
        const res = await AdminService.admin_academy_delete(
          setectedRowView?.academy_id
        );
        handleSuccessMessage(res?.data?.detail);

        closeDeleteModal();
        fatchDateAcademy();
      } catch (error) {
        handleErrorMessage(error.message);
        console.error(error);
      }
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setEditedItem({});
  };

  const handleEdit = (item) => {
    // const updateEdit = {
    //   academy_id: item.id,
    //   academy_name: item.name,
    //   status: item.status,
    // };

    const updateEdit = {
      academy_brand: setectedRowView?.academy_brand,
      academy_id: setectedRowView?.academy_id,
      academy_name: setectedRowView?.academy_name,
      status: setectedRowView?.is_status,
      mou_expired: setectedRowView?.mou_expired,
      mou_signed: setectedRowView?.mou_signed,
    };
    // Open the edit drawer and set the item to edit
    if (Object.keys(updateEdit).length !== 0) {
      setIsEditDrawerOpen(true);
      setEditedItem(updateEdit);
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

  const foundAcademy = academyName.find(
    (academy) => academy.domain_email === true
  );
  const isDomainEmailId = foundAcademy?.academy_id;

  // const handleAddDomain = (newDomain) => {
  //   console.log("Adding a new domain:", newDomain);
  // };
  //..........................................
  const closeDeleteModal = () => {
    setDeleteModalOpen();
  };
  const fatchDateAcademy = async () => {
    try {
      const response = await AdminService.admin_academy_all();
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
  }, []);

  //...........................................

  const updateAcademy = async (selectedAssignItems) => {
    try {
      const response = await AdminService.admin_academy_update(
        selectedAssignItems
      );
      const data = response.data;
      handleSuccessMessage(data.detail);
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
  const fetchEditAcademyData = async () => {
    try {
      const res = await AdminService.admin_academy_view(setectedRow.id);
      setSetectedRowView(res.data);
    } catch (error) {
      console.error(error);
      setSetectedRowView({});
    }
  };

  useEffect(() => {
    if (setectedRow?.id) {
      fetchEditAcademyData();
    }
  }, [setectedRow?.id]);

  //.............................................
  const DOMAIN_LIST = academyName.map((item) => ({
    id: item.academy_id,
    name: item.academy_name,
    status: item.status, // You can replace this with the actual status data if available
  }));

  const openAssignDrawer = (item) => {
    // setSelectedAssignItems(item)
    setSelectedItem(item);
    // setAcademyId(item.id)
    setAssignDrawerOpen(true);
    handleCloseMenu();
  };

  // const openEditDrawer = (item) => {
  //   setSelectedItem(item);
  //   setAcademyId(item.id)
  //   setEditDrawerOpen(true);
  //   handleCloseMenu();
  // };
  // Function to close the drawer
  const closeDrawer = () => {
    // setEditDrawerOpen(false);
    setAssignDrawerOpen(false);
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
      const newSelecteds = DOMAIN_LIST.map((n) => n.name);
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
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setSetectedRowView({});
  };

  const updateToEditItem = {
    academy_id: editedItem?.academy_id,
    academy_name: editedItem?.academy_name,
    status: editedItem?.status,
    academy_brand: editedItem?.academy_brand,
    mou_expired: editedItem?.mou_expired,
    mou_signed: editedItem?.mou_signed,
  };

  const isNotFound = !filteredUsers.length && !!filterName;
  // let superAdmin = false;

  return (
    <>
      <Helmet>
        <title> Academy | EduSkills </title>
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
            Welcome back to Academy !
          </Typography>
          <Button
            variant="contained"
            color="info"
            size="small"
            sx={{ textTransform: "initial" }}
            startIcon={<Icon icon="eva:plus-fill" />}
            onClick={() => handleDrawerOpen()}
          >
            Add Academy
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
                      const { id, name, status } = row;
                      const selectedUser = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
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
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Label
                              color={
                                (status === "InActive" && "error") || "success"
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
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
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
          disabled={setectedRow.id === isDomainEmailId}
          onClick={() => openAssignDrawer(setectedRow)}
        >
          <Icon icon={"material-symbols:assignment-outline"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Assign</Typography>
        </MenuItem>

        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          // disabled
          onClick={() => handleEdit(setectedRow)}
        >
          <Icon icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Edit</Typography>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          // disabled={!superAdmin}
          onClick={() => {
            setDeleteModalOpen(true);
            handleCloseMenu();
          }}
        >
          <Icon icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Delete</Typography>
        </MenuItem>
      </Popover>
      {/* Render the CommonDrawer component with dynamic fields */}
      <AssignDrawerAcademy
        title={"Update Institute"}
        isOpen={isAssignDrawerOpen}
        onClose={closeDrawer}
        drawerData={selectedItem}
        collageList={DOMAIN_LIST}
        setSelectedColleges={setSelectedColleges}
        selectedColleges={selectedColleges}
        setSelectedAssignItems={setSelectedAssignItems}
        fields={[
          { name: "name", label: "Institute Name" },
          { name: "status", label: "Status", type: "switch" },
        ]}
      />
      <CustomAddDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        config={{
          title: "Add Academy",
          fields: configField,
          saveButtonText: "Add Academy", // Optional, default is "Add"
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
          title: "Edit Academy",
          fields: configField,
          saveButtonText: "Update Academy", // Optional, default is "Add"
          cancelButtonText: "Cancel", // Optional, default is "Cancel"
          modalAction: "Update", // Optional, default is "add"
        }}
        editedItem={updateToEditItem} // Pass the item to edit
        setEditedItem={setEditedItem}
        onConfirm={handleEditConfirm}
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
      <CommonModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        action={"delete"}
      />
    </>
  );
}
