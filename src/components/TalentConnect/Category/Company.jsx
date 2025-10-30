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
  // Paper,
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
  // Tooltip,
} from "@mui/material";
// components
import Label from "../../../components/label";

import { UserListHead, UserListToolbar } from "../../../components/common/user";
import { Icon } from "@iconify/react";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
// import {
//   useDispatch,
//   useSelector,
//   // useSelector
// } from "react-redux";
// import { fetchDomainList } from "../../store/Slices/internship/domainListSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { TalentConnectService } from "../../../services/dataService";
import CustomAddDrawer from "../../../components/common/drawer/CustomAddDrawer";
import CustomEditDrawer from "../../../components/common/drawer/CustomEditDrawer";
// import { CustomPagination } from "../../../components/common/pagination";
import CommonModal from "../../../components/common/modal/CommonModal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "company_id", label: "Sl.No", alignRight: false },
  { id: "company_name", label: "Company Name", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "created_at", label: "Created Date", alignRight: false },
  { id: "update_at", label: "Update Date", alignRight: false },
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
        _user.company_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CompanyComponent() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const configField = [
    {
      name: "company_name",
      label: "Company Name",
    },
    {
      name: "company_addr",
      label: "Address",
      type: "multiline",
    },
    {
      name: "status",
      label: "Status",
      type: "switch",
      variant: "activeInactive",
    },
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

  //..............................
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
    company_name: editedItem.company_name,
    company_addr: editedItem.company_addr,
    status: editedItem.status,
  };

  const handleEditConfirm = (editedItem) => {
    const updateEditItem = {
      company_name: editedItem.company_name,
      company_addr: editedItem.company_addr,
      status: editedItem.status === "Active" ? 1 : 0,
    };
    if (educatorId) {
      handleUpdateEducator(updateEditItem);
    }
  };

  const handleAddConfirm = (addedItem) => {
    const updateAddedItem = {
      ...addedItem,
      status: addedItem.status === "Active" ? 1 : 0,
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
      const response = await TalentConnectService.company();
      setEducator(response.data.data);
    } catch (error) {
      //   console.error("Error fetching data:", error);
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
      const response = await TalentConnectService.add_company(addedItem);
      const data = response.data;
      handleSuccessMessage(data.detail);
      setRefresh((prev) => !prev);
      handleDrawerClose();
    } catch (error) {
      handleErrorMessage(error.response.data.detail || error.message);
      //   console.error("Error fetching data:", error);
    }
  };

  //...........................................

  const handleUpdateEducator = async (editItem) => {
    try {
      const response = await TalentConnectService.update_company(
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
      //   const response = await AdminService.admin_educator_delete(educatorId);
      //   const data = response.data;
      //   handleSuccessMessage(data.detail);
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
    setEducatorId(row.company_id);
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
      const newSelecteds = educator.map((n) => n.company_name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleFilterByName = (event) => {
    // setPage(0);
    setFilterName(event.target.value);
  };

  //   const emptyRows =
  //     page > 0
  //       ? Math.max(0, (1 + page) * rowsPerPage - educator?.length)
  //       : 0;

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
        <title> Company | EduSkills </title>
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
            Welcome back to Comapany !
          </Typography>
          <Button
            variant="contained"
            color="info"
            // size='small'
            sx={{ textTransform: "initial" }}
            startIcon={<Icon icon="eva:plus-fill" />}
            onClick={handleDrawerOpen}
          >
            Add Company
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
            <TableContainer sx={{ minHeight: 335 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={educator?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        company_id,
                        company_name,
                        company_addr,
                        created_at,
                        update_at,
                        status,
                      } = row;
                      const selectedUser =
                        selected.indexOf(company_name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={company_id}
                          tabIndex={-1}
                          // role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            {index+1}
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
                              {/* <Tooltip title={company_name}> */}
                              <Typography
                                variant="subtitle2"
                                noWrap
                                sx={{
                                  maxWidth: "35ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {company_name}
                              </Typography>
                              {/* </Tooltip> */}
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            {/* <Tooltip title={address}> */}
                            <Typography
                              fontSize={12}
                              noWrap
                              sx={{
                                maxWidth: "25ch", // Adjust this value as needed
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {company_addr}
                            </Typography>
                            {/* </Tooltip> */}
                          </TableCell>
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            {/* <Tooltip title={address}> */}
                            <Typography
                              fontSize={12}
                              noWrap
                              sx={{
                                maxWidth: "15ch", // Adjust this value as needed
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {created_at}
                            </Typography>
                            {/* </Tooltip> */}
                          </TableCell>

                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            align="left"
                          >
                            {/* <Tooltip title={address}> */}
                            <Typography
                              fontSize={12}
                              noWrap
                              sx={{
                                maxWidth: "15ch", // Adjust this value as needed
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {update_at}
                            </Typography>
                            {/* </Tooltip> */}
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
                              sx={{ p: 0.65 }}
                              onClick={(event) => handleOpenMenu(event, row)}
                            >
                              <Icon icon="eva:more-vertical-fill" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )} */}
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
          <TablePagination
            sx={{
              bgcolor: colors.blueAccent[800],
              "& .MuiToolbar-root.MuiTablePagination-toolbar": {
                minHeight: 35, // Adjust the height value as needed
              },
            }}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* <CustomPagination
            page={page}
            count={count}
            setRowsPerPage={setRowsPerPage}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
          /> */}
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
          disabled
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
          title: "Add Company",
          fields: configField,
          saveButtonText: "Add Company", // Optional, default is "Add"
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
          title: "Edit Company",
          fields: configField,
          saveButtonText: "Update Company", // Optional, default is "Add"
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
