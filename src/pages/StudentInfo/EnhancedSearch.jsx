import React from "react";
import {
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IntakeTourGuide from "./IntakeTourGuide";

const EnhancedSearch = ({
  value,
  onChange,
  loading,
  onClear,
  placeholder = "Search...",
}) => {
  return (
    <Box
      id="search-box"
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "250px",
      }}
    >
      <IntakeTourGuide />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(25, 118, 210, 0.08)"
                : "rgba(25, 118, 210, 0.02)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(25, 118, 210, 0.15)"
                  : "rgba(25, 118, 210, 0.08)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
              },
            },
            "&.Mui-focused": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(25, 118, 210, 0.2)"
                  : "rgba(25, 118, 210, 0.12)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
                borderWidth: "2px",
              },
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(25, 118, 210, 0.5)"
                : "rgba(25, 118, 210, 0.23)",
          },
          "& input::placeholder": {
            color: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.4)",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: "#1976d2",
                  opacity: 0.8,
                }}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#1976d2" }} />
              ) : value ? (
                <IconButton
                  size="small"
                  onClick={onClear}
                  sx={{
                    padding: 0.5,
                    color: "#1976d2",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(25, 118, 210, 0.2)"
                          : "rgba(25, 118, 210, 0.12)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default EnhancedSearch;
