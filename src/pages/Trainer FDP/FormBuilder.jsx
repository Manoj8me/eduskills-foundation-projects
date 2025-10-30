import React, { useState } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  Add,
  Apps,
  TextFields,
  Image,
  VideoLibrary,
  Subject,
  Preview,
  Edit,
  Send,
} from "@mui/icons-material";
import {
  ShortText,
  RadioButtonChecked,
  CheckBox,
  ArrowDropDownCircle,
  LinearScale,
  Star,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import TipTapEditor from "./TipTapEditor";
import QuestionCard from "./QuestionCard";
import PreviewMode from "./PreviewMode";

const GoogleFormsClone = () => {
  const [form, setForm] = useState({
    title: "Untitled form",
    description: "Form description",
    questions: [
      {
        id: 1,
        title: "Question",
        type: "multiple-choice",
        required: false,
        options: ["Option 1"],
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: "Not satisfied",
        scaleMaxLabel: "Very satisfied",
        rows: ["Row 1"],
        columns: ["Column 1"],
      },
    ],
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [questionTypeMenu, setQuestionTypeMenu] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [responses, setResponses] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const questionTypes = [
    { value: "short-answer", label: "Short answer", icon: ShortText },
    { value: "paragraph", label: "Paragraph", icon: Subject },
    {
      value: "multiple-choice",
      label: "Multiple choice",
      icon: RadioButtonChecked,
    },
    { value: "checkboxes", label: "Checkboxes", icon: CheckBox },
    { value: "dropdown", label: "Dropdown", icon: ArrowDropDownCircle },
    { value: "linear-scale", label: "Linear scale", icon: LinearScale },
    { value: "rating", label: "Rating", icon: Star, isNew: true },
    {
      value: "multiple-choice-grid",
      label: "Multiple choice grid",
      icon: Apps,
    },
    { value: "checkbox-grid", label: "Checkbox grid", icon: Apps },
    { value: "date", label: "Date", icon: CalendarToday },
    { value: "time", label: "Time", icon: AccessTime },
  ];

  // Drag and Drop Functions
  const handleDragStart = (e, questionId) => {
    setDraggedItem(questionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetQuestionId) => {
    e.preventDefault();
    if (draggedItem === targetQuestionId) return;

    setForm((prev) => {
      const questions = [...prev.questions];
      const draggedIndex = questions.findIndex((q) => q.id === draggedItem);
      const targetIndex = questions.findIndex((q) => q.id === targetQuestionId);

      const [draggedQuestion] = questions.splice(draggedIndex, 1);
      questions.splice(targetIndex, 0, draggedQuestion);

      return { ...prev, questions };
    });
    setDraggedItem(null);
  };

  // Question Management Functions
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      title: "Question",
      type: "multiple-choice",
      required: false,
      options: ["Option 1"],
      scaleMin: 1,
      scaleMax: 5,
      scaleMinLabel: "Not satisfied",
      scaleMaxLabel: "Very satisfied",
      rows: ["Row 1"],
      columns: ["Column 1"],
    };
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setActiveQuestion(newQuestion.id);
  };

  const addTitleDescription = () => {
    const newTitleDescription = {
      id: Date.now(),
      title: "Title",
      type: "title-description",
      description: "Description",
      required: false,
    };
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newTitleDescription],
    }));
    setActiveQuestion(newTitleDescription.id);
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: "Section Title",
      type: "section",
      description: "Section description",
      required: false,
    };
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newSection],
    }));
    setActiveQuestion(newSection.id);
  };

  const addImage = () => {
    const newImage = {
      id: Date.now(),
      title: "Image",
      type: "image",
      description: "Click to add image",
      required: false,
    };
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newImage],
    }));
    setActiveQuestion(newImage.id);
  };

  const addVideo = () => {
    const newVideo = {
      id: Date.now(),
      title: "Video",
      type: "video",
      description: "Click to add video",
      required: false,
    };
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newVideo],
    }));
    setActiveQuestion(newVideo.id);
  };

  const duplicateQuestion = (questionId) => {
    const questionToDupe = form.questions.find((q) => q.id === questionId);
    if (questionToDupe) {
      const newQuestion = { ...questionToDupe, id: Date.now() };
      const questionIndex = form.questions.findIndex(
        (q) => q.id === questionId
      );
      setForm((prev) => ({
        ...prev,
        questions: [
          ...prev.questions.slice(0, questionIndex + 1),
          newQuestion,
          ...prev.questions.slice(questionIndex + 1),
        ],
      }));
    }
  };

  const deleteQuestion = (questionId) => {
    if (form.questions.length === 1) return;
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
    if (activeQuestion === questionId) {
      setActiveQuestion(form.questions[0]?.id || null);
    }
  };

  const updateQuestion = (questionId, updates) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  // Option Management Functions
  const addOption = (questionId) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.options) {
      const newOption = `Option ${question.options.length + 1}`;
      updateQuestion(questionId, {
        options: [...question.options, newOption],
      });
    }
  };

  const updateOption = (questionId, optionIndex, value) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.options) {
      const updatedOptions = [...question.options];
      updatedOptions[optionIndex] = value;
      updateQuestion(questionId, { options: updatedOptions });
    }
  };

  const removeOption = (questionId, optionIndex) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.options && question.options.length > 1) {
      const updatedOptions = question.options.filter(
        (_, index) => index !== optionIndex
      );
      updateQuestion(questionId, { options: updatedOptions });
    }
  };

  // Row/Column Management Functions
  const addRow = (questionId) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.rows) {
      const newRow = `Row ${question.rows.length + 1}`;
      updateQuestion(questionId, {
        rows: [...question.rows, newRow],
      });
    }
  };

  const addColumn = (questionId) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.columns) {
      const newColumn = `Column ${question.columns.length + 1}`;
      updateQuestion(questionId, {
        columns: [...question.columns, newColumn],
      });
    }
  };

  const updateRow = (questionId, rowIndex, value) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.rows) {
      const updatedRows = [...question.rows];
      updatedRows[rowIndex] = value;
      updateQuestion(questionId, { rows: updatedRows });
    }
  };

  const updateColumn = (questionId, columnIndex, value) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.columns) {
      const updatedColumns = [...question.columns];
      updatedColumns[columnIndex] = value;
      updateQuestion(questionId, { columns: updatedColumns });
    }
  };

  const removeRow = (questionId, rowIndex) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.rows && question.rows.length > 1) {
      const updatedRows = question.rows.filter(
        (_, index) => index !== rowIndex
      );
      updateQuestion(questionId, { rows: updatedRows });
    }
  };

  const removeColumn = (questionId, columnIndex) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.columns && question.columns.length > 1) {
      const updatedColumns = question.columns.filter(
        (_, index) => index !== columnIndex
      );
      updateQuestion(questionId, { columns: updatedColumns });
    }
  };

  const handleQuestionTypeChange = (questionId, newType) => {
    const updates = { type: newType };
    if (["multiple-choice", "checkboxes", "dropdown"].includes(newType)) {
      updates.options = ["Option 1"];
    } else if (["multiple-choice-grid", "checkbox-grid"].includes(newType)) {
      updates.rows = ["Row 1"];
      updates.columns = ["Column 1"];
    }
    updateQuestion(questionId, updates);
    setQuestionTypeMenu(null);
  };

  // Response Functions for Preview Mode
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    const currentValues = responses[questionId] || [];
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v) => v !== option);
    handleResponseChange(questionId, newValues);
  };

  const handleGridResponse = (questionId, row, column, isCheckbox = false) => {
    const currentResponses = responses[questionId] || {};
    if (isCheckbox) {
      const currentRowResponses = currentResponses[row] || [];
      const newRowResponses = currentRowResponses.includes(column)
        ? currentRowResponses.filter((col) => col !== column)
        : [...currentRowResponses, column];
      handleResponseChange(questionId, {
        ...currentResponses,
        [row]: newRowResponses,
      });
    } else {
      handleResponseChange(questionId, {
        ...currentResponses,
        [row]: column,
      });
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", { form, responses });
    setShowSuccess(true);
  };

  // Render Functions
  // Render Functions
  const renderSideToolbar = () => (
    <Box
      sx={{
        position: "absolute",
        right: -60,
        top: 0,
        display: "flex",
        flexDirection: "column",
        gap: 0.8,
        zIndex: 1000,
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
          p: 0.8,
          borderRadius: 1.5,
          boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
        }}
      >
        <Tooltip title="Add question" placement="left">
          <Fab
            size="small"
            onClick={addQuestion}
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "white",
              color: "#5f6368",
              boxShadow: "none",
              minHeight: 36,
              "&:hover": {
                backgroundColor: "#f8f9fa",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            <Add />
          </Fab>
        </Tooltip>
        <Tooltip title="Import questions" placement="left">
          <Fab
            size="small"
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "white",
              color: "#5f6368",
              boxShadow: "none",
              minHeight: 36,
              "&:hover": {
                backgroundColor: "#f8f9fa",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            <Apps />
          </Fab>
        </Tooltip>
        <Tooltip title="Add title and description" placement="left">
          <Fab
            size="small"
            onClick={addTitleDescription}
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "white",
              color: "#5f6368",
              boxShadow: "none",
              minHeight: 36,
              "&:hover": {
                backgroundColor: "#f8f9fa",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            <TextFields />
          </Fab>
        </Tooltip>
        <Tooltip title="Add image" placement="left">
          <Fab
            size="small"
            onClick={addImage}
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "white",
              color: "#5f6368",
              boxShadow: "none",
              minHeight: 36,
              "&:hover": {
                backgroundColor: "#f8f9fa",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            <Image />
          </Fab>
        </Tooltip>
        <Tooltip title="Add video" placement="left">
          <Fab
            size="small"
            onClick={addVideo}
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "white",
              color: "#5f6368",
              boxShadow: "none",
              minHeight: 36,
              "&:hover": {
                backgroundColor: "#f8f9fa",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            <VideoLibrary />
          </Fab>
        </Tooltip>
        <Tooltip title="Add section" placement="left">
          <Fab
            size="small"
            onClick={addSection}
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "white",
              color: "#5f6368",
              boxShadow: "none",
              minHeight: 36,
              "&:hover": {
                backgroundColor: "#f8f9fa",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            }}
          >
            <Subject />
          </Fab>
        </Tooltip>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: "#f1f3f4", minHeight: "100vh" }}>
      {/* Preview Toggle Button */}
      <Button
        variant="contained"
        startIcon={isPreview ? <Edit /> : <Preview />}
        onClick={() => setIsPreview(!isPreview)}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1001,
          backgroundColor: "#673ab7",
          "&:hover": {
            backgroundColor: "#5e35b1",
          },
        }}
      >
        {isPreview ? "Edit Form" : "Preview"}
      </Button>

      <Container maxWidth="md" sx={{ pt: 5, pb: 8 }}>
        {/* Form Header */}
        <Paper
          sx={{
            borderRadius: "8px",
            borderTop: "8px solid #673ab7",
            mb: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3 }}>
            {isPreview ? (
              <>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
                  <div dangerouslySetInnerHTML={{ __html: form.title }} />
                </Typography>
                <Typography variant="body1" sx={{ color: "#5f6368" }}>
                  <div dangerouslySetInnerHTML={{ __html: form.description }} />
                </Typography>
              </>
            ) : (
              <>
                <Box sx={{ mb: 2 }}>
                  <TipTapEditor
                    content={form.title}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, title: value }))
                    }
                    placeholder="Untitled form"
                  />
                </Box>
                <TipTapEditor
                  content={form.description}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  }
                  placeholder="Form description"
                  multiline={true}
                />
              </>
            )}
          </Box>
        </Paper>

        {/* Questions */}
        <Box sx={{ position: "relative" }}>
          {isPreview ? (
            <>
              <PreviewMode
                form={form}
                responses={responses}
                handleResponseChange={handleResponseChange}
                handleCheckboxChange={handleCheckboxChange}
                handleGridResponse={handleGridResponse}
              />
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  startIcon={<Send />}
                  sx={{
                    backgroundColor: "#673ab7",
                    "&:hover": {
                      backgroundColor: "#5e35b1",
                    },
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setResponses({})}
                  sx={{
                    borderColor: "#673ab7",
                    color: "#673ab7",
                    "&:hover": {
                      borderColor: "#5e35b1",
                      backgroundColor: "rgba(103, 58, 183, 0.04)",
                    },
                  }}
                >
                  Clear form
                </Button>
              </Box>
            </>
          ) : (
            form.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                activeQuestion={activeQuestion}
                questionTypes={questionTypes}
                questionTypeMenu={questionTypeMenu}
                setQuestionTypeMenu={setQuestionTypeMenu}
                setActiveQuestion={setActiveQuestion}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                updateQuestion={updateQuestion}
                duplicateQuestion={duplicateQuestion}
                deleteQuestion={deleteQuestion}
                handleQuestionTypeChange={handleQuestionTypeChange}
                updateOption={updateOption}
                removeOption={removeOption}
                addOption={addOption}
                updateRow={updateRow}
                removeRow={removeRow}
                addRow={addRow}
                updateColumn={updateColumn}
                removeColumn={removeColumn}
                addColumn={addColumn}
                renderSideToolbar={renderSideToolbar}
              />
            ))
          )}

          {/* Show sidebar only when not in preview mode and no question is active */}
          {!isPreview &&
            !form.questions.some((q) => q.id === activeQuestion) &&
            renderSideToolbar()}
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Form submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GoogleFormsClone;
