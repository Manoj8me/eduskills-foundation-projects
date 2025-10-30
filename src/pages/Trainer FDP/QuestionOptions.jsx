import React from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Button,
  Radio,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Rating,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const QuestionOptions = ({
  question,
  updateQuestion,
  updateOption,
  removeOption,
  addOption,
  updateRow,
  removeRow,
  addRow,
  updateColumn,
  removeColumn,
  addColumn,
}) => {
  // Simple option list for multiple-choice, checkboxes, dropdown
  if (["multiple-choice", "checkboxes", "dropdown"].includes(question.type)) {
    return (
      <Box sx={{ mt: 2 }}>
        {question.options?.map((option, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            {(question.type === "multiple-choice" ||
              question.type === "dropdown") && (
              <Radio disabled size="small" sx={{ mr: 1.5, color: "#dadce0" }} />
            )}
            {question.type === "checkboxes" && (
              <Checkbox
                disabled
                size="small"
                sx={{ mr: 1.5, color: "#dadce0" }}
              />
            )}
            <TextField
              size="small"
              variant="outlined"
              value={option}
              onChange={(e) => updateOption(question.id, index, e.target.value)}
              fullWidth
            />
            <IconButton
              size="small"
              onClick={() => removeOption(question.id, index)}
              sx={{
                visibility: question.options.length > 1 ? "visible" : "hidden",
                ml: 1,
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Button
          size="small"
          onClick={() => addOption(question.id)}
          sx={{ textTransform: "none", color: "#5f6368", fontSize: 14 }}
        >
          Add option
        </Button>
      </Box>
    );
  }

  // Multiple choice grid or Checkbox grid with parallel row and column editing
  if (["multiple-choice-grid", "checkbox-grid"].includes(question.type)) {
    return (
      <Box sx={{ mt: 2, display: "flex", gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Rows
          </Typography>
          {question.rows?.map((row, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <TextField
                size="small"
                variant="outlined"
                value={row}
                onChange={(e) => updateRow(question.id, index, e.target.value)}
                fullWidth
              />
              <IconButton
                size="small"
                onClick={() => removeRow(question.id, index)}
                sx={{
                  visibility: question.rows.length > 1 ? "visible" : "hidden",
                  ml: 1,
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            onClick={() => addRow(question.id)}
            sx={{ textTransform: "none", color: "#5f6368", fontSize: 14 }}
          >
            Add row
          </Button>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Columns
          </Typography>
          {question.columns?.map((col, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <TextField
                size="small"
                variant="outlined"
                value={col}
                onChange={(e) =>
                  updateColumn(question.id, index, e.target.value)
                }
                fullWidth
              />
              <IconButton
                size="small"
                onClick={() => removeColumn(question.id, index)}
                sx={{
                  visibility:
                    question.columns.length > 1 ? "visible" : "hidden",
                  ml: 1,
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            onClick={() => addColumn(question.id)}
            sx={{ textTransform: "none", color: "#5f6368", fontSize: 14 }}
          >
            Add column
          </Button>
        </Box>
      </Box>
    );
  }

  // For short answer and paragraph types, show disabled inputs
  if (question.type === "short-answer") {
    return (
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        disabled
        placeholder="Short answer text"
        sx={{ mt: 2 }}
      />
    );
  }

  if (question.type === "paragraph") {
    return (
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        multiline
        minRows={3}
        disabled
        placeholder="Long answer text"
        sx={{ mt: 2 }}
      />
    );
  }

  // Rating configuration with dropdown for number of stars
  if (question.type === "rating") {
    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="body2" sx={{ color: "#5f6368" }}>
            Number of stars:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={question.maxStars || 5}
              onChange={(e) =>
                updateQuestion(question.id, { maxStars: e.target.value })
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "#5f6368" }}>
            Preview:
          </Typography>
          <Rating
            value={0}
            max={question.maxStars || 5}
            size="small"
            readOnly
          />
          <Typography variant="body2" sx={{ color: "#5f6368" }}>
            (0/{question.maxStars || 5})
          </Typography>
        </Box>
      </Box>
    );
  }

  if (question.type === "linear-scale") {
    return (
      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, color: "#5f6368", mr: 2 }}>
          {question.scaleMinLabel || "1"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {Array.from(
            { length: (question.scaleMax || 5) - (question.scaleMin || 1) + 1 },
            (_, i) => (
              <Typography
                key={i}
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #dadce0",
                  borderRadius: "50%",
                  fontSize: 12,
                  color: "#5f6368",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {(question.scaleMin || 1) + i}
              </Typography>
            )
          )}
        </Box>
        <Typography sx={{ fontSize: 14, color: "#5f6368", ml: 2 }}>
          {question.scaleMaxLabel || (question.scaleMax || 5).toString()}
        </Typography>
      </Box>
    );
  }

  if (question.type === "date") {
    return (
      <TextField
        type="date"
        variant="standard"
        disabled
        sx={{ mt: 2 }}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  if (question.type === "time") {
    return (
      <TextField
        type="time"
        variant="standard"
        disabled
        sx={{ mt: 2 }}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  // Image and Video placeholder
  if (question.type === "image") {
    return (
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            border: "2px dashed #dadce0",
            borderRadius: 1,
            p: 4,
            textAlign: "center",
            color: "#5f6368",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#4285f4",
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Click to upload image
          </Typography>
        </Box>
      </Box>
    );
  }

  if (question.type === "video") {
    return (
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            border: "2px dashed #dadce0",
            borderRadius: 1,
            p: 4,
            textAlign: "center",
            color: "#5f6368",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#4285f4",
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Click to add video
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default QuestionOptions;
