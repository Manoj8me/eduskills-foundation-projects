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
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  CircularProgress,
  useMediaQuery,
  Skeleton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SwapHoriz as SwapIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
  School as SchoolIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import DomainChangeModal from "./DomainChangeModal";
import BranchChangeModal from "./BranchChangeModal";
import RollNoChangeModal from "./RollNoChangeModal";
import PassoutYearChangeModal from "./PassoutYearChangeModal";
import ApprovalConfirmationModal from "./ApprovalConfirmationModal";
import RejectionConfirmationModal from "./RejectionConfirmationModal";
import BulkApprovalConfirmationModal from "./BulkApprovalConfirmationModal";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginTop: theme.spacing(2),
  overflow: "auto", // Changed from 'hidden' to 'auto' to enable scrolling
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
  fontSize: "0.75rem",
  whiteSpace: "nowrap", // Keep this to prevent wrapping of header text
  "&:first-of-type": {
    paddingLeft: theme.spacing(2),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: "0.75rem",
  whiteSpace: "nowrap", // Keep this to prevent wrapping of cell content
  "&:first-of-type": {
    paddingLeft: theme.spacing(2),
  },
}));

// Modified to not truncate text - removed maxWidth, overflow and textOverflow properties
const NonTruncatedTableCell = styled(StyledTableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
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
  height: "48px", // Reduce the height of each row
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
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
  padding: theme.spacing(1),
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

const TableControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: theme.spacing(1),
  },
}));

const SearchFieldContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: "300px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const ApproveAllButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontSize: "0.75rem",
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
  background: "linear-gradient(45deg, #43a047 30%, #66bb6a 90%)",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
    background: "linear-gradient(45deg, #388e3c 30%, #56a85a 90%)",
  },
  height: "36px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const getStatusChipColor = (status) => {
  switch (status) {
    case "Applied":
      return "primary";
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    case "Pending":
      return "warning";
    default:
      return "default";
  }
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
  onSearchTermChange,
  searchTerm = "",
  filterOptions = { domains: [], branches: [] },
  onDataRefresh,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedRow, setExpandedRow] = useState(null);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modal states
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [rollNoModalOpen, setRollNoModalOpen] = useState(false);
  const [passoutYearModalOpen, setPassoutYearModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bulkApproveModalOpen, setBulkApproveModalOpen] = useState(false);

  // Function to handle bulk approve button click
  const handleBulkApproveClick = () => {
    setBulkApproveModalOpen(true);
  };

  // Function to close bulk approve modal
  const handleCloseBulkApproveModal = () => {
    setBulkApproveModalOpen(false);
  };

  // Get all internship IDs for bulk approval
  const getInternshipIds = () => {
    return data
      .filter(
        (student) => student.internship_id && student.status !== "Approved"
      )
      .map((student) => student.internship_id);
  };

  // Function to refresh data after changes
  const handleDataRefresh = () => {
    if (onDataRefresh) {
      onDataRefresh();
    } else if (onPageChange) {
      // Just trigger a page refresh by setting to the same page
      onPageChange(page);
    }
  };

  // Handle menu open
  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle domain change action
  const handleDomainChange = () => {
    handleMenuClose();
    setDomainModalOpen(true);
  };

  // Handle branch change action
  const handleBranchChange = () => {
    handleMenuClose();
    setBranchModalOpen(true);
  };

  // Handle roll number change action
  const handleRollNoChange = () => {
    handleMenuClose();
    setRollNoModalOpen(true);
  };

  // Handle passout year change action
  const handlePassoutYearChange = () => {
    handleMenuClose();
    setPassoutYearModalOpen(true);
  };

  // Handle approval action
  const handleApprove = () => {
    handleMenuClose();
    setApproveModalOpen(true);
  };

  // Handle rejection action
  const handleReject = () => {
    handleMenuClose();
    setRejectModalOpen(true);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setExpandedRow(null); // Close expanded row when changing page
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setExpandedRow(null); // Close expanded row when changing rows per page
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  // Toggle expanded row
  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    if (onSearchTermChange) {
      onSearchTermChange(e.target.value);
    }
  };

  // Determine which columns to show based on screen size
  const getVisibleColumns = () => {
    if (isMobile) {
      return ["name", "rollNo", "actions"]; // Most minimal view with rollNo and actions
    } else if (isTablet) {
      return ["name", "rollNo", "passoutYear", "domain", "actions"]; // Medium view with rollNo, domain and actions
    }
    return [
      "name",
      "email",
      "rollNo",
      "passoutYear",
      "cohort",
      "branch",
      "domain",
      "actions",
    ]; // Full view with all columns
  };

  const visibleColumns = getVisibleColumns();

  // Calculate how many students can be approved
  const approvableStudentsCount = data.filter(
    (student) => student.status !== "Approved" && student.internship_id
  ).length;

  // Check if bulk approve button should be disabled
  const isBulkApproveDisabled = approvableStudentsCount === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Box sx={{ width: "100%", mt: 2 }}>
          {/* <TableControlsContainer>
            <Tooltip
              title={
                isBulkApproveDisabled
                  ? "No students available to approve"
                  : "Approve all filtered students"
              }
              placement="left"
            >
              <Box>
                <ApproveAllButton
                  variant="contained"
                  color="success"
                  startIcon={<DoneAllIcon />}
                  onClick={handleBulkApproveClick}
                  disabled={isBulkApproveDisabled || loading}
                  size="small"
                  sx={{
                    color: "white",
                  }}
                >
                  Approve All
                </ApproveAllButton>
              </Box>
            </Tooltip>
          </TableControlsContainer> */}

          <StyledTableContainer component={Paper}>
            <Table
              size="small"
              aria-label="student data table"
              sx={{ minWidth: 650 }}
            >
              <StyledTableHead>
                <TableRow>
                  {visibleColumns.includes("name") && (
                    <StyledTableHeadCell>Name</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("email") && (
                    <StyledTableHeadCell>Email</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("rollNo") && (
                    <StyledTableHeadCell>Roll No</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("passoutYear") && (
                    <StyledTableHeadCell>Year</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("cohort") && (
                    <StyledTableHeadCell>Cohort</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("branch") && (
                    <StyledTableHeadCell>Branch</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("domain") && (
                    <StyledTableHeadCell>Domain</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("actions") && (
                    <StyledTableHeadCell align="center" width="60px">
                      Actions
                    </StyledTableHeadCell>
                  )}
                  {isMobile && !visibleColumns.includes("actions") && (
                    <StyledTableHeadCell
                      align="center"
                      width="48px"
                    ></StyledTableHeadCell>
                  )}
                </TableRow>
              </StyledTableHead>

              <TableBody>
                {loading ? (
                  // Loading skeleton rows
                  Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {visibleColumns.includes("name") && (
                        <TableCell>
                          <Skeleton variant="text" width="70%" height={20} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("email") && (
                        <TableCell>
                          <Skeleton variant="text" width="90%" height={20} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("rollNo") && (
                        <TableCell>
                          <Skeleton variant="text" width="50%" height={20} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("passoutYear") && (
                        <TableCell>
                          <Skeleton variant="text" width="40%" height={20} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("cohort") && (
                        <TableCell>
                          <Skeleton variant="text" width="60%" height={20} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("branch") && (
                        <TableCell>
                          <Skeleton variant="text" width="50%" height={20} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("domain") && (
                        <TableCell>
                          <Skeleton variant="text" width="70%" height={20} />
                        </TableCell>
                      )}
                      {visibleColumns.includes("actions") && (
                        <TableCell>
                          <Skeleton variant="circular" width={24} height={24} />
                        </TableCell>
                      )}
                      {isMobile && !visibleColumns.includes("actions") && (
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
                        (isMobile && !visibleColumns.includes("actions")
                          ? 1
                          : 0)
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
                    <React.Fragment key={row.id}>
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        component={StyledTableRow}
                      >
                        {visibleColumns.includes("name") && (
                          <NonTruncatedTableCell component="th" scope="row">
                            {row.name}
                          </NonTruncatedTableCell>
                        )}
                        {visibleColumns.includes("email") && (
                          <NonTruncatedTableCell>
                            {row.email}
                          </NonTruncatedTableCell>
                        )}
                        {visibleColumns.includes("rollNo") && (
                          <StyledTableCell>{row.rollNo}</StyledTableCell>
                        )}
                        {visibleColumns.includes("passoutYear") && (
                          <StyledTableCell>{row.passoutYear}</StyledTableCell>
                        )}
                        {visibleColumns.includes("cohort") && (
                          <StyledTableCell>{row.cohort}</StyledTableCell>
                        )}
                        {visibleColumns.includes("branch") && (
                          <NonTruncatedTableCell>
                            {row.branch}
                          </NonTruncatedTableCell>
                        )}
                        {visibleColumns.includes("domain") && (
                          <NonTruncatedTableCell>
                            {row.domain}
                          </NonTruncatedTableCell>
                        )}
                        {visibleColumns.includes("actions") && (
                          <StyledTableCell align="center" padding="none">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, row)}
                              sx={{ padding: 0.5 }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </StyledTableCell>
                        )}
                        {isMobile && !visibleColumns.includes("actions") && (
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
                      {isMobile &&
                        !visibleColumns.includes("actions") &&
                        expandedRow === row.id && (
                          <TableRow>
                            <TableCell
                              colSpan={visibleColumns.length + 1}
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
                                    <span className="label">Roll No:</span>
                                    <span className="value">{row.rollNo}</span>
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
                                {!visibleColumns.includes("cohort") && (
                                  <DetailItem>
                                    <span className="label">Cohort:</span>
                                    <span className="value">{row.cohort}</span>
                                  </DetailItem>
                                )}
                                {!visibleColumns.includes("branch") && (
                                  <DetailItem>
                                    <span className="label">Branch:</span>
                                    <span className="value">{row.branch}</span>
                                  </DetailItem>
                                )}
                                {!visibleColumns.includes("domain") && (
                                  <DetailItem>
                                    <span className="label">Domain:</span>
                                    <span className="value">{row.domain}</span>
                                  </DetailItem>
                                )}
                                {!visibleColumns.includes("status") && (
                                  <DetailItem>
                                    <span className="label">Status:</span>
                                    <span className="value">
                                      <Chip
                                        label={row.status}
                                        size="small"
                                        color={getStatusChipColor(row.status)}
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.7rem",
                                          height: "20px",
                                        }}
                                      />
                                    </span>
                                  </DetailItem>
                                )}
                                {/* Add action button for mobile expanded view */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    mt: 1,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, row)}
                                  >
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </MobileExpandableRow>
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>

            {!loading && data.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
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
        </Box>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              minWidth: "180px",
              mt: 0.5,
              overflow: "hidden",
            },
          }}
          MenuListProps={{
            sx: {
              py: 0.5,
            },
          }}
        >
          {/* <MenuItem
            onClick={handleDomainChange}
            sx={{
              fontSize: "0.85rem",
              py: 1.2,
              px: 2,
              "&:hover": {
                background: "rgba(0, 136, 204, 0.08)",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <SwapIcon fontSize="small" color="primary" />
            Change Domain
          </MenuItem> */}
          <MenuItem
            onClick={handleBranchChange}
            sx={{
              fontSize: "0.85rem",
              py: 1.2,
              px: 2,
              "&:hover": {
                background: "rgba(0, 136, 204, 0.08)",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <SchoolIcon fontSize="small" color="primary" />
            Change Branch
          </MenuItem>
          <MenuItem
            onClick={handleRollNoChange}
            sx={{
              fontSize: "0.85rem",
              py: 1.2,
              px: 2,
              "&:hover": {
                background: "rgba(0, 136, 204, 0.08)",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <EditIcon fontSize="small" color="primary" />
            Change Roll No
          </MenuItem>
          <MenuItem
            onClick={handlePassoutYearChange}
            sx={{
              fontSize: "0.85rem",
              py: 1.2,
              px: 2,
              "&:hover": {
                background: "rgba(0, 136, 204, 0.08)",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CalendarIcon fontSize="small" color="primary" />
            Change Passout Year
          </MenuItem>

          <Box
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.08)",
              my: 0.5,
            }}
          />

          {/* <MenuItem
            onClick={handleApprove}
            sx={{
              fontSize: "0.85rem",
              py: 1.2,
              px: 2,
              "&:hover": {
                background: "rgba(76, 175, 80, 0.08)",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ApproveIcon fontSize="small" color="success" />
            Approve Student
          </MenuItem> */}

          {/* <MenuItem
            onClick={handleReject}
            sx={{
              fontSize: "0.85rem",
              py: 1.2,
              px: 2,
              "&:hover": {
                background: "rgba(244, 67, 54, 0.08)",
              },
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <RejectIcon fontSize="small" color="error" />
            Reject Student
          </MenuItem> */}
        </Menu>

        {/* Domain Change Modal */}
        {selectedStudent && (
          <DomainChangeModal
            open={domainModalOpen}
            onClose={() => setDomainModalOpen(false)}
            student={selectedStudent}
            domains={filterOptions.domains || []}
            onDataRefresh={onDataRefresh || handleDataRefresh}
          />
        )}

        {/* Branch Change Modal */}
        {selectedStudent && (
          <BranchChangeModal
            open={branchModalOpen}
            onClose={() => setBranchModalOpen(false)}
            student={selectedStudent}
            branches={filterOptions.branches || []}
            onDataRefresh={onDataRefresh || handleDataRefresh}
          />
        )}

        {/* Roll No Change Modal */}
        {selectedStudent && (
          <RollNoChangeModal
            open={rollNoModalOpen}
            onClose={() => setRollNoModalOpen(false)}
            student={selectedStudent}
            onDataRefresh={onDataRefresh || handleDataRefresh}
          />
        )}

        {/* Passout Year Change Modal */}
        {selectedStudent && (
          <PassoutYearChangeModal
            open={passoutYearModalOpen}
            onClose={() => setPassoutYearModalOpen(false)}
            student={selectedStudent}
            onDataRefresh={onDataRefresh || handleDataRefresh}
          />
        )}

        {/* Approval Confirmation Modal */}
        {selectedStudent && (
          <ApprovalConfirmationModal
            open={approveModalOpen}
            onClose={() => setApproveModalOpen(false)}
            student={selectedStudent}
            onDataRefresh={onDataRefresh || handleDataRefresh}
          />
        )}

        {/* Rejection Confirmation Modal */}
        {selectedStudent && (
          <RejectionConfirmationModal
            open={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            student={selectedStudent}
            onDataRefresh={onDataRefresh || handleDataRefresh}
          />
        )}

        {/* Bulk Approval Modal */}
        <BulkApprovalConfirmationModal
          open={bulkApproveModalOpen}
          onClose={handleCloseBulkApproveModal}
          studentsCount={approvableStudentsCount}
          internshipIds={getInternshipIds()}
          onDataRefresh={onDataRefresh || handleDataRefresh}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsTable;
