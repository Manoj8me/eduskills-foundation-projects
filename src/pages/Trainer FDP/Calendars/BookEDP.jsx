import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../services/configUrls";

const BookEDP = ({
  isOpen,
  onClose,
  availabilities,
  onSuccess,
  selectedAvailabilities,
  selectedDatesCount = 0, // Add this prop to show the actual count
  trainerId,
}) => {
  const [formData, setFormData] = useState({
    state_id: "",
    institute_id: "",
    domain_id: "",
    total_faculty_limit: "",
  });
  const [states, setStates] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      fetchDomainsInstitutesStates();
    }
  }, [isOpen]);

  const fetchDomainsInstitutesStates = async () => {
    try {
      setFetchingData(true);

      const currentTrainerId =
        trainerId ||
        Cookies.get("trainer_id") ||
        localStorage.getItem("trainerId") ||
        localStorage.getItem("userId");

      if (!currentTrainerId) {
        alert("Trainer ID not found. Please refresh the page.");
        return;
      }

      const response = await api.get(
        `${BASE_URL}/event/domains-institutes/${currentTrainerId}`
      );

      setDomains(response.data.domains || []);
      setInstitutes(response.data.institutes || []);
      setStates(response.data.states || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch domains, institutes, and states");
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDatesCount === 0) {
      alert("Please select at least one available date from the calendar");
      return;
    }

    if (
      !formData.state_id ||
      !formData.institute_id ||
      !formData.domain_id ||
      !formData.total_faculty_limit
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const currentTrainerId =
        trainerId ||
        Cookies.get("trainer_id") ||
        localStorage.getItem("trainerId") ||
        localStorage.getItem("userId");

      if (!currentTrainerId) {
        alert("Trainer ID not found. Please refresh the page.");
        return;
      }

      const payload = {
        trainer_id: parseInt(currentTrainerId),
        domain_id: parseInt(formData.domain_id),
        availability_ids: selectedAvailabilities,
        event_type: "edp",
        total_faculty_limit: parseInt(formData.total_faculty_limit),
      };

      console.log("Booking EDP with payload:", payload);

      const response = await api.post(`${BASE_URL}/event/book-edp`, payload);

      alert(response?.data?.message || "EDP booked successfully!");

      setFormData({
        state_id: "",
        institute_id: "",
        domain_id: "",
        total_faculty_limit: "",
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error booking EDP:", error);
      const errorMessage = error.response?.data?.detail || "Failed to book EDP";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredInstitutes = formData.state_id
    ? institutes.filter(
        (institute) => institute.state_id === parseInt(formData.state_id)
      )
    : [];

  // Use selectedDatesCount prop if provided, otherwise fall back to selectedAvailabilities length
  const displayCount =
    selectedDatesCount > 0 ? selectedDatesCount : selectedAvailabilities.length;

  return (
    <div className="bg-white rounded-lg shadow-xl p-5 border-2 border-purple-300 h-fit animate-slideInRight">
      {/* Header */}
      <div className="mb-5 pb-4 border-b border-purple-200">
        <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          EDP Booking Form
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selected Dates Badge */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-3">
          <div className="text-xs text-purple-700 font-medium mb-1">
            Selected Dates
          </div>
          <div className="text-2xl font-bold text-purple-900 text-center">
            {displayCount}
          </div>
        </div>

        {/* State Dropdown */}
        <div>
          <label
            htmlFor="state_id"
            className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"
          >
            State *
          </label>
          <select
            id="state_id"
            name="state_id"
            value={formData.state_id}
            onChange={handleInputChange}
            required
            disabled={fetchingData}
            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {fetchingData ? "Loading..." : "Select State"}
            </option>
            {states.map((state) => (
              <option key={state.state_id} value={state.state_id}>
                {state.state_name}
              </option>
            ))}
          </select>
        </div>

        {/* Institute Dropdown */}
        <div>
          <label
            htmlFor="institute_id"
            className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"
          >
            Institute *
          </label>
          <select
            id="institute_id"
            name="institute_id"
            value={formData.institute_id}
            onChange={handleInputChange}
            required
            disabled={!formData.state_id || fetchingData}
            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {fetchingData
                ? "Loading..."
                : formData.state_id
                ? "Select Institute"
                : "Select state first"}
            </option>
            {filteredInstitutes.map((institute) => (
              <option
                key={institute.institute_id}
                value={institute.institute_id}
              >
                {institute.institute_name}
              </option>
            ))}
          </select>
        </div>

        {/* Domain Dropdown */}
        <div>
          <label
            htmlFor="domain_id"
            className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"
          >
            Domain *
          </label>
          <select
            id="domain_id"
            name="domain_id"
            value={formData.domain_id}
            onChange={handleInputChange}
            required
            disabled={fetchingData}
            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {fetchingData ? "Loading..." : "Select Domain"}
            </option>
            {domains.map((domain) => (
              <option key={domain.domain_id} value={domain.domain_id}>
                {domain.domain_name}
              </option>
            ))}
          </select>
        </div>

        {/* Total Faculty Input */}
        <div>
          <label
            htmlFor="total_faculty_limit"
            className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide"
          >
            Total Faculty *
          </label>
          <input
            type="number"
            id="total_faculty_limit"
            name="total_faculty_limit"
            value={formData.total_faculty_limit}
            onChange={handleInputChange}
            required
            min="1"
            placeholder="Enter count"
            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading || selectedDatesCount === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                BOOKING...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                CONFIRM BOOKING
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookEDP;
