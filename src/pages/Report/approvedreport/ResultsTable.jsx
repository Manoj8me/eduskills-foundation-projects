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
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import ExportCSV from "./ExportCSV"; // Import the updated component

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginTop: theme.spacing(2),
  overflow: "auto", // Changed from 'hidden' to 'auto' to enable scrolling
  maxHeight: "calc(100vh - 250px)", // Set a max height for vertical scrolling if needed
}));

// Wrapper for fixed positioning of the pagination
const TableWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
}));

const PaginationWrapper = styled(Box)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 10,
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
  whiteSpace: "nowrap", // Keep column headers on one line
  "&:first-of-type": {
    paddingLeft: theme.spacing(2),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: "0.75rem",
  whiteSpace: "nowrap", // Keep all content on one line, no wrapping
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

const ExportWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
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

const ResultsTable = ({
  searchParams,
  data = [],
  loading = false,
  totalCount = 0,
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
  searchTerm,
  onSearchTermChange,
  filterOptions,
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
  // NOTE: We're keeping all columns for horizontal scrolling, but maintain this for mobile expandable rows
  const getVisibleColumns = () => {
    if (isMobile) {
      return ["name", "rollNo"]; // Most minimal view (removed actions)
    } else if (isTablet) {
      return ["name", "rollNo", "domain", "passoutYear"]; // Medium view (removed actions)
    }
    return [
      "name",
      "email",
      "rollNo",
      "passoutYear",
      "cohort",
      "branch",
      "domain",
    ]; // Full view (removed actions)
  };

  const visibleColumns = getVisibleColumns();

  // Full column list for horizontal scrolling - removed actions column
  const allColumns = [
    "name",
    "email",
    "rollNo",
    "passoutYear",
    "cohort",
    "branch",
    "domain",
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
          {/* Add Export CSV Button at the top of the table */}
          <ExportWrapper>
            <ExportCSV
              data={data}
              searchParams={searchParams}
              filename="student-data"
            />
          </ExportWrapper>

          <SearchWrapper>{/* Table header content if needed */}</SearchWrapper>

          <StyledTableContainer component={Paper}>
            <Table size="small" aria-label="student data table" stickyHeader>
              <StyledTableHead>
                <TableRow>
                  {/* Always include all columns for horizontal scrolling */}
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
                    return null;
                  })}
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
                      {isMobile && (
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
                    <TableCell colSpan={allColumns.length + (isMobile ? 1 : 0)}>
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
                        {/* Always show all columns for horizontal scrolling */}
                        <StyledTableCell component="th" scope="row">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell>{row.email}</StyledTableCell>
                        <StyledTableCell>{row.rollNo}</StyledTableCell>
                        <StyledTableCell>{row.passoutYear}</StyledTableCell>
                        <StyledTableCell>{row.cohort}</StyledTableCell>
                        <StyledTableCell>{row.branch}</StyledTableCell>
                        <StyledTableCell>{row.domain}</StyledTableCell>
                        {/* Removed actions column */}
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
                            colSpan={allColumns.length + 1}
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
          </StyledTableContainer>

          {/* Fixed Pagination */}
          {!loading && data.length > 0 && (
            <PaginationWrapper>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
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
            </PaginationWrapper>
          )}
        </TableWrapper>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsTable;
