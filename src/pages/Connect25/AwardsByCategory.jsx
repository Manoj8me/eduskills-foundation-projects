import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Box,
  Typography,
  TablePagination,
  Skeleton,
  Chip,
  Tabs,
  Tab,
  Popover,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  EmojiEvents as AwardIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../services/configUrls";

const AwardsTableSkeleton = () => (
  <TableContainer
    component={Paper}
    sx={{
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      overflow: "hidden",
    }}
  >
    <Table size="small">
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #D1D5DB",
          }}
        >
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Award Name
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Institute Name
          </TableCell>
          <TableCell>State</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={250} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={200} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={120} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const AwardsByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAwards, setSelectedAwards] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterSearch, setFilterSearch] = useState("");

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/internship/awards-by-category`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch awards");
      }

      const data = await response.json();
      const filteredData = data
        .filter((category) => category.status === 1)
        .map((category) => ({
          ...category,
          winners: category.winners.filter((winner) => winner.status === 1),
        }))
        .filter((category) => category.winners.length > 0);

      setCategories(filteredData);
      if (filteredData.length > 0) {
        setActiveTab(0);
      }
    } catch (error) {
      console.error("Error fetching awards:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
    setSearchTerm("");
    setSelectedAwards([]);
  };

  const getCurrentCategoryWinners = () => {
    if (categories.length === 0) return [];
    return categories[activeTab]?.winners || [];
  };

  const isInstituteAward = () => {
    if (categories.length === 0) return false;
    return categories[activeTab]?.catagory_name === "Institute Award";
  };

  const uniqueAwards = [
    ...new Set(getCurrentCategoryWinners().map((winner) => winner.award_name)),
  ];

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
    setFilterSearch("");
  };

  const handleAwardToggle = (award) => {
    setSelectedAwards((prev) =>
      prev.includes(award) ? prev.filter((a) => a !== award) : [...prev, award]
    );
    setPage(0);
  };

  const filteredAwardsForPopover = uniqueAwards.filter((award) =>
    award.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const filteredWinners = getCurrentCategoryWinners().filter((winner) => {
    const matchesSearch =
      winner.award_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (winner.institute_name &&
        winner.institute_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (winner.candidate_name &&
        winner.candidate_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (winner.state_name &&
        winner.state_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAward =
      selectedAwards.length === 0 || selectedAwards.includes(winner.award_name);

    return matchesSearch && matchesAward;
  });

  const paginatedWinners = filteredWinners.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const truncateText = (text, wordLimit = 5) => {
    if (!text) return "-";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const open = Boolean(anchorEl);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderRadius: "12px",
          }}
        >
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Skeleton
              variant="rounded"
              width={200}
              height={36}
              sx={{ borderRadius: "12px" }}
            />
            <Skeleton
              variant="rounded"
              width={120}
              height={36}
              sx={{ borderRadius: "12px" }}
            />
          </Box>
        </Paper>
        <AwardsTableSkeleton />
      </Box>
    );
  }

  if (categories.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderRadius: "12px",
          }}
        >
          <AwardIcon sx={{ fontSize: 64, color: "#D1D5DB", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#6B7280", mb: 1 }}>
            No Awards Found
          </Typography>
          <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
            There are no active awards available at the moment.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ color: "#1F2937", fontWeight: 600, mb: 1 }}
        >
          Connect' 25 Awards
        </Typography>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          Browse awards by category and view all winners.
        </Typography>
      </Box>

      {/* Category Tabs */}
      <Paper
        sx={{
          mb: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #E5E7EB",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "#6B7280",
              py: 2,
            },
            "& .Mui-selected": {
              color: "#2196F3",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2196F3",
              height: 3,
            },
          }}
        >
          {categories.map((category, index) => (
            <Tab
              key={category.catagory_name}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AwardIcon sx={{ fontSize: "1.2rem" }} />
                  {category.catagory_name}
                  <Chip
                    label={category.winners.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      backgroundColor:
                        activeTab === index ? "#E3F2FD" : "#F3F4F6",
                      color: activeTab === index ? "#2196F3" : "#6B7280",
                    }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9CA3AF", fontSize: "1rem" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 200,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
              },
            }}
            size="small"
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              borderColor: "#E5E7EB",
              color: "#374151",
              "&:hover": {
                borderColor: "#2196F3",
                backgroundColor: "#F3F4F6",
              },
            }}
          >
            Filter by Award
            {selectedAwards.length > 0 && (
              <Chip
                label={selectedAwards.length}
                size="small"
                sx={{
                  ml: 1,
                  height: 20,
                  fontSize: "0.7rem",
                  backgroundColor: "#E3F2FD",
                  color: "#2196F3",
                }}
              />
            )}
          </Button>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                width: 320,
                maxHeight: 400,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#1F2937", mb: 1 }}
              >
                Filter by Award
              </Typography>
              <TextField
                placeholder="Search awards..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#9CA3AF", fontSize: "1rem" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <List sx={{ maxHeight: 250, overflow: "auto", p: 0 }}>
                {filteredAwardsForPopover.length > 0 ? (
                  filteredAwardsForPopover.map((award) => (
                    <ListItem key={award} sx={{ p: 0 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAwards.includes(award)}
                            onChange={() => handleAwardToggle(award)}
                            size="small"
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.85rem" }}
                          >
                            {award}
                          </Typography>
                        }
                        sx={{ width: "100%", m: 0 }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "#9CA3AF", textAlign: "center", py: 2 }}
                  >
                    No awards found
                  </Typography>
                )}
              </List>
              {selectedAwards.length > 0 && (
                <Button
                  fullWidth
                  size="small"
                  onClick={() => {
                    setSelectedAwards([]);
                    setPage(0);
                  }}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    color: "#6B7280",
                  }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Popover>
        </Box>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          Showing {paginatedWinners.length} of {filteredWinners.length} winners
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          mb: 2,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #D1D5DB",
              }}
            >
              {!isInstituteAward() && (
                <TableCell
                  sx={{ borderRight: "1px solid #E5E7EB", width: "20%" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Candidate Name
                  </Typography>
                </TableCell>
              )}
              <TableCell
                sx={{
                  borderRight: "1px solid #E5E7EB",
                  width: isInstituteAward() ? "35%" : "30%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Award Name
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  borderRight: "1px solid #E5E7EB",
                  width: isInstituteAward() ? "50%" : "35%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Institute Name
                </Typography>
              </TableCell>
              <TableCell sx={{ width: "15%" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  State
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedWinners.map((winner, index) => (
              <TableRow
                key={`${winner.award_name}-${winner.institute_name}-${index}`}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#F9FAFB" },
                  "& td": {
                    borderBottom:
                      index === paginatedWinners.length - 1
                        ? "none"
                        : "1px solid #E5E7EB",
                  },
                }}
              >
                {!isInstituteAward() && (
                  <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                    <Tooltip title={winner.candidate_name || "N/A"} arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          color: winner.candidate_name ? "#1F2937" : "#9CA3AF",
                          fontWeight: winner.candidate_name ? 500 : 400,
                          fontSize: "0.85rem",
                        }}
                      >
                        {truncateText(winner.candidate_name, 5) || "N/A"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Tooltip title={winner.award_name} arrow>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1F2937",
                        fontWeight: 500,
                        fontSize: "0.85rem",
                      }}
                    >
                      {truncateText(winner.award_name, 5)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Tooltip title={winner.institute_name || "-"} arrow>
                    <Typography
                      variant="body2"
                      sx={{ color: "#4B5563", fontSize: "0.85rem" }}
                    >
                      {truncateText(winner.institute_name, 5)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={winner.state_name || "-"} arrow>
                    <Typography
                      variant="body2"
                      sx={{ color: "#4B5563", fontSize: "0.85rem" }}
                    >
                      {truncateText(winner.state_name, 5)}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {paginatedWinners.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isInstituteAward() ? 3 : 4}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    No winners found matching your criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Paper
        sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: "12px" }}
      >
        <TablePagination
          component="div"
          count={filteredWinners.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#6B7280",
              },
          }}
        />
      </Paper>
    </Box>
  );
};

export default AwardsByCategory;
