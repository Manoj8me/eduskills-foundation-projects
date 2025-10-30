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
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import Label from "../label/Label";

import { UserListHead, UserListToolbar } from "../common/user/index";

import { Icon } from "@iconify/react";
// import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
// import { fetchDomainList } from "../../../store/Slices/dashboard/domainListSlice";
import { useEffect } from "react";
// import { AdminService } from "../../../services/dataService";

import { toast } from "react-toastify";

// import {
//   fetchInstituteState,
//   fetchMembershipPackage,
// } from "../../../store/Slices/dashboard/statepackageSlice";
// import CommonModal from "../../../components/common/modal/CommonModal";
// import StaffInstitute from "../../../components/StaffSection/StaffInstitute";
import { tokens } from "../../theme";
import { fetchDomainList } from "../../store/Slices/dashboard/domainListSlice";
// import {
//   fetchInstituteState,
//   fetchMembershipPackage,
// } from "../../store/Slices/dashboard/statepackageSlice";
import { AdminService } from "../../services/dataService";
import StaffInstitute from "../StaffSection/StaffInstitute";
import CommonModal from "../common/modal/CommonModal";
import { CustomPagination } from "../common/pagination";
import MouTableDrawer from "../common/drawer/MouTableDrawer";

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: "mem_no", label: "#", alignRight: false },
//   { id: "name", label: "Institute Name", alignRight: false },
//   { id: "state_name", label: "State Name", alignRight: false },
//   { id: "status", label: "Status", alignRight: false },
//   { id: "", label: "Action", alignRight: true },
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
        _user.institute_name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MouTable({ setMouToggle, mouToggle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userRole = useSelector((state) => state.authorise.userRole);

  const [collageList, setCollageList] = useState([]);

  const [academyList, setAcademyList] = useState([]);

  const [open, setOpen] = useState(null);
  const [openFilter, setOpenFilter] = useState(null);

  const [oldPage, setOldPage] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedItem, setSelectedItem] = useState(null);
  const [setectedRow, setSetectedRow] = useState({});

  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);

  const [institueId, setInstitueId] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [selectedAcademies, setSelectedAcademies] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [isMouDrawerOpen, setIsMouDrawerOpen] = useState(false);
  const [refresh, setRefresh] = useState(false)

  // const filterInstituteList = collageList?.map((institute) => ({
  //   // ...institute,
  //   ...institute,
  //   academys: institute?.academys?.map((academy) => ({
  //     ...academy,
  //     academy_id: academyList.filter(
  //       (acdmy) => acdmy.academy_name === academy.academy_name
  //     )[0]?.academy_id,
  //   })),
  // }));
  const filterInstituteList = collageList?.map((institute) => {
    const academysWithId = institute?.academys?.map((academy) => ({
      ...academy,
      academy_id:
        academyList.find((acdmy) => acdmy.academy_name === academy.academy_name)
          ?.academy_id || null,
    }));

    // Find the academy with the maximum length based on the number of academys
    const maxAcademyLength = Math.max(
      ...academysWithId.map((academy) => academy?.academy_id?.length)
    );
    const academyWithMaxLength = academysWithId.find(
      (academy) => academy?.academy_id?.length === maxAcademyLength
    );

    return {
      ...institute,
      academys: academysWithId,
      academyWithMaxLength,
    };
  });

  const maxLength = Math.max(
    ...filterInstituteList.map((item) => item?.academys?.length || 0)
  );

  const filterData = filterInstituteList
    ?.filter((item) => item.academys.length === maxLength)
    .map((item) =>
      item?.academys.map((v) => ({
        academy_name: v.academy_name,
        academy_id: v.academy_id,
      }))
    )[0];

  // const filteredInstituteList = filterInstituteList.map((institute) => ({
  //   academys: institute.academys.filter((academy) =>
  //   selectedAcademies.includes(academy.academy_id)
  //   )
  // }));

  //---------------------------------------------------
  const handleAcademyCheckboxChange = (academy_id) => {
    const newSelectedAcademies = selectedAcademies?.includes(academy_id)
      ? selectedAcademies?.filter((id) => id !== academy_id)
      : [...selectedAcademies, academy_id];

    setSelectedAcademies(newSelectedAcademies);
  };

  const handleStatusCheckboxChange = (status) => {
    const newSelectedStatus = selectedStatus?.includes(status)
      ? selectedStatus?.filter((selected) => selected !== status)
      : [...selectedStatus, status];

    setSelectedStatus(newSelectedStatus);
  };

  // Assuming selectedAcademies and selectedStatus are your state variables
  const filterInstituteLists = filterInstituteList?.map((institute) => {
    const academys = institute.academys || [];
    const filteredAcademys = academys.filter(
      (academy) =>
        selectedAcademies.includes(academy.academy_id) &&
        selectedStatus.includes(academy.status)
    );

    return {
      institute_name: institute.institute_name,
      institue_id: institute.institue_id,
      mem_no: institute.mem_no,
      academys: filteredAcademys,
    };
  });

  //---------------------------------------------------

  const sortedFilterInstituteList = filterInstituteLists;
  // .slice()
  // .sort((a, b) => a.mem_no - b.mem_no);

  // const headerFilterDatas = sortedFilterInstituteList?.map((data) =>
  //   data.academys.map((newData) => ({
  //     academy_name: newData.academy_name,
  //     academy_id: newData.academy_id,
  //   }))
  // )[0];

  const headerFilterDatas =
    sortedFilterInstituteList
      ?.reduce((maxAcademy, currentInstitute) => {
        if (
          !maxAcademy ||
          currentInstitute.academys.length > maxAcademy.academys.length
        ) {
          return currentInstitute;
        }
        return maxAcademy;
      }, null)
      ?.academys?.map((newData) => ({
        academy_name: newData.academy_name,
        academy_id: newData.academy_id,
      })) || [];

  const headerUpdateFilterData =
    headerFilterDatas?.map((data) => ({
      id:
        typeof data.academy_name === "string"
          ? data.academy_name.toLowerCase()
          : data.academy_name,
      label: data.academy_name,
      alignRight: false,
    })) || [];

  const TABLE_HEAD = [
    { id: "mem_no", label: "#", alignRight: false },
    { id: "name", label: "Institute Name", alignRight: false },
    ...headerUpdateFilterData,
    // { id: "state_name", label: "State Name", alignRight: false },
    // { id: "status", label: "Status", alignRight: false },
    { id: "", label: "Action", alignRight: true },
  ];
  
  const fatchDateAcademy = async () => {
    try {
      const response = await AdminService.admin_academy_all();
      const data = response.data.data;

      const filterData = data.filter((item) => item.status === "Active");

      setAcademyList(filterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
    }
  };
  useEffect(() => {
    fatchDateAcademy();
  }, []);

  useEffect(() => {
    const statusMapping = {
      Active: "1",
      InActive: "0",
      InProgress: "2",
    };

    const selectedStatusWithValues = selectedStatus.map((status) => {
      // Check if the status has a mapping, if not, use the original status
      return statusMapping.hasOwnProperty(status)
        ? statusMapping[status]
        : status;
    });

    const filterdata = {
      page: page === undefined ? 1 : page,
      page_size: rowsPerPage,
      academy_id: selectedAcademies[0] === undefined ? [] : selectedAcademies,
      status: [],
    };

    const fetchData = async () => {
      setLoadingTable(true);
      try {
        const response = await AdminService.admin_mou_list(filterdata);
        const data = response.data.data;
        setCollageList(data)
        setPage(response.data?.page);
        setCount(response.data?.total_pages);
        setRowsPerPage(response.data?.page_size);
        setRefresh((pre)=>!pre)
      } catch (error) {
        console.error("Error fetching data:", error?.message);
        setLoadingTable(false)
      } 
      // finally {
      //   setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
      // }
    };
    if (userRole === "admin") {
      fetchData();
    }
  }, [page, rowsPerPage, refreshTable]);

  // Initialize output array
  useEffect(()=>{
    if (academyList?.length !== 0 && collageList?.length !==0 ) {
      const updatedCollageList = collageList.map((institute) => {
        // Create a copy of the institute
        const updatedInstitute = { ...institute };
        // Iterate over each academy in the academyList
        const updatedAcademys = academyList.map((academy) => {
          // Check if the current academy exists in the institute's academys array
          const existingAcademy = updatedInstitute.academys.find(
            (item) => item.academy_name === academy.academy_name
          );
          // If the academy exists in the institute's academys array, return it as it is
          if (existingAcademy) return existingAcademy;
          // If the academy does not exist in the institute's academys array, return a new academy object with default values
         
          return {
            academy_name: academy.academy_name,
            status: "InActive",
            agmt_no: "Not Assigned",
          };
        });
        // Update the academys array in the institute with the updatedAcademys array
        updatedInstitute.academys = updatedAcademys;
        // Return the updated institute
        return updatedInstitute;
      });

      setCollageList(updatedCollageList);
      setLoadingTable(false)
    }
  },[refresh])
 
  //...................................................
  const openMouDrawer = (item) => {
    setInstitueId(item.institue_id);
    setSelectedItem(item);
    setIsMouDrawerOpen(true);
    handleCloseMenu();
  };

  const closeDrawer = () => {
    setEditDrawerOpen(false);
    setSelected([]);
    setSelectedItem(null);
    setSetectedRow({});
    setInstitueId(null);
    setIsMouDrawerOpen(false);
  };
  //...................................................

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

  //.....................................................

  const openEditDrawer = (item) => {
    setSelectedItem(item);
    setInstitueId(item.institue_id);
    setEditDrawerOpen(true);
    handleCloseMenu();
  };

  // Function to close the drawer

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSetectedRow(row);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenFilter = (event) => {
    setOpenFilter(event.currentTarget);
  };

  const handleClosFilter = () => {
    setOpenFilter(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sortedFilterInstituteList.map(
        (n) => n.institute_name
      );
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setPage(0);
  //   setRowsPerPage(parseInt(event.target.value, 10));
  // };

  const handleFilterByName = (event) => {
    // setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    oldPage > 0
      ? Math.max(
          0,
          (1 + oldPage) * rowsPerPage - sortedFilterInstituteList.length
        )
      : 0;

  const filteredUsers = applySortFilter(
    sortedFilterInstituteList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;
  // let superAdmin = false;
  const initialAcademy = filterData?.map((item) => item.academy_id);
  useEffect(() => {
    setSelectedStatus(["Active", "InActive", "InProgress"]);
    setSelectedAcademies(initialAcademy || []);
  }, [academyList, collageList]);

  return (
    <>
      <Helmet>
        <title> Institute | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          height={27.5}
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: colors.blueAccent[300] }}
          >
            Welcome back to Mou !
          </Typography>
          {/* <Button
              variant="contained"
              color="info"
              size='small'
              sx={{ textTransform: "initial" }}
              startIcon={<Icon icon="eva:plus-fill" />}
              onClick={() => openAddDrawer()}
            >
              Add Institute
            </Button> */}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            isMouToggle={true}
            setMouToggle={setMouToggle}
            mouToggle={mouToggle}
            mouFilter={true}
            onFilterOpen={handleOpenFilter}
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
                  rowCount={sortedFilterInstituteList?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    ?.slice(
                      oldPage * rowsPerPage,
                      oldPage * rowsPerPage + rowsPerPage
                    )
                    ?.map((row, index) => {
                      const { institue_id, institute_name, mem_no, academys } =
                        row;
                      const selectedUser =
                        selected?.indexOf(institute_name) !== -1;

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
                            {mem_no}
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
                              <Typography variant="subtitle2" noWrap>
                                {institute_name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          {academys?.map((item, i) => (
                       
                            <TableCell
                              align="left"
                              key={i}
                              sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                     
                                {/* <Label
                                  color={
                                    item?.status === "InActive"
                                      ? "error"
                                      : item?.status === "Active"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {sentenceCase(item?.status)}
                                </Label> */}
                                <Tooltip title={item?.agmt_no === "Not Assigned"?"Academy Not Assigned":`Agmt No.: ${item?.agmt_no}`}>
                                  <IconButton
                                    color={
                                      item?.status === "Active"
                                        ? "success"
                                        : item?.status === "InActive"
                                        ? "error"
                                        : item?.status === "InProgress"
                                        ? "warning"
                                        : ""
                                    }
                                    sx={{ p: 0, cursor: "default" }}
                                  >
                                    <Icon
                                      fontSize={20}
                                      icon={
                                        item?.status === "InActive"
                                          ? "gridicons:cross-circle"
                                          : item?.status === "Active"
                                          ? "mdi:tick-circle"
                                          : item?.status === "InProgress"
                                          ? "ph:clock-countdown-fill"
                                          : "fluent:line-horizontal-1-dashes-16-filled"
                                      }
                                    />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          ))}

                          <TableCell
                            align="right"
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            <IconButton
                              size="medium"
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
          <CustomPagination
            setRowsPerPage={setRowsPerPage}
            rowsPerPage={rowsPerPage}
            count={count}
            page={page}
            setPage={setPage}
          />
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedFilterInstituteList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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
          onClick={() => openMouDrawer(setectedRow)}
        >
          <Icon icon={"mdi:note-edit"} sx={{ mr: 2 }} />
          <Typography ml={0.5}>Edit Mou</Typography>
        </MenuItem>
      </Popover>

      <Popover
        open={Boolean(openFilter)}
        anchorEl={openFilter}
        onClose={handleClosFilter}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Grid
          container
          spacing={1}
          sx={{ p: 1, bgcolor: colors.blueAccent[900] }}
        >
          <Grid item>
            <Paper elevation={0} sx={{ px: 1, py: 0.5 }}>
              {/* First Paper Section - Status */}
              <div>
                <Typography
                  variant="h5"
                  sx={{ mb: 0.5, fontSize: 10, fontWeight: 600 }}
                >
                  Academy
                </Typography>
                <Divider />
                <FormControl
                  component="fieldset"
                  sx={{ maxHeight: 200, overflowX: "auto", px: 0.5 }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          color="info"
                          sx={{ p: 0.5, ml: 0.5 }}
                        />
                      }
                      label="All"
                      checked={
                        selectedAcademies?.length === academyList?.length
                      }
                      onChange={() =>
                        setSelectedAcademies(
                          selectedAcademies?.length === academyList?.length
                            ? []
                            : academyList?.map((item) => item.academy_id)
                        )
                      }
                    />
                    {academyList?.map((academy) => (
                      <Box key={academy?.academy_id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              color="info"
                              sx={{ p: 0.5, ml: 0.5 }}
                              checked={selectedAcademies.includes(
                                academy.academy_id
                              )}
                              onChange={() =>
                                handleAcademyCheckboxChange(academy?.academy_id)
                              }
                            />
                          }
                          label={academy.academy_name}
                        />
                      </Box>
                    ))}
                  </FormGroup>
                </FormControl>
              </div>
            </Paper>

            <Button
              color="info"
              variant="outlined"
              size="small"
              sx={{ mt: 1, width: "100%" }}
              onClick={() => {
                setRefreshTable(!refreshTable);
                handleClosFilter();
              }}
            >
              Apply
            </Button>
          </Grid>
          {/* <Grid
            item={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          > */}
          {/* <Paper elevation={0} sx={{ px: 1, py: 0.5 }}> */}
          {/* Second Paper Section - Academy */}
          {/* <Box sx={{minWidth:100}}> */}
          {/* <Typography
                  variant="h5"
                  sx={{ mb: 0.5, fontSize: 10, fontWeight: 600 }}
                >
                  Status
                </Typography>
                <Divider /> */}
          {/* <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          color="info"
                          sx={{ p: 0.5, ml: 0.5 }}
                        />
                      }
                      label="All"
                      checked={selectedStatus.length === 3}
                      onChange={() =>
                        setSelectedStatus(
                          selectedStatus.length === 3
                            ? []
                            : ["Active", "InActive", "InProgress"]
                        )
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          color="success"
                          sx={{ p: 0.5, ml: 0.5 }}
                          checked={selectedStatus.includes("Active")}
                          onChange={() => handleStatusCheckboxChange("Active")}
                        />
                      }
                      label="Active"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          color="error"
                          sx={{ p: 0.5, ml: 0.5 }}
                          checked={selectedStatus.includes("InActive")}
                          onChange={() =>
                            handleStatusCheckboxChange("InActive")
                          }
                        />
                      }
                      label="InActive"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          color="warning"
                          sx={{ p: 0.5, ml: 0.5 }}
                          checked={selectedStatus.includes("InProgress")}
                          onChange={() =>
                            handleStatusCheckboxChange("InProgress")
                          }
                        />
                      }
                      label="InProgress"
                    />
                  </FormGroup>
                </FormControl> */}
          {/* </Box> */}
          {/* </Paper> */}

          {/* </Grid> */}
        </Grid>
      </Popover>

      {/* Render the CommonDrawer component with dynamic fields */}
      <MouTableDrawer
        title={"Mou Details"}
        isOpen={isMouDrawerOpen}
        institueId={institueId}
        onClose={closeDrawer}
        drawerData={selectedItem}
      />
      <CommonModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        // onConfirm={handleConfirmDelete}
        action="delete"
      />
    </>
  );
}
