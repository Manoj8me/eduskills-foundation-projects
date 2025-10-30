import React, { useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Trophy,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";

const QuizForm = ({ selectedCategory, questions, onBack, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentView, setCurrentView] = useState("form"); // 'form', 'final'
  const [uploadedFiles, setUploadedFiles] = useState({}); // Store files per question
  const [uploadErrors, setUploadErrors] = useState({}); // Store errors per question
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Confetti Component using react-confetti library
  const ConfettiComponent = () => {
    if (!showConfetti) return null;

    return (
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
        colors={[
          "#3B82F6",
          "#F97316",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ]}
      />
    );
  };

  const handleAnswerSelect = (questionId, option, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        text: option,
        optionId: optionId,
      },
    }));
    // Clear form error when user starts answering
    if (formError) {
      setFormError("");
    }
  };

  const validateForm = () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => answers[q.question_id] === undefined
    );

    if (unansweredQuestions.length > 0) {
      setFormError(
        `Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`
      );
      return false;
    }

    // Check if all questions with file_upload = true have uploaded files
    const questionsWithoutFiles = questions.filter(
      (q) => q.file_upload === true && !uploadedFiles[q.question_id]
    );

    if (questionsWithoutFiles.length > 0) {
      setFormError(
        "Please upload supporting documents for all required questions."
      );
      return false;
    }

    return true;
  };

  const handleFileSelect = (event, questionId) => {
    const file = event.target.files[0];
    setUploadErrors((prev) => ({ ...prev, [questionId]: "" }));
    setFormError("");

    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      setUploadErrors((prev) => ({
        ...prev,
        [questionId]: "Please select a PDF file only.",
      }));
      return;
    }

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadErrors((prev) => ({
        ...prev,
        [questionId]: "File size must be less than 2MB.",
      }));
      return;
    }

    setUploadedFiles((prev) => ({ ...prev, [questionId]: file }));
  };

  const removeFile = (questionId) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[questionId];
      return newFiles;
    });
    setUploadErrors((prev) => ({ ...prev, [questionId]: "" }));
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const accessToken = localStorage.getItem("accessToken");

      // Format answers for API
      const formattedAnswers = questions.map((question) => ({
        question_id: question.question_id,
        selected_option_id: answers[question.question_id]?.optionId,
      }));

      // Create FormData and append answers
      const formData = new FormData();
      formData.append("answers", JSON.stringify(formattedAnswers));

      // Append files for questions that require file upload
      Object.keys(uploadedFiles).forEach((questionId) => {
        formData.append(`file_${questionId}`, uploadedFiles[questionId]);
      });

      const response = await axios.post(
        `${BASE_URL}/internship/nomination/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setCurrentView("final");
        }, 3000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit. Please try again.";
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const allQuestionsAnswered = () => {
    return questions.every((q) => answers[q.question_id] !== undefined);
  };

  const resetForm = () => {
    setAnswers({});
    setCurrentView("form");
    setUploadedFiles({});
    setUploadErrors({});
    setFormError("");
    setShowConfetti(false);
    onBack();
  };

  if (currentView === "form") {
    return (
      <>
        <ConfettiComponent />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Category</span>
              </button>

              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-blue-500 text-white">
                  {selectedCategory?.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedCategory?.title}
                  </h1>
                  <p className="text-gray-600">Award Category Quiz</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Questions Section */}
              <div className="bg-blue-500 text-white p-6">
                <h2 className="text-xl font-bold">
                  Questions, Answers & Document Upload
                </h2>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-200 w-12">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-200 w-1/4">
                          Questions
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-200 w-1/3">
                          Answers
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                          Upload Document
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question, index) => (
                        <tr
                          key={question.question_id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-6 text-sm font-medium text-gray-900 border-r border-gray-200 w-12">
                            {index + 1}
                          </td>
                          <td className="px-6 py-6 text-sm text-gray-900 border-r border-gray-200 w-1/4">
                            <div className="font-medium">
                              {question.question_text}
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm text-gray-900 border-r border-gray-200 w-1/3">
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((option) => (
                                <button
                                  key={option.option_id}
                                  onClick={() =>
                                    handleAnswerSelect(
                                      question.question_id,
                                      option.option_text,
                                      option.option_id
                                    )
                                  }
                                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                    answers[question.question_id]?.text ===
                                    option.option_text
                                      ? "border-blue-500 bg-blue-50 text-blue-700"
                                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                  }`}
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                                      answers[question.question_id]?.text ===
                                      option.option_text
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {answers[question.question_id]?.text ===
                                      option.option_text && (
                                      <div className="w-1 h-1 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span className="font-medium whitespace-nowrap">
                                    {option.option_text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm text-gray-900 w-1/3">
                            {/* Only show file upload if file_upload is true */}
                            {question.file_upload === true ? (
                              <div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors duration-200">
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                      handleFileSelect(e, question.question_id)
                                    }
                                    className="hidden"
                                    id={`file-upload-${question.question_id}`}
                                  />
                                  <label
                                    htmlFor={`file-upload-${question.question_id}`}
                                    className="cursor-pointer block"
                                  >
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs font-medium text-gray-900 mb-1">
                                      Upload Document
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2">
                                      PDF only, max 2MB
                                    </p>
                                    <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors duration-200">
                                      Choose File
                                    </span>
                                  </label>
                                </div>

                                {/* File Preview */}
                                {uploadedFiles[question.question_id] && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4 text-red-600" />
                                        <div>
                                          <p className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                                            {
                                              uploadedFiles[
                                                question.question_id
                                              ].name
                                            }
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {(
                                              uploadedFiles[
                                                question.question_id
                                              ].size /
                                              1024 /
                                              1024
                                            ).toFixed(2)}{" "}
                                            MB
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() =>
                                          removeFile(question.question_id)
                                        }
                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Upload Error Message */}
                                {uploadErrors[question.question_id] && (
                                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-xs">
                                      {uploadErrors[question.question_id]}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 text-sm py-4">
                                No document required
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="p-4 space-y-6">
                  {questions.map((question, index) => (
                    <div
                      key={question.question_id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      {/* Question Number and Text */}
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight">
                              {question.question_text}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Select Answer:
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {question.options.map((option) => (
                            <button
                              key={option.option_id}
                              onClick={() =>
                                handleAnswerSelect(
                                  question.question_id,
                                  option.option_text,
                                  option.option_id
                                )
                              }
                              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                                answers[question.question_id]?.text ===
                                option.option_text
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 hover:border-blue-300 hover:bg-white"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  answers[question.question_id]?.text ===
                                  option.option_text
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {answers[question.question_id]?.text ===
                                  option.option_text && (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-sm font-medium">
                                {option.option_text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* File Upload - Only show if file_upload is true */}
                      {question.file_upload === true && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Upload Supporting Document:
                          </h4>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors duration-200">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) =>
                                handleFileSelect(e, question.question_id)
                              }
                              className="hidden"
                              id={`file-upload-mobile-${question.question_id}`}
                            />
                            <label
                              htmlFor={`file-upload-mobile-${question.question_id}`}
                              className="cursor-pointer block"
                            >
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Upload Document
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                PDF files only, maximum 2MB
                              </p>
                              <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200">
                                Choose File
                              </span>
                            </label>
                          </div>

                          {/* File Preview */}
                          {uploadedFiles[question.question_id] && (
                            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5 text-red-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                      {uploadedFiles[question.question_id].name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(
                                        uploadedFiles[question.question_id]
                                          .size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    removeFile(question.question_id)
                                  }
                                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Upload Error Message */}
                          {uploadErrors[question.question_id] && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-700 text-sm">
                                {uploadErrors[question.question_id]}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Error Message */}
              {formError && (
                <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="p-6 bg-gray-50 text-center border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered() || submitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allQuestionsAnswered() && !submitting
                      ? "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:scale-105"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting Application...
                    </span>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-4 h-4 ml-2 inline" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (currentView === "final") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Submission Complete!
              </h1>
              <div className="bg-orange-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Your documents are in verification
                </h3>
                <p className="text-orange-700">
                  We will let you know the results soon. Thank you for your
                  participation!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                onComplete();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizForm;
