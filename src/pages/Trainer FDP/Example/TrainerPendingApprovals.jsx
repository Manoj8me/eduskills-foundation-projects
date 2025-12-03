import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronDown, ChevronUp, MoreVertical, Check, X } from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";

const TrainerPendingApprovals = ({ refreshAvailability }) => {
  const [trainers, setTrainers] = useState([]);
  const [expandedTrainer, setExpandedTrainer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // === Fetch Pending Trainers ===
  const fetchPendingTrainers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/event/all-trainers-pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch pending trainers");
      const data = await res.json();
      setTrainers(data || []);
    } catch (err) {
      console.error("❌ Error fetching trainers:", err);
      alert("Failed to fetch trainer pending approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTrainers();
  }, []);

  // === Handle Approve / Reject ===
  const handleAction = async (availabilityId, status) => {
  setActionLoading(availabilityId);
  try {
    const payload = {
      availability_ids: [availabilityId],
      status: status, // 1 = Approve, 0 = Reject
    };

    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${BASE_URL}/event/trainer-availability/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to update status");
    const result = await response.json();

    alert(
      status === 1
        ? "✅ Slot approved successfully!"
        : "❌ Slot rejected successfully!"
    );

    // ✅ Refresh parent (Calendar) data immediately
    if (refreshAvailability) {
      await refreshAvailability();
    }

    // Refresh local pending list
    fetchPendingTrainers();
  } catch (err) {
    console.error("❌ Error updating status:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    setActionLoading(null);
  }
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* === Header === */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl shadow">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" /> Trainer Pending Approvals
        </h3>
      </div>

      {/* === Trainer List === */}
      <div className="divide-y divide-gray-200 bg-white rounded-b-2xl shadow">
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : trainers.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No pending approvals found.
          </div>
        ) : (
          trainers.map((trainer) => {
            const expanded = expandedTrainer === trainer.trainer_id;
            return (
              <div
                key={trainer.trainer_id}
                className="px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* === Trainer Row === */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedTrainer(expanded ? null : trainer.trainer_id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      {trainer.fullname}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{trainer.slots?.length || 0} date(s) pending</span>
                    {expanded ? (
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>

                {/* === Expandable Content === */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-visible mt-4 border-t border-gray-100 pt-4"

                    >
                      <table className="w-full text-sm text-left text-gray-700 mb-2">
                        <thead className="bg-gray-100 text-gray-800 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-3 w-3/4">Dates to Approve</th>
                            <th className="px-4 py-3 text-center w-1/4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {trainer.slots.map((slot) => (
                            <tr key={slot.availability_id} className="hover:bg-blue-50">
                              <td className="px-4 py-3">
                                {new Date(slot.available_date).toLocaleDateString("en-GB")}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="relative inline-block text-left">
                                  <details className="group">
                                    <summary className="list-none cursor-pointer flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600">
                                      <MoreVertical className="w-4 h-4" />
                                    </summary>
                                    <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-50 overflow-visible">
                                      <button
                                        onClick={() =>
                                          handleAction(slot.availability_id, 1)
                                        }
                                        disabled={actionLoading === slot.availability_id}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-green-600 hover:bg-green-50 text-sm"
                                      >
                                        <Check className="w-4 h-4" /> Approve
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleAction(slot.availability_id, 0)
                                        }
                                        disabled={actionLoading === slot.availability_id}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 text-sm"
                                      >
                                        <X className="w-4 h-4" /> Reject
                                      </button>
                                    </div>
                                  </details>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TrainerPendingApprovals;
