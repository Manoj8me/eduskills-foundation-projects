import { CircularProgress } from "@mui/material";

const FullScreenDatabaseLoading = ({ isVisible, message = "Loading..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Material-UI Circular Progress */}
        <div className="relative">
          <CircularProgress size={64} thickness={4} color="info" />
        </div>

        {/* Loading text */}
        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-blue-700">{message}</p>
          <p className="text-sm text-gray-500 mt-1">
            Please wait while we fetch your data...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-1 mt-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenDatabaseLoading;
