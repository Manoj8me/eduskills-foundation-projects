import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";
import FDPAttendanceModal from "./FDPAttendanceModal";

const EDPEvent = ({ bookings = [], setCurrentDate, onBookEDPClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [fdpModalOpen, setFdpModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const api = axios.create({
    baseURL: "",
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

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Invalid Date";
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

    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const getStatusInfo = (eventStatus) => {
    const status = eventStatus?.toLowerCase();
    switch (status) {
      case "upcoming":
      case "started":
        return {
          label: eventStatus,
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          showActions: true,
        };
      case "ongoing":
        return {
          label: "Ongoing",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          showActions: false,
        };
      case "completed":
      case "closed":
        return {
          label: eventStatus,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          showActions: true,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          showActions: false,
        };
      default:
        return {
          label: eventStatus || "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          showActions: false,
        };
    }
  };

  const getTypeInfo = (eventType) => {
    const type = eventType?.toLowerCase();
    switch (type) {
      case "fdp":
        return {
          label: "FDP",
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
        };
      case "edp":
      case "tech_camp":
        return {
          label: "EDP",
          bgColor: "bg-cyan-100",
          textColor: "text-cyan-700",
        };
      default:
        return {
          label: eventType?.replace(/_/g, " ") || "N/A",
          bgColor: "bg-slate-100",
          textColor: "text-slate-700",
        };
    }
  };

  const isFdpEvent = (eventType) => {
    return eventType?.toLowerCase() === "fdp";
  };

  const handleViewDetails = (booking) => {
    const eventType = booking.event_type?.toLowerCase();
    if (
      eventType === "fdp" ||
      eventType === "edp" ||
      eventType === "tech_camp"
    ) {
      setSelectedBookingId(booking.bookslot_id);
      setFdpModalOpen(true);
    } else {
      if (booking.bookslot_id) {
        navigate(`/att/${booking.bookslot_id}`);
      }
    }
    setOpenMenuIndex(null);
  };

  const toggleMenu = (index, event) => {
    event.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const filteredBookings = bookings.filter((booking) => {
    const isEDP =
      booking.event_type?.toLowerCase() === "tech_camp" ||
      booking.event_type?.toLowerCase() === "edp";

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      booking.domain_name?.toLowerCase().includes(searchLower) ||
      booking.institute_name?.toLowerCase().includes(searchLower) ||
      booking.event_status?.toLowerCase().includes(searchLower) ||
      booking.start_date?.includes(searchTerm) ||
      booking.end_date?.includes(searchTerm);

    return isEDP && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm w-full px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">EDP Bookings</h2>
        <button
          onClick={onBookEDPClick}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
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
          Book EDP
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by domain, institute, status, or date..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Domain
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Institute
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Start Date
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                End Date
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Event Type
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Status
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Participants
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Certificate
              </th>
              <th className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length > 0 ? (
              currentBookings.map((booking, index) => {
                const statusInfo = getStatusInfo(booking.event_status);
                const typeInfo = getTypeInfo(booking.event_type);
                const isFdp = isFdpEvent(booking.event_type);
                const participantsAdded = isFdp
                  ? booking.faculty_added || 0
                  : booking.students_added || 0;
                const participantsLimit = isFdp
                  ? booking.faculty_limit || 0
                  : booking.students_limit || 0;

                return (
                  <tr
                    key={index}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2 text-slate-800">
                      <div
                        className="max-w-[200px] truncate font-medium"
                        title={booking.domain_name}
                      >
                        {booking.domain_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <div
                        className="max-w-[150px] truncate"
                        title={booking.institute_name}
                      >
                        {booking.institute_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                      {formatDateDisplay(booking.start_date)}
                    </td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                      {formatDateDisplay(booking.end_date)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${typeInfo.bgColor} ${typeInfo.textColor}`}
                      >
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <span className="font-medium">{participantsAdded}</span>
                      <span className="text-slate-400">
                        /{participantsLimit}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {booking.certificate_issue === 1 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="relative">
                        {statusInfo.showActions ? (
                          <>
                            <button
                              onClick={(e) => toggleMenu(index, e)}
                              id={`menu-btn-${index}`}
                              className="p-1 hover:bg-slate-200 rounded transition-colors relative z-0"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-600" />
                            </button>

                            {openMenuIndex === index && (
                              <>
                                <div
                                  className="fixed inset-0 z-[100]"
                                  onClick={() => setOpenMenuIndex(null)}
                                />
                                <div
                                  className="fixed w-40 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-[101]"
                                  style={{
                                    top: `${
                                      document
                                        .getElementById(`menu-btn-${index}`)
                                        ?.getBoundingClientRect().bottom + 4
                                    }px`,
                                    left: `${
                                      document
                                        .getElementById(`menu-btn-${index}`)
                                        ?.getBoundingClientRect().right - 160
                                    }px`,
                                  }}
                                >
                                  <button
                                    onClick={() => handleViewDetails(booking)}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                                  >
                                    Take Attendance
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-3 py-6 text-center text-slate-500 text-xs"
                >
                  No EDP bookings found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="text-slate-600">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{" "}
            {filteredBookings.length}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                  className={`px-2 py-1 rounded ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 bg-white border border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <FDPAttendanceModal
        open={fdpModalOpen}
        onClose={() => {
          setFdpModalOpen(false);
          setSelectedBookingId(null);
        }}
        bookslotId={selectedBookingId}
      />
    </div>
  );
};

export default EDPEvent;
