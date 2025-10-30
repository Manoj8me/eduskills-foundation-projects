import { TrendingUp } from "lucide-react";

const PlacementData = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">
            Section B: Institutional Placement Data (July 2024 to Aug 2025)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Metric
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  2024–25
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  No. of Students Eligible for Placement
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    name="studentsEligible"
                    value={formData.studentsEligible || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number"
                    min="0"
                  />
                  {errors.studentsEligible && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.studentsEligible}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  No. of Students Placed
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    name="studentsPlaced"
                    value={formData.studentsPlaced || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number"
                    min="0"
                  />
                  {errors.studentsPlaced && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.studentsPlaced}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  Highest Package (₹)
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    name="highestPackage"
                    value={formData.highestPackage || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount in ₹"
                    min="0"
                  />
                  {errors.highestPackage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.highestPackage}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  Average Package (₹)
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    name="averagePackage"
                    value={formData.averagePackage || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount in ₹"
                    min="0"
                  />
                  {errors.averagePackage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.averagePackage}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  No. of Companies Visited
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    name="companiesVisited"
                    value={formData.companiesVisited || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number"
                    min="0"
                  />
                  {errors.companiesVisited && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.companiesVisited}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  No. of Internship Offers
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    name="internshipOffers"
                    value={formData.internshipOffers || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number"
                    min="0"
                  />
                  {errors.internshipOffers && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.internshipOffers}
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  No. of Startup or Govt. Placements
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    name="startupGovtPlacements"
                    value={formData.startupGovtPlacements || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number"
                    min="0"
                  />
                  {errors.startupGovtPlacements && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startupGovtPlacements}
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlacementData;
