import React from "react";

// Example colors: "green", "red", "yellow", "blue", etc.
const colorMap = {
  green: "bg-green-100 text-green-800 border-green-200",
  red: "bg-red-100 text-red-800 border-red-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function Alert({ message, color = "gray" }) {
  return (
    <div
      className={`border px-4 py-3 rounded relative mb-4 ${colorMap[color] || colorMap.gray}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
}
