import React, { useState, useEffect } from "react";

// Base Day Form Component
const BaseDayForm = ({
  questions,
  title,
  dayInfo,
  onComplete,
  isAnimating,
}) => {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // Clear error when user provides an answer
    if (errors[questionId]) {
      setErrors((prev) => ({
        ...prev,
        [questionId]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    questions.forEach((question) => {
      if (question.required && !answers[question.id]) {
        newErrors[question.id] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Scroll to top first
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        onComplete(answers);
      }, 300);
    } else {
      // Scroll to first error
      const firstErrorElement = document.querySelector(".error-field");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [answers]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        isAnimating ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      {/* Day Header */}
      <div
        className={`${dayInfo.bgColor} ${dayInfo.borderColor} border-2 rounded-xl p-4 mb-6 shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-3xl mr-4">{dayInfo.icon}</div>
            <div>
              <h2 className={`text-xl font-bold ${dayInfo.textColor}`}>
                {title}
              </h2>
              <p className="text-gray-600 text-sm">{dayInfo.subtitle}</p>
            </div>
          </div>
          <div
            className={`${dayInfo.bgColor} ${dayInfo.textColor} px-3 py-1 rounded-full text-sm font-medium`}
          >
            {dayInfo.date}
          </div>
        </div>
      </div>

      {/* Event Information */}
      {dayInfo.eventInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="text-blue-800 font-semibold mb-3">
            Event Information
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            {dayInfo.eventInfo.map((info, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>{info}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Questions Form */}
      <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={errors[question.id] ? "error-field" : ""}
            >
              {/* Question with radio buttons in same row */}
              {question.type === "radio" && (
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-blue-700 text-lg font-semibold min-w-fit">
                    {question.id}. {question.question}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>

                  <div className="flex gap-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-blue-50 group border border-gray-200 hover:border-orange-400"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) =>
                            handleAnswer(question.id, e.target.value)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                            answers[question.id] === option
                              ? "border-orange-400 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg"
                              : "border-blue-400 group-hover:border-orange-400"
                          }`}
                        >
                          {answers[question.id] === option && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700 font-medium text-sm">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Textarea Questions */}
              {question.type === "textarea" && (
                <div>
                  <h3 className="text-blue-700 text-lg font-semibold mb-4 leading-relaxed">
                    {question.id}. {question.question}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                  <textarea
                    placeholder={question.placeholder}
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="w-full p-4 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-500 border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 min-h-32 resize-none transition-all duration-200"
                  />
                </div>
              )}

              {/* Conditional Sub-questions */}
              {question.subQuestions && answers[question.id] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400">
                  {question.subQuestions
                    .filter((subQ) => subQ.showWhen === answers[question.id])
                    .map((subQuestion, subIndex) => (
                      <div
                        key={`${question.id}-${subIndex}`}
                        className="mb-4 last:mb-0"
                      >
                        {/* Sub-question radio buttons in same row */}
                        {subQuestion.type === "radio" && (
                          <div className="flex flex-wrap items-center gap-4">
                            <h4 className="text-gray-700 font-medium min-w-fit">
                              {subQuestion.question}
                              {subQuestion.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </h4>

                            <div className="flex gap-2">
                              {subQuestion.options.map((option, optIndex) => (
                                <label
                                  key={optIndex}
                                  className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white group border border-gray-200 hover:border-orange-300"
                                >
                                  <input
                                    type="radio"
                                    name={`subquestion-${question.id}-${subIndex}`}
                                    value={option}
                                    checked={
                                      answers[`${question.id}_sub`] === option
                                    }
                                    onChange={(e) =>
                                      handleAnswer(
                                        `${question.id}_sub`,
                                        e.target.value
                                      )
                                    }
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                                      answers[`${question.id}_sub`] === option
                                        ? "border-orange-400 bg-orange-400"
                                        : "border-gray-400 group-hover:border-orange-400"
                                    }`}
                                  >
                                    {answers[`${question.id}_sub`] ===
                                      option && (
                                      <div className="w-1 h-1 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span className="text-gray-600 font-medium text-sm">
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sub-question textarea */}
                        {subQuestion.type === "textarea" && (
                          <div>
                            <h4 className="text-gray-700 font-medium mb-3">
                              {subQuestion.question}
                              {subQuestion.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </h4>
                            <textarea
                              placeholder={subQuestion.placeholder}
                              value={answers[`${question.id}_sub`] || ""}
                              onChange={(e) =>
                                handleAnswer(
                                  `${question.id}_sub`,
                                  e.target.value
                                )
                              }
                              className="w-full p-3 rounded-lg bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 min-h-20 resize-none transition-all duration-200"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {errors[question.id] && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {errors[question.id]}
                </p>
              )}

              {index < questions.length - 1 && (
                <div className="border-b border-gray-200 mt-6"></div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Press{" "}
            <kbd className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
              Ctrl + Enter
            </kbd>{" "}
            to submit quickly
          </p>
          <button
            onClick={handleSubmit}
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Complete {title}
          </button>
        </div>
      </div>
    </div>
  );
};

// Day 1 Form (17th Sep - EduSkills Connect Day 1)
const Day1Form = ({ onComplete, isAnimating, userStatus }) => {
  const includesStay = userStatus && userStatus.includes("with-stay");

  const questions = [
    {
      id: 1,
      question: "Lunch Preference",
      type: "radio",
      required: true,
      options: ["Vegetarian", "Non-Vegetarian"],
    },
    {
      id: 2,
      question: "Dinner Preference",
      type: "radio",
      required: true,
      options: ["Vegetarian", "Non-Vegetarian"],
    },
    {
      id: 3,
      question: "Drink Preference",
      type: "radio",
      required: true,
      options: ["Alcohol", "Non-Alcohol"],
      subQuestions: [
        {
          showWhen: "Alcohol",
          question: "Alcohol Preference",
          type: "radio",
          required: true,
          options: ["Max 2 bottles", "Other"],
        },
        {
          showWhen: "Other",
          question: "Please specify your preference",
          type: "textarea",
          required: true,
          placeholder: "Please specify your alcohol preference...",
        },
      ],
    },
    {
      id: 4,
      question: "Do you have any food allergies?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
      subQuestions: [
        {
          showWhen: "Yes",
          question: "Please specify your food allergies",
          type: "textarea",
          required: true,
          placeholder:
            "Please list your food allergies and any special dietary requirements...",
        },
      ],
    },
    ...(includesStay
      ? [
          {
            id: 5,
            question: "Gender (for accommodation)",
            type: "radio",
            required: true,
            options: ["Male", "Female"],
          },
        ]
      : []),
    {
      id: includesStay ? 6 : 5,
      question: "How will you travel to the conference?",
      type: "radio",
      required: true,
      options: ["Bus", "Train", "Car", "Flight"],
    },
  ];

  const dayInfo = {
    icon: "🎓",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    progressColor: "bg-gradient-to-r from-blue-400 to-blue-500",
    date: "17th Sep",
    subtitle: "EduSkills Connect - Day 1",
    eventInfo: [
      "High Tea: 3:00 PM - 4:00 PM",
      "Conference Kit & Goodies will be provided",
      "Dinner: 7:00 PM - 9:00 PM",
      ...(includesStay ? ["Check-in: Available from 1:00 PM"] : []),
    ],
  };

  return (
    <BaseDayForm
      questions={questions}
      title="Day 1"
      dayInfo={dayInfo}
      onComplete={onComplete}
      isAnimating={isAnimating}
    />
  );
};

// Day 2 Form (18th Sep - EduSkills Connect Day 2)
const Day2Form = ({ onComplete, isAnimating, userStatus }) => {
  const includesStay = userStatus && userStatus.includes("with-stay");

  const questions = [
    {
      id: 1,
      question: "Lunch Preference",
      type: "radio",
      required: true,
      options: ["Vegetarian", "Non-Vegetarian"],
    },
    {
      id: 2,
      question: "Dinner Preference",
      type: "radio",
      required: true,
      options: ["Vegetarian", "Non-Vegetarian"],
    },
    {
      id: 3,
      question: "Drink Preference",
      type: "radio",
      required: true,
      options: ["Alcohol", "Non-Alcohol"],
      subQuestions: [
        {
          showWhen: "Alcohol",
          question: "Alcohol Preference",
          type: "radio",
          required: true,
          options: ["Max 2 bottles", "Other"],
        },
        {
          showWhen: "Other",
          question: "Please specify your preference",
          type: "textarea",
          required: true,
          placeholder: "Please specify your alcohol preference...",
        },
      ],
    },
    {
      id: 4,
      question: "Do you have any food allergies?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
      subQuestions: [
        {
          showWhen: "Yes",
          question: "Please specify your food allergies",
          type: "textarea",
          required: true,
          placeholder:
            "Please list your food allergies and any special dietary requirements...",
        },
      ],
    },
    ...(includesStay
      ? [
          {
            id: 5,
            question: "Gender (for accommodation)",
            type: "radio",
            required: true,
            options: ["Male", "Female"],
          },
        ]
      : []),
  ];

  const dayInfo = {
    icon: "📚",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    progressColor: "bg-gradient-to-r from-green-400 to-green-500",
    date: "18th Sep",
    subtitle: "EduSkills Connect - Day 2",
    eventInfo: [
      "High Tea: 3:00 PM - 4:00 PM",
      "Lunch: 12:30 PM - 1:30 PM",
      "Dinner: 7:00 PM - 9:00 PM",
      "Conference materials will be distributed",
    ],
  };

  return (
    <BaseDayForm
      questions={questions}
      title="Day 2"
      dayInfo={dayInfo}
      onComplete={onComplete}
      isAnimating={isAnimating}
    />
  );
};

// Day 3 Form (19th Sep - HR Summit)
const Day3Form = ({ onComplete, isAnimating, userStatus }) => {
  const includesStay = userStatus && userStatus.includes("with-stay");

  const questions = [
    {
      id: 1,
      question: "Lunch Preference",
      type: "radio",
      required: true,
      options: ["Vegetarian", "Non-Vegetarian"],
    },
    {
      id: 2,
      question: "Dinner Preference",
      type: "radio",
      required: true,
      options: ["Vegetarian", "Non-Vegetarian"],
    },
    {
      id: 3,
      question: "Drink Preference",
      type: "radio",
      required: true,
      options: ["Alcohol", "Non-Alcohol"],
      subQuestions: [
        {
          showWhen: "Alcohol",
          question: "Alcohol Preference",
          type: "radio",
          required: true,
          options: ["Max 2 bottles", "Other"],
        },
        {
          showWhen: "Other",
          question: "Please specify your preference",
          type: "textarea",
          required: true,
          placeholder: "Please specify your alcohol preference...",
        },
      ],
    },
    {
      id: 4,
      question: "Do you have any food allergies?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
      subQuestions: [
        {
          showWhen: "Yes",
          question: "Please specify your food allergies",
          type: "textarea",
          required: true,
          placeholder:
            "Please list your food allergies and any special dietary requirements...",
        },
      ],
    },
    ...(includesStay
      ? [
          {
            id: 5,
            question: "Gender (for accommodation)",
            type: "radio",
            required: true,
            options: ["Male", "Female"],
          },
        ]
      : []),
  ];

  const dayInfo = {
    icon: "👥",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    progressColor: "bg-gradient-to-r from-purple-400 to-purple-500",
    date: "19th Sep",
    subtitle: "HR Summit",
    eventInfo: [
      "High Tea: 3:00 PM - 4:00 PM",
      "Lunch: 12:30 PM - 1:30 PM",
      "Networking Cocktail Dinner: 7:00 PM - 10:00 PM",
      "Participation certificates will be awarded",
    ],
  };

  return (
    <BaseDayForm
      questions={questions}
      title="Day 3 - HR Summit"
      dayInfo={dayInfo}
      onComplete={onComplete}
      isAnimating={isAnimating}
    />
  );
};

// Day 4 Form (20th Sep - Check-out Day) - Information only
const Day4Form = ({ onComplete, isAnimating }) => {
  const dayInfo = {
    icon: "🏨",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    progressColor: "bg-gradient-to-r from-orange-400 to-orange-500",
    date: "20th Sep",
    subtitle: "Check-out Day",
    eventInfo: [
      "Breakfast: 7:00 AM - 9:30 AM",
      "Check-out: By 10:00 AM",
      "Thank you for participating in Connect'25!",
    ],
  };

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Automatically complete this "day" since it's just information
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        onComplete({});
      }, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        isAnimating ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      {/* Day Header */}
      <div
        className={`${dayInfo.bgColor} ${dayInfo.borderColor} border-2 rounded-xl p-4 mb-6 shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-3xl mr-4">{dayInfo.icon}</div>
            <div>
              <h2 className={`text-xl font-bold ${dayInfo.textColor}`}>
                Check-out & Departure
              </h2>
              <p className="text-gray-600 text-sm">{dayInfo.subtitle}</p>
            </div>
          </div>
          <div
            className={`${dayInfo.bgColor} ${dayInfo.textColor} px-3 py-1 rounded-full text-sm font-medium`}
          >
            {dayInfo.date}
          </div>
        </div>
      </div>

      {/* Event Information */}
      <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Thank You for Attending Connect'25!
        </h3>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
          <h4 className="text-orange-800 font-semibold mb-4 text-lg">
            Check-out Day Schedule
          </h4>
          <div className="space-y-3 text-orange-700">
            {dayInfo.eventInfo.map((info, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-lg">{info}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 text-sm">
            <strong>Note:</strong> No registration required for check-out day.
            Please ensure you complete check-out formalities by 10:00 AM.
          </p>
        </div>

        <div className="text-gray-600">
          <p>Automatically proceeding to completion...</p>
          <div className="mt-4">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Day1Form, Day2Form, Day3Form, Day4Form };
