import React, { useState, useEffect, useRef } from "react";
import {
    X,
    Search,
    ChevronLeft,
    ChevronRight,
    Award,
    ChevronDown,
    MoreVertical,
} from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";
import { toast } from "react-toastify";



const FdpEdpBookingDetailsModal = ({ isOpen, onClose, bookslotId, fetchBookedDetails, }) => {
    const [hostedLimit, setHostedLimit] = useState(null);

    const [faculties, setFaculties] = useState([]);

    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // 🔍 Search term
    const [searchTerm, setSearchTerm] = useState("");

    // 🧩 Filters
    const [selectedDesignations, setSelectedDesignations] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedInstitutes, setSelectedInstitutes] = useState([]);

    // 🧩 Available filter options
    const [designations, setDesignations] = useState([]);
    const [branches, setBranches] = useState([]);
    const [institutes, setInstitutes] = useState([]);


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
    // tabs for fdp/edp    
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

    // Separate selected faculty states per tab
    const [selectedApprovedFaculties, setSelectedApprovedFaculties] = useState([]);


    // 🧭 Refs for outside click detection
    const designationDropdownRef = useRef(null);
    const branchDropdownRef = useRef(null);
    const instituteDropdownRef = useRef(null);

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

    // 🧠 Run when data changes
    useEffect(() => {
        if (bookingData?.faculties) {
            extractFilterOptions(bookingData.faculties);
        }
    }, [bookingData]);

    useEffect(() => {
        if (bookingData?.faculty?.length) {
            const designationsSet = new Set();
            const branchesSet = new Set();
            const institutesSet = new Set();

            bookingData.faculty.forEach((faculty) => {
                if (faculty.designation) designationsSet.add(faculty.designation);
                if (faculty.branch) branchesSet.add(faculty.branch);
                if (faculty.institute_name) institutesSet.add(faculty.institute_name);
            });

            setDesignations([...designationsSet]);
            setBranches([...branchesSet]);
            setInstitutes([...institutesSet]);
        }
    }, [bookingData]);



    useEffect(() => {
        console.log("Fetched bookingData:", bookingData);
    }, [bookingData]);


    // 🚪 Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownRefs = [
                designationDropdownRef.current,
                branchDropdownRef.current,
                instituteDropdownRef.current,
            ];
            const clickedOutside = dropdownRefs.every(
                (ref) => ref && !ref.contains(event.target)
            );
            if (clickedOutside) setOpenDropdown(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const eventType = bookingData?.event?.event_type?.toLowerCase() || "";

    useEffect(() => {
        if (isOpen && eventType && fetchBookedDetails) {
            const loadHostedLimit = async () => {
                const allDetails = await fetchBookedDetails(eventType);

                // find the matching booking
                const booking = allDetails.find(
                    (b) => b.bookslot_id === bookslotId
                );

                if (booking) {
                    setHostedLimit(booking.hosted_faculty_limit);
                }
            };

            loadHostedLimit();
        }
    }, [isOpen, eventType, bookslotId, fetchBookedDetails]);


    // 🧩 Extract unique filter options dynamically
    const extractFilterOptions = (faculties) => {
        // Extract unique designations
        const uniqueDesignations = [
            ...new Set(faculties.map((f) => f.designation).filter(Boolean)),
        ];
        setDesignations(uniqueDesignations.sort());

        // Extract unique branches
        const uniqueBranches = [
            ...new Set(faculties.map((f) => f.branch).filter(Boolean)),
        ];
        setBranches(uniqueBranches.sort());

        // Extract unique institute names
        const uniqueInstitutes = [
            ...new Set(faculties.map((f) => f.institute_name).filter(Boolean)),
        ];
        setInstitutes(uniqueInstitutes.sort());
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
            setFaculties(data.faculty || []); // ✅ handles both naming styles
        } catch (err) {
            console.error("Error fetching booking details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
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
            alert("Successfully issued participation certificates to all students");
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
                        Not Eligible
                    </span>
                );
            case 1:
                return (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">
                        Eligible
                    </span>
                );
            case 2:
                return (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 font-medium">
                        Certificate Issued
                    </span>
                );
            default:
                return null;
        }
    };

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

    // ✅ Handle checkbox selection for multi-select filters
    const handleMultiSelectChange = (value, selectedArray, setFunction) => {
        if (selectedArray.includes(value)) {
            setFunction(selectedArray.filter((item) => item !== value));
        } else {
            setFunction([...selectedArray, value]);
        }
        setCurrentPage(1);
    };

    // 🧹 Reset all filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedDesignations([]);
        setSelectedBranches([]);
        setSelectedInstitutes([]);
        setCurrentPage(1);
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    // 🔁 Reset page when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDesignations, selectedBranches, selectedInstitutes, setCurrentPage]);

    if (!isOpen) return null;


    const handleMenuToggle = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleOpenAttendanceModal = (faculty) => {
        setSelectedFaculty(faculty);
        setIsAttendanceModalOpen(true);
    };

    const handleCloseAttendanceModal = () => {
        setSelectedFaculty(null);
        setIsAttendanceModalOpen(false);
    };

    // --- For Selected Tab ---
    const handleIssueFacultyCertificates = async () => {
        if (selectedApprovedFaculties.length === 0) {
            alert("Please select at least one faculty member");
            return;
        }

        setIssuingCertificates(true);
        try {
            const token = localStorage.getItem("accessToken");

            // 🟢 ACTUAL API CALL
            const response = await fetch(`${BASE_URL}/event/update-eligibility`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookslot_id: bookslotId, // ✅ use this instead of bookingData?.bookslot_id
                    student_ids: selectedApprovedFaculties, // ✅ backend expects this key name
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${errorText || response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ Faculty certificate API response:", data);

            alert(
                `Successfully issued certificates to ${selectedApprovedFaculties.length} faculty member(s)`
            );

            // Refresh table data
            await fetchBookingDetails();
            setSelectedApprovedFaculties([]);
        } catch (error) {
            console.error("❌ Error issuing certificates:", error);
            alert("Error issuing certificates: " + error.message);
        } finally {
            setIssuingCertificates(false);
        }
    };



    const getFilteredFaculties = (faculties) => {
        if (!faculties) return [];

        return faculties.filter((faculty) => {
            const matchesSearch =
                searchTerm === "" ||
                faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faculty.email?.toLowerCase().includes(searchTerm.toLowerCase()) || faculty.phone_no?.includes(searchTerm);


            const matchesDesignation =
                selectedDesignations.length === 0 ||
                selectedDesignations.includes(faculty.designation);

            const matchesBranch =
                selectedBranches.length === 0 ||
                selectedBranches.includes(faculty.branch);

            const matchesInstitute =
                selectedInstitutes.length === 0 ||
                selectedInstitutes.includes(faculty.institute_name);

            return (
                matchesSearch &&
                matchesDesignation &&
                matchesBranch &&
                matchesInstitute
            );
        });
    };


    const filteredFaculties = getFilteredFaculties(faculties);

    const totalPages = Math.ceil(filteredFaculties.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentFaculties = filteredFaculties.slice(startIndex, endIndex);

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
                                    {/* Institute — hide if event type is 'edp' */}
                                    {bookingData.event.event_type !== "edp" && (
                                        <div>
                                            <p className="text-gray-600">Institute</p>
                                            <p className="font-semibold text-gray-800">
                                                {bookingData.event.institute_name}
                                            </p>
                                        </div>
                                    )}
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
                                        <p className="text-gray-600">Total Faculty added</p>
                                        <p className="font-semibold text-blue-600 text-base">
                                            {bookingData.event.total_faculty_added}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Total Faculty Limit</p>
                                        <p className="font-semibold text-blue-600 text-base">
                                            {bookingData.event.total_faculty_limit}
                                        </p>
                                    </div>
                                    {bookingData.event.event_type === "fdp" && (
                                        <div>
                                            <p className="text-gray-600">Hosted Institute Faculty Limit</p>
                                            <p className="font-semibold text-blue-600 text-base">
                                                {hostedLimit !== null ? hostedLimit : "—"}
                                            </p>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Admin Buttons Section */}
                            {isAdmin && (
                                <div className="space-y-3">

                                    {/* ✅ Issue Participation Certificate Button — hidden if eventType is 'EDP' */}
                                    {bookingData.event.event_type !== "edp" && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                            <div className="flex items-center space-x-2">
                                                <Award className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    Issue participation certificate to institute and coordinator
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleIssueParticipationCertificate}
                                                disabled={
                                                    issuingParticipationCert || !bookingData?.event?.can_issue
                                                }
                                                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${issuingParticipationCert || !bookingData?.event?.can_issue
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
                                    )}

                                    {/* ✅ Show Issue Faculty Certificate button only for Admin and when selection exists */}
                                    {isAdmin && selectedApprovedFaculties.length > 0 && (
                                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                            <div className="flex items-center space-x-2">
                                                <Award className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">
                                                    {selectedApprovedFaculties.length} faculty member(s) selected
                                                </span>
                                            </div>

                                            <button
                                                onClick={handleIssueFacultyCertificates}
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                    {/* 🔍 Search Filter */}
                                    <div className="sm:col-span-2 lg:col-span-1">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Search
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* 🧑‍🏫 Designation Filter */}
                                    <div className="relative" ref={designationDropdownRef}>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Designation ({selectedDesignations.length})
                                        </label>
                                        <button
                                            onClick={() => toggleDropdown("designation")}
                                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs bg-white hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            <span className="text-gray-700 truncate">
                                                {selectedDesignations.length > 0
                                                    ? `${selectedDesignations.length} selected`
                                                    : "Select designations"}
                                            </span>
                                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                                        </button>
                                        {openDropdown === "designation" && (
                                            <div className="absolute z-[100] mt-1 w-full border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white shadow-lg">
                                                {designations.length > 0 ? (
                                                    designations.map((designation) => (
                                                        <label
                                                            key={designation}
                                                            className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer text-xs"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedDesignations.includes(designation)}
                                                                onChange={() =>
                                                                    handleMultiSelectChange(
                                                                        designation,
                                                                        selectedDesignations,
                                                                        setSelectedDesignations
                                                                    )
                                                                }
                                                                className="w-3 h-3 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                                                            />
                                                            <span className="text-gray-700">{designation}</span>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400">No designations</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 🌿 Branch Filter */}
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

                                    {/* 🏫 Institute Filter */}
                                    <div className="relative" ref={instituteDropdownRef}>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Institute ({selectedInstitutes.length})
                                        </label>
                                        <button
                                            onClick={() => toggleDropdown("institute")}
                                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs bg-white hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            <span className="text-gray-700 truncate">
                                                {selectedInstitutes.length > 0
                                                    ? `${selectedInstitutes.length} selected`
                                                    : "Select institutes"}
                                            </span>
                                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                                        </button>
                                        {openDropdown === "institute" && (
                                            <div className="absolute z-[100] mt-1 w-full border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white shadow-lg">
                                                {institutes.length > 0 ? (
                                                    institutes.map((institute) => (
                                                        <label
                                                            key={institute}
                                                            className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer text-xs"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedInstitutes.includes(institute)}
                                                                onChange={() =>
                                                                    handleMultiSelectChange(
                                                                        institute,
                                                                        selectedInstitutes,
                                                                        setSelectedInstitutes
                                                                    )
                                                                }
                                                                className="w-3 h-3 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                                                            />
                                                            <span className="text-gray-700">{institute}</span>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400">No institutes</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <p className="text-xs text-gray-600">
                                    Showing{" "}
                                    <span className="font-semibold text-gray-800">
                                        {filteredFaculties.length > 0 ? startIndex + 1 : 0}-
                                        {Math.min(endIndex, filteredFaculties.length)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-800">
                                        {filteredFaculties.length}
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

                            {/* Faculty Table */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {filteredFaculties.length > 0 ? (
                                    <>
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {/* ✅ Show header checkbox only for Admin */}

                                                            {/* ✅ Header checkbox (only affects Passed faculties) */}
                                                            {isAdmin && (
                                                                <th className="px-3 py-2 text-left">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            currentFaculties.length > 0 &&
                                                                            currentFaculties
                                                                                .filter((f) => f.faculty_status === "Passed")
                                                                                .every((f) =>
                                                                                    selectedApprovedFaculties.includes(f.faculty_id)
                                                                                )
                                                                        }
                                                                        onChange={() => {
                                                                            const passedFaculties = currentFaculties.filter(
                                                                                (f) => f.faculty_status === "Passed"
                                                                            );
                                                                            const passedIds = passedFaculties.map((f) => f.faculty_id);

                                                                            const allPassedSelected = passedIds.every((id) =>
                                                                                selectedApprovedFaculties.includes(id)
                                                                            );

                                                                            if (allPassedSelected) {
                                                                                // ✅ Unselect all passed faculties
                                                                                setSelectedApprovedFaculties((prev) =>
                                                                                    prev.filter((id) => !passedIds.includes(id))
                                                                                );
                                                                            } else {
                                                                                // ✅ Select only passed faculties
                                                                                setSelectedApprovedFaculties((prev) => [
                                                                                    ...new Set([...prev, ...passedIds]),
                                                                                ]);
                                                                            }
                                                                        }}
                                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                </th>
                                                            )}

                                                            {/* Regular headers */}
                                                            {["Name", "Phone Number", "Email", "Designation", "Branch", "Institute", "Status", "Certificate Status", "Attendance"].map(
                                                                (header) => (
                                                                    <th
                                                                        key={header}
                                                                        className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                                    >
                                                                        {header}
                                                                    </th>
                                                                )
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {currentFaculties.map((faculty, index) => {
                                                            const isPassed = faculty.faculty_status === "Passed"; // ✅ now valid here

                                                            return (
                                                                <tr
                                                                    key={faculty.faculty_id || index}
                                                                    className="hover:bg-gray-50 transition-colors"
                                                                >
                                                                    {/* ✅ Checkbox only for Admin */}
                                                                    {isAdmin && (
                                                                        <td className="px-3 py-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                disabled={!isPassed}
                                                                                checked={selectedApprovedFaculties.includes(faculty.faculty_id)}
                                                                                onChange={() => {
                                                                                    if (!isPassed) return;
                                                                                    setSelectedApprovedFaculties((prev) =>
                                                                                        prev.includes(faculty.faculty_id)
                                                                                            ? prev.filter((id) => id !== faculty.faculty_id)
                                                                                            : [...prev, faculty.faculty_id]
                                                                                    );
                                                                                }}
                                                                                className={`w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 ${!isPassed
                                                                                    ? "opacity-40 cursor-not-allowed"
                                                                                    : "text-blue-600"
                                                                                    }`}
                                                                            />
                                                                        </td>
                                                                    )}

                                                                    <td className="px-3 py-2 text-xs text-gray-800">{faculty.name}</td>
                                                                    <td className="px-3 py-2 text-xs text-gray-800">{faculty.phone_no}</td>
                                                                    <td className="px-3 py-2 text-xs text-gray-800">{faculty.email}</td>
                                                                    <td className="px-3 py-2 text-xs text-gray-800">{faculty.designation}</td>
                                                                    <td className="px-3 py-2 text-xs text-gray-800">{faculty.branch}</td>
                                                                    <td className="px-3 py-2 text-xs text-gray-800">{faculty.institute_name}</td>
                                                                    <td className="px-3 py-2 text-xs text-gray-800">
                                                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[11px] font-medium">
                                                                            {faculty.faculty_status || "-"}
                                                                        </span>
                                                                    </td>
                                                                    {/* ✅ Certificate Status */}
                                                                    <td className="px-3 py-2 text-xs text-gray-800">
                                                                        <span
                                                                            className={`px-2 py-1 rounded text-[11px] font-medium ${faculty.cert_status === "Received"
                                                                                ? "bg-green-50 text-green-700"
                                                                                : faculty.cert_status === "Pending"
                                                                                    ? "bg-yellow-50 text-yellow-700"
                                                                                    : "bg-gray-50 text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {faculty.cert_status || "-"}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-3 py-2 text-xs">
                                                                        <button
                                                                            onClick={() => handleOpenAttendanceModal(faculty)}
                                                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                                                                        >
                                                                            Attendance
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>


                                                </table>


                                            </div>

                                            {/* Attendance Modal */}
                                            {selectedFaculty && (
                                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999]">
                                                    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-4">
                                                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                                            Attendance Details – {selectedFaculty.name}
                                                        </h2>

                                                        <div className="overflow-x-auto max-h-[400px]">
                                                            <table className="min-w-full divide-y divide-gray-200 text-xs">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">First Half</th>
                                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Second Half</th>
                                                                    </tr>
                                                                </thead>
{/* code needs to be updated in production */}
                                                                <tbody className="divide-y divide-gray-200">
  {selectedFaculty.attendance && selectedFaculty.attendance.length > 0 ? (
    selectedFaculty.attendance.map((day, index) => {
      const getStatus = (value) => {
        if (value === 1) return "Present";
        if (value === 0) return "Absent";
        return "-";
      };

      const getBadgeClass = (value) => {
        if (value === 1) return "bg-green-100 text-green-700";
        if (value === 0) return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-500";
      };

      return (
        <tr key={index}>
          <td className="px-3 py-2">{day.date}</td>

          {/* FIRST HALF */}
          <td className="px-3 py-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
                day.first_half
              )}`}
            >
              {getStatus(day.first_half)}
            </span>
          </td>

          {/* SECOND HALF */}
          <td className="px-3 py-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
                day.second_half
              )}`}
            >
              {getStatus(day.second_half)}
            </span>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="3" className="text-center py-4 text-gray-500 italic">
        No attendance data available
      </td>
    </tr>
  )}
</tbody>

                                                            </table>
                                                        </div>

                                                        <div className="flex justify-end mt-4">
                                                            <button
                                                                onClick={handleCloseAttendanceModal}
                                                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

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
                                        {/* Dynamic text based on event type */}
                                        <p className="text-gray-500 text-sm">
                                            {eventType === "fdp"
                                                ? "No faculties found matching your filters"
                                                : eventType === "edp"
                                                    ? "No educators found matching your filters"
                                                    : "No students found matching your filters"}
                                        </p>
                                        {/* <p className="text-gray-500 text-sm">
                                            No students88 found matching your filters
                                        </p> */}
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

export default FdpEdpBookingDetailsModal;