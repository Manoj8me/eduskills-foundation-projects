import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  Alert,
} from "@mui/material";
import { Add, Circle, ViewModule } from "@mui/icons-material";

const Sidebar = ({
  currentDate,
  monthNames,
  categories,
  selectedCategories,
  toggleCategory,
  viewMode,
  setViewMode,
  setOverviewYear,
  setOpenDrawer,
  isSelecting,
  setIsSelecting,
  setSelectedRange,
  setIsDragging,
  setOverlapError,
  overlapError,
}) => {
  return (
    <Paper
      sx={{
        width: 280,
        p: 3,
        bgcolor: "white",
        borderRadius: 0,
        borderRight: "1px solid #e2e8f0",
        boxShadow: "none",
      }}
    >
      {/* Current Date Display */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Today:{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* View Toggle */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant={viewMode === "overview" ? "contained" : "outlined"}
          fullWidth
          startIcon={<ViewModule />}
          onClick={() => {
            setOverviewYear(currentDate.getFullYear());
            setViewMode("overview");
          }}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            py: 1.5,
            mb: 1,
            bgcolor: viewMode === "overview" ? "#3b82f6" : "transparent",
            color: viewMode === "overview" ? "white" : "#3b82f6",
            border: "1px solid #3b82f6",
            "&:hover": {
              bgcolor:
                viewMode === "overview" ? "#2563eb" : alpha("#3b82f6", 0.1),
            },
          }}
        >
          Calendar Overview
        </Button>
      </Box>

      {/* Create Slot Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={() => setOpenDrawer(true)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            py: 1.5,
            bgcolor: "#16a34a",
            "&:hover": {
              bgcolor: "#15803d",
            },
          }}
        >
          Create Slot
        </Button>
      </Box>

      {/* Selection Mode */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant={isSelecting ? "contained" : "outlined"}
          fullWidth
          onClick={() => {
            setIsSelecting(!isSelecting);
            setSelectedRange({ start: null, end: null });
            setIsDragging(false);
            setOverlapError("");
          }}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            py: 1.5,
            bgcolor: isSelecting ? "#f59e0b" : "transparent",
            color: isSelecting ? "white" : "#f59e0b",
            border: "1px solid #f59e0b",
            "&:hover": {
              bgcolor: isSelecting ? "#d97706" : alpha("#f59e0b", 0.1),
            },
          }}
        >
          {isSelecting ? "Cancel Selection" : "Drag to Select Dates"}
        </Button>
        {isSelecting && (
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              mt: 1,
              display: "block",
              textAlign: "center",
            }}
          >
            Click and drag to select date range
          </Typography>
        )}
        {overlapError && (
          <Alert severity="error" sx={{ mt: 1, fontSize: "0.75rem" }}>
            {overlapError}
          </Alert>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Categories */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Categories
        </Typography>
        <List dense sx={{ p: 0 }}>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              button
              onClick={() => toggleCategory(category.id)}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                px: 1,
                "&:hover": { bgcolor: alpha(category.color, 0.1) },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Circle
                  sx={{
                    color: category.color,
                    fontSize: 12,
                    opacity: selectedCategories.includes(category.id) ? 1 : 0.3,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={category.name}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: selectedCategories.includes(category.id)
                    ? 500
                    : 400,
                  opacity: selectedCategories.includes(category.id) ? 1 : 0.6,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default Sidebar;
