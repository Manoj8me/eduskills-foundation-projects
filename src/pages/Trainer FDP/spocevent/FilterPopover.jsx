import { Close, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const FilterPopover = ({
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
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = searchEnabled
    ? options.filter((option) =>
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

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
      onSelectionChange(filteredOptions.map(getOptionValue));
    }
  };

  const isAllSelected =
    filteredOptions.length > 0 &&
    selectedValues.length === filteredOptions.length;

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
          width: 320,
          maxHeight: 400,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid #e0e7ff",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Button
            size="small"
            onClick={onClose}
            sx={{ minWidth: "auto", p: 0.5 }}
          >
            <Close fontSize="small" />
          </Button>
        </Box>

        {searchEnabled && (
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Button
            size="small"
            onClick={handleSelectAll}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: "0.75rem",
              borderColor: "#000000",
              color: "#000000",
              "&:hover": {
                borderColor: "#000000",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </Button>
          {selectedValues.length > 0 && (
            <Button
              size="small"
              onClick={() => onSelectionChange([])}
              variant="text"
              color="error"
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                color: "#ef4444",
              }}
            >
              Clear ({selectedValues.length})
            </Button>
          )}
        </Box>

        <List sx={{ maxHeight: 240, overflow: "auto", p: 0 }}>
          {filteredOptions.map((option) => {
            const value = getOptionValue(option);
            const label = getOptionLabel(option);
            const isSelected = selectedValues.includes(value);

            return (
              <ListItem key={value} disablePadding>
                <ListItemButton
                  onClick={() => handleToggle(value)}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      checked={isSelected}
                      size="small"
                      sx={{
                        "&.Mui-checked": {
                          color: "#000000",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          {filteredOptions.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No options found"
                primaryTypographyProps={{
                  textAlign: "center",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Popover>
  );
};
export default FilterPopover;
