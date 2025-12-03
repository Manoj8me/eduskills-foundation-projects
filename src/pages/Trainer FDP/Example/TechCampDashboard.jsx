import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, CheckCircle, Clock, AlertCircle, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";
import StaticBookedDetails from "./StaticBookedDetails";
import { BASE_URL } from "../../../services/configUrls";
import axios from "axios";

const TechCampDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- Filters ---
  const [domains, setDomains] = useState([]);
  const [states, setStates] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(""); // "domain", "state", "institute", "year", "month"
  const [domainSearch, setDomainSearch] = useState("");
  const [instituteSearch, setInstituteSearch] = useState("");
  const [monthSearch, setMonthSearch] = useState("");

  const [metrics, setMetrics] = useState({});
  const [trainerData, setTrainerData] = useState([]);

  const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchFilters = async () => {
    try {
      const res = await api.get(`/event/filter/domains-institutes`);
      setDomains(res.data.domains || []);
      setStates(res.data.states || []);
      setInstitutes(res.data.active_institutes || []);
      setYears(res.data.years || []);
      setMonths(res.data.months || []);
    } catch (err) {
      console.error("❌ Error fetching filters:", err);
      if (err.response?.status === 401) alert("Session expired. Please log in again.");
    }
  };

  const fetchAnalytics = async (domainIds = [], stateId = null, instituteIds = [], yearIds = [], monthIds = []) => {
    try {
      const payload = {
        event_type: "tech_camp",
        domain_ids: domainIds,
        institute_ids: instituteIds,
        years: yearIds,
        months: monthIds,
      };
      if (stateId) payload.state_ids = [stateId];

      const res = await api.post(`/event/analytics/domain-summary`, payload);
      const summary = res.data.summary || {};

      setMetrics({
        total: summary.total || 0,
        completed: summary.completed || 0,
        ongoing: summary.ongoing || 0,
        upcoming: summary.upcoming || 0,
        trained: summary.trained || 0,
        dropout: summary.dropout || 0,
      });

      setTrainerData(
        (res.data.trainerwise_summary || []).map((t) => ({
          name: t.trainer,
          count: t.completed_count,
        }))
      );
    } catch (err) {
      console.error("❌ Error fetching analytics:", err);
      if (err.response?.status === 401) alert("Session expired. Please log in again.");
    }
  };

  useEffect(() => {
    fetchFilters();
    fetchAnalytics();
  }, []);

  const filteredInstitutes = selectedState
    ? institutes.filter(
        (i) => i.state_id === states.find((s) => s.state_name === selectedState)?.state_id
      )
    : [];

  const applyFilters = () => {
    const domainIds = domains
      .filter((d) => selectedDomains.includes(d.domain_name))
      .map((d) => d.domain_id);

    const instituteIds = institutes
      .filter((i) => selectedInstitutes.includes(i.institute_name))
      .map((i) => i.institute_id);

    const yearIds = selectedYears.length ? selectedYears.map(Number) : [];
    const monthIds = selectedMonths.length
      ? months.filter((m) => selectedMonths.includes(m.month_name)).map((m) => m.month_id)
      : [];

    const stateObj = states.find((s) => s.state_name === selectedState);
    const stateId = stateObj ? stateObj.state_id : null;

    setOpenDropdown("");
    fetchAnalytics(domainIds, stateId, instituteIds, yearIds, monthIds);
  };

  const resetFilters = () => {
    setSelectedDomains([]);
    setSelectedInstitutes([]);
    setSelectedState("");
    setSelectedYears([]);
    setSelectedMonths([]);
    setOpenDropdown("");
    fetchAnalytics();
  };

  return (
    <div className="p-4 md:p-6 relative">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b mb-6">
        {["dashboard", "bookings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab === "dashboard" ? "Dashboard" : "Booking Details"}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4 md:gap-6">
            {/* Domain */}
            <FilterDropdown
              label="Domain"
              items={domains}
              selected={selectedDomains}
              setSelected={setSelectedDomains}
              search={domainSearch}
              setSearch={setDomainSearch}
              keyName="domain_name"
              isOpen={openDropdown === "domain"}
              setOpen={() => setOpenDropdown(openDropdown === "domain" ? "" : "domain")}
            />
            {/* State */}
            <SingleSelectDropdown
              label="State"
              items={states}
              selected={selectedState}
              setSelected={setSelectedState}
              keyName="state_name"
              isOpen={openDropdown === "state"}
              setOpen={() => setOpenDropdown(openDropdown === "state" ? "" : "state")}
            />
            {/* Institute */}
            <FilterDropdown
              label="Institute"
              items={filteredInstitutes}
              selected={selectedInstitutes}
              setSelected={setSelectedInstitutes}
              search={instituteSearch}
              setSearch={setInstituteSearch}
              keyName="institute_name"
              disabled={!selectedState}
              isOpen={openDropdown === "institute"}
              setOpen={() => setOpenDropdown(openDropdown === "institute" ? "" : "institute")}
            />
            {/* Year */}
            <FilterDropdown
              label="Year"
              items={years}
              selected={selectedYears}
              setSelected={setSelectedYears}
              isOpen={openDropdown === "year"}
              setOpen={() => setOpenDropdown(openDropdown === "year" ? "" : "year")}
            />
            {/* Month */}
            <FilterDropdown
              label="Month"
              items={months}
              selected={selectedMonths}
              setSelected={setSelectedMonths}
              search={monthSearch}
              setSearch={setMonthSearch}
              keyName="month_name"
              isOpen={openDropdown === "month"}
              setOpen={() => setOpenDropdown(openDropdown === "month" ? "" : "month")}
            />

            <button
              onClick={applyFilters}
              className="h-[42px] bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="h-[42px] bg-gray-500 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-600 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Metrics */}
          <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 items-start">
            {[
              { label: "Total", value: metrics.total, icon: <CheckCircle className="text-purple-600" />, color: "bg-purple-50" },
              { label: "Completed", value: metrics.completed, icon: <CheckCircle className="text-green-600" />, color: "bg-green-50" },
              { label: "Ongoing", value: metrics.ongoing, icon: <Clock className="text-blue-600" />, color: "bg-blue-50" },
              { label: "Upcoming", value: metrics.upcoming, icon: <AlertCircle className="text-yellow-600" />, color: "bg-yellow-50" },
              { label: "Students Trained", value: metrics.trained, icon: <Users className="text-indigo-600" />, color: "bg-indigo-50" },
              { label: "Students Dropouts", value: metrics.dropout, icon: <Users className="text-gray-600" />, color: "bg-gray-50" },
            ].map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className={`p-4 md:p-5 rounded-2xl shadow ${m.color} border flex flex-col items-center justify-center text-center gap-2`}
              >
                <div className="p-2 bg-white rounded-full shadow shrink-0">{m.icon}</div>
                <div className="w-full">
                  <h4 className="text-sm text-gray-700 whitespace-normal leading-snug">{m.label}</h4>
                  <p className="text-lg md:text-xl font-bold text-gray-800">{m.value ?? 0}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trainer Graph */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow border mt-6">
            <h3 className="font-semibold mb-4 text-gray-800 text-center md:text-left">
              Trainer-wise TechCamp Count
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trainerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Bookings */}
      {activeTab === "bookings" && <StaticBookedDetails eventTypeFilter="tech_camp" />}
    </div>
  );
};

// === Multi-select Dropdown ===
const FilterDropdown = ({ label, items, selected, setSelected, search, setSearch, keyName, disabled = false, isOpen, setOpen }) => {
  const toggleItem = (item) => {
    if (keyName) {
      setSelected((prev) =>
        prev.includes(item[keyName])
          ? prev.filter((x) => x !== item[keyName])
          : [...prev, item[keyName]]
      );
    } else {
      setSelected((prev) =>
        prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
      );
    }
  };

  const filteredItems = keyName
    ? items.filter((i) => i[keyName].toLowerCase().includes((search || "").toLowerCase()))
    : items;

  return (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-700 mb-1">Filter by {label}:</span>
      <div className="relative">
        <button
          onClick={setOpen}
          disabled={disabled}
          className={`flex items-center gap-2 border px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow transition ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <span>{label}</span>
          {selected.length > 0 && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {selected.length}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-20 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3">
            {keyName && (
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border px-2 py-1 rounded-md text-sm mb-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            )}
            <div className="flex justify-between items-center mb-2">
              <button className="text-xs text-blue-600" onClick={() => setSelected(items.map((i) => (keyName ? i[keyName] : i)))}>
                Select All
              </button>
              <button className="text-xs text-red-500" onClick={() => setSelected([])}>
                Clear
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredItems.map((item, i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={keyName ? selected.includes(item[keyName]) : selected.includes(item)}
                    onChange={() => toggleItem(item)}
                  />
                  {keyName ? item[keyName] : item}
                </label>
              ))}
            </div>
            <button
              onClick={() => setOpen()}
              className="mt-3 w-full bg-gray-200 text-gray-700 py-1.5 rounded-md text-sm hover:bg-gray-300 flex items-center justify-center gap-1"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// === Single-select Dropdown ===
const SingleSelectDropdown = ({ label, items, selected, setSelected, keyName, isOpen, setOpen }) => {
  const [search, setSearch] = useState("");

  const filteredItems = keyName
    ? items.filter((i) => i[keyName].toLowerCase().includes((search || "").toLowerCase()))
    : items;

  return (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-700 mb-1">Filter by {label}:</span>
      <div className="relative">
        <button onClick={setOpen} className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow transition">
          <span>{selected || label}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-2 py-1 rounded-md text-sm mb-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => { setSelected(item[keyName]); setOpen(); }}
                  className={`px-2 py-1 rounded hover:bg-blue-100 cursor-pointer ${selected === item[keyName] ? "bg-blue-100 font-semibold" : ""}`}
                >
                  {item[keyName]}
                </div>
              ))}
            </div>
            <button
              onClick={() => setOpen()}
              className="mt-3 w-full bg-gray-200 text-gray-700 py-1.5 rounded-md text-sm hover:bg-gray-300 flex items-center justify-center gap-1"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechCampDashboard;
