import React, { useState } from "react";
import { Building, Filter, Search, User } from "lucide-react";

const FilterSidebar = ({
  data,
  onSelectPerson,
  selectedPerson,
  filters,
  onFilterChange,
  isVisible,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstitute =
      !filters.institute || item.institute_name === filters.institute;
    const matchesDesignation =
      !filters.designation || item.designation === filters.designation;

    return matchesSearch && matchesInstitute && matchesDesignation;
  });

  const uniqueInstitutes = [
    ...new Set(data.map((item) => item.institute_name)),
  ];
  const uniqueDesignations = [...new Set(data.map((item) => item.designation))];

  return (
    <div
      className={`w-80 bg-white rounded-xl shadow-lg p-6 h-fit transition-all duration-700 ease-in-out ${
        isVisible
          ? "transform translate-x-0 opacity-100 scale-100"
          : "transform -translate-x-full opacity-0 scale-95"
      }`}
    >
      <div className="flex items-center mb-6">
        <Filter className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">Nominees</h3>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading nominees...</div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Institute Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institute
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              value={filters.institute}
              onChange={(e) => onFilterChange("institute", e.target.value)}
            >
              <option value="">All Institutes</option>
              {uniqueInstitutes.map((institute) => (
                <option key={institute} value={institute}>
                  {institute}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">
              Results ({filteredData.length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {filteredData.map((person, index) => (
                <button
                  key={person.nomination_id}
                  onClick={() => onSelectPerson(person)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 hover:scale-102 animate-slide-in ${
                    selectedPerson?.nomination_id === person.nomination_id
                      ? "bg-blue-50 border border-blue-200 shadow-md"
                      : "hover:bg-gray-50 border border-transparent hover:shadow-sm"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="font-medium text-gray-800 text-sm">
                    {person.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <Building className="w-3 h-3 mr-1" />
                    {person.institute_name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {person.designation}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        /* Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: #64748b;
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;
