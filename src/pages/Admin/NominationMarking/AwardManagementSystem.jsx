import React, { useState, useEffect } from "react";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";

import FilterSidebar from "./FilterSidebar";
import DetailedAccordion from "./DetailedAccordion";
import ActionButtons from "./ActionButton";
import { BASE_URL } from "../../../services/configUrls";
import CompactCategorySelector from "./AwardCategories";

// Leaderwise Votes Modal Component
const LeaderwiseVotesModal = ({ isOpen, onClose, apiCall }) => {
  const [leaderwiseData, setLeaderwiseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("leaders");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    designation: "",
    institute: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchLeaderwiseData();
    }
  }, [isOpen]);

  const fetchLeaderwiseData = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/admin/leaderwise-votes-summary");
      setLeaderwiseData(data);
    } catch (error) {
      console.error("Error fetching leaderwise data:", error);
      alert("Failed to fetch leaderwise votes summary.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    if (!leaderwiseData) return [];
    return activeTab === "leaders"
      ? leaderwiseData.leader_votes_summary || []
      : leaderwiseData.tpo_votes_summary || [];
  };

  // Get unique values for filters
  const getUniqueValues = (key) => {
    const data = getCurrentData();
    const values = data
      .map((item) => {
        if (key === "designation") {
          return item.designation?.replace(/_/g, " ");
        }
        return item[key];
      })
      .filter(Boolean);
    return [...new Set(values)].sort();
  };

  const filteredData = getCurrentData().filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email &&
        item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.institute_name &&
        item.institute_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDesignation =
      !filters.designation ||
      item.designation?.replace(/_/g, " ").toLowerCase() ===
        filters.designation.toLowerCase();

    const matchesInstitute =
      !filters.institute ||
      item.institute_name?.toLowerCase() === filters.institute.toLowerCase();

    return matchesSearch && matchesDesignation && matchesInstitute;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
    setFilters({ designation: "", institute: "" });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({ designation: "", institute: "" });
    setCurrentPage(1);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] "
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            Votes Summary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleTabChange("leaders")}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    activeTab === "leaders"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Leader Votes (
                  {leaderwiseData?.leader_votes_summary?.length || 0})
                </button>
                <button
                  onClick={() => handleTabChange("tpo")}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    activeTab === "tpo"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  TPO Votes ({leaderwiseData?.tpo_votes_summary?.length || 0})
                </button>
              </div>

              {/* Search Bar and Filters */}
              <div className="flex flex-wrap gap-3 mb-4 items-end">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[280px] max-w-[400px]">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Designation Filter */}
                <div className="min-w-[140px]">
                  <select
                    value={filters.designation}
                    onChange={(e) =>
                      handleFilterChange("designation", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Designations</option>
                    {getUniqueValues("designation").map((designation) => (
                      <option key={designation} value={designation}>
                        {designation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Institute Filter */}
                <div className="min-w-[140px]">
                  <select
                    value={filters.institute}
                    onChange={(e) =>
                      handleFilterChange("institute", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Institutes</option>
                    {getUniqueValues("institute_name").map((institute) => (
                      <option key={institute} value={institute}>
                        {institute}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div>
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>

                {/* Items Per Page Selector */}
                <div className="min-w-[80px]">
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value={5}>5 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={50}>50 rows</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.designation || filters.institute || searchTerm) && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.designation && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Designation: {filters.designation}
                      <button
                        onClick={() => handleFilterChange("designation", "")}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.institute && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Institute: {filters.institute}
                      <button
                        onClick={() => handleFilterChange("institute", "")}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Table Container with Fixed Height and Scroll */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  style={{
                    height:
                      itemsPerPage === 5
                        ? "300px"
                        : itemsPerPage === 10
                        ? "500px"
                        : "600px",
                    overflow: "auto",
                    border: "1px solid transparent",
                  }}
                >
                  <div
                    style={{
                      minHeight:
                        itemsPerPage === 5
                          ? "301px"
                          : itemsPerPage === 10
                          ? "501px"
                          : "601px",
                      overflowY: "scroll",
                      height: "100%",
                    }}
                  >
                    <table
                      className="w-full border-collapse"
                      style={{ minHeight: "100%" }}
                    >
                      <thead className="sticky top-0 bg-gray-50 z-10">
                        <tr>
                          <th className="text-left p-3 border-b font-semibold text-gray-700 text-sm">
                            Name
                          </th>
                          <th className="text-left p-3 border-b font-semibold text-gray-700 text-sm">
                            Email
                          </th>
                          <th className="text-left p-3 border-b font-semibold text-gray-700 text-sm">
                            Institute
                          </th>
                          <th className="text-left p-3 border-b font-semibold text-gray-700 text-sm">
                            Designation
                          </th>
                          <th className="text-left p-3 border-b font-semibold text-gray-700 text-sm">
                            Category
                          </th>
                          <th className="text-center p-3 border-b font-semibold text-gray-700 text-sm">
                            Student Votes
                          </th>
                          {activeTab === "leaders" ? (
                            <th className="text-center p-3 border-b font-semibold text-gray-700 text-sm">
                              Total Score
                            </th>
                          ) : (
                            <>
                              <th className="text-center p-3 border-b font-semibold text-gray-700 text-sm">
                                Corporate Votes
                              </th>
                              <th className="text-center p-3 border-b font-semibold text-gray-700 text-sm">
                                Score
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {paginatedData.length > 0 ? (
                          paginatedData.map((item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="p-3 border-b font-medium text-gray-800 text-sm">
                                {item.full_name}
                              </td>
                              <td className="p-3 border-b text-gray-600 text-sm">
                                {item.email || "N/A"}
                              </td>
                              <td className="p-3 border-b text-gray-600 text-sm">
                                {item.institute_name || "N/A"}
                              </td>
                              <td className="p-3 border-b text-gray-600 capitalize text-sm">
                                {item.designation.replace(/_/g, " ")}
                              </td>
                              <td className="p-3 border-b text-gray-600 text-sm">
                                {item.category_name}
                              </td>
                              <td className="p-3 border-b text-center">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {item.student_votes}
                                </span>
                              </td>
                              {activeTab === "leaders" ? (
                                <td className="p-3 border-b text-center">
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {item.total_score}
                                  </span>
                                </td>
                              ) : (
                                <>
                                  <td className="p-3 border-b text-center">
                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                      {item.corporate_votes}
                                    </span>
                                  </td>
                                  <td className="p-3 border-b text-center">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                      {item.total_score}
                                    </span>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={activeTab === "leaders" ? 7 : 8}
                              className="p-8 text-center text-gray-500"
                            >
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* Force scroll by adding extra content */}
                    <div style={{ height: "1px", width: "100%" }}></div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredData.length)}{" "}
                    of {filteredData.length} entries
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="flex space-x-1">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              currentPage === pageNum
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Vote Summary Component
const VoteSummary = ({ voteSummary, loading, apiCall }) => {
  const [showLeaderwiseModal, setShowLeaderwiseModal] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!voteSummary) return null;

  const {
    total_leader_nominations = 0,
    total_tpo_nominations = 0,
    total_student_votes = 0,
    total_corporate_votes = 0,
    leader_nominations_designationwise = {},
  } = voteSummary;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Vote & Nomination Summary
        </h2>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{total_leader_nominations}</div>
            <div className="text-sm opacity-90">Leader Nominations</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{total_tpo_nominations}</div>
            <div className="text-sm opacity-90">TPO Nominations</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{total_student_votes}</div>
            <div className="text-sm opacity-90">Student Votes</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{total_corporate_votes}</div>
            <div className="text-sm opacity-90">Corporate Votes</div>
          </div>

          {/* New Leaderwise Votes Card */}
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white cursor-pointer hover:from-indigo-600 hover:to-indigo-700 transition-colors transform hover:scale-105"
            onClick={() => setShowLeaderwiseModal(true)}
          >
            <div className="text-2xl font-bold">📊</div>
            <div className="text-sm opacity-90">Leaderwise Votes</div>
            <div className="text-xs opacity-75 mt-1">Click to view details</div>
          </div>
        </div>

        {/* Leader Nominations by Designation */}
        {Object.keys(leader_nominations_designationwise).length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Leader Nominations by Designation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Object.entries(leader_nominations_designationwise).map(
                ([designation, count]) => (
                  <div
                    key={designation}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      {designation.replace(/_/g, " ")}
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-2 py-1 rounded-full">
                      {count}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Leaderwise Votes Modal */}
      <LeaderwiseVotesModal
        isOpen={showLeaderwiseModal}
        onClose={() => setShowLeaderwiseModal(false)}
        apiCall={apiCall}
      />
    </>
  );
};

const AwardManagementSystem = () => {
  const [categories, setCategories] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [voteSummary, setVoteSummary] = useState(null);
  const [loading, setLoading] = useState({
    categories: true,
    nominees: false,
    voteSummary: false,
  });
  const [filters, setFilters] = useState({
    institute: "",
    designation: "",
  });

  // API utility function with auth token
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Fetch categories and vote summary on component mount
  useEffect(() => {
    fetchCategories();
    fetchVoteSummary();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, categories: true }));
      const data = await apiCall("/admin/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchNominees = async (categoryId) => {
    try {
      setLoading((prev) => ({ ...prev, nominees: true }));
      const data = await apiCall(`/admin/nominees/${categoryId}`);
      setNominees(data);
    } catch (error) {
      console.error("Error fetching nominees:", error);
      alert("Failed to fetch nominees. Please try again.");
      setNominees([]);
    } finally {
      setLoading((prev) => ({ ...prev, nominees: false }));
    }
  };

  const fetchVoteSummary = async () => {
    try {
      setLoading((prev) => ({ ...prev, voteSummary: true }));
      const data = await apiCall("/admin/vote-nomination-summary");
      setVoteSummary(data);
    } catch (error) {
      console.error("Error fetching vote summary:", error);
      alert("Failed to fetch vote summary. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, voteSummary: false }));
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedPerson(null);
    setShowDetails(true);
    setNominees([]);
    fetchNominees(category.category_id);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleAccept = (person) => {
    alert(
      `${person.name} has been accepted for ${selectedCategory?.category_name}!`
    );
    // Here you can make an API call to update the status
    // await apiCall(`/admin/nominees/${person.nomination_id}/accept`, { method: 'POST' });
  };

  const handleReject = (person) => {
    alert(
      `${person.name} has been rejected for ${selectedCategory?.category_name}.`
    );
    // Here you can make an API call to update the status
    // await apiCall(`/admin/nominees/${person.nomination_id}/reject`, { method: 'POST' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-[1536px] mx-auto">
        <VoteSummary
          voteSummary={voteSummary}
          loading={loading.voteSummary}
          apiCall={apiCall}
        />
        <CompactCategorySelector
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          categories={categories}
          loading={loading.categories}
        />

        {showDetails && (
          <ActionButtons
            selectedPerson={selectedPerson}
            selectedCategory={selectedCategory}
            onAccept={handleAccept}
            onReject={handleReject}
            apiCall={apiCall}
          />
        )}

        {showDetails && (
          <div className="flex gap-6 overflow-hidden">
            <FilterSidebar
              data={nominees}
              onSelectPerson={setSelectedPerson}
              selectedPerson={selectedPerson}
              filters={filters}
              onFilterChange={handleFilterChange}
              isVisible={showDetails}
              loading={loading.nominees}
            />

            <div className="flex-1">
              <DetailedAccordion
                person={selectedPerson}
                isVisible={showDetails}
                apiCall={apiCall}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardManagementSystem;
