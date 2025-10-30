import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  useTheme,
  CircularProgress,
  useMediaQuery,
  Skeleton,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import EditModal from "./EditModal";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginTop: theme.spacing(2),
  overflow: "auto",
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c1c1c1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#a8a8a8",
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: theme.spacing(1.5),
  fontSize: "0.8rem",
  whiteSpace: "nowrap",
  "&:first-of-type": {
    paddingLeft: theme.spacing(3),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "0.8rem",
  whiteSpace: "nowrap",
  "&:first-of-type": {
    paddingLeft: theme.spacing(3),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  height: "52px",
}));

const NoDataWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

const MobileExpandableRow = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.action.hover,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  margin: theme.spacing(0.5, 0),
  "& .label": {
    fontWeight: 500,
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
  },
  "& .value": {
    fontSize: "0.75rem",
  },
}));

const TableCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.primary.main,
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

// Styled component for cohort chips
const CohortChip = styled(Chip)(({ theme }) => ({
  height: "20px",
  fontSize: "0.7rem",
  fontWeight: 500,
  margin: "1px",
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.dark,
  "& .MuiChip-label": {
    padding: "0 6px",
  },
}));

// Function to normalize branch names for display
const normalizeBranchName = (branch) => {
  if (!branch) return "";

  let normalized = String(branch)
    .replace(/&\s*/, "& ")
    .replace(/^AI\s*&\s*DS$/, "AI & DS")
    .replace(
      /Computer Science and Engineering \(Data Science/,
      "CSE (Data Science)"
    )
    .replace(/Computer Science Engineering/, "CSE")
    .replace(/Computer Science and Engineering/, "CSE")
    .replace(/Electronica & Communication Engineering/, "ECE")
    .replace(/ELECTRONICS and COMPUTER SCIENCE \(ECS\)/, "ECS")
    .replace(/Electrical & Electronics Engineering/, "EEE");

  return normalized;
};

// Function to get status color
const getStatusChipColor = (status) => {
  switch (status?.toLowerCase()) {
    case "applied":
      return "primary";
    case "active":
      return "success";
    case "not applied":
      return "warning";
    case "inactive":
      return "default";
    default:
      return "default";
  }
};

// Utility function to check if a value is empty/null/N/A
const isEmptyOrNA = (value) => {
  return (
    value === null || value === undefined || value === "" || value === "N/A"
  );
};

// Function to render cohorts as chips
const renderCohorts = (cohorts) => {
  if (!Array.isArray(cohorts) || cohorts.length === 0) {
    return (
      <Typography variant="caption" color="textSecondary">
        N/A
      </Typography>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 0.3, maxWidth: "120px" }}
    >
      {cohorts.map((cohort, index) => (
        <CohortChip key={index} label={cohort} size="small" variant="filled" />
      ))}
    </Box>
  );
};

const ResultsTable = ({
  searchParams,
  data = [],
  loading = false,
  totalCount = 0,
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
  showActions = false,
  showCheckboxes = false,
  onSelectionChange = () => {},
  selectedIds = [],
  filterOptions = {},
  onStudentUpdated = () => {},
  userRole = "",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedRow, setExpandedRow] = useState(null);
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedIds);

  // Action menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Check if user is a leader (disable actions for leaders)
  const isLeader = userRole === "leaders";

  // Update local state when prop changes
  useEffect(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setExpandedRow(null);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setExpandedRow(null);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  // Toggle expanded row
  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Handle checkbox selection
  const handleCheckboxChange = (event, id) => {
    if (isLeader) return;

    let newSelected = [...localSelectedIds];

    if (event.target.checked) {
      newSelected.push(id);
    } else {
      newSelected = newSelected.filter((selectedId) => selectedId !== id);
    }

    setLocalSelectedIds(newSelected);
    onSelectionChange(newSelected);
  };

  // Handle select all checkboxes for inactive profiles
  const handleSelectAllClick = (event) => {
    if (isLeader) return;

    if (event.target.checked) {
      const inactiveIds = data
        .filter((row) => row.profileStatus === "inactive")
        .map((row) => row.id);
      setLocalSelectedIds(inactiveIds);
      onSelectionChange(inactiveIds);
      return;
    }

    setLocalSelectedIds([]);
    onSelectionChange([]);
  };

  // Check if all inactive profiles on this page are selected
  const areAllInactiveSelected = () => {
    const inactiveRows = data.filter((row) => row.profileStatus === "inactive");
    return (
      inactiveRows.length > 0 &&
      inactiveRows.every((row) => localSelectedIds.includes(row.id))
    );
  };

  // Check if some inactive profiles are selected
  const areSomeInactiveSelected = () => {
    const inactiveRows = data.filter((row) => row.profileStatus === "inactive");
    return (
      inactiveRows.some((row) => localSelectedIds.includes(row.id)) &&
      !areAllInactiveSelected()
    );
  };

  // Count inactive profiles on this page
  const getInactiveProfileCount = () => {
    return data.filter((row) => row.profileStatus === "inactive").length;
  };

  // Handle action button click
  const handleActionClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  // Handle close action menu
  const handleActionClose = () => {
    setAnchorEl(null);
  };

  // Handle edit action
  const handleEditAction = () => {
    setEditModalOpen(true);
    handleActionClose();
  };

  // Handle edit success
  const handleEditSuccess = (updatedData) => {
    onStudentUpdated(updatedData);
  };

  // Determine which columns to show based on screen size
  const getVisibleColumns = () => {
    const baseColumns = [
      "name",
      "email",
      "rollNo",
      "passoutYear",
      "branch",
      "cohorts", // Add cohorts column
      "profileStatus",
      "internshipStatus",
    ];

    if (isMobile) {
      return ["name", "profileStatus", "internshipStatus"];
    } else if (isTablet) {
      return [
        "name",
        "rollNo",
        "passoutYear",
        "cohorts", // Include cohorts in tablet view
        "profileStatus",
        "internshipStatus",
      ];
    }

    return baseColumns;
  };

  const visibleColumns = getVisibleColumns();

  // Column width configuration for better spacing
  const getColumnWidth = (column) => {
    switch (column) {
      case "name":
        return { width: "16%" };
      case "email":
        return { width: "20%" };
      case "rollNo":
        return { width: "8%" };
      case "passoutYear":
        return { width: "8%" };
      case "branch":
        return { width: "16%" };
      case "cohorts":
        return { width: "12%" };
      case "profileStatus":
        return { width: "10%" };
      case "internshipStatus":
        return { width: "10%" };
      case "actions":
        return { width: "50px" };
      default:
        return {};
    }
  };

  // Should we show checkboxes?
  const shouldShowCheckboxes =
    showCheckboxes && getInactiveProfileCount() > 0 && !isLeader;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Box sx={{ width: "100%", mt: 2 }}>
          <StyledTableContainer component={Paper}>
            <Table
              size="small"
              aria-label="student data table"
              sx={{ minWidth: isMobile ? "100%" : "700px" }}
            >
              <StyledTableHead>
                <TableRow>
                  {shouldShowCheckboxes && (
                    <StyledTableHeadCell padding="checkbox" width="48px">
                      <TableCheckbox
                        indeterminate={areSomeInactiveSelected()}
                        checked={areAllInactiveSelected()}
                        onChange={handleSelectAllClick}
                        disabled={isLeader}
                        inputProps={{
                          "aria-label": "select all inactive profiles",
                        }}
                      />
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("name") && (
                    <StyledTableHeadCell sx={getColumnWidth("name")}>
                      Name
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("email") && (
                    <StyledTableHeadCell sx={getColumnWidth("email")}>
                      Email
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("rollNo") && (
                    <StyledTableHeadCell sx={getColumnWidth("rollNo")}>
                      Roll No.
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("passoutYear") && (
                    <StyledTableHeadCell sx={getColumnWidth("passoutYear")}>
                      Year
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("branch") && (
                    <StyledTableHeadCell sx={getColumnWidth("branch")}>
                      Branch
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("cohorts") && (
                    <StyledTableHeadCell sx={getColumnWidth("cohorts")}>
                      Cohorts
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("profileStatus") && (
                    <StyledTableHeadCell sx={getColumnWidth("profileStatus")}>
                      Profile Status
                    </StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("internshipStatus") && (
                    <StyledTableHeadCell
                      sx={getColumnWidth("internshipStatus")}
                    >
                      Internship Status
                    </StyledTableHeadCell>
                  )}
                  {!isMobile && showActions && (
                    <StyledTableHeadCell
                      align="center"
                      sx={getColumnWidth("actions")}
                    >
                      Actions
                    </StyledTableHeadCell>
                  )}
                  {isMobile && (
                    <StyledTableHeadCell
                      align="center"
                      width="48px"
                    ></StyledTableHeadCell>
                  )}
                </TableRow>
              </StyledTableHead>

              <TableBody>
                {loading ? (
                  Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {shouldShowCheckboxes && (
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width={20}
                            height={20}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.includes("name") && (
                        <TableCell>
                          <Skeleton variant="text" width="90%" height={24} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("email") && (
                        <TableCell>
                          <Skeleton variant="text" width="90%" height={24} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("rollNo") && (
                        <TableCell>
                          <Skeleton variant="text" width="60%" height={24} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("passoutYear") && (
                        <TableCell>
                          <Skeleton variant="text" width="60%" height={24} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("branch") && (
                        <TableCell>
                          <Skeleton variant="text" width="80%" height={24} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("cohorts") && (
                        <TableCell>
                          <Skeleton variant="text" width="70%" height={24} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("profileStatus") && (
                        <TableCell>
                          <Skeleton variant="text" width="60%" height={24} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("internshipStatus") && (
                        <TableCell>
                          <Skeleton variant="text" width="60%" height={24} />
                        </TableCell>
                      )}
                      {!isMobile && showActions && (
                        <TableCell>
                          <Skeleton variant="circular" width={24} height={24} />
                        </TableCell>
                      )}
                      {isMobile && (
                        <TableCell>
                          <Skeleton variant="circular" width={24} height={24} />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        visibleColumns.length +
                        (isMobile ? 1 : 0) +
                        (!isMobile && showActions ? 1 : 0) +
                        (shouldShowCheckboxes ? 1 : 0)
                      }
                    >
                      <NoDataWrapper>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 0.5, opacity: 0.7 }}
                        >
                          No matching records
                        </Typography>
                        <Typography variant="caption">
                          Try adjusting your filters
                        </Typography>
                      </NoDataWrapper>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <React.Fragment key={row.id || index}>
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        component={StyledTableRow}
                      >
                        {shouldShowCheckboxes && (
                          <StyledTableCell padding="checkbox">
                            {row.profileStatus === "inactive" ? (
                              <TableCheckbox
                                checked={localSelectedIds.includes(row.id)}
                                onChange={(event) =>
                                  handleCheckboxChange(event, row.id)
                                }
                                disabled={isLeader}
                                inputProps={{
                                  "aria-labelledby": `select-${row.id}`,
                                }}
                              />
                            ) : (
                              <Box sx={{ width: 20 }} />
                            )}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("name") && (
                          <StyledTableCell
                            component="th"
                            scope="row"
                            sx={getColumnWidth("name")}
                          >
                            {row.name || "No Name"}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("email") && (
                          <StyledTableCell sx={getColumnWidth("email")}>
                            {row.email}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("rollNo") && (
                          <StyledTableCell sx={getColumnWidth("rollNo")}>
                            {row.rollNo || "N/A"}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("passoutYear") && (
                          <StyledTableCell sx={getColumnWidth("passoutYear")}>
                            {row.passoutYear}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("branch") && (
                          <StyledTableCell sx={getColumnWidth("branch")}>
                            {normalizeBranchName(row.branch)}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("cohorts") && (
                          <StyledTableCell sx={getColumnWidth("cohorts")}>
                            {row.profileStatus === "active" ? (
                              renderCohorts(row.cohorts)
                            ) : (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                -
                              </Typography>
                            )}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("profileStatus") && (
                          <StyledTableCell sx={getColumnWidth("profileStatus")}>
                            <Box
                              sx={{
                                display: "inline-block",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                backgroundColor:
                                  row.profileStatus === "active"
                                    ? theme.palette.success.light
                                    : theme.palette.action.disabledBackground,
                                color:
                                  row.profileStatus === "active"
                                    ? theme.palette.success.dark
                                    : theme.palette.text.secondary,
                              }}
                            >
                              {row.profileStatus === "active"
                                ? "Active"
                                : "Inactive"}
                            </Box>
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("internshipStatus") && (
                          <StyledTableCell
                            sx={getColumnWidth("internshipStatus")}
                          >
                            <Box
                              sx={{
                                display: "inline-block",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                backgroundColor:
                                  row.internshipStatus === "applied"
                                    ? theme.palette.primary.light
                                    : theme.palette.warning.light,
                                color:
                                  row.internshipStatus === "applied"
                                    ? theme.palette.primary.dark
                                    : theme.palette.warning.dark,
                              }}
                            >
                              {row.internshipStatus === "applied"
                                ? "Applied"
                                : "Not Applied"}
                            </Box>
                          </StyledTableCell>
                        )}

                        {/* Actions column with edit options (non-mobile) */}
                        {!isMobile && showActions && (
                          <StyledTableCell align="center" padding="none">
                            <IconButton
                              size="small"
                              onClick={(event) => handleActionClick(event, row)}
                              sx={{ padding: 0.5 }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </StyledTableCell>
                        )}

                        {/* Mobile expand icon */}
                        {isMobile && (
                          <StyledTableCell align="center" padding="none">
                            <IconButton
                              size="small"
                              onClick={() => handleExpandRow(row.id)}
                              sx={{ padding: 0.5 }}
                            >
                              {expandedRow === row.id ? (
                                <ExpandLessIcon fontSize="small" />
                              ) : (
                                <ExpandMoreIcon fontSize="small" />
                              )}
                            </IconButton>
                          </StyledTableCell>
                        )}
                      </motion.tr>

                      {/* Expandable row details for mobile view */}
                      {isMobile && expandedRow === row.id && (
                        <TableRow>
                          <TableCell
                            colSpan={
                              visibleColumns.length +
                              1 +
                              (shouldShowCheckboxes ? 1 : 0)
                            }
                            padding="none"
                          >
                            <MobileExpandableRow>
                              {!visibleColumns.includes("email") && (
                                <DetailItem>
                                  <span className="label">Email:</span>
                                  <span className="value">{row.email}</span>
                                </DetailItem>
                              )}

                              {!visibleColumns.includes("rollNo") && (
                                <DetailItem>
                                  <span className="label">Roll No.:</span>
                                  <span className="value">
                                    {row.rollNo || "N/A"}
                                  </span>
                                </DetailItem>
                              )}

                              {!visibleColumns.includes("passoutYear") && (
                                <DetailItem>
                                  <span className="label">Year:</span>
                                  <span className="value">
                                    {row.passoutYear}
                                  </span>
                                </DetailItem>
                              )}

                              {!visibleColumns.includes("branch") && (
                                <DetailItem>
                                  <span className="label">Branch:</span>
                                  <span className="value">
                                    {normalizeBranchName(row.branch)}
                                  </span>
                                </DetailItem>
                              )}

                              {!visibleColumns.includes("cohorts") && (
                                <DetailItem>
                                  <span className="label">Cohorts:</span>
                                  <span className="value">
                                    {row.profileStatus === "active" ? (
                                      renderCohorts(row.cohorts)
                                    ) : (
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        -
                                      </Typography>
                                    )}
                                  </span>
                                </DetailItem>
                              )}

                              {!visibleColumns.includes("profileStatus") && (
                                <DetailItem>
                                  <span className="label">Profile Status:</span>
                                  <span className="value">
                                    <Box
                                      sx={{
                                        display: "inline-block",
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: "4px",
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        backgroundColor:
                                          row.profileStatus === "active"
                                            ? theme.palette.success.light
                                            : theme.palette.action
                                                .disabledBackground,
                                        color:
                                          row.profileStatus === "active"
                                            ? theme.palette.success.dark
                                            : theme.palette.text.secondary,
                                      }}
                                    >
                                      {row.profileStatus === "active"
                                        ? "Active"
                                        : "Inactive"}
                                    </Box>
                                  </span>
                                </DetailItem>
                              )}

                              {!visibleColumns.includes("internshipStatus") && (
                                <DetailItem>
                                  <span className="label">
                                    Internship Status:
                                  </span>
                                  <span className="value">
                                    <Box
                                      sx={{
                                        display: "inline-block",
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: "4px",
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        backgroundColor:
                                          row.internshipStatus === "applied"
                                            ? theme.palette.primary.light
                                            : theme.palette.warning.light,
                                        color:
                                          row.internshipStatus === "applied"
                                            ? theme.palette.primary.dark
                                            : theme.palette.warning.dark,
                                      }}
                                    >
                                      {row.internshipStatus === "applied"
                                        ? "Applied"
                                        : "Not Applied"}
                                    </Box>
                                  </span>
                                </DetailItem>
                              )}

                              {/* Add edit actions to mobile expandable row */}
                              {showActions && (
                                <Box
                                  sx={{
                                    mt: 1,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={(event) =>
                                      handleActionClick(event, row)
                                    }
                                    sx={{ padding: 0.5 }}
                                  >
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </MobileExpandableRow>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>

            {!loading && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
                      fontSize: "0.75rem",
                    },
                  ".MuiTablePagination-select": {
                    fontSize: "0.75rem",
                  },
                }}
              />
            )}
          </StyledTableContainer>

          {/* Action Menu - Simplified to single Edit option */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleActionClose}
            onClick={handleActionClose}
            PaperProps={{
              elevation: 1,
              sx: {
                minWidth: 160,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                mt: 0.5,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Single Edit option */}
            <MenuItem
              onClick={handleEditAction}
              disabled={!selectedStudent}
              sx={{ py: 1 }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          </Menu>

          {/* Edit Modal */}
          {selectedStudent && editModalOpen && (
            <EditModal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              studentId={selectedStudent.id}
              studentData={selectedStudent}
              filterOptions={filterOptions}
              onSuccess={handleEditSuccess}
            />
          )}
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsTable;
