import React, { useState } from "react";
import { BASE_URL } from "../../../../../services/configUrls";
import { useNavigate } from "react-router-dom";

const CreateVersionModal = ({ certificateId, token, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    orientation: "portrait",
    issueDate: "",
    validityDate: "",
    variableInput: "",
    variables: [],
    isActive: false,
  });
const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
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

  const removeVariable = (i) => {
    const updated = [...formData.variables];
    updated.splice(i, 1);
    setFormData({ ...formData, variables: updated });
  };

  const validate = () => {
    const err = {};
    if (!formData.issueDate) err.issueDate = "Required";
    if (formData.variables.length === 0)
      err.variables = "At least one variable required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

    // with canva navigation handle submit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const payload = {
    orientation: formData.orientation,
    issue_date: formData.issueDate,
    validity_date: formData.validityDate || null,
    is_active: formData.isActive,
    variables: formData.variables,
  };

  try {
    const response = await fetch(
      `${BASE_URL}/admin/add-version/${certificateId}`,
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
    if (!response.ok) throw new Error(data.detail || "Failed to add version");

    // ⭐⭐⭐ IMPORTANT ⭐⭐⭐
    // This gives version_id = 21
    const versionId = data.version_id;

    alert("Version created successfully!");

    // Send version_id to parent
    onCreated(versionId);

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

    
    
    // withoutnavigation handle submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const payload = {
//       orientation: formData.orientation,
//       issue_date: formData.issueDate,
//       validity_date: formData.validityDate || null,
//       is_active: formData.isActive,
//       variables: formData.variables,
//     };

//     try {
//       const response = await fetch(
//         `${BASE_URL}/admin/add-version/${certificateId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.detail || "Failed to add version");

//       alert("Version created successfully!");

//       onCreated({
//         orientation: payload.orientation,
//         issue_date: payload.issue_date,
//         validity_date: payload.validity_date,
//         is_active: payload.is_active,
//         variables: payload.variables,
//       });
//     } catch (err) {
//       alert(err.message);
//       console.error(err);
//     }
//   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[99999]">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl shadow-xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Create Version</h2>

        {/* Orientation */}
        <div>
          <label className="font-medium text-gray-700">Orientation</label>
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
        </div>

        {/* Issue date */}
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

        {/* Validity date */}
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            Mark as active (optional)
          </span>
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
              className={`flex-1 p-2 border rounded ${
                errors.variables ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter variable name"
            />
            <button
              type="button"
              onClick={addVariable}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {formData.variables.map((v, i) => (
              <div
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
              >
                {v}
                <button
                  type="button"
                  onClick={() => removeVariable(i)}
                  className="text-red-600"
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
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Version
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVersionModal;