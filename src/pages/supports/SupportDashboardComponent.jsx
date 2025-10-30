import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  TextField,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Badge,
  Tooltip,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  DoDisturb as DoDisturbIcon,
  ArrowForward as ArrowForwardIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  NotificationsActive as NotificationsActiveIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";

// Priority levels
const PRIORITIES = [
  { value: "Low", color: "#4caf50" },
  { value: "Medium", color: "#ff9800" },
  { value: "High", color: "#f44336" },
  { value: "Critical", color: "#9c27b0" },
];

// Status options
const STATUSES = [
  { value: "Open", color: "#2196f3" },
  { value: "In Progress", color: "#ff9800" },
  { value: "Resolved", color: "#4caf50" },
  { value: "Closed", color: "#9e9e9e" },
];

const SupportDashboardComponent = ({
  tickets = [],
  onViewTicket,
  onUpdateStatus,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(tickets);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for sort menu
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  // State for filter menu
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // State for action menu for each ticket
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // State for show loading status when taking actions
  const [loadingAction, setLoadingAction] = useState(false);

  // Mock statistics
  const statistics = {
    totalTickets: tickets.length,
    openTickets: tickets.filter((t) => t.status === "Open").length,
    inProgressTickets: tickets.filter((t) => t.status === "In Progress").length,
    resolvedTickets: tickets.filter((t) => t.status === "Resolved").length,
    criticalTickets: tickets.filter((t) => t.priority === "Critical").length,
    averageResponseTime: "3.2 hours",
    ticketsResolvedToday: 5,
  };

  // Status mapping for tabs
  const tabStatusMap = ["All", "Open", "In Progress", "Resolved", "Closed"];
  const currentTabStatus = tabStatusMap[tabValue];

  // Update filtered tickets when tickets prop, search term, or filters change
  useEffect(() => {
    let filtered = tickets.filter(
      (ticket) =>
        (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (tabValue === 0 || ticket.status === tabStatusMap[tabValue]) &&
        (priorityFilter === "All" || ticket.priority === priorityFilter) &&
        (categoryFilter === "All" || ticket.category === categoryFilter)
    );

    // Apply sorting
    if (sortOption === "newest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } else if (sortOption === "oldest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else if (sortOption === "priority") {
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      filtered = [...filtered].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    setFilteredTickets(filtered);
  }, [
    searchTerm,
    tickets,
    sortOption,
    priorityFilter,
    categoryFilter,
    tabValue,
  ]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sort menu
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    handleSortClose();
  };

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSortOption("newest");
    setPriorityFilter("All");
    setCategoryFilter("All");
  };

  // Handle action menu
  const handleActionClick = (event, ticketId) => {
    event.stopPropagation();
    setActionAnchorEl(event.currentTarget);
    setSelectedTicketId(ticketId);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedTicketId(null);
  };

  // Handle update ticket status
  const handleUpdateStatus = (status) => {
    setLoadingAction(true);

    // Simulate API call
    setTimeout(() => {
      if (onUpdateStatus) {
        onUpdateStatus(selectedTicketId, status);
      }
      handleActionClose();
      setLoadingAction(false);
    }, 800);
  };

  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    const statusObj = STATUSES.find((s) => s.value === status);
    return (
      <Chip
        label={status}
        size="small"
        style={{
          backgroundColor: statusObj ? statusObj.color : "#9e9e9e",
          color: "white",
          fontWeight: 500,
        }}
      />
    );
  };

  // Render priority chip with appropriate color
  const renderPriorityChip = (priority) => {
    const priorityObj = PRIORITIES.find((p) => p.value === priority);
    return (
      <Chip
        label={priority}
        size="small"
        style={{
          backgroundColor: priorityObj ? priorityObj.color : "#9e9e9e",
          color: "white",
          fontWeight: 500,
        }}
      />
    );
  };

  // Calculate counts for each status tab
  const getStatusCounts = () => {
    const counts = {};
    counts["All"] = tickets.length;
    STATUSES.forEach((status) => {
      counts[status.value] = tickets.filter(
        (ticket) => ticket.status === status.value
      ).length;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Box sx={{ width: "100%" }}>
      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 1.5,
              p: 2,
              height: "100%",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              bgcolor: "rgba(33, 150, 243, 0.04)",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Total Tickets
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              {statistics.totalTickets}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip
                label={`${statistics.openTickets} open`}
                size="small"
                sx={{
                  height: 20,
                  bgcolor: "primary.main",
                  color: "white",
                  "& .MuiChip-label": { fontSize: "0.65rem", px: 0.8 },
                }}
              />
              <Chip
                label={`${statistics.inProgressTickets} in progress`}
                size="small"
                sx={{
                  height: 20,
                  bgcolor: STATUSES[1].color,
                  color: "white",
                  "& .MuiChip-label": { fontSize: "0.65rem", px: 0.8 },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 1.5,
              p: 2,
              height: "100%",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              bgcolor: "rgba(156, 39, 176, 0.04)",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Critical Issues
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, mb: 0.5, color: PRIORITIES[3].color }}
            >
              {statistics.criticalTickets}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NotificationsActiveIcon
                sx={{ fontSize: 14, color: "text.secondary", mr: 0.5 }}
              />
              <Typography variant="caption" color="text.secondary">
                Requires immediate attention
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 1.5,
              p: 2,
              height: "100%",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              bgcolor: "rgba(76, 175, 80, 0.04)",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Resolved Today
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, mb: 0.5, color: STATUSES[2].color }}
            >
              {statistics.ticketsResolvedToday}
            </Typography>
            <Chip
              label={`${statistics.resolvedTickets} total resolved`}
              size="small"
              variant="outlined"
              sx={{
                height: 20,
                borderColor: STATUSES[2].color,
                color: STATUSES[2].color,
                "& .MuiChip-label": { fontSize: "0.65rem", px: 0.8 },
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 1.5,
              p: 2,
              height: "100%",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              bgcolor: "rgba(250, 250, 250, 0.9)",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Avg. Response Time
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              {statistics.averageResponseTime}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SpeedIcon
                sx={{ fontSize: 14, color: "text.secondary", mr: 0.5 }}
              />
              <Typography variant="caption" color="text.secondary">
                First response time
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          border: "1px solid rgba(0, 0, 0, 0.04)",
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              mb: 2,
            }}
          >
            Ticket Management
          </Typography>

          {/* Search and Filter Bar */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <TextField
              placeholder="Search tickets..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: "text.secondary", fontSize: 16 }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1,
                  fontSize: "0.8rem",
                  height: 36,
                  flexGrow: 1,
                  minWidth: "200px",
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Tooltip title="Sort options">
                <Button
                  size="small"
                  startIcon={<SortIcon sx={{ fontSize: 16 }} />}
                  onClick={handleSortClick}
                  variant="outlined"
                  sx={{
                    height: 36,
                    textTransform: "none",
                    fontSize: "0.75rem",
                    px: 1.5,
                  }}
                >
                  {sortOption === "newest"
                    ? "Newest"
                    : sortOption === "oldest"
                    ? "Oldest"
                    : "Priority"}
                </Button>
              </Tooltip>

              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
              >
                <MenuItem
                  dense
                  onClick={() => handleSortSelect("newest")}
                  selected={sortOption === "newest"}
                >
                  <Typography variant="body2">Newest first</Typography>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => handleSortSelect("oldest")}
                  selected={sortOption === "oldest"}
                >
                  <Typography variant="body2">Oldest first</Typography>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => handleSortSelect("priority")}
                  selected={sortOption === "priority"}
                >
                  <Typography variant="body2">Priority</Typography>
                </MenuItem>
              </Menu>

              <Tooltip title="Filter options">
                <Button
                  size="small"
                  startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
                  onClick={handleFilterClick}
                  variant="outlined"
                  sx={{
                    height: 36,
                    textTransform: "none",
                    fontSize: "0.75rem",
                    px: 1.5,
                  }}
                >
                  Filter
                  {(priorityFilter !== "All" || categoryFilter !== "All") && (
                    <Badge color="primary" variant="dot" sx={{ ml: 1 }} />
                  )}
                </Button>
              </Tooltip>

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
              >
                <Typography
                  variant="caption"
                  sx={{ px: 2, py: 0.5, display: "block", fontWeight: 500 }}
                >
                  Priority
                </Typography>
                <MenuItem
                  dense
                  onClick={() => setPriorityFilter("All")}
                  selected={priorityFilter === "All"}
                >
                  <Typography variant="body2">All</Typography>
                </MenuItem>
                {PRIORITIES.map((priority) => (
                  <MenuItem
                    key={priority.value}
                    dense
                    onClick={() => setPriorityFilter(priority.value)}
                    selected={priorityFilter === priority.value}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: priority.color,
                        display: "inline-block",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">{priority.value}</Typography>
                  </MenuItem>
                ))}

                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    display: "block",
                    fontWeight: 500,
                    mt: 1.5,
                  }}
                >
                  Category
                </Typography>
                <MenuItem
                  dense
                  onClick={() => setCategoryFilter("All")}
                  selected={categoryFilter === "All"}
                >
                  <Typography variant="body2">All</Typography>
                </MenuItem>
                {[
                  "IT",
                  "Development",
                  "HR",
                  "Finance",
                  "Marketing",
                  "Sales",
                  "Customer Support",
                  "Operations",
                ].map((category) => (
                  <MenuItem
                    key={category}
                    dense
                    onClick={() => setCategoryFilter(category)}
                    selected={categoryFilter === category}
                  >
                    <Typography variant="body2">{category}</Typography>
                  </MenuItem>
                ))}

                <Box sx={{ px: 1, py: 1, mt: 1 }}>
                  <Button
                    fullWidth
                    size="small"
                    onClick={handleResetFilters}
                    startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
                  >
                    Reset filters
                  </Button>
                </Box>
              </Menu>
            </Box>
          </Box>

          {/* Status Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              "& .MuiTab-root": {
                minWidth: "auto",
                px: { xs: 1.5, sm: 2 },
                py: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "none",
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            }}
          >
            {tabStatusMap.map((status, index) => (
              <Tab
                key={status}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {status}
                    <Chip
                      label={statusCounts[status] || 0}
                      size="small"
                      sx={{
                        height: 18,
                        minWidth: 18,
                        fontSize: "0.65rem",
                        bgcolor:
                          index === 0
                            ? "primary.main"
                            : STATUSES[index - 1]?.color || "primary.main",
                        color: "white",
                        "& .MuiChip-label": {
                          px: 0.8,
                        },
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>

          {/* Table View */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 1.5, border: "1px solid rgba(0, 0, 0, 0.08)" }}
          >
            <Table
              size="small"
              sx={{ minWidth: 650 }}
              aria-label="ticket table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                    Ticket ID
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                      Category
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                    Status
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                      Date
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                    Priority
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isMobile ? 5 : 7}
                      align="center"
                      sx={{ py: 4 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No tickets found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        hover
                        onClick={() => onViewTicket && onViewTicket(ticket)}
                        sx={{
                          cursor: "pointer",
                          "&:last-child td, &:last-child th": { border: 0 },
                          borderLeft: `4px solid ${
                            STATUSES.find((s) => s.value === ticket.status)
                              ?.color || "#9e9e9e"
                          }`,
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          <Box sx={{ fontWeight: 500 }}>{ticket.id}</Box>
                        </TableCell>

                        {!isMobile && (
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            <Chip
                              label={ticket.category}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 20,
                                "& .MuiChip-label": {
                                  fontSize: "0.65rem",
                                  px: 0.8,
                                },
                              }}
                            />
                          </TableCell>
                        )}

                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          <Box sx={{ fontWeight: 500 }}>{ticket.title}</Box>
                          {isMobile && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {ticket.date}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {renderStatusChip(ticket.status)}
                        </TableCell>

                        {!isMobile && (
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <TimelineIcon
                                sx={{
                                  fontSize: 12,
                                  mr: 0.5,
                                  color: "text.secondary",
                                }}
                              />
                              {ticket.date}
                            </Box>
                          </TableCell>
                        )}

                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {renderPriorityChip(ticket.priority)}
                        </TableCell>

                        <TableCell align="right">
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Tooltip title="View details">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewTicket && onViewTicket(ticket);
                                }}
                                sx={{ color: "primary.main" }}
                              >
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More actions">
                              <IconButton
                                size="small"
                                onClick={(e) => handleActionClick(e, ticket.id)}
                                sx={{ color: "text.secondary" }}
                              >
                                <MoreVertIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          {/* Action Menu */}
                          <Menu
                            anchorEl={actionAnchorEl}
                            open={
                              Boolean(actionAnchorEl) &&
                              selectedTicketId === ticket.id
                            }
                            onClose={handleActionClose}
                          >
                            {/* Status update options based on current status */}
                            {ticket.status === "Open" && (
                              <MenuItem
                                dense
                                onClick={() =>
                                  handleUpdateStatus("In Progress")
                                }
                              >
                                <ArrowForwardIcon
                                  sx={{
                                    fontSize: 16,
                                    mr: 1,
                                    color: STATUSES[1].color,
                                  }}
                                />
                                <Typography variant="body2">
                                  Move to In Progress
                                </Typography>
                              </MenuItem>
                            )}
                            {(ticket.status === "Open" ||
                              ticket.status === "In Progress") && (
                              <MenuItem
                                dense
                                onClick={() => handleUpdateStatus("Resolved")}
                              >
                                <CheckCircleIcon
                                  sx={{
                                    fontSize: 16,
                                    mr: 1,
                                    color: STATUSES[2].color,
                                  }}
                                />
                                <Typography variant="body2">
                                  Mark as Resolved
                                </Typography>
                              </MenuItem>
                            )}
                            {ticket.status !== "Closed" && (
                              <MenuItem
                                dense
                                onClick={() => handleUpdateStatus("Closed")}
                              >
                                <DoDisturbIcon
                                  sx={{
                                    fontSize: 16,
                                    mr: 1,
                                    color: STATUSES[3].color,
                                  }}
                                />
                                <Typography variant="body2">
                                  Close ticket
                                </Typography>
                              </MenuItem>
                            )}
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
                {loadingAction && (
                  <TableRow>
                    <TableCell
                      colSpan={isMobile ? 5 : 7}
                      sx={{ p: 0, border: 0 }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          zIndex: 1,
                          top: 0,
                          left: 0,
                        }}
                      >
                        <CircularProgress size={32} />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTickets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              "& .MuiTablePagination-toolbar": {
                height: 56,
                minHeight: 56,
                pl: 2,
                pr: 2,
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: "0.75rem",
              },
              "& .MuiTablePagination-selectLabel": {
                fontSize: "0.75rem",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default SupportDashboardComponent;
