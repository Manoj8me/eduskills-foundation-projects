import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Box,
  Container,
  useTheme,
  Paper,
  TablePagination,
  TableCell,
  TableRow,
  TableBody,
  Stack,
  Table,
  TableContainer,
  CircularProgress,
  Card,
  // Button,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../../theme";
import { AdminService } from "../../../services/dataService";
import Label from "../../label";
import { UserListHead, UserListToolbar } from "../user";
import { filter, isEqual } from "lodash";
import { sentenceCase } from "change-case";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { setMouInstituteId } from "../../../store/Slices/admin/adminMouSlice";
import { useDispatch, useSelector } from "react-redux";
import CommonModal from "../modal/CommonModal";

//..............................
const TABLE_HEAD = [
  { id: "id", label: "#", alignRight: false },
  { id: "academy_name", label: "Academy Name", alignRight: false },
  { id: "agmt_date", label: "Agmt Date", alignRight: false },
  { id: "agmt_no", label: "Agmt No", alignRight: false },
  { id: "max_limit", label: "Max Limit", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "", label: "Action", alignRight: true },
];

// You can use dummyData in your component or wherever you need it.

//..............................................
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
        _user.academy_name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const MouTableDrawer = ({ isOpen, onClose, drawerData, title, institueId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [mouList, setMouList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Add states for edit mode and editing data
  const [isEditMode, setEditMode] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [addButton, setAddButton] = useState(false);
  const [agrNoErr, setAgrNoErr] = useState("");
  const [dateErr, setDateErr] = useState("");
  const [maxLimitErr, setMaxLimitErr] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programId, setProgramId] = useState(null);
  const [academyList, setAcademyList] = useState([]);
  const dispatch = useDispatch();
  const instituteIds = useSelector((state) => state.adminMou.institute_id);

  const fatchDateAcademy = async () => {
    try {
      const response = await AdminService.admin_academy_all();
      const data = response.data.data;
      const updateAcademy = data.map((academy) => ({
        academy_id: academy.academy_id,
        academy_name: academy.academy_name,
      }));
      setAcademyList(updateAcademy);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fatchDateAcademy();
  }, []);
  if (institueId) {
    dispatch(setMouInstituteId(institueId));
  }

  const addMouList = academyList.filter(
    (mou) =>
      !mouList.some((academy) => academy.academy_name === mou.academy_name)
  );
  const todayDate = new Date().toISOString().split("T")[0];
  const updateAcademyData = addMouList.map((data) => ({
    ...data,
    agmt_date: null,
    agmt_no: "",
    max_limit: 150,
    status: "InActive",
  }));

  useEffect(() => {
    setAgrNoErr("");
  }, [editingData.agmt_no]);

  useEffect(() => {
    setDateErr("");
  }, [editingData.agmt_date]);

  useEffect(() => {
    setMaxLimitErr("");
  }, [editingData.max_limit]);

  const handleClose = () => {
    onClose();
    setAddButton(false);
    setEditingData({});
    setEditMode(false);
    localStorage.removeItem("INST_ID");
    dispatch(setMouInstituteId(null));
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProgramId(null);
  };

  // const handleDeleteClick = (event, row) => {
  //   setDeleteModalOpen(true);
  //   setProgramId(row.program_id);
  // };

  const handleEditClick = (event, row) => {
    setEditMode(true);
    setEditingData(row);
  };

  const handleSaveClick = () => {
    // console.log(editingData);

    if (isEditMode) {
      const data = {
        ...editingData,
        status:
          editingData.status === "InActive"
            ? 0
            : editingData.status === "Active"
            ? 1
            : 2,
      };
      if (addButton) {
        const addData = {
          institute_id: instituteIds,
          data: {
            academy_id: data.academy_id,
            agmt_date: data.agmt_date || todayDate,
            agmt_no: data.agmt_no,
            max_limit: JSON.parse(data.max_limit),
            status: data.status,
          },
        };
        // console.log("Adding", addData);
        if (data.max_limit >= 150) {
          if (data.status === 1) {
            if (data.agmt_no && data.agmt_date) {
              // console.log("Updating with Agmt No & Agmt Date", data);
              setEditingData({});
              setEditMode(false);
              addMou(addData);
            } else {
              console.error("Required Agmt No & Agmt Date");
              // setAgrNoErr("Required Agmt No & Agmt Date");
              // handleErrorMessage("Required Agmt No & Agmt Date");
              if (data.agmt_no) {
                setDateErr("Required Agmt Date");
                handleErrorMessage("Required Agmt Date");
              } else {
                setAgrNoErr("Required Agmt No");
                handleErrorMessage("Required Agmt No");
              }
            }
          } else {
            setEditingData({});
            setEditMode(false);
            addMou(addData);
          }
        } else {
          handleErrorMessage("Required Max limit 150 or above");
          setMaxLimitErr("Required Max limit 150 or above");
        }
      } else {
        const updateData = {
          program_id: data.program_id,
          data: {
            agmt_date: data.agmt_date || todayDate,
            agmt_no: data.agmt_no === null ? "" : data.agmt_no,
            max_limit: JSON.parse(data.max_limit),
            status: data.status,
          },
        };

        if (updateData.data.max_limit >= 150) {
          if (updateData.data.status === 1) {
            if (updateData.data.agmt_no && updateData.data.agmt_date) {
              // console.log("Updating with Agmt No & Agmt Date", data);
              setEditingData({});
              setEditMode(false);
              updateMou(updateData);
            } else {
              console.error("Required Agmt No & Agmt Date");
              // setAgrNoErr("Required Agmt No & Agmt Date");
              // handleErrorMessage("Required Agmt No & Agmt Date");
              if (updateData.data.agmt_no) {
                setDateErr("Required Agmt Date");
                handleErrorMessage("Required Agmt Date");
              } else {
                setAgrNoErr("Required Agmt No");
                handleErrorMessage("Required Agmt No");
              }
            }
          } else {
            if (updateData.data.agmt_date) {
              // console.log("Updating with Agmt No & Agmt Date", data);
              setEditingData({});
              setEditMode(false);
              updateMou(updateData);
            } else {
              console.error("Required Agmt Date");
              setDateErr("Required Agmt Date");
              handleErrorMessage("Required Agmt Date");
            }
          }
        } else {
          handleErrorMessage("Required Max limit 150 or above");
          setMaxLimitErr("Required Max limit 150 or above");
        }
        // console.log("Updating", data);
      }
    }
  };
  // const handleSaveClick = () => {
  //   if (isEditMode) {
  //     const convertStatus = (status) => {
  //       const statusMap = {
  //         InActive: 0,
  //         Active: 1,
  //         // Add more mappings if needed
  //       };
  //       return statusMap[status] || 2; // Default to 2 if no mapping found
  //     };

  //     const handleValidationError = (agmtNo, agmtDate) => {
  //       if (!agmtNo) {
  //         setAgrNoErr("Required Agmt No");
  //         handleErrorMessage("Required Agmt No");
  //       }
  //       if (!agmtDate) {
  //         setDateErr("Required Agmt Date");
  //         handleErrorMessage("Required Agmt Date");
  //       }
  //     };

  //     const data = {
  //       ...editingData,
  //       status: convertStatus(editingData.status),
  //     };

  //     if (addButton) {
  //       const addData = {
  //         institute_id: instituteIds,
  //         data: {
  //           academy_id: data.academy_id,
  //           agmt_date: data.agmt_date || todayDate,
  //           agmt_no: data.agmt_no,
  //           max_limit: JSON.parse(data.max_limit),
  //           status: data.status,
  //         },
  //       };

  //       if (data.max_limit >= 150) {
  //         if (data.status === 1 && data.agmt_no && data.agmt_date) {
  //           setEditingData({});
  //           setEditMode(false);
  //           addMou(addData);
  //         } else {
  //           console.error("Validation Error: Required Agmt No & Agmt Date");
  //           handleValidationError(data.agmt_no, data.agmt_date);
  //         }
  //       } else {
  //         handleErrorMessage("Required Max limit 150 or above");
  //         setMaxLimitErr("Required Max limit 150 or above");
  //       }
  //     } else {
  //       const updateData = {
  //         program_id: data.program_id,
  //         data: {
  //           agmt_date: data.agmt_date || todayDate,
  //           agmt_no: data.agmt_no === null ? "" : data.agmt_no,
  //           max_limit: JSON.parse(data.max_limit),
  //           status: data.status,
  //         },
  //       };

  //       if (hasDataChanged(updateData)) {
  //         setEditingData({});
  //         setEditMode(false);
  //         updateMou(updateData);
  //       } else {
  //         console.log("Data has not changed. No update needed.");
  //       }
  //     }
  //   }
  // };

  // // Function to check if the data has changed
  // const hasDataChanged = (updateData) => {
  //   return !isEqual(updateData, existingData); // Example: isEqual from lodash
  // };

  const handleCancelClick = () => {
    // Discard changes and set edit mode to false
    setEditMode(false);
    // setEditingData({});
  };

  const handleConfirmDelete = async () => {
    // console.log(programId);
    // try {
    //   const response = await AdminService.admin_institute_delete(
    //     deletingItemId
    //   );
    //   const data = response.data;
    //   handleSuccessMessage(data.detail);
    //   closeDeleteModal();
    //   setRefreshTable((prev) => !prev);
    // } catch (error) {
    //   // Handle error, show notification, etc.
    //   handleErrorMessage(error.message);
    //   console.error("Error deleting item:", error);
    // }
    setDeleteModalOpen(false);
  };
  const fetchMouList = async (instituteId) => {
    setIsTableLoading(true);
    try {
      const res = await AdminService.admin_academy_edit_all(instituteId);
      const mou_list = res.data.data;
      setMouList(mou_list);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const updateMou = async (updateData) => {
    setIsTableLoading(true);
    try {
      const res = await AdminService.admin_update_mou(updateData);
      const mou_list = res.data;
      handleSuccessMessage(mou_list.detail || "Updated Successfully.");
      setRefresh((pre) => !pre);
    } catch (error) {
      console.error(error);
      handleErrorMessage(
        error.response.data.detail ||
          "Unable to update. Please try again after some time."
      );
    } finally {
      setIsTableLoading(false);
    }
  };

  const addMou = async (addData) => {
    setIsTableLoading(true);
    try {
      const res = await AdminService.admin_add_mou(addData);
      const mou_list = res.data;
      handleSuccessMessage(mou_list.detail || "Add Successfully.");
      setRefresh((pre) => !pre);
    } catch (error) {
      console.error(error);
      handleErrorMessage(
        error.response.data.detail ||
          "Unable to add. Please try again after some time."
      );
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    if (instituteIds) {
      // console.log("ok");
      fetchMouList(instituteIds);
    }
  }, [instituteIds, refresh]);
  //   const formatKey = (key) => {
  //     const formattedKey = key
  //       .replace(/_/g, " ")
  //       .replace(/\b\w/g, (match) => match.toUpperCase());
  //     return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
  //   };
  //..........................

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = mouList.map((n) => n.institute_name);
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
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage -
            (addButton ? updateAcademyData : mouList).length
        )
      : 0;

  const filteredUsers = applySortFilter(
    addButton ? updateAcademyData : mouList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

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

  return (
    <Drawer anchor="left" open={isOpen}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: colors.blueAccent[800],
          px: 2,
          py: 0.5,
        }}
      >
        <Typography
          variant="h6"
          color={colors.blueAccent[200]}
          fontWeight={600}
          noWrap
          sx={{
            maxWidth: "35ch", // Adjust this value as needed
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          MOU : {drawerData?.institute_name || title}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Close Drawer"
          onClick={handleClose}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Container
        sx={{
          [theme.breakpoints.down("sm")]: {
            maxWidth: "600px",
            overflowX: "auto",
          },
          [theme.breakpoints.down("md")]: {
            maxWidth: "700px",
          },
          [theme.breakpoints.up("md")]: {
            width: "800px",
          },
          my: 1,
        }}
      >
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            setAddButton={setAddButton}
            addButton={addButton}
            isMouAdd={true}
          />
          {isTableLoading ? ( // Check if data is loading
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
            <TableContainer sx={{ maxHeight: 460, overflowX: "auto" }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={(addButton ? updateAcademyData : mouList).length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        program_id,
                        academy_name,
                        agmt_date,
                        agmt_no,
                        max_limit,
                        academy_id,
                        status,
                      } = row;
                      const selectedUser =
                        selected.indexOf(academy_name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={program_id}
                          tabIndex={-1}
                          // role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell
                            sx={{
                              paddingTop: 0.3,
                              paddingBottom: 0.3,
                              overflow: "auto",
                            }}
                          >
                            {page * rowsPerPage + index + 1}
                          </TableCell>

                          <TableCell
                            sx={{
                              paddingTop: 0.3,
                              paddingBottom: 0.3,
                              overflow: "auto",
                            }}
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
                              <Typography
                                variant="subtitle2"
                                noWrap
                                sx={{
                                  maxWidth: "15ch", // Adjust this value as needed
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {academy_name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              paddingTop: 0.3,
                              paddingBottom: 0.3,
                              overflow: "auto",
                            }}
                          >
                            {isEditMode &&
                            (addButton
                              ? editingData.academy_id === academy_id
                              : editingData.program_id === program_id) ? (
                              // Input field for agmt_date in edit mode
                              <input
                                style={{
                                  maxWidth: 100,
                                  border: dateErr && "1px solid red",
                                }}
                                type="date"
                                value={editingData.agmt_date || ""}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    agmt_date: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {agmt_date}
                                </Typography>
                              </Stack>
                            )}
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              paddingTop: 0.3,
                              paddingBottom: 0.3,
                              overflow: "auto",
                            }}
                          >
                            {isEditMode &&
                            (addButton
                              ? editingData.academy_id === academy_id
                              : editingData.program_id === program_id) ? (
                              // Input field for agmt_no in edit mode
                              <input
                                style={{
                                  maxWidth: 120,
                                  border: agrNoErr && "1px solid red",
                                }}
                                type="text"
                                value={editingData.agmt_no || ""}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    agmt_no: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {agmt_no}
                                </Typography>
                              </Stack>
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              paddingTop: 0.3,
                              paddingBottom: 0.3,
                              overflow: "auto",
                            }}
                          >
                            {isEditMode &&
                            (addButton
                              ? editingData.academy_id === academy_id
                              : editingData.program_id === program_id) ? (
                              // Input field for agmt_no in edit mode
                              <input
                                style={{
                                  maxWidth: 50,
                                  border: maxLimitErr && "1px solid red",
                                }}
                                type="text"
                                value={editingData.max_limit || ""}
                                onChange={
                                  (e) => {
                                    const inputValue = e.target.value;
                                    if (/^[0-9]*$/.test(inputValue)) {
                                      setEditingData({
                                        ...editingData,
                                        max_limit: inputValue,
                                      });
                                    } else {
                                      handleErrorMessage(
                                        "Invalid input. Please enter a valid number."
                                      );
                                    }
                                  }
                                  // setEditingData({
                                  //   ...editingData,
                                  //   max_limit: e.target.value,
                                  // })
                                }
                              />
                            ) : (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {max_limit}
                                </Typography>
                              </Stack>
                            )}
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              paddingTop: 0.3,
                              paddingBottom: 0.3,
                              overflow: "auto",
                            }}
                          >
                            {isEditMode &&
                            (addButton
                              ? editingData.academy_id === academy_id
                              : editingData.program_id === program_id) ? (
                              // Select field for status in edit mode

                              <select
                                value={editingData.status}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    status: e.target.value,
                                  })
                                }
                              >
                                <option value="InActive">InActive</option>
                                <option value="Active">Active</option>
                                <option value="InProgress">InProgress</option>
                              </select>
                            ) : (
                              <Label
                                color={
                                  status === "InActive"
                                    ? "error"
                                    : status === "Active"
                                    ? "success"
                                    : "warning"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            )}
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              paddingTop: 0.3,
                              paddingBottom: 0.3,
                              overflow: "auto",
                              display: "flex",
                            }}
                          >
                            {isEditMode &&
                            (addButton
                              ? editingData.academy_id === academy_id
                              : editingData.program_id === program_id) ? (
                              // Save and Cancel buttons in edit mode
                              <>
                                <Tooltip title={addButton ? "Add" : "Save"}>
                                  <IconButton
                                    size="medium"
                                    color="success"
                                    onClick={handleSaveClick}
                                  >
                                    <Icon icon={"lets-icons:save-duotone"} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title= "Cancel">
                                  <IconButton
                                    size="medium"
                                    color="error"
                                    onClick={handleCancelClick}
                                  >
                                    <Icon icon={"ic:twotone-cancel"} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip title={"Edit" }>
                                  <IconButton
                                    size="medium"
                                    color="info"
                                    onClick={(event) =>
                                      handleEditClick(event, row)
                                    }
                                  >
                                    <Icon
                                      icon={
                                        addButton
                                          ? "icon-park-twotone:add"
                                          : "icon-park-twotone:edit-two"
                                      }
                                    />
                                  </IconButton>
                                </Tooltip>
                                {/* {!addButton && (
                                  <IconButton
                                    size="medium"
                                    color="error"
                                    disabled
                                    // disabled={isEditMode}
                                    onClick={(event) =>
                                      handleDeleteClick(event, row)
                                    }
                                  >
                                    <Icon
                                      icon={"icon-park-twotone:delete-four"}
                                    />
                                  </IconButton>
                                )} */}
                              </>
                            )}
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
                      <TableCell
                        align="center"
                        colSpan={7}
                        sx={{ paddingTop: 3, paddingBottom: 3 }}
                      >
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
            // </Scrollbar>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={(addButton ? updateAcademyData : mouList).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {/* <Typography>No data to view</Typography> */}
      </Container>
      <CommonModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        action="delete"
      />
    </Drawer>
  );
};

export default MouTableDrawer;
