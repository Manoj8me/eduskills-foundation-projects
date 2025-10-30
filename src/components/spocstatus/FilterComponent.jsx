import React, { useState } from "react";
import {
  IconButton,
  Popover,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  Button,
  Chip,
  Divider,
  Grid,
  Fade,
  Paper,
  OutlinedInput,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";

// Material UI Multi-Select Filter Component
const MaterialUIMultiSelectFilter = ({ onApplyFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    cohort: [],
    domain: [],
    branch: [],
    year: [],
    status: [],
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Sample data for dropdowns
  const cohorts = ["2022", "2023", "2024", "2025"];
  const domains = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "AI/ML",
    "DevOps",
    "Cybersecurity",
  ];
  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
  ];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const statuses = [
    "Pending",
    "Completed",
    "Started",
    "Not Applied",
    "Rejected",
    "Approved",
    "Issued",
    "Not Issued",
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    // Create array of active filters for display
    const newActiveFilters = [];

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        // For each filter type that has values selected, add it to active filters
        if (values.length === 1) {
          // If only one value is selected, show it directly
          newActiveFilters.push({ key, value: values[0], count: 1 });
        } else {
          // If multiple values are selected, show a count
          newActiveFilters.push({
            key,
            value: `${values.length} selected`,
            count: values.length,
          });
        }
      }
    });

    setActiveFilters(newActiveFilters);

    // Call parent component's filter handler
    if (onApplyFilters) {
      onApplyFilters(filters);
    }

    handleClose();
  };

  const handleClearFilters = () => {
    setFilters({
      cohort: [],
      domain: [],
      branch: [],
      year: [],
      status: [],
    });
    setActiveFilters([]);

    if (onApplyFilters) {
      onApplyFilters({
        cohort: [],
        domain: [],
        branch: [],
        year: [],
        status: [],
      });
    }
  };

  const handleRemoveFilter = (filterKey) => {
    setFilters({
      ...filters,
      [filterKey]: [],
    });

    setActiveFilters(
      activeFilters.filter((filter) => filter.key !== filterKey)
    );

    if (onApplyFilters) {
      onApplyFilters({
        ...filters,
        [filterKey]: [],
      });
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  // Get display name for filter values
  const getFilterLabel = (key, value, count) => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return count > 1
      ? `${capitalize(key)}: ${count} selected`
      : `${capitalize(key)}: ${value}`;
  };

  // Menu props for dropdown height
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
    // This ensures the menu stays open when clicking options
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
    variant: "menu",
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          aria-label="filter"
          aria-describedby={id}
          onClick={handleClick}
          color={activeFilters.length > 0 ? "primary" : "default"}
          sx={{
            borderRadius: 1,
            border: "1px solid",
            borderColor: activeFilters.length > 0 ? "primary.main" : "divider",
            backgroundColor:
              activeFilters.length > 0 ? "primary.lighter" : "background.paper",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor:
                activeFilters.length > 0 ? "primary.light" : "action.hover",
            },
          }}
        >
          <FilterListIcon />
        </IconButton>

        {activeFilters.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={getFilterLabel(filter.key, filter.value, filter.count)}
                onDelete={() => handleRemoveFilter(filter.key)}
                size="small"
                color="primary"
                variant="outlined"
                deleteIcon={<ClearIcon fontSize="small" />}
                sx={{
                  animation: "expandWidth 0.3s ease-out forwards",
                  maxWidth: { xs: "150px", sm: "none" },
                }}
              />
            ))}

            {activeFilters.length > 0 && (
              <Chip
                label="Clear All"
                onClick={handleClearFilters}
                size="small"
                color="error"
                variant="outlined"
                sx={{ animation: "expandWidth 0.3s ease-out forwards" }}
              />
            )}
          </Box>
        )}
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            borderRadius: 2,
            width: { xs: 300, sm: 550 },
            overflow: "hidden",
            animation: "fadeIn 0.3s ease-out",
          },
        }}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        <Paper sx={{ maxHeight: "90vh", overflow: "auto" }}>
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.main",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              <FilterAltIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Filter Students
            </Typography>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: "white" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="cohort-label">Cohort</InputLabel>
                  <Select
                    labelId="cohort-label"
                    id="cohort"
                    name="cohort"
                    multiple
                    value={filters.cohort}
                    onChange={handleFilterChange}
                    input={<OutlinedInput label="Cohort" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? (
                        <em>Any</em>
                      ) : selected.length === 1 ? (
                        selected[0]
                      ) : (
                        `${selected.length} selected`
                      )
                    }
                    MenuProps={MenuProps}
                  >
                    {cohorts.map((cohort) => (
                      <MenuItem key={cohort} value={cohort}>
                        <Checkbox
                          checked={filters.cohort.indexOf(cohort) > -1}
                        />
                        <ListItemText primary={cohort} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="domain-label">Domain</InputLabel>
                  <Select
                    labelId="domain-label"
                    id="domain"
                    name="domain"
                    multiple
                    value={filters.domain}
                    onChange={handleFilterChange}
                    input={<OutlinedInput label="Domain" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? (
                        <em>Any</em>
                      ) : selected.length === 1 ? (
                        selected[0]
                      ) : (
                        `${selected.length} selected`
                      )
                    }
                    MenuProps={MenuProps}
                  >
                    {domains.map((domain) => (
                      <MenuItem key={domain} value={domain}>
                        <Checkbox
                          checked={filters.domain.indexOf(domain) > -1}
                        />
                        <ListItemText primary={domain} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="branch-label">Branch</InputLabel>
                  <Select
                    labelId="branch-label"
                    id="branch"
                    name="branch"
                    multiple
                    value={filters.branch}
                    onChange={handleFilterChange}
                    input={<OutlinedInput label="Branch" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? (
                        <em>Any</em>
                      ) : selected.length === 1 ? (
                        selected[0]
                      ) : (
                        `${selected.length} selected`
                      )
                    }
                    MenuProps={MenuProps}
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        <Checkbox
                          checked={filters.branch.indexOf(branch) > -1}
                        />
                        <ListItemText primary={branch} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    name="year"
                    multiple
                    value={filters.year}
                    onChange={handleFilterChange}
                    input={<OutlinedInput label="Year" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? (
                        <em>Any</em>
                      ) : selected.length === 1 ? (
                        selected[0]
                      ) : (
                        `${selected.length} selected`
                      )
                    }
                    MenuProps={MenuProps}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        <Checkbox checked={filters.year.indexOf(year) > -1} />
                        <ListItemText primary={year} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    multiple
                    value={filters.status}
                    onChange={handleFilterChange}
                    input={<OutlinedInput label="Status" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? (
                        <em>Any</em>
                      ) : selected.length === 1 ? (
                        selected[0]
                      ) : (
                        `${selected.length} selected`
                      )
                    }
                    MenuProps={MenuProps}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        <Checkbox
                          checked={filters.status.indexOf(status) > -1}
                        />
                        <ListItemText primary={status} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              size="small"
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              startIcon={<SearchIcon />}
              size="small"
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

export default MaterialUIMultiSelectFilter;
