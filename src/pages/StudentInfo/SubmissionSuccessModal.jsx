import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SubmissionSuccessModal = ({ isOpen, onClose, submissionData }) => {
  const {
    message = "",
    inserted_records = 0,
    duplicate_records = 0,
    archived_count = 0,
    unarchived_count = 0,
    archived_emails = [],
  } = submissionData || {};

  // Generate CSV content for archived emails
  const generateArchivedEmailsCSV = () => {
    if (!archived_emails || archived_emails.length === 0) return "";

    const csvContent = ["Archived Email Addresses", ...archived_emails].join(
      "\n"
    );

    return csvContent;
  };

  // Download CSV file
  const downloadArchivedEmails = () => {
    const csvContent = generateArchivedEmailsCSV();
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "archived_emails.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !submissionData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {message || "Operation Complete"}
                </h3>
                <div className="flex items-center space-x-4 mt-2">
                  {duplicate_records > 0 && (
                    <span className="text-green-100 text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                      {duplicate_records} Duplicate
                      {duplicate_records > 1 ? "s" : ""}
                    </span>
                  )}
                  {unarchived_count > 0 && (
                    <span className="text-green-100 text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                      {unarchived_count} Unarchived
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* API Response Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-green-800 font-medium">{message}</p>
              </motion.div>
            )}

            {/* Statistics */}
            <div className="space-y-4">
              {/* Inserted Records */}
              {inserted_records > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <span className="text-blue-800 font-medium">
                      New Records Added
                    </span>
                  </div>
                  <span className="text-blue-900 font-bold text-lg">
                    {inserted_records}
                  </span>
                </motion.div>
              )}

              {/* Duplicate Records */}
              {duplicate_records > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-yellow-800 font-medium">
                      Duplicate Records
                    </span>
                  </div>
                  <span className="text-yellow-900 font-bold text-lg">
                    {duplicate_records}
                  </span>
                </motion.div>
              )}

              {/* Archived Records */}
              {unarchived_count > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8l6 6m-6 0l6-6"
                          />
                        </svg>
                      </div>
                      <span className="text-orange-800 font-medium">
                        Unarchived Records
                      </span>
                    </div>
                    <span className="text-orange-900 font-bold text-lg">
                      {unarchived_count}
                    </span>
                  </div>

                  {archived_emails && archived_emails.length > 0 && (
                    <div className="mt-3">
                      <p className="text-orange-700 text-sm mb-2">
                        {archived_count} email{archived_count > 1 ? "s" : ""}{" "}
                        were archived:
                      </p>
                      <div className="max-h-20 overflow-y-auto bg-orange-25 rounded border border-orange-100 p-2 mb-3">
                        {archived_emails.map((email, index) => (
                          <div
                            key={index}
                            className="text-xs text-orange-600 py-1"
                          >
                            {email}
                          </div>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={downloadArchivedEmails}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Archived Emails CSV
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubmissionSuccessModal;
