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
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  CircularProgress,
  useMediaQuery,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BlockOutlined as BlockIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import FailStudentModal from "./FailStudentModal";
import CustomPagination from "../PendingApproval/CustomPagination";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginTop: theme.spacing(2),
  overflow: "auto",
  maxHeight: "calc(100vh - 250px)",
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
  position: "sticky",
  top: 0,
  zIndex: 9,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
  fontSize: "0.75rem",
  whiteSpace: "nowrap",
  "&:first-of-type": {
    paddingLeft: theme.spacing(2),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: "0.75rem",
  whiteSpace: "nowrap",
  "&:first-of-type": {
    paddingLeft: theme.spacing(2),
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
  height: "48px",
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

const StaffResultsTable = ({
  searchParams,
  data = [],
  loading = false,
  totalCount = 0,
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
  onSendOtp,
  onVerifyOtp,
  onDataRefresh,
  searchTerm,
  onSearchTermChange,
  filterOptions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedRow, setExpandedRow] = useState(null);

  // Action menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fail student modal state
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [failingStudent, setFailingStudent] = useState(null);

  // Open action menu
  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  // Close action menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Open fail student modal
  const handleFailClick = () => {
    if (!selectedStudent) {
      console.error("No student selected for failing");
      return;
    }

    setFailingStudent(selectedStudent);
    setFailModalOpen(true);
    handleMenuClose();
  };

  // Close fail student modal
  const handleFailModalClose = () => {
    setFailModalOpen(false);
    setFailingStudent(null);
  };

  // Handle send OTP request
  const handleSendOtp = async (email, user_id) => {
    if (!email || !user_id) {
      return Promise.reject(new Error("Email or user ID missing"));
    }

    try {
      if (onSendOtp) {
        return await onSendOtp(email, user_id);
      }
      return Promise.reject(new Error("OTP sending function not provided"));
    } catch (error) {
      console.error("Error sending OTP:", error);
      return Promise.reject(error);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async (email, otp, user_id) => {
    if (!email || !otp || !user_id) {
      return Promise.reject(new Error("Email, OTP, or user ID missing"));
    }

    try {
      if (onVerifyOtp) {
        return await onVerifyOtp(email, otp, user_id);
      }
      return Promise.reject(
        new Error("OTP verification function not provided")
      );
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return Promise.reject(error);
    }
  };

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

  // Determine which columns to show based on screen size
  const getVisibleColumns = () => {
    if (isMobile) {
      // Removed 'actions' from mobile columns
      return ["name", "rollNo"];
    } else if (isTablet) {
      // Removed 'actions' from tablet columns
      return ["name", "rollNo", "domain", "passoutYear"];
    }
    return [
      "name",
      "email",
      "rollNo",
      "passoutYear",
      "cohort",
      "branch",
      "domain",
      // "actions", // Commented out actions column
    ];
  };

  const visibleColumns = getVisibleColumns();

  // Full column list for horizontal scrolling - removed actions
  const allColumns = [
    "name",
    "email",
    "rollNo",
    "passoutYear",
    "cohort",
    "branch",
    "domain",
    // "actions", // Commented out actions column
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ width: "100%" }}
      >
        <TableWrapper sx={{ width: "100%", mt: 2 }}>
          <SearchWrapper>{/* Table header content if needed */}</SearchWrapper>

          <StyledTableContainer component={Paper}>
            <Table size="small" aria-label="student data table" stickyHeader>
              <StyledTableHead>
                <TableRow>
                  {allColumns.map((column) => {
                    if (column === "name") {
                      return (
                        <StyledTableHeadCell key={column}>
                          Name
                        </StyledTableHeadCell>
                      );
                    } else if (column === "email") {
                      return (
                        <StyledTableHeadCell key={column}>
                          Email
                        </StyledTableHeadCell>
                      );
                    } else if (column === "rollNo") {
                      return (
                        <StyledTableHeadCell key={column}>
                          Roll No
                        </StyledTableHeadCell>
                      );
                    } else if (column === "passoutYear") {
                      return (
                        <StyledTableHeadCell key={column}>
                          Year
                        </StyledTableHeadCell>
                      );
                    } else if (column === "cohort") {
                      return (
                        <StyledTableHeadCell key={column}>
                          Cohort
                        </StyledTableHeadCell>
                      );
                    } else if (column === "branch") {
                      return (
                        <StyledTableHeadCell key={column}>
                          Branch
                        </StyledTableHeadCell>
                      );
                    } else if (column === "domain") {
                      return (
                        <StyledTableHeadCell key={column}>
                          Domain
                        </StyledTableHeadCell>
                      );
                    }
                    /* Commented out actions column 
                    else if (column === "actions") {
                      return (
                        <StyledTableHeadCell key={column} align="center">
                          Actions
                        </StyledTableHeadCell>
                      );
                    }
                    */
                    return null;
                  })}
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
                  Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {allColumns.map((column) => (
                        <StyledTableCell key={`${column}-skeleton`}>
                          <Skeleton
                            variant="text"
                            width={
                              column === "email"
                                ? "90%"
                                : column === "name"
                                ? "70%"
                                : "50%"
                            }
                            height={20}
                          />
                        </StyledTableCell>
                      ))}
                      {isMobile && !visibleColumns.includes("actions") && (
                        <StyledTableCell align="center" padding="none">
                          <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{ margin: "0 auto" }}
                          />
                        </StyledTableCell>
                      )}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        allColumns.length +
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
                        <StyledTableCell component="th" scope="row">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell>{row.email}</StyledTableCell>
                        <StyledTableCell>{row.rollNo}</StyledTableCell>
                        <StyledTableCell>{row.passoutYear}</StyledTableCell>
                        <StyledTableCell>{row.cohort}</StyledTableCell>
                        <StyledTableCell>{row.branch}</StyledTableCell>
                        <StyledTableCell>{row.domain}</StyledTableCell>
                        {/* Commented out actions column
                        <StyledTableCell align="center" padding="none">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, row)}
                            sx={{
                              padding: 0.5,
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            <MoreVertIcon
                              fontSize="small"
                              sx={{ fontSize: "1rem" }}
                            />
                          </IconButton>
                        </StyledTableCell>
                        */}
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
                      {isMobile && expandedRow === row.id && (
                        <TableRow>
                          <TableCell
                            colSpan={
                              allColumns.length +
                              (isMobile && !visibleColumns.includes("actions")
                                ? 1
                                : 0)
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
                                  <span className="label">Roll No:</span>
                                  <span className="value">{row.rollNo}</span>
                                </DetailItem>
                              )}
                              {!visibleColumns.includes("domain") && (
                                <DetailItem>
                                  <span className="label">Domain:</span>
                                  <span className="value">{row.domain}</span>
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
                            </MobileExpandableRow>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Replace TablePagination with CustomPagination */}
            {!loading && data.length > 0 && (
              <CustomPagination
                count={totalCount}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </StyledTableContainer>

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
              elevation: 3,
              sx: {
                minWidth: 100,
                borderRadius: 1,
                mt: 0.5,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem
              onClick={handleFailClick}
              sx={{
                color: "error.main",
                py: 0.5,
                minHeight: "32px",
              }}
              dense
            >
              <ListItemIcon sx={{ minWidth: "28px" }}>
                <BlockIcon
                  fontSize="small"
                  color="error"
                  sx={{ fontSize: "1rem" }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Mark as Failed"
                primaryTypographyProps={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              />
            </MenuItem>
          </Menu>

          {/* Fail Student Modal */}
          <FailStudentModal
            open={failModalOpen}
            onClose={handleFailModalClose}
            student={failingStudent}
            onSendOtp={handleSendOtp}
            verifyOtp={handleVerifyOtp}
            onDataRefresh={onDataRefresh}
          />
        </TableWrapper>
      </motion.div>
    </AnimatePresence>
  );
};

export default StaffResultsTable;
