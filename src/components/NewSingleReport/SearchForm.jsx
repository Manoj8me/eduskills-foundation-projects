import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment,
  alpha,
  Popper,
  Paper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

// Static data for years
const years = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
];

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

const FilterButton = styled(Button)(({ theme, active }) => ({
  height: "36px",
  minWidth: "90px",
  textTransform: "none",
  borderRadius: "20px",
  padding: "0 16px",
  fontSize: "0.875rem",
  fontWeight: 500,
  background: active
    ? theme.palette.primary.main
    : alpha(theme.palette.primary.main, 0.08),
  color: active ? "#fff" : theme.palette.primary.main,
  boxShadow: active ? "0 2px 8px rgba(0, 136, 204, 0.2)" : "none",
  transition: "all 0.2s ease",
  position: "relative",
  "&:hover": {
    background: active
      ? theme.palette.primary.dark
      : alpha(theme.palette.primary.main, 0.12),
    boxShadow: active ? "0 4px 12px rgba(0, 136, 204, 0.3)" : "none",
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  height: "36px",
  minWidth: "100px",
  borderRadius: "20px",
  background: theme.palette.primary.main,
  boxShadow: "0 2px 8px rgba(0, 136, 204, 0.2)",
  transition: "all 0.2s ease",
  fontWeight: 600,
  "&:hover": {
    background: theme.palette.primary.dark,
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0, 136, 204, 0.3)",
  },
}));

const PopoverPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  width: "280px",
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  maxHeight: "350px",
  display: "flex",
  flexDirection: "column",
}));

const FilterList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  maxHeight: "200px",
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

const ActiveFilterBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "-6px",
  right: "-6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "18px",
  height: "18px",
  padding: "0 4px",
  backgroundColor: theme.palette.error.main,
  color: "#ffffff",
  borderRadius: "10px",
  fontSize: "0.7rem",
  fontWeight: 600,
  border: "2px solid #ffffff",
}));

const SearchForm = ({
  onSearch,
  filterOptions = { domains: [], branches: [] },
}) => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);

  // Popover states
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  // Refs for filter buttons
  const filterRefs = {
    domains: useRef(null),
    years: useRef(null),
    branches: useRef(null),
  };

  const handleFilterClick = (filterType) => {
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
      domain_id:
        selectedDomains.length > 0
          ? selectedDomains.map((domain) => domain.domain_id)
          : 0,
      email,
      year: selectedYears.length > 0 ? selectedYears : null,
      branch:
        selectedBranches.length > 0
          ? selectedBranches.map((branch) => branch.branch_name)
          : null,
    });
  };

  const resetFilters = () => {
    setSelectedDomains([]);
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
    if (selectedDomains.length > 0) count++;
    if (selectedYears.length > 0) count++;
    if (selectedBranches.length > 0) count++;
    return count;
  };

  const toggleSelection = (type, item) => {
    switch (type) {
      case "domains":
        const domainExists = selectedDomains.some(
          (domain) => domain.domain_id === item.domain_id
        );
        if (domainExists) {
          setSelectedDomains(
            selectedDomains.filter(
              (domain) => domain.domain_id !== item.domain_id
            )
          );
        } else {
          setSelectedDomains([...selectedDomains, item]);
        }
        break;
      case "years":
        if (selectedYears.includes(item)) {
          setSelectedYears(selectedYears.filter((year) => year !== item));
        } else {
          setSelectedYears([...selectedYears, item]);
        }
        break;
      case "branches":
        const branchExists = selectedBranches.some(
          (branch) => branch.branch_id === item.branch_id
        );
        if (branchExists) {
          setSelectedBranches(
            selectedBranches.filter(
              (branch) => branch.branch_id !== item.branch_id
            )
          );
        } else {
          setSelectedBranches([...selectedBranches, item]);
        }
        break;
    }
  };

  const isItemSelected = (type, item) => {
    switch (type) {
      case "domains":
        return selectedDomains.some(
          (domain) => domain.domain_id === item.domain_id
        );
      case "years":
        return selectedYears.includes(item);
      case "branches":
        return selectedBranches.some(
          (branch) => branch.branch_id === item.branch_id
        );
      default:
        return false;
    }
  };

  const getFilteredItems = (type) => {
    let items = [];
    let searchField = "";

    switch (type) {
      case "domains":
        items = filterOptions.domains || [];
        searchField = "domain_name";
        break;
      case "years":
        items = years;
        break;
      case "branches":
        items = filterOptions.branches || [];
        searchField = "branch_name";
        break;
    }

    if (!filterSearch) return items;

    return items.filter((item) => {
      if (typeof item === "string") {
        return item.toLowerCase().includes(filterSearch.toLowerCase());
      }
      return item[searchField]
        .toLowerCase()
        .includes(filterSearch.toLowerCase());
    });
  };

  const renderPopoverContent = () => {
    let title = "";
    let itemType = currentFilter;

    switch (currentFilter) {
      case "domains":
        title = "Select Domains";
        break;
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
          <Typography variant="subtitle1" fontWeight={600} color="primary">
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
            // startAdornment: (
            //   <InputAdornment position="start">
            //     <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
            //   </InputAdornment>
            // ),
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
          {getFilteredItems(itemType).map((item, index) => {
            let itemId, itemName;

            if (typeof item === "string") {
              itemId = item;
              itemName = item;
            } else {
              switch (itemType) {
                case "domains":
                  itemId = item.domain_id;
                  itemName = item.domain_name;
                  break;
                case "branches":
                  itemId = item.branch_id;
                  itemName = item.branch_name;
                  break;
                default:
                  itemId = index;
                  itemName = "";
              }
            }

            return (
              <ListItem
                button
                key={itemId || index}
                onClick={() => toggleSelection(itemType, item)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: isItemSelected(itemType, item)
                    ? alpha("#0288D1", 0.08)
                    : "transparent",
                  "&:hover": {
                    bgcolor: isItemSelected(itemType, item)
                      ? alpha("#0288D1", 0.12)
                      : alpha("#000", 0.04),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox
                    edge="start"
                    checked={isItemSelected(itemType, item)}
                    icon={icon}
                    checkedIcon={checkedIcon}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText primary={itemName} />
              </ListItem>
            );
          })}
        </FilterList>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            size="small"
            onClick={() => {
              switch (itemType) {
                case "domains":
                  setSelectedDomains([]);
                  break;
                case "years":
                  setSelectedYears([]);
                  break;
                case "branches":
                  setSelectedBranches([]);
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
            sx={{ borderRadius: "16px" }}
          >
            Apply
          </Button>
        </Box>
      </PopoverPaper>
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
              color: "#0288D1",
            }}
          >
            Single Report
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
                  borderColor: "#0288D1",
                },
              },
              // startAdornment: (
              //   <InputAdornment position="start">
              //     <SearchIcon
              //       sx={{ color: "text.secondary", fontSize: "1.2rem" }}
              //     />
              //   </InputAdornment>
              // ),
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
            {/* <FilterButton
              ref={filterRefs.domains}
              active={selectedDomains.length > 0}
              onClick={() => handleFilterClick("domains")}
              endIcon={
                <ArrowDropDownIcon sx={{ fontSize: "1.2rem", ml: -0.5 }} />
              }
            >
              Domains
              {selectedDomains.length > 0 && (
                <ActiveFilterBadge>{selectedDomains.length}</ActiveFilterBadge>
              )}
            </FilterButton> */}

            {/* <FilterButton
              ref={filterRefs.years}
              active={selectedYears.length > 0}
              onClick={() => handleFilterClick("years")}
              endIcon={
                <ArrowDropDownIcon sx={{ fontSize: "1.2rem", ml: -0.5 }} />
              }
            >
              Years
              {selectedYears.length > 0 && (
                <ActiveFilterBadge>{selectedYears.length}</ActiveFilterBadge>
              )}
            </FilterButton> */}

            {/* <FilterButton
              ref={filterRefs.branches}
              active={selectedBranches.length > 0}
              onClick={() => handleFilterClick("branches")}
              endIcon={
                <ArrowDropDownIcon sx={{ fontSize: "1.2rem", ml: -0.5 }} />
              }
            >
              Branches
              {selectedBranches.length > 0 && (
                <ActiveFilterBadge>{selectedBranches.length}</ActiveFilterBadge>
              )}
            </FilterButton> */}

            <SearchButton
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon sx={{ fontSize: "1.1rem" }} />}
            >
              Search
            </SearchButton>
          </Box>
        </MainContainer>

        {/* Popover */}
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["top-start", "right-start", "left-start"],
              },
            },
          ]}
          style={{ zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={handlePopoverClose}>
            <div>{renderPopoverContent()}</div>
          </ClickAwayListener>
        </Popper>
      </StyledPaper>
    </motion.div>
  );
};

export default SearchForm;
