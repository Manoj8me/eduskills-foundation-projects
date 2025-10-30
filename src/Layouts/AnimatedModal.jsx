import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "./ModalAnimation.css"; // Import our animations
import NewEducationForm from "../pages/InstituteProfile/NewEducationForm";

const AnimatedModal = ({ isOpen, onClose, buttonRect }) => {
  const [animationState, setAnimationState] = useState("initial");
  const modalRef = useRef(null);

  // When modal opens, handle animation states
  useEffect(() => {
    if (isOpen) {
      // Start with "initial" state
      setAnimationState("initial");

      // Force a reflow before transitioning to "animating"
      const openTimer = setTimeout(() => {
        setAnimationState("opening");
      }, 10);

      // After animation completes, set to "complete"
      const completeTimer = setTimeout(() => {
        setAnimationState("complete");
      }, 300);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const handleClose = () => {
    setAnimationState("closing");
    setTimeout(() => {
      onClose();
    }, 250); // Match with CSS transition out duration
  };

  if (!isOpen) return null;

  // If no button position is provided, use a default centered position
  const defaultPosition = {
    top: window.innerHeight / 2,
    left: window.innerWidth / 2,
    width: 150,
    height: 40,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
  };

  // Use provided button position or default to center
  const position = buttonRect || defaultPosition;

  return createPortal(
    <div
      className={`modal-backdrop ${
        animationState !== "initial" ? "visible" : ""
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`modal-content ${animationState}`}
        style={{
          // Set initial position to button's position
          ...(animationState === "initial"
            ? {
                position: "fixed",
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                height: `${position.height}px`,
                borderRadius: "50%",
                opacity: 0,
              }
            : {}),
          // For all other states, rely on the CSS classes to position correctly
          backgroundColor: "#fff",
          overflow: "auto",
          zIndex: 1050,
        }}
      >
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            style={{
              opacity: animationState === "complete" ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              zIndex: 10001 /* Make sure close button is above everything */,
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Render the form with fade-in effect */}
          <div
            className="transition-opacity duration-300"
            style={{
              opacity: animationState === "complete" ? 1 : 0,
            }}
          >
            <NewEducationForm handleClose={handleClose} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AnimatedModal;
