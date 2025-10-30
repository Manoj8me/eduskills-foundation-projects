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
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

// Styled components with horizontal scroll support
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginTop: theme.spacing(2),
  overflowX: "auto", // Enable horizontal scrolling
  maxWidth: "100%",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

// Force no wrapping for header cells but don't truncate
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
  fontSize: "0.75rem",
  whiteSpace: "nowrap", // Prevent text wrapping
  // Remove overflow: hidden and textOverflow: ellipsis to prevent truncation
  "&:first-of-type": {
    paddingLeft: theme.spacing(2),
  },
}));

// Force no wrapping for all table cells but don't truncate
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: "0.75rem",
  whiteSpace: "nowrap", // Prevent text wrapping
  // Remove overflow: hidden and textOverflow: ellipsis to prevent truncation
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
    whiteSpace: "nowrap", // Ensure no wrapping in expandable details
    // Remove overflow: hidden and textOverflow: ellipsis to prevent truncation
  },
}));



const ResultsTable = ({
  searchParams,
  data = [],
  loading = false,
  totalCount = 0,
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
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
      return ["name", "assessment"]; // Most minimal view with assessment
    } else if (isTablet) {
      return ["name", "passoutYear", "assessment"]; // Medium view with assessment
    }
    return ["name", "email", "passoutYear", "cohort", "branch", "assessment"]; // Full view with assessment
  };

  const visibleColumns = getVisibleColumns();

  // Function to generate dummy assessment value (true for pass, false for fail)
  const getAssessmentValue = (id) => {
    // Use student id to determine pass/fail (even ids pass, odd ids fail)
    return id % 2 === 0;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Box sx={{ width: "100%", mt: 2 }}>
          <SearchWrapper>{/* Search UI components here */}</SearchWrapper>

          {/* Table container with scroll capability */}
          <StyledTableContainer component={Paper}>
            {/* Table with minimum width to ensure scrolling when needed */}
            <Table
              size="small"
              aria-label="student data table"
              sx={{
                minWidth: isMobile ? 300 : 650,
                // Don't use tableLayout: "fixed" to allow cells to take their natural width
              }}
            >
              <StyledTableHead>
                <TableRow>
                  {visibleColumns.includes("name") && (
                    <StyledTableHeadCell>Name</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("email") && (
                    <StyledTableHeadCell>Email</StyledTableHeadCell>
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
                  {/* {visibleColumns.includes("assessment") && (
                    <StyledTableHeadCell>Assessment</StyledTableHeadCell>
                  )} */}
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
                      {visibleColumns.includes("assessment") && (
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
                      <StyledTableRow>
                        {visibleColumns.includes("name") && (
                          <StyledTableCell component="th" scope="row">
                            {row.name}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("email") && (
                          <StyledTableCell>{row.email}</StyledTableCell>
                        )}
                        {visibleColumns.includes("passoutYear") && (
                          <StyledTableCell>{row.passoutYear}</StyledTableCell>
                        )}
                        {visibleColumns.includes("cohort") && (
                          <StyledTableCell>{row.cohort}</StyledTableCell>
                        )}
                        {visibleColumns.includes("branch") && (
                          <StyledTableCell>{row.branch}</StyledTableCell>
                        )}
                        {/* {visibleColumns.includes("assessment") && (
                          <StyledTableCell align="center">
                            {getAssessmentValue(row.id) ? (
                              <CheckCircleIcon
                                color="success"
                                fontSize="small"
                                sx={{ verticalAlign: "middle" }}
                              />
                            ) : (
                              <CloseIcon
                                color="error"
                                fontSize="small"
                                sx={{ verticalAlign: "middle" }}
                              />
                            )}
                          </StyledTableCell>
                        )} */}
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
                      </StyledTableRow>

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
                              {/* {!visibleColumns.includes("assessment") && (
                                <DetailItem>
                                  <span className="label">Assessment:</span>
                                  <span className="value">
                                    {getAssessmentValue(row.id)
                                      ? "Passed"
                                      : "Failed"}
                                  </span>
                                </DetailItem>
                              )} */}
                            </MobileExpandableRow>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>

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
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsTable;
