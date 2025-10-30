import React, { useState, useRef, useEffect } from "react";

// Base Survey Form Component
const BaseSurveyForm = ({ questions, title, onComplete, formData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(formData || {});
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const handleAnswer = (questionId, answer) => {
    if (questions.find((q) => q.id === questionId)?.type === "checkbox") {
      setAnswers((prev) => {
        const currentAnswers = prev[questionId] || [];
        const isSelected = currentAnswers.includes(answer);

        if (isSelected) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((item) => item !== answer),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answer],
          };
        }
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setTimeout(() => setIsAnimating(false), 50);
      }, 300);
    } else {
      onComplete(answers);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);
        setTimeout(() => setIsAnimating(false), 50);
      }, 300);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && hasAnswer) {
      nextQuestion();
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [currentQuestion, answers]);

  const currentQ = questions[currentQuestion];
  const hasAnswer =
    currentQ.type === "checkbox"
      ? answers[currentQ.id] && answers[currentQ.id].length > 0
      : answers[currentQ.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div
        ref={containerRef}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {title}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 text-xs sm:text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-gray-700 text-xs sm:text-sm">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-in-out shadow-lg"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Container */}
        <div
          className={`transform transition-all duration-500 ease-out ${
            isAnimating
              ? "translate-y-8 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-200">
            <h2 className="text-blue-700 text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
              {currentQ.id}. {currentQ.question}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {currentQ.type === "checkbox" && (
                <>
                  {currentQ.options.map((option, index) => {
                    const isChecked =
                      answers[currentQ.id] &&
                      answers[currentQ.id].includes(option);
                    return (
                      <label
                        key={index}
                        className="flex items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:bg-blue-50 group border border-gray-200 hover:border-orange-400"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={isChecked}
                          onChange={(e) =>
                            handleAnswer(currentQ.id, e.target.value)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`relative w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 rounded-md sm:rounded-lg border-2 transition-all duration-300 transform flex-shrink-0 mt-0.5 sm:mt-0 ${
                            isChecked
                              ? "border-orange-400 bg-gradient-to-br from-orange-400 to-orange-500 scale-105 shadow-lg"
                              : "border-blue-400 group-hover:border-orange-400 group-hover:scale-105"
                          }`}
                        >
                          {isChecked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 text-white stroke-current"
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20,6 9,17 4,12" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </>
              )}

              {currentQ.type === "radio" && (
                <>
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:bg-blue-50 group border border-gray-200 hover:border-orange-400"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={option}
                        checked={answers[currentQ.id] === option}
                        onChange={(e) =>
                          handleAnswer(currentQ.id, e.target.value)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 sm:mt-0 ${
                          answers[currentQ.id] === option
                            ? "border-orange-400 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg"
                            : "border-blue-400 group-hover:border-orange-400"
                        }`}
                      >
                        {answers[currentQ.id] === option && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                        {option}
                      </span>
                    </label>
                  ))}
                </>
              )}

              {currentQ.type === "textarea" && (
                <textarea
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 min-h-24 sm:min-h-32 resize-none transition-all duration-200 text-sm sm:text-base"
                />
              )}

              {currentQ.type === "text" && (
                <input
                  type="text"
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base"
                />
              )}

              {currentQ.type === "date" && (
                <input
                  type="date"
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 border border-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-4 sm:gap-0">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  currentQuestion === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-400"
                }`}
              >
                ← Previous
              </button>

              <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-gray-600 text-xs sm:text-sm italic text-center">
                  Press{" "}
                  <kbd className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold shadow-md">
                    ENTER
                  </kbd>
                </span>
                <button
                  onClick={nextQuestion}
                  disabled={!hasAnswer}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold transition-all duration-200 transform text-sm sm:text-base ${
                    hasAnswer
                      ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {currentQuestion === questions.length - 1
                    ? "Complete"
                    : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-orange-300 bg-opacity-30 rounded-full blur-xl"></div>
        <div className="fixed bottom-10 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-300 bg-opacity-30 rounded-full blur-xl"></div>
        <div className="fixed top-1/2 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-orange-400 bg-opacity-40 rounded-full blur-lg"></div>
      </div>
    </div>
  );
};

// Form 1: Member Institution - One Complimentary Pass (Without Stay)
const MemberComplimentaryNoStayForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "Which event would you like to attend?",
      type: "radio",
      options: ["17th & 18th EduSkills Connect", "19th HR Summit"],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Preferred Date (if applicable)",
      type: "date",
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="Member Institution - Complimentary Pass (Without Stay)"
      onComplete={onComplete}
    />
  );
};

// Form 2: Member Institution - One Complimentary Pass (With Stay)
const MemberComplimentaryWithStayForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "Registration Type",
      type: "radio",
      options: [
        "Super Early Bird (by 15th July) - INR 10,000 + GST",
        "Early Bird (by 15th Aug) - INR 15,000 + GST",
        "Standard - INR 20,000 + GST",
      ],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Accommodation Preferences",
      type: "checkbox",
      options: [
        "Double Sharing Room in 4 Star Resort",
        "Check-In by 1 PM on 17th Sep",
        "Check-Out by 10 AM on 20th Sep",
      ],
    },
    {
      id: 7,
      question: "Dietary Preferences",
      type: "checkbox",
      options: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Jain",
        "Special Requirements",
      ],
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="Member Institution - Complimentary Pass (With Stay)"
      onComplete={onComplete}
    />
  );
};

// Form 3: Member Institution - No Complimentary Pass (Without Stay)
const MemberNoComplimentaryNoStayForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "Which event would you like to attend?",
      type: "radio",
      options: [
        "17th & 18th EduSkills Connect - INR 5,000 + GST",
        "19th HR Summit - INR 5,000 + GST",
      ],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Preferred Date (if applicable)",
      type: "date",
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="Member Institution - No Complimentary Pass (Without Stay)"
      onComplete={onComplete}
    />
  );
};

// Form 4: Member Institution - No Complimentary Pass (With Stay)
const MemberNoComplimentaryWithStayForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "Registration Type",
      type: "radio",
      options: [
        "Super Early Bird (by 15th July) - INR 15,000 + GST",
        "Early Bird (by 15th Aug) - INR 20,000 + GST",
        "Standard - INR 25,000 + GST",
      ],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Accommodation Preferences",
      type: "checkbox",
      options: [
        "Double Sharing Room in 4 Star Resort",
        "Check-In by 1 PM on 17th Sep",
        "Check-Out by 10 AM on 20th Sep",
      ],
    },
    {
      id: 7,
      question: "Dietary Preferences",
      type: "checkbox",
      options: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Jain",
        "Special Requirements",
      ],
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="Member Institution - No Complimentary Pass (With Stay)"
      onComplete={onComplete}
    />
  );
};

// Form 5: Non-Member Institution - Without Stay (EduSkills Connect)
const NonMemberEduSkillsForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "Registration for 17th & 18th EduSkills Connect",
      type: "radio",
      options: ["INR 10,000 + GST Per Person"],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Preferred Event Dates",
      type: "checkbox",
      options: [
        "17th Sep: High Tea + Dinner",
        "18th Sep: High Tea + Lunch + Dinner",
      ],
    },
    {
      id: 7,
      question: "Dietary Preferences",
      type: "checkbox",
      options: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Jain",
        "Special Requirements",
      ],
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="Non-Member Institution - EduSkills Connect (Without Stay)"
      onComplete={onComplete}
    />
  );
};

// Form 6: Non-Member Institution - Without Stay (HR Summit)
const NonMemberHRSummitForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "Registration for 19th HR Summit",
      type: "radio",
      options: ["INR 5,000 + GST Per Person"],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Event Inclusions",
      type: "checkbox",
      options: [
        "19th Sep: High Tea + Lunch + Networking Cocktail Dinner",
        "Participation Certificate",
      ],
    },
    {
      id: 7,
      question: "Dietary Preferences",
      type: "checkbox",
      options: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Jain",
        "Special Requirements",
      ],
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="Non-Member Institution - HR Summit (Without Stay)"
      onComplete={onComplete}
    />
  );
};

// Form 7: Non-Member Institution - With Stay (Combined)
const NonMemberWithStayForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "Registration Type",
      type: "radio",
      options: [
        "Super Early Bird (by 15th July) - INR 15,000 + GST",
        "Early Bird (by 15th Aug) - INR 20,000 + GST",
        "Standard - INR 25,000 + GST",
      ],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Accommodation Preferences",
      type: "checkbox",
      options: [
        "Double Sharing Room in 4 Star Resort",
        "Check-In by 1 PM on 17th Sep",
        "Check-Out by 10 AM on 20th Sep",
      ],
    },
    {
      id: 7,
      question: "Event Inclusions",
      type: "checkbox",
      options: [
        "17th Sep: Check-In + Lunch + High Tea + Dinner",
        "18th Sep: Breakfast + High Tea + Lunch + Dinner",
        "19th Sep: Breakfast + High Tea + Lunch + Networking Cocktail Dinner",
        "20th Sep: Breakfast + Check-Out by 10 AM",
      ],
    },
    {
      id: 8,
      question: "Dietary Preferences",
      type: "checkbox",
      options: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Jain",
        "Special Requirements",
      ],
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="Non-Member Institution - Combined Events (With Stay)"
      onComplete={onComplete}
    />
  );
};

// Form 8: General Inquiry Form
const GeneralInquiryForm = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "What type of registration are you interested in?",
      type: "radio",
      options: [
        "Member Institution - With Complimentary Pass",
        "Member Institution - Without Complimentary Pass",
        "Non-Member Institution",
        "Not sure - Need more information",
      ],
    },
    {
      id: 2,
      question: "Personal Details",
      type: "text",
      placeholder: "Full Name",
    },
    {
      id: 3,
      question: "Institution/Organization Name",
      type: "text",
      placeholder: "Your Institution Name",
    },
    {
      id: 4,
      question: "Email Address",
      type: "text",
      placeholder: "your.email@example.com",
    },
    {
      id: 5,
      question: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXXXXXXX",
    },
    {
      id: 6,
      question: "Which events are you interested in?",
      type: "checkbox",
      options: [
        "17th & 18th EduSkills Connect",
        "19th HR Summit",
        "Both Events",
      ],
    },
    {
      id: 7,
      question: "Do you need accommodation?",
      type: "radio",
      options: [
        "Yes, with stay package",
        "No, without stay",
        "Not decided yet",
      ],
    },
    {
      id: 8,
      question: "Additional Questions or Comments",
      type: "textarea",
      placeholder: "Please share any specific questions or requirements...",
    },
  ];

  return (
    <BaseSurveyForm
      questions={questions}
      title="General Conference Inquiry"
      onComplete={onComplete}
    />
  );
};

// Continuing from the previous artifact...

const ConferenceRegistrationApp = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [completedForms, setCompletedForms] = useState([]);

  const handleFormComplete = (formType, answers) => {
    setCompletedForms((prev) => [
      ...prev,
      { formType, answers, timestamp: new Date() },
    ]);
    alert(
      `Registration completed for ${formType}! Thank you for your registration.`
    );
    console.log(`${formType} answers:`, answers);
    setSelectedForm(null);
  };

  const formOptions = [
    {
      id: "member-complimentary-no-stay",
      title: "Member Institution - Complimentary Pass (Without Stay)",
      description:
        "Free registration for member institutions without accommodation",
      component: MemberComplimentaryNoStayForm,
    },
    {
      id: "member-complimentary-with-stay",
      title: "Member Institution - Complimentary Pass (With Stay)",
      description: "Member institution with accommodation package",
      component: MemberComplimentaryWithStayForm,
    },
    {
      id: "member-no-complimentary-no-stay",
      title: "Member Institution - No Complimentary Pass (Without Stay)",
      description: "Member institution paid registration without accommodation",
      component: MemberNoComplimentaryNoStayForm,
    },
    {
      id: "member-no-complimentary-with-stay",
      title: "Member Institution - No Complimentary Pass (With Stay)",
      description: "Member institution paid registration with accommodation",
      component: MemberNoComplimentaryWithStayForm,
    },
    {
      id: "non-member-eduskills",
      title: "Non-Member - EduSkills Connect (Without Stay)",
      description: "Non-member registration for EduSkills Connect events",
      component: NonMemberEduSkillsForm,
    },
    {
      id: "non-member-hr-summit",
      title: "Non-Member - HR Summit (Without Stay)",
      description: "Non-member registration for HR Summit",
      component: NonMemberHRSummitForm,
    },
    {
      id: "non-member-with-stay",
      title: "Non-Member - Combined Events (With Stay)",
      description: "Non-member registration with accommodation for all events",
      component: NonMemberWithStayForm,
    },
    {
      id: "general-inquiry",
      title: "General Inquiry",
      description: "For general questions and information requests",
      component: GeneralInquiryForm,
    },
  ];

  if (selectedForm) {
    const FormComponent = selectedForm.component;
    return (
      <FormComponent
        onComplete={(answers) =>
          handleFormComplete(selectedForm.title, answers)
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Conference Registration Portal
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your registration type for the EduSkills Connect and HR
            Summit events
          </p>
          <div className="mt-6 bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              Event Dates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="bg-blue-50 p-3 rounded-lg">
                <strong>17th Sep:</strong> EduSkills Connect Day 1
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <strong>18th Sep:</strong> EduSkills Connect Day 2
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <strong>19th Sep:</strong> HR Summit
              </div>
            </div>
          </div>
        </div>

        {/* Form Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {formOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 group"
              onClick={() => setSelectedForm(option)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:from-orange-500 group-hover:to-orange-600 transition-all duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="w-6 h-6 text-blue-600 group-hover:text-orange-500 transition-colors duration-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
                {option.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {option.description}
              </p>

              <div className="flex items-center text-orange-500 font-medium text-sm group-hover:text-orange-600 transition-colors duration-300">
                <span>Start Registration</span>
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Pricing Summary
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Institution Pricing */}
            <div className="bg-blue-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Member Institution
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Complimentary Pass (Without Stay)</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>No Complimentary (Without Stay)</span>
                  <span className="font-semibold">INR 5,000 + GST</span>
                </div>
                <div className="flex justify-between">
                  <span>With Stay (Super Early Bird)</span>
                  <span className="font-semibold">INR 10,000 + GST</span>
                </div>
                <div className="flex justify-between">
                  <span>With Stay (Early Bird)</span>
                  <span className="font-semibold">INR 15,000 + GST</span>
                </div>
                <div className="flex justify-between">
                  <span>With Stay (Standard)</span>
                  <span className="font-semibold">INR 20,000 + GST</span>
                </div>
              </div>
            </div>

            {/* Non-Member Institution Pricing */}
            <div className="bg-orange-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-orange-700 mb-4">
                Non-Member Institution
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>EduSkills Connect (Without Stay)</span>
                  <span className="font-semibold">INR 10,000 + GST</span>
                </div>
                <div className="flex justify-between">
                  <span>HR Summit (Without Stay)</span>
                  <span className="font-semibold">INR 5,000 + GST</span>
                </div>
                <div className="flex justify-between">
                  <span>With Stay (Super Early Bird)</span>
                  <span className="font-semibold">INR 15,000 + GST</span>
                </div>
                <div className="flex justify-between">
                  <span>With Stay (Early Bird)</span>
                  <span className="font-semibold">INR 20,000 + GST</span>
                </div>
                <div className="flex justify-between">
                  <span>With Stay (Standard)</span>
                  <span className="font-semibold">INR 25,000 + GST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Registrations */}
        {completedForms.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Completed Registrations
            </h2>
            <div className="space-y-4">
              {completedForms.map((form, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">
                        {form.formType}
                      </h3>
                      <p className="text-sm text-green-600">
                        Completed on {form.timestamp.toLocaleDateString()} at{" "}
                        {form.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-8 text-center bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about registration or need assistance,
            please contact us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contact@conference.com
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +91 XXXX-XXXX-XX
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-orange-300 bg-opacity-30 rounded-full blur-xl"></div>
        <div className="fixed bottom-10 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-300 bg-opacity-30 rounded-full blur-xl"></div>
        <div className="fixed top-1/2 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-orange-400 bg-opacity-40 rounded-full blur-lg"></div>
      </div>
    </div>
  );
};

export default ConferenceRegistrationApp;
