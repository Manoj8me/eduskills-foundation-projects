import React from "react";

const AddressTab = ({ address, onChange, loading }) => {
  const handleAddressChange = (field, value) => {
    onChange({
      ...address,
      [field]: value
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-start gap-4">
        <div className="md:w-1/4">
          <label className="block font-medium text-gray-700">Address</label>
        </div>
        <div className="md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="block w-full border border-gray-300 rounded-md py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={address?.country || ""}
              onChange={(e) => handleAddressChange("country", e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>

            <input
              type="text"
              value={address?.state || ""}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              disabled={loading}
              readOnly
              placeholder="State"
              className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={address?.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              disabled={loading}
              readOnly
              placeholder="City"
              className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              value={address?.street1 || ""}
              placeholder="Street Address 1"
              className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleAddressChange("street1", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={address?.street2 || ""}
              placeholder="Street Address 2"
              className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleAddressChange("street2", e.target.value)}
            />
            <input
              type="text"
              value={address?.postalCode || ""}
              placeholder="Postal Code"
              className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleAddressChange("postalCode", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressTab;