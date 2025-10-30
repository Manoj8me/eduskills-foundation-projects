import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Users, CheckCircle, Clock, AlertCircle, Building2 } from "lucide-react";
import BookedDetailsList from "./BookedDetailedList";
import { motion } from "framer-motion";
import StaticBookedDetails from "./StaticBookedDetails";

// ---- mock data ----
const monthData = [
  { month: "Aug", count: 20 },
  { month: "Sep", count: 35 },
  { month: "Oct", count: 28 },
];

const trainerData = [
  { name: "Trainer A", count: 12 },
  { name: "Trainer B", count: 8 },
  { name: "Trainer C", count: 5 },
];

// ---- dashboard metric cards ----
const metrics = [
  { label: "Completed FDP", value: 45, icon: <CheckCircle className="text-green-600" />, color: "bg-green-50" },
  { label: "Ongoing FDP", value: 12, icon: <Clock className="text-blue-600" />, color: "bg-blue-50" },
  { label: "Upcoming FDP", value: 9, icon: <AlertCircle className="text-yellow-600" />, color: "bg-yellow-50" },
  { label: "Educators Trained", value: 340, icon: <Users className="text-indigo-600" />, color: "bg-indigo-50" },
  { label: "Educators Failed", value: 18, icon: <Users className="text-red-600" />, color: "bg-red-50" },
  { label: "Dropouts", value: 7, icon: <Users className="text-gray-600" />, color: "bg-gray-50" },
  { label: "Hosted Institutes", value: 22, icon: <Building2 className="text-teal-600" />, color: "bg-teal-50" },
  { label: "Participated Institutes", value: 58, icon: <Building2 className="text-purple-600" />, color: "bg-purple-50" },
];

const FdpDashboard = ({ bookedDetails, onBookingDeleted }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const domains = ["All", "AI", "Cloud", "Cybersecurity", "IoT", "Blockchain"];

  return (
    <div className="p-6">
      {/* ---- Tabs ---- */}
      <div className="flex gap-4 border-b mb-6">
        {["dashboard", "bookings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "dashboard" ? "Dashboard" : "Booking Details"}
          </button>
        ))}
      </div>

      {/* ---- Dashboard Content ---- */}
      {activeTab === "dashboard" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* ---- Filters ---- */}
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-700">Filter by Domain:</h3>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {domains.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* ---- Metric Cards ---- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className={`p-5 rounded-2xl shadow-md ${m.color} border border-gray-200 flex items-center gap-4`}
              >
                <div className="p-2 bg-white rounded-full shadow">{m.icon}</div>
                <div>
                  <h4 className="text-sm text-gray-600">{m.label}</h4>
                  <p className="text-xl font-bold text-gray-800">{m.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ---- Graphs ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthwise FDPs */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-800">Month-wise FDPs (Last 3 Months)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Trainer-wise FDPs */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-800">Trainer-wise FDP Count</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trainerData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- Booking Details Tab ---- */}
      {activeTab === "bookings" && (
        <StaticBookedDetails          
          eventTypeFilter="fdp"
        />
      )}
    </div>
  );
};

export default FdpDashboard;
