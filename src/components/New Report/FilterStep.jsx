import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Chip,
  Autocomplete,
  Checkbox,
  InputBase,
  IconButton,
  alpha,
  styled,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";

// Styled components
const SectionTitle = styled(Typography)({
  fontSize: "0.8rem",
  fontWeight: 600,
  marginBottom: 12,
  textTransform: "uppercase",
  color: "text.secondary",
});

const FilterSection = styled(Paper)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  border: `1px solid ${theme.palette.divider}`,
  height: "100%",
}));

const SearchInput = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.85),
  border: "1px solid",
  borderColor: theme.palette.divider,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.95),
  },
  marginBottom: 12,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    width: "100%",
    fontSize: "0.875rem",
  },
}));

const FilterCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  marginBottom: 12,
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: 2,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  borderRadius: 4,
  height: 24,
  fontSize: "0.75rem",
  fontWeight: 500,
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Sample filter data
const filterData = [
  {
    id: "branch",
    name: "Branch",
    options: [
      "AI/ML",
      "Web Development",
      "Mobile Development",
      "DevOps",
      "Cybersecurity",
      "Data Science",
      "IoT",
      "Cloud Computing",
    ],
  },
  {
    id: "passoutYear",
    name: "Passout Year",
    options: ["2024", "2025", "2026", "2027", "2028"],
  },
  {
    id: "gender",
    name: "Gender",
    options: ["Male", "Female", "Other"],
  },
  {
    id: "program",
    name: "Program",
    options: ["B.Tech", "M.Tech", "PhD", "BCA", "MCA"],
  },
  {
    id: "semester",
    name: "Semester",
    options: ["1", "2", "3", "4", "5", "6", "7", "8"],
  },
  {
    id: "cohort",
    name: "Cohort",
    options: ["Cohort 10", "Cohort 11", "Cohort 12"],
  },
  {
    id: "domain",
    name: "Domain",
    options: [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
    ],
  },
  // {
  //   id: "status",
  //   name: "Status",
  //   options: ["Active", "Inactive", "Alumni", "On Leave"],
  // },
];

const SimplifiedFilterStep = ({
  filterCriteria,
  setFilterCriteria,
  reportName,
  setReportName,
  showValidationErrors,
}) => {
  const [filterSearchQuery, setFilterSearchQuery] = useState("");

  // Filter the filters based on search query
  const filteredFilters = filterData.filter(
    (filter) =>
      filter.name.toLowerCase().includes(filterSearchQuery.toLowerCase()) ||
      filter.options.some((option) =>
        option.toLowerCase().includes(filterSearchQuery.toLowerCase())
      )
  );

  // Check if at least one filter is selected
  const hasAnyFilter = Object.values(filterCriteria).some(
    (filters) => filters && filters.length > 0
  );

  // Modified options with "All" option prepended
  const getOptionsWithAll = (options) => {
    return ["All", ...options];
  };

  // Handle filter toggle
  const handleToggleFilter = (filterId, value) => {
    // If "All" is selected, select all options
    if (value.includes("All")) {
      // Get the original options for this filter
      const filterOptions = filterData.find((f) => f.id === filterId).options;

      // If all options are already selected, clear them
      if (value.length > filterOptions.length) {
        setFilterCriteria((prev) => ({
          ...prev,
          [filterId]: [],
        }));
      } else {
        // Otherwise select all options
        setFilterCriteria((prev) => ({
          ...prev,
          [filterId]: [...filterOptions],
        }));
      }
    } else {
      setFilterCriteria((prev) => ({
        ...prev,
        [filterId]: value,
      }));
    }
  };

  // Render selected filters summary
  const renderSelectedFiltersSummary = () => {
    const activeFilters = Object.entries(filterCriteria)
      .filter(([filterId, filters]) => filters && filters.length > 0)
      .map(([filterId, filters]) => {
        const filter = filterData.find((f) => f.id === filterId);
        return {
          filterId,
          filterName: filter ? filter.name : filterId,
          filters,
        };
      });

    if (activeFilters.length === 0) {
      return (
        <Box sx={{ mt: 3, textAlign: "center", color: "text.secondary", p: 2 }}>
          <TuneIcon sx={{ fontSize: 40, opacity: 0.5, mb: 2 }} />
          <Typography variant="body2">
            No filters selected. Use the filters above to customize your report.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Selected Filters
        </Typography>
        <Grid container spacing={2}>
          {activeFilters.map(({ filterId, filterName, filters }) => (
            <Grid item xs={12} sm={6} md={4} key={filterId}>
              <FilterCard variant="outlined">
                <CardContent
                  sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}
                >
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    {filterName}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxHeight: filters.length > 4 ? 120 : "auto",
                      overflowY: "auto",
                    }}
                  >
                    {filters.map((filter) => (
                      <FilterChip
                        key={`${filterId}-${filter}`}
                        label={filter}
                        onDelete={() => {
                          const updatedFilters = filterCriteria[
                            filterId
                          ].filter((f) => f !== filter);
                          handleToggleFilter(
                            filterId,
                            updatedFilters.length ? updatedFilters : []
                          );
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                </CardContent>
              </FilterCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      {/* Report Name Section */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Report Name *"
          variant="outlined"
          size="small"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="Enter a descriptive name for your report"
          required
          error={showValidationErrors && !reportName.trim()}
          helperText={
            showValidationErrors && !reportName.trim()
              ? "Report name is required"
              : ""
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              fontSize: "0.875rem",
            },
          }}
        />
      </Box>

      {/* Main layout - Filters */}
      <FilterSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SectionTitle>Configure Filters</SectionTitle>
          {showValidationErrors && !hasAnyFilter && (
            <Typography
              variant="body2"
              color="error"
              sx={{ fontSize: "0.75rem", fontWeight: 500 }}
            >
              * At least one filter required
            </Typography>
          )}
        </Box>
        <Divider sx={{ mt: -1, mb: 2 }} />

        {/* Filter search input */}
        <SearchInput sx={{ mb: 3 }}>
          <SearchIconWrapper>
            <SearchIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search filters"
            value={filterSearchQuery}
            onChange={(e) => setFilterSearchQuery(e.target.value)}
          />
        </SearchInput>

        <Grid container spacing={2}>
          {filteredFilters.map((filter) => (
            <Grid item xs={12} sm={6} md={4} key={filter.id}>
              <Autocomplete
                multiple
                id={filter.id}
                options={getOptionsWithAll(filter.options)}
                value={filterCriteria[filter.id] || []}
                onChange={(e, newValue) =>
                  handleToggleFilter(filter.id, newValue)
                }
                disableCloseOnSelect
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={filter.name}
                    variant="outlined"
                    size="small"
                    placeholder={`Select ${filter.name}`}
                    required={showValidationErrors && !hasAnyFilter}
                    error={showValidationErrors && !hasAnyFilter}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.length > 2 ? (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {value.length} selected
                    </Typography>
                  ) : (
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        size="small"
                        {...getTagProps({ index })}
                        sx={{
                          borderRadius: "4px",
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))
                  )
                }
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Selected Filters Summary */}
        {renderSelectedFiltersSummary()}
      </FilterSection>
    </Box>
  );
};

export default SimplifiedFilterStep;
