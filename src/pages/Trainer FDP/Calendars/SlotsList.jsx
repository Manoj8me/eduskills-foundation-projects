import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SlotsList = ({
  slots,
  getSlotStatus,
  handleEditSlot,
  handleDeleteSlot,
  setCurrentDate,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Invalid Date";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = date.getMonth();
    if (monthIndex < 0 || monthIndex >= monthNames.length)
      return "Invalid Date";

    return `${date.getDate()} ${monthNames[monthIndex].slice(
      0,
      3
    )} ${date.getFullYear()}`;
  };

  const navigateToSlotRange = (slot) => {
    const slotDate = new Date(slot.from_date);
    setCurrentDate(slotDate);
  };

  const openBookingModal = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  const getEventStatusInfo = (eventStatus) => {
    switch (eventStatus?.toLowerCase()) {
      case "upcoming":
        return {
          label: "Upcoming",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          showStudentList: false,
        };
      case "started":
        return {
          label: "Started",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          showStudentList: true,
        };
      case "closed":
        return {
          label: "Closed",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          showStudentList: true,
        };
      default:
        return {
          label: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          showStudentList: false,
        };
    }
  };

  const handleViewStudentList = (bookslotId) => {
    navigate(`/att/${bookslotId}`);
  };

  // Filter and paginate slots
  const filteredSlots = slots.filter((slot) => {
    const searchLower = searchTerm.toLowerCase();
    const slotStatus = getSlotStatus(slot);
    const bookedDetails = Array.isArray(slot.booked_details)
      ? slot.booked_details
      : [];

    return (
      slotStatus.label.toLowerCase().includes(searchLower) ||
      slot.from_date.includes(searchTerm) ||
      slot.to_date.includes(searchTerm) ||
      bookedDetails.some(
        (booking) =>
          booking.institute_name?.toLowerCase().includes(searchLower) ||
          booking.domain_name?.toLowerCase().includes(searchLower)
      )
    );
  });

  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const currentSlots = filteredSlots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Slot Details</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search slots..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Slots List - Taking full height */}
        <div className="flex-1 flex flex-col">
          <div className="space-y-4 flex-1 overflow-y-auto">
            {currentSlots.map((slot) => {
              const slotStatus = getSlotStatus(slot);
              const hasBookings =
                slot.booked_details &&
                Array.isArray(slot.booked_details) &&
                slot.booked_details.length > 0;

              return (
                <div
                  key={slot.slot_id}
                  className={`border border-slate-200 rounded-lg p-4 transition-all duration-200 hover:bg-slate-50 ${
                    slotStatus.status === "available"
                      ? "border-l-4 border-l-green-500"
                      : slotStatus.status === "booked"
                      ? "border-l-4 border-l-red-500"
                      : "border-l-4 border-l-orange-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-slate-900">
                          Slot #{slot.slot_id}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            slotStatus.status === "available"
                              ? "bg-green-100 text-green-800"
                              : slotStatus.status === "booked"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {slotStatus.label}
                        </span>
                        {slotStatus.status === "available" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSlot(slot)}
                              className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => navigateToSlotRange(slot)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          View in Calendar
                        </button>
                        {hasBookings && (
                          <button
                            onClick={() => openBookingModal(slot)}
                            className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition-colors"
                          >
                            View Bookings ({slot.booked_details.length})
                          </button>
                        )}
                      </div>
                      <div className="text-lg font-medium text-slate-700">
                        {formatDateDisplay(slot.from_date)} to{" "}
                        {formatDateDisplay(slot.to_date)}
                      </div>
                      {!hasBookings && (
                        <div className="text-sm text-slate-500 mt-1">
                          This slot is fully available for booking
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {currentSlots.length === 0 && (
            <div className="text-center py-8 text-slate-500 flex-1 flex items-center justify-center">
              No slots found matching your search criteria.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredSlots.length)} of{" "}
                {filteredSlots.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-slate-500 bg-white border border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                Booking Details - Slot #{selectedSlot.slot_id}
              </h3>
              <button
                onClick={closeBookingModal}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600">
                <strong>Slot Period:</strong>{" "}
                {formatDateDisplay(selectedSlot.from_date)} to{" "}
                {formatDateDisplay(selectedSlot.to_date)}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {selectedSlot.booked_details &&
              Array.isArray(selectedSlot.booked_details) &&
              selectedSlot.booked_details.length > 0 ? (
                <div className="h-full flex flex-col">
                  <h4 className="text-lg font-semibold text-slate-700 mb-4">
                    Bookings ({selectedSlot.booked_details.length} booking
                    {selectedSlot.booked_details.length > 1 ? "s" : ""})
                  </h4>
                  <div className="flex-1 overflow-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 w-1/5">
                            Institute Name
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 w-1/5">
                            Domain Name
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 w-1/4">
                            Booked Period
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 w-1/6">
                            Event Status
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 w-1/6">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSlot.booked_details.map((booking, index) => {
                          const eventStatusInfo = getEventStatusInfo(
                            booking.event_status
                          );

                          return (
                            <tr
                              key={index}
                              className="border-t border-slate-200 hover:bg-slate-50"
                            >
                              <td
                                className="px-4 py-3 text-slate-800"
                                title={booking.institute_name}
                              >
                                <div className="truncate max-w-[180px]">
                                  {booking.institute_name || "N/A"}
                                </div>
                              </td>
                              <td
                                className="px-4 py-3 text-slate-700"
                                title={booking.domain_name}
                              >
                                <div className="truncate max-w-[180px]">
                                  {booking.domain_name || "N/A"}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-700">
                                <div className="text-sm">
                                  <div className="font-medium">
                                    {formatDateDisplay(booking.start_date)}
                                  </div>
                                  <div className="text-slate-500">
                                    to {formatDateDisplay(booking.end_date)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${eventStatusInfo.bgColor} ${eventStatusInfo.textColor}`}
                                >
                                  {eventStatusInfo.label}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {eventStatusInfo.showStudentList ? (
                                  <button
                                    onClick={() =>
                                      handleViewStudentList(booking.bookslot_id)
                                    }
                                    className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition-colors font-medium"
                                  >
                                    View Student List
                                  </button>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">
                                    Not Available
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No booking details available for this slot.
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={closeBookingModal}
                className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlotsList;
