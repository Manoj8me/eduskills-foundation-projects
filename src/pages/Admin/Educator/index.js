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
import { fetchInstList } from "../../../store/Slices/admin/adminInstListSlice";
import CommonModal from "../../../components/common/modal/CommonModal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "sl_no", label: "#", alignRight: false },
  { id: "educator_name", label: "Educator Name", alignRight: false },
  { id: "institute_name", label: "Institute Name", alignRight: false },
  { id: "email", label: "Email Id", alignRight: false },
  { id: "designation", label: "Designation", alignRight: false },
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
        _user.educator_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Educators() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEducatorDesignation());
    dispatch(fetchDomainList());
    dispatch(fetchInstList());
  }, [dispatch]);

  const designList = useSelector(
    (state) => state.educatorDesignation.data.data
  );
  const instituteList = useSelector(
    (state) => state.adminInstList.instituteList
  );

  const updateDesignList = designList?.map((item) => {
    return {
      value: item.design_id,
      label: item.role_name,
    };
  });

  const updateInstList = instituteList?.map((item) => {
    return {
      value: item.institue_id,
      label: item.institute_name,
    };
  });

  const configField = [
    {
      name: "institute_id",
      label: "Institute Name",
      type: "select",
      options: updateInstList,
    },
    {
      name: "design_id",
      label: "Designation",
      type: "select",
      options: updateDesignList,
    },
    { name: "educator_name", label: "Educator Name", type: "text" },
    { name: "email", label: "Email ID", type: "text", variant: "email" },
    {
      name: "mobile",
      label: "Mobile No.",
      type: "number",
      variant: "mobileNo",
    },
    {
      name: "is_spoc",
      label: "Is Spoc",
      type: "switch",
      variant: "yesNo",
    },
    {
      name: "status",
      label: "Status",
      type: "switch",
      variant: "activeInactive",
    },
  ];

  const [open, setOpen] = useState(null);
  const [oldPage, setOldPage] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
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
    if (Object.keys(item).length !== 0) {
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
    design_id: editedItem.design_id,
    email: editedItem.email,
    educator_name: editedItem.educator_name,
    institute_id: editedItem.institute_id,
    mobile: editedItem.mobile,
    is_spoc: editedItem.spoc || editedItem.is_spoc,
    status: editedItem.status,
  };

  const handleEditConfirm = (editedItem) => {
    const updateEditItem = {
      institute_id: editedItem.institute_id,
      design_id: editedItem.design_id,
      domain_id: 14,
      educator_name: editedItem.educator_name,
      email: editedItem.email,
      mobile: editedItem.mobile,
      is_spoc: editedItem.is_spoc === "yes" ? 1 : 0,
      status: editedItem.status === "Active" ? 1 : 0,
    };
    if (educatorId) {
      handleUpdateEducator(updateEditItem);
    }
  };

  const handleAddConfirm = (addedItem) => {
    const updateAddedItem = {
      ...addedItem,
      is_spoc: addedItem.is_spoc === "yes" ? 1 : 0,
      status: addedItem.status === "Active" ? 1 : 0,
      domain_id: 14,
    };
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

  const fetchEducatorList = async () => {
    try {
      const response = await AdminService.admin_educator_list(
        page,
        rowsPerPage
      );
      setCount(response.data.total_pages);
      setPage(page);
      setEducator(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
    }
  };
  useEffect(() => {
    fetchEducatorList();
  }, [page, rowsPerPage, refresh]);

  //...........................................

  const handleAddEducator = async (addedItem) => {
    try {
      const response = await AdminService.admin_educator_add(addedItem);
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
      const response = await AdminService.admin_educator_update(
        editItem,
        educatorId
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
      const response = await AdminService.admin_educator_delete(educatorId);
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
    setEducatorId(row.educator_id);
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
      const newSelecteds = educator.map((n) => n.educator_name);
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
      ? Math.max(0, (1 + oldPage) * rowsPerPage - educator?.length)
      : 0;

  const filteredUsers = applySortFilter(
    educator,
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
            Welcome back to Educators !
          </Typography>
          <Button
            variant="contained"
            color="info"
            size='small'
            sx={{ textTransform: "initial" }}
            startIcon={<Icon icon="eva:plus-fill" />}
            onClick={handleDrawerOpen}
          >
            Add Educator
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
            <TableContainer sx={{ minHeight: 375 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={educator.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
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
                        educator_name,
                        institute_name,
                        email,
                        designation,
                        status,
                      } = row;
                      const selectedUser =
                        selected.indexOf(educator_name) !== -1;

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
                              <Tooltip title={educator_name}>
                                <Typography
                                  variant="subtitle2"
                                  noWrap
                                  sx={{
                                    maxWidth: "25ch", // Adjust this value as needed
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {educator_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            <Tooltip title={institute_name}>
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "30ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {institute_name}
                              </Typography>
                            </Tooltip>
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
                            align="left"
                          >
                            <Tooltip title={designation}>
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "14ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {designation}
                              </Typography>
                            </Tooltip>
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

          <CustomPagination
            page={page}
            count={count}
            setRowsPerPage={setRowsPerPage}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
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
          title: "Add Educator",
          fields: configField,
          saveButtonText: "Add Educator", // Optional, default is "Add"
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
          title: "Edit Educator",
          fields: configField,
          saveButtonText: "Update Educator", // Optional, default is "Add"
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
