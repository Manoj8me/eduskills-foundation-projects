
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Book as BookIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Send as SendIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { ongoingProcessDocumentSupport } from "./api"; // Import your API function

// Styled Components with Blue Theme
const PreviewBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: "#ff9800",
  color: "white",
  fontWeight: "bold",
  marginLeft: theme.spacing(1),
  "& .MuiChip-label": {
    color: "white",
    fontWeight: "bold",
  },
}));

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
  },
}));

const MainContainer = styled(Box)(() => ({
  width: "100%",
  height: "100vh",
  overflow: "hidden",
}));

const ContentWrapper = styled(Box)(() => ({
  marginLeft: "50px",
  width: "calc(100% - 380px)",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const WeekCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "white",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  "&.expanded": {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
}));

const StepItem = styled(ListItem)(({ theme, selected }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(0.5),
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1, 1.5),
  backgroundColor: selected ? "rgba(255, 255, 255, 0.2)" : "transparent",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  minHeight: "40px",
}));
// Process Document Viewer Component
const ProcessDocumentViewer = ({ processDocumentUrl, stepTitle, onClose }) => {
  const [documentContent, setDocumentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProcessDocument = async () => {
      if (!processDocumentUrl) {
        setError("No process document URL provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the HTML content from the process document URL
        const response = await fetch(processDocumentUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`);
        }
        
        const htmlContent = await response.text();
        setDocumentContent(htmlContent);
      } catch (err) {
        console.error("Error fetching process document:", err);
        setError(`Failed to load process document: ${err.message}`);
        
        // Fallback content if fetch fails
        setDocumentContent(`
          <div style="padding: 20px; text-align: center;">
            <h2>Process Document: ${stepTitle}</h2>
            <p>Unable to load the actual process document from: ${processDocumentUrl}</p>
            <p><strong>Error:</strong> ${err.message}</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Sample Process Document Content</h3>
              <p>This would normally display the actual process document for <strong>${stepTitle}</strong>.</p>
              <p>The document would include:</p>
              <ul style="text-align: left; display: inline-block;">
                <li>Step-by-step instructions</li>
                <li>Required materials</li>
                <li>Success criteria</li>
                <li>Troubleshooting tips</li>
              </ul>
            </div>
          </div>
        `);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcessDocument();
  }, [processDocumentUrl, stepTitle]);

  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
        }}
        onClick={onClose}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 4,
            textAlign: 'center',
            minWidth: 300,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading process document...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        p: 2,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          width: '90%',
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon />
            <Typography variant="h6" fontWeight="bold">
              Process Document: {stepTitle}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {processDocumentUrl && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => window.open(processDocumentUrl, '_blank')}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Download
              </Button>
            )}
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {/* Document Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            '& h1, & h2, & h3, & h4, & h5, & h6': { 
              color: 'text.primary', 
              mt: 2, 
              mb: 1 
            },
            '& p': { 
              color: 'text.secondary', 
              mb: 1,
              lineHeight: 1.6 
            },
            '& ul, & ol': { 
              color: 'text.secondary', 
              mb: 2,
              pl: 3 
            },
            '& li': { 
              mb: 1,
              lineHeight: 1.6 
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              mb: 2
            },
            '& th, & td': {
              border: '1px solid #e0e0e0',
              padding: '8px 12px',
              textAlign: 'left'
            },
            '& th': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold'
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto'
            },
            '& code': {
              backgroundColor: '#f5f5f5',
              padding: '2px 4px',
              borderRadius: '3px',
              fontFamily: 'monospace'
            },
            '& pre': {
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              fontFamily: 'monospace'
            },
            '& blockquote': {
              borderLeft: '4px solid #1976d2',
              paddingLeft: '16px',
              marginLeft: 0,
              color: '#666',
              fontStyle: 'italic'
            }
          }}
          dangerouslySetInnerHTML={{ __html: documentContent }}
        />
      </Box>
    </Box>
  );
};

// Permanent Sidebar Component
const PermanentSidebar = ({
  weeks,
  courseName,
  selectedStepId,
  onStepSelect,
  isLoading,
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState({});

  useEffect(() => {
    if (weeks.length > 0) {
      const firstWeek = weeks[0];
      setExpandedWeeks((prev) => ({
        ...prev,
        [firstWeek.week_id]: true,
      }));
    }
  }, [weeks]);

  const handleWeekToggle = (weekId) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  const handleStepClick = (step) => {
    onStepSelect(step);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: 280,
          backgroundColor: "#1976d2",
          color: "white",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1200,
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {courseName}
          </Typography>
          <CircularProgress size={20} sx={{ color: "white" }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: "#1976d2",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        border: "none",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {courseName}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Student Preview
        </Typography>
        <PreviewBadge label="Preview Mode" size="small" />
      </Box>

      <Box sx={{ flex: 1, backgroundColor: "#1565c0", overflow: "auto" }}>
        <Box sx={{ py: 1 }}>
          {weeks.length > 0 ? (
            weeks.map((week) => (
              <WeekCard 
                key={week.week_id}
                className={expandedWeeks[week.week_id] ? "expanded" : ""}
                onClick={() => handleWeekToggle(week.week_id)}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <BookIcon sx={{ color: "white", fontSize: "1.2rem" }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {week.week_subject}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {week.steps?.length || 0} steps
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon 
                    sx={{ 
                      color: "white", 
                      fontSize: "1.2rem",
                      transform: expandedWeeks[week.week_id] ? "rotate(90deg)" : "none",
                      transition: "transform 0.2s"
                    }} 
                  />
                </Box>

                {expandedWeeks[week.week_id] && week.steps && (
                  <Box sx={{ mt: 1 }}>
                    {week.steps.length > 0 ? (
                      <List dense sx={{ py: 0 }}>
                        {week.steps.map((step) => (
                          <StepItem
                            key={step.step_id}
                            selected={selectedStepId === step.step_id}
                            onClick={() => handleStepClick(step)}
                          >
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              {step.isquiz === "1" ? (
                                <HelpIcon sx={{ fontSize: 14, color: "white" }} /> 
                              ) : (
                                <BookIcon sx={{ fontSize: 14, color: "white" }} /> 
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ color: "white", fontSize: "0.8rem" }}>
                                  {step.steps_subject}
                                </Typography>
                              }
                            />
                          </StepItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5, color: "white", opacity: 0.7 }}>
                        <InfoIcon sx={{ fontSize: "1rem" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          No steps available.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </WeekCard>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: "center", color: "white", opacity: 0.7 }}>
              <InfoIcon sx={{ fontSize: "2rem", mb: 1 }} />
              <Typography variant="body2">
                No weeks available for this domain.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Mobile Sidebar Component
const MobileSidebar = ({
  weeks,
  courseName,
  selectedStepId,
  onStepSelect,
  isOpen,
  onClose,
  isLoading,
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState({});

  const handleWeekToggle = (weekId) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  const handleStepClick = (step) => {
    onStepSelect(step);
    onClose();
  };

  return (
    <SidebarDrawer
      variant="temporary"
      open={isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      <Box sx={{ p: 1.5, display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {courseName}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Student Preview
        </Typography>
        <PreviewBadge label="Preview Mode" size="small" />
        {isLoading && <CircularProgress size={20} sx={{ color: "white", mt: 1 }} />}
      </Box>

      <Box sx={{ flex: 1, backgroundColor: "#1565c0", overflow: "auto" }}>
        <Box sx={{ py: 1 }}>
          {weeks.length > 0 ? (
            weeks.map((week) => (
              <WeekCard 
                key={week.week_id}
                className={expandedWeeks[week.week_id] ? "expanded" : ""}
                onClick={() => handleWeekToggle(week.week_id)}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <BookIcon sx={{ color: "white", fontSize: "1.2rem" }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {week.week_subject}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {week.steps?.length || 0} steps
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon 
                    sx={{ 
                      color: "white", 
                      fontSize: "1.2rem",
                      transform: expandedWeeks[week.week_id] ? "rotate(90deg)" : "none",
                      transition: "transform 0.2s"
                    }} 
                  />
                </Box>

                {expandedWeeks[week.week_id] && week.steps && (
                  <Box sx={{ mt: 1 }}>
                    {week.steps.length > 0 ? (
                      <List dense sx={{ py: 0 }}>
                        {week.steps.map((step) => (
                          <StepItem
                            key={step.step_id}
                            selected={selectedStepId === step.step_id}
                            onClick={() => handleStepClick(step)}
                          >
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              {step.isquiz === "1" ? (
                                <HelpIcon sx={{ fontSize: 14, color: "white" }} />
                              ) : (
                                <BookIcon sx={{ fontSize: 14, color: "white" }} /> 
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ color: "white", fontSize: "0.8rem" }}>
                                  {step.steps_subject}
                                </Typography>
                              }
                            />
                          </StepItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5, color: "white", opacity: 0.7 }}>
                        <InfoIcon sx={{ fontSize: "1rem" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          No steps available.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </WeekCard>
            ))
          ) : !isLoading && (
            <Box sx={{ p: 2, textAlign: "center", color: "white", opacity: 0.7 }}>
              <InfoIcon sx={{ fontSize: "2rem", mb: 1 }} />
              <Typography variant="body2">
                No weeks available for this domain.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </SidebarDrawer>
  );
};


const HtmlRenderer = ({ step }) => {
  const [showProcessDocument, setShowProcessDocument] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const staticContent = `
      <h2>${step.steps_subject || step.title}</h2>
      
      
      ${step.process_user_manual ? `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <path d="M14 2v6h6"/>
            </svg>
            <h3 style="margin: 0; color: white;">Process Document Available</h3>
          </div>
          <p style="margin: 0 0 16px 0; opacity: 0.9;">
            A detailed process document is available for this step. Click the button below to view the complete guide with step-by-step instructions.
          </p>
          <button 
            onclick="document.getElementById('view-process-doc-btn').click()" 
            style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; backdrop-filter: blur(10px);"
            onmouseover="this.style.background='rgba(255,255,255,0.3)'"
            onmouseout="this.style.background='rgba(255,255,255,0.2)'"
          >
            📋 View Process Document
          </button>
        </div>
      ` : `
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0; color: #666;">
            <strong>Note:</strong> No process document is available for this step.
          </p>
        </div>
      `}
      

    `;
    setContent(staticContent);
  }, [step]);

  return (
    <Box>
      {/* Hidden button for HTML to trigger */}
      <button 
        id="view-process-doc-btn" 
        onClick={() => setShowProcessDocument(true)}
        style={{ display: 'none' }}
      >
        View Process Document
      </button>

      {/* Regular Content */}
      <Box
        sx={{
          "& h1, & h2, & h3, & h4, & h5, & h6": { color: "text.primary", mt: 2, mb: 1 },
          "& p": { color: "text.secondary", mb: 1 },
          "& ul": { color: "text.secondary", mb: 1 },
          "& li": { mb: 0.5 },
          "& button": { 
            backgroundColor: "#1976d2", 
            color: "white", 
            border: "none", 
            padding: "10px 20px", 
            borderRadius: "6px", 
            cursor: "pointer",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#1565c0"
            }
          },
          fontSize: "0.875rem",
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Process Document Viewer */}
      {showProcessDocument && step.process_user_manual && (
        <ProcessDocumentViewer
          processDocumentUrl={step.process_user_manual}
          stepTitle={step.steps_subject || step.title}
          onClose={() => setShowProcessDocument(false)}
        />
      )}
    </Box>
  );
};



// Enhanced Quiz Component that shows all questions and answers directly
const Quiz = ({ step }) => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parse quiz data when step changes
  useEffect(() => {
    const parseQuizData = () => {
      if (!step.quiz) {
        setError("No quiz data available for this step");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Parse the quiz string from your API
        const parsedQuiz = JSON.parse(step.quiz);
        console.log("Parsed quiz data:", parsedQuiz); // For debugging
        
        setQuizData(parsedQuiz);
      } catch (err) {
        console.error("Error parsing quiz data:", err);
        setError("Failed to load quiz questions. The quiz data format is invalid.");
        setQuizData([]);
      } finally {
        setIsLoading(false);
      }
    };

    parseQuizData();
  }, [step.quiz]);

  const getAnswerText = (question, answerId) => {
    const answer = question.answers.find(a => a.answer_id === answerId);
    return answer ? answer.answer : "Unknown answer";
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading quiz questions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please check the quiz data format.
        </Typography>
      </Box>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <HelpIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Quiz Available
        </Typography>
        <Typography>
          There are no quiz questions available for this step yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Quiz: {step.steps_subject}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          This quiz contains {quizData.length} question(s). All questions and correct answers are displayed below for preview.
        </Typography>
      </Alert>

      {quizData.map((question, index) => {
        const correctAnswerText = getAnswerText(question, question.correct_answer_id);
        
        return (
          <Paper key={question.question_id} sx={{ p: 3, mb: 3, border: 2, borderColor: 'primary.main' }}>
            {/* Question */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
              Question {index + 1}: {question.question}
            </Typography>
            
            {/* All Options */}
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                Options:
              </Typography>
              {question.answers.map((answer, answerIndex) => (
                <Box
                  key={answer.answer_id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: answer.answer_id === question.correct_answer_id ? 'success.main' : 'divider',
                    backgroundColor: answer.answer_id === question.correct_answer_id ? 'success.light' : 'background.paper',
                    color: answer.answer_id === question.correct_answer_id ? 'success.contrastText' : 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: answer.answer_id === question.correct_answer_id ? 'success.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {String.fromCharCode(65 + answerIndex)}
                  </Box>
                  <Typography variant="body2">
                    {answer.answer}
                    {answer.answer_id === question.correct_answer_id && (
                      <CheckIcon sx={{ fontSize: 16, ml: 1, color: 'success.main' }} />
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>

          </Paper>
        );
      })}

      
    </Box>
  );
};

// Updated StepContent Component - Only show quiz for quiz steps
const StepContent = ({ step, weekTitle, onNavigate, isFirstStep, isLastStep }) => {
  const hasQuizContent = step.isquiz === "1";

  // For quiz steps, only show quiz - no lesson content
  if (hasQuizContent) {
    return (
      <Box sx={{ p: { xs: 1, sm: 2, lg: 3 } }}>
        <Paper sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", pb: 2, mb: 3 }}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold">
              {weekTitle}
            </Typography>
          
          </Box>

          {/* Only show quiz for quiz steps */}
          <Quiz step={step} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, pt: 3, borderTop: 1, borderColor: "divider", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => onNavigate("prev")}
              disabled={isFirstStep}
              startIcon={<ChevronLeftIcon />}
              size="small"
            >
              Previous Step
            </Button>

            <Button
              variant="contained"
              onClick={() => onNavigate("next")}
              disabled={isLastStep}
              endIcon={<ArrowForwardIcon />}
              size="small"
            >
              Next Step
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // For non-quiz steps, show lesson content with process document
  return (
    <Box sx={{ p: { xs: 1, sm: 2, lg: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", pb: 2, mb: 3 }}>
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            {weekTitle}
          </Typography>
       
        </Box>

        {/* Only show lesson content for non-quiz steps */}
        <HtmlRenderer step={step} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, pt: 3, borderTop: 1, borderColor: "divider", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => onNavigate("prev")}
            disabled={isFirstStep}
            startIcon={<ChevronLeftIcon />}
            size="small"
          >
            Previous Step
          </Button>

          <Button
            variant="contained"
            onClick={() => onNavigate("next")}
            disabled={isLastStep}
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            Next Step
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// Main StudentPreview Component
const StudentPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const domain = location.state?.domain;
  
  const [weeks, setWeeks] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const courseName = domain?.domain_name || "Course Preview";

//   fetch weeks data when domain changes
useEffect(() => {
  const fetchWeeksData = async () => {
    if (!domain?.domain_id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call the POST API
      const response = await ongoingProcessDocumentSupport(domain.domain_id, domain.domain_name); 
      
      // Log the response for debugging
      console.log("Fetched weeks data:", response.weeks_data);

      // Set weeks in state
      setWeeks(response.weeks_data || []);

      // Auto-select first step
      if (response.weeks_data?.length > 0) {
        const firstWeek = response.weeks_data[0];
        if (firstWeek.steps?.length > 0) {
          setSelectedStep({
            ...firstWeek.steps[0],
            week_id: firstWeek.week_id,
            week_subject: firstWeek.week_subject,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching weeks data:", err);
      setError("Failed to load course content");
    } finally {
      setIsLoading(false);
    }
  };

  fetchWeeksData();
}, [domain]);


  const allStepsFlat = useMemo(() => {
    return weeks.flatMap(week => 
      (week.steps || []).map(step => ({
        ...step,
        week_id: week.week_id,
        week_subject: week.week_subject
      }))
    );
  }, [weeks]);

  const handleStepSelect = (step) => {
    setSelectedStep(step);
  };

  const handleNavigation = (direction) => {
    if (!selectedStep) return;

    const currentIndex = allStepsFlat.findIndex((s) => s.step_id === selectedStep.step_id);
    if (currentIndex === -1) return;

    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < allStepsFlat.length) {
      setSelectedStep(allStepsFlat[newIndex]);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!domain) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", p: 4 }}>
        <WarningIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>No Domain Selected</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please select a domain from the domain management page.
        </Typography>
        <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", p: 4 }}>
        <WarningIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>Error Loading Content</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <MainContainer>
      {/* Permanent Desktop Sidebar */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <PermanentSidebar
          weeks={weeks}
          courseName={courseName}
          selectedStepId={selectedStep?.step_id}
          onStepSelect={handleStepSelect}
          isLoading={isLoading}
        />
      </Box>

      {/* Mobile Sidebar */}
      <MobileSidebar
        weeks={weeks}
        courseName={courseName}
        selectedStepId={selectedStep?.step_id}
        onStepSelect={handleStepSelect}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <ContentWrapper>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", width: "135%" }}>
          {/* Header */}
          <AppBar 
            position="static" 
            color="primary"
            sx={{ 
              backgroundColor: "#1976d2",
              boxShadow: "none",
              borderBottom: "1px solid rgba(0,0,0,0.1)"
            }}
          >
            <Toolbar sx={{ minHeight: "56px !important", padding: "0 16px !important" }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileSidebarOpen(true)}
                sx={{ mr: 1, display: { lg: "none" } }}
                size="small"
              >
                <MenuIcon />
              </IconButton>
              
              <IconButton edge="start" color="inherit" onClick={handleGoBack} sx={{ mr: 1 }} size="small">
                <ArrowBackIcon />
              </IconButton>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: "1.1rem" }}>
                {courseName} - Preview
              </Typography>

              <PreviewBadge label="Preview Mode" size="small" />
            </Toolbar>
          </AppBar>

          {/* Breadcrumb */}
          {selectedStep && (
            <Box sx={{ p: 1, backgroundColor: "background.paper", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
              <Breadcrumbs>
               
              </Breadcrumbs>
            </Box>
          )}

          {/* Content Area */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {selectedStep ? (
              <StepContent
                step={selectedStep}
                weekTitle={selectedStep.week_subject}
                onNavigate={handleNavigation}
                isFirstStep={allStepsFlat.findIndex((s) => s.step_id === selectedStep.step_id) === 0}
                isLastStep={allStepsFlat.findIndex((s) => s.step_id === selectedStep.step_id) === allStepsFlat.length - 1}
              />
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", p: 4 }}>
                {isLoading ? (
                  <>
                    <CircularProgress sx={{ mb: 1 }} />
                    <Typography variant="h6">Loading course content...</Typography>
                  </>
                ) : (
                  <>
                    <InfoIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6">No content available</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select a step from the sidebar to begin.
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </ContentWrapper>
    </MainContainer>
  );
};

export default StudentPreview;