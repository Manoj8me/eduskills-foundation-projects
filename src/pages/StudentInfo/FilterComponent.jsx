import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

// Filter component for selecting Course, Branch, and Passout Year
const FilterComponent = ({
  selectedCourse,
  setSelectedCourse,
  selectedCourseId,
  setSelectedCourseId,
  selectedBranch,
  setSelectedBranch,
  selectedYear,
  setSelectedYear,
  branchDisabled,
  setBranchDisabled,
  yearDisabled,
  setYearDisabled,
  filtersValid,
  isLoading,
  isSubmitting,
  canAddData,
  isLeader,
}) => {
  // State for API data
  const [programsData, setProgramsData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Year dropdown options - current year + future years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) =>
    (currentYear + i).toString()
  );

  // Fetch programs and branches from API
  useEffect(() => {
    const fetchProgramsAndBranches = async () => {
      setIsLoadingAPI(true);
      setApiError(null);

      try {
        // Get access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Access token not found");
        }

        // Call the API with authorization header
        const response = await api.get(
          `${BASE_URL}/internship/programs_branches`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Update state with the response data
        setProgramsData(response.data.programs || []);
        setBranchesData(response.data.branches || []);
      } catch (error) {
        console.error("Error fetching programs and branches:", error);
        setApiError(error.message || "Failed to fetch data");
      } finally {
        setIsLoadingAPI(false);
      }
    };

    fetchProgramsAndBranches();
  }, []);

  // Get active programs (courses)
  const activeProgramOptions = programsData
    .filter((program) => program.is_active === "1")
    .map((program) => ({
      id: program.program_id,
      name: program.program_name,
    }));

  // Get branches for selected program/course
  const getBranchesForProgram = (programId) => {
    if (!programId) return [];

    return branchesData
      .filter(
        (branch) =>
          branch.program_id.toString() === programId.toString() &&
          branch.is_active === "1"
      )
      .map((branch) => ({
        id: branch.branch_id,
        name: branch.branch_name,
      }));
  };

  // Get branches for selected program
  const filteredBranchOptions = selectedCourse
    ? getBranchesForProgram(
        programsData.find((p) => p.program_name === selectedCourse)?.program_id
      )
    : [];

  // Handle course change
  // Handle course change
  const handleCourseChange = (e) => {
    const selectedValue = e.target.value;
    const selectedProgram = programsData.find(
      (p) => p.program_name === selectedValue
    );

    setSelectedCourse(selectedValue);
    setSelectedCourseId(selectedProgram?.program_id || "");
    setSelectedBranch("");
    setSelectedYear("");

    if (selectedValue) {
      setBranchDisabled(false);
    } else {
      setBranchDisabled(true);
      setYearDisabled(true);
    }
  };
  // Handle branch change
  const handleBranchChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedBranch(selectedValue);

    if (selectedValue) {
      setYearDisabled(false);
    } else {
      setYearDisabled(true);
      setSelectedYear("");
    }
  };

  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <h3 className="text-sm font-semibold text-blue-800 mb-3">
        Required Filters
      </h3>

      {isLoadingAPI ? (
        <div className="flex items-center space-x-2 text-blue-700">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Loading filter options...</span>
        </div>
      ) : apiError ? (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
          Error loading filter options. Please refresh the page.
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          {/* Course Dropdown */}
          <div className="flex flex-col">
            <label
              htmlFor="courseSelect"
              className="text-xs font-medium text-blue-800 mb-1 required-field"
            >
              Course
            </label>
            <select
              id="courseSelect"
              className={`px-2 py-1 border ${
                selectedCourse
                  ? "bg-blue-50 border-blue-400"
                  : "border-blue-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs min-w-[120px]`}
              value={selectedCourse}
              onChange={handleCourseChange}
              disabled={
                isLoading || isSubmitting || !canAddData || isLoadingAPI
              }
            >
              <option value="">Select Course</option>
              {activeProgramOptions.map((program) => (
                <option key={program.id} value={program.name}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right Arrow Icon */}
          <div className="text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Branch Dropdown */}
          <div className="flex flex-col">
            <label
              htmlFor="branchSelect"
              className="text-xs font-medium text-blue-800 mb-1 required-field"
            >
              Branch
            </label>
            <select
              id="branchSelect"
              className={`px-2 py-1 border ${
                branchDisabled
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : selectedBranch
                  ? "bg-blue-50 border-blue-400"
                  : "border-blue-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs min-w-[180px]`}
              value={selectedBranch}
              onChange={handleBranchChange}
              disabled={
                branchDisabled ||
                isLoading ||
                isSubmitting ||
                !canAddData ||
                isLoadingAPI
              }
            >
              <option value="">Select Branch</option>
              {filteredBranchOptions.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right Arrow Icon */}
          <div className="text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Year Dropdown */}
          <div className="flex flex-col">
            <label
              htmlFor="yearSelect"
              className="text-xs font-medium text-blue-800 mb-1 required-field"
            >
              Passout Year
            </label>
            <select
              id="yearSelect"
              className={`px-2 py-1 border ${
                yearDisabled
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : selectedYear
                  ? "bg-blue-50 border-blue-400"
                  : "border-blue-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs min-w-[120px]`}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={
                yearDisabled ||
                isLoading ||
                isSubmitting ||
                !canAddData ||
                isLoadingAPI
              }
            >
              <option value="">Select Year</option>
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="ml-4">
            {filtersValid ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs border border-green-200">
                <span className="mr-1">✓</span> Filters Set
              </span>
            ) : (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs border border-amber-200">
                <span className="mr-1">⚠</span> Select All Filters
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
