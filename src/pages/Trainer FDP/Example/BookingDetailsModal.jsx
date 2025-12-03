import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Award,
  ChevronDown,
} from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";

const BookingDetailsModal = ({ isOpen, onClose, bookslotId }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedPassoutYears, setSelectedPassoutYears] = useState([]);

  // Available filter options
  const [branches, setBranches] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [domains, setDomains] = useState([]);
  const [passoutYears, setPassoutYears] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Checkbox selection states
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [issuingCertificates, setIssuingCertificates] = useState(false);
  const [issuingParticipationCert, setIssuingParticipationCert] =
    useState(false);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs for dropdown management
  const branchDropdownRef = useRef(null);
  const cohortDropdownRef = useRef(null);
  const domainDropdownRef = useRef(null);
  const passoutDropdownRef = useRef(null);

  useEffect(() => {
    // Check if user is admin
    const authorise = localStorage.getItem("Authorise");
    setIsAdmin(authorise === "admin");
  }, []);

  useEffect(() => {
    if (isOpen && bookslotId) {
      fetchBookingDetails();
      setSelectedStudents([]);
    }
  }, [isOpen, bookslotId]);

  useEffect(() => {
    if (bookingData?.students) {
      extractFilterOptions(bookingData.students);
    }
  }, [bookingData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = [
        branchDropdownRef.current,
        cohortDropdownRef.current,
        domainDropdownRef.current,
        passoutDropdownRef.current,
      ];

      const clickedOutside = dropdownRefs.every(
        (ref) => ref && !ref.contains(event.target)
      );

      if (clickedOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const extractFilterOptions = (students) => {
    // Extract unique branches
    const uniqueBranches = [
      ...new Set(students.map((s) => s.branch).filter(Boolean)),
    ];
    setBranches(uniqueBranches.sort());

    // Extract unique cohorts
    const cohortSet = new Set();
    students.forEach((s) => {
      if (s.cohorts) {
        s.cohorts.split(",").forEach((c) => cohortSet.add(c.trim()));
      }
    });
    setCohorts([...cohortSet].sort());

    // Extract unique domains
    const domainSet = new Set();
    students.forEach((s) => {
      if (s.domains) {
        s.domains.split(",").forEach((d) => domainSet.add(d.trim()));
      }
    });
    setDomains([...domainSet].sort());

    // Extract unique passout years
    const uniqueYears = [
      ...new Set(students.map((s) => s.passoutYear).filter(Boolean)),
    ];
    setPassoutYears(uniqueYears.sort());
  };

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/event/full-details/${bookslotId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch booking details");
      }

      const data = await response.json();
      setBookingData(data);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificates = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    setIssuingCertificates(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/event/update-eligibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookslot_id: bookslotId,
          student_ids: selectedStudents,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to issue certificates");
      }

      const result = await response.json();

      alert(
        result?.message ||
        `Successfully issued certificates to ${selectedStudents.length} student(s)`
      );
      setSelectedStudents([]);
      fetchBookingDetails(); // Refresh data
    } catch (err) {
      console.error("Error issuing certificates:", err);
      alert("Error issuing certificates: " + err.message);
    } finally {
      setIssuingCertificates(false);
    }
  };

  const handleIssueParticipationCertificate = async () => {
    setIssuingParticipationCert(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/event/issue-certificate/${bookslotId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to issue participation certificates");
      }

      const result = await response.json();
      console.log(result);
      alert(
        result?.message ||
        "Successfully issued participation certificates to all students"
      );
      fetchBookingDetails(); // Refresh data
    } catch (err) {
      console.error("Error issuing participation certificates:", err);
      alert("Error issuing participation certificates: " + err.message);
    } finally {
      setIssuingParticipationCert(false);
    }
  };

  const handleStudentCheckbox = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAllOnPage = () => {
    const currentStudentIds = currentStudents.map((s) => s.student_id);
    const allSelected = currentStudentIds.every((id) =>
      selectedStudents.includes(id)
    );

    if (allSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !currentStudentIds.includes(id))
      );
    } else {
      setSelectedStudents((prev) => [
        ...new Set([...prev, ...currentStudentIds]),
      ]);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${monthNames[date.getMonth()]
      } ${date.getFullYear()}`;
  };

  const formatEventType = (type) => {
    return type ? type.replace(/_/g, " ").toUpperCase() : "N/A";
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Passed: "bg-green-100 text-green-800 border-green-200",
      Failed: "bg-red-100 text-red-800 border-red-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Issued: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getEligibilityDisplay = (isEligible) => {
    if (isEligible === null || isEligible === undefined) {
      return null;
    }

    switch (isEligible) {
      case 0:
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">
            Not Issued
          </span>
        );

      case 1:
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
            Issued
          </span>
        );

      case 2:
        return (
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 font-medium">
            Received
          </span>
        );

      default:
        return null;
    }
  }

  // Function to get day attendance status
  const getDayAttendance = (student, day) => {
    const firstHalf = student[`day${day}_firsthalf`];
    const secondHalf = student[`day${day}_secondhalf`];

    // Both present
    if (firstHalf === 1 && secondHalf === 1) {
      return { status: "Present", color: "bg-green-100 text-green-700" };
    }
    // Both absent
    if (firstHalf === 0 && secondHalf === 0) {
      return { status: "Absent", color: "bg-red-100 text-red-700" };
    }
    // Partial attendance
    if (firstHalf === 1 || secondHalf === 1) {
      return { status: "Partial", color: "bg-yellow-100 text-yellow-700" };
    }
    // No data
    return { status: "N/A", color: "bg-gray-100 text-gray-600" };
  };

  const handleMultiSelectChange = (value, selectedArray, setFunction) => {
    if (selectedArray.includes(value)) {
      setFunction(selectedArray.filter((item) => item !== value));
    } else {
      setFunction([...selectedArray, value]);
    }
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedBranches([]);
    setSelectedCohorts([]);
    setSelectedDomains([]);
    setSelectedPassoutYears([]);
    setCurrentPage(1);
  };

  const filteredStudents =
    bookingData?.students?.filter((student) => {
      const matchesSearch =
        searchTerm === "" ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBranch =
        selectedBranches.length === 0 ||
        selectedBranches.includes(student.branch);

      const matchesCohort =
        selectedCohorts.length === 0 ||
        student.cohorts
          ?.split(",")
          .map((c) => c.trim())
          .some((c) => selectedCohorts.includes(c));

      const matchesDomain =
        selectedDomains.length === 0 ||
        student.domains
          ?.split(",")
          .map((d) => d.trim())
          .some((d) => selectedDomains.includes(d));

      const matchesPassoutYear =
        selectedPassoutYears.length === 0 ||
        selectedPassoutYears.includes(student.passoutYear);

      return (
        matchesSearch &&
        matchesBranch &&
        matchesCohort &&
        matchesDomain &&
        matchesPassoutYear
      );
    }) || [];

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedBranches,
    selectedCohorts,
    selectedDomains,
    selectedPassoutYears,
  ]);

  if (!isOpen) return null;

  const currentPageAllSelected =
    currentStudents.length > 0 &&
    currentStudents.every((s) => selectedStudents.includes(s.student_id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              <p className="font-semibold">Error loading booking details</p>
              <p className="text-xs">{error}</p>
            </div>
          )}

          {!loading && !error && bookingData && (
            <div className="space-y-4">
              {/* Event Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Event Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-gray-600">Event Type</p>
                    <p className="font-semibold text-gray-800">
                      {formatEventType(bookingData.event.event_type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Institute</p>
                    <p className="font-semibold text-gray-800">
                      {bookingData.event.institute_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(bookingData.event.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">End Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(bookingData.event.end_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Trainer Name</p>
                    <p className="font-semibold text-gray-800">
                      {bookingData.event.trainer_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Trainer Email</p>
                    <p className="font-semibold text-gray-800">
                      {bookingData.event.trainer_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Students</p>
                    <p className="font-semibold text-blue-600 text-base">
                      {bookingData.students_count}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Buttons Section */}
              {isAdmin && (
                <div className="space-y-3">
                  {/* Issue Participation Certificate Button */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Issue participation certificates to all students
                      </span>
                    </div>
                    <button
                      onClick={handleIssueParticipationCertificate}
                      disabled={issuingParticipationCert || !bookingData?.event?.can_issue}
                      className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2
    ${issuingParticipationCert || !bookingData?.event?.can_issue
                          ? "bg-blue-400 cursor-not-allowed opacity-60"
                          : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {issuingParticipationCert ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Issuing...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>Issue Participation Certificate</span>
                        </>
                      )}
                    </button>

                  </div>

                  {/* Selected Students Certificate Issue Button */}
                  {selectedStudents.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {selectedStudents.length} student(s) selected
                        </span>
                      </div>
                      <button
                        onClick={handleIssueCertificates}
                        disabled={issuingCertificates}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {issuingCertificates ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Issuing...</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4" />
                            <span>Issue Certificates</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Filters Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                  {/* Search */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Name, email, roll no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                      />
                    </div>
                  </div>

                  {/* Branch Filter */}
                  <div className="relative" ref={branchDropdownRef}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Branch ({selectedBranches.length})
                    </label>
                    <button
                      onClick={() => toggleDropdown("branch")}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs bg-white hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="text-gray-700 truncate">
                        {selectedBranches.length > 0
                          ? `${selectedBranches.length} selected`
                          : "Select branches"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                    </button>
                    {openDropdown === "branch" && (
                      <div className="absolute z-[100] mt-1 w-full border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white shadow-lg">
                        {branches.length > 0 ? (
                          branches.map((branch) => (
                            <label
                              key={branch}
                              className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer text-xs"
                            >
                              <input
                                type="checkbox"
                                checked={selectedBranches.includes(branch)}
                                onChange={() =>
                                  handleMultiSelectChange(
                                    branch,
                                    selectedBranches,
                                    setSelectedBranches
                                  )
                                }
                                className="w-3 h-3 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                              />
                              <span className="text-gray-700">{branch}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400">No branches</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cohort Filter */}
                  <div className="relative" ref={cohortDropdownRef}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Cohort ({selectedCohorts.length})
                    </label>
                    <button
                      onClick={() => toggleDropdown("cohort")}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs bg-white hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="text-gray-700 truncate">
                        {selectedCohorts.length > 0
                          ? `${selectedCohorts.length} selected`
                          : "Select cohorts"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                    </button>
                    {openDropdown === "cohort" && (
                      <div className="absolute z-[100] mt-1 w-full border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white shadow-lg">
                        {cohorts.length > 0 ? (
                          cohorts.map((cohort) => (
                            <label
                              key={cohort}
                              className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer text-xs"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCohorts.includes(cohort)}
                                onChange={() =>
                                  handleMultiSelectChange(
                                    cohort,
                                    selectedCohorts,
                                    setSelectedCohorts
                                  )
                                }
                                className="w-3 h-3 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                              />
                              <span className="text-gray-700">{cohort}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400">No cohorts</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Domain Filter */}
                  <div className="relative" ref={domainDropdownRef}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Domain ({selectedDomains.length})
                    </label>
                    <button
                      onClick={() => toggleDropdown("domain")}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs bg-white hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="text-gray-700 truncate">
                        {selectedDomains.length > 0
                          ? `${selectedDomains.length} selected`
                          : "Select domains"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                    </button>
                    {openDropdown === "domain" && (
                      <div className="absolute z-[100] mt-1 w-full border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white shadow-lg">
                        {domains.length > 0 ? (
                          domains.map((domain) => (
                            <label
                              key={domain}
                              className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer text-xs"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDomains.includes(domain)}
                                onChange={() =>
                                  handleMultiSelectChange(
                                    domain,
                                    selectedDomains,
                                    setSelectedDomains
                                  )
                                }
                                className="w-3 h-3 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                              />
                              <span
                                className="text-gray-700 truncate"
                                title={domain}
                              >
                                {domain}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400">No domains</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Passout Year Filter */}
                  <div className="relative" ref={passoutDropdownRef}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Passout Year ({selectedPassoutYears.length})
                    </label>
                    <button
                      onClick={() => toggleDropdown("passout")}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs bg-white hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="text-gray-700 truncate">
                        {selectedPassoutYears.length > 0
                          ? `${selectedPassoutYears.length} selected`
                          : "Select years"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                    </button>
                    {openDropdown === "passout" && (
                      <div className="absolute z-[100] mt-1 w-full border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white shadow-lg">
                        {passoutYears.length > 0 ? (
                          passoutYears.map((year) => (
                            <label
                              key={year}
                              className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer text-xs"
                            >
                              <input
                                type="checkbox"
                                checked={selectedPassoutYears.includes(year)}
                                onChange={() =>
                                  handleMultiSelectChange(
                                    year,
                                    selectedPassoutYears,
                                    setSelectedPassoutYears
                                  )
                                }
                                className="w-3 h-3 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                              />
                              <span className="text-gray-700">{year}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400">No years</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <p className="text-xs text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-gray-800">
                      {filteredStudents.length > 0 ? startIndex + 1 : 0}-
                      {Math.min(endIndex, filteredStudents.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-800">
                      {filteredStudents.length}
                    </span>{" "}
                    students
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredStudents.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {isAdmin && (
                              <th className="px-3 py-2 text-left">
                                <input
                                  type="checkbox"
                                  checked={currentPageAllSelected}
                                  onChange={handleSelectAllOnPage}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                              </th>
                            )}
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Branch
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Roll No
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Year
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Cohorts
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Domains
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Day 1
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Day 2
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Day 3
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Ceriticate Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentStudents.map((student, index) => {
                            const day1 = getDayAttendance(student, 1);
                            const day2 = getDayAttendance(student, 2);
                            const day3 = getDayAttendance(student, 3);

                            return (
                              <tr
                                key={student.student_id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                {isAdmin && (
                                  <td className="px-3 py-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedStudents.includes(
                                        student.student_id
                                      )}
                                      onChange={() =>
                                        handleStudentCheckbox(
                                          student.student_id
                                        )
                                      }
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                  </td>
                                )}
                                <td className="px-3 py-2 text-xs text-gray-800">
                                  <div
                                    className="max-w-[150px] truncate"
                                    title={student.name}
                                  >
                                    {student.name}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-600">
                                  <div
                                    className="max-w-[140px] truncate"
                                    title={student.email}
                                  >
                                    {student.email}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-800 font-medium">
                                  {student.branch}
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-600">
                                  {student.rollNo}
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-600">
                                  {student.passoutYear}
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  <div className="flex flex-wrap gap-1">
                                    {student.cohorts
                                      ?.split(",")
                                      .map((cohort, idx) => (
                                        <span
                                          key={idx}
                                          className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] rounded border border-purple-200"
                                        >
                                          {cohort.trim()}
                                        </span>
                                      ))}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  <div className="max-w-[200px]">
                                    <div className="flex flex-wrap gap-1">
                                      {student.domains
                                        ?.split(",")
                                        .slice(0, 2)
                                        .map((domain, idx) => (
                                          <span
                                            key={idx}
                                            className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded border border-blue-200"
                                            title={domain.trim()}
                                          >
                                            {domain.trim().length > 25
                                              ? domain.trim().substring(0, 25) +
                                              "..."
                                              : domain.trim()}
                                          </span>
                                        ))}
                                      {student.domains?.split(",").length >
                                        2 && (
                                          <span
                                            className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded"
                                            title={student.domains}
                                          >
                                            +
                                            {student.domains.split(",").length -
                                              2}
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  <span
                                    className={`px-2 py-1 rounded text-[10px] font-medium ${day1.color}`}
                                  >
                                    {day1.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  <span
                                    className={`px-2 py-1 rounded text-[10px] font-medium ${day2.color}`}
                                  >
                                    {day2.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  <span
                                    className={`px-2 py-1 rounded text-[10px] font-medium ${day3.color}`}
                                  >
                                    {day3.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                                      student.status
                                    )}`}
                                  >
                                    {student.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs text-center">
                                  {getEligibilityDisplay(student.is_eligible)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-600">
                          Rows per page:
                        </label>
                        <select
                          value={itemsPerPage}
                          onChange={(e) =>
                            handleItemsPerPageChange(Number(e.target.value))
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      No students found matching your filters
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
