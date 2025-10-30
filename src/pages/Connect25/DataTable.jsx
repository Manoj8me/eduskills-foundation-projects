import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const DataTable = ({
  data,
  type,
  currentPage,
  itemsPerPage,
  onPageChange,
  yearCategories = [],
  instituteNominatedCategories = [],
  instituteWinnerCategories = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(item).some(
        (value) => value && value.toString().toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onPageChange(1); // Reset to first page when searching
  };

  const handlePageClick = (page) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Get unique categories from the data - handle arrays, single values, and comma-separated strings
  const getUniqueCategories = () => {
    const categories = new Set();
    data.forEach((item) => {
      if (item.category) {
        // Handle array of categories
        if (Array.isArray(item.category)) {
          item.category.forEach((cat) => categories.add(cat.trim()));
        }
        // Handle comma-separated string
        else if (
          typeof item.category === "string" &&
          item.category.includes(",")
        ) {
          item.category.split(",").forEach((cat) => categories.add(cat.trim()));
        }
        // Handle single category string
        else {
          categories.add(item.category);
        }
      }
    });
    return Array.from(categories);
  };

  // Check if this is a type that has categories
  const hasCategories = type === "nominated" || type === "winners";

  const renderTableHeaders = () => {
    if (currentData.length === 0 && filteredData.length === 0) return null;

    // Use original data if current data is empty but filtered data exists
    const sampleItem =
      currentData.length > 0
        ? currentData[0]
        : data.length > 0
        ? data[0]
        : null;
    if (!sampleItem) return null;

    const headers = Object.keys(sampleItem);
    return headers.map((header) => (
      <th
        key={header}
        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
      >
        {header
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())}
      </th>
    ));
  };

  const renderTableRows = () => {
    return currentData.map((item, index) => (
      <tr key={index} className="hover:bg-gray-50 transition-colors">
        {Object.entries(item).map(([key, value], cellIndex) => (
          <td
            key={cellIndex}
            className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100 break-words"
          >
            {key === "category" && value ? (
              <div className="flex flex-wrap gap-1">
                {/* Handle array of categories */}
                {Array.isArray(value) ? (
                  value.map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {cat}
                    </span>
                  ))
                ) : /* Handle comma-separated string or single category */
                typeof value === "string" && value.includes(",") ? (
                  value.split(",").map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {cat.trim()}
                    </span>
                  ))
                ) : (
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {value}
                  </span>
                )}
              </div>
            ) : (
              value || "-"
            )}
          </td>
        ))}
      </tr>
    ));
  };

  const clearSearch = () => {
    setSearchTerm("");
    onPageChange(1);
  };

  // Render category-based view
  const renderCategoryView = () => {
    const categories = getUniqueCategories();

    return (
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryData = filteredData.filter(
            (item) => item.category === category
          );

          return (
            <div
              key={category}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category}
                </h3>
                <p className="text-sm text-gray-600">
                  {categoryData.length}{" "}
                  {categoryData.length === 1 ? "person" : "people"}
                </p>
              </div>

              <div className="p-4">
                <div className="grid gap-4">
                  {categoryData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.designation}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              {item.department}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.email}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              {item.contact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Get all institute categories to display
  const getAllInstituteCategories = () => {
    const allCategories = [];

    // Add nominated categories with type indicator
    instituteNominatedCategories.forEach((category) => {
      allCategories.push({ category, type: "nominated" });
    });

    // Add winner categories with type indicator
    instituteWinnerCategories.forEach((category) => {
      allCategories.push({ category, type: "winner" });
    });

    return allCategories;
  };

  return (
    <div className="space-y-6">
      {/* Individual Lists Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          📋 Individual Lists
        </h2>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {currentData.length} of {filteredData.length} {type}
              {filteredData.length !== data.length && (
                <span className="text-gray-500">
                  {" "}
                  (filtered from {data.length} total)
                </span>
              )}
            </div>
            {searchTerm && (
              <div className="flex items-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  Filtered by: "{searchTerm}"
                </span>
                <button
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            {currentData.length > 0 ? (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {renderTableRows()}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">{searchTerm ? "🔍" : "📋"}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No results found" : `No ${type} available`}
                </h3>
                <p className="text-sm">
                  {searchTerm
                    ? `No ${type} found matching "${searchTerm}". Try adjusting your search.`
                    : `There are currently no ${type} to display.`}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({filteredData.length} total{" "}
                {type})
              </div>

              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-300"
                  }`}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      page === currentPage
                        ? "bg-blue-500 text-white border border-blue-500"
                        : page === "..."
                        ? "text-gray-500 cursor-default bg-white"
                        : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-300"
                    }`}
                    disabled={page === "..."}
                    title={page === "..." ? "" : `Go to page ${page}`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-300"
                  }`}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile-friendly pagination info */}
          <div className="sm:hidden text-center text-xs text-gray-500">
            {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{" "}
            {filteredData.length}
          </div>
        </div>
      </div>

      {/* Institute Section - Show institute categories from API response */}
      {(hasCategories || getAllInstituteCategories().length > 0) && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            🏢 Institute
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getAllInstituteCategories().length > 0
                ? // Show institute categories from API response
                  getAllInstituteCategories().map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition-shadow ${
                        item.type === "winner"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-3 ${
                            item.type === "winner"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                        ></div>
                        <div>
                          <span className="text-sm font-medium text-gray-800">
                            {item.category}
                          </span>
                          <div
                            className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                              item.type === "winner"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.type === "winner" ? "Winner" : "Nominated"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : // Fallback to individual categories if no institute categories
                  getUniqueCategories().map((category, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <div>
                            <span className="text-sm font-medium text-gray-800">
                              {category}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {getAllInstituteCategories().length === 0 &&
              getUniqueCategories().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="text-sm">No categories available</p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
