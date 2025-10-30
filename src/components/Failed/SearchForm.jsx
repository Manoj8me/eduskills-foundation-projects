import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  Popover,
  Checkbox,
  Stack,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

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

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
  overflow: "hidden",
}));

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

const PopoverFormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  width: "300px",
}));

const SearchButton = styled(Button)(({ theme }) => ({
  height: "40px",
  minWidth: "auto",
  background: "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
  boxShadow: "0 4px 10px rgba(0, 136, 204, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 14px rgba(0, 136, 204, 0.4)",
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
  height: "36px",
  transition: "all 0.2s ease",
  marginTop: theme.spacing(1),
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
}));

const CheckboxIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const CheckboxCheckedIcon = <CheckBoxIcon fontSize="small" />;

const SearchForm = ({
  onSearch,
  filterOptions = { domains: [], cohorts: [], branches: [] },
}) => {
  // Multiple selection state for filters
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);

  // Popover state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    const searchParams = {};

    // Only add email if it has a value
    if (email) {
      searchParams.email = email;
    }

    // Add domain filters if any are selected
    if (selectedDomains.length > 0) {
      searchParams.domains = selectedDomains.map((domain) => domain.domain_id);
    }

    // Add cohort filters if any are selected
    if (selectedCohorts.length > 0) {
      searchParams.cohorts = selectedCohorts.map((cohort) => cohort.cohort_id);
    }

    // Add year filters if any are selected
    if (selectedYears.length > 0) {
      searchParams.years = selectedYears.map((year) => parseInt(year));
    }

    // Add branch filters if any are selected
    if (selectedBranches.length > 0) {
      searchParams.branches = selectedBranches.map(
        (branch) => branch.branch_name
      );
    }

    onSearch(searchParams);
    handleClose();
  };

  // Handle key press for email field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Get active filters count for badge
  const getActiveFiltersCount = () => {
    return (
      selectedDomains.length +
      selectedCohorts.length +
      selectedYears.length +
      selectedBranches.length
    );
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedDomains([]);
    setSelectedCohorts([]);
    setSelectedYears([]);
    setSelectedBranches([]);
  };

  // Determine the button text based on whether email is entered
  const getButtonContent = () => {
    if (email.trim()) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
          <SearchIcon sx={{ mr: 1 }} />
          <span style={{ display: "inline-block" }}>Search Email</span>
        </Box>
      );
    }
    return (
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
        <SearchIcon sx={{ mr: 1 }} />
        <span style={{ display: "inline-block" }}>Search All</span>
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 2,
            fontWeight: 600,
            fontSize: "1.1rem",
            background: "linear-gradient(45deg, #0088cc, #00a6ed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Failed Students
        </Typography>

        <MainContainer>
          <TextField
            label="Enter Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            fullWidth
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />

          <IconButton
            onClick={handleFilterClick}
            sx={{
              backgroundColor: "rgba(0, 136, 204, 0.1)",
              height: "40px",
              width: "40px",
              position: "relative",
            }}
          >
            <FilterListIcon color="primary" />
            {activeFiltersCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "#f44336",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {activeFiltersCount}
              </Box>
            )}
          </IconButton>

          <SearchButton
            variant="contained"
            size="small"
            onClick={handleSearch}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              minWidth: email.trim() ? "140px" : "120px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {getButtonContent()}
          </SearchButton>

          {/* Popover for filters */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <PopoverFormContainer>
              <Typography variant="subtitle2" fontWeight={600} color="primary">
                Filter Options
              </Typography>

              {/* Domain Multiple Selection */}
              <Autocomplete
                multiple
                id="domains"
                options={filterOptions.domains || []}
                disableCloseOnSelect
                value={selectedDomains}
                onChange={(event, newValue) => {
                  setSelectedDomains(newValue);
                }}
                getOptionLabel={(option) => option.domain_name}
                isOptionEqualToValue={(option, value) =>
                  option.domain_id === value.domain_id
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={CheckboxIcon}
                      checkedIcon={CheckboxCheckedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.domain_name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Domains"
                    placeholder="Select domains"
                    size="small"
                  />
                )}
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
              />

              {/* Cohort Multiple Selection */}
              <Autocomplete
                multiple
                id="cohorts"
                options={filterOptions.cohorts || []}
                disableCloseOnSelect
                value={selectedCohorts}
                onChange={(event, newValue) => {
                  setSelectedCohorts(newValue);
                }}
                getOptionLabel={(option) => option.cohort_name}
                isOptionEqualToValue={(option, value) =>
                  option.cohort_id === value.cohort_id
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={CheckboxIcon}
                      checkedIcon={CheckboxCheckedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.cohort_name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cohorts"
                    placeholder="Select cohorts"
                    size="small"
                  />
                )}
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
              />

              {/* Year Multiple Selection */}
              <Autocomplete
                multiple
                id="years"
                options={years}
                disableCloseOnSelect
                value={selectedYears}
                onChange={(event, newValue) => {
                  setSelectedYears(newValue);
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={CheckboxIcon}
                      checkedIcon={CheckboxCheckedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Passout Years"
                    placeholder="Select years"
                    size="small"
                  />
                )}
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
              />

              {/* Branch Multiple Selection */}
              <Autocomplete
                multiple
                id="branches"
                options={filterOptions.branches || []}
                disableCloseOnSelect
                value={selectedBranches}
                onChange={(event, newValue) => {
                  setSelectedBranches(newValue);
                }}
                getOptionLabel={(option) => option.branch_name}
                isOptionEqualToValue={(option, value) =>
                  option.branch_id === value.branch_id
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={CheckboxIcon}
                      checkedIcon={CheckboxCheckedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.branch_name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branches"
                    placeholder="Select branches"
                    size="small"
                  />
                )}
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <SearchButton
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  fullWidth
                >
                  {email.trim() ? "SEARCH EMAIL" : "SEARCH ALL"}
                </SearchButton>
              </Box>

              <Divider sx={{ my: 1 }} />

              <ResetButton
                variant="text"
                startIcon={<RestartAltIcon />}
                onClick={handleResetFilters}
                fullWidth
                size="small"
              >
                Reset Filters
              </ResetButton>
            </PopoverFormContainer>
          </Popover>
        </MainContainer>
      </StyledPaper>
    </motion.div>
  );
};

export default SearchForm;
