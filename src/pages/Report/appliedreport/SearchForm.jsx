import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Paper,
  Typography,
  IconButton,
  Popover,
  Checkbox,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Static data for years and statuses
const years = ["2020", "2021", "2022", "2023", "2024", "2025","2026","2027","2028","2029","2030"];
const statuses = ["Applied", "Approved", "Rejected", "Pending"];

// Checkbox icon for multiple select
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    "& > *": {
      marginBottom: theme.spacing(1),
    },
  },
}));

const FilterButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: theme.spacing(1.5),
  gap: theme.spacing(1),
}));

const PopoverFormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  width: "300px",
  maxHeight: "80vh",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    width: "260px",
  },
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
  height: "40px",
  background: "linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)",
  color: theme.palette.text.secondary,
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
  },
}));

const FilterButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "flex-end",
  },
}));

const SearchInputContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const SearchForm = ({
  onSearch,
  filterOptions = { domains: [], cohorts: [], branches: [] },
}) => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
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
    onSearch({
      domain_id:
        selectedDomains.length > 0
          ? selectedDomains.map((domain) => domain.domain_id)
          : 0,
      email,
      status,
      cohort_id:
        selectedCohorts.length > 0
          ? selectedCohorts.map((cohort) => cohort.cohort_id)
          : null,
      year: selectedYears.length > 0 ? selectedYears : null,
      branch:
        selectedBranches.length > 0
          ? selectedBranches.map((branch) => branch.branch_name)
          : null,
    });
    handleClose();
  };

  const resetFilters = () => {
    setSelectedDomains([]);
    setStatus("");
    setSelectedCohorts([]);
    setSelectedYears([]);
    setSelectedBranches([]);
  };

  // Handle key press for email field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Active filters count for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedDomains.length > 0) count++;
    if (status) count++;
    if (selectedCohorts.length > 0) count++;
    if (selectedYears.length > 0) count++;
    if (selectedBranches.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Determine the button text based on whether email is entered
  const getButtonContent = () => {
    if (email.trim()) {
      return (
        <>
          <SearchIcon sx={{ mr: 1 }} />
          Search Email
        </>
      );
    }
    return (
      <>
        <SearchIcon sx={{ mr: 1 }} />
        Search All
      </>
    );
  };

  // Always show text on the button
  const showButtonText = true;

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
          Internship Applied Students
        </Typography>

        <MainContainer>
          <SearchInputContainer>
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
          </SearchInputContainer>

          <FilterButtonGroup>
            <Tooltip title="Filters">
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
            </Tooltip>

            <SearchButton
              variant="contained"
              size="small"
              onClick={handleSearch}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                paddingLeft: showButtonText ? 2 : "10px",
                paddingRight: showButtonText ? 2 : "10px",
                minWidth: showButtonText ? "140px" : "40px",
              }}
            >
              {getButtonContent()}
            </SearchButton>
          </FilterButtonGroup>

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
            PaperProps={{
              sx: {
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <PopoverFormContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="primary"
                >
                  Filter Options
                </Typography>
                <Tooltip title="Reset Filters">
                  <IconButton
                    size="small"
                    onClick={resetFilters}
                    sx={{
                      color: "text.secondary",
                      transition: "all 0.3s ease",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <RestartAltIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Domain Autocomplete - Multiple */}
              <Autocomplete
                multiple
                disableCloseOnSelect
                value={selectedDomains}
                onChange={(event, newValue) => {
                  setSelectedDomains(newValue);
                }}
                options={filterOptions.domains || []}
                getOptionLabel={(option) => option.domain_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.domain_id === value.domain_id
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.domain_name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      size="small"
                      label={option.domain_name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                size="small"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Domains"
                    placeholder={selectedDomains.length ? "" : "Select domains"}
                  />
                )}
              />

              {/* Cohort Autocomplete - Multiple */}
              <Autocomplete
                multiple
                disableCloseOnSelect
                value={selectedCohorts}
                onChange={(event, newValue) => {
                  setSelectedCohorts(newValue);
                }}
                options={filterOptions.cohorts || []}
                getOptionLabel={(option) => option.cohort_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.cohort_id === value.cohort_id
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.cohort_name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      size="small"
                      label={option.cohort_name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                size="small"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cohorts"
                    placeholder={selectedCohorts.length ? "" : "Select cohorts"}
                  />
                )}
              />

              {/* Year Autocomplete - Multiple */}
              <Autocomplete
                multiple
                disableCloseOnSelect
                value={selectedYears}
                onChange={(event, newValue) => {
                  setSelectedYears(newValue);
                }}
                options={years}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      size="small"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                size="small"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Passout Years"
                    placeholder={selectedYears.length ? "" : "Select years"}
                  />
                )}
              />

              {/* Branch Autocomplete - Multiple */}
              <Autocomplete
                multiple
                disableCloseOnSelect
                value={selectedBranches}
                onChange={(event, newValue) => {
                  setSelectedBranches(newValue);
                }}
                options={filterOptions.branches || []}
                getOptionLabel={(option) => option.branch_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.branch_id === value.branch_id
                }
                renderOption={(props, option, { selected }) => (
                  <li
                    {...props}
                    key={`${option.branch_id}-${option.branch_name}`}
                  >
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.branch_name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      size="small"
                      label={option.branch_name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                size="small"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    minHeight: "40px",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branches"
                    placeholder={
                      selectedBranches.length ? "" : "Select branches"
                    }
                  />
                )}
              />

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <SearchButton
                  variant="contained"
                  onClick={handleSearch}
                  fullWidth
                  sx={{ justifyContent: "center" }}
                >
                  {email.trim() ? (
                    <>
                      <SearchIcon sx={{ mr: 1 }} />
                      SEARCH EMAIL
                    </>
                  ) : (
                    <>
                      <SearchIcon sx={{ mr: 1 }} />
                      SEARCH ALL
                    </>
                  )}
                </SearchButton>

                <Divider sx={{ my: 1 }} />

                <ResetButton
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={resetFilters}
                  fullWidth
                >
                  Reset Filters
                </ResetButton>
              </Box>
            </PopoverFormContainer>
          </Popover>
        </MainContainer>
      </StyledPaper>
    </motion.div>
  );
};

export default SearchForm;
