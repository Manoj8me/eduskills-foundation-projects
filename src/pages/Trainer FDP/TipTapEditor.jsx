import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Box, IconButton, Divider } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from "@mui/icons-material";

const TipTapEditor = ({
  content,
  onChange,
  placeholder,
  multiline = false,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const toolbarRef = useRef(null);
  const editorRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Type something...",
      }),
    ],
    content: content || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onFocus: () => {
      setIsFocused(true);
      setShowToolbar(true);
    },
    onBlur: ({ event }) => {
      if (
        toolbarRef.current &&
        toolbarRef.current.contains(event.relatedTarget)
      ) {
        return;
      }
      setTimeout(() => {
        setIsFocused(false);
        setShowToolbar(false);
      }, 150);
    },
  });

  React.useEffect(() => {
    if (editor) {
      if (content !== editor.getHTML()) {
        editor.commands.setContent(content || "");
      }
    }
  }, [content, editor]);

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "");
    if (url === null) {
      return; // cancelled
    }
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const handleToolbarAction = (action) => {
    action();
    editor.commands.focus();
  };

  const ToolBar = () => (
    <Box
      ref={toolbarRef}
      onMouseDown={(e) => e.preventDefault()}
      sx={{
        display: "flex",
        gap: 0.5,
        p: 1,
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#f8f9fa",
        borderRadius: "0 0 4px 4px",
      }}
    >
      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() => editor.chain().focus().toggleBold().run())
        }
        sx={{
          backgroundColor: editor.isActive("bold") ? "#e3f2fd" : "transparent",
          color: editor.isActive("bold") ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive("bold") ? "#bbdefb" : "#e0e0e0",
          },
        }}
      >
        <FormatBold fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() => editor.chain().focus().toggleItalic().run())
        }
        sx={{
          backgroundColor: editor.isActive("italic")
            ? "#e3f2fd"
            : "transparent",
          color: editor.isActive("italic") ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive("italic") ? "#bbdefb" : "#e0e0e0",
          },
        }}
      >
        <FormatItalic fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() =>
            editor.chain().focus().toggleUnderline().run()
          )
        }
        sx={{
          backgroundColor: editor.isActive("underline")
            ? "#e3f2fd"
            : "transparent",
          color: editor.isActive("underline") ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive("underline")
              ? "#bbdefb"
              : "#e0e0e0",
          },
        }}
      >
        <FormatUnderlined fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() =>
            editor.chain().focus().toggleBulletList().run()
          )
        }
        sx={{
          backgroundColor: editor.isActive("bulletList")
            ? "#e3f2fd"
            : "transparent",
          color: editor.isActive("bulletList") ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive("bulletList")
              ? "#bbdefb"
              : "#e0e0e0",
          },
        }}
      >
        <FormatListBulleted fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() =>
            editor.chain().focus().toggleOrderedList().run()
          )
        }
        sx={{
          backgroundColor: editor.isActive("orderedList")
            ? "#e3f2fd"
            : "transparent",
          color: editor.isActive("orderedList") ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive("orderedList")
              ? "#bbdefb"
              : "#e0e0e0",
          },
        }}
      >
        <FormatListNumbered fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() =>
            editor.chain().focus().setTextAlign("left").run()
          )
        }
        sx={{
          backgroundColor: editor.isActive({ textAlign: "left" })
            ? "#e3f2fd"
            : "transparent",
          color: editor.isActive({ textAlign: "left" }) ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive({ textAlign: "left" })
              ? "#bbdefb"
              : "#e0e0e0",
          },
        }}
      >
        <FormatAlignLeft fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() =>
            editor.chain().focus().setTextAlign("center").run()
          )
        }
        sx={{
          backgroundColor: editor.isActive({ textAlign: "center" })
            ? "#e3f2fd"
            : "transparent",
          color: editor.isActive({ textAlign: "center" }) ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive({ textAlign: "center" })
              ? "#bbdefb"
              : "#e0e0e0",
          },
        }}
      >
        <FormatAlignCenter fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          handleToolbarAction(() =>
            editor.chain().focus().setTextAlign("right").run()
          )
        }
        sx={{
          backgroundColor: editor.isActive({ textAlign: "right" })
            ? "#e3f2fd"
            : "transparent",
          color: editor.isActive({ textAlign: "right" }) ? "#1976d2" : "#666",
          "&:hover": {
            backgroundColor: editor.isActive({ textAlign: "right" })
              ? "#bbdefb"
              : "#e0e0e0",
          },
        }}
      >
        <FormatAlignRight fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {editor.isActive("link") ? (
        <IconButton
          size="small"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleToolbarAction(removeLink)}
          sx={{
            backgroundColor: "#e3f2fd",
            color: "#1976d2",
            "&:hover": {
              backgroundColor: "#bbdefb",
            },
          }}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      ) : (
        <IconButton
          size="small"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleToolbarAction(addLink)}
          sx={{
            color: "#666",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box sx={{ position: "relative", width: "100%" }} ref={editorRef}>
      <Box
        sx={{
          border: isFocused ? "2px solid #4285f4" : "1px solid transparent",
          borderRadius: 1,
          minHeight: multiline ? 80 : 24,
          backgroundColor: disabled ? "#f5f5f5" : "white",
          "&:hover": !disabled
            ? {
                borderColor: isFocused ? "#4285f4" : "#dadce0",
              }
            : {},
          "& .ProseMirror": {
            outline: "none",
            fontSize: 14,
            lineHeight: 1.4,
            color: disabled ? "#999" : "#202124",
            minHeight: multiline ? 60 : 20,
            padding: "4px 8px",
            "& p": {
              margin: 0,
              "&:not(:last-child)": {
                marginBottom: "8px",
              },
            },
            "& ul": {
              listStyleType: "disc",
              margin: "8px 0",
              paddingLeft: "24px",
            },
            "& ol": {
              listStyleType: "decimal",
              margin: "8px 0",
              paddingLeft: "24px",
            },
            "& li": {
              marginBottom: "4px",
            },
            "& a": {
              color: "#1976d2",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "none",
              },
            },
            "& strong": {
              fontWeight: 600,
            },
            "& em": {
              fontStyle: "italic",
            },
            "& u": {
              textDecoration: "underline",
            },
            "&[data-placeholder]::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: "#aaa",
              pointerEvents: "none",
              height: 0,
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
      {showToolbar && !disabled && <ToolBar />}
    </Box>
  );
};

export default TipTapEditor;
