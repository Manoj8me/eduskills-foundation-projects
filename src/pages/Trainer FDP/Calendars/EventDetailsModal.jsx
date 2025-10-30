import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

const EventDetailsModal = ({ isOpen, onClose, bookslotId, bookingInfo }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedPassoutYears, setSelectedPassoutYears] = useState([]);

  // Expandable rows state
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Filter dropdown states
  const [showDomainFilter, setShowDomainFilter] = useState(false);
  const [showCohortFilter, setShowCohortFilter] = useState(false);
  const [showBranchFilter, setShowBranchFilter] = useState(false);
  const [showYearFilter, setShowYearFilter] = useState(false);

  // Certificate issuance states
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [issuingCertificates, setIssuingCertificates] = useState(false);
  const [issuingParticipationCerts, setIssuingParticipationCerts] =
    useState(false);
  const [showParticipationConfirmModal, setShowParticipationConfirmModal] =
    useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check if user is admin
  const isAdmin = localStorage.getItem("Authorise") === "admin";

  // Create axios instance with default config
  const api = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetchEventDetails = async (bookslotId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `${BASE_URL}/event/full-details/${bookslotId}`
      );
      setEventDetails(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && bookslotId) {
      fetchEventDetails(bookslotId);
      setCurrentPage(1);
      setSearchTerm("");
      setSelectedDomains([]);
      setSelectedCohorts([]);
      setSelectedBranches([]);
      setSelectedPassoutYears([]);
      setExpandedRows(new Set());
      setSelectedStudents(new Set());
      setSelectAll(false);
    }
  }, [isOpen, bookslotId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Check if event has ended
  const hasEventEnded = () => {
    if (!eventDetails?.event?.end_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(eventDetails.event.end_date);
    endDate.setHours(0, 0, 0, 0);
    return endDate < today;
  };

  // Get unique filter options from students data
  const filterOptions = useMemo(() => {
    if (!eventDetails?.students)
      return { domains: [], cohorts: [], branches: [], passoutYears: [] };

    const domains = new Set();
    const cohorts = new Set();
    const branches = new Set();
    const passoutYears = new Set();

    eventDetails.students.forEach((student) => {
      if (student.domains) {
        student.domains
          .split(",")
          .forEach((domain) => domains.add(domain.trim()));
      }
      if (student.cohorts) {
        student.cohorts
          .split(",")
          .forEach((cohort) => cohorts.add(cohort.trim()));
      }
      if (student.branch) branches.add(student.branch);
      if (student.passoutYear) passoutYears.add(student.passoutYear);
    });

    return {
      domains: Array.from(domains).sort(),
      cohorts: Array.from(cohorts).sort(),
      branches: Array.from(branches).sort(),
      passoutYears: Array.from(passoutYears).sort(),
    };
  }, [eventDetails?.students]);

  // Filter and search students
  const filteredStudents = useMemo(() => {
    if (!eventDetails?.students) return [];

    return eventDetails.students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        student.name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.rollNo?.toLowerCase().includes(searchLower) ||
        student.branch?.toLowerCase().includes(searchLower) ||
        student.domains?.toLowerCase().includes(searchLower);

      const matchesDomains =
        selectedDomains.length === 0 ||
        student.domains
          ?.split(",")
          .some((domain) => selectedDomains.includes(domain.trim()));

      const matchesCohorts =
        selectedCohorts.length === 0 ||
        student.cohorts
          ?.split(",")
          .some((cohort) => selectedCohorts.includes(cohort.trim()));

      const matchesBranches =
        selectedBranches.length === 0 ||
        selectedBranches.includes(student.branch);

      const matchesPassoutYears =
        selectedPassoutYears.length === 0 ||
        selectedPassoutYears.includes(student.passoutYear?.toString());

      return (
        matchesSearch &&
        matchesDomains &&
        matchesCohorts &&
        matchesBranches &&
        matchesPassoutYears
      );
    });
  }, [
    eventDetails?.students,
    searchTerm,
    selectedDomains,
    selectedCohorts,
    selectedBranches,
    selectedPassoutYears,
  ]);

  // Get eligible students (only those who passed)
  const eligibleStudents = useMemo(() => {
    return filteredStudents.filter(
      (student) => student.status?.toLowerCase() === "passed"
    );
  }, [filteredStudents]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDomains([]);
    setSelectedCohorts([]);
    setSelectedBranches([]);
    setSelectedPassoutYears([]);
    setCurrentPage(1);
  };

  const toggleRowExpansion = (studentId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedRows(newExpanded);
  };

  const handleCheckboxChange = (value, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item) => item !== value));
    } else {
      setSelectedArray([...selectedArray, value]);
    }
    setCurrentPage(1);
  };

  // Handle student selection
  const handleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
    setSelectAll(false);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents(new Set());
      setSelectAll(false);
    } else {
      const eligibleIds = new Set(
        eligibleStudents.map((student) => student.student_id)
      );
      setSelectedStudents(eligibleIds);
      setSelectAll(true);
    }
  };

  // Show confirmation modal
  const handleIssueCertificatesClick = () => {
    if (selectedStudents.size === 0) {
      alert("Please select at least one student to issue certificates");
      return;
    }
    setShowConfirmModal(true);
  };

  // Issue certificates after confirmation
  const handleConfirmIssueCertificates = async () => {
    try {
      setIssuingCertificates(true);
      setShowConfirmModal(false);

      const payload = {
        bookslot_id: bookslotId,
        student_ids: Array.from(selectedStudents),
      };

      const response = await api.post(
        `${BASE_URL}/event/update-eligibility`,
        payload
      );

      alert(
        response?.data?.message ||
          `Certificates issued successfully for ${selectedStudents.size} student(s)`
      );

      // Refresh event details
      await fetchEventDetails(bookslotId);
      setSelectedStudents(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("Error issuing certificates:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to issue certificates";
      alert(errorMessage);
    } finally {
      setIssuingCertificates(false);
    }
  };

  const handleIssueParticipationCertificatesClick = () => {
    if (filteredStudents.length === 0) {
      alert("No students available to issue participation certificates");
      return;
    }
    setShowParticipationConfirmModal(true);
  };

  const handleConfirmIssueParticipationCertificates = async () => {
    try {
      setIssuingParticipationCerts(true);
      setShowParticipationConfirmModal(false);

      const response = await api.post(
        `${BASE_URL}/event/issue-certificate/${bookslotId}`
      );

      alert(
        response?.data?.message ||
          `Participation certificates issued successfully for all students`
      );

      // Refresh event details
      await fetchEventDetails(bookslotId);
    } catch (error) {
      console.error("Error issuing participation certificates:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to issue participation certificates";
      alert(errorMessage);
    } finally {
      setIssuingParticipationCerts(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      passed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };

    const displayStatus = status || "N/A";
    const colorClass =
      statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {displayStatus}
      </span>
    );
  };

  const MultiSelectDropdown = ({
    title,
    options,
    selectedValues,
    onSelectionChange,
    isOpen,
    setIsOpen,
  }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-left bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 flex justify-between items-center"
      >
        <span className="truncate">
          {selectedValues.length === 0
            ? `All ${title}`
            : `${title} (${selectedValues.length})`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded shadow-lg max-h-48 overflow-y-auto">
          <div className="p-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 py-1 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() =>
                    handleCheckboxChange(
                      option,
                      selectedValues,
                      onSelectionChange
                    )
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm truncate" title={option}>
                  {truncateText(option, 25)}
                </span>
              </label>
            ))}
          </div>
          {options.length === 0 && (
            <div className="p-3 text-sm text-slate-500 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );

  const handleClose = () => {
    setEventDetails(null);
    setError(null);
    resetFilters();
    setSelectedStudents(new Set());
    setSelectAll(false);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".multi-select-dropdown")) {
        setShowDomainFilter(false);
        setShowCohortFilter(false);
        setShowBranchFilter(false);
        setShowYearFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const eventEnded = hasEventEnded();
  const showCertificateFeature = isAdmin && eventEnded;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg w-[98vw] max-w-[1400px] max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Event Details{" "}
            {bookingInfo && `- ${truncateText(bookingInfo.institute_name, 40)}`}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-slate-600">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-800 text-sm font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          {eventDetails && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded p-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Event Information
                  {eventEnded && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Event Ended
                    </span>
                  )}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-white rounded p-3 shadow-sm">
                    <div className="text-xs text-slate-500">Event Type</div>
                    <div className="text-sm font-medium text-slate-900 capitalize">
                      {eventDetails.event.event_type?.replace("_", " ") ||
                        "N/A"}
                    </div>
                  </div>

                  <div className="bg-white rounded p-3 shadow-sm">
                    <div className="text-xs text-slate-500">Institute</div>
                    <div
                      className="text-sm font-medium text-slate-900"
                      title={eventDetails.event.institute_name}
                    >
                      {truncateText(eventDetails.event.institute_name, 25)}
                    </div>
                  </div>

                  <div className="bg-white rounded p-3 shadow-sm">
                    <div className="text-xs text-slate-500">Trainer</div>
                    <div
                      className="text-sm font-medium text-slate-900"
                      title={eventDetails.event.trainer_name}
                    >
                      {truncateText(eventDetails.event.trainer_name, 20)}
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      title={eventDetails.event.trainer_email}
                    >
                      {truncateText(eventDetails.event.trainer_email, 20)}
                    </div>
                  </div>

                  <div className="bg-white rounded p-3 shadow-sm">
                    <div className="text-xs text-slate-500">Duration</div>
                    <div className="text-sm font-medium text-slate-900">
                      {formatDate(eventDetails.event.start_date)}
                    </div>
                    <div className="text-xs text-slate-600">
                      to {formatDate(eventDetails.event.end_date)}
                    </div>
                  </div>

                  <div className="bg-white rounded p-3 shadow-sm">
                    <div className="text-xs text-slate-500">Total Students</div>
                    <div className="text-xl font-bold text-green-600">
                      {eventDetails.students_count || 0}
                    </div>
                  </div>
                </div>
              </div>

              {showCertificateFeature && eligibleStudents.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-semibold text-green-800">
                          Certificate Issuance
                        </div>
                        <div className="text-xs text-green-700">
                          {selectedStudents.size} of {eligibleStudents.length}{" "}
                          eligible students selected
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleIssueCertificatesClick}
                      disabled={
                        selectedStudents.size === 0 || issuingCertificates
                      }
                      className="bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-sm"
                    >
                      {issuingCertificates ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Issuing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Issue Certificates ({selectedStudents.size})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              {showCertificateFeature && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-semibold text-blue-800">
                          Participation Certificates
                        </div>
                        <div className="text-xs text-blue-700">
                          Issue participation certificates to all{" "}
                          {filteredStudents.length} students
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleIssueParticipationCertificatesClick}
                      disabled={
                        filteredStudents.length === 0 ||
                        issuingParticipationCerts
                      }
                      className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-sm"
                    >
                      {issuingParticipationCerts ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Issuing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Issue Participation Certificates
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.248M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Students ({filteredStudents.length})
                    {showCertificateFeature && (
                      <span className="text-xs text-green-600 ml-2">
                        • {eligibleStudents.length} eligible for certificates
                      </span>
                    )}
                  </h4>

                  <button
                    onClick={resetFilters}
                    className="px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 rounded transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>

                <div className="bg-white rounded p-3 mb-3 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="multi-select-dropdown">
                      <MultiSelectDropdown
                        title="Branches"
                        options={filterOptions.branches}
                        selectedValues={selectedBranches}
                        onSelectionChange={setSelectedBranches}
                        isOpen={showBranchFilter}
                        setIsOpen={setShowBranchFilter}
                      />
                    </div>

                    <div className="multi-select-dropdown">
                      <MultiSelectDropdown
                        title="Years"
                        options={filterOptions.passoutYears.map(String)}
                        selectedValues={selectedPassoutYears}
                        onSelectionChange={setSelectedPassoutYears}
                        isOpen={showYearFilter}
                        setIsOpen={setShowYearFilter}
                      />
                    </div>

                    <div className="multi-select-dropdown">
                      <MultiSelectDropdown
                        title="Cohorts"
                        options={filterOptions.cohorts}
                        selectedValues={selectedCohorts}
                        onSelectionChange={setSelectedCohorts}
                        isOpen={showCohortFilter}
                        setIsOpen={setShowCohortFilter}
                      />
                    </div>

                    <div className="multi-select-dropdown">
                      <MultiSelectDropdown
                        title="Domains"
                        options={filterOptions.domains}
                        selectedValues={selectedDomains}
                        onSelectionChange={setSelectedDomains}
                        isOpen={showDomainFilter}
                        setIsOpen={setShowDomainFilter}
                      />
                    </div>
                  </div>
                </div>

                {filteredStudents.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-100">
                            <tr>
                              {showCertificateFeature && (
                                <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                  <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="text-blue-600 focus:ring-blue-500"
                                    title="Select all eligible students"
                                  />
                                </th>
                              )}
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Roll No
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Branch
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Year
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Cohorts
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Domains
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-slate-600 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {currentStudents.map((student, index) => {
                              const isExpanded = expandedRows.has(
                                student.student_id
                              );
                              const domains = student.domains
                                ? student.domains
                                    .split(",")
                                    .map((d) => d.trim())
                                : [];
                              const isPassed =
                                student.status?.toLowerCase() === "passed";
                              const isEligibleForCertificate =
                                isPassed && showCertificateFeature;

                              return (
                                <React.Fragment
                                  key={student.student_id || index}
                                >
                                  <tr className="hover:bg-slate-50">
                                    {showCertificateFeature && (
                                      <td className="px-2 py-1.5">
                                        {isEligibleForCertificate ? (
                                          <input
                                            type="checkbox"
                                            checked={selectedStudents.has(
                                              student.student_id
                                            )}
                                            onChange={() =>
                                              handleStudentSelection(
                                                student.student_id
                                              )
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                          />
                                        ) : (
                                          <span
                                            className="text-slate-300"
                                            title="Not eligible"
                                          >
                                            <svg
                                              className="w-4 h-4"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </td>
                                    )}
                                    <td className="px-2 py-1.5 font-medium text-slate-900">
                                      {(currentPage - 1) * itemsPerPage +
                                        index +
                                        1}
                                    </td>
                                    <td className="px-2 py-1.5">
                                      <div
                                        className="font-medium text-slate-900"
                                        title={student.name}
                                      >
                                        {truncateText(student.name, 18)}
                                      </div>
                                    </td>
                                    <td className="px-2 py-1.5">
                                      <div
                                        className="text-slate-600"
                                        title={student.email}
                                      >
                                        {truncateText(student.email, 20)}
                                      </div>
                                    </td>
                                    <td className="px-2 py-1.5 text-slate-900">
                                      {truncateText(student.rollNo, 12)}
                                    </td>
                                    <td className="px-2 py-1.5">
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {truncateText(student.branch, 8) ||
                                          "N/A"}
                                      </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-slate-900">
                                      {student.passoutYear || "N/A"}
                                    </td>
                                    <td className="px-2 py-1.5">
                                      <div>
                                        {student.cohorts
                                          ? student.cohorts
                                              .split(",")
                                              .map((cohort, idx) => (
                                                <span
                                                  key={idx}
                                                  className="inline-block bg-purple-100 text-purple-800 rounded px-1 py-0.5 mr-1 mb-1 text-xs"
                                                >
                                                  {cohort.trim()}
                                                </span>
                                              ))
                                          : "N/A"}
                                      </div>
                                    </td>
                                    <td className="px-2 py-1.5">
                                      <div className="max-w-xs">
                                        {domains.length > 0 ? (
                                          <div className="flex items-center gap-1">
                                            <div className="inline-block bg-green-100 text-green-800 rounded px-1 py-0.5 text-xs">
                                              {truncateText(domains[0], 15)}
                                            </div>
                                            {domains.length > 1 && (
                                              <button
                                                onClick={() =>
                                                  toggleRowExpansion(
                                                    student.student_id
                                                  )
                                                }
                                                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 rounded px-1 py-0.5 text-xs cursor-pointer transition-colors"
                                              >
                                                +{domains.length - 1}{" "}
                                                {isExpanded ? "▼" : "▶"}
                                              </button>
                                            )}
                                          </div>
                                        ) : (
                                          "N/A"
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-2 py-1.5">
                                      {getStatusBadge(student.status)}
                                    </td>
                                  </tr>

                                  {isExpanded && domains.length > 1 && (
                                    <tr className="bg-slate-25">
                                      <td
                                        colSpan={
                                          showCertificateFeature ? "10" : "9"
                                        }
                                        className="px-2 py-2"
                                      >
                                        <div className="ml-4 p-2 bg-green-50 rounded border-l-2 border-green-200">
                                          <div className="text-xs font-medium text-green-800 mb-1">
                                            All Domains:
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {domains.map((domain, idx) => (
                                              <span
                                                key={idx}
                                                className="inline-block bg-green-100 text-green-800 rounded px-2 py-1 text-xs"
                                              >
                                                {domain}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-700">
                          {(currentPage - 1) * itemsPerPage + 1}-
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredStudents.length
                          )}{" "}
                          of {filteredStudents.length}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Prev
                          </button>
                          {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`px-2 py-1 text-xs font-medium rounded ${
                                    currentPage === pageNum
                                      ? "bg-blue-600 text-white"
                                      : "text-slate-500 bg-white border border-slate-300 hover:bg-slate-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-2 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded p-6 text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.248M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">
                      {eventDetails.students?.length === 0
                        ? "No students enrolled"
                        : "No matches"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {eventDetails.students?.length === 0
                        ? "No students enrolled yet."
                        : "Try adjusting filters."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-1.5 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {showParticipationConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-center text-slate-900 mb-2">
                Confirm Participation Certificate Issuance
              </h3>

              <p className="text-sm text-center text-slate-600 mb-6">
                Are you sure you want to issue participation certificate to the
                institute
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowParticipationConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmIssueParticipationCertificates}
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Confirm & Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-center text-slate-900 mb-2">
                Confirm Certificate Issuance
              </h3>

              <p className="text-sm text-center text-slate-600 mb-6">
                Are you sure you want to issue certificates to{" "}
                <span className="font-semibold text-slate-900">
                  {selectedStudents.size}
                </span>{" "}
                selected student{selectedStudents.size !== 1 ? "s" : ""}? This
                action will mark them as issued for certificates.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmIssueCertificates}
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  Confirm & Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsModal;
