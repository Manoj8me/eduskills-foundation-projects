import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const StaticBookedDetails = ({ eventTypeFilter = null, hideColumns = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(5);

  // ===== 🌟 Static Sample Bookings =====
  const bookedDetails = [
    {
      bookslot_id: 1,
      domain_name: "AI and Machine Learning",
      institute_name: "Tech University",
      rm_name: "Rajesh Kumar",
      rm_email: "rajesh@techuni.edu",
      start_date: "2025-11-01",
      end_date: "2025-11-05",
      event_type: "tech_camp",
      event_status: "Upcoming",
      students_limit: 60,
      fdp_limit: null,
    },
    {
      bookslot_id: 2,
      domain_name: "Data Science Bootcamp",
      institute_name: "IIT Delhi",
      rm_name: "Sonal Mehta",
      rm_email: "sonal@iitd.ac.in",
      start_date: "2025-10-10",
      end_date: "2025-10-14",
      event_type: "tech_camp",
      event_status: "Completed",
      students_limit: 45,
      fdp_limit: null,
    },
    {
      bookslot_id: 3,
      domain_name: "Faculty Skill Development",
      institute_name: "Anna University",
      rm_name: "Vikram S",
      rm_email: "vikram@annauniv.edu",
      start_date: "2025-11-15",
      end_date: "2025-11-20",
      event_type: "fdp",
      event_status: "Upcoming",
      students_limit: null,
      fdp_limit: 30,
    },
    {
      bookslot_id: 4,
      domain_name: "Digital Transformation",
      institute_name: "BITS Pilani",
      rm_name: "Neha Sharma",
      rm_email: "neha@bits.edu",
      start_date: "2025-09-12",
      end_date: "2025-09-16",
      event_type: "edp",
      event_status: "Completed",
      students_limit: 40,
      fdp_limit: null,
    },
    {
      bookslot_id: 5,
      domain_name: "Blockchain Essentials",
      institute_name: "SRM University",
      rm_name: "Karthik Raja",
      rm_email: "karthik@srm.edu",
      start_date: "2025-12-05",
      end_date: "2025-12-09",
      event_type: "fdp",
      event_status: "Upcoming",
      students_limit: null,
      fdp_limit: 25,
    },
  ];

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
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getParticipantLimit = (booking) =>
    booking.event_type === "fdp" ? booking.fdp_limit : booking.students_limit;

  const filteredBookings = useMemo(() => {
    let filtered = bookedDetails;
    if (eventTypeFilter) {
      filtered = filtered.filter((b) => b.event_type === eventTypeFilter);
    }
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.domain_name.toLowerCase().includes(lower) ||
          b.institute_name.toLowerCase().includes(lower) ||
          b.rm_name.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [bookedDetails, searchTerm, eventTypeFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // ===== 🧱 Define columns dynamically =====
  const columns = [
    { key: "domain_name", label: "Domain" },
    { key: "institute_name", label: "Institute" },
    { key: "rm_name", label: "RM Name" },
    { key: "rm_email", label: "RM Email" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
  ].filter((col) => !hideColumns.includes(col.key)); // 👈 hide specified columns

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBookings.length > 0 ? (
              currentBookings.map((b, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((col) => {
                    switch (col.key) {
                      case "domain_name":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-800">
                            {b.domain_name}
                          </td>
                        );
                      case "institute_name":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-800">
                            {b.institute_name}
                          </td>
                        );
                      case "rm_name":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-800">
                            {b.rm_name}
                          </td>
                        );
                      case "rm_email":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-600">
                            {b.rm_email}
                          </td>
                        );
                      case "start_date":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(b.start_date)}
                          </td>
                        );
                      case "end_date":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(b.end_date)}
                          </td>
                        );
                      case "participants":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-600 text-center">
                            {getParticipantLimit(b)}
                          </td>
                        );
                      case "status":
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                b.event_status
                              )}`}
                            >
                              {b.event_status}
                            </span>
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
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
