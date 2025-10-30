import React from "react";
import {
  Box,
  Paper,
  Button,
  IconButton,
  Divider,
  Tooltip,
  Switch,
  FormControlLabel,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  DragIndicator,
  ContentCopy,
  Delete,
  MoreVert,
  TextFields,
  Subject,
  Image,
  VideoLibrary,
  RadioButtonChecked,
  ShortText,
  CheckBox,
  ArrowDropDownCircle,
  LinearScale,
  Star,
  Apps,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import TipTapEditor from "./TipTapEditor";
import QuestionOptions from "./QuestionOptions";

const QuestionCard = ({
  question,
  activeQuestion,
  questionTypes,
  questionTypeMenu,
  setQuestionTypeMenu,
  setActiveQuestion,
  handleDragStart,
  handleDragOver,
  handleDrop,
  updateQuestion,
  duplicateQuestion,
  deleteQuestion,
  handleQuestionTypeChange,
  updateOption,
  removeOption,
  addOption,
  updateRow,
  removeRow,
  addRow,
  updateColumn,
  removeColumn,
  addColumn,
  renderSideToolbar,
}) => {
  const isActive = activeQuestion === question.id;

  if (question.type === "title-description") {
    return (
      <Paper
        key={question.id}
        draggable
        onDragStart={(e) => handleDragStart(e, question.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, question.id)}
        onClick={() => setActiveQuestion(question.id)}
        sx={{
          mb: 2,
          borderRadius: "8px",
          border: isActive ? "2px solid #4285f4" : "1px solid #e8eaed",
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative",
          "&:hover": {
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DragIndicator
                  sx={{
                    color: "#dadce0",
                    cursor: "grab",
                    mr: 1,
                    "&:active": { cursor: "grabbing" },
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <TipTapEditor
                    content={question.title}
                    onChange={(value) =>
                      updateQuestion(question.id, { title: value })
                    }
                    placeholder="Title"
                  />
                </Box>
              </Box>
              <TipTapEditor
                content={question.description}
                onChange={(value) =>
                  updateQuestion(question.id, { description: value })
                }
                placeholder="Description"
                multiline={true}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                ml: 2,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: "auto",
                  width: 40,
                  height: 40,
                  p: 1,
                  borderColor: "#dadce0",
                  color: "#5f6368",
                }}
              >
                <TextFields fontSize="small" />
              </Button>
            </Box>
          </Box>
          {isActive && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateQuestion(question.id);
                      }}
                      sx={{ color: "#5f6368" }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      sx={{ color: "#5f6368" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <IconButton size="small" sx={{ color: "#5f6368" }}>
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              {renderSideToolbar()}
            </>
          )}
        </Box>
      </Paper>
    );
  }

  if (question.type === "section") {
    return (
      <Paper
        key={question.id}
        draggable
        onDragStart={(e) => handleDragStart(e, question.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, question.id)}
        onClick={() => setActiveQuestion(question.id)}
        sx={{
          mb: 2,
          borderRadius: "8px",
          borderTop: "8px solid #673ab7",
          border: isActive ? "2px solid #4285f4" : "1px solid #e8eaed",
          borderTopWidth: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative",
          "&:hover": {
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DragIndicator
                  sx={{
                    color: "#dadce0",
                    cursor: "grab",
                    mr: 1,
                    "&:active": { cursor: "grabbing" },
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <TipTapEditor
                    content={question.title}
                    onChange={(value) =>
                      updateQuestion(question.id, { title: value })
                    }
                    placeholder="Section Title"
                  />
                </Box>
              </Box>
              <TipTapEditor
                content={question.description}
                onChange={(value) =>
                  updateQuestion(question.id, { description: value })
                }
                placeholder="Section description"
                multiline={true}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                ml: 2,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: "auto",
                  width: 40,
                  height: 40,
                  p: 1,
                  borderColor: "#dadce0",
                  color: "#5f6368",
                }}
              >
                <Subject fontSize="small" />
              </Button>
            </Box>
          </Box>
          {isActive && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateQuestion(question.id);
                      }}
                      sx={{ color: "#5f6368" }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      sx={{ color: "#5f6368" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <IconButton size="small" sx={{ color: "#5f6368" }}>
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              {renderSideToolbar()}
            </>
          )}
        </Box>
      </Paper>
    );
  }

  if (question.type === "image" || question.type === "video") {
    return (
      <Paper
        key={question.id}
        draggable
        onDragStart={(e) => handleDragStart(e, question.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, question.id)}
        onClick={() => setActiveQuestion(question.id)}
        sx={{
          mb: 2,
          borderRadius: "8px",
          border: isActive ? "2px solid #4285f4" : "1px solid #e8eaed",
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative",
          "&:hover": {
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DragIndicator
                  sx={{
                    color: "#dadce0",
                    cursor: "grab",
                    mr: 1,
                    "&:active": { cursor: "grabbing" },
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <TipTapEditor
                    content={question.title}
                    onChange={(value) =>
                      updateQuestion(question.id, { title: value })
                    }
                    placeholder={
                      question.type === "image" ? "Image Title" : "Video Title"
                    }
                  />
                </Box>
              </Box>
              <QuestionOptions
                question={question}
                updateQuestion={updateQuestion}
                updateOption={updateOption}
                removeOption={removeOption}
                addOption={addOption}
                updateRow={updateRow}
                removeRow={removeRow}
                addRow={addRow}
                updateColumn={updateColumn}
                removeColumn={removeColumn}
                addColumn={addColumn}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                ml: 2,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: "auto",
                  width: 40,
                  height: 40,
                  p: 1,
                  borderColor: "#dadce0",
                  color: "#5f6368",
                }}
              >
                {question.type === "image" ? (
                  <Image fontSize="small" />
                ) : (
                  <VideoLibrary fontSize="small" />
                )}
              </Button>
            </Box>
          </Box>
          {isActive && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateQuestion(question.id);
                      }}
                      sx={{ color: "#5f6368" }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      sx={{ color: "#5f6368" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <IconButton size="small" sx={{ color: "#5f6368" }}>
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              {renderSideToolbar()}
            </>
          )}
        </Box>
      </Paper>
    );
  }

  // Regular question types
  return (
    <Paper
      key={question.id}
      draggable
      onDragStart={(e) => handleDragStart(e, question.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, question.id)}
      onClick={() => setActiveQuestion(question.id)}
      sx={{
        mb: 2,
        borderRadius: "8px",
        border: isActive ? "2px solid #4285f4" : "1px solid #e8eaed",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        "&:hover": {
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DragIndicator
                sx={{
                  color: "#dadce0",
                  cursor: "grab",
                  mr: 1,
                  "&:active": { cursor: "grabbing" },
                }}
              />
              <Box sx={{ flex: 1 }}>
                <TipTapEditor
                  content={question.title}
                  onChange={(value) =>
                    updateQuestion(question.id, { title: value })
                  }
                  placeholder="Question"
                />
              </Box>
            </Box>
            <QuestionOptions
              question={question}
              updateQuestion={updateQuestion}
              updateOption={updateOption}
              removeOption={removeOption}
              addOption={addOption}
              updateRow={updateRow}
              removeRow={removeRow}
              addRow={addRow}
              updateColumn={updateColumn}
              removeColumn={removeColumn}
              addColumn={addColumn}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              ml: 2,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setQuestionTypeMenu(e.currentTarget);
              }}
              sx={{
                minWidth: "auto",
                width: 40,
                height: 40,
                p: 1,
                borderColor: "#dadce0",
                color: "#5f6368",
              }}
            >
              {React.createElement(
                questionTypes.find((t) => t.value === question.type)?.icon ||
                  RadioButtonChecked,
                { fontSize: "small" }
              )}
            </Button>
          </Box>
        </Box>
        {isActive && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Tooltip title="Duplicate">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateQuestion(question.id);
                    }}
                    sx={{ color: "#5f6368" }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(question.id);
                    }}
                    sx={{ color: "#5f6368" }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1, height: 24 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={question.required}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateQuestion(question.id, {
                          required: e.target.checked,
                        });
                      }}
                      size="small"
                      color="primary"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 14, color: "#5f6368" }}>
                      Required
                    </Typography>
                  }
                  sx={{ ml: 1 }}
                />
              </Box>
              <IconButton size="small" sx={{ color: "#5f6368" }}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            {renderSideToolbar()}
          </>
        )}
      </Box>

      <Menu
        anchorEl={questionTypeMenu}
        open={Boolean(questionTypeMenu)}
        onClose={() => setQuestionTypeMenu(null)}
        PaperProps={{
          sx: {
            minWidth: 260,
            maxHeight: 400,
            mt: 1,
            boxShadow: "0 4px 6px rgba(32, 33, 36, 0.28)",
          },
        }}
      >
        {questionTypes.map((type) => (
          <MenuItem
            key={type.value}
            onClick={() => handleQuestionTypeChange(question.id, type.value)}
            sx={{ py: 1.5, fontSize: 14 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <type.icon fontSize="small" sx={{ color: "#5f6368" }} />
            </ListItemIcon>
            <ListItemText
              primary={type.label}
              primaryTypographyProps={{ fontSize: 14 }}
            />
            {type.isNew && (
              <Chip
                label="New"
                size="small"
                sx={{
                  backgroundColor: "#673ab7",
                  color: "white",
                  fontSize: "10px",
                  height: 18,
                  fontWeight: "bold",
                }}
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default QuestionCard;
