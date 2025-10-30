import React, { useState, useMemo } from "react";
import {
  Popover,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  InputAdornment,
  FormGroup,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

const FilterPopoverForView = ({
  anchorEl,
  open,
  onClose,
  title,
  options,
  selectedValues,
  onSelectionChange,
  getOptionLabel,
  getOptionValue,
  searchEnabled = true,
  maxHeight = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchEnabled || !searchTerm) return options;
    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, getOptionLabel, searchEnabled]);

  const handleToggle = (value) => {
    const currentIndex = selectedValues.indexOf(value);
    const newSelected = [...selectedValues];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    onSelectionChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(
        filteredOptions.map((option) => getOptionValue(option))
      );
    }
  };

  const handleClear = () => {
    onSelectionChange([]);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
          width: 300,
          maxHeight: maxHeight + 100,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedValues.length} selected
          </Typography>
        </Box>

        {/* Search */}
        {searchEnabled && (
          <TextField
            size="small"
            fullWidth
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={1} mb={2}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleSelectAll}
            sx={{ fontSize: "0.7rem", textTransform: "none" }}
          >
            {selectedValues.length === filteredOptions.length
              ? "Deselect All"
              : "Select All"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleClear}
            startIcon={<Clear fontSize="small" />}
            sx={{ fontSize: "0.7rem", textTransform: "none" }}
          >
            Clear
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Options */}
        <Box sx={{ maxHeight, overflow: "auto" }}>
          <FormGroup>
            {filteredOptions.map((option) => {
              const value = getOptionValue(option);
              const label = getOptionLabel(option);
              return (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={selectedValues.indexOf(value) !== -1}
                      onChange={() => handleToggle(value)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {label}
                    </Typography>
                  }
                  sx={{ ml: 0, mb: 0.5 }}
                />
              );
            })}
            {filteredOptions.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={2}
              >
                No options found
              </Typography>
            )}
          </FormGroup>
        </Box>
      </Box>
    </Popover>
  );
};

export default FilterPopoverForView;
