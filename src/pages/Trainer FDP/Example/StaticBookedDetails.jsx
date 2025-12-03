import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, MoreVertical, ChevronDown, X, Eye } from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";
import BookingDetailsModal from "./BookingDetailsModal";
import FdpEdpBookingDetailsModal from "./FdpEdpBookingDetailsModal";
import { toast } from "react-toastify";

const StaticBookedDetails = ({ eventTypeFilter = null, hideColumns = [] }) => {
  const [bookedDetails, setBookedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(5);

  // coordinator details states
  // === Coordinator Modal States ===
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingCoordinator, setEditingCoordinator] = useState(null); // for edit mode
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  // === For Faculty Limit Modal ===
  const [showFacultyLimitModal, setShowFacultyLimitModal] = useState(false);
  const [facultyLimit, setFacultyLimit] = useState("");
  const [tableData, setTableData] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);

  const [selectedInstitute, setSelectedInstitute] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);

  // --- NEW EFFECT TO FETCH DATA WHEN MODAL OPENS ---
  useEffect(() => {
    console.log("Effect triggered:", { showFacultyLimitModal, selectedBooking });
    console.log("Bookslot ID:", selectedBooking?.bookslot_id);

    const fetchInstituteFacultyLimit = async () => {
      try {
        if (!showFacultyLimitModal || !selectedBooking) return;
        const token = localStorage.getItem("accessToken");

        const res = await fetch(
          `${BASE_URL}/event/filter/institutes-faculty-limit/${selectedBooking.bookslot_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch data");

        console.log("Fetched Data:", data);

        // ✅ Extract and set to states correctly
        setStates(data.states || []);

        // ✅ Use active_institutes instead of institutes
        const institutes = data.active_institutes || [];

        setFilteredInstitutes(institutes);

        // ✅ Optionally set initial faculty limit (if all have same)
        if (institutes.length > 0) {
          setFacultyLimit(institutes[0].faculty_limit || "");
        }
      } catch (err) {
        console.error("Error fetching faculty limit data:", err);
      }
    };

    fetchInstituteFacultyLimit();
  }, [showFacultyLimitModal, selectedBooking]);


  useEffect(() => {
    const authorise = localStorage.getItem("Authorise");
    setIsAdmin(authorise === "admin");
    setIsStaff(authorise === "staff");
  }, []);
  // === 🧠 Fetch Booked Details from API ===
  useEffect(() => {
    if (!eventTypeFilter) return;
    fetchBookedDetails(eventTypeFilter);
  }, [eventTypeFilter]);
// code needs to be updated in production
  const fetchBookedDetails = useCallback(async (eventType) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    const url = `${BASE_URL}/event/booked-details/${eventType}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch bookings");

    const details = Array.isArray(data)
      ? data[0]?.booked_details || []
      : data.booked_details || [];

    setBookedDetails(details);
    return details;
  } catch (error) {
    console.error("Error fetching booked details:", error);
    setBookedDetails([]);
  } finally {
    setLoading(false);
  }
}, []); // IMPORTANT: empty deps


  // === 📅 Formatters & Helpers ===
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Closed":
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // === 🔍 Search & Pagination ===
  const filteredBookings = useMemo(() => {
    let filtered = bookedDetails;
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.domain_name?.toLowerCase().includes(lower) ||
          b.institute_name?.toLowerCase().includes(lower) ||
          b.rm_name?.toLowerCase().includes(lower)
      );
    }
    // return filtered;
    // needs to be changed in production
     // 🔥 SORT FULL LIST BEFORE PAGINATION
  return [...filtered].sort((a, b) => b.bookslot_id - a.bookslot_id);
  }, [bookedDetails, searchTerm]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // === 🧱 Dynamic Columns ===
// === Columns ===
const baseColumns = [
  { key: "domain_name", label: "Domain" },
  { key: "institute_name", label: "Participated Institutes" },
  { key: "trainer_details", label: "Trainer" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
];

let extraColumns = [];
if (eventTypeFilter === "tech_camp") {
  extraColumns = [
    { key: "students_limit", label: "Student Limit" },
    { key: "students_added", label: "Students Added" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];
} else if (eventTypeFilter === "fdp") {
  extraColumns = [
    { key: "participants", label: "Participants" },
    { key: "coordinator", label: "Coordinator" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];
} else if (eventTypeFilter === "edp") {
  extraColumns = [
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];
}

const columns = [...baseColumns, ...extraColumns].filter(
  (col) => !hideColumns.includes(col.key)
);

  // === ⚙️ State for Modals ===
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // change faculty limit table refetch
  useEffect(() => {
  const fetchFacultyLimits = async () => {
    if (!selectedBooking?.bookslot_id) return;

    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${BASE_URL}/event/institute/faculty-limit/${selectedBooking.bookslot_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();

      if (response.ok) {
        // Populate table with backend data
        setTableData(
          result.map((item) => ({
            institute: item.institute_name,
            facultyIds: item.faculty_limit,
          }))
        );
      } else {
        console.error("Error fetching faculty limits:", result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  fetchFacultyLimits();
}, [selectedBooking]);


  // === ⚡ Handlers ===
  const handleViewDetails = (booking) => {
    if (
      eventTypeFilter === "tech_camp" ||
      eventTypeFilter === "fdp" ||
      eventTypeFilter === "edp"
    ) {
      setSelectedBookingId(booking.bookslot_id);
      setIsModalOpen(true);
    }
    setOpenMenuIndex(null);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setBookingToCancel(null);
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setIsDeleteModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBookingToDelete(null);
  };

const handleConfirmDelete = async () => {
  if (!bookingToDelete) return;
  try {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${BASE_URL}/event/book-slot/${bookingToDelete.bookslot_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🧩 Try to parse response (in case of backend error message)
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok)
      throw new Error(data.detail || "Failed to delete booking.");

    // ✅ Refresh table data after delete
    await fetchBookedDetails(eventTypeFilter);
    toast.success("Booking deleted successfully!");
  } catch (error) {
    console.error("Error deleting booking:", error);
    toast.error(error.message || "Failed to delete booking.");
  } finally {
    setLoading(false);
    setBookingToDelete(null);
    setIsDeleteModalOpen(false);
  }
};

const handleConfirmCancel = async () => {
  if (!bookingToCancel) return;
  try {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${BASE_URL}/event/cancel-bookslot/${bookingToCancel.bookslot_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🧩 Parse the response safely (handles both success & error)
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok)
      throw new Error(data.detail || "Failed to cancel booking.");

    // ✅ Refresh table data after cancel
    await fetchBookedDetails(eventTypeFilter);
    toast.success("Booking cancelled successfully!");
  } catch (error) {
    console.error("Error cancelling booking:", error);
    toast.error(error.message || "Failed to cancel booking.");
  } finally {
    setLoading(false);
    setBookingToCancel(null);
    setIsCancelModalOpen(false);
  }
};

// ✅ Add/Edit Coordinator — Fully Fixed Version
const handleSubmitCoordinator = async () => {
  // 🔍 Validation
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.gender?.trim()) newErrors.gender = "Gender is required";
  if (!formData.email.trim()) newErrors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    newErrors.email = "Enter a valid email address";

  if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
  else if (!/^\d{10}$/.test(formData.mobile))
    newErrors.mobile = "Enter a valid 10-digit mobile number";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  const token = localStorage.getItem("accessToken");

  try {
    let response;
    let data;

    if (editingCoordinator) {
      // ✏️ EDIT Coordinator
      response = await fetch(`${BASE_URL}/event/fdp-coordinator/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coordinator_id: editingCoordinator.id,
          name: formData.name,
          gender: formData.gender,   // <-- ADD THIS
          email: formData.email,
          mobile: formData.mobile,
        }),
      });

      data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to edit coordinator");

      alert("✅ Coordinator updated successfully!");
    } else {
      // ➕ ADD Coordinator
      response = await fetch(`${BASE_URL}/event/fdp-coordinator/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookslot_id: selectedBooking.bookslot_id,
          name: formData.name,
          gender: formData.gender,   // <-- ADD THIS
          email: formData.email,
          mobile: formData.mobile,
        }),
      });

      data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add coordinator");

      alert("✅ Coordinator added successfully!");
    }

// 🔄 Refresh table data after add/edit
await fetchBookedDetails(selectedBooking.event_type);

// 🧠 Also update current selectedBooking locally for instant UI
if (editingCoordinator) {
  setSelectedBooking((prev) => ({
    ...prev,
    coordinators: prev.coordinators.map((c) =>
      c.id === editingCoordinator.id
        ? {
            ...c,
          coordinator_name: formData.name,
            coordinator_gender: formData.gender,   // <-- ADD THIS
            coordinator_email: formData.email,
            coordinator_mobile: formData.mobile,
          }
        : c
    ),
  }));
} else {
  // Add new coordinator locally
  setSelectedBooking((prev) => ({
    ...prev,
    coordinators: [
      ...(prev.coordinators || []),
      {
        id: data.id,  // ← FIXED HERE
        coordinator_name: formData.name,
        coordinator_gender: formData.gender,   // <-- ADD THIS
        coordinator_email: formData.email,
        coordinator_mobile: formData.mobile,
      },
    ],
  }));
}


    // 🔄 Refresh table data after add/edit
    // await fetchBookedDetails(selectedBooking.event_type);

    // 🎯 Auto-close and reset the form
    setShowAddForm(false);
    setEditingCoordinator(null);
    setFormData({ name: "", gender: "", email: "", mobile: "" });
    setErrors({});
    setOpenActionMenu(null);
  } catch (err) {
    console.error("❌ Error in coordinator submission:", err);
    alert("Failed to save coordinator. Please try again.");
  }
};

  // --- Function to handle Faculty Limit Update ---
  const handleChangeFacultyLimit = async () => {
  try {
    // ✅ Clear old error message
    setErrorMessage(null);

    // ✅ Basic Validation
    if (!selectedInstitute) {
      setErrorMessage("Please select an institute before changing the limit.");
      return;
    }

    if (!facultyLimit || isNaN(facultyLimit)) {
      setErrorMessage("Please enter a valid numeric faculty limit.");
      return;
    }

    // ✅ New Validation: Maximum allowed limit = 10
    if (Number(facultyLimit) > 10) {
      setErrorMessage("Faculty limit cannot exceed 10 for any participated institute.");
      return;
    }

    if (!selectedBooking || !selectedBooking.bookslot_id) {
      setErrorMessage("Invalid booking. Please reopen the modal.");
      return;
    }

    // ✅ Find the institute object
    const inst = filteredInstitutes.find(
      (i) => i.institute_name === selectedInstitute
    );
    if (!inst) {
      setErrorMessage("Invalid institute selected.");
      return;
    }

    // ✅ Construct payload
    const payload = {
      bookslot_id: selectedBooking.bookslot_id,
      institute_id: inst.institute_id,
      faculty_limit: Number(facultyLimit),
    };

    console.log("📦 Sending Payload:", payload);

    const token = localStorage.getItem("accessToken");

    // ✅ API call
    const response = await fetch(`${BASE_URL}/event/institute/faculty-limit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      const backendMessage =
        result.detail ||
        result.message ||
        "Failed to update faculty limit. Please try again.";
      throw new Error(backendMessage);
    }

    console.log("✅ Faculty limit updated successfully:", result);

    // ✅ Update UI table
    setTableData((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((r) => r.institute === selectedInstitute);
      if (idx !== -1) {
        updated[idx].facultyIds = facultyLimit;
      } else {
        updated.push({
          institute: selectedInstitute,
          facultyIds: facultyLimit,
        });
      }
      return updated;
    });

    alert("Faculty limit updated successfully!");
  } catch (err) {
    console.error("❌ Error updating faculty limit:", err);
    setErrorMessage(err.message || "Failed to update faculty limit. Please try again.");
  }
};


  // === 🖼️ JSX ===
  return (
    // <div className="bg-white rounded-lg shadow-md p-6 relative">
    <div className="overflow-x-auto max-w-full">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {eventTypeFilter
            ? `${eventTypeFilter.replace("_", " ").toUpperCase()} Bookings`
            : "All Bookings"}
        </h3>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
<div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">


<table className="min-w-full table-fixed border-collapse text-sm">
  {/* === TABLE HEADER === */}
  <thead className="bg-gray-100 border-b border-gray-200">
    <tr>
      {columns
        .filter((col) => !(col.key === "institute_name" && eventTypeFilter === "edp"))
        .map((col) => {
          let label = col.label;
          if (col.key === "institute_name") label = "Participated Institutes";
          if (col.key === "trainer_details") label = "Trainer";

          // Center-align for certain columns, including Trainer in EDP
          const isCenter =
            col.key === "start_date" ||
            col.key === "end_date" ||
            col.key === "participants" ||
            col.key === "total_faculty_added" ||
            col.key === "students_limit" ||
            col.key === "students_added" ||
            col.key === "coordinator" ||
            col.key === "status" ||
            col.key === "actions" ||
            (col.key === "trainer_details" && (eventTypeFilter === "edp" || eventTypeFilter === "tech_camp"))


          return (
            <th
              key={col.key}
              className={`px-3 py-2 text-[12px] font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap max-w-[180px] ${
                isCenter ? "text-center" : "text-left"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                {label}
                {(col.key === "participants" || col.key === "total_faculty_added") && (
                  <span className="relative group ml-1">
                    <Eye className="w-5 h-5 text-gray-500 cursor-pointer font-bold" />
<div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-2 text-[11px] text-gray-800 bg-white border border-gray-300 rounded-md shadow-md w-[160px] text-center opacity-0 group-hover:opacity-100 transition-all duration-200 leading-snug whitespace-normal">
  <span className="font-semibold text-indigo-600">Participants</span>
  <br />
  = Total Faculty Added /
  <br />
  Total Faculty Limit
</div>

                  </span>
                )}
              </div>
            </th>
          );
        })}
    </tr>
  </thead>
{/* needs to be changed in production */}
  {/* === TABLE BODY === */}
  <tbody className="divide-y divide-gray-100">
  {currentBookings.length > 0 ? (
      
    currentBookings.map((b, i) => (
        <tr
          key={i}
          className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/40 transition-colors duration-150"
        >
          {columns
            .filter((col) => !(col.key === "institute_name" && b.event_type === "edp"))
            .map((col) => {
              const isCenter =
                col.key === "start_date" ||
                col.key === "end_date" ||
                col.key === "participants" ||
                col.key === "total_faculty_added" ||
                col.key === "students_limit" ||
                col.key === "students_added" ||
                col.key === "coordinator" ||
                col.key === "status" ||
                col.key === "actions" ||
                (col.key === "trainer_details" &&
                  (b.event_type === "edp" || b.event_type === "tech_camp"));

              switch (col.key) {
                case "domain_name":
                case "institute_name":
                case "trainer_details":
                  return (
                    <td
                      key={col.key}
                      className={`px-3 py-2 text-gray-800 font-medium truncate max-w-[180px] ${
                        isCenter ? "text-center" : "text-left"
                      }`}
                      title={
                        col.key === "domain_name"
                          ? b.domain_name
                          : col.key === "institute_name"
                          ? b.institute_name || b.hosted_institute_name || "-"
                          : b.trainer_name || "-"
                      }
                    >
                      {col.key === "domain_name"
                        ? b.domain_name
                        : col.key === "institute_name"
                        ? b.institute_name || b.hosted_institute_name || "-"
                        : b.trainer_name || "-"}
                    </td>
                  );

                case "start_date":
                case "end_date":
                  return (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-gray-600 text-center whitespace-nowrap"
                    >
                      {formatDate(b[col.key])}
                    </td>
                  );

                case "participants":
                case "total_faculty_added":
                  return (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-gray-700 text-center font-medium"
                    >
                      {b.total_faculty_added ?? 0}/{b.total_faculty_limit ?? 0}
                    </td>
                  );

                case "students_limit":
                case "students_added":
                  return (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-gray-700 text-center font-medium"
                    >
                      {b[col.key] ?? 0}
                    </td>
                  );

                case "coordinator":
                  return (
                    <td key={col.key} className="px-3 py-2 text-center">
                      {b.event_type === "fdp" ? (
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setShowCoordinatorModal(true);
                          }}
                          className="px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-md shadow-sm hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">N/A</span>
                      )}
                    </td>
                  );

                case "status":
                  return (
                    <td key={col.key} className="px-3 py-2 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(
                          b.event_status
                        )}`}
                      >
                        {b.event_status}
                      </span>
                    </td>
                  );

                case "actions":
                  return (
                    <td key={col.key} className="px-3 py-2 text-center">
                      <button
                        data-menu-index={i}
                        onClick={() =>
                          setOpenMenuIndex(openMenuIndex === i ? null : i)
                        }
                        className="p-1.5 rounded-full hover:bg-gray-100 transition"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  );

                default:
                  return null;
              }
            })}
        </tr>
      ))
  ) : (
    <tr>
      <td
        colSpan={columns.length}
        className="px-4 py-5 text-center text-gray-500 text-sm"
      >
        No bookings found.
      </td>
    </tr>
  )}
</tbody>

</table>

</div>
      )}

     {/* Coordinator Details Modal */}
{showCoordinatorModal && selectedBooking && (
  <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-5xl h-[90vh] flex flex-col border border-gray-300 overflow-hidden relative">
      
      {/* === Header === */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white sticky top-0 z-10">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Coordinator Details - {selectedBooking.domain_name}
          </h3>
          {selectedBooking.hosted_institute_name && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedBooking.hosted_institute_name}
            </p>
          )}
        </div>

        <button
          onClick={() => {
            setShowCoordinatorModal(false);
            setEditingCoordinator(null);
            setShowAddForm(false);
            setOpenActionMenu(null);
            setErrors({});
            setFormData({ name: "", gender: "", email: "", mobile: "" });
          }}
          className="text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {/* === Main Layout === */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* === LEFT PANEL: Coordinator Table === */}
        <div className="w-full overflow-y-auto p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-semibold text-gray-700">Coordinators</h4>

            {/* 🟡 Remove Add button for Admin completely */}
            {/* Add Coordinator Button - STAFF MODE */}
{!isAdmin && (
  <button
    onClick={() => {
      setShowAddForm(true);
      setEditingCoordinator(null);
      setFormData({ name: "", gender: "", email: "", mobile: "" });
      setErrors({});
    }}
    disabled={!selectedBooking.can_add} // Disable button if can_add is false
    className={`px-3 py-1.5 text-xs rounded-lg transition 
      ${selectedBooking.can_add
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
  >
    Add Coordinator
  </button>
)}

          </div>

          {selectedBooking.coordinators?.length > 0 ? (
            <table className="w-full text-sm border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                        <th className="px-3 py-2 text-left text-gray-700 font-medium">Name</th>
                        <th className="px-3 py-2 text-left text-gray-700 font-medium">Gender</th>
                  <th className="px-3 py-2 text-left text-gray-700 font-medium">Email</th>
                  <th className="px-3 py-2 text-left text-gray-700 font-medium">Mobile</th>
                  {!isAdmin && (
                    <th className="px-3 py-2 text-center text-gray-700 font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedBooking.coordinators.map((coord) => (
                  <tr
                    key={coord.id}
                    className="border-t hover:bg-gray-50 transition relative"
                  >
                    <td className="px-3 py-2">{coord.coordinator_name}</td>
                    <td className="px-3 py-2">{coord.coordinator_gender}</td>
                    <td className="px-3 py-2">{coord.coordinator_email}</td>
                    <td className="px-3 py-2">{coord.coordinator_mobile}</td>

                    {/* 🟡 Hide action buttons for Admin */}
                    {!isAdmin && (
                      <td className="px-3 py-2 text-center relative">
                        <button
                          onClick={() =>
                            setOpenActionMenu(
                              openActionMenu === coord.id ? null : coord.id
                            )
                          }
                          className="p-1.5 rounded hover:bg-gray-100 transition"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>

                        {openActionMenu === coord.id && (
                          <div className="absolute right-6 top-8 w-28 bg-white border border-gray-200 rounded-md shadow-md z-50">
                            <button
                              onClick={() => {
                                setEditingCoordinator(coord);
                                setFormData({
                                  name: coord.coordinator_name,
                                  gender: coord.coordinator_gender,   // <-- Add this
                                  email: coord.coordinator_email,
                                  mobile: coord.coordinator_mobile,
                                });
                                setShowAddForm(true);
                                setOpenActionMenu(null);
                                setErrors({});
                              }}
                              className="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 text-gray-700"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm italic mt-10 text-center">
              No coordinators found.
            </p>
          )}
        </div>

        {/* 🟡 Remove Right Panel entirely for Admin */}
        {!isAdmin && (
          <div className="w-1/3 p-6 bg-gray-50 overflow-y-auto">
            {showAddForm ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    {editingCoordinator ? "Edit Coordinator" : "Add Coordinator"}
                  </h4>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCoordinator(null);
                      setFormData({ name: "", gender: "", email: "", mobile: "" });
                      setErrors({});
                    }}
                    className="text-gray-500 hover:text-gray-800 text-sm"
                  >
                    ✕
                  </button>
                </div>

                      <div className="flex flex-col gap-3">
          <label className="block text-sm font-medium text-gray-700">
  Name <span className="text-red-500">*</span>
</label>

                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`border p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 -mt-2">{errors.name}</p>
                  )}

{/* Coordinator Gender */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    Gender <span className="text-red-500">*</span>
  </label>

  <div className="flex items-center gap-6">
    <label className="inline-flex items-center space-x-2 text-sm">
      <input
        type="radio"
        name="coordinatorGender"
        value="male"
        checked={formData.gender === "male"}
        onChange={() => setFormData({ ...formData, gender: "male" })}
        className="h-4 w-4"
      />
      <span>Male</span>
    </label>

    <label className="inline-flex items-center space-x-2 text-sm">
      <input
        type="radio"
        name="coordinatorGender"
        value="female"
        checked={formData.gender === "female"}
        onChange={() => setFormData({ ...formData, gender: "female" })}
        className="h-4 w-4"
      />
      <span>Female</span>
    </label>
  </div>

  {errors.gender && (
    <p className="text-xs text-red-500 ">{errors.gender}</p>
  )}
</div>

  <label className="block text-sm font-medium text-gray-700">
  Email <span className="text-red-500">*</span>
</label>
                      
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`border p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 -mt-2">{errors.email}</p>
                  )}
<label className="block text-sm font-medium text-gray-700">
  Mobile <span className="text-red-500">*</span>
</label>

                  <input
                    type="text"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className={`border p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-xs text-red-500 -mt-2">{errors.mobile}</p>
                  )}

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingCoordinator(null);
                        setFormData({ name: "", gender: "", email: "", mobile: "" });
                        setErrors({});
                      }}
                      className="px-3 py-1.5 text-gray-600 text-xs border rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitCoordinator()}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                    >
                      {editingCoordinator ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm italic text-center mt-20">
                Click “Add Coordinator” or “Edit” to manage coordinators.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}
      
      {/* === Dropdown Menu Portal === */}
      {openMenuIndex !== null && currentBookings[openMenuIndex] && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpenMenuIndex(null)}
          ></div>

          {(() => {
  const buttonRect = document
    .querySelector(`[data-menu-index="${openMenuIndex}"]`)
    ?.getBoundingClientRect();

  if (!buttonRect) return null; // safety check

  let topPosition = buttonRect.bottom + window.scrollY + 8;
  const dropdownHeight = 180; // adjust if your menu is taller

  // 🧠 If not enough space below, flip upwards
  if (topPosition + dropdownHeight > window.innerHeight + window.scrollY) {
    topPosition = buttonRect.top + window.scrollY - dropdownHeight - 8;
  }

  const leftPosition = buttonRect.right + window.scrollX - 192;

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40 w-48"
      style={{
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
      }}
    >
      {/* View Details — always enabled */}
      <button
        onClick={() => handleViewDetails(currentBookings[openMenuIndex])}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        View Details
      </button>

      {/* === Cancel Booking (depends on can_edit) === */}
      <button
        onClick={() =>
          currentBookings[openMenuIndex].can_edit &&
          handleCancelClick(currentBookings[openMenuIndex])
        }
        disabled={!currentBookings[openMenuIndex].can_edit}
        className={`w-full px-4 py-2 text-left text-sm rounded transition-colors ${
          currentBookings[openMenuIndex].can_edit
            ? "text-orange-600 hover:bg-orange-50"
            : "text-gray-400 cursor-not-allowed bg-gray-50"
        }`}
      >
        Cancel Booking
      </button>

      {/* === Delete Booking (depends on can_delete) === */}
      <button
        onClick={() =>
          currentBookings[openMenuIndex].can_delete &&
          handleDeleteClick(currentBookings[openMenuIndex])
        }
        disabled={!currentBookings[openMenuIndex].can_delete}
        className={`w-full px-4 py-2 text-left text-sm rounded transition-colors ${
          currentBookings[openMenuIndex].can_delete
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-400 cursor-not-allowed bg-gray-50"
        }`}
      >
        Delete Booking
      </button>

      {/* === Change Faculty Limit (for FDP/EDP only) === */}
      {isStaff &&
        ["fdp", "edp"].includes(currentBookings[openMenuIndex]?.event_type) && (
          <button
            onClick={() => {
              setSelectedBooking(currentBookings[openMenuIndex]);
              setTimeout(() => setShowFacultyLimitModal(true), 0);
              setOpenMenuIndex(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Change Faculty Limit
          </button>
        )}
    </div>
  );
})()}

        </>
      )}


      {/* === View Details Modal (tech camp / fdp / edp) === */}
      {isModalOpen && (
        <>
          {eventTypeFilter === "tech_camp" && (
            <BookingDetailsModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              bookslotId={selectedBookingId}
            />
          )}

          {(eventTypeFilter === "fdp" || eventTypeFilter === "edp") && (
            <FdpEdpBookingDetailsModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              bookslotId={selectedBookingId}
              eventType={eventTypeFilter}
              fetchBookedDetails={fetchBookedDetails}  // 👈 pass it here
            />
          )}
        </>
      )}
      
      {/* === Change Faculty Limit Modal === */}
{showFacultyLimitModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    {/* ✅ Wrapper to avoid overlapping with navbar */}
    <div className="mt-16 mb-6 flex justify-center items-start w-full overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[700px] max-h-[80vh] overflow-y-auto border border-gray-200">

        {/* === Header === */}
        <div className="flex justify-between items-center mb-5 sticky top-0 bg-white z-10 pb-2 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Change Faculty Limit
          </h2>
          <button
            onClick={() => setShowFacultyLimitModal(false)}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* === Filters === */}
        <div className="flex flex-wrap items-end gap-6 mb-6">
          {/* === State Filter === */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="font-semibold text-gray-700 mb-1">
              Filter by State:
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedInstitute([]);
                setFacultyLimit("");
              }}
              className="border px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow transition"
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.state_id}>{s.state_name}</option>
              ))}
            </select>
          </div>

          {/* === Institute Filter === */}
          <div className="flex flex-col flex-1 min-w-[250px]">
            <label className="font-semibold text-gray-700 mb-1">
              Filter by Institute:
            </label>
            <select
              value={selectedInstitute}
              onChange={(e) => {
                const selectedName = e.target.value;
                setSelectedInstitute(selectedName);
                const inst = filteredInstitutes.find(
                  (i) => i.institute_name === selectedName
                );
                setFacultyLimit(inst?.faculty_limit || "");
              }}
              disabled={!selectedState}
              className={`border px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow transition ${
                !selectedState && "cursor-not-allowed opacity-50"
              }`}
            >
              <option value="">Select Institute</option>
              {filteredInstitutes
                .filter((i) => {
                  const stateObj = states.find(
                    (s) => s.state_name === selectedState
                  );
                  return stateObj ? i.state_id === stateObj.state_id : true;
                })
                .map((i) => (
                  <option key={i.institute_id} value={i.institute_name}>
                    {i.institute_name}
                  </option>
                ))}
            </select>
          </div>

          {/* === Faculty Limit Input + Button === */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="font-semibold text-gray-700 mb-1">
              Change Faculty Limit:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={facultyLimit}
                onChange={(e) => setFacultyLimit(e.target.value)}
                placeholder="Enter number"
                className="border px-3 py-2 rounded-lg w-28"
              />
              <button
                onClick={handleChangeFacultyLimit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* === Error Message Display === */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* === Static Note === */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-gray-800 text-sm rounded-lg">
          <strong>Note:</strong> Only participated institute faculty limit
          changed can be seen in the table. All other participated institutes
          have a default limit of <strong>2</strong>, except the hosting
          institute.
        </div>

        {/* === Static Table === */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">
                  Participated Institute
                </th>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">
                  Faculty IDs
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{row.institute}</td>
                  <td className="px-4 py-2">{row.facultyIds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}



{/* === Cancel Booking Modal === */}
{isCancelModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
        Cancel Booking
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Are you sure you want to cancel this booking?
      </p>

      {bookingToCancel && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm space-y-2">
            <div>
              <span className="text-gray-600">Domain:</span>
              <span className="ml-2 font-medium text-gray-900">
                {bookingToCancel.domain_name}
              </span>
            </div>

            {/* === Show institute only for Tech Camp or FDP === */}
            {bookingToCancel.event_type === "fdp" ? (
              <div>
                <span className="text-gray-600">Institute:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {bookingToCancel.hosted_institute_name}
                </span>
              </div>
            ) : bookingToCancel.event_type !== "edp" ? (
              <div>
                <span className="text-gray-600">Institute:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {bookingToCancel.institute_name}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCancelModalClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
        >
          Keep Booking
        </button>
        <button
          onClick={handleConfirmCancel}
          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  </div>
)}

{/* === Delete Booking Modal === */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
        Delete Booking
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Are you sure you want to delete this booking? This action cannot be undone.
      </p>

      {bookingToDelete && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm space-y-2">
            <div>
              <span className="text-gray-600">Domain:</span>
              <span className="ml-2 font-medium text-gray-900">
                {bookingToDelete.domain_name}
              </span>
            </div>

            {/* === Show institute only for Tech Camp or FDP === */}
            {bookingToDelete.event_type === "fdp" ? (
              <div>
                <span className="text-gray-600">Institute:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {bookingToDelete.hosted_institute_name}
                </span>
              </div>
            ) : bookingToDelete.event_type !== "edp" ? (
              <div>
                <span className="text-gray-600">Institute:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {bookingToDelete.institute_name}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCancelDelete}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}      

      {/* Pagination */}
      {filteredBookings.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-700">
          <div>
            Showing {startIndex + 1}–{Math.min(endIndex, filteredBookings.length)} of{" "}
            {filteredBookings.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="p-2 border rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticBookedDetails;