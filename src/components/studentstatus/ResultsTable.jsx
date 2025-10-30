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
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

// Sample student data
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    rollNo: "CS2023001",
    passoutYear: "2023",
    cohort: "Software Engineering",
    branch: "Computer Science",
    status: "Applied",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    rollNo: "DS2024015",
    passoutYear: "2024",
    cohort: "Data Science",
    branch: "Computer Science",
    status: "Approved",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    rollNo: "CS2022043",
    passoutYear: "2022",
    cohort: "Software Engineering",
    branch: "Information Technology",
    status: "Applied",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    rollNo: "CS2023022",
    passoutYear: "2023",
    cohort: "Cyber Security",
    branch: "Information Technology",
    status: "Rejected",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.b@example.com",
    rollNo: "ME2022011",
    passoutYear: "2022",
    cohort: "Networking",
    branch: "Mechanical",
    status: "Applied",
  },
  {
    id: 6,
    name: "Emma Davis",
    email: "emma.d@example.com",
    rollNo: "CS2024009",
    passoutYear: "2024",
    cohort: "AI & ML",
    branch: "Computer Science",
    status: "Pending",
  },
  {
    id: 7,
    name: "Alex Wilson",
    email: "alex.w@example.com",
    rollNo: "CS2023045",
    passoutYear: "2023",
    cohort: "Software Engineering",
    branch: "Computer Science",
    status: "Applied",
  },
  {
    id: 8,
    name: "Olivia Miller",
    email: "olivia.m@example.com",
    rollNo: "EC2022033",
    passoutYear: "2022",
    cohort: "Networking",
    branch: "Electronics",
    status: "Approved",
  },
  {
    id: 9,
    name: "James Taylor",
    email: "james.t@example.com",
    rollNo: "CS2024027",
    passoutYear: "2024",
    cohort: "Data Science",
    branch: "Computer Science",
    status: "Applied",
  },
  {
    id: 10,
    name: "Sophia Anderson",
    email: "sophia.a@example.com",
    rollNo: "CE2023018",
    passoutYear: "2023",
    cohort: "Networking",
    branch: "Civil",
    status: "Pending",
  },
  {
    id: 11,
    name: "Lucas Martinez",
    email: "lucas.m@example.com",
    rollNo: "IT2022007",
    passoutYear: "2022",
    cohort: "Cyber Security",
    branch: "Information Technology",
    status: "Applied",
  },
  {
    id: 12,
    name: "Emily Thomas",
    email: "emily.t@example.com",
    rollNo: "CS2024036",
    passoutYear: "2024",
    cohort: "Software Engineering",
    branch: "Computer Science",
    status: "Rejected",
  },
  {
    id: 13,
    name: "Daniel White",
    email: "daniel.w@example.com",
    rollNo: "ME2023031",
    passoutYear: "2023",
    cohort: "AI & ML",
    branch: "Mechanical",
    status: "Applied",
  },
  {
    id: 14,
    name: "Ava Garcia",
    email: "ava.g@example.com",
    rollNo: "DS2022025",
    passoutYear: "2022",
    cohort: "Data Science",
    branch: "Computer Science",
    status: "Approved",
  },
  {
    id: 15,
    name: "Noah Rodriguez",
    email: "noah.r@example.com",
    rollNo: "CS2024052",
    passoutYear: "2024",
    cohort: "Software Engineering",
    branch: "Computer Science",
    status: "Applied",
  },
];

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginTop: theme.spacing(2),
  overflow: "hidden",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(90deg, #f5f7fa 0%, #e4e8eb 100%)",
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
const ResultsTable = ({ searchParams }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(sampleData);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [searchParams]);

  // Filter data based on search params and search term
  useEffect(() => {
    let results = [...sampleData];

    // Apply search params filters
    if (searchParams) {
      if (searchParams.email) {
        results = results.filter((item) =>
          item.email.toLowerCase().includes(searchParams.email.toLowerCase())
        );
      }

      if (searchParams.domain && searchParams.domain !== "All Domain") {
        // This would be implemented based on your domain logic
      }

      if (searchParams.status) {
        results = results.filter((item) => item.status === searchParams.status);
      }

      if (searchParams.cohort) {
        results = results.filter((item) => item.cohort === searchParams.cohort);
      }

      if (searchParams.year) {
        results = results.filter(
          (item) => item.passoutYear === searchParams.year
        );
      }

      if (searchParams.branch) {
        results = results.filter((item) => item.branch === searchParams.branch);
      }
    }

    // Apply search term filter (across all fields)
    if (searchTerm) {
      results = results.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredData(results);
    setPage(0); // Reset to first page when filters change
  }, [searchParams, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setExpandedRow(null); // Close expanded row when changing page
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedRow(null); // Close expanded row when changing rows per page
  };

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Get current page data
  const currentData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Determine which columns to show based on screen size
  const getVisibleColumns = () => {
    if (isMobile) {
      return ["name", "status"]; // Most minimal view
    } else if (isTablet) {
      return ["name", "rollNo", "passoutYear", "status"]; // Medium view
    }
    return [
      "name",
      "email",
      "rollNo",
      "passoutYear",
      "cohort",
      "branch",
      "status",
    ]; // Full view
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
          <SearchWrapper>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              <FilterListIcon sx={{ mr: 0.5, fontSize: "1rem" }} />
              Results
              {!isLoading && (
                <Chip
                  label={`${filteredData.length}`}
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                />
              )}
            </Typography>

            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ fontSize: "0.9rem" }} />
                  </InputAdornment>
                ),
                sx: { fontSize: "0.75rem" },
              }}
              sx={{ width: { xs: "120px", sm: "180px" } }}
            />
          </SearchWrapper>

          <StyledTableContainer component={Paper}>
            <Table size="small" aria-label="student data table">
              <StyledTableHead>
                <TableRow>
                  {visibleColumns.includes("name") && (
                    <StyledTableHeadCell>Name</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("email") && (
                    <StyledTableHeadCell>Email</StyledTableHeadCell>
                  )}
                  {visibleColumns.includes("rollNo") && (
                    <StyledTableHeadCell>Roll No.</StyledTableHeadCell>
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
                  {visibleColumns.includes("status") && (
                    <StyledTableHeadCell>Status</StyledTableHeadCell>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length + (isMobile ? 1 : 0)}
                      align="center"
                      sx={{ py: 3 }}
                    >
                      <CircularProgress size={30} />
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontSize: "0.75rem" }}
                      >
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : currentData.length === 0 ? (
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
                  currentData.map((row, index) => (
                    <React.Fragment key={row.id}>
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        component={StyledTableRow}
                      >
                        {visibleColumns.includes("name") && (
                          <StyledTableCell component="th" scope="row">
                            {row.name}
                          </StyledTableCell>
                        )}
                        {visibleColumns.includes("email") && (
                          <StyledTableCell>{row.email}</StyledTableCell>
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
                          <StyledTableCell>{row.branch}</StyledTableCell>
                        )}
                        {visibleColumns.includes("status") && (
                          <StyledTableCell>
                            <Chip
                              label={row.status}
                              color={getStatusChipColor(row.status)}
                              size="small"
                              sx={{
                                fontWeight: 500,
                                height: 20,
                                fontSize: "0.65rem",
                              }}
                            />
                          </StyledTableCell>
                        )}
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
                            </MobileExpandableRow>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>

            {!isLoading && filteredData.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
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
