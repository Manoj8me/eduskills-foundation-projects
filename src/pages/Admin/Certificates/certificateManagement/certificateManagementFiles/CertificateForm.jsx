import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BASE_URL } from "../../../../../services/configUrls";
import { useNavigate } from "react-router-dom";

const CertificateForm = ({ onCancel, onCreateDone }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    certificateName: "",
    activity: "",
    orientation: "portrait",
    issueDate: "",
    validityDate: "",
    variableInput: "",
    variables: [],
    isActive: false,
  });

  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activities, setActivities] = useState([]);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load activities
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/get-activities`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to load activities");

      setActivities(data || []);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addVariable = () => {
    if (!formData.variableInput.trim()) return;
    setFormData({
      ...formData,
      variables: [...formData.variables, formData.variableInput.trim()],
      variableInput: "",
    });
  };

  const removeVariable = (index) => {
    const updated = [...formData.variables];
    updated.splice(index, 1);
    setFormData({ ...formData, variables: updated });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.certificateName.trim()) newErrors.certificateName = "Required";
    if (!formData.activity) newErrors.activity = "Required";
    if (!formData.orientation) newErrors.orientation = "Required";
    if (!formData.issueDate) newErrors.issueDate = "Required";
    if (formData.variables.length === 0)
      newErrors.variables = "At least one variable is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const selectedActivity = activities.find(
        (act) => act.activity_name === formData.activity
      );

      if (!selectedActivity) {
        alert("Please select a valid activity!");
        return;
      }

      const payload = {
        activity_id: selectedActivity.activity_id,
        certificate_name: formData.certificateName,
        orientation: formData.orientation.toLowerCase(),
        issue_date: formData.issueDate || null,
        validity_date: formData.validityDate || null,
        is_active: formData.isActive,
        variables: formData.variables,
      };

      const response = await fetch(
        `${BASE_URL}/admin/certificate-templates/details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create certificate");
      }

      alert("✅ Certificate created successfully!");

      const newCard = {
        title: formData.certificateName,
        certificates: 1,
        createdDate: formData.issueDate
          ? formData.issueDate.split("-").reverse().join("-")
          : "",
      };

      onCreateDone(newCard);

      // 🚀 Navigate to Canvas Page
      navigate(`/certificate-canvas?certificate_id=${data.certificate_id}`);
    } catch (error) {
      console.error("❌ Error creating certificate:", error);
      alert(error.message || "Failed to create certificate");
    }
  };

  const handleAddActivity = async () => {
    if (!newActivityName.trim()) {
      alert("Activity name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/create-activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activity_name: newActivityName,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to add activity");

      alert("✅ Activity added successfully!");

      setShowActivityModal(false);
      setNewActivityName("");
      fetchActivities();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 flex justify-center">

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Create New Activity</h2>

            <input
              type="text"
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
              placeholder="Enter activity name"
              className="w-full p-2 border rounded border-gray-300"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowActivityModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddActivity}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl shadow-md rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Create Certificate</h2>

        {/* Certificate Name */}
        <div>
          <label className="font-medium text-gray-700">
            Certificate Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="certificateName"
            value={formData.certificateName}
            onChange={handleChange}
            className={`mt-1 w-full p-2 border rounded ${
              errors.certificateName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter certificate name"
          />
          {errors.certificateName && (
            <p className="text-red-500 text-sm">{errors.certificateName}</p>
          )}
        </div>

        {/* Activity Dropdown */}
        <div ref={dropdownRef}>
          <label className="font-medium text-gray-700">
            Activity <span className="text-red-500">*</span>
          </label>

          <div
            className={`mt-1 border rounded p-2 bg-white cursor-pointer flex justify-between items-center ${
              errors.activity ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{formData.activity || "Select an activity"}</span>
            {!dropdownOpen ? <ChevronDown /> : <ChevronUp />}
          </div>

          {dropdownOpen && (
            <div className="relative">
              <div className="absolute w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-40 overflow-y-auto z-20">

                {activities.length === 0 && (
                  <div className="p-3 text-gray-500 text-sm text-center">
                    No activities available — create one
                  </div>
                )}

                {activities.map((act, i) => (
                  <div
                    key={act.activity_id || i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData({ ...formData, activity: act.activity_name });
                      setDropdownOpen(false);
                    }}
                  >
                    {act.activity_name}
                  </div>
                ))}

                <div className="sticky bottom-0 bg-white border-t">
                  <button
                    type="button"
                    className="w-full p-2 text-blue-600 font-medium hover:bg-gray-100"
                    onClick={() => {
                      setShowActivityModal(true);
                      setDropdownOpen(false);
                    }}
                  >
                    + Create New Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {errors.activity && (
            <p className="text-red-500 text-sm">{errors.activity}</p>
          )}
        </div>

        {/* Orientation */}
        <div>
          <label className="font-medium text-gray-700">
            Orientation <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="orientation"
                value="portrait"
                checked={formData.orientation === "portrait"}
                onChange={handleChange}
              />
              Portrait
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="orientation"
                value="landscape"
                checked={formData.orientation === "landscape"}
                onChange={handleChange}
              />
              Landscape
            </label>
          </div>

          {errors.orientation && (
            <p className="text-red-500 text-sm">{errors.orientation}</p>
          )}
        </div>

        {/* Issue Date */}
        <div>
          <label className="font-medium text-gray-700">
            Issue Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className={`mt-1 w-full p-2 border rounded ${
              errors.issueDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.issueDate && (
            <p className="text-red-500 text-sm">{errors.issueDate}</p>
          )}
        </div>

        {/* Validity Date */}
        <div>
          <label className="font-medium text-gray-700">Validity Date</label>
          <input
            type="date"
            name="validityDate"
            value={formData.validityDate}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded border-gray-300"
          />
        </div>

        {/* Active */}
        <div>
          <label className="font-medium text-gray-700">Set as Active</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">
              Mark as active (optional)
            </span>
          </div>
        </div>

        {/* Variables */}
        <div>
          <label className="font-medium text-gray-700">
            Variables <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-3 mt-2">
            <input
              type="text"
              name="variableInput"
              value={formData.variableInput}
              onChange={handleChange}
              placeholder="Enter variable name"
              className={`flex-1 p-2 border rounded ${
                errors.variables ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={addVariable}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mt-3">
            {formData.variables.map((v, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
              >
                {v}
                <button
                  type="button"
                  onClick={() => removeVariable(index)}
                  className="text-red-600 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {errors.variables && (
            <p className="text-red-500 text-sm">{errors.variables}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Certificate
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;
