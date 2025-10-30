

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";

import {
  getAcademyModules,
  getAcademySteps,
  addAcademyModule,
  addAcademyStep,
  updateAcademyStep,
  updateAcademyModule,
  saveStepDocument,
} from "./api";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";

// ================= Modules Table =================
const ModulesTable = ({ modules, onViewDetails, onUpdate }) => (
  <TableContainer component={Paper} elevation={2}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead sx={{ backgroundColor: "primary.main" }}>
        <TableRow>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Seq No
          </TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Module Name
          </TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Created Date
          </TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {modules.map((module, index) => (
          <TableRow
            key={module.module_id}
            sx={{ "&:hover": { backgroundColor: "action.hover" } }}
          >
            <TableCell>{module.module_sequence_number || index + 1}</TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SchoolIcon color="primary" /> {module.module_subject}
              </Box>
            </TableCell>
            <TableCell>
              <Chip
                label={new Date(module.created_at).toLocaleDateString()}
                variant="outlined"
                color="primary"
                size="small"
              />
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  size="small"
                  onClick={() => onViewDetails(module)}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => onUpdate(module)}
                >
                  Update
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// ================= Update Module Dialog =================
const UpdateModuleDialog = ({ open, onClose, module, onUpdate }) => {
  const [moduleName, setModuleName] = useState("");
  const [moduleSeq, setModuleSeq] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (module) {
      setModuleName(module.module_subject || "");
      setModuleSeq(module.module_sequence_number?.toString() || "");
    }
  }, [module]);

  const handleUpdate = async () => {
    if (!moduleName || !moduleSeq) {
      alert("Please enter both module name and sequence number");
      return;
    }

    try {
      setUpdating(true);
      await updateAcademyModule({
        moduleNumber: module.module_id,
        moduleSequenceNumber: parseInt(moduleSeq),
        moduleSubject: moduleName,
      });
      
      alert("Module updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to update module:", err);
      alert("Failed to update module");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Module</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Module Name"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Sequence Number"
          type="number"
          value={moduleSeq}
          onChange={(e) => setModuleSeq(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ================= Update Step Dialog =================
const UpdateStepDialog = ({ open, onClose, step, onUpdate }) => {
  const [stepName, setStepName] = useState("");
  const [stepNumber, setStepNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (step) {
      setStepName(step.steps_subject || step.name || "");
      setStepNumber(step.steps_sequence_number?.toString() || step.step_number || "");
    }
  }, [step]);

  const handleUpdate = async () => {
    if (!stepName || !stepNumber) {
      alert("Please enter both step name and step number");
      return;
    }

    try {
      setUpdating(true);
      await updateAcademyStep({
        stepNumber: step.step_id || step.id,
        stepsSequenceNumber: parseInt(stepNumber),
        stepsSubject: stepName,
      });
      
      alert("Step updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to update step:", err);
      alert("Failed to update step");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Step</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Step Name"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Step Number"
          value={stepNumber}
          onChange={(e) => setStepNumber(e.target.value)}
          fullWidth
          placeholder="Enter step number like 1.1.1"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


// ================= Steps Table =================
const StepsTable = ({
  steps,
  module,
  onBack,
  onViewStepDetails,
  onUpdateStep,
  onAddStep,
}) => {
  const [openAddStepDialog, setOpenAddStepDialog] = useState(false);
  const [openUpdateStepDialog, setOpenUpdateStepDialog] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [newStepName, setNewStepName] = useState("");
  const [newStepNumber, setNewStepNumber] = useState("");
  const [localSteps, setLocalSteps] = useState([]);

  // Initialize localSteps when steps prop changes
  useEffect(() => {
    setLocalSteps(steps);
  }, [steps]);

  const handleQuizToggle = async (step) => {
    try {
      const stepId = step.step_id || step.id;
      const currentValue = step.isquiz;
      const newValue = currentValue === 1 || currentValue === "1" ? 0 : 1;
      
      // Update the API
      await updateAcademyStep({
        stepNumber: stepId,
        isquiz: newValue.toString(),
      });
      
      // Update local state correctly - only update the specific step
      setLocalSteps(prevSteps => 
        prevSteps.map(s => {
          const currentStepId = s.step_id || s.id;
          if (currentStepId === stepId) {
            return { ...s, isquiz: newValue };
          }
          return s;
        })
      );
      
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz status");
    }
  };

  const handleAddStepSubmit = async () => {
    if (!newStepName || !newStepNumber) {
      alert("Please enter both step name and step number");
      return;
    }

    try {
      await addAcademyStep({
        moduleNumber: module.module_id,
        stepsSequenceNumber: parseInt(newStepNumber),
        stepsSubject: newStepName,
      });
      
      alert("Step added successfully");
      setOpenAddStepDialog(false);
      setNewStepName("");
      setNewStepNumber("");
      onAddStep(); // Refresh the steps list
    } catch (err) {
      console.error("Failed to add step:", err);
      alert("Failed to add step");
    }
  };

  const handleUpdateStepClick = (step) => {
    setSelectedStep(step);
    setOpenUpdateStepDialog(true);
  };

  const handleStepUpdate = () => {
    onAddStep(); // Refresh steps list
    setOpenUpdateStepDialog(false);
    setSelectedStep(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Back to Modules
        </Button>
        <Typography variant="h5">
          Steps for: {module?.module_subject}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpenAddStepDialog(true)}
        >
          Add Step
        </Button>
      </Box>

      {/* Add Step Dialog */}
      <Dialog 
        open={openAddStepDialog} 
        onClose={() => setOpenAddStepDialog(false)}
      >
        <DialogTitle>Add New Step</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Step Name"
            value={newStepName}
            onChange={(e) => setNewStepName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Step Number"
            value={newStepNumber}
            onChange={(e) => setNewStepNumber(e.target.value)}
            fullWidth
            placeholder="Enter step number (e.g., 1)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddStepDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddStepSubmit}>
            Add Step
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Step Dialog */}
      <UpdateStepDialog
        open={openUpdateStepDialog}
        onClose={() => setOpenUpdateStepDialog(false)}
        step={selectedStep}
        onUpdate={handleStepUpdate}
      />

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "secondary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Step No
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Step Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Quiz
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Created Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localSteps.map((step, index) => (
              <TableRow
                key={step.step_id || step.id}
                sx={{ "&:hover": { backgroundColor: "action.hover" } }}
              >
                <TableCell>{step.steps_sequence_number || step.step_number || index + 1}</TableCell>
                <TableCell>{step.steps_subject || step.name}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={step.isquiz === 1 || step.isquiz === "1"}
                        onChange={() => handleQuizToggle(step)}
                        color="primary"
                      />
                    }
                    label={step.isquiz === 1 || step.isquiz === "1" ? "Yes" : "No"}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={new Date(
                      step.created_at || step.createdDate
                    ).toLocaleDateString()}
                    variant="outlined"
                    color="secondary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      size="small"
                      onClick={() => onViewStepDetails(step)}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      size="small"
                      onClick={() => handleUpdateStepClick(step)}
                    >
                      Update
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};


// ================= Step Content =================
const StepContent = ({ step, module, onBackToSteps }) => {
  const theme = useTheme();
  // Remove local isquiz state and use step prop directly
  const isquiz = step?.isquiz === 1 || step?.isquiz === "1";
  const [content, setContent] = useState(step?.content || "");
  const [saving, setSaving] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  // Quiz state
  const [openQuizPopup, setOpenQuizPopup] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizList, setQuizList] = useState([]);

  // Function to fetch process document content
  const fetchProcessDocument = async (filename) => {
    if (!filename) return null;
    
    try {
      setLoadingContent(true);
      const prefix = "https://erpapi.eduskillsfoundation.org/ongoing/";
      const fileUrl = prefix + filename;
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status}`);
      }
      
      const content = await response.text();
      return content;
    } catch (error) {
      console.error("Error fetching process document:", error);
      return null;
    } finally {
      setLoadingContent(false);
    }
  };

  // Initialize quiz data and content based on step data
  useEffect(() => {
    const initializeStepData = async () => {
      if (isquiz) {
        // Parse and load existing quiz data
        if (step.quiz && step.quiz !== "null" && step.quiz !== null) {
          try {
            const parsedQuiz = JSON.parse(step.quiz);
            setQuizList(Array.isArray(parsedQuiz) ? parsedQuiz : []);
            if (Array.isArray(parsedQuiz) && parsedQuiz.length > 0) {
              setQuizQuestions(parsedQuiz.map(q => ({
                question_id: q.question_id,
                question: q.question,
                answers: q.answers.map(answer => ({
                  answer_id: answer.answer_id,
                  answer: answer.answer
                })),
                correctAnswerId: q.correct_answer_id
              })));
            } else {
              setQuizQuestions([{
                question_id: uuidv4(),
                question: "",
                answers: [{ answer_id: uuidv4(), answer: "" }],
                correctAnswerId: null,
              }]);
            }
          } catch (error) {
            console.error("Error parsing quiz data:", error);
            setQuizList([]);
            setQuizQuestions([{
              question_id: uuidv4(),
              question: "",
              answers: [{ answer_id: uuidv4(), answer: "" }],
              correctAnswerId: null,
            }]);
          }
        } else {
          setQuizList([]);
          setQuizQuestions([{
            question_id: uuidv4(),
            question: "",
            answers: [{ answer_id: uuidv4(), answer: "" }],
            correctAnswerId: null,
          }]);
        }
      } else {
        // If not quiz mode, check if we have process_document_filename
        if (step?.process_document_filename && !content) {
          const documentContent = await fetchProcessDocument(step.process_document_filename);
          if (documentContent) {
            setContent(documentContent);
          }
        }
        // Clear quiz data when switching from quiz to content mode
        setQuizList([]);
        setQuizQuestions([]);
      }
    };

    initializeStepData();
  }, [step, isquiz, content]); // Add isquiz to dependencies

  const handleSaveContent = async () => {
    try {
      setSaving(true);
      
      // Use the academySaveDocuments API to save content
      await saveStepDocument({
        stepNumber: step?.step_id || step?.id,
        processDocument: content,
      });
      
      alert("✅ Content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("❌ Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleQuiz = async () => {
    try {
      const newValue = isquiz ? "0" : "1";
      await updateAcademyStep({
        stepNumber: step?.step_id || step?.id,
        isquiz: newValue,
      });
      
      // Instead of using local state, we rely on the parent component to refresh the step data
      // The isquiz value will be updated when the parent re-fetches the step data
      alert(`✅ Quiz ${!isquiz ? "enabled" : "disabled"}`);
      
      // Force a refresh by calling the parent's refresh function if available
      // or we can trigger a window reload (temporary solution)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error toggling quiz:", error);
      alert("❌ Failed to update quiz status");
    }
  };

// Quiz question handlers
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index].question = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[qIndex].answers[aIndex].answer = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleAddAnswer = (qIndex) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[qIndex].answers.push({ answer_id: uuidv4(), answer: "" });
    setQuizQuestions(updatedQuestions);
  };

  const handleRemoveAnswer = (qIndex, aIndex) => {
    const updatedQuestions = [...quizQuestions];
    const removedAnswer = updatedQuestions[qIndex].answers[aIndex];

    updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter(
      (_, i) => i !== aIndex
    );

    if (removedAnswer.answer_id === updatedQuestions[qIndex].correctAnswerId) {
      updatedQuestions[qIndex].correctAnswerId = null;
    }

    setQuizQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        question_id: uuidv4(),
        question: "",
        answers: [{ answer_id: uuidv4(), answer: "" }],
        correctAnswerId: null,
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (quizQuestions.length === 1) {
      alert("At least one question is required");
      return;
    }
    const updatedQuestions = quizQuestions.filter((_, i) => i !== index);
    setQuizQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updatedQuizList = quizList.filter(q => q.question_id !== questionId);
      setQuizList(updatedQuizList);
      
      try {
        await updateAcademyStep({
          stepNumber: step?.step_id || step?.id,
          quiz: JSON.stringify(updatedQuizList),
          isquiz: "1",
        });
        alert("✅ Question deleted successfully!");
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("❌ Failed to delete question");
        setQuizList(quizList);
      }
    }
  };

  const handleAddQuiz = () => {
    setQuizQuestions([{
      question_id: uuidv4(),
      question: "",
      answers: [{ answer_id: uuidv4(), answer: "" }],
      correctAnswerId: null,
    }]);
    setOpenQuizPopup(true);
  };

  const handleUpdateQuiz = () => {
    if (quizList.length > 0) {
      setQuizQuestions(quizList.map(q => ({
        question_id: q.question_id,
        question: q.question,
        answers: q.answers.map(answer => ({
          answer_id: answer.answer_id,
          answer: answer.answer
        })),
        correctAnswerId: q.correct_answer_id
      })));
    }
    setOpenQuizPopup(true);
  };

  const handleSaveQuiz = async () => {
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} is required`);
        return;
      }
      if (!q.correctAnswerId) {
        alert(`Please select correct answer for Question ${i + 1}`);
        return;
      }
      if (q.answers.length < 2) {
        alert(`Question ${i + 1} needs at least 2 options`);
        return;
      }
      for (let j = 0; j < q.answers.length; j++) {
        if (!q.answers[j].answer.trim()) {
          alert(`Option ${j + 1} for Question ${i + 1} is required`);
          return;
        }
      }
    }

    try {
      setQuizSaving(true);
      const formattedQuestions = quizQuestions.map((q) => ({
        question_id: q.question_id,
        question: q.question,
        correct_answer_id: q.correctAnswerId,
        answers: q.answers,
      }));

      await updateAcademyStep({
        stepNumber: step?.step_id || step?.id,
        quiz: JSON.stringify(formattedQuestions),
        isquiz: "1",
      });

      setQuizList(formattedQuestions);
      setOpenQuizPopup(false);

      alert(`✅ ${formattedQuestions.length} question(s) saved successfully!`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("❌ Failed to save quiz");
    } finally {
      setQuizSaving(false);
    }
  };

  const resetQuizForm = () => {
    setOpenQuizPopup(false);
  };

  return (
    <Box>
      {/* Header with Back Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={onBackToSteps}
          >
            Back to Steps
          </Button>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" fontWeight="bold">
              {step?.steps_subject || step?.name}
            </Typography> 
            <Typography variant="body2" color="text.secondary">
              Module: {module?.module_subject} • Week: Week{" "}
              {module?.week_number || "1"}
            </Typography>
            {step?.process_document_filename && (
              <Typography variant="caption" color="primary" sx={{ mt: 0.5 }}>
                Document: {step.process_document_filename}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* <FormControlLabel
            control={<Switch checked={isquiz} onChange={handleToggleQuiz} />}
            label="Quiz"
          /> */}
          {isquiz && (
            <>
              {quizList.length === 0 ? (
                <Button 
                  variant="outlined" 
                  onClick={handleAddQuiz}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.mode === 'dark' ? '#555' : '#1976d2',
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' ? '#777' : '#1565c0',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(25, 118, 210, 0.04)',
                    }
                  }}
                >
                  Add Quiz
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  onClick={handleUpdateQuiz}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.mode === 'dark' ? '#555' : '#1976d2',
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' ? '#777' : '#1565c0',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(25, 118, 210, 0.04)',
                    }
                  }}
                >
                  Update Quiz
                </Button>
              )}
            </>
          )}
          {!isquiz && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#00c853",
                "&:hover": { backgroundColor: "#00b34a" },
              }}
              onClick={handleSaveContent}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Content"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Content or Quiz Mode - this now uses the derived isquiz value */}
      {isquiz ? (
        <Box
          sx={{
            maxHeight: "90vh",
            overflowY: "auto",
            padding: 2,
            scrollbarWidth: "thin",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quiz Mode: Create and Manage Quiz
          </Typography>

          {quizList.length > 0 ? (
            quizList.map((q, idx) => (
              <Card key={q.question_id} elevation={1} sx={{ mb: 2, p: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography fontWeight="bold" variant="h6">
                      {idx + 1}. {q.question}
                    </Typography>
                    <Box>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteQuestion(q.question_id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                    {q.answers.map((a) => (
                      <li 
                        key={a.answer_id}
                        style={{
                          fontWeight: a.answer_id === q.correct_answer_id ? 'bold' : 'normal',
                          color: a.answer_id === q.correct_answer_id ? 'green' : 'inherit',
                          listStyleType: 'none',
                          position: 'relative',
                          paddingLeft: '20px'
                        }}
                      >
                        <span 
                          style={{
                            position: 'absolute',
                            left: 0,
                            color: a.answer_id === q.correct_answer_id ? 'green' : '#666'
                          }}
                        >
                          {a.answer_id === q.correct_answer_id ? '✓' : '○'}
                        </span>
                        {a.answer}
                      </li>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No quizzes added yet. Click "Add Quiz" to create your first quiz question.</Typography>
          )}
        </Box>
      ) : (
        <>
          {/* Editor */}
          <Card elevation={2} sx={{ mb: 2 }}>
            <CardContent>
              {loadingContent ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading document content...</Typography>
                </Box>
              ) : (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="Write your step content here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["blockquote", "code-block"],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "blockquote",
                    "code-block",
                    "link",
                    "image",
                  ]}
                  style={{ height: "300px" }}
                />
              )}
            </CardContent>
          </Card>

          {/* HTML Debug */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              HTML Content (Debug)
            </Typography>
            <Card elevation={1}>
              <CardContent
                sx={{
                  backgroundColor: "#f9f9f9",
                  minHeight: "100px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {content || "<Empty content>"}
              </CardContent>
            </Card>
          </Box>
        </>
      )}

      {/* Quiz Popup - rest of the component remains the same */}
       <Dialog
        open={openQuizPopup}
        onClose={resetQuizForm}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            maxHeight: "90vh",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}>
          {quizList.length === 0 ? "Add Quiz Questions" : "Update Quiz Questions"}
          <Typography variant="body2" color="text.secondary">
            {`Total Questions: ${quizQuestions.length}`}
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            maxHeight: "60vh",
            overflow: "auto",
            padding: "8px 16px",
            backgroundColor: theme.palette.background.paper,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: theme.palette.mode === 'dark' ? '#424242' : '#f1f1f1',
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.mode === 'dark' ? '#757575' : '#c1c1c1',
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: theme.palette.mode === 'dark' ? '#9e9e9e' : '#a8a8a8',
            },
          }}
        >
          {quizQuestions.map((q, qIndex) => (
            <Card
              key={q.question_id}
              variant="outlined"
              sx={{
                p: 2,
                minHeight: "fit-content",
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.mode === 'dark' ? '#555' : '#e0e0e0',
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                  gap: 1,
                }}
              >
                <Typography variant="h6" sx={{ flex: 1, color: theme.palette.text.primary }}>
                  Question {qIndex + 1}
                </Typography>
                {quizQuestions.length > 1 && (
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Remove Question
                  </Button>
                )}
              </Box>

              <TextField
                label="Question"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                size="small"
                InputProps={{
                  sx: {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.paper,
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.text.primary,
                  }
                }}
              />

              <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
                Options:
              </Typography>

              {q.answers.map((opt, aIndex) => (
                <Box
                  key={opt.answer_id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <TextField
                    label={`Option ${aIndex + 1}`}
                    value={opt.answer}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                    fullWidth
                    size="small"
                    multiline
                    maxRows={2}
                    InputProps={{
                      sx: {
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.background.paper,
                      }
                    }}
                    InputLabelProps={{
                      sx: {
                        color: theme.palette.text.primary,
                      }
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={opt.answer_id === q.correctAnswerId}
                        onChange={() => {
                          const updatedQuestions = [...quizQuestions];
                          updatedQuestions[qIndex].correctAnswerId =
                            opt.answer_id;
                          setQuizQuestions(updatedQuestions);
                        }}
                        color="primary"
                      />
                    }
                    label="Correct"
                    sx={{ 
                      mr: 0, 
                      minWidth: "90px",
                      color: theme.palette.text.primary 
                    }}
                  />
                  {q.answers.length > 1 && (
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                      sx={{ minWidth: "auto", px: 1 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}

              <Button
                onClick={() => handleAddAnswer(qIndex)}
                sx={{ mt: 1 }}
                size="small"
                variant="outlined"
              >
                + Add Option
              </Button>
            </Card>
          ))}

          <Button
            onClick={handleAddQuestion}
            variant="outlined"
            sx={{ mt: 1, alignSelf: "flex-start" }}
            size="small"
          >
            + Add Another Question
          </Button>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1, backgroundColor: theme.palette.background.paper }}>
          <Button onClick={resetQuizForm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveQuiz}
            disabled={quizSaving}
          >
            {quizSaving
              ? "Saving..."
              : quizList.length === 0 
                ? `Add ${quizQuestions.length} Questions` 
                : `Update ${quizQuestions.length} Questions`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ================= Main Component =================
// const Modules = () => {
//   const { week_id } = useParams();
//   const weekNumber = Number(week_id);
//   const [modules, setModules] = useState([]);
//   const [steps, setSteps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentView, setCurrentView] = useState("modules");
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [selectedStep, setSelectedStep] = useState(null);

//   const [openAddModule, setOpenAddModule] = useState(false);
//   const [openUpdateModule, setOpenUpdateModule] = useState(false);
//   const [selectedModuleForUpdate, setSelectedModuleForUpdate] = useState(null);
//   const [newModuleName, setNewModuleName] = useState("");
//   const [newModuleSeq, setNewModuleSeq] = useState("");

//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const modulesResponse = await getAcademyModules(weekNumber);
//         let modulesData =
//           modulesResponse.academyModules || modulesResponse || [];
//         setModules(modulesData);
//       } catch (err) {
//         setError(err.message || "Failed to load modules");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchModules();
//   }, [weekNumber]);

//   const handleViewModuleDetails = async (module) => {
//     try {
//       setLoading(true);
//       const stepsResponse = await getAcademySteps(module.module_id);
//       const stepsData = stepsResponse.academySteps || stepsResponse || [];
//       setSteps(stepsData);
//       setSelectedModule(module);
//       setCurrentView("steps");
//     } catch (err) {
//       setError("Failed to load steps");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateModuleClick = (module) => {
//     setSelectedModuleForUpdate(module);
//     setOpenUpdateModule(true);
//   };

//   const handleModuleUpdate = async () => {
//     const modulesResponse = await getAcademyModules(weekNumber);
//     setModules(modulesResponse.academyModules || modulesResponse || []);
//     setOpenUpdateModule(false);
//     setSelectedModuleForUpdate(null);
//   };

//   const handleUpdateStep = (step) => {
//     // This is now handled in the StepsTable component
//   };

//   const handleViewStepDetails = (step) => {
//     setSelectedStep(step);
//     setCurrentView("step-content");
//   };

//   const handleBackToModules = () => {
//     setCurrentView("modules");
//     setSelectedModule(null);
//     setSteps([]);
//   };

//   const handleBackToSteps = () => {
//     setCurrentView("steps");
//     setSelectedStep(null);
//   };

//   const handleAddModule = async () => {
//     try {
//       if (!newModuleName || !newModuleSeq) return alert("Enter all fields");
//       await addAcademyModule({
//         weekNumber: weekNumber,
//         moduleSequenceNumber: parseInt(newModuleSeq),
//         moduleSubject: newModuleName,
//       });
//       setOpenAddModule(false);
//       setNewModuleName("");
//       setNewModuleSeq("");
//       const modulesResponse = await getAcademyModules(weekNumber);
//       setModules(modulesResponse.academyModules || modulesResponse || []);
//     } catch (err) {
//       alert("Failed to add module");
//     }
//   };

//   const handleAddStep = async () => {
//     handleViewModuleDetails(selectedModule);
//   };

//   if (loading && currentView === "modules")
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           height: "100vh",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//           gap: 2,
//         }}
//       >
//         <CircularProgress />
//         <Typography>Loading modules...</Typography>
//       </Box>
//     );

//   return (
//     <Box
//       sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}
//     >
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
//           <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
//           <Typography variant="h4" fontWeight="bold">
//             EduSkills Academy
//           </Typography>
//         </Box>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {currentView === "modules" && (
//         <Box>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 3,
//             }}
//           >
//             <Typography variant="h5">
//               Academy Modules ({modules.length})
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenAddModule(true)}
//             >
//               Add Module
//             </Button>
//           </Box>

//           {modules.length > 0 ? (
//             <ModulesTable
//               modules={modules}
//               onViewDetails={handleViewModuleDetails}
//               onUpdate={handleUpdateModuleClick}
//             />
//           ) : (
//             <Paper sx={{ p: 4, textAlign: "center" }}>
//               <Typography>No modules found</Typography>
//             </Paper>
//           )}

//           {/* Add Module Dialog */}
//           <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
//             <DialogTitle>Add Module</DialogTitle>
//             <DialogContent
//               sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
//             >
//               <TextField
//                 label="Module Name"
//                 value={newModuleName}
//                 onChange={(e) => setNewModuleName(e.target.value)}
//                 fullWidth
//               />
//               <TextField
//                 label="Sequence Number"
//                 type="number"
//                 value={newModuleSeq}
//                 onChange={(e) => setNewModuleSeq(e.target.value)}
//                 fullWidth
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenAddModule(false)}>Cancel</Button>
//               <Button variant="contained" onClick={handleAddModule}>
//                 Add
//               </Button>
//             </DialogActions>
//           </Dialog>

//           {/* Update Module Dialog */}
//           <UpdateModuleDialog
//             open={openUpdateModule}
//             onClose={() => setOpenUpdateModule(false)}
//             module={selectedModuleForUpdate}
//             onUpdate={handleModuleUpdate}
//           />
//         </Box>
//       )}

//       {currentView === "steps" && (
//         <StepsTable
//           steps={steps}
//           module={selectedModule}
//           onBack={handleBackToModules}
//           onViewStepDetails={handleViewStepDetails}
//           onUpdateStep={handleUpdateStep}
//           onAddStep={handleAddStep}
//         />
//       )}

//       {currentView === "step-content" && (
//         <StepContent
//           step={selectedStep}
//           module={selectedModule}
//           onBackToSteps={handleBackToSteps}
//         />
//       )}
//     </Box>
//   );
// };
// ================= Main Component =================
const Modules = () => {
  const { week_id } = useParams();
  const weekNumber = Number(week_id);
  const [modules, setModules] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("modules");
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  const [openAddModule, setOpenAddModule] = useState(false);
  const [openUpdateModule, setOpenUpdateModule] = useState(false);
  const [selectedModuleForUpdate, setSelectedModuleForUpdate] = useState(null);
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleSeq, setNewModuleSeq] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const modulesResponse = await getAcademyModules(weekNumber);
        let modulesData =
          modulesResponse.academyModules || modulesResponse || [];
        setModules(modulesData);
      } catch (err) {
        setError(err.message || "Failed to load modules");
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [weekNumber]);

  const handleViewModuleDetails = async (module) => {
    try {
      setLoading(true);
      const stepsResponse = await getAcademySteps(module.module_id);
      const stepsData = stepsResponse.academySteps || stepsResponse || [];
      setSteps(stepsData);
      setSelectedModule(module);
      setCurrentView("steps");
    } catch (err) {
      setError("Failed to load steps");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModuleClick = (module) => {
    setSelectedModuleForUpdate(module);
    setOpenUpdateModule(true);
  };

  const handleModuleUpdate = async () => {
    const modulesResponse = await getAcademyModules(weekNumber);
    setModules(modulesResponse.academyModules || modulesResponse || []);
    setOpenUpdateModule(false);
    setSelectedModuleForUpdate(null);
  };

  const handleUpdateStep = (step) => {
    // This is now handled in the StepsTable component
  };

  const handleViewStepDetails = async (step) => {
    try {
      setLoading(true);
      // Refresh the steps data to get the latest quiz status
      const stepsResponse = await getAcademySteps(selectedModule.module_id);
      const stepsData = stepsResponse.academySteps || stepsResponse || [];
      setSteps(stepsData);
      
      // Find the updated step from the fresh data
      const updatedStep = stepsData.find(s => 
        (s.step_id || s.id) === (step.step_id || step.id)
      );
      
      setSelectedStep(updatedStep || step);
      setCurrentView("step-content");
    } catch (err) {
      console.error("Failed to refresh step data:", err);
      // Fallback to the original step if refresh fails
      setSelectedStep(step);
      setCurrentView("step-content");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToModules = () => {
    setCurrentView("modules");
    setSelectedModule(null);
    setSteps([]);
    setSelectedStep(null);
  };

  const handleBackToSteps = () => {
    setCurrentView("steps");
    setSelectedStep(null);
  };

  const handleAddModule = async () => {
    try {
      if (!newModuleName || !newModuleSeq) return alert("Enter all fields");
      await addAcademyModule({
        weekNumber: weekNumber,
        moduleSequenceNumber: parseInt(newModuleSeq),
        moduleSubject: newModuleName,
      });
      setOpenAddModule(false);
      setNewModuleName("");
      setNewModuleSeq("");
      const modulesResponse = await getAcademyModules(weekNumber);
      setModules(modulesResponse.academyModules || modulesResponse || []);
    } catch (err) {
      alert("Failed to add module");
    }
  };

  const handleAddStep = async () => {
    handleViewModuleDetails(selectedModule);
  };

  if (loading && currentView === "modules")
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading modules...</Typography>
      </Box>
    );

  return (
    <Box
      sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">
            EduSkills Academy
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {currentView === "modules" && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5">
              Academy Modules ({modules.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddModule(true)}
            >
              Add Module
            </Button>
          </Box>

          {modules.length > 0 ? (
            <ModulesTable
              modules={modules}
              onViewDetails={handleViewModuleDetails}
              onUpdate={handleUpdateModuleClick}
            />
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography>No modules found</Typography>
            </Paper>
          )}

          {/* Add Module Dialog */}
          <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
            <DialogTitle>Add Module</DialogTitle>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Module Name"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Sequence Number"
                type="number"
                value={newModuleSeq}
                onChange={(e) => setNewModuleSeq(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddModule(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleAddModule}>
                Add
              </Button>
            </DialogActions>
          </Dialog>

          {/* Update Module Dialog */}
          <UpdateModuleDialog
            open={openUpdateModule}
            onClose={() => setOpenUpdateModule(false)}
            module={selectedModuleForUpdate}
            onUpdate={handleModuleUpdate}
          />
        </Box>
      )}

      {currentView === "steps" && (
        <StepsTable
          steps={steps}
          module={selectedModule}
          onBack={handleBackToModules}
          onViewStepDetails={handleViewStepDetails}
          onUpdateStep={handleUpdateStep}
          onAddStep={handleAddStep}
        />
      )}

      {currentView === "step-content" && (
        <StepContent
          step={selectedStep}
          module={selectedModule}
          onBackToSteps={handleBackToSteps}
        />
      )}
    </Box>
  );
};

export default Modules;