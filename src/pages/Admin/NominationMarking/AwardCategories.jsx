import React, { useState } from "react";
import { Award, ChevronDown, ChevronUp } from "lucide-react";

const CompactCategorySelector = ({
  onCategorySelect,
  selectedCategory,
  categories,
  loading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="relative mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Award className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Loading categories...
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-6">
      {/* Compact Selected Category Display */}
      <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={toggleExpanded}
        >
          <div className="flex items-center">
            <Award className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {selectedCategory
                  ? selectedCategory.category_name
                  : "Select Award Category"}
              </h3>
              {selectedCategory && (
                <p className="text-sm text-gray-500">
                  {selectedCategory.designation} •
                  {selectedCategory.is_open ? " Open" : " Closed"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedCategory && (
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  selectedCategory.is_open
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedCategory.is_open ? "Active" : "Inactive"}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Categories List */}
      <div
        className={`absolute top-full left-0 right-0 z-10 mt-2 bg-white rounded-xl shadow-xl border transition-all duration-300 ease-in-out ${
          isExpanded
            ? "opacity-100 transform translate-y-0 scale-100"
            : "opacity-0 transform -translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Available Categories
          </h4>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button
                key={category.category_id}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:scale-102 ${
                  selectedCategory?.category_id === category.category_id
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "hover:bg-gray-50 text-gray-700 border border-transparent"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{category.category_name}</div>
                    <div className="text-sm text-gray-500">
                      {category.designation} • Voting:{" "}
                      {category.voting_start_date} to {category.voting_end_date}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        category.is_open ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {selectedCategory?.category_id === category.category_id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <style jsx>{`
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default CompactCategorySelector;
