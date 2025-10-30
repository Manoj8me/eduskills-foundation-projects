import React from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Rating,
  Slider,
} from "@mui/material";
import { Image, VideoLibrary } from "@mui/icons-material";

const PreviewMode = ({
  form,
  responses,
  handleResponseChange,
  handleCheckboxChange,
  handleGridResponse,
}) => {
  const renderHtml = (html) => {
    if (!html) return "";

    // Convert simple formatting to proper HTML
    let formatted = html;

    // Handle bullet points (• character or - at start of lines)
    formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, "<li>$1</li>");

    // Wrap consecutive list items in ul tags
    formatted = formatted.replace(/(<li>.*<\/li>\s*)+/gs, "<ul>$&</ul>");

    // Handle numbered lists (1. 2. etc.)
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

    // Replace the last ul with ol for numbered lists if pattern matches
    if (/^\d+\.\s+/.test(html)) {
      formatted = formatted.replace(/<ul>/g, "<ol>");
      formatted = formatted.replace(/<\/ul>/g, "</ol>");
    }

    // Handle line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const renderPreviewQuestion = (q) => {
    if (q.type === "title-description" || q.type === "section") {
      return (
        <Paper
          key={q.id}
          sx={{
            p: 3,
            mb: 2,
            borderTop: q.type === "section" ? "8px solid #673ab7" : undefined,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 1,
              fontWeight: 400,
              "& ul": {
                listStyleType: "disc",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#202124",
                fontSize: 20,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
              "& ol": {
                listStyleType: "decimal",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#202124",
                fontSize: 20,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
            }}
          >
            {renderHtml(q.title)}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#5f6368",
              "& ul": {
                listStyleType: "disc",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#5f6368",
                fontSize: 14,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
              "& ol": {
                listStyleType: "decimal",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#5f6368",
                fontSize: 14,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
            }}
          >
            {renderHtml(q.description)}
          </Typography>
        </Paper>
      );
    }

    if (q.type === "image") {
      return (
        <Paper key={q.id} sx={{ p: 3, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: 16,
              fontWeight: 400,
              "& ul": {
                listStyleType: "disc",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#202124",
                fontSize: 16,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
              "& ol": {
                listStyleType: "decimal",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#202124",
                fontSize: 16,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
            }}
          >
            {renderHtml(q.title)}
          </Typography>
          <Box
            sx={{
              border: "1px solid #dadce0",
              borderRadius: 1,
              p: 4,
              textAlign: "center",
              color: "#5f6368",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Image sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">Image will appear here</Typography>
          </Box>
        </Paper>
      );
    }

    if (q.type === "video") {
      return (
        <Paper key={q.id} sx={{ p: 3, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: 16,
              fontWeight: 400,
              "& ul": {
                listStyleType: "disc",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#202124",
                fontSize: 16,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
              "& ol": {
                listStyleType: "decimal",
                margin: "8px 0",
                paddingLeft: "24px",
                color: "#202124",
                fontSize: 16,
                lineHeight: 1.4,
                "& li": {
                  marginBottom: "4px",
                },
              },
            }}
          >
            {renderHtml(q.title)}
          </Typography>
          <Box
            sx={{
              border: "1px solid #dadce0",
              borderRadius: 1,
              p: 4,
              textAlign: "center",
              color: "#5f6368",
              backgroundColor: "#f8f9fa",
            }}
          >
            <VideoLibrary sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">Video will appear here</Typography>
          </Box>
        </Paper>
      );
    }

    return (
      <Paper key={q.id} sx={{ p: 3, mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontSize: 16,
            fontWeight: 400,
            "& ul": {
              listStyleType: "disc",
              margin: "8px 0",
              paddingLeft: "24px",
              color: "#202124",
              fontSize: 16,
              lineHeight: 1.4,
              "& li": {
                marginBottom: "4px",
              },
            },
            "& ol": {
              listStyleType: "decimal",
              margin: "8px 0",
              paddingLeft: "24px",
              color: "#202124",
              fontSize: 16,
              lineHeight: 1.4,
              "& li": {
                marginBottom: "4px",
              },
            },
          }}
          component="div"
        >
          {renderHtml(q.title)}
        </Typography>
        {q.required && (
          <Typography component="span" sx={{ color: "red" }}>
            {" *"}
          </Typography>
        )}

        {q.type === "short-answer" && (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            placeholder="Your answer"
            value={responses[q.id] || ""}
            onChange={(e) => handleResponseChange(q.id, e.target.value)}
          />
        )}

        {q.type === "paragraph" && (
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            placeholder="Your answer"
            value={responses[q.id] || ""}
            onChange={(e) => handleResponseChange(q.id, e.target.value)}
          />
        )}

        {q.type === "multiple-choice" && (
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              value={responses[q.id] || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            >
              {q.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}

        {q.type === "checkboxes" && (
          <FormGroup sx={{ mt: 1 }}>
            {q.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    checked={responses[q.id]?.includes(option) || false}
                    onChange={(e) =>
                      handleCheckboxChange(q.id, option, e.target.checked)
                    }
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        )}

        {q.type === "dropdown" && (
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Choose</InputLabel>
            <Select
              size="small"
              value={responses[q.id] || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
              label="Choose"
            >
              {q.options.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {q.type === "linear-scale" && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 14, color: "#5f6368", mr: 2 }}>
              {q.scaleMinLabel || "1"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {Array.from(
                { length: (q.scaleMax || 5) - (q.scaleMin || 1) + 1 },
                (_, i) => {
                  const value = (q.scaleMin || 1) + i;
                  const isSelected = Number(responses[q.id]) === value;
                  return (
                    <Box
                      key={i}
                      onClick={() => handleResponseChange(q.id, value)}
                      sx={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isSelected
                          ? "2px solid #673ab7"
                          : "1px solid #dadce0",
                        borderRadius: "50%",
                        fontSize: 14,
                        color: isSelected ? "#673ab7" : "#5f6368",
                        backgroundColor: isSelected ? "#f3e5f5" : "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#673ab7",
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    >
                      {value}
                    </Box>
                  );
                }
              )}
            </Box>
            <Typography sx={{ fontSize: 14, color: "#5f6368", ml: 2 }}>
              {q.scaleMaxLabel || (q.scaleMax || 5).toString()}
            </Typography>
          </Box>
        )}

        {q.type === "rating" && (
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <Rating
              value={Number(responses[q.id]) || 0}
              max={q.maxStars || 5}
              size="large"
              onChange={(e, val) => handleResponseChange(q.id, val)}
            />
            <Typography variant="body2" sx={{ color: "#5f6368" }}>
              {Number(responses[q.id]) || 0}/{q.maxStars || 5}
            </Typography>
          </Box>
        )}

        {/* Multiple-choice grid */}
        {q.type === "multiple-choice-grid" && (
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: `200px repeat(${q.columns.length}, 1fr)`,
              gap: 1,
            }}
          >
            <Box />
            {q.columns.map((col, idx) => (
              <Typography
                key={idx}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                {col}
              </Typography>
            ))}
            {q.rows.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <Typography sx={{ fontWeight: "bold", alignSelf: "center" }}>
                  {row}
                </Typography>
                {q.columns.map((col, colIdx) => (
                  <Box
                    key={colIdx}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Radio
                      checked={responses[q.id]?.[row] === col}
                      onChange={() => handleGridResponse(q.id, row, col, false)}
                    />
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Box>
        )}

        {/* Checkbox grid */}
        {q.type === "checkbox-grid" && (
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: `200px repeat(${q.columns.length}, 1fr)`,
              gap: 1,
            }}
          >
            <Box />
            {q.columns.map((col, idx) => (
              <Typography
                key={idx}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                {col}
              </Typography>
            ))}
            {q.rows.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <Typography sx={{ fontWeight: "bold", alignSelf: "center" }}>
                  {row}
                </Typography>
                {q.columns.map((col, colIdx) => (
                  <Box
                    key={colIdx}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Checkbox
                      checked={responses[q.id]?.[row]?.includes(col) || false}
                      onChange={() => handleGridResponse(q.id, row, col, true)}
                    />
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Box>
        )}

        {q.type === "date" && (
          <TextField
            type="date"
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            value={responses[q.id] || ""}
            onChange={(e) => handleResponseChange(q.id, e.target.value)}
          />
        )}

        {q.type === "time" && (
          <TextField
            type="time"
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            value={responses[q.id] || ""}
            onChange={(e) => handleResponseChange(q.id, e.target.value)}
          />
        )}
      </Paper>
    );
  };

  return <>{form.questions.map(renderPreviewQuestion)}</>;
};

export default PreviewMode;
