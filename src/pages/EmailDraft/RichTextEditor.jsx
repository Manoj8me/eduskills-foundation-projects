import React, { useState, useCallback } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import {
  Box,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormHelperText,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";

const RichTextEditor = ({ value, onChange, error, helperText }) => {
  const [editorState, setEditorState] = useState(() =>
    value && value.blocks
      ? EditorState.createWithContent(convertFromRaw(value))
      : EditorState.createEmpty()
  );

  const handleEditorChange = useCallback(
    (newEditorState) => {
      setEditorState(newEditorState);
      const contentState = newEditorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      onChange({ target: { name: "body", value: rawContent } });
    },
    [onChange]
  );

  const handleFormatClick = (format) => {
    const newState = RichUtils.toggleInlineStyle(editorState, format);
    handleEditorChange(newState);
  };

  const handleBlockTypeClick = (blockType) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    handleEditorChange(newState);
  };

  const handleAlignmentClick = (alignment) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    let newState = editorState;

    // Clear existing alignment
    currentStyle.forEach((style) => {
      if (style.startsWith("align-")) {
        newState = RichUtils.toggleInlineStyle(newState, style);
      }
    });

    // Apply new alignment
    if (alignment) {
      newState = RichUtils.toggleInlineStyle(newState, `align-${alignment}`);
    }

    handleEditorChange(newState);
  };

  const handleRemoveBullet = () => {
    const newState = RichUtils.toggleBlockType(editorState, "unstyled");
    handleEditorChange(newState);
  };

  const customKeyBinding = useCallback(
    (e) => {
      const { hasCommandModifier } = KeyBindingUtil;
      if (e.keyCode === 9 /* TAB */) {
        const newEditorState = RichUtils.onTab(
          e,
          editorState,
          4 /* maxDepth */
        );
        if (newEditorState !== editorState) {
          handleEditorChange(newEditorState);
          return "handled";
        }
      }
      if (
        e.keyCode === 8 /* BACKSPACE */ &&
        editorState.getCurrentContent().getBlockMap().first().getType() ===
          "unordered-list-item"
      ) {
        handleRemoveBullet();
        return "handled";
      }
      return getDefaultKeyBinding(e);
    },
    [editorState, handleEditorChange]
  );

  return (
    <FormControl error={error} fullWidth>
      <Box
        sx={{
          border: 1,
          borderColor: error ? "error.main" : "divider",
          borderRadius: 1,
          p: 1,
        }}
      >
        <Toolbar>
          <ToggleButtonGroup size="small" exclusive>
            <Tooltip title="Bold">
              <ToggleButton
                onClick={() => handleFormatClick("BOLD")}
                aria-label="bold"
              >
                <FormatBoldIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Italic">
              <ToggleButton
                onClick={() => handleFormatClick("ITALIC")}
                aria-label="italic"
              >
                <FormatItalicIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Underline">
              <ToggleButton
                onClick={() => handleFormatClick("UNDERLINE")}
                aria-label="underline"
              >
                <FormatUnderlinedIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Align Left">
              <ToggleButton
                onClick={() => handleAlignmentClick("left")}
                aria-label="align left"
              >
                <FormatAlignLeftIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Align Center">
              <ToggleButton
                onClick={() => handleAlignmentClick("center")}
                aria-label="align center"
              >
                <FormatAlignCenterIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Align Right">
              <ToggleButton
                onClick={() => handleAlignmentClick("right")}
                aria-label="align right"
              >
                <FormatAlignRightIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Bulleted List">
              <ToggleButton
                onClick={() => handleBlockTypeClick("unordered-list-item")}
                aria-label="bullet list"
              >
                <FormatListBulletedIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <ToggleButton
                onClick={() => handleBlockTypeClick("ordered-list-item")}
                aria-label="numbered list"
              >
                <FormatListNumberedIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Remove Bullet">
              <ToggleButton
                onClick={handleRemoveBullet}
                aria-label="remove bullet"
              >
                <DeleteForeverIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Toolbar>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            minHeight: "100px",
            padding: "8px",
            borderRadius: "4px",
            outline: "none",
            border: error ? "1px solid red" : "1px solid #ccc",
            overflowY: "auto",
          }}
        >
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            customKeyBindings={customKeyBinding}
            placeholder={
              editorState
                .getCurrentContent()
                .getBlockMap()
                .first()
                .getType() === "unordered-list-item"
                ? ""
                : "Type your text here..."
            }
          />
        </Box>
        {error && helperText && (
          <FormHelperText error>{helperText}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
};

export default RichTextEditor;
