import React, { useState } from "react";

// Import EventDetailsModal at the top
import EventDetailsModal from "./EventDetailsModal";

const TrainerSlotsList = ({
  allTrainerSlots,
  onBookSlot,
  onNavigateToSlotMonth,
  onEditBooking,
  onDeleteBooking,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedBookslotId, setSelectedBookslotId] = useState(null);
  const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

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

  // Check if booking has ended
  const isBookingEnded = (endDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);
    return endDate < today;
  };

  // Check if slot has ended
  const isSlotEnded = (toDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const toDate = new Date(toDateStr);
    toDate.setHours(0, 0, 0, 0);
    return toDate < today;
  };

  // Get unique trainers for filter
  const uniqueTrainers = [
    ...new Map(
      allTrainerSlots.map((slot) => [
        slot.trainer_id,
        { id: slot.trainer_id, name: slot.fullname },
      ])
    ).values(),
  ];

  // Filter slots based on search and trainer selection
  const filteredSlots = allTrainerSlots.filter((slot) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      slot.fullname.toLowerCase().includes(searchLower) ||
      slot.email.toLowerCase().includes(searchLower) ||
      slot.status_label.toLowerCase().includes(searchLower) ||
      slot.from_date.includes(searchTerm) ||
      slot.to_date.includes(searchTerm) ||
      (slot.booked_details &&
        slot.booked_details.some(
          (booking) =>
            booking.institute_name?.toLowerCase().includes(searchLower) ||
            booking.domain_name?.toLowerCase().includes(searchLower) ||
            booking.event_type?.toLowerCase().includes(searchLower)
        ));

    const matchesTrainer =
      selectedTrainer === "all" ||
      slot.trainer_id.toString() === selectedTrainer;

    return matchesSearch && matchesTrainer;
  });

  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const currentSlots = filteredSlots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSlotExpansion = (slotId) => {
    setExpandedSlot(expandedSlot === slotId ? null : slotId);
  };

  const handleViewDetails = (booking, slot) => {
    setSelectedBookslotId(booking.bookslot_id);
    setSelectedBookingInfo({
      ...booking,
      trainer_name: slot.fullname,
      trainer_email: slot.email,
    });
    setShowEventDetails(true);
  };

  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedBookslotId(null);
    setSelectedBookingInfo(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          Trainer Availability
        </h3>
        <div className="flex items-center gap-3">
          <select
            value={selectedTrainer}
            onChange={(e) => {
              setSelectedTrainer(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Trainers</option>
            {uniqueTrainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id.toString()}>
                {trainer.name}
              </option>
            ))}
          </select>
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

      <div className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 overflow-y-auto">
          {currentSlots.map((slot) => {
            const slotEnded = isSlotEnded(slot.to_date);

            return (
              <div
                key={`${slot.trainer_id}-${slot.slot_id}`}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <div className="flex">
                  <div
                    className={`flex-1 p-4 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                      slot.status_code === 0
                        ? "border-l-4 border-l-green-500"
                        : "border-l-4 border-l-orange-500"
                    }`}
                    onClick={() =>
                      toggleSlotExpansion(`${slot.trainer_id}-${slot.slot_id}`)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-900">
                            {slot.fullname}
                          </span>
                          <span className="text-sm text-slate-600">
                            Slot #{slot.slot_id}
                          </span>
                          {!slotEnded && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                slot.status_code === 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {slot.status_code === 0 ? "Available" : "Booked"}
                            </span>
                          )}
                          {slotEnded && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Ended
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-medium text-slate-700 flex items-center gap-2">
                          {formatDateDisplay(slot.from_date)} to{" "}
                          {formatDateDisplay(slot.to_date)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToSlotMonth(slot.from_date);
                            }}
                            className="text-blue-500 hover:text-blue-700 text-sm px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            View on Calendar
                          </button>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {slot.email} • {slot.mobile_number}
                        </div>
                      </div>
                      <div className="ml-4">
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                            expandedSlot ===
                            `${slot.trainer_id}-${slot.slot_id}`
                              ? "rotate-180"
                              : ""
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
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center px-4 py-4 bg-slate-50 border-l border-slate-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookSlot(slot);
                      }}
                      disabled={slotEnded}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                        slotEnded
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
                      }`}
                    >
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {slotEnded ? "Slot Ended" : "Book Slot"}
                    </button>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedSlot === `${slot.trainer_id}-${slot.slot_id}`
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-slate-50 border-t border-slate-200">
                    {slot.booked_details &&
                    Array.isArray(slot.booked_details) &&
                    slot.booked_details.length > 0 ? (
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">
                          Booking Details ({slot.booked_details.length} booking
                          {slot.booked_details.length > 1 ? "s" : ""})
                        </h4>
                        <div className="max-h-64 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-100 sticky top-0">
                              <tr>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Institute
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Domain
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Event Type
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Booked Period
                                </th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {slot.booked_details.map((booking, index) => {
                                const bookingEnded = isBookingEnded(
                                  booking.end_date
                                );

                                return (
                                  <tr
                                    key={index}
                                    className="border-t border-slate-200 hover:bg-slate-50"
                                  >
                                    <td className="px-3 py-2 text-slate-800">
                                      {booking.institute_name}
                                    </td>
                                    <td className="px-3 py-2 text-slate-700">
                                      {booking.domain_name}
                                    </td>
                                    <td className="px-3 py-2 text-slate-700">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          bookingEnded
                                            ? "bg-gray-100 text-gray-800"
                                            : "bg-blue-100 text-blue-800"
                                        }`}
                                      >
                                        {booking.event_type
                                          ? booking.event_type
                                              .replace("_", " ")
                                              .toUpperCase()
                                          : "N/A"}
                                      </span>
                                      {bookingEnded && (
                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          Ended
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-slate-700">
                                      <div className="text-xs">
                                        {formatDateDisplay(booking.start_date)}{" "}
                                        to {formatDateDisplay(booking.end_date)}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(booking, slot);
                                          }}
                                          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/30 flex items-center gap-1"
                                          title="View Full Details"
                                        >
                                          <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                          </svg>
                                          Details
                                        </button>
                                        {!bookingEnded && booking.can_edit && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onEditBooking(booking, slot);
                                            }}
                                            className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-500/30 flex items-center gap-1"
                                            title="Edit Booking"
                                          >
                                            <svg
                                              className="w-3 h-3"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                              />
                                            </svg>
                                            Edit
                                          </button>
                                        )}
                                        {!bookingEnded &&
                                          booking.can_delete && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteBooking(booking);
                                              }}
                                              className="bg-gradient-to-br from-red-500 to-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-500/30 flex items-center gap-1"
                                              title="Delete Booking"
                                            >
                                              <svg
                                                className="w-3 h-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                              </svg>
                                              Delete
                                            </button>
                                          )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        {slotEnded
                          ? "This slot has ended"
                          : "This slot is fully available for booking"}
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
            No slots found matching your criteria.
          </div>
        )}

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

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showEventDetails}
        onClose={handleCloseEventDetails}
        bookslotId={selectedBookslotId}
        bookingInfo={selectedBookingInfo}
      />
    </div>
  );
};

export default TrainerSlotsList;
