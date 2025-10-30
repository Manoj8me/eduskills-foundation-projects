// StudentDetailModal.js - Fixed to use 1-indexed API pages
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { X, Mail } from "lucide-react";

const StudentDetailModal = ({
  open,
  onClose,
  title,
  showRejectionReason = false,
  cohortId,
  statusType,
  api,
  BASE_URL,
  student_list_count,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // MUI uses 0-indexed
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const rowsPerPage = 10;

  const tableContainerRef = useRef(null);

  // Fetch data from API
  const fetchStudentData = async (pageNo) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Convert 0-indexed page to 1-indexed for API
      const apiPageNo = pageNo + 1;

      console.log(`Fetching page ${apiPageNo} (MUI page index: ${pageNo})`);

      const res = await api.get(
        `${BASE_URL}/internship/student_lists`,
        {
          params: {
            cohort_id: cohortId,
            key_name: statusType,
            page_no: apiPageNo, // API expects 1-indexed pages
            limit: 10,
          },
        },
        { headers }
      );

      // API returns array directly
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when modal opens or page changes
  useEffect(() => {
    if (open && cohortId && statusType) {
      fetchStudentData(currentPage);
    }
  }, [open, currentPage, cohortId, statusType]);

  // Reset page when modal opens
  useEffect(() => {
    if (open) {
      setCurrentPage(0);
    }
  }, [open]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Apply sorting to current page data
  const sortedData = React.useMemo(() => {
    if (!data?.length) return [];

    const sorted = [...data].sort((a, b) => {
      // Map display column names to API field names
      const fieldMap = {
        name: "name",
        email: "email",
        rollNo: "roll_no",
        year: "passoutYear",
        branch: "branch",
        domain: "domain_name",
        rejectionReason: "rejection_reason",
      };

      const apiField = fieldMap[sortColumn] || sortColumn;
      const valueA = a[apiField] || "";
      const valueB = b[apiField] || "";

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  // Handle page change - MUI gives 0-indexed page
  const handleChangePage = (event, newPage) => {
    console.log(
      `Page changed to: ${newPage} (API will request page ${newPage + 1})`
    );
    setCurrentPage(newPage);
  };

  // Get status color based on title
  const getStatusColor = () => {
    if (
      title.includes("Verified") ||
      title.includes("Completed") ||
      title.includes("Issued")
    )
      return "#10b981";
    if (title.includes("Progress") || title.includes("Pending"))
      return "#f59e0b";
    if (title.includes("Rejected")) return "#f43f5e";
    if (title.includes("Not")) return "#3b82f6";
    if (title.includes("Eligible") || title.includes("Uploaded"))
      return "#8b5cf6";
    return "#6366f1";
  };

  // Truncate email for display
  const truncateEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (username.length <= 8) return email;
    return `${username.slice(0, 8)}...@${domain}`;
  };

  // Common styles for table headers
  const getHeaderCellStyles = (column) => ({
    fontWeight: 600,
    fontSize: "0.8rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "#444",
    backgroundColor: sortColumn === column ? "#f5f5f5" : "#ffffff",
    py: 1.5,
    borderBottom: "2px solid rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 2,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: "90vw",
          maxWidth: "1400px",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          height: "80vh",
          maxHeight: "800px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            label={title}
            size="small"
            sx={{
              backgroundColor: `${getStatusColor()}15`,
              color: getStatusColor(),
              fontWeight: 600,
              mr: 1.5,
              fontSize: "0.8rem",
              height: "24px",
              borderRadius: "12px",
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a" }}
          >
            Student List ({student_list_count || 0})
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#666",
            backgroundColor: "rgba(0,0,0,0.04)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.08)",
            },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <CircularProgress size={32} sx={{ color: getStatusColor() }} />
          </Box>
        ) : sortedData.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              p: 5,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
              No students found
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              flexGrow: 1,
              overflow: "auto",
              mx: 2.5,
              mb: 2,
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.06)",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
                border: "2px solid white",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                },
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.03)",
                borderRadius: "4px",
              },
            }}
            ref={tableContainerRef}
          >
            <Table
              size="small"
              stickyHeader
              sx={{
                minWidth: 650,
                tableLayout: "fixed",
                width: "100%",
                pr: 3,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...getHeaderCellStyles("name"),
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                      width: showRejectionReason ? "15%" : "20%",
                      pl: 2,
                    }}
                    onClick={() => handleSort("name")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Name
                      {sortColumn === "name" && (
                        <Box
                          component="span"
                          sx={{ ml: 0.5, color: getStatusColor() }}
                        >
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...getHeaderCellStyles("email"),
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                      width: showRejectionReason ? "15%" : "20%",
                    }}
                    onClick={() => handleSort("email")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Email
                      {sortColumn === "email" && (
                        <Box
                          component="span"
                          sx={{ ml: 0.5, color: getStatusColor() }}
                        >
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...getHeaderCellStyles("rollNo"),
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                      width: showRejectionReason ? "10%" : "12%",
                    }}
                    onClick={() => handleSort("rollNo")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Roll No.
                      {sortColumn === "rollNo" && (
                        <Box
                          component="span"
                          sx={{ ml: 0.5, color: getStatusColor() }}
                        >
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...getHeaderCellStyles("year"),
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                      width: showRejectionReason ? "8%" : "10%",
                    }}
                    onClick={() => handleSort("year")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Year
                      {sortColumn === "year" && (
                        <Box
                          component="span"
                          sx={{ ml: 0.5, color: getStatusColor() }}
                        >
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...getHeaderCellStyles("branch"),
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                      width: showRejectionReason ? "12%" : "15%",
                    }}
                    onClick={() => handleSort("branch")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Branch
                      {sortColumn === "branch" && (
                        <Box
                          component="span"
                          sx={{ ml: 0.5, color: getStatusColor() }}
                        >
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...getHeaderCellStyles("domain"),
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                      width: showRejectionReason ? "12%" : "15%",
                    }}
                    onClick={() => handleSort("domain")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Domain
                      {sortColumn === "domain" && (
                        <Box
                          component="span"
                          sx={{ ml: 0.5, color: getStatusColor() }}
                        >
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  {showRejectionReason && (
                    <TableCell
                      sx={{
                        ...getHeaderCellStyles("rejectionReason"),
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                        width: "18%",
                      }}
                      onClick={() => handleSort("rejectionReason")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Rejection Reason
                        {sortColumn === "rejectionReason" && (
                          <Box
                            component="span"
                            sx={{ ml: 0.5, color: getStatusColor() }}
                          >
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((student, index) => (
                  <TableRow
                    key={student.internship_id || index}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.01)",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        maxWidth: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        py: 1.2,
                        pl: 2,
                        borderBottom:
                          index === sortedData.length - 1
                            ? "none"
                            : "1px solid rgba(0,0,0,0.03)",
                      }}
                    >
                      <Tooltip title={student.name} placement="top">
                        <span>{student.name}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        py: 1.2,
                        borderBottom:
                          index === sortedData.length - 1
                            ? "none"
                            : "1px solid rgba(0,0,0,0.03)",
                      }}
                    >
                      <Tooltip title={student.email} placement="top">
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <Mail
                            size={12}
                            style={{ marginRight: "4px", color: "#666" }}
                          />
                          {truncateEmail(student.email)}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        py: 1.2,
                        borderBottom:
                          index === sortedData.length - 1
                            ? "none"
                            : "1px solid rgba(0,0,0,0.03)",
                      }}
                    >
                      {student.roll_no}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        py: 1.2,
                        borderBottom:
                          index === sortedData.length - 1
                            ? "none"
                            : "1px solid rgba(0,0,0,0.03)",
                      }}
                    >
                      {student.passoutYear}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        maxWidth: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        py: 1.2,
                        borderBottom:
                          index === sortedData.length - 1
                            ? "none"
                            : "1px solid rgba(0,0,0,0.03)",
                      }}
                    >
                      <Tooltip title={student.branch} placement="top">
                        <span>{student.branch}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        maxWidth: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        py: 1.2,
                        borderBottom:
                          index === sortedData.length - 1
                            ? "none"
                            : "1px solid rgba(0,0,0,0.03)",
                      }}
                    >
                      <Tooltip title={student.domain_name} placement="top">
                        <span>{student.domain_name}</span>
                      </Tooltip>
                    </TableCell>
                    {showRejectionReason && (
                      <TableCell
                        sx={{
                          fontSize: "0.8rem",
                          py: 1,
                          borderBottom:
                            index === sortedData.length - 1
                              ? "none"
                              : "1px solid rgba(0,0,0,0.03)",
                        }}
                      >
                        <Chip
                          label={student.rejection_reason || "N/A"}
                          size="small"
                          sx={{
                            backgroundColor: "#fff1f2",
                            color: "#f43f5e",
                            fontSize: "0.7rem",
                            height: "22px",
                            borderRadius: "11px",
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            paddingRight: 2.5,
          }}
        >
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={student_list_count || 0}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            sx={{
              ".MuiTablePagination-root": {
                color: "#555",
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.8rem",
                  color: "#555",
                },
              ".MuiTablePagination-select": {
                fontSize: "0.8rem",
              },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailModal;
