import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Chip,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  InputBase,
  IconButton,
  alpha,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  Collapse,
  FormGroup,
  FormControlLabel,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { blue } from "@mui/material/colors";

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

const ColumnCheckboxItem = styled(ListItemButton)(({ theme, active }) => ({
  padding: "8px 12px",
  borderRadius: "6px",
  marginBottom: "4px",
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.1)
    : "transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  borderLeft: active
    ? `3px solid ${theme.palette.primary.main}`
    : "3px solid transparent",
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

// Sample column data
const columnData = [
  {
    id: "name",
    name: "Name",
    category: "Student",
    required: true,
    filters: [],
  },
  {
    id: "email",
    name: "Email",
    category: "Student",
    required: true,
    filters: [],
  },
  {
    id: "branch",
    name: "Branch",
    category: "Student",
    filters: [
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
    category: "Student",
    filters: ["2024", "2025", "2026", "2027", "2028"],
  },
  {
    id: "gender",
    name: "Gender",
    category: "Student",
    filters: ["Male", "Female", "Other"],
  },
  {
    id: "rollNo",
    name: "Roll No",
    category: "Student",
    filters: [],
  },
  {
    id: "program",
    name: "Program",
    category: "Student",
    filters: ["B.Tech", "M.Tech", "PhD", "BCA", "MCA"],
  },
  {
    id: "semester",
    name: "Semester",
    category: "Student",
    filters: ["1", "2", "3", "4", "5", "6", "7", "8"],
  },
  {
    id: "cohort",
    name: "Cohort",
    category: "Internship",
    filters: ["Cohort 10", "Cohort 11", "Cohort 12"],
  },
  {
    id: "domain",
    name: "Domain",
    category: "Internship",
    filters: [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
    ],
  },
  {
    id: "status",
    name: "Status",
    category: "Internship",
    filters: ["Active", "Inactive", "Alumni", "On Leave"],
  },
];

const CombinedFilterColumnStep = ({
  filterCriteria,
  setFilterCriteria,
  reportName,
  setReportName,
}) => {
  // State for column selection and filter selection
  const [selectedColumns, setSelectedColumns] = useState(["name", "email"]);

  const [activeColumn, setActiveColumn] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [columnSearchQuery, setColumnSearchQuery] = useState("");
  const [filterSearchQuery, setFilterSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    Student: true,
    Internship: true,
  });

  // Group columns by category
  const groupedColumns = columnData.reduce((acc, column) => {
    if (!acc[column.category]) {
      acc[column.category] = [];
    }
    acc[column.category].push(column);
    return acc;
  }, {});

  // Handle category expansion toggle
  const handleToggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    });
  };

  // Handle column checkbox toggle
  const handleToggleColumn = (columnId) => {
    // If it's a required column, don't allow deselection
    const column = columnData.find((col) => col.id === columnId);
    if (column?.required && selectedColumns.includes(columnId)) {
      setAlertMessage(
        `${column.name} is a required column and cannot be removed.`
      );
      setAlertOpen(true);
      return;
    }

    setSelectedColumns((prev) => {
      if (prev.includes(columnId)) {
        // When deselecting a column, also clear its filters
        setFilterCriteria((prevFilters) => {
          const newFilters = { ...prevFilters };
          delete newFilters[columnId];
          return newFilters;
        });
        return prev.filter((id) => id !== columnId);
      } else {
        const newSelected = [...prev, columnId];

        // Automatically set this column as active if it has filters
        const column = columnData.find((col) => col.id === columnId);
        if (column?.filters && column.filters.length > 0) {
          setActiveColumn(columnId);
        }

        return newSelected;
      }
    });

    // If deselecting the active column, clear the active column
    if (activeColumn === columnId && selectedColumns.includes(columnId)) {
      setActiveColumn(null);
    }
  };

  // Handle column selection for filter display
  const handleSelectColumnForFilters = (columnId) => {
    setActiveColumn(columnId === activeColumn ? null : columnId);
    // Reset filter search when changing columns
    setFilterSearchQuery("");
  };

  // Handle filter toggle
  const handleToggleFilter = (columnId, filter) => {
    setFilterCriteria((prev) => {
      const currentFilters = prev[columnId] || [];
      const newFilters = currentFilters.includes(filter)
        ? currentFilters.filter((f) => f !== filter)
        : [...currentFilters, filter];

      return {
        ...prev,
        [columnId]: newFilters,
      };
    });
  };

  // Clear all filters for a column
  const handleClearColumnFilters = (columnId) => {
    setFilterCriteria((prev) => ({
      ...prev,
      [columnId]: [],
    }));
  };

  // Filter columns by search query
  const filteredColumnData = columnData.filter(
    (column) =>
      column.name.toLowerCase().includes(columnSearchQuery.toLowerCase()) ||
      column.category.toLowerCase().includes(columnSearchQuery.toLowerCase())
  );

  // Group filtered columns by category
  const filteredGroupedColumns = filteredColumnData.reduce((acc, column) => {
    if (!acc[column.category]) {
      acc[column.category] = [];
    }
    acc[column.category].push(column);
    return acc;
  }, {});

  // Count active filters for a column
  const getColumnFilterCount = (columnId) => {
    return (filterCriteria[columnId] || []).length;
  };

  // Render the column selection section with checkboxes
  const renderColumnSelection = () => {
    return (
      <Box>
        <SearchInput>
          <SearchIconWrapper>
            <SearchIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search columns"
            value={columnSearchQuery}
            onChange={(e) => setColumnSearchQuery(e.target.value)}
          />
        </SearchInput>

        <List dense disablePadding sx={{ maxHeight: 400, overflowY: "auto" }}>
          {Object.keys(filteredGroupedColumns).map((category) => (
            <Box key={category} sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleToggleCategory(category)}
                sx={{
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.background.default, 0.6),
                }}
              >
                <ListItemText
                  primary={category}
                  primaryTypographyProps={{
                    variant: "subtitle2",
                    fontWeight: 600,
                  }}
                />
                {expandedCategories[category] ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </ListItemButton>

              <Collapse in={expandedCategories[category]}>
                {filteredGroupedColumns[category].map((column) => (
                  <ColumnCheckboxItem
                    key={column.id}
                    active={activeColumn === column.id}
                    onClick={() => {
                      if (selectedColumns.includes(column.id)) {
                        handleSelectColumnForFilters(column.id);
                      } else {
                        handleToggleColumn(column.id);
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Checkbox
                        checked={selectedColumns.includes(column.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleColumn(column.id);
                        }}
                        size="small"
                        disabled={column.required}
                        sx={{ mr: 1 }}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexGrow: 1,
                        }}
                      >
                        <Typography variant="body2">{column.name}</Typography>
                        {column.required && (
                          <Chip
                            label="Required"
                            size="small"
                            sx={{
                              ml: 1,
                              height: 16,
                              fontSize: "0.625rem",
                              backgroundColor: (theme) =>
                                alpha(theme.palette.primary.main, 0.1),
                              color: "primary.main",
                            }}
                          />
                        )}
                        {getColumnFilterCount(column.id) > 0 && (
                          <Chip
                            label={getColumnFilterCount(column.id)}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 16,
                              fontSize: "0.625rem",
                              backgroundColor: (theme) =>
                                alpha(theme.palette.secondary.main, 0.1),
                              color: "secondary.main",
                            }}
                          />
                        )}
                      </Box>

                      {column.filters &&
                        column.filters.length > 0 &&
                        selectedColumns.includes(column.id) && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectColumnForFilters(column.id);
                            }}
                            sx={{ ml: "auto" }}
                          >
                            <TuneIcon
                              fontSize="small"
                              color={
                                getColumnFilterCount(column.id) > 0
                                  ? "primary"
                                  : "action"
                              }
                            />
                          </IconButton>
                        )}
                    </Box>
                  </ColumnCheckboxItem>
                ))}
              </Collapse>
            </Box>
          ))}
        </List>
      </Box>
    );
  };

  // Render the active filter section
  const renderActiveFilters = () => {
    if (!activeColumn) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "text.secondary",
            p: 2,
          }}
        >
          <TuneIcon sx={{ fontSize: 40, opacity: 0.5, mb: 2 }} />
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Select a column to configure filters
          </Typography>
        </Box>
      );
    }

    const column = columnData.find((col) => col.id === activeColumn);
    if (!column || column.filters.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "text.secondary",
            p: 2,
          }}
        >
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            No filters available for this column
          </Typography>
        </Box>
      );
    }

    const selectedFilters = filterCriteria[activeColumn] || [];

    // Filter the filters based on search query
    const filteredFilters = column.filters.filter((filter) =>
      filter.toLowerCase().includes(filterSearchQuery.toLowerCase())
    );

    return (
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2">{column.name} Filters</Typography>
          {selectedFilters.length > 0 && (
            <Button
              size="small"
              onClick={() => handleClearColumnFilters(activeColumn)}
              sx={{ textTransform: "none", fontSize: "0.75rem" }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Filter search input */}
        {column.filters.length > 5 && (
          <SearchInput sx={{ mb: 2 }}>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search filters"
              value={filterSearchQuery}
              onChange={(e) => setFilterSearchQuery(e.target.value)}
            />
          </SearchInput>
        )}

        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            pr: 1,
            pl: 1,
            pb: 2,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.2),
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.3),
            },
          }}
        >
          <FormGroup>
            {filteredFilters.map((filter) => (
              <FormControlLabel
                key={filter}
                control={
                  <Checkbox
                    checked={selectedFilters.includes(filter)}
                    onChange={() => handleToggleFilter(activeColumn, filter)}
                    size="small"
                  />
                }
                label={filter}
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
                  py: 0.5,
                }}
              />
            ))}
          </FormGroup>

          {filteredFilters.length === 0 && (
            <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
              <Typography variant="body2">No matching filters found</Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Render selected filters summary
  const renderSelectedFiltersSummary = () => {
    const activeFilters = Object.entries(filterCriteria)
      .filter(
        ([columnId, filters]) =>
          filters.length > 0 && selectedColumns.includes(columnId)
      )
      .map(([columnId, filters]) => {
        const column = columnData.find((col) => col.id === columnId);
        return {
          columnId,
          columnName: column ? column.name : columnId,
          filters,
        };
      });

    if (activeFilters.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Selected Filters
        </Typography>
        <Stack spacing={1}>
          {activeFilters.map(({ columnId, columnName, filters }) => (
            <FilterCard key={columnId} variant="outlined">
              <CardContent sx={{ py: 1, px: 2, "&:last-child": { pb: 1 } }}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  {columnName}
                </Typography>
                <Box
                  sx={{
                    maxHeight: filters.length > 4 ? 120 : "auto",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                      borderRadius: "4px",
                    },
                  }}
                >
                  {filters.map((filter) => (
                    <Typography
                      key={`${columnId}-${filter}`}
                      variant="body2"
                      sx={{
                        display: "block",
                        py: 0.5,
                        color: "text.primary",
                      }}
                    >
                      • {filter}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </FilterCard>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Box>
      {/* Report Name Section */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Report Name"
          variant="outlined"
          size="small"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="Enter a descriptive name for your report"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              fontSize: "0.875rem",
            },
          }}
        />
      </Box>

      {/* Main layout - Column Selection and Filters Side by Side */}
      <FilterSection>
        <SectionTitle>Select Columns & Configure Filters</SectionTitle>
        <Divider sx={{ mt: -1, mb: 2 }} />

        <Grid container spacing={2}>
          {/* Left Side - Column Selection */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Available Columns
            </Typography>
            {renderColumnSelection()}
          </Grid>

          {/* Right Side - Active Filters */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Configure Filters
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                height: 400,
                overflowY: "auto",
                backgroundColor: (theme) =>
                  alpha(theme.palette.background.default, 0.5),
              }}
            >
              {renderActiveFilters()}
            </Paper>

            {/* Selected Filters Summary */}
            {renderSelectedFiltersSummary()}
          </Grid>
        </Grid>
      </FilterSection>

      {/* Alert Dialog for required columns */}
      <Dialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Required Column</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CombinedFilterColumnStep;
