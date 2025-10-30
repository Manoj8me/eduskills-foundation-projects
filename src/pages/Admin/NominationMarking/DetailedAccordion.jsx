import React, { useState, useEffect } from "react";
import {
  Building,
  ChevronDown,
  ChevronRight,
  Mail,
  User,
  Eye,
  FileText,
  Download,
  GripVertical,
} from "lucide-react";

const DetailedAccordion = ({ person, isVisible, apiCall }) => {
  const [openSections, setOpenSections] = useState({});
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sectionOrder, setSectionOrder] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      // Close all sections first
      const newSections = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      // Open the clicked section if it was closed
      newSections[section] = !prev[section];
      return newSections;
    });
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      return date.toLocaleDateString("en-US", options);
    } catch (e) {
      return dateString;
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, sectionKey) => {
    setDraggedItem(sectionKey);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropTargetKey) => {
    e.preventDefault();

    if (draggedItem && draggedItem !== dropTargetKey) {
      const newOrder = [...sectionOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(dropTargetKey);

      // Remove dragged item and insert at new position
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);

      setSectionOrder(newOrder);
    }
  };

  // Function to format keys for display
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/&/g, " & ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Function to check if value is a file URL
  const isFileUrl = (value) => {
    return (
      typeof value === "string" &&
      value.includes("http") &&
      (value.includes(".pdf") ||
        value.includes(".doc") ||
        value.includes(".jpg") ||
        value.includes(".png") ||
        value.includes(".jpeg"))
    );
  };

  // Function to check if value is a date
  const isDateValue = (key, value) => {
    const dateKeys = ["submissionDate", "date", "createdAt", "updatedAt"];
    return (
      dateKeys.some((dateKey) =>
        key.toLowerCase().includes(dateKey.toLowerCase())
      ) ||
      (typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value))
    );
  };

  // Function to parse JSON strings safely
  const parseJsonValue = (value) => {
    if (
      typeof value === "string" &&
      (value.startsWith("[") || value.startsWith("{"))
    ) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  // Function to check if a key should be ignored
  const shouldIgnoreKey = (key) => {
    const ignoredKeys = ["corporate_id"];
    return ignoredKeys.includes(key);
  };

  // Function to render value based on type
  const renderValue = (key, value) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400 italic">Not provided</span>;
    }

    // Check if it's a date value first
    if (isDateValue(key, value)) {
      return (
        <span className="text-sm text-gray-800 bg-blue-50 px-2 py-1 rounded-lg">
          {formatDate(value)}
        </span>
      );
    }

    if (isFileUrl(value)) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-800 truncate max-w-xs">
            {value.split("/").pop()}
          </span>
          <button
            onClick={() => window.open(value, "_blank")}
            className="flex items-center px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
        </div>
      );
    }

    const parsedValue = parseJsonValue(value);

    if (Array.isArray(parsedValue)) {
      return (
        <div className="space-y-1">
          {parsedValue.map((item, index) => (
            <div key={index} className="text-sm text-gray-800">
              {typeof item === "object" ? (
                <div className="bg-gray-50 p-2 rounded border-l-2 border-blue-200">
                  {Object.entries(item)
                    .filter(([k]) => !shouldIgnoreKey(k))
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="font-medium text-gray-600">
                          {formatKey(k)}:
                        </span>
                        <span className="text-gray-800">
                          {isDateValue(k, v) ? formatDate(v) : v || "N/A"}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1 mb-1">
                  {item}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof parsedValue === "object") {
      return (
        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-200">
          {Object.entries(parsedValue)
            .filter(([k]) => !shouldIgnoreKey(k))
            .map(([k, v]) => (
              <div key={k} className="mb-2 last:mb-0">
                <label className="text-xs font-medium text-gray-500">
                  {formatKey(k)}
                </label>
                <p className="text-sm text-gray-800">{renderValue(k, v)}</p>
              </div>
            ))}
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }

    return <span className="text-sm text-gray-800">{String(value)}</span>;
  };

  // Fetch detailed data when person changes
  useEffect(() => {
    if (person && apiCall) {
      fetchDetailedData();
    }
  }, [person]);

  const fetchDetailedData = async () => {
    if (!person || !apiCall) return;

    try {
      setLoading(true);
      const data = await apiCall(
        `/admin/nomination/full/${person.leader_id}/${person.category_id}`
      );
      setDetailedData(data);

      // Initialize section order and auto-open first section
      if (data && Object.keys(data).length > 0) {
        const sections = Object.keys(data).filter(
          (key) => key !== "is_accepted"
        );
        setSectionOrder(sections);
        const firstSection = sections[0];
        setOpenSections({ [firstSection]: true });
      }
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!person) {
    return (
      <div
        className={`bg-white rounded-xl shadow-lg p-8 text-center transition-all duration-700 ease-in-out ${
          isVisible
            ? "transform translate-x-0 opacity-100 scale-100"
            : "transform translate-x-full opacity-0 scale-95"
        }`}
      >
        <div className="text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Select a nominee to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-700 ease-in-out ${
        isVisible
          ? "transform translate-x-0 opacity-100 scale-100"
          : "transform translate-x-full opacity-0 scale-95"
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 animate-fade-in">
              {person.name}
            </h3>
            <div className="flex items-center mt-2 space-x-4 animate-slide-up flex-wrap gap-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Building className="w-4 h-4 mr-1" />
                {person.institute_name}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <User className="w-4 h-4 mr-1" />
                {person.designation}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="w-4 h-4 mr-1" />
                {person.email}
              </div>
            </div>
          </div>
          {detailedData?.is_accepted !== undefined && (
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  detailedData.is_accepted === 1
                    ? "bg-green-100 text-green-700"
                    : detailedData.is_accepted === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {detailedData.is_accepted === 1
                  ? "Accepted"
                  : detailedData.is_accepted === 0
                  ? "Pending"
                  : "Rejected"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading detailed information...</div>
        </div>
      )}

      {/* Dynamic Sections */}
      {detailedData && !loading && (
        <div className="space-y-4">
          {sectionOrder.map((sectionKey, index) => {
            const sectionData = detailedData[sectionKey];
            return (
              <div
                key={sectionKey}
                className="mb-4"
                draggable
                onDragStart={(e) => handleDragStart(e, sectionKey)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, sectionKey)}
              >
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102 cursor-pointer select-none"
                >
                  <div className="flex items-center">
                    <GripVertical className="w-4 h-4 mr-2 text-gray-400 cursor-grab active:cursor-grabbing" />
                    <FileText className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-semibold text-gray-700 text-sm">
                      {formatKey(sectionKey)}
                    </span>
                  </div>
                  {openSections[sectionKey] ? (
                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openSections[sectionKey]
                      ? "max-h-80 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-3 p-4 border border-gray-200 rounded-lg max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {sectionData && typeof sectionData === "object" ? (
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(sectionData)
                          .filter(([key]) => !shouldIgnoreKey(key))
                          .map(([key, value], fieldIndex) => (
                            <div
                              key={key}
                              className="animate-fade-in"
                              style={{ animationDelay: `${fieldIndex * 0.1}s` }}
                            >
                              <label className="text-xs font-medium text-gray-500 mb-1 block">
                                {formatKey(key)}
                              </label>
                              <div className="text-sm text-gray-800">
                                {renderValue(key, value)}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-800">
                        {renderValue(sectionKey, sectionData)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Basic Info Fallback */}
      {!loading && !detailedData && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection("basic")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-102"
          >
            <span className="font-semibold text-gray-700 text-sm">
              Basic Information
            </span>
            {openSections.basic ? (
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openSections.basic ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mt-3 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="animate-fade-in">
                  <label className="text-xs font-medium text-gray-500">
                    Nomination ID
                  </label>
                  <p className="text-sm text-gray-800">
                    {person.nomination_id}
                  </p>
                </div>
                <div className="animate-fade-in">
                  <label className="text-xs font-medium text-gray-500">
                    Leader ID
                  </label>
                  <p className="text-sm text-gray-800">{person.leader_id}</p>
                </div>
                <div className="animate-fade-in">
                  <label className="text-xs font-medium text-gray-500">
                    Mobile Number
                  </label>
                  <p className="text-sm text-gray-800">
                    {person.mobile_number}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        /* Custom scrollbar styles */
        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 6px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background-color: #f3f4f6;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default DetailedAccordion;
