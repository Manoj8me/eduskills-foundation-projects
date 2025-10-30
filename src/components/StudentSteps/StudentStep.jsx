import React, { useState } from "react";
import { motion } from "framer-motion";

// Define the process steps for AWS Cloud Virtual Internship
const processSteps = [
  {
    id: 1,
    title: "Sign Up",
    description:
      "Create your account and apply for the AWS Cloud program through the AICTE website - it's totally free!",
    icon: "📝",
    color: "bg-blue-600",
    completed: false,
    question: {
      text: "How do you join the AWS Cloud internship program?",
      options: [
        { id: "a", text: "Pay money to register", correct: false },
        { id: "b", text: "Download special software", correct: false },
        { id: "c", text: "Sign up on the AICTE website", correct: true },
        { id: "d", text: "Email AWS directly", correct: false },
      ],
    },
    details: [
      "Go to the AICTE Internship website",
      "Create your free account",
      "Fill in your basic info (name, college, etc.)",
      "Search for 'AWS Cloud Virtual Internship'",
      "Click Apply and you're done!",
    ],
  },
  {
    id: 2,
    title: "Get Selected",
    description:
      "Get picked for the program and login to the AWS learning platform to start your cloud journey!",
    icon: "✅",
    color: "bg-green-600",
    completed: false,
    question: {
      text: "What happens after you get picked for the internship?",
      options: [
        { id: "a", text: "You have to pay money", correct: false },
        {
          id: "b",
          text: "You get login details for the AWS learning site",
          correct: true,
        },
        { id: "c", text: "You need to visit an office", correct: false },
        { id: "d", text: "You start coding right away", correct: false },
      ],
    },
    details: [
      "You'll get an email saying you're in!",
      "Your college also finds out you were selected",
      "You get your username and password for the AWS site",
      "You can start learning cloud basics right away",
      "Check out the welcome materials to get started",
    ],
  },
  {
    id: 3,
    title: "Learn the Basics",
    description:
      "Take the AWS Cloud Foundation course online and pass the quizzes within 4 weeks - it's fun!",
    icon: "📚",
    color: "bg-purple-600",
    completed: false,
    question: {
      text: "How much time do you have to finish the online course?",
      options: [
        { id: "a", text: "2 weeks", correct: false },
        { id: "b", text: "4 weeks", correct: true },
        { id: "c", text: "8 weeks", correct: false },
        { id: "d", text: "3 months", correct: false },
      ],
    },
    details: [
      "Watch cool video lessons about cloud tech",
      "Learn the basics of how cloud servers work",
      "Discover all the different AWS tools",
      "Practice with fun quizzes along the way",
      "Pass the final test to move forward",
      "Get your first digital badge to show off!",
    ],
  },
  {
    id: 4,
    title: "Build a Project",
    description:
      "Work on a real cloud project for 4 weeks with help from actual industry experts!",
    icon: "💻",
    color: "bg-orange-600",
    completed: false,
    question: {
      text: "Who helps you during the project phase?",
      options: [
        { id: "a", text: "Nobody - you're on your own", correct: false },
        { id: "b", text: "Just some PDF guides", correct: false },
        {
          id: "c",
          text: "Real cloud experts from the industry",
          correct: true,
        },
        { id: "d", text: "Only other students", correct: false },
      ],
    },
    details: [
      "Get your cool project assignment",
      "Build something real using AWS cloud tools",
      "Get 8 hours of coaching from real AWS pros",
      "Your teachers will help you too",
      "Keep track of what you're building",
      "Get career advice from actual company recruiters",
    ],
  },
  {
    id: 5,
    title: "Get Certified",
    description:
      "Submit your finished project and earn awesome certificates that look great on your resume!",
    icon: "🏆",
    color: "bg-red-600",
    completed: false,
    question: {
      text: "What cool stuff do you get when you finish the program?",
      options: [
        { id: "a", text: "Just an AWS certificate", correct: false },
        { id: "b", text: "Just an AICTE certificate", correct: false },
        {
          id: "c",
          text: "Multiple certificates and a digital badge for social media",
          correct: true,
        },
        { id: "d", text: "Just a thank you letter", correct: false },
      ],
    },
    details: [
      "Turn in your awesome project",
      "Get an official AWS certificate",
      "Get a digital badge for LinkedIn and social media",
      "Receive an AICTE internship certificate",
      "Get another certificate from EduSkills",
      "Get noticed by companies looking to hire cloud experts",
    ],
  },
];

const ProcessViewer = () => {
  const [steps, setSteps] = useState(processSteps);
  const [activeStep, setActiveStep] = useState(1);
  const [viewMode, setViewMode] = useState("flow"); // 'flow', 'detail', or 'question'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showUnderstandingPrompt, setShowUnderstandingPrompt] = useState(false);
  const [understood, setUnderstood] = useState(null);

  const handleStepClick = (stepId) => {
    // Only allow clicking steps that are available (previous steps completed or current step)
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    const previousStepsCompleted = steps
      .slice(0, stepIndex)
      .every((step) => step.completed);

    if (previousStepsCompleted || stepId === steps[0].id) {
      setActiveStep(stepId);
      setViewMode("detail");
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowUnderstandingPrompt(false);
      setUnderstood(null);
    }
  };

  const handleBackToFlow = () => {
    setViewMode("flow");
  };

  const handleStartQuiz = () => {
    setViewMode("question");
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer) {
      const currentStepObj = steps.find((step) => step.id === activeStep);
      const selectedOption = currentStepObj.question.options.find(
        (option) => option.id === selectedAnswer
      );
      setIsCorrect(selectedOption.correct);

      if (selectedOption.correct) {
        setShowUnderstandingPrompt(true);
      }
    }
  };

  const handleCompleteStep = (understoodValue) => {
    setUnderstood(understoodValue);

    // If student understands, mark step as complete and move to next step or back to flow
    if (understoodValue) {
      const updatedSteps = steps.map((step) =>
        step.id === activeStep ? { ...step, completed: true } : step
      );
      setSteps(updatedSteps);

      // If there's a next step, go to it
      const currentIndex = steps.findIndex((step) => step.id === activeStep);
      if (currentIndex < steps.length - 1) {
        setActiveStep(steps[currentIndex + 1].id);
        setViewMode("detail");
      } else {
        // If this was the last step, go back to flow view
        setViewMode("flow");
      }
    } else {
      // If student doesn't understand, go back to detail view
      setViewMode("detail");
    }

    // Reset states
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowUnderstandingPrompt(false);
    setUnderstood(null);
  };

  const currentStep = steps.find((step) => step.id === activeStep);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const detailVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, duration: 0.5 },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      <header className="mb-8 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your AWS Cloud Journey
          </h1>
          <div className="flex items-center justify-center mb-2">
            <img
              src="/api/placeholder/60/60"
              alt="AWS Logo Placeholder"
              className="h-10 mr-2"
            />
            <span className="text-orange-500 font-semibold text-xl">+</span>
            <img
              src="/api/placeholder/60/60"
              alt="AICTE Logo Placeholder"
              className="h-10 mx-2"
            />
            <span className="text-orange-500 font-semibold text-xl">+</span>
            <img
              src="/api/placeholder/60/60"
              alt="EduSkills Logo Placeholder"
              className="h-10 ml-2"
            />
          </div>
          <p className="text-gray-600 text-lg">
            Your step-by-step guide to getting certified and starting your cloud
            career!
          </p>
        </motion.div>
      </header>

      {viewMode === "flow" ? (
        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Process Flow View */}
          <div className="relative">
            <div className="absolute left-8 top-10 bottom-10 w-1 bg-gray-300 rounded-full"></div>
            {steps.map((step, index) => {
              // Determine if this step is available to click
              const previousStepsCompleted = steps
                .slice(0, index)
                .every((s) => s.completed);
              const isAvailable = previousStepsCompleted || index === 0;

              return (
                <motion.div
                  key={step.id}
                  className={`mb-6 flex items-center ${
                    isAvailable
                      ? "cursor-pointer group"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  variants={itemVariants}
                  onClick={
                    isAvailable ? () => handleStepClick(step.id) : undefined
                  }
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                >
                  <motion.div
                    className={`z-10 flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg ${
                      step.color
                    } ${step.completed ? "ring-4 ring-green-300" : ""}`}
                    whileHover={isAvailable ? { rotate: 10, scale: 1.1 } : {}}
                  >
                    <span className="text-2xl">
                      {step.completed ? "✓" : step.icon}
                    </span>
                  </motion.div>
                  <div
                    className={`ml-6 p-4 bg-white rounded-lg shadow-md border ${
                      step.completed ? "border-green-200" : "border-gray-100"
                    } flex-grow ${
                      isAvailable
                        ? "group-hover:shadow-lg transition-shadow duration-300"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {step.title}
                      </h3>
                      {step.completed && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Benefits Panel */}
          <motion.div
            className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              What's In It For You?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🏆</span>
                  <h4 className="font-medium text-gray-800">
                    Cool Certificates
                  </h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Get official certificates from AWS and AICTE plus a digital
                  badge for your LinkedIn profile!
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">💼</span>
                  <h4 className="font-medium text-gray-800">Job Connections</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Get noticed by big companies looking to hire cloud experts
                  when you finish the program
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">💡</span>
                  <h4 className="font-medium text-gray-800">Hot Skills</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Learn cloud skills that companies are desperately looking for
                  right now
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : viewMode === "detail" ? (
        <motion.div
          className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
          variants={detailVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Detailed Step View */}
          <div className={`p-6 ${currentStep.color} text-white`}>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Step {currentStep.id}: {currentStep.title}
              </h2>
              <span className="text-4xl">{currentStep.icon}</span>
            </div>
            {currentStep.completed && (
              <div className="mt-2 bg-white bg-opacity-20 rounded-md px-3 py-1 inline-block">
                <span className="font-medium">✓ Completed</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              About this step
            </h3>
            <p className="text-gray-700 mb-6">{currentStep.description}</p>

            {/* Additional content for each step */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-800 mb-2">What to do:</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {currentStep.details.map((detail, index) => (
                  <li key={index} className="mb-1">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleBackToFlow}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center"
              >
                <span className="mr-2">←</span> Go back to map
              </button>

              {!currentStep.completed && (
                <button
                  onClick={handleStartQuiz}
                  className={`px-4 py-2 ${currentStep.color} text-white rounded-lg hover:opacity-90 transition-colors duration-300 flex items-center`}
                >
                  <span>Got it! Test me now</span>{" "}
                  <span className="ml-2">→</span>
                </button>
              )}

              {currentStep.completed && (
                <div className="flex items-center">
                  <span className="text-green-600 mr-3">✓ Step completed</span>
                  <div className="flex space-x-2">
                    {steps.map((step) => (
                      <motion.button
                        key={step.id}
                        className={`w-3 h-3 rounded-full ${
                          step.id === activeStep
                            ? step.color
                            : step.completed
                            ? "bg-green-400"
                            : "bg-gray-300"
                        }`}
                        onClick={() => setActiveStep(step.id)}
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : viewMode === "question" ? (
        <motion.div
          className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
          variants={detailVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Question View */}
          <div className={`p-6 ${currentStep.color} text-white`}>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Step {currentStep.id}: {currentStep.title}
              </h2>
              <span className="text-4xl">{currentStep.icon}</span>
            </div>
          </div>

          <div className="p-6">
            {!showUnderstandingPrompt ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Check Your Understanding
                </h3>
                <p className="text-gray-700 mb-6">
                  Answer this question to verify you understand this step:
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-800 mb-4">
                    {currentStep.question.text}
                  </h4>

                  <div className="space-y-3">
                    {currentStep.question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedAnswer === option.id
                            ? `${currentStep.color} bg-opacity-10 border-current`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAnswerSelect(option.id)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              selectedAnswer === option.id
                                ? currentStep.color
                                : "border-gray-400"
                            }`}
                          >
                            {selectedAnswer === option.id && (
                              <div
                                className={`w-3 h-3 rounded-full ${currentStep.color}`}
                              ></div>
                            )}
                          </div>
                          <span className="ml-2">{option.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isCorrect !== null && (
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">
                        {isCorrect ? "✓" : "✗"}
                      </span>
                      <p className="font-medium">
                        {isCorrect
                          ? "You got it right! Nice job!"
                          : "Oops! That's not quite right. Maybe read that section again?"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setViewMode("detail")}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">←</span> Let me read again
                  </button>

                  <button
                    onClick={handleCheckAnswer}
                    className={`px-4 py-2 ${
                      currentStep.color
                    } text-white rounded-lg hover:opacity-90 transition-colors duration-300 ${
                      selectedAnswer ? "" : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!selectedAnswer}
                  >
                    Submit my answer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Be honest with yourself!
                </h3>
                <p className="text-gray-700 mb-6">
                  Great job on the quiz! But here's the big question: Do you
                  REALLY understand how this step works? It's totally okay if
                  you need to read it again!
                </p>

                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => handleCompleteStep(true)}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Yep, I've got this!
                  </button>

                  <button
                    onClick={() => handleCompleteStep(false)}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                  >
                    Hmm, let me study more
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ) : null}

      {/* Instructions Panel */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-md border border-gray-100 max-w-xl text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          How This Guide Works
        </h3>
        <p className="text-gray-600 text-sm">
          Just go through each step one by one to see how the AWS internship
          works. After reading each part, click the "Got it! Test me now" button
          to check if you understood. You need to complete all steps in order -
          that's how the real program works too!
        </p>
      </div>
    </div>
  );
};

export default ProcessViewer;
