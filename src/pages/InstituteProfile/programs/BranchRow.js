import React,{useState} from "react";
import { MinusCircle, RefreshCcw ,PlusCircle} from "lucide-react";

const BranchRow = ({
  branch,
  branchIdx,
  availableBranches,
  onBranchChange,
  onResetBranch,
  onRemoveBranch,onAddBranch
}) => {
  const [errors, setErrors] = useState({
    hodEmail: "",
    hodPhone: "",
  });

  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  };

  const validatePhone = (value) => {
  const regex = /^\d{10}$/;
  return regex.test(value);
};

  const handleBlur = (field, value) => {
    let error = "";

    if (field === "hodEmail" && value && !validateEmail(value)) {
      error = "Invalid email format";
    } else if (field === "hodPhone" && value && !validatePhone(value)) {
      error = "Invalid phone number";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-6 border-b last:border-b-0">
      {/* Branch Details */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        {/* Branch */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Branch <span className="text-red-500">*</span></label>
          <select
            value={branch.branch || ""}
            onChange={(e) => onBranchChange('branch', e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch</option>
            {branch.branch && <option value={branch.branch}>{branch.branch}</option>}
            {availableBranches.map((branchOption) => (
              <option key={branchOption} value={branchOption}>
                {branchOption}
              </option>
            ))}
          </select>
        </div>

        {/* Intake */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Intake <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={branch.seats || ""}
            onChange={(e) => onBranchChange('seats', e.target.value)}
            placeholder="Seats"
            className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* HOD Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">HOD Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={branch.hodName || ""}
            onChange={(e) => onBranchChange('hodName', e.target.value)}
            placeholder="Enter HOD Name"
            className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* HOD Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            HOD Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={branch.hodEmail || ""}
            onChange={(e) => onBranchChange("hodEmail", e.target.value)}
            onBlur={(e) => handleBlur("hodEmail", e.target.value)}
            placeholder="Enter Email"
            className={`border rounded-lg py-2 px-3 w-full text-sm focus:ring-2 ${
              errors.hodEmail ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.hodEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.hodEmail}</p>
          )}
        </div>

        {/* HOD Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            HOD Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={branch.hodPhone || ""}
            onChange={(e) => onBranchChange("hodPhone", e.target.value)}
            onBlur={(e) => handleBlur("hodPhone", e.target.value)}
            placeholder="Enter Phone"
            className={`border rounded-lg py-2 px-3 w-full text-sm focus:ring-2 ${
              errors.hodPhone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.hodPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.hodPhone}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onAddBranch}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            title="Reset fields"
          >
            <PlusCircle size={16} />
          </button>
          <button
            onClick={onResetBranch}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            title="Reset fields"
          >
            <RefreshCcw size={16} />
          </button>
          {!branch.isDefault && (
            <button
              type="button"
              onClick={onRemoveBranch}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              title="Remove branch"
            >
              <MinusCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchRow;