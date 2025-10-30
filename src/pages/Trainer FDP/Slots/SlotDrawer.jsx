import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Autocomplete,
  Stack,
  alpha,
  Drawer,
  Alert,
} from "@mui/material";
import { Circle, Close } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const SlotDrawer = ({
  openDrawer,
  setOpenDrawer,
  newSlot,
  setNewSlot,
  selectedRange,
  setSelectedRange,
  setIsSelecting,
  overlapError,
  setOverlapError,
  handleCreateSlot,
  formatDateRange,
  categories,
  states,
  institutes,
  domains,
}) => {
  const handleClose = () => {
    setOpenDrawer(false);
    setSelectedRange({ start: null, end: null });
    setIsSelecting(false);
    setOverlapError("");
    // Reset form when closing
    setNewSlot({
      title: "",
      category: "product-design",
      state: "",
      institute: "",
      domain: "",
      startDate: null,
      endDate: null,
    });
  };

  const handleCreateSlotClick = () => {
    console.log("Create slot clicked, newSlot:", newSlot);
    handleCreateSlot();
  };

  // Determine if form is valid
  const isFormValid =
    newSlot.title.trim() &&
    newSlot.startDate &&
    newSlot.endDate &&
    !overlapError;

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 400,
          p: 0,
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Slot
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 3, height: "calc(100vh - 160px)", overflow: "auto" }}>
        <Stack spacing={3}>
          {overlapError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {overlapError}
            </Alert>
          )}

          <TextField
            label="Slot Title *"
            value={newSlot.title}
            onChange={(e) => {
              setNewSlot((prev) => ({ ...prev, title: e.target.value }));
              // Clear error when user starts typing
              if (overlapError && overlapError.includes("title")) {
                setOverlapError("");
              }
            }}
            fullWidth
            required
            error={!newSlot.title.trim() && overlapError.includes("title")}
            helperText={
              !newSlot.title.trim() && overlapError.includes("title")
                ? "Title is required"
                : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.name}
            value={
              categories.find((c) => c.id === newSlot.category) || categories[0]
            }
            onChange={(_, value) =>
              setNewSlot((prev) => ({
                ...prev,
                category: value?.id || "product-design",
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category *"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Circle sx={{ color: option.color, fontSize: 12, mr: 1 }} />
                {option.name}
              </Box>
            )}
          />

          <Autocomplete
            options={states}
            value={newSlot.state}
            onChange={(_, value) =>
              setNewSlot((prev) => ({ ...prev, state: value || "" }))
            }
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="State"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            )}
          />

          <Autocomplete
            options={institutes}
            value={newSlot.institute}
            onChange={(_, value) =>
              setNewSlot((prev) => ({ ...prev, institute: value || "" }))
            }
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Institute"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            )}
          />

          <Autocomplete
            options={domains}
            value={newSlot.domain}
            onChange={(_, value) =>
              setNewSlot((prev) => ({ ...prev, domain: value || "" }))
            }
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Domain"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            )}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <DatePicker
              label="Start Date *"
              value={newSlot.startDate}
              onChange={(date) => {
                console.log("Start date changed:", date);
                setNewSlot((prev) => ({ ...prev, startDate: date }));
                // Clear date-related errors
                if (
                  overlapError &&
                  (overlapError.includes("date") ||
                    overlapError.includes("select"))
                ) {
                  setOverlapError("");
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!newSlot.startDate && overlapError.includes("date")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
            <DatePicker
              label="End Date *"
              value={newSlot.endDate}
              onChange={(date) => {
                console.log("End date changed:", date);
                setNewSlot((prev) => ({ ...prev, endDate: date }));
                // Clear date-related errors
                if (
                  overlapError &&
                  (overlapError.includes("date") ||
                    overlapError.includes("select"))
                ) {
                  setOverlapError("");
                }
              }}
              minDate={newSlot.startDate || undefined}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!newSlot.endDate && overlapError.includes("date")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Preview Selected Range */}
          {(selectedRange.start && selectedRange.end) ||
          (newSlot.startDate && newSlot.endDate) ? (
            <Box
              sx={{
                p: 2,
                bgcolor: alpha("#16a34a", 0.1),
                border: `1px solid ${alpha("#16a34a", 0.3)}`,
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#16a34a", mb: 1 }}
              >
                Date Range Preview
              </Typography>
              {selectedRange.start && selectedRange.end ? (
                <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                  Selected from calendar:{" "}
                  {formatDateRange(selectedRange.start, selectedRange.end)}
                </Typography>
              ) : null}
              {newSlot.startDate && newSlot.endDate ? (
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Form dates:{" "}
                  {formatDateRange(newSlot.startDate, newSlot.endDate)}
                </Typography>
              ) : null}
              {newSlot.startDate && newSlot.endDate && (
                <Typography
                  variant="caption"
                  sx={{ color: "#16a34a", display: "block", mt: 1 }}
                >
                  Duration:{" "}
                  {Math.ceil(
                    (newSlot.endDate - newSlot.startDate) /
                      (1000 * 60 * 60 * 24)
                  ) + 1}{" "}
                  day(s)
                </Typography>
              )}
            </Box>
          ) : null}

          {/* Validation Status */}
          <Box
            sx={{
              p: 2,
              bgcolor: isFormValid
                ? alpha("#16a34a", 0.1)
                : alpha("#f59e0b", 0.1),
              border: `1px solid ${
                isFormValid ? alpha("#16a34a", 0.3) : alpha("#f59e0b", 0.3)
              }`,
              borderRadius: "12px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: isFormValid ? "#16a34a" : "#f59e0b",
                mb: 1,
              }}
            >
              Form Status: {isFormValid ? "Ready to Create" : "Incomplete"}
            </Typography>
            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: newSlot.title.trim() ? "#16a34a" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {newSlot.title.trim() ? "✓" : "✗"} Title
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: newSlot.startDate ? "#16a34a" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {newSlot.startDate ? "✓" : "✗"} Start Date
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: newSlot.endDate ? "#16a34a" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {newSlot.endDate ? "✓" : "✗"} End Date
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: !overlapError ? "#16a34a" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {!overlapError ? "✓" : "✗"} No Conflicts
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 3, borderTop: "1px solid #e2e8f0" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleCreateSlotClick}
          disabled={!isFormValid}
          sx={{
            bgcolor: isFormValid ? "#16a34a" : "#94a3b8",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            py: 1.5,
            "&:hover": {
              bgcolor: isFormValid ? "#15803d" : "#94a3b8",
            },
            "&:disabled": {
              bgcolor: "#94a3b8",
              color: "#ffffff",
            },
          }}
        >
          {!newSlot.title.trim()
            ? "Enter Title to Continue"
            : !newSlot.startDate || !newSlot.endDate
            ? "Select Dates to Continue"
            : overlapError
            ? "Resolve Conflicts to Continue"
            : "Create Slot"}
        </Button>

        {/* Additional Help Text */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {!isFormValid ? (
              <>Complete all required fields marked with *</>
            ) : (
              "All requirements met - ready to create slot"
            )}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlotDrawer;
