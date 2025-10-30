import React, { useState } from "react";
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
  Chip,
  useTheme,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import ExportCSV from "./ExportCSV";

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
  justifyContent: "flex-end",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: theme.spacing(1),
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

  // Determine which columns to show based on screen size
  const getVisibleColumns = () => {
    if (isMobile) {
      return ["name", "rollNo"]; // Most minimal view with name and rollNo
    } else if (isTablet) {
      return ["name", "rollNo", "passoutYear", "domain"]; // Medium view
    }
    return [
      "name",
      "email",
      "rollNo",
      "passoutYear",
      "cohort",
      "branch",
      "domain",
    ]; // Full view with all columns (status removed)
  };

  const visibleColumns = getVisibleColumns();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Box sx={{ width: "100%", mt: 2 }}>
          <TableControlsContainer>
            <ExportCSV searchParams={searchParams} />
          </TableControlsContainer>

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
                      {visibleColumns.includes("status") && (
                        <TableCell>
                          <Skeleton variant="text" width="40%" height={20} />
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
                        {/* Status column removed */}
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
                              {!visibleColumns.includes("email") && (
                                <DetailItem>
                                  <span className="label">Email:</span>
                                  <span className="value">{row.email}</span>
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
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsTable;
