import React from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import your SVG from assets folder
// You'll need to replace this path with the actual path to your SVG file
import LoadingAnimation from "../../assets/imgs/Double Ring@1x-1.0s-200px-200px (1).svg";

const FullScreenLoading = ({ isVisible, message }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="max-w-md w-full px-6 py-8 rounded-lg text-center">
            {/* SVG Loading Animation from assets - no animation applied */}
            <div className="w-32 h-32 mx-auto mb-8">
              <img
                src={LoadingAnimation}
                alt="Loading"
                className="w-full h-full"
              />
            </div>

            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {message || "Processing your data..."}
            </motion.h2>

            <motion.p
              className="text-gray-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Please wait while we process your information.
            </motion.p>

            {/* Warning message */}
            <motion.div
              className="mt-8 p-3 bg-yellow-50 border border-yellow-200 rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-yellow-700 font-medium">
                <span className="inline-block mr-2">⚠️</span>
                Please do not refresh or exit this page
              </p>
              <p className="text-yellow-600 text-sm mt-1">
                This process may take a few minutes to complete. Closing or
                refreshing the page may interrupt data submission.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenLoading;
