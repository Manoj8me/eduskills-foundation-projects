import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useState, useEffect } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  Box,
  CircularProgress,
  Tooltip,
  TablePagination,
} from "@mui/material";
// components
import Label from "../../../components/label";
import { UserListHead, UserListToolbar } from "../../../components/common/user";
import { Icon } from "@iconify/react";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { toast } from "react-toastify";
import { AdminService } from "../../../services/dataService";
import CustomAddDrawer from "../../../components/common/drawer/CustomAddDrawer";
import CustomEditDrawer from "../../../components/common/drawer/CustomEditDrawer";
import { fetchEducatorDesignation } from "../../../store/Slices/admin/adminEduDesigSlice";
import CommonModal from "../../../components/common/modal/CommonModal";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";
import axios from 'axios';
import { BASE_URL } from "../../../services/configUrls";
import { ITSupportModals } from './ITSupportModals';
import { useSupportStaff } from './useSupportStaff';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "", label: "Sl.", alignRight: false },
  { id: "email", label: "Email Id", alignRight: false },
  { id: "google_meet_link", label: "Google Meet Link", alignRight: false },
 
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
        _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        (_user.google_meet_link && _user.google_meet_link.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ITSupportStaff() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  
  // Custom hook for support staff logic
  const {
    supportStaff,
    categories,
    loadingTable,
    refresh,
    setRefresh,
    handleAddSupportStaff,
    handleUpdateSupportStaff,
    handleDeleteSupportStaff,
    fetchUserCategories,
    handleSupportStatusToggle,
    handleSuccessMessage,
    handleErrorMessage,
    configField,
    authToken,
  } = useSupportStaff();

  // Table state
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("email");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState({});

  // Drawer state (keeping for potential future use)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [supportStaffId, setSupportStaffId] = useState(null);

  useEffect(() => {
    dispatch(fetchEducatorDesignation());
    dispatch(fetchInstituteState());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Modal functions - Now properly calling the exposed functions
  const handleViewCategories = (row) => {
    handleCloseMenu();
    if (window.handleViewCategories) {
      window.handleViewCategories(row);
    }
  };

  const handleAddToCategory = (row) => {
    handleCloseMenu();
    if (window.handleAddToCategory) {
      window.handleAddToCategory(row);
    }
  };

  const handleUpdateMeetingLink = (row) => {
    handleCloseMenu();
    if (window.handleUpdateMeetingLink) {
      window.handleUpdateMeetingLink(row);
    }
  };

  const handleAddConfirm = (addedItem) => {
    const supportData = {
      email: addedItem.email,
      category: addedItem.category,
      google_meet_link: addedItem.google_meet_link || "",
    };

    handleAddSupportStaff(supportData);
  };

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSelectedRow(row);
    setSupportStaffId(row.user_id);
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
      const newSelecteds = supportStaff.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - supportStaff?.length) : 0;

  const filteredUsers = applySortFilter(
    supportStaff,
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
        <title> IT Support Staff | EduSkills </title>
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
            sx={{ fontWeight: "bold", color: colors?.blueAccent?.[300] || "#2196f3" }}
          >
            Welcome back to IT Support Staff !
          </Typography>
          <Button
            variant="contained"
            color="info"
            size="small"
            sx={{ textTransform: "initial" }}
            startIcon={<Icon icon="eva:plus-fill" />}
            onClick={handleDrawerOpen}
          >
            Add Support Staff
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected?.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          {loadingTable ? (
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
                        email,
                        google_meet_link,
                      } = row;
                      const selectedUser = selected.indexOf(email) !== -1;

                      return (
                        <TableRow
                          hover
                          key={user_id}
                          tabIndex={-1}
                          selected={selectedUser}
                        >
                          <TableCell
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            {page * rowsPerPage + index + 1}
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
                                  maxWidth: "25ch",
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
                            <Tooltip title={google_meet_link || 'No link provided'}>
                              <Typography
                                fontSize={12}
                                noWrap
                                sx={{
                                  maxWidth: "30ch",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {google_meet_link || 'No link provided'}
                              </Typography>
                            </Tooltip>
                          </TableCell>

                          
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}

                  {isNotFound && (
                    <TableRow>
                      <TableCell align="center" colSpan={4} sx={{ py: 14.2 }}>
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
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={supportStaff.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* Action Menu Popover - Only Modal Actions */}
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
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
          onClick={() => handleViewCategories(selectedRow)}
        >
          <Icon icon={"eva:eye-fill"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>View Categories</Typography>
        </MenuItem>

        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => handleAddToCategory(selectedRow)}
        >
          <Icon icon={"eva:plus-circle-fill"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Add to Category</Typography>
        </MenuItem>

        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => handleUpdateMeetingLink(selectedRow)}
        >
          <Icon icon={"eva:video-fill"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Update Meeting Link</Typography>
        </MenuItem>
      </Popover>

      <ITSupportModals
        selectedRow={selectedRow}
        categories={categories}
        fetchUserCategories={fetchUserCategories}
        handleSupportStatusToggle={handleSupportStatusToggle}
        handleSuccessMessage={handleSuccessMessage}
        handleErrorMessage={handleErrorMessage}
        authToken={authToken}
      />

      <CustomAddDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        config={{
          title: "Add Support Staff",
          fields: configField,
          saveButtonText: "Add Support Staff",
          cancelButtonText: "Cancel",
          modalAction: "add",
        }}
        refresh={refresh}
        onConfirm={handleAddConfirm}
      />
    </>
  );
}
