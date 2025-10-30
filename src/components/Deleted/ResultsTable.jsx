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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { BASE_URL } from "../../services/configUrls";

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

// Function to normalize branch names for display
const normalizeBranchName = (branch) => {
  if (!branch) return "N/A";

  // Format abbreviations consistently
  let normalized = String(branch)
    .replace(/&\s*/, "& ") // Ensure space after &
    .replace(/^AI\s*&\s*DS$/, "AI & DS") // Format AI & DS consistently
    .replace(
      /Computer Science and Engineering \(Data Science/,
      "CSE (Data Science)"
    ) // Shorten lengthy names
    .replace(/Computer Science Engineering/, "CSE") // Use acronym
    .replace(/Computer Science and Engineering/, "CSE") // Use acronym
    .replace(/Electronica & Communication Engineering/, "ECE") // Use acronym
    .replace(/ELECTRONICS and COMPUTER SCIENCE \(ECS\)/, "ECS") // Use acronym
    .replace(/Electrical & Electronics Engineering/, "EEE"); // Use acronym

  return normalized;
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
  showCheckboxes = false, // New prop to control checkbox visibility
  filterOptions = {},
  userRole = "", // New prop to get user role
  onDataRefresh, // Add callback for refreshing data after restore
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Check if user is a leader (disable actions for leaders)
  const isLeader = userRole === "leaders";

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

  // Handle checkbox selection - Only allow if not a leader
  const handleSelectRow = (intakeId) => {
    if (isLeader) return; // Prevent selection for leaders

    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(intakeId)) {
        return prevSelected.filter((id) => id !== intakeId);
      } else {
        return [...prevSelected, intakeId];
      }
    });
  };

  // Handle select all - Only allow if not a leader
  const handleSelectAll = (event) => {
    if (isLeader) return; // Prevent selection for leaders

    if (event.target.checked) {
      const allIntakeIds = data.map((row) => row.intake_id).filter((id) => id);
      setSelectedRows(allIntakeIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Check if all rows are selected
  const isAllSelected =
    data.length > 0 &&
    selectedRows.length === data.filter((row) => row.intake_id).length;
  const isIndeterminate =
    selectedRows.length > 0 &&
    selectedRows.length < data.filter((row) => row.intake_id).length;

  // Handle restore action - Only allow if not a leader
  const handleRestoreClick = () => {
    if (isLeader) return; // Prevent restore for leaders

    if (selectedRows.length === 0) {
      setAlertMessage("Please select at least one student to restore.");
      setAlertSeverity("warning");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // Confirm restore - Only allow if not a leader
  const handleConfirmRestore = async () => {
    if (isLeader) return; // Prevent restore for leaders

    setRestoring(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setAlertMessage("Authentication token not found. Please login again.");
        setAlertSeverity("error");
        return;
      }

      const response = await api.post(
        `${BASE_URL}/profile/restore-students`,
        {
          intake_ids: selectedRows,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setAlertMessage(
        `Successfully restored ${selectedRows.length} student(s).`
      );
      setAlertSeverity("success");
      setSelectedRows([]);
      setConfirmDialogOpen(false);

      // Refresh data if callback provided
      if (onDataRefresh) {
        onDataRefresh();
      }
    } catch (error) {
      console.error("Error restoring students:", error);
      setAlertMessage("Failed to restore students. Please try again.");
      setAlertSeverity("error");
    } finally {
      setRestoring(false);
      setConfirmDialogOpen(false);
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  // Determine which columns to show based on screen size
  const getVisibleColumns = () => {
    const baseColumns = ["name", "email", "passoutYear", "branch"];

    // Only include checkbox if showCheckboxes is true and user is not a leader
    if (showCheckboxes && !isLeader) {
      baseColumns.unshift("checkbox");
    }

    if (isMobile) {
      return showCheckboxes && !isLeader
        ? ["checkbox", "name", "email"]
        : ["name", "email"]; // Most minimal view
    } else if (isTablet) {
      return showCheckboxes && !isLeader
        ? ["checkbox", "name", "email", "passoutYear"]
        : ["name", "email", "passoutYear"]; // Medium view
    }

    return baseColumns; // Full view
  };

  const visibleColumns = getVisibleColumns();

  // Column width configuration for better spacing
  const getColumnWidth = (column) => {
    switch (column) {
      case "checkbox":
        return { width: "60px" };
      case "name":
        return { width: "25%" };
      case "email":
        return { width: "35%" };
      case "passoutYear":
        return { width: "15%" };
      case "branch":
        return { width: "25%" };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Box sx={{ width: "100%", mt: 2 }}>
          {/* Restore button - Hidden for leaders */}
          {!isLeader && selectedRows.length > 0 && (
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RestoreIcon />}
                onClick={handleRestoreClick}
                disabled={restoring}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {restoring
                  ? "Restoring..."
                  : `Restore ${selectedRows.length} Student(s)`}
              </Button>
            </Box>
          )}

          <StyledTableContainer component={Paper}>
            <Table
              size="small"
              aria-label="student data table"
              sx={{ minWidth: isMobile ? "100%" : "650px" }}
            >
              <StyledTableHead>
                <TableRow>
                  {visibleColumns.includes("checkbox") && (
                    <StyledTableHeadCell sx={getColumnWidth("checkbox")}>
                      <Checkbox
                        indeterminate={isIndeterminate}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        disabled={data.length === 0 || isLeader} // Disable for leaders
                        size="small"
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
                  {/* Mobile expand column */}
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
                  // When loading, show skeleton rows
                  Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {visibleColumns.includes("checkbox") && (
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width={24}
                            height={24}
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
                      {isMobile && (
                        <TableCell>
                          <Skeleton variant="circular" width={24} height={24} />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  // Only show "No matching records" when not loading and data is empty
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length + (isMobile ? 1 : 0)}
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
                  // Display actual data rows when available
                  data.map((row, index) => (
                    <React.Fragment key={row.id || index}>
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        component={StyledTableRow}
                      >
                        {visibleColumns.includes("checkbox") && (
                          <StyledTableCell sx={getColumnWidth("checkbox")}>
                            <Checkbox
                              checked={selectedRows.includes(row.intake_id)}
                              onChange={() => handleSelectRow(row.intake_id)}
                              disabled={!row.intake_id || isLeader} // Disable for leaders
                              size="small"
                            />
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
                        {visibleColumns.includes("passoutYear") && (
                          <StyledTableCell sx={getColumnWidth("passoutYear")}>
                            {row.passoutYear || "N/A"}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("branch") && (
                          <StyledTableCell sx={getColumnWidth("branch")}>
                            {normalizeBranchName(row.branch)}
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
                            colSpan={visibleColumns.length + 1}
                            padding="none"
                          >
                            <MobileExpandableRow>
                              {!visibleColumns.includes("passoutYear") && (
                                <DetailItem>
                                  <span className="label">Year:</span>
                                  <span className="value">
                                    {row.passoutYear || "N/A"}
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

          {/* Confirmation Dialog - Hidden for leaders */}
          {!isLeader && (
            <Dialog
              open={confirmDialogOpen}
              onClose={() => setConfirmDialogOpen(false)}
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-description"
            >
              <DialogTitle id="confirm-dialog-title">
                Confirm Student Restoration
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Are you sure you want to restore {selectedRows.length}{" "}
                  student(s)? This action will move them back to the active
                  students list.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setConfirmDialogOpen(false)}
                  disabled={restoring}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRestore}
                  variant="contained"
                  color="primary"
                  disabled={restoring}
                  startIcon={
                    restoring ? <CircularProgress size={16} /> : <RestoreIcon />
                  }
                >
                  {restoring ? "Restoring..." : "Restore"}
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {/* Alert Snackbar */}
          <Snackbar
            open={!!alertMessage}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseAlert}
              severity={alertSeverity}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsTable;
