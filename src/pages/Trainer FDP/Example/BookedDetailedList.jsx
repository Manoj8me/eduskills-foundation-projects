import React, { useState, useMemo } from "react";
import { MoreVertical, Search, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import BookingDetailsModal from "./BookingDetailsModal";
import { BASE_URL } from "../../../services/configUrls";

const BookedDetailsList = ({ bookedDetails, onBookingDeleted }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

  const isAdmin = localStorage.getItem("Authorise") === "admin";

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get unique event types from bookings
  const eventTypes = useMemo(() => {
    if (!bookedDetails) return [];
    const types = [...new Set(bookedDetails.map((b) => b.event_type))];
    return types.sort();
  }, [bookedDetails]);

  // Filter bookings based on search term and active tab
  const filteredBookings = useMemo(() => {
    if (!bookedDetails) return [];

    let filtered = bookedDetails;

    // Filter by event type tab
    if (activeTab !== "all") {
      filtered = filtered.filter((booking) => booking.event_type === activeTab);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((booking) => {
        return (
          booking.domain_name?.toLowerCase().includes(lowercasedSearch) ||
          booking.institute_name?.toLowerCase().includes(lowercasedSearch) ||
          booking.event_type?.toLowerCase().includes(lowercasedSearch) ||
          booking.event_status?.toLowerCase().includes(lowercasedSearch) ||
          booking.rm_name?.toLowerCase().includes(lowercasedSearch) ||
          booking.rm_email?.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    return filtered;
  }, [bookedDetails, searchTerm, activeTab]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to page 1 when search term or tab changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setOpenMenuIndex(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOpenMenuIndex(null);
  };

  const handleMenuToggle = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleViewDetails = (bookslotId) => {
    setSelectedBookingId(bookslotId);
    setIsModalOpen(true);
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

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      const response = await api.put(
        `/event/cancel-bookslot/${bookingToCancel.bookslot_id}`
      );
      alert(response?.data?.message || "Booking cancelled successfully");
      setIsCancelModalOpen(false);
      setBookingToCancel(null);

      if (onBookingDeleted) {
        onBookingDeleted();
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.detail || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
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

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/event/book-slot/${bookingToDelete.bookslot_id}`);
      alert("Booking deleted successfully");
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);

      if (onBookingDeleted) {
        onBookingDeleted();
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(error.response?.data?.message || "Failed to delete booking");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  const formatEventType = (eventType) => {
    return eventType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to get the appropriate limit based on event type
  const getParticipantLimit = (booking) => {
    return booking.event_type === "fdp"
      ? booking.fdp_limit
      : booking.students_limit;
  };

  if (!bookedDetails || bookedDetails.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
        <p className="text-gray-500 text-lg">
          No bookings found for this trainer
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Booking Details
          </h3>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            All ({bookedDetails.length})
          </button>
          {eventTypes.map((eventType) => {
            const count = bookedDetails.filter(
              (b) => b.event_type === eventType
            ).length;
            return (
              <button
                key={eventType}
                onClick={() => handleTabChange(eventType)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === eventType
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                  }`}
              >
                {formatEventType(eventType)} ({count})
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Institute
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    RM Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    RM Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {activeTab === "fdp" ? "Participants" : "Students"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No bookings found matching your search.
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div
                          className="max-w-[150px] truncate"
                          title={booking.domain_name}
                        >
                          {booking.domain_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div
                          className="max-w-[150px] truncate"
                          title={booking.institute_name}
                        >
                          {booking.institute_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div
                          className="max-w-[150px] truncate"
                          title={booking.rm_name || "N/A"}
                        >
                          {booking.rm_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div
                          className="max-w-[180px] truncate"
                          title={booking.rm_email || "N/A"}
                        >
                          {booking.rm_email || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(booking.start_date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(booking.end_date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {getParticipantLimit(booking)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            booking.event_status
                          )}`}
                        >
                          {booking.event_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="relative static">
                          <button
                            data-menu-index={index}
                            onClick={() => handleMenuToggle(index)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dropdown Menu Portal - Outside table */}
        {openMenuIndex !== null && currentBookings[openMenuIndex] && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpenMenuIndex(null)}
            ></div>
            <div
              className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40 w-48"
              style={{
                top: `${document
                    .querySelector(`[data-menu-index="${openMenuIndex}"]`)
                    ?.getBoundingClientRect().bottom +
                  window.scrollY +
                  8
                  }px`,
                left: `${document
                    .querySelector(`[data-menu-index="${openMenuIndex}"]`)
                    ?.getBoundingClientRect().right +
                  window.scrollX -
                  192
                  }px`,
              }}
            >
              <button
                onClick={() =>
                  handleViewDetails(currentBookings[openMenuIndex].bookslot_id)
                }
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() =>
                  handleCancelClick(currentBookings[openMenuIndex])
                }
                className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Cancel Booking
              </button>
              {isAdmin && (
                <button
                  onClick={() =>
                    handleDeleteClick(currentBookings[openMenuIndex])
                  }
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete Booking
                </button>
              )}
            </div>
          </>
        )}

        {/* Pagination Controls */}
        {filteredBookings.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 py-1 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bookslotId={selectedBookingId}
      />

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Cancel Booking
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to cancel this booking? You may be able to
              rebook later.
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
                  <div>
                    <span className="text-gray-600">Institute:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {bookingToCancel.institute_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatDate(bookingToCancel.start_date)} -{" "}
                      {formatDate(bookingToCancel.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancelModalClose}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Delete Booking
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this booking? This action cannot
              be undone.
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
                  <div>
                    <span className="text-gray-600">Institute:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {bookingToDelete.institute_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatDate(bookingToDelete.start_date)} -{" "}
                      {formatDate(bookingToDelete.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookedDetailsList;
