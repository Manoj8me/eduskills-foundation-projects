import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ImprovedMultiSelectFilter from "./FilterComponent";
import MaterialUIMultiSelectFilter from "./FilterComponent";
 // Import the new component

// Enhanced search section with filter component
const EnhancedSearchSection = ({
  searchTerm,
  handleSearch,
  handleFilter, // New prop for filter handling
  filteredCount, // Optional prop to show count of filtered items
  totalCount, // Optional prop to show total items
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        marginBottom: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: { xs: "100%", sm: "auto" },
          flexGrow: 1,
          maxWidth: { sm: "400px" },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 1,
              bgcolor: "background.paper",
            },
          }}
        />

        <MaterialUIMultiSelectFilter onApplyFilters={handleFilter} />
      </Box>

      {/* Optional counter showing filtered/total results */}
      {filteredCount !== undefined && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            ml: { xs: 0, sm: 2 },
            mt: { xs: 0, sm: 0.5 },
            display: "flex",
            alignItems: "center",
            fontSize: "0.875rem",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Showing{" "}
          <Box
            component="span"
            sx={{ fontWeight: 700, mx: 0.5, color: "primary.main" }}
          >
            {filteredCount}
          </Box>{" "}
          of{" "}
          <Box component="span" sx={{ fontWeight: 700, mx: 0.5 }}>
            {totalCount}
          </Box>{" "}
          students
        </Typography>
      )}
    </Box>
  );
};

export default EnhancedSearchSection;
