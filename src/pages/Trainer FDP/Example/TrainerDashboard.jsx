// with t1,t2
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  ListChecks,
  TrendingUp,
  ChevronDown,
  X,
} from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";

const TrainerDashboard = () => {
  const [trainers, setTrainers] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [trainerSearch, setTrainerSearch] = useState("");
  const [metrics, setMetrics] = useState({});
  const [chartData, setChartData] = useState([]);
  const [trainerKeys, setTrainerKeys] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

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

  // === Fetch Trainers + Filters ===
  const fetchFilters = async () => {
    try {
      const res = await api.get(`/event/trainers/list`);
      setTrainers(res.data.trainers || []);
      setYears(res.data.years || []);
      setMonths(res.data.months || []);
    } catch (err) {
      console.error("❌ Error fetching filters:", err);
    }
  };

  // === Fetch Dashboard Data ===
  const fetchDashboardData = async (customPayload = null) => {
    try {
      const payload =
        customPayload || {
          trainer_ids: [],
          years: [],
          months: [],
        };

      const res = await api.post(
        `/event/admin/dashboard/trainer-availability`,
        payload
      );

      const data = res.data || {};
      setMetrics(data.event_summary || {});

      const availability = data.trainer_availability || {};
      const formattedData = [];
      const trainerSet = new Set();

      Object.entries(availability).forEach(([trainer, monthData]) => {
        trainerSet.add(trainer);
        Object.entries(monthData).forEach(([monthName, stats]) => {
          let monthEntry = formattedData.find((d) => d.month === monthName);
          if (!monthEntry) {
            monthEntry = { month: monthName };
            formattedData.push(monthEntry);
          }

          const available = stats.available || 0;
          const booked = stats.booked || 0;
          const pending = stats.pending || 0;

          monthEntry[`${trainer}_available`] = available;
          monthEntry[`${trainer}_booked`] = booked;
          monthEntry[`${trainer}_pending`] = pending;
        });
      });

      setChartData(formattedData);
      setTrainerKeys(Array.from(trainerSet));
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
    }
  };

  // === Init Load ===
  useEffect(() => {
    const init = async () => {
      await fetchFilters();
      await fetchDashboardData();
    };
    init();
  }, []);

  // === Close all dropdowns ===
  const closeAllDropdowns = () => {
    setShowTrainerDropdown(false);
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  // === Apply Filters ===
  const applyFilters = async () => {
    closeAllDropdowns();
    const payload = {
      trainer_ids:
        selectedTrainers.length > 0
          ? trainers
            .filter((t) => selectedTrainers.includes(t.trainer_name))
            .map((t) => t.trainer_id)
          : [],
      years: selectedYears.map((y) => Number(y)),
      months: selectedMonths.map((m) => m.month_id),
    };
    await fetchDashboardData(payload);
  };

  // === Reset Filters ===
  const resetFilters = async () => {
    setSelectedYears([]);
    setSelectedMonths([]);
    setSelectedTrainers([]);
    closeAllDropdowns();
    await fetchDashboardData();
  };

  // === Tooltip (cleaned) ===
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    if (hoveredBar) {
      const match = payload.find(
        (p) => p.dataKey === `${hoveredBar.trainer}_${hoveredBar.type}`
      );
      if (!match) return null;

      const { trainer, type } = hoveredBar;
      const value = match.value ?? 0;

      const colorMap = {
        available: "text-green-600",
        booked: "text-blue-600",
        pending: "text-yellow-600",
      };

      const labelMap = {
        available: "Available Days (Total)",
        booked: "Booked Days",
        pending: "Pending Days",
      };

      return (
        <div className="bg-white border rounded-lg shadow p-2 text-sm">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          <p className="font-medium text-gray-800">{trainer}</p>
          <p className={`${colorMap[type]} text-xs`}>
            {labelMap[type]}: {value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-4 md:p-6 relative space-y-8">      
      {/* (Filters section stays unchanged) */}
      {/* === FILTERS === */}
      <div className="flex flex-wrap items-end gap-6">
        {/* Year Filter */}
        <div className="flex flex-col relative">
          <span className="font-semibold text-gray-700 mb-1">
            Filter by Year
          </span>

          <button
            onClick={() => {
              setShowYearDropdown(!showYearDropdown);
              setShowMonthDropdown(false);
              setShowTrainerDropdown(false);
            }}
            className="flex items-center justify-between gap-2 border px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow transition"
          >
            <span>
              {selectedYears.length > 0
                ? `${selectedYears.length} Selected`
                : "Select Years"}
            </span>
            <div className="flex items-center gap-2">
              {selectedYears.length > 0 && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {selectedYears.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </button>

          {showYearDropdown && (
            <div className="absolute z-20 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <button
                  className="text-xs text-blue-600"
                  onClick={() => setSelectedYears(years)}
                >
                  Select All
                </button>
                <button
                  className="text-xs text-red-500"
                  onClick={() => setSelectedYears([])}
                >
                  Clear
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {years.map((y) => (
                  <label key={y} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(y)}
                      onChange={() =>
                        setSelectedYears((prev) =>
                          prev.includes(y)
                            ? prev.filter((x) => x !== y)
                            : [...prev, y]
                        )
                      }
                    />
                    {y}
                  </label>
                ))}
              </div>

              <button
                onClick={() => setShowYearDropdown(false)}
                className="mt-3 w-full bg-gray-200 text-gray-700 py-1.5 rounded-md text-sm hover:bg-gray-300 flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
          )}
        </div>

        {/* Month Filter */}
        <div className="flex flex-col relative">
          <span className="font-semibold text-gray-700 mb-1">
            Filter by Month
          </span>

          <button
            onClick={() => {
              setShowMonthDropdown(!showMonthDropdown);
              setShowYearDropdown(false);
              setShowTrainerDropdown(false);
            }}
            className="flex items-center justify-between gap-2 border px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow transition"
          >
            <span>
              {selectedMonths.length > 0
                ? `${selectedMonths.length} Selected`
                : "Select Months"}
            </span>
            <div className="flex items-center gap-2">
              {selectedMonths.length > 0 && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {selectedMonths.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </button>

          {showMonthDropdown && (
            <div className="absolute z-20 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <button
                  className="text-xs text-blue-600"
                  onClick={() => setSelectedMonths(months)}
                >
                  Select All
                </button>
                <button
                  className="text-xs text-red-500"
                  onClick={() => setSelectedMonths([])}
                >
                  Clear
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {months.map((m) => (
                  <label key={m.month_id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedMonths.some(
                        (sel) => sel.month_id === m.month_id
                      )}
                      onChange={() =>
                        setSelectedMonths((prev) =>
                          prev.some((sel) => sel.month_id === m.month_id)
                            ? prev.filter((x) => x.month_id !== m.month_id)
                            : [...prev, m]
                        )
                      }
                    />
                    {m.month_name}
                  </label>
                ))}
              </div>

              <button
                onClick={() => setShowMonthDropdown(false)}
                className="mt-3 w-full bg-gray-200 text-gray-700 py-1.5 rounded-md text-sm hover:bg-gray-300 flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
          )}
        </div>

        {/* Trainer Filter */}
        <div className="flex flex-col relative">
          <span className="font-semibold text-gray-700 mb-1">
            Filter by Trainer
          </span>

          <button
            onClick={() => {
              setShowTrainerDropdown(!showTrainerDropdown);
              setShowMonthDropdown(false);
              setShowYearDropdown(false);
            }}
            className="flex items-center justify-between gap-2 border px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow transition"
          >
            <span>
              {selectedTrainers.length > 0
                ? `${selectedTrainers.length} Selected`
                : "Select Trainers"}
            </span>
            <div className="flex items-center gap-2">
              {selectedTrainers.length > 0 && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {selectedTrainers.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </button>

          {showTrainerDropdown && (
            <div className="absolute z-20 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3">
              <input
                type="text"
                placeholder="Search trainer..."
                value={trainerSearch}
                onChange={(e) => setTrainerSearch(e.target.value)}
                className="w-full border px-2 py-1 rounded-md text-sm mb-2 focus:outline-none focus:ring focus:ring-blue-200"
              />

              <div className="flex justify-between items-center mb-2">
                <button
                  className="text-xs text-blue-600"
                  onClick={() =>
                    setSelectedTrainers(trainers.map((t) => t.trainer_name))
                  }
                >
                  Select All
                </button>
                <button
                  className="text-xs text-red-500"
                  onClick={() => setSelectedTrainers([])}
                >
                  Clear
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {trainers
                  .filter((t) =>
                    t.trainer_name
                      .toLowerCase()
                      .includes(trainerSearch.toLowerCase())
                  )
                  .map((t) => (
                    <label
                      key={t.trainer_id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTrainers.includes(t.trainer_name)}
                        onChange={() =>
                          setSelectedTrainers((prev) =>
                            prev.includes(t.trainer_name)
                              ? prev.filter((x) => x !== t.trainer_name)
                              : [...prev, t.trainer_name]
                          )
                        }
                      />
                      {t.trainer_name}
                    </label>
                  ))}
              </div>

              <button
                onClick={() => setShowTrainerDropdown(false)}
                className="mt-3 w-full bg-gray-200 text-gray-700 py-1.5 rounded-md text-sm hover:bg-gray-300 flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
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
      </div>



      {/* === METRICS === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: "Available Days",
            value: metrics.available_days,
            icon: <CheckCircle className="text-green-600" />,
            color: "bg-green-50",
          },
          {
            label: "Booked Days",
            value: metrics.booked_days,
            icon: <Calendar className="text-blue-600" />,
            color: "bg-blue-50",
          },
          {
            label: "Completed Events",
            value: metrics.completed_events,
            icon: <ListChecks className="text-purple-600" />,
            color: "bg-purple-50",
          },
          {
            label: "Upcoming Events",
            value: metrics.upcoming_events,
            icon: <TrendingUp className="text-yellow-600" />,
            color: "bg-yellow-50",
          },
        ].map((m, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`p-4 md:p-5 rounded-2xl shadow ${m.color} border flex flex-col items-center justify-center text-center gap-2`}
          >
            <div className="p-2 bg-white rounded-full shadow shrink-0">
              {m.icon}
            </div>
            <div className="w-full">
              <h4 className="text-sm text-gray-700">{m.label}</h4>
              <p className="text-lg md:text-xl font-bold text-gray-800">
                {m.value ?? 0}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === MULTI TRAINER STACKED GRAPH === */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow border mt-8">
        <h3 className="font-semibold mb-4 text-gray-800 text-center md:text-left">
          Trainer Availability Breakdown
        </h3>

        <ResponsiveContainer width="100%" height={430}>
          <BarChart
            data={chartData}
            margin={{ top: 40, right: 20, left: 0, bottom: 60 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />

            {/* === MAIN LEGEND === */}
            <Legend
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{ marginTop: "10px" }}
              payload={[
                { value: "Available", type: "square", color: "#22c55e" },
                { value: "Booked", type: "square", color: "#3b82f6" },
                { value: "Pending", type: "square", color: "#eab308" },
              ]}
            />

            {/* === TRAINER LEGEND BELOW === */}
            {trainerKeys.length > 0 && (
              <foreignObject x="0" y="370" width="100%" height="60">
                <div className="mt-2 text-center text-xs sm:text-sm text-gray-700">
                  <div className="font-semibold mb-1">Trainer Legend</div>
                  <div className="flex justify-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-md border text-gray-800 inline-block">
                      <strong>T(number)</strong> — Trainer number (e.g., T1 =
                      Trainer 1, T2 = Trainer 2, ...)
                    </span>
                  </div>
                </div>
              </foreignObject>
            )}

            {/* === TRAINER BARS + LABELS === */}
            {trainerKeys.map((trainer, idx) => (
              <React.Fragment key={trainer}>
                <Bar
                  dataKey={`${trainer}_pending`}
                  stackId={`trainer_${idx}`}
                  fill="#eab308"
                  onMouseOver={() =>
                    setHoveredBar({ trainer, type: "pending" })
                  }
                  onMouseOut={() => setHoveredBar(null)}
                />
                <Bar
                  dataKey={`${trainer}_booked`}
                  stackId={`trainer_${idx}`}
                  fill="#3b82f6"
                  onMouseOver={() =>
                    setHoveredBar({ trainer, type: "booked" })
                  }
                  onMouseOut={() => setHoveredBar(null)}
                />
                <Bar
                  dataKey={`${trainer}_available`}
                  stackId={`trainer_${idx}`}
                  fill="#22c55e"
                  onMouseOver={() =>
                    setHoveredBar({ trainer, type: "available" })
                  }
                  onMouseOut={() => setHoveredBar(null)}
                  label={(props) => {
                    const { x, width, y, index } = props;
                    const monthData = chartData[index];
                    const available =
                      monthData?.[`${trainer}_available`] || 0;
                    const booked = monthData?.[`${trainer}_booked`] || 0;
                    const pending = monthData?.[`${trainer}_pending`] || 0;

                    if (available === 0 && booked === 0 && pending === 0)
                      return null;

                    const label = `T${idx + 1}`;
                    const fontSize =
                      window.innerWidth < 480
                        ? 8
                        : window.innerWidth < 768
                          ? 10
                          : 12;

                    return (
                      <text
                        x={x + width / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fill="#333"
                        fontSize={fontSize}
                        fontWeight="600"
                      >
                        {label}
                      </text>
                    );
                  }}
                />
              </React.Fragment>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrainerDashboard;
