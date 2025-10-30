import React, { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const IntakeTourGuide = () => {
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    const tourSeen = localStorage.getItem("intakeTourSeen");

    if (!tourSeen) {
      const driverObj = driver({
        showProgress: true,
        allowClose: false,
        stagePadding: 5,
        animate: true,
        overlayColor: "rgba(0, 0, 0, 0.8)",
        popoverClass: "driver-popover-custom",
        showButtons: ["next", "previous"],
        steps: [
          {
            element: "#search-box",
            popover: {
              title: "Search Students",
              description:
                "Quickly find students by searching their email address",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#add-single-intake",
            popover: {
              title: "Add Single Student",
              description: "Click here to add details of a single student",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#add-bulk-intake",
            popover: {
              title: "Bulk Upload",
              description: "Upload multiple student records using a CSV file",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#student-table",
            popover: {
              title: "Student Records",
              description:
                "View all student records in this table. You can select multiple records for bulk actions.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#action-menu",
            popover: {
              title: "Student Actions",
              description:
                "View details, edit email, or delete student records using these options",
              side: "left",
              align: "start",
            },
          },
          {
            element: "#pagination-controls",
            popover: {
              title: "Navigation",
              description:
                "Navigate through pages and adjust how many records to display",
              side: "top",
              align: "start",
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem("intakeTourSeen", "true");
          setHasSeenTour(true);
        },
      });

      // Inject custom styles
      const style = document.createElement("style");
      style.textContent = `
        .driver-popover-custom {
          background-color: #1e293b !important;
          color: #f8fafc !important;
        }
        
        .driver-popover-custom .driver-popover-title {
          color: #60a5fa !important;
          font-size: 18px !important;
          font-weight: bold !important;
        }
        
        .driver-popover-custom .driver-popover-description {
          color: #e2e8f0 !important;
          font-size: 14px !important;
          margin-top: 8px !important;
        }
        
        .driver-popover-custom .driver-popover-progress-text {
          color: #94a3b8 !important;
        }
        
        .driver-popover-custom button.driver-prev-btn {
          background-color: #475569 !important;
          color: white !important;
        }
        
        .driver-popover-custom button.driver-next-btn {
          background-color: #2563eb !important;
          color: white !important;
        }
        
        .driver-popover-custom button.driver-done-btn {
          background-color: #16a34a !important;
          color: white !important;
        }
        
        .driver-popover-custom button:hover {
          opacity: 0.9;
        }
      `;
      document.head.appendChild(style);

      driverObj.drive();
    }
  }, []);

  return null;
};

export default IntakeTourGuide;
