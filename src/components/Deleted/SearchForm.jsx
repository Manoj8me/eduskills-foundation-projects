import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment,
  alpha,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Checkbox icon for multiple select
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Styled components
const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  background: "#ffffff",
  overflow: "hidden",
  border: "1px solid rgba(0, 136, 204, 0.08)",
}));

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
  flexWrap: "wrap",
}));

// Updated FilterButton with material blue border
const FilterButton = styled(Button)(({ theme, active }) => ({
  height: "36px",
  minWidth: "90px",
  textTransform: "none",
  borderRadius: "20px",
  padding: "0 16px",
  fontSize: "0.875rem",
  fontWeight: 500,
  background: "#ffffff",
  color: active ? "#2196F3" : theme.palette.text.primary,
  border: active ? `1px solid #2196F3` : "1px solid rgba(0, 0, 0, 0.23)",
  boxShadow: "none",
  transition: "all 0.2s ease",
  position: "relative",
  "&:hover": {
    background: "#ffffff",
    borderColor: active ? "#1976D2" : "rgba(0, 0, 0, 0.42)",
    boxShadow: "none",
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  height: "36px",
  minWidth: "100px",
  borderRadius: "20px",
  background: "#2196F3",
  boxShadow: "0 2px 8px rgba(0, 136, 204, 0.2)",
  transition: "all 0.2s ease",
  fontWeight: 600,
  "&:hover": {
    background: "#1976D2",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0, 136, 204, 0.3)",
  },
}));

const PopoverPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  width: "320px",
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  maxHeight: "350px",
  display: "flex",
  flexDirection: "column",
}));

const FilterList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  maxHeight: "220px",
  padding: 0,
  margin: theme.spacing(1, 0),
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
    },
  },
}));

// Updated badge to be displayed next to the filter label
const FilterCountBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "20px",
  height: "20px",
  padding: "0 6px",
  backgroundColor: "#2196F3",
  color: "#ffffff",
  borderRadius: "10px",
  fontSize: "0.75rem",
  fontWeight: 600,
  marginLeft: "6px",
}));

// Function to normalize branch names for display
const normalizeBranchName = (branch) => {
  if (!branch) return "";

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

const SearchForm = ({ onSearch, filterOptions = {} }) => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [email, setEmail] = useState("");

  // Popover states
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  // Refs for filter buttons
  const filterRefs = {
    years: useRef(null),
    branches: useRef(null),
  };

  const handleFilterClick = (filterType) => {
    // If clicking on the same filter that's already open, close it
    if (currentFilter === filterType && Boolean(anchorEl)) {
      handlePopoverClose();
      return;
    }

    // If a different filter is open, switch directly to the new one without closing first
    setCurrentFilter(filterType);
    setAnchorEl(filterRefs[filterType].current);
    setFilterSearch("");
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentFilter("");
    setFilterSearch("");
  };

  const handleSearch = () => {
    onSearch({
      email,
      year: selectedYears.length > 0 ? selectedYears : null,
      branch: selectedBranches.length > 0 ? selectedBranches : null,
    });
  };

  const resetFilters = () => {
    setSelectedYears([]);
    setSelectedBranches([]);
    setEmail("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedYears.length > 0) count++;
    if (selectedBranches.length > 0) count++;
    return count;
  };

  const toggleSelection = (type, item) => {
    if (!item) return;

    switch (type) {
      case "years":
        if (selectedYears.includes(item)) {
          setSelectedYears(selectedYears.filter((year) => year !== item));
        } else {
          setSelectedYears([...selectedYears, item]);
        }
        break;

      case "branches":
        if (selectedBranches.includes(item)) {
          setSelectedBranches(
            selectedBranches.filter((branch) => branch !== item)
          );
        } else {
          setSelectedBranches([...selectedBranches, item]);
        }
        break;

      default:
        break;
    }
  };

  const isItemSelected = (type, item) => {
    if (!item) return false;

    switch (type) {
      case "years":
        return selectedYears.includes(item);
      case "branches":
        return selectedBranches.includes(item);
      default:
        return false;
    }
  };

  const getFilteredItems = (type) => {
    let items = [];

    if (filterOptions && filterOptions.filterData) {
      const filterData = filterOptions.filterData.find(
        (filter) => filter.id === type
      );
      if (filterData && Array.isArray(filterData.options)) {
        items = filterData.options;
      }
    }

    if (!filterSearch) return items;

    return items.filter((item) => {
      if (!item) return false;
      return String(item).toLowerCase().includes(filterSearch.toLowerCase());
    });
  };

  const renderPopoverContent = () => {
    let title = "";

    switch (currentFilter) {
      case "years":
        title = "Select Years";
        break;
      case "branches":
        title = "Select Branches";
        break;
      default:
        return null;
    }

    return (
      <PopoverPaper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="#2196F3">
            {title}
          </Typography>
          <IconButton size="small" onClick={handlePopoverClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <TextField
          placeholder={`Search ${title.toLowerCase()}`}
          variant="outlined"
          size="small"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: alpha("#000", 0.02),
              borderRadius: 1,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          sx={{ mb: 1 }}
        />

        <FilterList>
          {getFilteredItems(currentFilter).map((item, index) => {
            if (!item) return null;

            const displayName =
              currentFilter === "branches"
                ? normalizeBranchName(item)
                : String(item);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * (index % 10), duration: 0.15 }}
              >
                <ListItem
                  button
                  onClick={() => toggleSelection(currentFilter, item)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    bgcolor: isItemSelected(currentFilter, item)
                      ? alpha("#2196F3", 0.08)
                      : "transparent",
                    "&:hover": {
                      bgcolor: isItemSelected(currentFilter, item)
                        ? alpha("#2196F3", 0.12)
                        : alpha("#000", 0.04),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={isItemSelected(currentFilter, item)}
                      icon={icon}
                      checkedIcon={checkedIcon}
                      size="small"
                      sx={{
                        "&.Mui-checked": {
                          color: "#2196F3",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={displayName}
                    secondary={
                      currentFilter === "branches" && displayName !== item
                        ? item
                        : null
                    }
                  />
                </ListItem>
              </motion.div>
            );
          })}
        </FilterList>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            size="small"
            onClick={() => {
              switch (currentFilter) {
                case "years":
                  setSelectedYears([]);
                  break;
                case "branches":
                  setSelectedBranches([]);
                  break;
                default:
                  break;
              }
            }}
            sx={{ color: "text.secondary" }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handlePopoverClose}
            sx={{
              borderRadius: "16px",
              bgcolor: "#2196F3",
              "&:hover": { bgcolor: "#1976D2" },
            }}
          >
            {currentFilter === "branches" && selectedBranches.length > 0
              ? `Apply (${selectedBranches.length})`
              : currentFilter === "years" && selectedYears.length > 0
              ? `Apply (${selectedYears.length})`
              : "Apply"}
          </Button>
        </Box>
      </PopoverPaper>
    );
  };

  // Render filter label with count
  const renderFilterLabel = (label, count) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {label}
        {count > 0 && <FilterCountBadge>{count}</FilterCountBadge>}
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <StyledPaper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#2196F3",
            }}
          >
           Restore Students
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Tooltip title="Reset all filters">
              <IconButton
                size="small"
                onClick={resetFilters}
                sx={{
                  color: "#666",
                  backgroundColor: alpha("#000", 0.03),
                  "&:hover": {
                    backgroundColor: alpha("#000", 0.06),
                  },
                }}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <MainContainer>
          <TextField
            placeholder="Search by email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            InputProps={{
              sx: {
                height: "36px",
                borderRadius: "20px",
                backgroundColor: alpha("#000", 0.02),
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.2)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2196F3",
                },
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: "text.secondary", fontSize: "1.2rem" }}
                  />
                </InputAdornment>
              ),
              endAdornment: email && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setEmail("")}
                    edge="end"
                    sx={{ mr: -0.5 }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 240 } }}
          />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <FilterButton
              ref={filterRefs.years}
              active={selectedYears.length > 0}
              onClick={() => handleFilterClick("years")}
              endIcon={
                <ArrowDropDownIcon sx={{ fontSize: "1.2rem", ml: -0.5 }} />
              }
            >
              {renderFilterLabel("Years", selectedYears.length)}
            </FilterButton>

            <FilterButton
              ref={filterRefs.branches}
              active={selectedBranches.length > 0}
              onClick={() => handleFilterClick("branches")}
              endIcon={
                <ArrowDropDownIcon sx={{ fontSize: "1.2rem", ml: -0.5 }} />
              }
            >
              {renderFilterLabel("Branches", selectedBranches.length)}
            </FilterButton>

            <SearchButton
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon sx={{ fontSize: "1.1rem" }} />}
            >
              Search
            </SearchButton>
          </Box>
        </MainContainer>

        {/* Using Material UI Popover instead of Popper for reliable positioning */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            style: { boxShadow: "none", backgroundColor: "transparent" },
          }}
          sx={{
            "& .MuiPaper-root": {
              overflow: "visible",
              mt: 0.7,
            },
          }}
        >
          <motion.div
            key={currentFilter}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {renderPopoverContent()}
          </motion.div>
        </Popover>
      </StyledPaper>
    </motion.div>
  );
};

export default SearchForm;
