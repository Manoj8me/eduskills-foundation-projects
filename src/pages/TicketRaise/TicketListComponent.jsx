import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  Badge,
  Zoom,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Comment as CommentIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
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

// Mock comments for tickets
const MOCK_COMMENTS = {
  "TKT-5724": [
    {
      id: "c1",
      author: "Support Agent",
      avatar: "SA",
      content:
        "I'm checking the network status. Can you please provide more details about when this started?",
      date: "2025-04-14 14:30",
      isAgent: true,
    },
    {
      id: "c2",
      author: "John Doe",
      avatar: "JD",
      content:
        "It started after the system update yesterday. I can't access any internal tools.",
      date: "2025-04-14 15:45",
      isAgent: false,
    },
  ],
  "TKT-8431": [
    {
      id: "c1",
      author: "Dev Team",
      avatar: "DT",
      content:
        "We've identified the issue in the registration flow. Working on a fix now.",
      date: "2025-04-13 10:15",
      isAgent: true,
    },
  ],
  "TKT-3847": [
    {
      id: "c1",
      author: "IT Support",
      avatar: "IT",
      content:
        "We're aware of the server outage and our team is working to resolve it ASAP.",
      date: "2025-04-11 09:20",
      isAgent: true,
    },
    {
      id: "c2",
      author: "System Admin",
      avatar: "SA",
      content:
        "Initial investigation shows this might be related to the recent database upgrade.",
      date: "2025-04-11 09:45",
      isAgent: true,
    },
    {
      id: "c3",
      author: "Jane Smith",
      avatar: "JS",
      content:
        "This is affecting our entire department. Please provide an ETA for resolution.",
      date: "2025-04-11 10:30",
      isAgent: false,
    },
  ],
};

// Function to get comment count
const getCommentCount = (ticketId) => {
  return MOCK_COMMENTS[ticketId]?.length || 0;
};

const ModifiedTicketListComponent = ({ tickets = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(tickets);

  // State for ticket detail view
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketViewOpen, setTicketViewOpen] = useState(false);

  // State for sort menu
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  // State for filter menu
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // State for reply
  const [replyText, setReplyText] = useState({});
  const [sendingReply, setSendingReply] = useState({});

  // Status mapping for tabs
  const tabStatusMap = ["Open", "In Progress", "Resolved", "Closed"];
  const currentTabStatus = tabStatusMap[tabValue];

  // Update filtered tickets when tickets prop, search term, or filters change
  useEffect(() => {
    let filtered = tickets.filter(
      (ticket) =>
        (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (tabValue === -1 || ticket.status === tabStatusMap[tabValue]) &&
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

  // Handle ticket selection for viewing
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketViewOpen(true);

    // Initialize reply text if not exists
    if (!replyText[ticket.id]) {
      setReplyText((prev) => ({
        ...prev,
        [ticket.id]: "",
      }));
    }
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

  // Handle reply text change
  const handleReplyChange = (ticketId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [ticketId]: value,
    }));
  };

  const handleReplySubmit = (ticketId) => {
    // Set sending state to true for animation
    setSendingReply((prev) => ({
      ...prev,
      [ticketId]: true,
    }));

    // Simulate sending delay for animation
    setTimeout(() => {
      // In a real app, this would send the reply to the backend
      console.log(
        `Reply submitted for ticket ${ticketId}: ${replyText[ticketId]}`
      );

      // Add the reply to the comments (for demo purposes)
      if (!MOCK_COMMENTS[ticketId]) {
        MOCK_COMMENTS[ticketId] = [];
      }

      MOCK_COMMENTS[ticketId].push({
        id: `c${MOCK_COMMENTS[ticketId].length + 1}`,
        author: "You",
        avatar: "YO",
        content: replyText[ticketId],
        date: new Date().toLocaleString(),
        isAgent: false,
      });

      // Clear the reply text
      setReplyText((prev) => ({
        ...prev,
        [ticketId]: "",
      }));

      // Reset sending state
      setSendingReply((prev) => ({
        ...prev,
        [ticketId]: false,
      }));

      // Scroll to the bottom of the conversation
      if (ticketViewOpen && selectedTicket && selectedTicket.id === ticketId) {
        const dialogContent = document.querySelector(".MuiDialogContent-root");
        if (dialogContent) {
          setTimeout(() => {
            dialogContent.scrollTop = dialogContent.scrollHeight;
          }, 100);
        }
      }
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
        }}
      />
    );
  };

  // Calculate counts for each status tab
  const getStatusCounts = () => {
    const counts = {};
    STATUSES.forEach((status) => {
      counts[status.value] = tickets.filter(
        (ticket) => ticket.status === status.value
      ).length;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <>
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
            Your Tickets
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

                <Divider sx={{ my: 1 }} />

                <Typography
                  variant="caption"
                  sx={{ px: 2, py: 0.5, display: "block", fontWeight: 500 }}
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
                {["IT", "Development", "HR", "Finance"].map((category) => (
                  <MenuItem
                    key={category}
                    dense
                    onClick={() => setCategoryFilter(category)}
                    selected={categoryFilter === category}
                  >
                    <Typography variant="body2">{category}</Typography>
                  </MenuItem>
                ))}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ px: 1, py: 0.5 }}>
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
            {STATUSES.map((status, index) => (
              <Tab
                key={status.value}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {status.value}
                    <Chip
                      label={statusCounts[status.value]}
                      size="small"
                      sx={{
                        height: 18,
                        minWidth: 18,
                        fontSize: "0.65rem",
                        bgcolor: status.color,
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
                      colSpan={isMobile ? 4 : 6}
                      align="center"
                      sx={{ py: 4 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No tickets found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      hover
                      onClick={() => handleViewTicket(ticket)}
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

                      {!isMobile && (
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccessTimeIcon
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
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="View comments">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTicket(ticket);
                              }}
                              sx={{
                                color: "text.secondary",
                                position: "relative",
                                p: 1,
                              }}
                            >
                              <CommentIcon sx={{ fontSize: 18 }} />
                              {getCommentCount(ticket.id) > 0 && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: 16,
                                    height: 16,
                                    fontSize: "0.6rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                  }}
                                >
                                  {getCommentCount(ticket.id)}
                                </Box>
                              )}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View ticket details">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTicket(ticket);
                              }}
                              sx={{ color: "primary.main", p: 1 }}
                            >
                              <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Ticket Detail View Dialog */}
      <Dialog
        open={ticketViewOpen}
        onClose={() => setTicketViewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, maxHeight: "85vh" },
        }}
      >
        {selectedTicket && (
          <>
            <DialogTitle
              sx={{
                pb: 1.5,
                pt: 2,
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                bgcolor: "primary.light",
                color: "primary.contrastText",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                >
                  Ticket {selectedTicket.id}
                </Typography>
                {renderStatusChip(selectedTicket.status)}
              </Box>
            </DialogTitle>

            <DialogContent
              dividers
              sx={{
                p: 0,
                display: "flex",
                flexDirection: "column",
                bgcolor: "rgba(0, 0, 0, 0.02)",
              }}
            >
              {/* Ticket details header */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 0,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                  >
                    {selectedTicket.title}
                  </Typography>
                  <Chip
                    label={selectedTicket.category}
                    size="small"
                    color="primary"
                    sx={{
                      ml: 1,
                      height: 20,
                      "& .MuiChip-label": { fontSize: "0.7rem" },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 0.75,
                    flexWrap: "wrap",
                    mt: 0.75,
                    mb: 1.5,
                  }}
                >
                  {renderPriorityChip(selectedTicket.priority)}
                  <Chip
                    label={`Created: ${selectedTicket.date}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      "& .MuiChip-label": { fontSize: "0.7rem" },
                    }}
                  />
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: 1.5,
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {selectedTicket.description}
                  </Typography>
                </Paper>

                {selectedTicket.files && selectedTicket.files.length > 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mt: 1,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                      borderRadius: 1.5,
                      border: "1px solid rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                      gutterBottom
                    >
                      Attachments
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                      {selectedTicket.files.map((file, index) => (
                        <Chip
                          key={index}
                          label={file}
                          size="small"
                          variant="outlined"
                          icon={<AttachFileIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "rgba(25, 118, 210, 0.04)",
                            borderColor: "rgba(25, 118, 210, 0.12)",
                            color: "primary.main",
                            height: 24,
                            "& .MuiChip-label": { fontSize: "0.7rem" },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}
              </Paper>

              {/* Modified chat-like conversation history with card style messages */}
              <Box
                sx={{
                  p: 2.5,
                  flexGrow: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {MOCK_COMMENTS[selectedTicket.id] &&
                MOCK_COMMENTS[selectedTicket.id].length > 0 ? (
                  MOCK_COMMENTS[selectedTicket.id].map((comment) => (
                    <Paper
                      key={comment.id}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: comment.isAgent
                          ? "rgba(33, 150, 243, 0.05)"
                          : "rgba(25, 118, 210, 0.08)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        maxWidth: "85%",
                        alignSelf: comment.isAgent ? "flex-start" : "flex-end",
                        width: { xs: "100%", sm: "70%" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.75,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: "0.7rem",
                            bgcolor: comment.isAgent
                              ? "primary.main"
                              : "grey.600",
                          }}
                        >
                          {comment.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                          >
                            {comment.author}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.65rem",
                              color: "text.secondary",
                            }}
                          >
                            {comment.date}
                          </Typography>
                        </Box>
                        {comment.isAgent && (
                          <Chip
                            label="Staff"
                            size="small"
                            variant="filled"
                            sx={{
                              height: 16,
                              bgcolor: "rgba(25, 118, 210, 0.1)",
                              color: "primary.main",
                              "& .MuiChip-label": {
                                px: 0.8,
                                fontSize: "0.6rem",
                              },
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.75rem", pl: 4.5 }}
                      >
                        {comment.content}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      minHeight: 100,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        fontStyle: "italic",
                      }}
                    >
                      No comments yet. Be the first to reply!
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>

            {/* Reply box at bottom */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                position: "relative",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  placeholder="Type your reply..."
                  variant="outlined"
                  multiline
                  rows={2}
                  value={replyText[selectedTicket.id] || ""}
                  onChange={(e) =>
                    handleReplyChange(selectedTicket.id, e.target.value)
                  }
                  size="small"
                  InputProps={{
                    sx: {
                      fontSize: "0.75rem",
                      pr: 5, // Make space for the send button
                      borderRadius: 4,
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      replyText[selectedTicket.id]?.trim()
                    ) {
                      e.preventDefault();
                      handleReplySubmit(selectedTicket.id);
                    }
                  }}
                />
                <Zoom in={Boolean(replyText[selectedTicket.id]?.trim())}>
                  <IconButton
                    color="primary"
                    size="medium"
                    onClick={() => handleReplySubmit(selectedTicket.id)}
                    disabled={
                      !replyText[selectedTicket.id]?.trim() ||
                      sendingReply[selectedTicket.id]
                    }
                    sx={{
                      position: "absolute",
                      right: 8,
                      bottom: 8,
                      backgroundColor: replyText[selectedTicket.id]?.trim()
                        ? "primary.main"
                        : "inherit",
                      color: replyText[selectedTicket.id]?.trim()
                        ? "white"
                        : "inherit",
                      "&:hover": {
                        backgroundColor: replyText[selectedTicket.id]?.trim()
                          ? "primary.main"
                          : "inherit",
                        opacity: 0.9,
                      },
                    }}
                  >
                    {sendingReply[selectedTicket.id] ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      <SendIcon sx={{ fontSize: 22 }} />
                    )}
                  </IconButton>
                </Zoom>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Press Enter to send, Shift+Enter for new line
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setTicketViewOpen(false)}
                  sx={{ fontSize: "0.7rem" }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ModifiedTicketListComponent;
